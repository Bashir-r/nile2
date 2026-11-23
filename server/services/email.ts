import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import type { DbClient, DbTx } from '../db/client.ts';
import type { EmailBlock, EmailSummaryFrequency, Locale, LocalizedText, NotificationCategory } from '../../src/shared/types.ts';
import { toSqlTimestamp } from './security.ts';

export interface EmailSendPayload {
  to: string;
  templateKey: string;
  locale?: Locale;
  vars?: Record<string, string>;
}

export interface MarketingEmailJobPayload {
  campaignId?: string | null;
  flowId?: string | null;
  to: string;
  locale: Locale;
  subject: string;
  previewText?: string;
  blocks: EmailBlock[];
  attachCouponCode?: string | null;
  unsubscribeToken?: string | null;
}

export interface EmailAdapter {
  isConfigured(): boolean;
  send(payload: { to: string; subject: string; text: string; html?: string }): Promise<{ ok: boolean; error?: string }>;
}

function getSmtpConfig() {
  const host = (process.env.SMTP_HOST || '').trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = (process.env.SMTP_USER || '').trim();
  const pass = process.env.SMTP_PASS || '';
  const from = (process.env.SMTP_FROM || 'no-reply@nilelink.lb').trim();
  return { host, port, user, pass, from };
}

class SmtpEmailAdapter implements EmailAdapter {
  isConfigured(): boolean {
    const cfg = getSmtpConfig();
    return Boolean(cfg.host && cfg.user && cfg.pass);
  }

  async send(payload: { to: string; subject: string; text: string; html?: string }): Promise<{ ok: boolean; error?: string }> {
    const cfg = getSmtpConfig();
    if (!this.isConfigured()) {
      return { ok: false, error: 'Needs my input: configure SMTP_HOST, SMTP_USER, and SMTP_PASS.' };
    }
    try {
      const transporter = nodemailer.createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.port === 465,
        auth: { user: cfg.user, pass: cfg.pass },
      });
      await transporter.sendMail({
        from: cfg.from,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  }
}

export const emailAdapter = new SmtpEmailAdapter();

function interpolate(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_match, k: string) => vars[k] ?? '');
}

