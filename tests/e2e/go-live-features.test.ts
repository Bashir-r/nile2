import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { getDb } from '../../server/db/client.ts';
import { ensureEssentialSeed } from '../../server/db/essentialSeed.ts';
import { MarketplaceRepo } from '../../server/db/marketplaceRepo.ts';
import { generateSitemapXml } from '../../server/services/sitemapGenerator.ts';
import { saveUploadedMedia } from '../../server/services/storage.ts';
import { DEFAULT_SITE_CHROME } from '../../src/shared/homeSections.ts';
import type { AuthContextUser } from '../../server/services/security.ts';

function asAuthContextUser(partial: {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleKey: string;
  sellerId?: string | null;
}): AuthContextUser {
  return {
    id: partial.id,
    sessionId: `ses-${crypto.randomUUID()}`,
    csrfToken: 'test-csrf',
    name: partial.name,
    email: partial.email,
    phone: partial.phone,
    roleKey: partial.roleKey,
    sellerId: partial.sellerId ?? undefined,
    preferredLocale: 'en',
    preferredCurrency: 'USD',
    totpEnabled: false,
    emailVerifiedAt: null,
    phoneVerifiedAt: null,
    isFullyVerified: false,
    permissions: [],
  };
}

test('go-live suite: sitemap generation & noindex filtering', async () => {
  const xml = generateSitemapXml({
    baseUrl: 'https://nilelink.lb',
    products: [
      {
        id: 'p-1',
        slug: 'cedar-coat',
        sellerId: 's-1',
        categoryId: 'cat-1',
        department: 'fashion',
        title: { en: 'Cedar Coat', ar: 'معطف الأرز' },
        subtitle: { en: 'Wool', ar: 'صوف' },
        description: { en: 'Fine', ar: 'فاخر' },
        basePriceUsdCents: 12000,
        sellerCurrency: 'USD',
        images: ['/img/1.jpg'],
        rating: 4.9,
        reviewCount: 4,
        published: true,
        variants: [],
        specs: [],
        tags: [],
        createdAt: '2026-10-01',
      },
      {
        id: 'p-2',
        slug: 'hidden-noindex-sku',
        sellerId: 's-1',
        categoryId: 'cat-1',
        department: 'fashion',
        title: { en: 'Hidden', ar: 'مخفي' },
        subtitle: { en: 'Noindex', ar: 'مخفي' },
        description: { en: 'Noindex', ar: 'مخفي' },
        basePriceUsdCents: 1000,
        sellerCurrency: 'USD',
        images: ['/img/2.jpg'],
        rating: 4,
        reviewCount: 0,
        published: true,
        variants: [],
        specs: [],
        tags: [],
        createdAt: '2026-10-01',
      },
    ],
    sellers: [
      {
        id: 's-1',
        slug: 'beirut-atelier',
        userId: 'u-1',
        name: { en: 'Beirut Atelier', ar: 'أتيليه بيروت' },
        tagline: { en: 'Studio', ar: 'استوديو' },
        about: { en: 'Atelier', ar: 'استوديو' },
        department: 'fashion',
        status: 'approved',
        verified: true,
        rating: 4.9,
        reviewCount: 10,
        governorate: 'beirut',
        district: 'achrafieh',
        whatsappPhone: '+96170123456',
        payoutMethod: 'whish',
        payoutAccount: '+96170123456',
        commercialRegRef: 'CR-10',
        subscriptionTier: 'pro',
        subscriptionStatus: 'active',
        subscriptionNextDue: '2026-12-31',
        deliveryMode: 'platform',
        selfDeliveryFeesUsdCents: {},
        storefrontTheme: 'obsidian-ember',
        bannerImage: '/img/banner.jpg',
        createdAt: '2026-10-01',
      },
    ],
    campaigns: [
      {
        id: 'c-1',
        slug: 'autumn-drop',
        title: { en: 'Autumn Drop', ar: 'عروض الخريف' },
        subtitle: { en: 'Save', ar: 'وفر' },
        description: { en: 'Drop', ar: 'عرض' },
        bgToken: 'ember',
        status: 'active',
        featuredOfferIds: [],
        featuredCouponCodes: [],
        createdAt: '2026-10-01',
      },
    ],
    seo: {
      global: {
        siteName: 'NileLink',
        titleTemplate: '%s | NileLink',
        canonicalBaseUrl: 'https://nilelink.lb',
        defaultTitle: { en: 'NileLink', ar: 'نايل لينك' },
        defaultDescription: { en: 'Desc', ar: 'وصف' },
        defaultOgImageUrl: '/img/og.jpg',
        twitterCardType: 'summary_large_image',
        twitterSiteHandle: '@nilelinklb',
        organizationJsonLd: {
          name: 'NileLink',
          logoUrl: '/img/logo.png',
          contactPhone: '+9611555000',
          contactEmail: 'care@nilelink.lb',
          sameAs: [],
        },
      },
      overrides: [
        {
          id: 'ov-1',
          entityType: 'product',
          entityKey: 'hidden-noindex-sku',
          metaTitle: { en: 'Hidden', ar: 'مخفي' },
          metaDescription: { en: 'Hidden', ar: 'مخفي' },
          canonicalUrl: '',
          ogImageUrl: '',
          robots: 'noindex,nofollow',
          structuredData: {},
          updatedAt: '2026-10-01',
        },
      ],
    },
  });

  assert.ok(xml.includes('<loc>https://nilelink.lb/product/cedar-coat</loc>'));
  assert.ok(xml.includes('<loc>https://nilelink.lb/store/beirut-atelier</loc>'));
  assert.ok(xml.includes('<loc>https://nilelink.lb/campaign/autumn-drop</loc>'));
  assert.ok(xml.includes('<loc>https://nilelink.lb/legal?tab=terms</loc>'));
  assert.equal(xml.includes('hidden-noindex-sku'), false);
});

