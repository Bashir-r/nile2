import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import {
  buildWhatsAppBusinessLink,
  evaluateBusinessSetupReadiness,
  sanitizeWhatsAppDigits,
} from '../../src/shared/communication.ts';
import { MarketplaceRepo } from '../../server/db/marketplaceRepo.ts';
import type { DbClient, DbTx } from '../../server/db/client.ts';

function createMemorySqliteDb(): DbClient {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL DEFAULT 'hashed-secret',
      role_key TEXT NOT NULL DEFAULT 'customer',
      email_verified_at TEXT,
      phone_verified_at TEXT,
      totp_secret TEXT DEFAULT 'totp-secret',
      totp_enabled INTEGER NOT NULL DEFAULT 0,
      preferred_locale TEXT NOT NULL DEFAULT 'en',
      preferred_currency TEXT NOT NULL DEFAULT 'USD',
      failed_login_attempts INTEGER NOT NULL DEFAULT 0,
      locked_until TEXT,
      is_blocked INTEGER NOT NULL DEFAULT 0,
      deleted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE user_permissions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, permission_key TEXT NOT NULL);
    CREATE TABLE sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, token_hash TEXT NOT NULL, csrf_token TEXT NOT NULL, expires_at TEXT NOT NULL);
    CREATE TABLE sellers (
      id TEXT PRIMARY KEY,
      owner_user_id TEXT NOT NULL,
      business_type TEXT NOT NULL DEFAULT 'individual',
      legal_name TEXT NOT NULL,
      commercial_reg_ref TEXT NOT NULL DEFAULT 'LB-100',
      governorate TEXT NOT NULL,
      district TEXT NOT NULL,
      city_address TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL,
      whatsapp_phone TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'approved',
      status_reason TEXT,
      verified INTEGER NOT NULL DEFAULT 1,
      custom_commission_bps INTEGER,
      payout_method TEXT NOT NULL DEFAULT 'whish',
      payout_account TEXT NOT NULL DEFAULT '+96170111222',
      onboarding_step INTEGER NOT NULL DEFAULT 1,
      deleted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE stores (
      id TEXT PRIMARY KEY,
      seller_id TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      name_json TEXT NOT NULL,
      tagline_json TEXT NOT NULL,
      about_json TEXT NOT NULL,
      announcement_json TEXT,
      department_slug TEXT NOT NULL,
      theme_id TEXT NOT NULL DEFAULT 'obsidian-ember',
      logo_media_id TEXT,
      banner_media_id TEXT,
      locations_json TEXT,
      rating_avg_x10 INTEGER NOT NULL DEFAULT 0,
      review_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE store_settings (
      store_id TEXT PRIMARY KEY,
      delivery_mode TEXT NOT NULL DEFAULT 'platform',
      self_delivery_fees_json TEXT NOT NULL DEFAULT '{}',
      processing_hours INTEGER NOT NULL DEFAULT 24,
      vacation_mode INTEGER NOT NULL DEFAULT 0,
      working_hours_json TEXT,
      return_policy_json TEXT,
      social_links_json TEXT,
      seo_title TEXT,
      seo_description TEXT
    );
    CREATE TABLE subscriptions (id TEXT PRIMARY KEY, seller_id TEXT NOT NULL, plan_tier TEXT NOT NULL DEFAULT 'pro', status TEXT NOT NULL DEFAULT 'active', next_due_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE media (id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT, public_url TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE orders (id TEXT PRIMARY KEY, order_number TEXT NOT NULL, user_id TEXT, grand_total_usd_cents INTEGER NOT NULL, payment_method TEXT NOT NULL, payment_status TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE reviews (id TEXT PRIMARY KEY, product_id TEXT NOT NULL, seller_id TEXT NOT NULL, user_id TEXT NOT NULL, rating INTEGER NOT NULL, comment TEXT NOT NULL, moderation_status TEXT NOT NULL DEFAULT 'approved', created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE support_tickets (id TEXT PRIMARY KEY, user_id TEXT, email TEXT NOT NULL, subject TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE audit_log (id TEXT PRIMARY KEY, actor_user_id TEXT, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL, before_json TEXT, after_json TEXT, ip_address TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')));
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
    async init() {},
    async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
      return txObj.query<T>(sql, params);
    },
    async queryOne<T>(sql: string, params: unknown[] = []): Promise<T | null> {
      return txObj.queryOne<T>(sql, params);
    },
    async execute(sql: string, params: unknown[] = []) {
      return txObj.execute(sql, params);
    },
    async transaction<T>(fn: (tx: DbTx) => Promise<T>): Promise<T> {
      return fn(txObj);
    },
    async close() {
      sqlite.close();
    },
  };
}

test('WhatsApp Business link builder sanitizes phone numbers and preserves custom greeting', () => {
  assert.equal(sanitizeWhatsAppDigits('+961 70-123 456'), '96170123456');
  assert.equal(sanitizeWhatsAppDigits('0096171999888'), '96171999888');
  assert.equal(sanitizeWhatsAppDigits('123'), '');

  const url = buildWhatsAppBusinessLink({
    phone: '+961 70 123 456',
    storeName: 'Cedar Craft',
    greeting: 'Marhaba! Ask us about Beirut same-day shipping.',
  });
  assert.equal(
    url,
    'https://wa.me/96170123456?text=Marhaba!%20Ask%20us%20about%20Beirut%20same-day%20shipping.'
  );

  assert.equal(buildWhatsAppBusinessLink({ phone: '12', storeName: 'Cedar Craft' }), '');
});

test('evaluateBusinessSetupReadiness scores store completeness accurately', () => {
  const incomplete = evaluateBusinessSetupReadiness({
    seller: {
      logoImage: null,
      bannerImage: '/src/assets/images/hero_beirut_editorial_1795297173320.jpg',
    },
    nameEn: 'Cedar',
    nameAr: '',
    whatsappPhone: '',
    locations: [],
  });
  assert.equal(incomplete.completedCount, 0);
  assert.equal(incomplete.percent, 0);

  const complete = evaluateBusinessSetupReadiness({
    seller: {
      logoImage: '/uploads/logo.png',
      bannerImage: '/uploads/custom-banner.jpg',
    },
    nameEn: 'Cedar Craft',
    nameAr: 'سيدار كرافت',
    taglineEn: 'Authentic Lebanese craftsmanship',
    whatsappPhone: '+96170123456',
    locations: [
      {
        id: 'loc-1',
        label: 'Hamra Flagship',
        address: 'Hamra St',
        governorate: 'beirut',
        district: 'Hamra',
        lat: 33.896,
        lng: 35.481,
        isPrimary: true,
      },
    ],
    returnPolicyEn: '7-day exchange guarantee',
  });
  assert.equal(complete.completedCount, 6);
  assert.equal(complete.percent, 100);
});

test('Business Setup persists logo, banner, communicationPrefs, and locations in repository', async () => {
  const db = createMemorySqliteDb();
  const repo = new MarketplaceRepo(db);

  await db.execute("INSERT INTO users (id, name, email, phone, role_key) VALUES ('u-sel', 'Nadia', 'nadia@cedar.lb', '+96170111222', 'seller_owner')");
  await db.execute("INSERT INTO sellers (id, owner_user_id, legal_name, governorate, district, phone, whatsapp_phone) VALUES ('sel-1', 'u-sel', 'Cedar Atelier', 'beirut', 'Hamra', '+96170111222', '+96170111222')");
  await db.execute("INSERT INTO stores (id, seller_id, slug, name_json, tagline_json, about_json, department_slug) VALUES ('st-1', 'sel-1', 'cedar-atelier', '{\"en\":\"Cedar Atelier\",\"ar\":\"أتيليه الأرز\"}', '{\"en\":\"\",\"ar\":\"\"}', '{\"en\":\"\",\"ar\":\"\"}', 'fashion')");
  await db.execute("INSERT INTO store_settings (store_id) VALUES ('st-1')");
  await db.execute("INSERT INTO media (id, owner_user_id, entity_type, public_url) VALUES ('med-logo', 'u-sel', 'store_logo', '/uploads/med-logo.png')");
  await db.execute("INSERT INTO media (id, owner_user_id, entity_type, public_url) VALUES ('med-ban', 'u-sel', 'store_banner', '/uploads/med-ban.jpg')");

  const updated = await repo.updateSellerProfile('sel-1', 'u-sel', {
    logoMediaId: 'med-logo',
    bannerMediaId: 'med-ban',
    whatsappPhone: '+96176888999',
    communicationPrefs: {
      whatsappEnabled: true,
      whatsappGreeting: 'Ahlan! Message us for wholesale & custom sizing.',
      systemChatEnabled: true,
      phoneCallsEnabled: false,
      preferredChannel: 'whatsapp',
    },
    locations: [
      {
        id: 'branch-hamra',
        label: 'Hamra Showroom',
        address: 'Bliss St',
        governorate: 'beirut',
        district: 'Hamra',
        lat: 33.897,
        lng: 35.482,
        isPrimary: true,
      },
    ],
  });

  assert.ok(updated);
  assert.equal(updated.logoImage, '/uploads/med-logo.png');
  assert.equal(updated.bannerImage, '/uploads/med-ban.jpg');
  assert.equal(updated.whatsappPhone, '+96176888999');
  assert.equal(updated.communicationPrefs?.preferredChannel, 'whatsapp');
  assert.equal(updated.communicationPrefs?.phoneCallsEnabled, false);
  assert.equal(
    updated.communicationPrefs?.whatsappGreeting,
    'Ahlan! Message us for wholesale & custom sizing.'
  );
  assert.equal(updated.locations?.length, 1);

  const fetched = await repo.getSellerById('sel-1');
  assert.equal(fetched?.logoImage, '/uploads/med-logo.png');
  assert.equal(fetched?.communicationPrefs?.whatsappGreeting, 'Ahlan! Message us for wholesale & custom sizing.');

  await db.close();
});

test('AdminUserManagement verifies, deactivates with session revocation, and returns detailed user activity log', async () => {
  const db = createMemorySqliteDb();
  const repo = new MarketplaceRepo(db);

  await db.execute("INSERT INTO users (id, name, email, phone, role_key) VALUES ('u-admin', 'Super Admin', 'super@nilelink.lb', '+96170000001', 'admin_super')");
  await db.execute("INSERT INTO users (id, name, email, phone, role_key) VALUES ('u-cust', 'Rami Haddad', 'rami@beirut.lb', '+96171222333', 'customer')");
  await db.execute("INSERT INTO sessions (id, user_id, token_hash, csrf_token, expires_at) VALUES ('sess-1', 'u-cust', 'th1', 'csrf1', '2027-01-01')");
  await db.execute("INSERT INTO orders (id, order_number, user_id, grand_total_usd_cents, payment_method, payment_status) VALUES ('ord-1', 'NL-1001', 'u-cust', 12500, 'cod', 'pending')");
  await db.execute("INSERT INTO reviews (id, product_id, seller_id, user_id, rating, comment) VALUES ('rev-1', 'prod-1', 'sel-1', 'u-cust', 5, 'Fast delivery in Beirut')");
  await db.execute("INSERT INTO support_tickets (id, user_id, email, subject, message, status) VALUES ('tkt-1', 'u-cust', 'rami@beirut.lb', 'Address update', 'Please update floor #', 'open')");

  // Super Admin protection check
  await assert.rejects(
    () => repo.adminUpdateUserAccess('u-admin', 'u-admin', { isBlocked: true }),
    /Super Admin/
  );

  // Verify email & phone
  const verifiedRes = await repo.adminUpdateUserAccess(
    'u-cust',
    'u-admin',
    { verifyEmail: true, verifyPhone: true },
    '127.0.0.1'
  );
  assert.equal(verifiedRes.isFullyVerified, true);

  // Deactivate with reason & assert sessions revoked
  const deactivatedRes = await repo.adminUpdateUserAccess(
    'u-cust',
    'u-admin',
    { isBlocked: true, reason: 'Suspicious chargeback pattern' },
    '127.0.0.1'
  );
  assert.equal(deactivatedRes.isBlocked, true);
  const remainingSessions = await db.query<{ id: string }>("SELECT id FROM sessions WHERE user_id = 'u-cust'");
  assert.equal(remainingSessions.length, 0);

  // Detailed user activity log
  const activity = await repo.getAdminUserActivity('u-cust');
  assert.equal(activity.user.id, 'u-cust');
  assert.equal(activity.user.isBlocked, true);
  assert.equal(activity.user.isFullyVerified, true);
  assert.equal((activity.user as unknown as Record<string, unknown>).passwordHash, undefined);
  assert.equal((activity.user as unknown as Record<string, unknown>).totpSecret, undefined);
  assert.equal(activity.stats.ordersCount, 1);
  assert.equal(activity.stats.totalSpentUsdCents, 12500);
  assert.equal(activity.stats.reviewsCount, 1);
  assert.equal(activity.stats.ticketsCount, 1);
  assert.equal(activity.recentOrders[0]?.orderNumber, 'NL-1001');
  assert.ok(activity.auditEvents.some((e) => e.action === 'admin.deactivate_user' && (e.afterJson || '').includes('Suspicious chargeback pattern')));

  // Reactivate account
  const reactivatedRes = await repo.adminUpdateUserAccess(
    'u-cust',
    'u-admin',
    { isBlocked: false, reason: 'Identity confirmed' },
    '127.0.0.1'
  );
  assert.equal(reactivatedRes.isBlocked, false);

  await db.close();
});