export function escapeHtml(raw: string): string {
  return String(raw ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function safeEmailUrl(raw: string | undefined | null, baseUrl: string): string {
  const s = String(raw || '').trim();
  if (!s || /^\s*(javascript|data|vbscript):/i.test(s)) return baseUrl;
  if (s.startsWith('/')) return `${baseUrl}${s}`;
  if (/^https?:\/\//i.test(s)) return s;
  return baseUrl;
}

export interface EmailProductLookup {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  priceUsdCents: number;
}

export function renderEmailBlocks(
  blocks: EmailBlock[],
  opts: {
    locale: Locale;
    subject: string;
    previewText?: string;
    products?: EmailProductLookup[];
    attachCouponCode?: string | null;
    unsubscribeUrl?: string;
    appUrl?: string;
  }
): { html: string; text: string } {
  const locale = opts.locale === 'ar' ? 'ar' : 'en';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const baseUrl = (opts.appUrl || process.env.APP_URL || 'https://nilelink.lb').replace(/\/$/, '');
  const productMap = new Map((opts.products || []).map((p) => [p.id, p]));

  const textParts: string[] = [opts.subject];
  const htmlBlocks: string[] = [];

  for (const b of blocks) {
    const title = locale === 'ar' ? b.titleAr || b.titleEn || '' : b.titleEn || b.titleAr || '';
    const body = locale === 'ar' ? b.bodyAr || b.bodyEn || '' : b.bodyEn || b.bodyAr || '';
    const btnLabel = locale === 'ar' ? b.buttonLabelAr || b.buttonLabelEn || '' : b.buttonLabelEn || b.buttonLabelAr || '';

    if (b.type === 'header') {
      textParts.push(title || 'NileLink');
      htmlBlocks.push(
        `<div style="padding:20px 24px;border-bottom:1px solid #30343B;background:#17181B;">
          <div style="font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#EA580C;">NILELINK LEBANON</div>
          ${title ? `<h1 style="margin:6px 0 0;font-size:22px;line-height:1.25;color:#F3EFE8;">${escapeHtml(title)}</h1>` : ''}
        </div>`
      );
    } else if (b.type === 'hero_text') {
      if (title) textParts.push(title);
      if (body) textParts.push(body);
      const safeImg = b.imageUrl ? safeEmailUrl(b.imageUrl, baseUrl) : '';
      htmlBlocks.push(
        `<div style="padding:24px;border-bottom:1px solid #30343B;background:#222428;">
          ${safeImg && safeImg !== baseUrl ? `<img src="${escapeHtml(safeImg)}" alt="${escapeHtml(title)}" style="display:block;width:100%;max-height:280px;object-fit:cover;margin-bottom:16px;border:1px solid #30343B;" />` : ''}
          ${title ? `<h2 style="margin:0 0 10px;font-size:20px;color:#F3EFE8;">${escapeHtml(title)}</h2>` : ''}
          ${body ? `<p style="margin:0;font-size:14px;line-height:1.65;color:#C7C4BC;">${escapeHtml(body).replace(/\n/g, '<br/>')}</p>` : ''}
        </div>`
      );
    } else if (b.type === 'product_spotlight') {
      const ids = b.productIds || [];
      const cards: string[] = [];
      for (const pid of ids) {
        const prod = productMap.get(pid);
        if (!prod) continue;
        const pTitle = locale === 'ar' ? prod.titleAr : prod.titleEn;
        const pPrice = `$${(prod.priceUsdCents / 100).toFixed(2)}`;
        const pUrl = `${baseUrl}/product/${encodeURIComponent(prod.slug)}`;
        textParts.push(`${pTitle} — ${pPrice} (${pUrl})`);
        cards.push(
          `<div style="padding:14px;border:1px solid #30343B;background:#17181B;margin-bottom:10px;">
            <div style="font-size:14px;font-weight:bold;color:#F3EFE8;">${escapeHtml(pTitle)}</div>
            <div style="margin-top:4px;font-family:monospace;font-size:13px;color:#65A30D;">${escapeHtml(pPrice)}</div>
            <a href="${escapeHtml(pUrl)}" style="display:inline-block;margin-top:10px;padding:7px 14px;border:1px solid #EA580C;color:#EA580C;text-decoration:none;font-size:12px;font-weight:bold;text-transform:uppercase;">${locale === 'ar' ? 'عرض المنتج' : 'View Product'}</a>
          </div>`
        );
      }
      if (cards.length > 0 || title) {
        htmlBlocks.push(
          `<div style="padding:20px 24px;border-bottom:1px solid #30343B;background:#222428;">
            ${title ? `<h3 style="margin:0 0 12px;font-size:16px;color:#F3EFE8;">${escapeHtml(title)}</h3>` : ''}
            ${cards.join('')}
          </div>`
        );
      }
    } else if (b.type === 'coupon_box') {
      const code = (b.couponCode || opts.attachCouponCode || '').trim().toUpperCase();
      if (code) {
        textParts.push(`${title || 'Coupon'}: ${code}`);
        htmlBlocks.push(
          `<div style="padding:20px 24px;border-bottom:1px solid #30343B;background:#17181B;text-align:center;">
            ${title ? `<div style="font-size:12px;color:#C7C4BC;margin-bottom:6px;">${escapeHtml(title)}</div>` : ''}
            <div style="display:inline-block;padding:10px 20px;border:1px dashed #D97706;font-family:monospace;font-size:20px;font-weight:bold;letter-spacing:3px;color:#D97706;">${escapeHtml(code)}</div>
            ${body ? `<div style="font-size:12px;color:#9CA3AF;margin-top:8px;">${escapeHtml(body)}</div>` : ''}
          </div>`
        );
      }
    } else if (b.type === 'cta_button') {
      const href = safeEmailUrl(b.buttonUrl || '/catalog', baseUrl);
      const label = btnLabel || (locale === 'ar' ? 'تسوق الآن' : 'Shop Now');
      textParts.push(`${label}: ${href}`);
      htmlBlocks.push(
        `<div style="padding:22px 24px;border-bottom:1px solid #30343B;background:#222428;text-align:center;">
          <a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 28px;background:#EA580C;color:#17181B;text-decoration:none;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">${escapeHtml(label)}</a>
        </div>`
      );
    } else if (b.type === 'divider_footer') {
      if (body) textParts.push(body);
      htmlBlocks.push(
        `<div style="padding:16px 24px;background:#17181B;font-size:12px;color:#9CA3AF;line-height:1.5;">
          ${body ? escapeHtml(body) : escapeHtml(locale === 'ar' ? 'نيل لينك — سوق لبنان متعدد البائعين' : 'NileLink — Lebanese Multi-Vendor Marketplace')}
        </div>`
      );
    }
  }

  if (opts.attachCouponCode && !blocks.some((b) => b.type === 'coupon_box')) {
    const code = opts.attachCouponCode.trim().toUpperCase();
    textParts.push(`Promo Code: ${code}`);
    htmlBlocks.push(
      `<div style="padding:18px 24px;border-bottom:1px solid #30343B;background:#17181B;text-align:center;">
        <div style="display:inline-block;padding:8px 18px;border:1px dashed #D97706;font-family:monospace;font-size:18px;font-weight:bold;color:#D97706;">${escapeHtml(code)}</div>
      </div>`
    );
  }

  const unsubUrl = opts.unsubscribeUrl || `${baseUrl}/legal`;
  textParts.push(`${locale === 'ar' ? 'لإلغاء الاشتراك:' : 'Unsubscribe:'} ${unsubUrl}`);

  const html = `<!doctype html>
<html lang="${locale}" dir="${dir}">
  <body style="margin:0;padding:24px 12px;background:#111215;font-family:Arial,Helvetica,sans-serif;color:#F3EFE8;">
    ${opts.previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(opts.previewText)}</div>` : ''}
    <div style="max-width:600px;margin:0 auto;border:1px solid #30343B;background:#222428;">
      ${htmlBlocks.join('\n')}
      <div style="padding:16px 24px;background:#17181B;border-top:1px solid #30343B;font-size:11px;color:#9CA3AF;text-align:center;">
        <a href="${escapeHtml(unsubUrl)}" style="color:#9CA3AF;text-decoration:underline;">
          ${locale === 'ar' ? 'إلغاء الاشتراك من رسائل التسويق' : 'Unsubscribe from marketing emails'}
        </a>
      </div>
    </div>
  </body>
</html>`;

  return { html, text: textParts.join('\n\n') };
}

export async function queueEmail(db: DbTx, payload: EmailSendPayload): Promise<void> {
  await db.execute(
    'INSERT INTO jobs (id, job_type, payload_json, status, attempts, run_at, created_at) VALUES (?, ?, ?, ?, 0, ?, ?)',
    [
      `job-${crypto.randomUUID()}`,
      'send_email',
      JSON.stringify(payload),
      'queued',
      toSqlTimestamp(),
      toSqlTimestamp(),
    ]
  );
}

export async function processEmailJob(db: DbClient, payload: EmailSendPayload): Promise<void> {
  const keyCol = db.driver === 'mysql' ? '`key`' : 'key';
  const tplRow = await db.queryOne<{ subject_json: string; body_json: string }>(
    `SELECT subject_json, body_json FROM email_templates WHERE ${keyCol} = ?`,
    [payload.templateKey]
  );

  const locale = payload.locale === 'ar' ? 'ar' : 'en';
  const vars = payload.vars || {};
  let subject = `NileLink Notification (${payload.templateKey})`;
  let body = '';

  if (tplRow) {
    const subJson = typeof tplRow.subject_json === 'string' ? JSON.parse(tplRow.subject_json) : tplRow.subject_json;
    const bodJson = typeof tplRow.body_json === 'string' ? JSON.parse(tplRow.body_json) : tplRow.body_json;
    subject = interpolate(String(subJson?.[locale] || subJson?.en || subject), vars);
    body = interpolate(String(bodJson?.[locale] || bodJson?.en || ''), vars);
  }

  const res = await emailAdapter.send({ to: payload.to, subject, text: body });
  await db.execute(
    'INSERT INTO email_log (id, recipient_email, template_key, status, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [
      `eml-${crypto.randomUUID()}`,
      payload.to,
      payload.templateKey,
      res.ok ? 'sent' : emailAdapter.isConfigured() ? 'failed' : 'unconfigured',
      res.error || null,
      toSqlTimestamp(),
    ]
  );
}

export async function processMarketingEmailJob(db: DbClient, payload: MarketingEmailJobPayload): Promise<void> {
  const emailNorm = String(payload.to || '').trim().toLowerCase();
  if (!emailNorm) return;

  // Enforce opt-out status before sending any marketing email
  const subRow = await db.queryOne<{ status: string; unsubscribe_token: string }>(
    'SELECT status, unsubscribe_token FROM newsletter_subscribers WHERE LOWER(email) = ? LIMIT 1',
    [emailNorm]
  );
  if (subRow && subRow.status === 'unsubscribed') {
    if (payload.campaignId) {
      await db.execute(
        'UPDATE email_campaigns SET unsubscribed_count = unsubscribed_count + 1 WHERE id = ?',
        [payload.campaignId]
      );
    }
    return;
  }

  // Hydrate referenced products for product_spotlight blocks
  const productIds = new Set<string>();
  for (const b of payload.blocks || []) {
    for (const pid of b.productIds || []) productIds.add(pid);
  }
  const products: EmailProductLookup[] = [];
  if (productIds.size > 0) {
    const placeholders = Array.from(productIds).map(() => '?').join(', ');
    const rows = await db.query<{ id: string; slug: string; title_json: string; base_price_usd_cents: number }>(
      `SELECT id, slug, title_json, base_price_usd_cents FROM products WHERE id IN (${placeholders})`,
      Array.from(productIds)
    );
    for (const r of rows) {
      const tj = typeof r.title_json === 'string' ? JSON.parse(r.title_json) : r.title_json;
      products.push({
        id: r.id,
        slug: r.slug,
        titleEn: String(tj?.en || 'Product'),
        titleAr: String(tj?.ar || tj?.en || 'منتج'),
        priceUsdCents: Number(r.base_price_usd_cents || 0),
      });
    }
  }

  const baseUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  const token = payload.unsubscribeToken || subRow?.unsubscribe_token || '';
  const unsubscribeUrl = token ? `${baseUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}` : `${baseUrl}/legal`;

  const rendered = renderEmailBlocks(payload.blocks || [], {
    locale: payload.locale || 'en',
    subject: payload.subject,
    previewText: payload.previewText,
    products,
    attachCouponCode: payload.attachCouponCode,
    unsubscribeUrl,
    appUrl: baseUrl,
  });

  const res = await emailAdapter.send({
    to: emailNorm,
    subject: payload.subject,
    text: rendered.text,
    html: rendered.html,
  });

  const tplKey = payload.campaignId ? `campaign:${payload.campaignId}` : payload.flowId ? `flow:${payload.flowId}` : 'marketing';
  await db.execute(
    'INSERT INTO email_log (id, recipient_email, template_key, status, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [
      `eml-${crypto.randomUUID()}`,
      emailNorm,
      tplKey.slice(0, 64),
      res.ok ? 'sent' : emailAdapter.isConfigured() ? 'failed' : 'unconfigured',
      res.error || null,
      toSqlTimestamp(),
    ]
  );

  if (payload.campaignId) {
    if (res.ok) {
      await db.execute('UPDATE email_campaigns SET sent_count = sent_count + 1 WHERE id = ?', [payload.campaignId]);
    } else {
      await db.execute('UPDATE email_campaigns SET failed_count = failed_count + 1 WHERE id = ?', [payload.campaignId]);
    }
  }
  if (payload.flowId && res.ok) {
    await db.execute('UPDATE automation_flows SET total_sent = total_sent + 1 WHERE id = ?', [payload.flowId]);
  }
}

export interface NotificationSummaryEntry {
  id: string;
  category: NotificationCategory;
  title: LocalizedText;
  body: LocalizedText;
  actionUrl?: string | null;
  createdAt: string;
}

export interface NotificationSummaryResult {
  ok: boolean;
  sentCount: number;
  status: 'sent' | 'unconfigured' | 'failed' | 'empty';
  error?: string;
  previewSubject: string;
  previewText: string;
  lastSummarySentAt: string | null;
}

const CATEGORY_LABELS: Record<NotificationCategory, { en: string; ar: string; color: string }> = {
  order: { en: 'Order Status Updates', ar: 'تحديثات حالة الطلبات', color: '#06B6D4' },
  price_drop: { en: 'Wishlisted Price Drops', ar: 'انخفاض أسعار المفضلة', color: '#65A30D' },
  promo: { en: 'Promotional Offers', ar: 'العروض الترويجية', color: '#EA580C' },
  system: { en: 'Marketplace Updates', ar: 'تحديثات المنصة', color: '#D97706' },
};

export function renderNotificationSummaryEmail(opts: {
  userName: string;
  locale: Locale;
  frequency?: EmailSummaryFrequency;
  appUrl?: string;
  notifications: NotificationSummaryEntry[];
}): { subject: string; html: string; text: string } {
  const locale: Locale = opts.locale === 'ar' ? 'ar' : 'en';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const baseUrl = (opts.appUrl || process.env.APP_URL || 'https://nilelink.lb').replace(/\/$/, '');
  const count = opts.notifications.length;
  const freqLabel =
    opts.frequency === 'instant'
      ? locale === 'ar'
        ? 'تنبيه فوري'
        : 'Instant Alert'
      : opts.frequency === 'weekly'
        ? locale === 'ar'
          ? 'الملخص الأسبوعي'
          : 'Weekly Summary'
        : locale === 'ar'
          ? 'الملخص اليومي'
          : 'Daily Summary';

  const subject =
    locale === 'ar'
      ? `نايل لينك — ${freqLabel} (${count} ${count === 1 ? 'إشعار' : 'إشعارات'})`
      : `NileLink ${freqLabel} · ${count} ${count === 1 ? 'update' : 'updates'}`;

  const grouped = new Map<NotificationCategory, NotificationSummaryEntry[]>();
  for (const n of opts.notifications) {
    const cat: NotificationCategory = n.category || 'system';
    const arr = grouped.get(cat) || [];
    arr.push(n);
    grouped.set(cat, arr);
  }

  const orderOrder: NotificationCategory[] = ['order', 'price_drop', 'promo', 'system'];
  const textSections: string[] = [
    locale === 'ar'
      ? `مرحباً ${opts.userName}، إليك ملخص إشعاراتك على نايل لينك:`
      : `Hello ${opts.userName}, here is your NileLink notifications digest:`,
  ];
  const htmlSections: string[] = [];

  for (const cat of orderOrder) {
    const items = grouped.get(cat);
    if (!items || items.length === 0) continue;
    const labelMeta = CATEGORY_LABELS[cat];
    const heading = locale === 'ar' ? labelMeta.ar : labelMeta.en;
    textSections.push(`\n## ${heading}`);
    const itemCards: string[] = [];

    for (const item of items) {
      const title = locale === 'ar' ? item.title.ar || item.title.en : item.title.en || item.title.ar;
      const body = locale === 'ar' ? item.body.ar || item.body.en : item.body.en || item.body.ar;
      const href = safeEmailUrl(item.actionUrl || '/account?tab=notifications', baseUrl);
      textSections.push(`- ${title}: ${body} (${href})`);
      itemCards.push(
        `<div style="padding:12px 14px;border:1px solid #30343B;background:#17181B;margin-bottom:8px;">
          <div style="font-size:14px;font-weight:bold;color:#F3EFE8;">${escapeHtml(title)}</div>
          <div style="margin-top:4px;font-size:13px;line-height:1.5;color:#C7C4BC;">${escapeHtml(body)}</div>
          <div style="margin-top:8px;">
            <a href="${escapeHtml(href)}" style="font-size:11px;font-weight:bold;text-transform:uppercase;color:${labelMeta.color};text-decoration:none;border-bottom:1px solid ${labelMeta.color};">${
          locale === 'ar' ? 'عرض التفاصيل' : 'Open Details'
        }</a>
          </div>
        </div>`
      );
    }

    htmlSections.push(
      `<div style="padding:18px 24px;border-bottom:1px solid #30343B;background:#222428;">
        <div style="font-family:monospace;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:${labelMeta.color};margin-bottom:10px;">
          ${escapeHtml(heading)} (${items.length})
        </div>
        ${itemCards.join('')}
      </div>`
    );
  }

  const prefsUrl = `${baseUrl}/account?tab=notifications`;
  textSections.push(
    locale === 'ar' ? `\nإدارة تفضيلات الإشعارات: ${prefsUrl}` : `\nManage notification preferences: ${prefsUrl}`
  );

  const html = `<!doctype html>
<html lang="${locale}" dir="${dir}">
  <body style="margin:0;padding:24px 12px;background:#111215;font-family:Arial,Helvetica,sans-serif;color:#F3EFE8;">
    <div style="max-width:600px;margin:0 auto;border:1px solid #30343B;background:#222428;">
      <div style="padding:20px 24px;border-bottom:1px solid #30343B;background:#17181B;">
        <div style="font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#EA580C;">NILELINK LEBANON · ${escapeHtml(freqLabel)}</div>
        <h1 style="margin:6px 0 0;font-size:20px;line-height:1.3;color:#F3EFE8;">${escapeHtml(
          locale === 'ar' ? `مرحباً ${opts.userName}` : `Hello ${opts.userName}`
        )}</h1>
      </div>
      ${htmlSections.join('\n')}
      <div style="padding:16px 24px;background:#17181B;font-size:11px;color:#9CA3AF;text-align:center;">
        <a href="${escapeHtml(prefsUrl)}" style="color:#C7C4BC;text-decoration:underline;">
          ${locale === 'ar' ? 'تعديل تفضيلات البريد الإلكتروني والإشعارات' : 'Manage Email Digest & Notification Preferences'}
        </a>
      </div>
    </div>
  </body>
</html>`;

  return { subject, html, text: textSections.join('\n') };
}

export async function sendNotificationSummaryForUser(
  db: DbClient,
  userId: string,
  opts: { force?: boolean; singleNotificationId?: string } = {}
): Promise<NotificationSummaryResult> {
  const user = await db.queryOne<{
    id: string;
    name: string;
    email: string;
    preferred_locale: string;
    deleted_at: string | null;
    is_blocked: number | boolean;
  }>(
    'SELECT id, name, email, preferred_locale, deleted_at, is_blocked FROM users WHERE id = ? LIMIT 1',
    [userId]
  );
  if (!user || user.deleted_at || user.is_blocked || !user.email) {
    return {
      ok: false,
      sentCount: 0,
      status: 'empty',
      error: 'Active user email not found.',
      previewSubject: '',
      previewText: '',
      lastSummarySentAt: null,
    };
  }

  const prefRow = await db.queryOne<{
    email_summary_enabled: number | boolean;
    summary_frequency: string;
    order_updates: number | boolean;
    price_drops: number | boolean;
    promotional_offers: number | boolean;
    last_summary_sent_at: string | null;
  }>('SELECT * FROM notification_preferences WHERE user_id = ?', [userId]);

  const frequency = (prefRow?.summary_frequency || 'daily') as EmailSummaryFrequency;
  const emailEnabled = prefRow ? Boolean(prefRow.email_summary_enabled) : true;
  if (!opts.force && (!emailEnabled || frequency === 'off')) {
    return {
      ok: true,
      sentCount: 0,
      status: 'empty',
      previewSubject: '',
      previewText: '',
      lastSummarySentAt: prefRow?.last_summary_sent_at ? String(prefRow.last_summary_sent_at) : null,
    };
  }

  let rows: Array<{
    id: string;
    category: string;
    title_json: string;
    body_json: string;
    action_url: string | null;
    created_at: string;
  }> = [];

  if (opts.singleNotificationId) {
    rows = await db.query(
      'SELECT id, category, title_json, body_json, action_url, created_at FROM notifications WHERE id = ? AND user_id = ? LIMIT 1',
      [opts.singleNotificationId, userId]
    );
  } else {
    rows = await db.query(
      'SELECT id, category, title_json, body_json, action_url, created_at FROM notifications WHERE user_id = ? AND emailed_at IS NULL AND read_at IS NULL ORDER BY created_at DESC LIMIT 25',
      [userId]
    );
    if (rows.length === 0 && opts.force) {
      rows = await db.query(
        'SELECT id, category, title_json, body_json, action_url, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 15',
        [userId]
      );
    }
  }

  const allowOrder = prefRow ? Boolean(prefRow.order_updates) : true;
  const allowPriceDrop = prefRow ? Boolean(prefRow.price_drops) : true;
  const allowPromo = prefRow ? Boolean(prefRow.promotional_offers) : true;

  const entries: NotificationSummaryEntry[] = [];
  for (const r of rows) {
    const cat = (r.category || 'system') as NotificationCategory;
    if (!opts.force) {
      if (cat === 'order' && !allowOrder) continue;
      if (cat === 'price_drop' && !allowPriceDrop) continue;
      if (cat === 'promo' && !allowPromo) continue;
    }
    const tj = typeof r.title_json === 'string' ? JSON.parse(r.title_json) : r.title_json;
    const bj = typeof r.body_json === 'string' ? JSON.parse(r.body_json) : r.body_json;
    entries.push({
      id: r.id,
      category: cat,
      title: { en: String(tj?.en || ''), ar: String(tj?.ar || tj?.en || '') },
      body: { en: String(bj?.en || ''), ar: String(bj?.ar || bj?.en || '') },
      actionUrl: r.action_url ? String(r.action_url) : null,
      createdAt: String(r.created_at),
    });
  }

  if (entries.length === 0) {
    return {
      ok: true,
      sentCount: 0,
      status: 'empty',
      previewSubject: '',
      previewText: '',
      lastSummarySentAt: prefRow?.last_summary_sent_at ? String(prefRow.last_summary_sent_at) : null,
    };
  }

  const locale: Locale = user.preferred_locale === 'ar' ? 'ar' : 'en';
  const rendered = renderNotificationSummaryEmail({
    userName: user.name,
    locale,
    frequency: opts.singleNotificationId ? 'instant' : frequency,
    notifications: entries,
  });

  const sendRes = await emailAdapter.send({
    to: user.email,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
  });

  const status: 'sent' | 'unconfigured' | 'failed' = sendRes.ok
    ? 'sent'
    : emailAdapter.isConfigured()
      ? 'failed'
      : 'unconfigured';
  const now = toSqlTimestamp();

  await db.execute(
    'INSERT INTO email_log (id, recipient_email, template_key, status, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [
      `eml-${crypto.randomUUID()}`,
      user.email,
      'notification_summary',
      status,
      sendRes.error || null,
      now,
    ]
  );

  if (sendRes.ok || opts.force) {
    const placeholders = entries.map(() => '?').join(', ');
    await db.execute(`UPDATE notifications SET emailed_at = ? WHERE id IN (${placeholders})`, [
      now,
      ...entries.map((e) => e.id),
    ]);
    await db.execute(
      `INSERT INTO notification_preferences (user_id, email_summary_enabled, summary_frequency, order_updates, price_drops, promotional_offers, last_summary_sent_at, updated_at)
       VALUES (?, 1, ?, 1, 1, 1, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET last_summary_sent_at = excluded.last_summary_sent_at, updated_at = excluded.updated_at`,
      [userId, frequency, now, now]
    ).catch(async () => {
      // MySQL syntax fallback
      await db.execute(
        `INSERT INTO notification_preferences (user_id, email_summary_enabled, summary_frequency, order_updates, price_drops, promotional_offers, last_summary_sent_at, updated_at)
         VALUES (?, 1, ?, 1, 1, 1, ?, ?)
         ON DUPLICATE KEY UPDATE last_summary_sent_at = VALUES(last_summary_sent_at), updated_at = VALUES(updated_at)`,
        [userId, frequency, now, now]
      );
    });
  }

  return {
    ok: sendRes.ok,
    sentCount: entries.length,
    status,
    error: sendRes.error,
    previewSubject: rendered.subject,
    previewText: rendered.text,
    lastSummarySentAt: now,
  };
}

