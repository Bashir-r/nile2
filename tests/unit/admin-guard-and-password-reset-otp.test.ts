import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { MarketplaceRepo } from '../../server/db/marketplaceRepo.ts';
import type { DbClient, DbTx } from '../../server/db/client.ts';
import { hashPassword, verifyPassword } from '../../server/services/security.ts';
import { isAuthorizedAdminRole, resolveSafeRedirectPath } from '../../src/components/guards/withAdminGuard.tsx';

function createAuthMemorySqliteDb(): DbClient {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role_key TEXT NOT NULL DEFAULT 'customer',
      email_verified_at TEXT,
      phone_verified_at TEXT,
      totp_secret TEXT,
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
    CREATE TABLE sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      csrf_token TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
    CREATE TABLE verification_codes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      channel TEXT NOT NULL,
      target TEXT NOT NULL,
      purpose TEXT NOT NULL DEFAULT 'verify_contact',
      code_hash TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      expires_at TEXT NOT NULL,
      consumed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      purpose TEXT NOT NULL DEFAULT 'password_reset',
      expires_at TEXT NOT NULL,
      used_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE email_log (
      id TEXT PRIMARY KEY,
      recipient_email TEXT NOT NULL,
      template_key TEXT NOT NULL,
      status TEXT NOT NULL,
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE audit_log (
      id TEXT PRIMARY KEY,
      actor_user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      before_json TEXT,
      after_json TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
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

test('Admin guard helpers validate roles and reject open redirect targets', () => {
  assert.equal(isAuthorizedAdminRole('admin_super'), true);
  assert.equal(isAuthorizedAdminRole('admin_staff'), true);
  assert.equal(isAuthorizedAdminRole('seller_owner'), false);
  assert.equal(isAuthorizedAdminRole('customer'), false);
  assert.equal(isAuthorizedAdminRole(null), false);

  assert.equal(resolveSafeRedirectPath('/admin'), '/admin');
  assert.equal(resolveSafeRedirectPath('/account?tab=cases'), '/account?tab=cases');
  assert.equal(resolveSafeRedirectPath('https://evil.example/phish'), null);
  assert.equal(resolveSafeRedirectPath('//evil.example/admin'), null);
  assert.equal(resolveSafeRedirectPath('/admin\nSet-Cookie: x=1'), null);
  assert.equal(resolveSafeRedirectPath(''), null);
});

test('3-step Email OTP forgot password verifies code, prevents brute force, updates password, and revokes sessions', async () => {
  const db = createAuthMemorySqliteDb();
  const repo = new MarketplaceRepo(db);
  const oldHash = hashPassword('OldPass123');

  await db.execute(
    `INSERT INTO users (id, name, email, phone, password_hash, role_key, failed_login_attempts, locked_until)
     VALUES ('u-1', 'Karim Nasser', 'karim@beirut.lb', '+96170123456', ?, 'customer', 4, '2029-01-01 00:00:00')`,
    [oldHash]
  );
  await db.execute(
    `INSERT INTO sessions (id, user_id, token_hash, csrf_token, expires_at)
     VALUES ('ses-active', 'u-1', 'hash-active', 'csrf-1', '2028-01-01 00:00:00')`
  );

  // Unknown user does not leak account existence
  const unknownReq = await repo.requestPasswordResetOtp({ identifier: 'nobody@beirut.lb', channel: 'email' });
  assert.equal(unknownReq.ok, true);
  assert.equal(unknownReq.devOtpCode, undefined);

  // Step 1: Request Email OTP
  const reqRes = await repo.requestPasswordResetOtp({ identifier: 'karim@beirut.lb', channel: 'email' }, '127.0.0.1');
  assert.equal(reqRes.ok, true);
  assert.equal(reqRes.channel, 'email');
  assert.match(reqRes.devOtpCode || '', /^\d{6}$/);

  const emailRow = await db.queryOne<{ template_key: string }>(
    "SELECT template_key FROM email_log WHERE recipient_email = 'karim@beirut.lb' LIMIT 1"
  );
  assert.equal(emailRow?.template_key, 'password_reset_otp');

  // Wrong OTP increments attempts and rejects after 5 failures
  const wrongCode = reqRes.devOtpCode === '000000' ? '111111' : '000000';
  for (let i = 0; i < 5; i++) {
    await assert.rejects(
      () => repo.verifyPasswordResetOtp({ identifier: 'karim@beirut.lb', code: wrongCode, channel: 'email' }),
      /Invalid 6-digit verification code/
    );
  }
  await assert.rejects(
    () => repo.verifyPasswordResetOtp({ identifier: 'karim@beirut.lb', code: reqRes.devOtpCode!, channel: 'email' }),
    /Too many failed verification attempts/
  );

  // Request a fresh OTP and complete Step 2 + Step 3
  const freshReq = await repo.requestPasswordResetOtp({ identifier: 'karim@beirut.lb', channel: 'email' }, '127.0.0.1');
  const verified = await repo.verifyPasswordResetOtp(
    { identifier: 'karim@beirut.lb', code: freshReq.devOtpCode!, channel: 'email' },
    '127.0.0.1'
  );
  assert.equal(verified.ok, true);
  assert.ok(verified.resetToken.length >= 32);

  // OTP cannot be reused a second time
  await assert.rejects(
    () => repo.verifyPasswordResetOtp({ identifier: 'karim@beirut.lb', code: freshReq.devOtpCode!, channel: 'email' }),
    /expired or not found/
  );

  // Step 3: Set new password
  const resetDone = await repo.confirmPasswordReset(verified.resetToken, 'BeirutCedar2026', '127.0.0.1');
  assert.equal(resetDone.ok, true);

  // Token cannot be reused
  await assert.rejects(
    () => repo.confirmPasswordReset(verified.resetToken, 'AnotherPass99'),
    /invalid or expired/
  );

  const userAfter = await db.queryOne<{
    password_hash: string;
    failed_login_attempts: number;
    locked_until: string | null;
  }>('SELECT password_hash, failed_login_attempts, locked_until FROM users WHERE id = ?', ['u-1']);
  assert.ok(userAfter);
  assert.equal(verifyPassword('BeirutCedar2026', userAfter.password_hash), true);
  assert.equal(verifyPassword('OldPass123', userAfter.password_hash), false);
  assert.equal(userAfter.failed_login_attempts, 0);
  assert.equal(userAfter.locked_until, null);

  // All prior sessions revoked
  const sessionsLeft = await db.query<{ id: string }>("SELECT id FROM sessions WHERE user_id = 'u-1'");
  assert.equal(sessionsLeft.length, 0);

  await db.close();
});

test('3-step SMS OTP forgot password works with Lebanese phone numbers', async () => {
  const db = createAuthMemorySqliteDb();
  const repo = new MarketplaceRepo(db);

  await db.execute(
    `INSERT INTO users (id, name, email, phone, password_hash, role_key)
     VALUES ('u-sms', 'Maya Khoury', 'maya@saifi.lb', '+96170555666', ?, 'seller_owner')`,
    [hashPassword('BeforeReset1')]
  );

  const reqRes = await repo.requestPasswordResetOtp({ identifier: '+961 70 555 666', channel: 'sms' });
  assert.equal(reqRes.ok, true);
  assert.equal(reqRes.channel, 'sms');
  assert.match(reqRes.devOtpCode || '', /^\d{6}$/);

  const verified = await repo.verifyPasswordResetOtp({
    identifier: '+96170555666',
    code: reqRes.devOtpCode!,
    channel: 'sms',
  });
  assert.equal(verified.ok, true);

  await repo.confirmPasswordReset(verified.resetToken, 'SaifiStudio2026');

  const updatedUser = await db.queryOne<{ password_hash: string }>(
    "SELECT password_hash FROM users WHERE id = 'u-sms'"
  );
  assert.ok(updatedUser && verifyPassword('SaifiStudio2026', updatedUser.password_hash));

  await db.close();
});
