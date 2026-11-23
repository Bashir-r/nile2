import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { normalizeSearchText, searchMarketplaceEntities } from '../../src/shared/fuzzySearch.ts';
import { renderNotificationSummaryEmail } from '../../server/services/email.ts';
import { MarketplaceRepo } from '../../server/db/marketplaceRepo.ts';
import type { DbClient, DbTx } from '../../server/db/client.ts';
import type { Category, Product, Seller } from '../../src/shared/types.ts';

const sampleCategories: Category[] = [
  {
    id: 'cat-elec',
    slug: 'electronics',
    department: 'electronics',
    name: { en: 'Studio Audio & Electronics', ar: 'صوتيات وإلكترونيات استوديو' },
  },
  {
    id: 'cat-fash',
    slug: 'fashion',
    department: 'fashion',
    name: { en: 'Mediterranean Linen & Fashion', ar: 'أزياء وكتان متوسطي' },
  },
];

const sampleSellers: Seller[] = [
  {
    id: 'sel-cedar',
    userId: 'u-sel-1',
    slug: 'cedar-acoustics',
    name: { en: 'Cedar Acoustics Beirut', ar: 'سيدار للصوتيات بيروت' },
    tagline: { en: 'Independent audio engineers in Hamra', ar: 'مهندسو صوت مستقلون في الحمرا' },
    about: { en: 'Precision studio audio built in Beirut.', ar: 'صوتيات استوديو دقيقة من بيروت.' },
    department: 'electronics',
    governorate: 'Beirut',
    district: 'Hamra',
    whatsappPhone: '+96170111222',
    payoutMethod: 'whish',
    payoutAccount: '+96170111222',
    commercialRegRef: 'LB-COM-101',
    deliveryMode: 'self',
    selfDeliveryFeesUsdCents: { beirut: 300 },
    storefrontTheme: 'cyan-lab',
    bannerImage: '',
    verified: true,
    status: 'approved',
    subscriptionTier: 'pro',
    subscriptionStatus: 'active',
    subscriptionNextDue: '2026-12-01',
    rating: 4.9,
    reviewCount: 42,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

const sampleProducts: Product[] = [
  {
    id: 'prod-headphones',
    sellerId: 'sel-cedar',
    categoryId: 'cat-elec',
    department: 'electronics',
    slug: 'studio-reference-headphones',
    title: { en: 'Studio Reference Wireless Headphones', ar: 'سَمَاعَة أستوديو لاسلكية احترافية' },
    subtitle: { en: 'Closed-back USB-C & Bluetooth monitoring', ar: 'عزل صوتي دقيق ومراقبة استوديو' },
    description: { en: 'Balanced planar drivers', ar: 'مشغلات صوتية متوازنة' },
    specs: [{ key: { en: 'Driver', ar: 'المشغل' }, value: { en: '50mm Planar', ar: '50 مم بلانار' } }],
    basePriceUsdCents: 14900,
    compareAtUsdCents: 17900,
    sellerCurrency: 'USD',
    images: ['/uploads/headphones.jpg'],
    rating: 4.8,
    reviewCount: 24,
    published: true,
    tags: ['wireless', 'studio', 'headphones'],
    variants: [
      { id: 'var-1', sku: 'CED-HP-BLK', color: 'Obsidian Black', colorHex: '#18181B', stock: 8, priceDeltaUsdCents: 0 },
    ],
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'prod-linen',
    sellerId: 'sel-cedar',
    categoryId: 'cat-fash',
    department: 'fashion',
    slug: 'beirut-linen-overshirt',
    title: { en: 'Beirut Linen Overshirt', ar: 'قميص كتان بيروتي' },
    subtitle: { en: 'Breathable summer weave', ar: 'نسيج صيفي مريح' },
    description: { en: 'Stone-washed linen', ar: 'كتان مغسول بالحجر' },
    specs: [],
    basePriceUsdCents: 6500,
    compareAtUsdCents: null,
    sellerCurrency: 'USD',
    images: [],
    rating: 4.6,
    reviewCount: 10,
    published: true,
    tags: ['linen', 'fashion'],
    variants: [
      { id: 'var-2', sku: 'FASH-LN-42', size: '42', color: 'Bone', colorHex: '#F3EFE8', stock: 12, priceDeltaUsdCents: 0 },
    ],
    createdAt: '2026-01-01T00:00:00Z',
  },
];

test('normalizeSearchText normalizes Arabic diacritics, hamza, taa-marbuta, and numerals', () => {
  assert.equal(normalizeSearchText('سَمَاعَةُ الأُذُنِ — ٢٥'), 'سماعه الاذن 25');
  assert.equal(normalizeSearchText('أجهزة إلكترونية'), 'اجهزه الكترونيه');
  assert.equal(normalizeSearchText('  Hamra,  BEIRUT!  '), 'hamra beirut');
});

test('fuzzy search handles English typos, Arabic normalized queries, stores, and categories', () => {
  // Typo in English product title ("headphnoes")
  const typoProd = searchMarketplaceEntities({
    query: 'headphnoes',
    products: sampleProducts,
    sellers: sampleSellers,
    categories: sampleCategories,
    locale: 'en',
  });
  assert.equal(typoProd.products[0]?.id, 'prod-headphones');

  // Arabic query without diacritics/hamza differences matching Arabic title with tashkeel & ه/ة
  const arabicProd = searchMarketplaceEntities({
    query: 'سماعه استوديو',
    products: sampleProducts,
    sellers: sampleSellers,
    categories: sampleCategories,
    locale: 'ar',
  });
  assert.equal(arabicProd.products[0]?.id, 'prod-headphones');

  // Store fuzzy match with typo ("Beruit") + Arabic store query ("سيدار")
  const storeEn = searchMarketplaceEntities({
    query: 'Acoustcs Beruit',
    products: sampleProducts,
    sellers: sampleSellers,
    categories: sampleCategories,
    locale: 'en',
  });
  assert.equal(storeEn.stores[0]?.id, 'sel-cedar');

  const storeAr = searchMarketplaceEntities({
    query: 'سيدار بيروت',
    products: sampleProducts,
    sellers: sampleSellers,
    categories: sampleCategories,
    locale: 'ar',
  });
  assert.equal(storeAr.stores[0]?.id, 'sel-cedar');

  // Category search in Arabic ("ازياء")
  const catAr = searchMarketplaceEntities({
    query: 'ازياء كتان',
    products: sampleProducts,
    sellers: sampleSellers,
    categories: sampleCategories,
    locale: 'ar',
  });
  assert.equal(catAr.categories[0]?.id, 'cat-fash');
});

test('renderNotificationSummaryEmail groups categories cleanly and prevents XSS / unsafe URLs', () => {
  const rendered = renderNotificationSummaryEmail({
    userName: 'Karim <script>alert(1)</script>',
    locale: 'ar',
    frequency: 'daily',
    appUrl: 'https://nilelink.lb',
    notifications: [
      {
        id: 'n1',
        category: 'order',
        title: { en: 'Order shipped', ar: 'تم شحن طلبك' },
        body: { en: 'Shipped', ar: 'تم الشحن مع المندوب' },
        actionUrl: '/orders',
        createdAt: '2026-11-23T09:00:00Z',
      },
      {
        id: 'n2',
        category: 'price_drop',
        title: { en: 'Price drop', ar: 'انخفاض السعر <img src=x onerror=alert(1)>' },
        body: { en: 'Dropped', ar: 'انخفض السعر إلى $99' },
        actionUrl: 'javascript:alert(1)',
        createdAt: '2026-11-23T09:05:00Z',
      },
      {
        id: 'n3',
        category: 'promo',
        title: { en: 'Flash Sale', ar: 'عرض خاص' },
        body: { en: '25% off', ar: 'خصم 25%' },
        actionUrl: '/catalog?deals=true',
        createdAt: '2026-11-23T09:10:00Z',
      },
    ],
  });

  assert.ok(rendered.html.includes('dir="rtl"'));
  assert.ok(!rendered.html.includes('<script>'));
  assert.ok(!rendered.html.includes('<img src=x'));
  assert.ok(!rendered.html.includes('javascript:alert'));
  assert.ok(rendered.html.includes('&lt;script&gt;'));
  assert.ok(rendered.html.includes('https://nilelink.lb/orders'));
  assert.ok(rendered.html.includes('https://nilelink.lb/catalog?deals=true'));
  assert.ok(rendered.text.includes('تحديثات حالة الطلبات'));
  assert.ok(rendered.text.includes('انخفاض أسعار المفضلة'));
  assert.ok(rendered.text.includes('العروض الترويجية'));
});

function createMemorySqliteDb(): DbClient {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(`
    CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, role_key TEXT NOT NULL DEFAULT 'customer', preferred_locale TEXT NOT NULL DEFAULT 'en', deleted_at TEXT, is_blocked INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE stores (id TEXT PRIMARY KEY, seller_id TEXT NOT NULL, name_json TEXT NOT NULL);
    CREATE TABLE products (id TEXT PRIMARY KEY, seller_id TEXT NOT NULL, category_id TEXT NOT NULL, department TEXT NOT NULL, slug TEXT NOT NULL, title_json TEXT NOT NULL, subtitle_json TEXT NOT NULL, description_json TEXT NOT NULL, specs_json TEXT NOT NULL DEFAULT '[]', base_price_usd_cents INTEGER NOT NULL, compare_at_usd_cents INTEGER, seller_currency TEXT NOT NULL DEFAULT 'USD', moderation_status TEXT NOT NULL DEFAULT 'approved', featured INTEGER NOT NULL DEFAULT 0, model_3d_url TEXT, brand_id TEXT, published INTEGER NOT NULL DEFAULT 1, rating_avg_x10 INTEGER NOT NULL DEFAULT 0, review_count INTEGER NOT NULL DEFAULT 0, deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE product_variants (id TEXT PRIMARY KEY, product_id TEXT NOT NULL, sku TEXT NOT NULL, size TEXT, color TEXT NOT NULL, color_hex TEXT NOT NULL, stock INTEGER NOT NULL DEFAULT 0, price_delta_usd_cents INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE media (id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT, public_url TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE stock_movements (id TEXT PRIMARY KEY, variant_id TEXT NOT NULL, delta INTEGER NOT NULL, reason TEXT NOT NULL, reference_id TEXT, created_at TEXT NOT NULL);
    CREATE TABLE wishlists (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, product_id TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE offers (id TEXT PRIMARY KEY, seller_id TEXT, title_json TEXT NOT NULL, offer_type TEXT NOT NULL, discount_value INTEGER NOT NULL, target_type TEXT NOT NULL, target_id TEXT, stacking_rule TEXT NOT NULL DEFAULT 'best_only', funding_source TEXT NOT NULL DEFAULT 'platform', funding_platform_bps INTEGER NOT NULL DEFAULT 10000, campaign_id TEXT, priority INTEGER NOT NULL DEFAULT 10, rules_json TEXT, approval_status TEXT NOT NULL DEFAULT 'approved', starts_at TEXT, ends_at TEXT, active INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE notifications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'system', title_json TEXT NOT NULL, body_json TEXT NOT NULL, action_url TEXT, metadata_json TEXT, emailed_at TEXT, read_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE notification_preferences (user_id TEXT PRIMARY KEY, email_summary_enabled INTEGER NOT NULL DEFAULT 1, summary_frequency TEXT NOT NULL DEFAULT 'daily', order_updates INTEGER NOT NULL DEFAULT 1, price_drops INTEGER NOT NULL DEFAULT 1, promotional_offers INTEGER NOT NULL DEFAULT 1, last_summary_sent_at TEXT, updated_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE jobs (id TEXT PRIMARY KEY, job_type TEXT NOT NULL, payload_json TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'queued', attempts INTEGER NOT NULL DEFAULT 0, run_at TEXT NOT NULL DEFAULT (datetime('now')), last_error TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE audit_log (id TEXT PRIMARY KEY, actor_user_id TEXT, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL, before_json TEXT, after_json TEXT, ip_address TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE reviews (id TEXT PRIMARY KEY, product_id TEXT NOT NULL, seller_id TEXT NOT NULL, user_id TEXT NOT NULL, rating INTEGER NOT NULL, comment TEXT NOT NULL, moderation_status TEXT NOT NULL DEFAULT 'approved', created_at TEXT NOT NULL DEFAULT (datetime('now')));
  `);

  const norm = (params: unknown[]) =>
    params.map((p) => {
      if (p === undefined || p === null) return null;
      if (typeof p === 'boolean') return p ? 1 : 0;
      return p as string | number;
    });

  const txObj: DbTx = {
    async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
      return sqlite.prepare(sql).all(...norm(params)) as T[];
    },
    async queryOne<T>(sql: string, params: unknown[] = []): Promise<T | null> {
      return (sqlite.prepare(sql).get(...norm(params)) as T | undefined) ?? null;
    },
    async execute(sql: string, params: unknown[] = []) {
      const info = sqlite.prepare(sql).run(...norm(params));
      return { affectedRows: Number(info.changes ?? 0) };
    },
  };

  return {
    driver: 'sqlite-preview',
    ...txObj,
    async init() {},
    async transaction<T>(fn: (tx: DbTx) => Promise<T>) {
      return fn(txObj);
    },
    async close() {
      sqlite.close();
    },
  };
}

test('MarketplaceRepo triggers wishlist price drops, promo offer fanout, preferences opt-out, and instant email jobs', async () => {
  const db = createMemorySqliteDb();
  const repo = new MarketplaceRepo(db);

  await db.execute(
    `INSERT INTO users (id, name, email, phone, role_key) VALUES
      ('u-cust-1', 'Nadia', 'nadia@example.com', '+96170000001', 'customer'),
      ('u-cust-2', 'Rami', 'rami@example.com', '+96170000002', 'customer'),
      ('u-admin-1', 'Admin', 'admin@nilelink.lb', '+96170000099', 'admin_super')`
  );
  await db.execute(
    `INSERT INTO stores (id, seller_id, name_json) VALUES ('st-1', 'sel-1', '{"en":"Beirut Craft","ar":"حرف بيروت"}')`
  );
  await db.execute(
    `INSERT INTO products (id, seller_id, category_id, department, slug, title_json, subtitle_json, description_json, base_price_usd_cents, published)
     VALUES ('p-1', 'sel-1', 'cat-home', 'home-gadgets', 'brass-cezve', '{"en":"Brass Cezve","ar":"ركوة نحاس"}', '{"en":"Sub","ar":"فرعي"}', '{"en":"Desc","ar":"وصف"}', 5000, 1)`
  );
  await db.execute(
    `INSERT INTO wishlists (id, user_id, product_id) VALUES ('w-1', 'u-cust-1', 'p-1'), ('w-2', 'u-cust-2', 'p-1')`
  );

  // User 1 sets instant email summaries; User 2 opts out of promotional offers
  await repo.updateNotificationPreferences('u-cust-1', { emailSummaryEnabled: true, summaryFrequency: 'instant' });
  await repo.updateNotificationPreferences('u-cust-2', { promotionalOffers: false });

  // Seller lowers base price from $50.00 -> $39.00 -> triggers price_drop notification for both wishlisters + instant email job for u-cust-1
  await repo.updateSellerProduct('sel-1', 'p-1', 'u-admin-1', { basePriceUsdCents: 3900 });

  const u1Notifs = await repo.getUserNotifications('u-cust-1');
  assert.equal(u1Notifs.length, 1);
  assert.equal(u1Notifs[0].category, 'price_drop');
  assert.equal(u1Notifs[0].actionUrl, '/product/brass-cezve');

  const queuedJobs = await db.query<{ job_type: string; payload_json: string }>('SELECT job_type, payload_json FROM jobs');
  assert.equal(queuedJobs.length, 1);
  assert.equal(queuedJobs[0].job_type, 'send_notification_summary');

  // Admin creates site-wide promo offer -> u-cust-1 receives promo alert, u-cust-2 opted out so does NOT receive promo
  await repo.adminCreateOffer('u-admin-1', {
    title: { en: 'Weekend Cedars Sale', ar: 'عرض عطلة الأرز' },
    offerType: 'percent',
    discountValue: 15,
    targetType: 'all',
  });

  const u1AfterOffer = await repo.getUserNotifications('u-cust-1');
  const u2AfterOffer = await repo.getUserNotifications('u-cust-2');
  assert.equal(u1AfterOffer.some((n) => n.category === 'promo'), true);
  assert.equal(u2AfterOffer.some((n) => n.category === 'promo'), false);

  await db.close();
});