test('go-live suite: phone/email login, 6-digit OTP verification & lockout, chat isolation, wishlist, store media, admin controls', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nilelink-golive-'));
  const prevStorage = process.env.STORAGE_DIR;
  process.env.STORAGE_DIR = tmpDir;

  const db = await getDb();
  try {
    await ensureEssentialSeed(db);
    const repo = new MarketplaceRepo(db);
    const uniq = crypto.randomBytes(4).toString('hex');

    // 1. Legal pages complete EN & AR content
    for (const slug of ['terms', 'privacy', 'returns', 'seller-agreement']) {
      const page = await repo.getPageBySlug(slug);
      assert.ok(page, `Missing legal page: ${slug}`);
      assert.ok(page.body.en.length > 80, `${slug} EN body too short`);
      assert.ok(page.body.ar.length > 80, `${slug} AR body too short`);
    }

    // 2. Register Customer & test Phone-or-Email login
    const custEmail = `buyer.${uniq}@beirut.lb`;
    const localPhone = `76${String(Math.floor(100000 + Math.random() * 899999))}`;
    const cust = await repo.registerCustomer({
      name: 'Karim Haddad',
      email: custEmail,
      phone: localPhone,
      password: 'Password123!',
      locale: 'en',
    });

    // Sign in with email, normalized +961 phone, and raw local phone
    const byEmail = await repo.loginUser({ identifier: custEmail, password: 'Password123!' });
    assert.equal(byEmail.id, cust.id);

    const byFullPhone = await repo.loginUser({ identifier: `+961${localPhone}`, password: 'Password123!' });
    assert.equal(byFullPhone.id, cust.id);

    const byLocalPhone = await repo.loginUser({ identifier: `0${localPhone}`, password: 'Password123!' });
    assert.equal(byLocalPhone.id, cust.id);

    // 3. 6-Digit Contact Verification OTP + 5-attempt lockout + isFullyVerified
    const emailChallenge = await repo.requestAuthVerificationOtp(cust.id, { channel: 'email' }, '127.0.0.1');
    assert.ok(emailChallenge.devOtpCode && emailChallenge.devOtpCode.length === 6);

    // Wrong codes up to 5 failures lock the OTP record
    for (let i = 0; i < 5; i++) {
      await assert.rejects(
        () => repo.confirmAuthVerificationOtp(cust.id, { channel: 'email', code: '000000' }),
        /Invalid 6-digit verification code|Too many failed/
      );
    }
    // Even the old code is now locked
    await assert.rejects(
      () =>
        repo.confirmAuthVerificationOtp(cust.id, {
          channel: 'email',
          code: emailChallenge.devOtpCode!,
        }),
      /Too many invalid verification attempts/
    );

    // Request fresh OTPs for both email & phone and confirm them
    const freshEmailOtp = await repo.requestAuthVerificationOtp(cust.id, { channel: 'email' });
    const emailConfirmRes = await repo.confirmAuthVerificationOtp(cust.id, {
      channel: 'email',
      code: freshEmailOtp.devOtpCode!,
    });
    assert.ok(emailConfirmRes.emailVerifiedAt);
    assert.equal(emailConfirmRes.isFullyVerified, false);

    const freshPhoneOtp = await repo.requestAuthVerificationOtp(cust.id, { channel: 'phone' });
    const phoneConfirmRes = await repo.confirmAuthVerificationOtp(cust.id, {
      channel: 'phone',
      code: freshPhoneOtp.devOtpCode!,
    });
    assert.ok(phoneConfirmRes.phoneVerifiedAt);
    assert.equal(phoneConfirmRes.isFullyVerified, true);

    // 4. Passwordless 6-digit OTP Sign-In using phone number
    const loginOtp = await repo.requestLoginOtp(`+961${localPhone}`, '127.0.0.1');
    assert.equal(loginOtp.ok, true);
    assert.ok(loginOtp.devOtpCode);
    const otpLogged = await repo.verifyLoginOtp({
      identifier: `+961${localPhone}`,
      code: loginOtp.devOtpCode!,
    });
    assert.equal(otpLogged.id, cust.id);

    // 5. Register Seller, approve, upload logo + banner + full profile details
    const sellerPhone = `71${String(Math.floor(100000 + Math.random() * 899999))}`;
    const sellerReg = await repo.registerSeller({
      ownerName: 'Nadia Salameh',
      email: `merchant.${uniq}@byblos.lb`,
      phone: sellerPhone,
      password: 'Password123!',
      storeNameEn: 'Byblos Leather Craft',
      storeNameAr: 'حرف جلديّة جبيل',
      department: 'fashion',
      governorate: 'mount-lebanon',
      district: 'jbeil',
      commercialRegRef: `CR-${uniq}`,
      payoutMethod: 'whish',
      payoutAccount: '+96171000001',
    });
    await repo.adminUpdateSeller(sellerReg.seller.id, 'admin-1', { status: 'approved', verified: true });

    const tinyPngBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

    const logoMedia = await saveUploadedMedia(db, {
      base64Data: tinyPngBase64,
      mimeType: 'image/png',
      entityType: 'store_logo',
      ownerUserId: sellerReg.user.id,
    });
    const bannerMedia = await saveUploadedMedia(db, {
      base64Data: tinyPngBase64,
      mimeType: 'image/png',
      entityType: 'store_banner',
      ownerUserId: sellerReg.user.id,
    });

    await repo.updateSellerProfile(sellerReg.seller.id, sellerReg.user.id, {
      nameEn: 'Byblos Heritage Atelier',
      nameAr: 'أتيليه جبيل التراثي',
      cityAddress: 'Old Souk, Jbeil',
      workingHours: { schedule: 'Mon–Sat 10:00–20:00' },
      whatsappPhone: '+96171888777',
      logoMediaId: logoMedia.mediaId,
      bannerMediaId: bannerMedia.mediaId,
    });

    const sellerWorkspace = await repo.getSellerWorkspace(sellerReg.seller.id);
    assert.equal(sellerWorkspace.seller.name.en, 'Byblos Heritage Atelier');
    assert.equal(sellerWorkspace.seller.cityAddress, 'Old Souk, Jbeil');
    assert.equal(sellerWorkspace.seller.workingHours?.schedule, 'Mon–Sat 10:00–20:00');
    assert.equal(sellerWorkspace.seller.logoImage, logoMedia.publicUrl);
    assert.equal(sellerWorkspace.seller.bannerImage, bannerMedia.publicUrl);

    // 6. Wishlist persistence
    const prod = await repo.createSellerProduct(sellerReg.seller.id, sellerReg.user.id, {
      titleEn: 'Handmade Cedar Bag',
      titleAr: 'حقيبة جلد يدوية',
      descriptionEn: 'Crafted in Jbeil',
      descriptionAr: 'مصنوعة في جبيل',
      basePriceUsdCents: 9500,
      department: 'fashion',
      sku: `BAG-${uniq}`,
      stock: 5,
      published: true,
    });
    const syncedWishlist = await repo.syncUserWishlist(cust.id, [prod.id]);
    assert.ok(syncedWishlist.includes(prod.id));
    const toggledOff = await repo.toggleUserWishlist(cust.id, prod.id);
    assert.equal(toggledOff.wished, false);
    assert.equal(toggledOff.wishlist.includes(prod.id), false);

    // 7. Customer <-> Store Owner System Chat & 3rd-party Forbidden check
    const custCtx = asAuthContextUser({
      id: cust.id,
      name: cust.name,
      email: cust.email,
      phone: cust.phone,
      roleKey: 'customer',
    });
    const sellerCtx = asAuthContextUser({
      id: sellerReg.user.id,
      name: 'Nadia Salameh',
      email: sellerReg.user.email,
      phone: sellerPhone,
      roleKey: 'seller_owner',
      sellerId: sellerReg.seller.id,
    });
    const intruderCtx = asAuthContextUser({
      id: `intruder-${uniq}`,
      name: 'Intruder',
      email: `intruder.${uniq}@example.com`,
      phone: '+96170999111',
      roleKey: 'customer',
    });

    const started = await repo.startOrSendChatConversation(custCtx, {
      sellerId: sellerReg.seller.id,
      productId: prod.id,
      body: 'Do you deliver this bag to Jounieh tomorrow?',
    });
    assert.equal(started.conversation.unreadForSeller, 1);

    // Intruder cannot read or reply to this private chat
    await assert.rejects(
      () => repo.getChatConversationMessages(started.conversation.id, intruderCtx),
      /Forbidden/
    );
    await assert.rejects(
      () => repo.sendChatMessage(started.conversation.id, intruderCtx, 'Hijack attempt'),
      /Forbidden/
    );

    // Seller reads messages (clears unreadForSeller) and replies
    const sellerThread = await repo.getChatConversationMessages(started.conversation.id, sellerCtx);
    assert.equal(sellerThread.messages.length, 1);
    assert.equal(sellerThread.conversation.unreadForSeller, 0);

    const sellerReply = await repo.sendChatMessage(
      started.conversation.id,
      sellerCtx,
      'Yes, same-day courier across Keserwan & Beirut.'
    );
    assert.equal(sellerReply.senderRole, 'seller');

    const custConvs = await repo.listChatConversations(custCtx);
    assert.equal(custConvs.find((c) => c.id === started.conversation.id)?.unreadForCustomer, 1);

    await repo.updateChatConversationStatus(started.conversation.id, sellerCtx, 'closed');
    const updatedThread = await repo.getChatConversationMessages(started.conversation.id, sellerCtx);
    assert.equal(updatedThread.conversation.status, 'closed');

    // 8. Admin User Verification + Platform Brand Logo save
    await repo.adminUpdateUserAccess(
      sellerReg.user.id,
      'admin-1',
      { verifyEmail: true, verifyPhone: true },
      '127.0.0.1'
    );
    const overview = await repo.getAdminOverview();
    const verifiedSellerOwner = overview.users.find((u) => u.id === sellerReg.user.id);
    assert.ok(verifiedSellerOwner?.emailVerifiedAt);
    assert.ok(verifiedSellerOwner?.phoneVerifiedAt);
    assert.equal(verifiedSellerOwner?.isFullyVerified, true);

    await repo.adminSaveSiteChrome(
      { ...DEFAULT_SITE_CHROME, brandLogoUrl: `/uploads/platform-logo-${uniq}.png` },
      true,
      'admin-1',
      '127.0.0.1'
    );
    const updatedBootstrap = await repo.getBootstrapData({ isLoggedIn: false, isNewVisitor: false, locale: 'en' });
    assert.equal(updatedBootstrap.siteChrome.brandLogoUrl, `/uploads/platform-logo-${uniq}.png`);
  } finally {
    process.env.STORAGE_DIR = prevStorage;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
