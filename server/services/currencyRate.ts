import type { DbClient } from '../db/client.ts';
import { toSqlTimestamp, writeAuditLog } from './security.ts';
import type { PlatformSettings } from '../../src/shared/types.ts';

const DAY_MS = 86_400_000;
const FETCH_TIMEOUT_MS = 6_000;

export interface FxRateFetchResult {
  rate: number;
  source: string;
  fetchedAt: string;
}

/**
 * Parses and validates an upstream FX JSON response into a sane integer USD->LBP rate.
 * Bounds protect against corrupted API payloads or extreme spikes outside plausible market bounds.
 */
export function parseUsdToLbpPayload(payload: unknown): number | null {
  if (!payload || typeof payload !== 'object') return null;
  const obj = payload as Record<string, unknown>;
  let raw: unknown = undefined;

  if (obj.rates && typeof obj.rates === 'object') {
    const rates = obj.rates as Record<string, unknown>;
    raw = rates.LBP ?? rates.lbp;
  } else if (obj.usd && typeof obj.usd === 'object') {
    const usd = obj.usd as Record<string, unknown>;
    raw = usd.lbp ?? usd.LBP;
  } else if (typeof obj.rate === 'number' || typeof obj.rate === 'string') {
    raw = obj.rate;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return null;
  const rounded = Math.round(parsed);
  if (rounded < 1500 || rounded > 500_000) return null;
  return rounded;
}

async function fetchJsonWithTimeout(url: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Queries real-time FX providers for live USD -> LBP conversion rate.
 * Supports optional FX_API_URL override and automatic multi-provider fallback.
 */
export async function fetchLiveLbpRate(): Promise<FxRateFetchResult> {
  const customUrl = (process.env.FX_API_URL || '').trim();
  const candidates: Array<{ url: string; label: string }> = [
    ...(customUrl ? [{ url: customUrl, label: 'custom-fx-api' }] : []),
    { url: 'https://open.er-api.com/v6/latest/USD', label: 'open.er-api.com' },
    {
      url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      label: 'fawazahmed0/currency-api',
    },
  ];

  let lastError = 'All FX providers unreachable';
  for (const provider of candidates) {
    try {
      const payload = await fetchJsonWithTimeout(provider.url);
      const rate = parseUsdToLbpPayload(payload);
      if (rate !== null) {
        return {
          rate,
          source: provider.label,
          fetchedAt: new Date().toISOString(),
        };
      }
      lastError = `${provider.label}: LBP rate missing or out of bounds`;
    } catch (err) {
      lastError = `${provider.label}: ${(err as Error).message}`;
    }
  }

  throw new Error(`Unable to fetch live LBP rate (${lastError})`);
}

/**
 * Synchronizes platform LBP conversion rate at most once per 24h (unless forced).
 * Keeps manual admin overrides intact if fxAutoSyncEnabled === false (unless forced).
 */
export async function syncDailyLbpRate(
  db: DbClient,
  options: { force?: boolean; actorUserId?: string; ipAddress?: string } = {}
): Promise<{
  updated: boolean;
  skippedReason?: string;
  rate: number;
  source: string;
  lastUpdatedAt: string | null;
}> {
  const kCol = db.driver === 'mysql' ? '`key`' : 'key';
  const row = await db.queryOne<{ value_json: string }>(`SELECT value_json FROM settings WHERE ${kCol} = 'platform'`);
  if (!row) {
    return { updated: false, skippedReason: 'missing_settings', rate: 89500, source: 'default', lastUpdatedAt: null };
  }

  let current: PlatformSettings;
  try {
    current = JSON.parse(row.value_json) as PlatformSettings;
  } catch {
    return { updated: false, skippedReason: 'invalid_settings_json', rate: 89500, source: 'default', lastUpdatedAt: null };
  }

  const autoEnabled = current.fxAutoSyncEnabled !== false;
  if (!options.force && !autoEnabled) {
    return {
      updated: false,
      skippedReason: 'auto_sync_disabled',
      rate: current.exchangeRateLbpPerUsd,
      source: current.fxSource || 'manual',
      lastUpdatedAt: current.fxLastUpdatedAt || null,
    };
  }

  const lastMs = current.fxLastUpdatedAt ? Date.parse(current.fxLastUpdatedAt) : 0;
  if (!options.force && lastMs > 0 && Date.now() - lastMs < DAY_MS) {
    return {
      updated: false,
      skippedReason: 'fresh_within_24h',
      rate: current.exchangeRateLbpPerUsd,
      source: current.fxSource || 'cached',
      lastUpdatedAt: current.fxLastUpdatedAt || null,
    };
  }

  try {
    const live = await fetchLiveLbpRate();
    const nextSettings: PlatformSettings = {
      ...current,
      exchangeRateLbpPerUsd: live.rate,
      fxLastUpdatedAt: live.fetchedAt,
      fxSource: live.source,
      fxAutoSyncEnabled: autoEnabled,
    };

    await db.execute(`UPDATE settings SET value_json = ?, updated_at = ? WHERE ${kCol} = 'platform'`, [
      JSON.stringify(nextSettings),
      toSqlTimestamp(),
    ]);

    if (live.rate !== current.exchangeRateLbpPerUsd || options.force) {
      await writeAuditLog(db, {
        actorUserId: options.actorUserId || null,
        action: 'fx.daily_sync',
        entityType: 'settings',
        entityId: 'platform',
        before: { exchangeRateLbpPerUsd: current.exchangeRateLbpPerUsd, fxSource: current.fxSource },
        after: { exchangeRateLbpPerUsd: live.rate, fxSource: live.source, fxLastUpdatedAt: live.fetchedAt },
        ipAddress: options.ipAddress,
      });
    }

    return {
      updated: true,
      rate: live.rate,
      source: live.source,
      lastUpdatedAt: live.fetchedAt,
    };
  } catch (err) {
    return {
      updated: false,
      skippedReason: (err as Error).message,
      rate: current.exchangeRateLbpPerUsd,
      source: current.fxSource || 'fallback-cached',
      lastUpdatedAt: current.fxLastUpdatedAt || null,
    };
  }
}
