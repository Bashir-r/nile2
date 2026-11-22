import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import express from 'express';
import { applySecurityHeaders, buildCspDirectives } from '../../server/services/securityHeaders.ts';
import { buildStoreSchema } from '../../src/utils/seo.ts';
import type { Seller } from '../../src/shared/types.ts';

test('buildCspDirectives includes Maps, WebGL blobs/workers, frame-ancestors, and dev/prod upgrade toggling', () => {
  const devDirectives = buildCspDirectives(true);
  const prodDirectives = buildCspDirectives(false);

  assert.ok(devDirectives['script-src']?.includes('https://maps.googleapis.com'));
  assert.ok(devDirectives['script-src']?.includes('https://maps.gstatic.com'));
  assert.ok(devDirectives['worker-src']?.includes('blob:'));
  assert.ok(devDirectives['img-src']?.includes('blob:'));
  assert.ok(devDirectives['frame-ancestors']?.includes('https://aistudio.google.com'));
  assert.ok(devDirectives['frame-ancestors']?.includes('https://*.run.app'));
  assert.equal(devDirectives['upgrade-insecure-requests'], null);

  assert.equal(prodDirectives['script-src']?.includes("'unsafe-eval'"), false);
  assert.equal('upgrade-insecure-requests' in prodDirectives, false);
});

test('applySecurityHeaders sets CSP, HSTS, nosniff, Referrer-Policy, COOP, CORP, Permissions-Policy', async () => {
  const app = express();
  applySecurityHeaders(app, true);
  app.get('/ping', (_req, res) => {
    res.json({ ok: true });
  });

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address();
  assert.ok(address && typeof address === 'object');

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/ping`);
    assert.equal(response.status, 200);

    const csp = response.headers.get('content-security-policy') || '';
    const hsts = response.headers.get('strict-transport-security') || '';
    const nosniff = response.headers.get('x-content-type-options') || '';
    const referrer = response.headers.get('referrer-policy') || '';
    const coop = response.headers.get('cross-origin-opener-policy') || '';
    const corp = response.headers.get('cross-origin-resource-policy') || '';
    const permissions = response.headers.get('permissions-policy') || '';

    assert.ok(csp.includes("default-src 'self'"));
    assert.ok(csp.includes('https://maps.googleapis.com'));
    assert.ok(csp.includes('frame-ancestors'));
    assert.ok(hsts.includes('max-age=31536000'));
    assert.ok(hsts.includes('includeSubDomains'));
    assert.equal(nosniff, 'nosniff');
    assert.equal(referrer, 'strict-origin-when-cross-origin');
    assert.equal(coop, 'same-origin-allow-popups');
    assert.equal(corp, 'cross-origin');
    assert.ok(permissions.includes('geolocation=(self)'));
    assert.equal(response.headers.get('x-powered-by'), null);
    assert.equal(response.headers.get('x-frame-options'), null);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('buildStoreSchema prioritizes primary StoreLocation for PostalAddress and GeoCoordinates', () => {
  const seller: Seller = {
    id: 'sel-loc-1',
    slug: 'hamra-optics',
    userId: 'usr-loc-1',
    name: { en: 'Hamra Optics', ar: 'بصريات الحمرا' },
    tagline: { en: 'Precision frames', ar: 'نظارات دقيقة' },
    about: { en: 'Independent optical house', ar: 'دار بصريات مستقلة' },
    department: 'fashion',
    status: 'approved',
    verified: true,
    rating: 4.9,
    reviewCount: 22,
    governorate: 'beirut',
    district: 'hamra',
    whatsappPhone: '+96171111222',
    payoutMethod: 'whish',
    payoutAccount: '+96171111222',
    commercialRegRef: 'CR-778',
    subscriptionTier: 'pro',
    subscriptionStatus: 'active',
    subscriptionNextDue: '2026-12-31',
    deliveryMode: 'platform',
    selfDeliveryFeesUsdCents: {},
    storefrontTheme: 'sand-atelier',
    bannerImage: '/src/assets/images/banner.jpg',
    createdAt: '2026-01-01',
    locations: [
      {
        id: 'loc-secondary',
        label: 'Jounieh Branch',
        governorate: 'mount-lebanon',
        district: 'Jounieh',
        address: 'Maameltein Hwy',
        lat: 33.9808,
        lng: 35.6178,
        isPrimary: false,
      },
      {
        id: 'loc-primary',
        label: 'Hamra Flagship',
        governorate: 'beirut',
        district: 'Hamra',
        address: 'Bliss Street Bldg 14',
        lat: 33.8978,
        lng: 35.4812,
        isPrimary: true,
      },
    ],
  };

  const schema = buildStoreSchema(seller, { locale: 'en', baseOrigin: 'https://nilelink.lb' });
  assert.equal(schema['@type'], 'Store');
  const address = schema.address as Record<string, unknown>;
  assert.equal(address['@type'], 'PostalAddress');
  assert.equal(address.streetAddress, 'Bliss Street Bldg 14');
  assert.equal(address.addressLocality, 'Hamra');
  assert.equal(address.addressRegion, 'beirut');
  assert.equal(address.addressCountry, 'LB');

  const geo = schema.geo as Record<string, unknown>;
  assert.ok(geo);
  assert.equal(geo['@type'], 'GeoCoordinates');
  assert.equal(geo.latitude, 33.8978);
  assert.equal(geo.longitude, 35.4812);
});
