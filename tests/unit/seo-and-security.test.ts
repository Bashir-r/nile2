import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildBreadcrumbSchema,
  buildCampaignSchema,
  buildOrganizationSchema,
  buildProductSchema,
  buildStoreSchema,
  formatSeoTitle,
  resolveAbsoluteUrl,
  safeJsonLdStringify,
} from '../../src/utils/seo.ts';
import { isSafeAssetUrl, isSafeNavUrl, toSafeHref } from '../../src/utils/url.ts';
import type { Campaign, Product, Seller, SeoMetadataConfig } from '../../src/shared/types.ts';

const sampleConfig: SeoMetadataConfig = {
  global: {
    siteName: 'NileLink',
    titleTemplate: '%s | NileLink Lebanon',
    canonicalBaseUrl: 'https://nilelink.lb',
    defaultTitle: { en: 'NileLink — Lebanon Marketplace', ar: 'نايل لينك' },
    defaultDescription: { en: 'Curated merchants', ar: 'تجار موثوقون' },
    defaultOgImageUrl: '/src/assets/images/hero_beirut_editorial_1795297173320.jpg',
    twitterCardType: 'summary_large_image',
    twitterSiteHandle: '@nilelinklb',
    organizationJsonLd: {
      name: 'NileLink Lebanon',
      logoUrl: '/src/assets/images/logo.png',
      contactPhone: '+961 1 555 000',
      contactEmail: 'care@nilelink.lb',
      sameAs: ['https://instagram.com/nilelinklb'],
    },
  },
  overrides: [],
};

test('safeJsonLdStringify neutralizes HTML script breakout and control characters', () => {
  const malicious = {
    name: '</script><script>alert("xss")</script>',
    lineSep: 'hello\u2028world\u2029',
    amp: 'A & B',
  };
  const serialized = safeJsonLdStringify(malicious);
  assert.equal(serialized.includes('</script>'), false);
  assert.equal(serialized.includes('<script>'), false);
  assert.ok(serialized.includes('\\u003c/script\\u003e'));
  assert.ok(serialized.includes('\\u0026'));
  assert.ok(serialized.includes('\\u2028'));
  assert.ok(serialized.includes('\\u2029'));
});

test('URL validation blocks javascript/data/protocol-relative redirects while preserving safe paths', () => {
  assert.equal(isSafeNavUrl('javascript:alert(1)'), false);
  assert.equal(isSafeNavUrl('data:text/html,<script>alert(1)</script>'), false);
  assert.equal(isSafeNavUrl('vbscript:msgbox(1)'), false);
  assert.equal(isSafeNavUrl('//evil.example/phish'), false);
  assert.equal(isSafeNavUrl('/catalog\r\nSet-Cookie: evil=1'), false);

  assert.equal(isSafeNavUrl('/catalog?deals=true'), true);
  assert.equal(isSafeNavUrl('https://nilelink.lb/campaign/cedar-drop'), true);
  assert.equal(toSafeHref('javascript:void(0)', '/catalog'), '/catalog');
  assert.equal(toSafeHref('/store/beirut-atelier', '/catalog'), '/store/beirut-atelier');
  assert.equal(isSafeAssetUrl('https://cdn.nilelink.lb/banner.jpg'), true);
  assert.equal(isSafeAssetUrl('javascript:fetch(1)'), false);
});

test('SEO schema builders generate valid Schema.org Product, Campaign, Store, and Organization JSON-LD', () => {
  const seller: Seller = {
    id: 'sel-1',
    slug: 'cedar-craft',
    userId: 'usr-1',
    name: { en: 'Cedar Craft', ar: 'حرف الأرز' },
    tagline: { en: 'Handcrafted in Beirut', ar: 'صنع في بيروت' },
    about: { en: 'Studio', ar: 'استوديو' },
    department: 'home-gadgets',
    status: 'approved',
    verified: true,
    rating: 4.9,
    reviewCount: 14,
    governorate: 'beirut',
    district: 'achrafieh',
    whatsappPhone: '+96170123456',
    payoutMethod: 'whish',
    payoutAccount: '+96170123456',
    commercialRegRef: 'CR-123',
    subscriptionTier: 'pro',
    subscriptionStatus: 'active',
    subscriptionNextDue: '2026-12-01',
    deliveryMode: 'platform',
    selfDeliveryFeesUsdCents: {},
    storefrontTheme: 'sand-atelier',
    bannerImage: '/src/assets/images/banner.jpg',
    createdAt: '2026-01-01',
  };

  const product: Product = {
    id: 'prod-1',
    slug: 'brass-cedar-lamp',
    sellerId: 'sel-1',
    categoryId: 'cat-1',
    department: 'home-gadgets',
    title: { en: 'Brass Cedar Lamp', ar: 'مصباح نحاسي' },
    subtitle: { en: 'Warm ambient lighting', ar: 'إضاءة دافئة' },
    description: { en: 'Machined brass desk lamp built in Beirut.', ar: 'مصباح مكتب نحاسي.' },
    basePriceUsdCents: 6500,
    sellerCurrency: 'USD',
    images: ['/src/assets/images/lamp.jpg'],
    rating: 4.8,
    reviewCount: 6,
    published: true,
    variants: [{ id: 'v1', sku: 'LAMP-01', color: 'Brass', colorHex: '#B68A45', stock: 8, priceDeltaUsdCents: 0 }],
    specs: [],
    tags: ['lamp'],
    createdAt: '2026-01-01',
  };

  const campaign: Campaign = {
    id: 'cmp-1',
    slug: 'beirut-design-week',
    title: { en: 'Beirut Design Week', ar: 'أسبوع التصميم في بيروت' },
    subtitle: { en: '25% off local studios', ar: 'خصم 25%' },
    description: { en: 'Limited studio drops', ar: 'إصدارات محدودة' },
    bgToken: 'ember',
    status: 'active',
    featuredOfferIds: [],
    featuredCouponCodes: [],
    createdAt: '2026-01-01',
  };

  assert.equal(formatSeoTitle('Brass Cedar Lamp', sampleConfig), 'Brass Cedar Lamp | NileLink Lebanon');
  assert.equal(resolveAbsoluteUrl('/product/brass-cedar-lamp', 'https://nilelink.lb'), 'https://nilelink.lb/product/brass-cedar-lamp');

  const orgSchema = buildOrganizationSchema(sampleConfig, 'https://nilelink.lb');
  assert.equal(orgSchema['@type'], 'Organization');
  assert.equal(orgSchema.name, 'NileLink Lebanon');

  const prodSchema = buildProductSchema(product, {
    seller,
    activeVariant: product.variants[0],
    effectiveUsdCents: 6500,
    inStock: true,
    locale: 'en',
    baseOrigin: 'https://nilelink.lb',
  });
  assert.equal(prodSchema['@type'], 'Product');
  assert.equal((prodSchema.offers as Record<string, unknown>).price, '65.00');
  assert.equal((prodSchema.offers as Record<string, unknown>).availability, 'https://schema.org/InStock');

  const cmpSchema = buildCampaignSchema(campaign, { locale: 'en', baseOrigin: 'https://nilelink.lb' });
  assert.equal(cmpSchema['@type'], 'SaleEvent');

  const storeSchema = buildStoreSchema(seller, { locale: 'en', baseOrigin: 'https://nilelink.lb' });
  assert.equal(storeSchema['@type'], 'Store');

  const bcSchema = buildBreadcrumbSchema([{ name: 'Home', path: '/' }], 'https://nilelink.lb');
  assert.equal(bcSchema['@type'], 'BreadcrumbList');
});