export async function dispatchDueNotificationDigests(db: DbClient): Promise<number> {
  const candidates = await db.query<{ user_id: string }>(
    `SELECT DISTINCT n.user_id
     FROM notifications n
     LEFT JOIN notification_preferences np ON np.user_id = n.user_id
     INNER JOIN users u ON u.id = n.user_id
     WHERE n.emailed_at IS NULL
       AND n.read_at IS NULL
       AND u.deleted_at IS NULL
       AND u.is_blocked = 0
       AND COALESCE(np.email_summary_enabled, 1) = 1
       AND COALESCE(np.summary_frequency, 'daily') IN ('daily', 'weekly')
     LIMIT 30`
  );

  let dispatched = 0;
  const nowMs = Date.now();
  for (const row of candidates) {
    const pref = await db.queryOne<{ summary_frequency: string; last_summary_sent_at: string | null }>(
      'SELECT summary_frequency, last_summary_sent_at FROM notification_preferences WHERE user_id = ?',
      [row.user_id]
    );
    const freq = pref?.summary_frequency || 'daily';
    const minAgeMs = freq === 'weekly' ? 6.9 * 86_400_000 : 23 * 3_600_000;
    const lastMs = pref?.last_summary_sent_at ? Date.parse(pref.last_summary_sent_at) : 0;
    if (lastMs && nowMs - lastMs < minAgeMs) continue;

    const res = await sendNotificationSummaryForUser(db, row.user_id, { force: false });
    if (res.sentCount > 0) dispatched++;
  }
  return dispatched;
}

