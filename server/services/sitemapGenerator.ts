import fs from 'node:fs';
import path from 'node:path';
import type { DbClient } from '../db/client.ts';
import { MarketplaceRepo } from '../db/marketplaceRepo.ts';
import type { Campaign, Product, Seller, SeoMetadataConfig } from '../../src/shared/types.ts';

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'daily' | 'weekly' | 'monthly';
  priority?: string;
}

export function escapeXml(raw: string): string {
  return String(raw)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function normalizeBaseUrl(raw?: string): string {
  const clean = (raw || process.env.APP_URL || '').trim().replace(/\/+$/, '');
  if (clean && /^https?:\/\//i.test(clean)) return clean;
  return 'https://nilelink.lb';
}

export function buildSitemapEntries(input: {
  baseUrl: string;
  products: Product[];
  sellers: Seller[];
  campaigns: Campaign[];
  seo?: SeoMetadataConfig;
}): SitemapUrlEntry[] {
  const base = normalizeBaseUrl(input.baseUrl);
  const noindexSet = new Set(
    (input.seo?.overrides || [])
      .filter((o) => o.robots?.startsWith('noindex'))
      .map((o) => `${o.entityType}:${o.entityKey}`)
  );

  const seen = new Set<string>();
  const entries: SitemapUrlEntry[] = [];

  const addPath = (
    relPath: string,
    opts?: { lastmod?: string; changefreq?: 'daily' | 'weekly' | 'monthly'; priority?: string }
  ) => {
    const normalizedPath = relPath.startsWith('/') ? relPath : `/${relPath}`;
    const loc = `${base}${normalizedPath}`;
    if (seen.has(loc)) return;
    seen.add(loc);
    entries.push({
      loc,
      lastmod: opts?.lastmod ? String(opts.lastmod).slice(0, 10) : undefined,
      changefreq: opts?.changefreq,
      priority: opts?.priority,
    });
  };

  if (!noindexSet.has('page:home')) addPath('/', { changefreq: 'daily', priority: '1.0' });
  if (!noindexSet.has('page:catalog')) addPath('/catalog', { changefreq: 'daily', priority: '0.9' });
  if (!noindexSet.has('page:stores')) addPath('/stores', { changefreq: 'daily', priority: '0.8' });
  if (!noindexSet.has('page:support')) addPath('/support', { changefreq: 'monthly', priority: '0.6' });
  if (!noindexSet.has('page:legal')) {
    addPath('/legal?tab=terms', { changefreq: 'monthly', priority: '0.4' });
    addPath('/legal?tab=privacy', { changefreq: 'monthly', priority: '0.4' });
    addPath('/legal?tab=returns', { changefreq: 'monthly', priority: '0.4' });
    addPath('/legal?tab=seller', { changefreq: 'monthly', priority: '0.4' });
  }
  addPath('/styleguide', { changefreq: 'monthly', priority: '0.3' });

  for (const c of input.campaigns) {
    if (!c.slug || noindexSet.has(`campaign:${c.slug}`)) continue;
    addPath(`/campaign/${encodeURIComponent(c.slug)}`, {
      lastmod: c.endsAt || c.startsAt || c.createdAt || undefined,
      changefreq: 'daily',
      priority: '0.8',
    });
  }

  for (const s of input.sellers) {
    if (!s.slug || noindexSet.has(`store:${s.slug}`)) continue;
    addPath(`/store/${encodeURIComponent(s.slug)}`, {
      lastmod: s.createdAt || undefined,
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  for (const p of input.products) {
    if (!p.slug || noindexSet.has(`product:${p.slug}`)) continue;
    addPath(`/product/${encodeURIComponent(p.slug)}`, {
      lastmod: p.createdAt || undefined,
      changefreq: 'daily',
      priority: '0.9',
    });
  }

  return entries;
}

export function generateSitemapXml(input: {
  baseUrl: string;
  products: Product[];
  sellers: Seller[];
  campaigns: Campaign[];
  seo?: SeoMetadataConfig;
}): string {
  const entries = buildSitemapEntries(input);
  const xmlBody = entries
    .map((e) => {
      const lm = e.lastmod ? `<lastmod>${escapeXml(e.lastmod)}</lastmod>` : '';
      const cf = e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : '';
      const pr = e.priority ? `<priority>${e.priority}</priority>` : '';
      return `  <url><loc>${escapeXml(e.loc)}</loc>${lm}${cf}${pr}</url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlBody}\n</urlset>\n`;
}

export async function crawlAndGenerateSitemap(
  db: DbClient,
  options?: { baseUrl?: string; outDirs?: string[] }
): Promise<{ xml: string; urlCount: number; writtenPaths: string[] }> {
  const repo = new MarketplaceRepo(db);
  const [products, sellers, campaigns, seo] = await Promise.all([
    repo.getPublicProducts(),
    repo.getPublicSellers(),
    repo.getActiveCampaigns(),
    repo.getSeoMetadata(),
  ]);

  const resolvedBase = normalizeBaseUrl(options?.baseUrl || seo.global.canonicalBaseUrl);
  const entries = buildSitemapEntries({ baseUrl: resolvedBase, products, sellers, campaigns, seo });
  const xml = generateSitemapXml({ baseUrl: resolvedBase, products, sellers, campaigns, seo });

  const writtenPaths: string[] = [];
  for (const dir of options?.outDirs || []) {
    const absDir = path.resolve(dir);
    fs.mkdirSync(absDir, { recursive: true });
    const outFile = path.join(absDir, 'sitemap.xml');
    fs.writeFileSync(outFile, xml, 'utf8');
    writtenPaths.push(outFile);
  }

  return { xml, urlCount: entries.length, writtenPaths };
}
