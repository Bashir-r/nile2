import { useEffect } from 'react';
import type {
  Campaign,
  Locale,
  Product,
  ProductVariant,
  Seller,
  SeoEntityOverride,
  SeoEntityType,
  SeoMetadataConfig,
  SeoRobotsDirective,
} from '../shared/types.ts';
import { useMarketplace } from '../context/MarketplaceContext.tsx';
import { isSafeNavUrl } from './url.ts';

export interface SeoPageInput {
  entityType?: SeoEntityType;
  entityKey?: string;
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'product' | 'article';
  ogImageUrl?: string;
  robots?: SeoRobotsDirective;
  schemas?: Array<Record<string, unknown>>;
}

export function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function resolveBaseOrigin(canonicalBaseUrl?: string): string {
  const clean = (canonicalBaseUrl || '').trim().replace(/\/+$/, '');
  if (clean && /^https?:\/\//i.test(clean)) return clean;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://nilelink.lb';
}

export function resolveAbsoluteUrl(pathOrUrl: string | undefined, baseOrigin: string): string {
  const clean = (pathOrUrl || '').trim();
  if (!clean) return baseOrigin;
  if (!isSafeNavUrl(clean, true)) return baseOrigin;
  if (/^https?:\/\//i.test(clean)) return clean;
  return `${baseOrigin}${clean.startsWith('/') ? clean : `/${clean}`}`;
}

export function findSeoOverride(
  config: SeoMetadataConfig | undefined,
  entityType?: SeoEntityType,
  entityKey?: string
): SeoEntityOverride | undefined {
  if (!config || !entityType || !entityKey) return undefined;
  return config.overrides.find((o) => o.entityType === entityType && o.entityKey === entityKey);
}

export function formatSeoTitle(rawTitle: string, config: SeoMetadataConfig | undefined): string {
  const clean = rawTitle.trim();
  const siteName = config?.global.siteName || 'NileLink';
  const tpl = config?.global.titleTemplate || '%s | NileLink Lebanon';
  if (!clean) return config?.global.defaultTitle.en || siteName;
  if (clean.toLowerCase().includes(siteName.toLowerCase())) return clean;
  return tpl.includes('%s') ? tpl.replace('%s', clean) : `${clean} | ${siteName}`;
}

function upsertMetaTag(attr: 'name' | 'property', key: string, content: string): void {
  if (typeof document === 'undefined') return;
  let tag = document.head.querySelector(`meta[${attr}="${CSS.escape(key)}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLinkTag(rel: string, href: string): void {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector(`link[rel="${CSS.escape(rel)}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function applySeoMetadata(
  input: SeoPageInput,
  config: SeoMetadataConfig | undefined,
  locale: Locale
): void {
  if (typeof document === 'undefined') return;

  const baseOrigin = resolveBaseOrigin(config?.global.canonicalBaseUrl);
  const override = findSeoOverride(config, input.entityType, input.entityKey);

  const fallbackTitle =
    config?.global.defaultTitle?.[locale] || config?.global.defaultTitle?.en || 'NileLink — Lebanese Marketplace';
  const rawTitle =
    override?.metaTitle?.[locale]?.trim() ||
    override?.metaTitle?.en?.trim() ||
    input.title?.trim() ||
    fallbackTitle;
  const fullTitle =
    input.entityType === 'page' && input.entityKey === 'home' && !override?.metaTitle?.[locale]
      ? rawTitle
      : formatSeoTitle(rawTitle, config);

  const fallbackDesc =
    config?.global.defaultDescription?.[locale] ||
    config?.global.defaultDescription?.en ||
    'Curated Lebanese independent merchants, verified specs, and dual USD/LBP pricing.';
  const description = (
    override?.metaDescription?.[locale]?.trim() ||
    override?.metaDescription?.en?.trim() ||
    input.description?.trim() ||
    fallbackDesc
  ).slice(0, 320);

  const canonicalRaw =
    override?.canonicalUrl && isSafeNavUrl(override.canonicalUrl, true)
      ? override.canonicalUrl
      : input.canonicalPath || (typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/');
  const canonicalHref = resolveAbsoluteUrl(canonicalRaw, baseOrigin);

  const imageRaw =
    (override?.ogImageUrl && isSafeNavUrl(override.ogImageUrl, true) ? override.ogImageUrl : '') ||
    (input.ogImageUrl && isSafeNavUrl(input.ogImageUrl, true) ? input.ogImageUrl : '') ||
    config?.global.defaultOgImageUrl ||
    '/src/assets/images/hero_beirut_editorial_1795297173320.jpg';
  const imageHref = resolveAbsoluteUrl(imageRaw, baseOrigin);

  const robots: SeoRobotsDirective = override?.robots || input.robots || 'index,follow';
  const siteName = config?.global.siteName || 'NileLink';

  document.title = fullTitle;
  upsertMetaTag('name', 'description', description);
  upsertMetaTag('name', 'robots', robots);
  upsertLinkTag('canonical', canonicalHref);

  upsertMetaTag('property', 'og:type', input.ogType || 'website');
  upsertMetaTag('property', 'og:site_name', siteName);
  upsertMetaTag('property', 'og:title', fullTitle);
  upsertMetaTag('property', 'og:description', description);
  upsertMetaTag('property', 'og:url', canonicalHref);
  upsertMetaTag('property', 'og:image', imageHref);
  upsertMetaTag('property', 'og:locale', locale === 'ar' ? 'ar_LB' : 'en_US');

  upsertMetaTag('name', 'twitter:card', config?.global.twitterCardType || 'summary_large_image');
  if (config?.global.twitterSiteHandle) {
    upsertMetaTag('name', 'twitter:site', config.global.twitterSiteHandle);
  }
  upsertMetaTag('name', 'twitter:title', fullTitle);
  upsertMetaTag('name', 'twitter:description', description);
  upsertMetaTag('name', 'twitter:image', imageHref);

  const existingScripts = document.head.querySelectorAll('script[data-nl-seo="1"]');
  existingScripts.forEach((el) => el.remove());

  const schemaBlocks: Array<Record<string, unknown>> = [...(input.schemas || [])];
  if (override?.structuredData?.customJson) {
    try {
      const parsed = JSON.parse(override.structuredData.customJson);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        schemaBlocks.push(parsed as Record<string, unknown>);
      }
    } catch {
      // Ignore malformed custom JSON override gracefully
    }
  }

  for (const schema of schemaBlocks) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-nl-seo', '1');
    script.textContent = safeJsonLdStringify(schema);
    document.head.appendChild(script);
  }
}

export function buildOrganizationSchema(
  config: SeoMetadataConfig | undefined,
  baseOrigin: string
): Record<string, unknown> {
  const org = config?.global.organizationJsonLd;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org?.name || config?.global.siteName || 'NileLink Marketplace',
    url: baseOrigin,
    logo: resolveAbsoluteUrl(org?.logoUrl || config?.global.defaultOgImageUrl, baseOrigin),
    ...(org?.contactPhone || org?.contactEmail
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            ...(org.contactPhone ? { telephone: org.contactPhone } : {}),
            ...(org.contactEmail ? { email: org.contactEmail } : {}),
            areaServed: 'LB',
            availableLanguage: ['English', 'Arabic'],
          },
        }
      : {}),
    ...(org?.sameAs && org.sameAs.length > 0 ? { sameAs: org.sameAs } : {}),
  };
}

export function buildWebSiteSchema(
  config: SeoMetadataConfig | undefined,
  baseOrigin: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config?.global.siteName || 'NileLink',
    url: baseOrigin,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseOrigin}/catalog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
  baseOrigin: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: resolveAbsoluteUrl(item.path, baseOrigin),
    })),
  };
}

export function buildProductSchema(
  product: Product,
  opts: {
    seller?: Seller;
    activeVariant?: ProductVariant;
    effectiveUsdCents: number;
    inStock: boolean;
    locale: Locale;
    baseOrigin: string;
    override?: SeoEntityOverride;
  }
): Record<string, unknown> {
  const sd = opts.override?.structuredData;
  const images = product.images.length > 0 ? product.images.map((u) => resolveAbsoluteUrl(u, opts.baseOrigin)) : [];
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.override?.metaTitle?.[opts.locale] || product.title[opts.locale] || product.title.en,
    description:
      opts.override?.metaDescription?.[opts.locale] || product.description[opts.locale] || product.description.en,
    ...(images.length > 0 ? { image: images } : {}),
    sku: sd?.sku || opts.activeVariant?.sku || product.id,
    ...(sd?.gtin ? { gtin: sd.gtin } : {}),
    brand: {
      '@type': 'Brand',
      name: sd?.brand || opts.seller?.name?.[opts.locale] || opts.seller?.name?.en || 'NileLink Merchant',
    },
    offers: {
      '@type': 'Offer',
      url: resolveAbsoluteUrl(`/product/${product.slug}`, opts.baseOrigin),
      priceCurrency: 'USD',
      price: (opts.effectiveUsdCents / 100).toFixed(2),
      availability: opts.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      ...(sd?.priceValidUntil ? { priceValidUntil: sd.priceValidUntil } : {}),
      ...(opts.seller
        ? {
            seller: {
              '@type': 'Organization',
              name: opts.seller.name[opts.locale] || opts.seller.name.en,
            },
          }
        : {}),
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(product.rating || 5).toFixed(1),
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };
}

export function buildCampaignSchema(
  campaign: Campaign,
  opts: {
    locale: Locale;
    baseOrigin: string;
    override?: SeoEntityOverride;
  }
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SaleEvent',
    name: opts.override?.metaTitle?.[opts.locale] || campaign.title[opts.locale] || campaign.title.en,
    description:
      opts.override?.metaDescription?.[opts.locale] ||
      campaign.description?.[opts.locale] ||
      campaign.subtitle?.[opts.locale] ||
      '',
    url: resolveAbsoluteUrl(`/campaign/${campaign.slug}`, opts.baseOrigin),
    ...(campaign.heroImageUrl ? { image: resolveAbsoluteUrl(campaign.heroImageUrl, opts.baseOrigin) } : {}),
    ...(campaign.startsAt ? { startDate: campaign.startsAt } : {}),
    ...(campaign.endsAt ? { endDate: campaign.endsAt } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    organizer: {
      '@type': 'Organization',
      name: 'NileLink Marketplace',
      url: opts.baseOrigin,
    },
  };
}

export function buildStoreSchema(
  seller: Seller,
  opts: {
    locale: Locale;
    baseOrigin: string;
    override?: SeoEntityOverride;
  }
): Record<string, unknown> {
  const primaryLoc = seller.locations?.find((l) => l.isPrimary) || seller.locations?.[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: opts.override?.metaTitle?.[opts.locale] || seller.name[opts.locale] || seller.name.en,
    description: opts.override?.metaDescription?.[opts.locale] || seller.tagline?.[opts.locale] || seller.tagline?.en || '',
    url: resolveAbsoluteUrl(`/store/${seller.slug}`, opts.baseOrigin),
    ...(seller.bannerImage ? { image: resolveAbsoluteUrl(seller.bannerImage, opts.baseOrigin) } : {}),
    address: {
      '@type': 'PostalAddress',
      ...(primaryLoc?.address ? { streetAddress: primaryLoc.address } : {}),
      addressLocality: primaryLoc?.district || seller.district || seller.governorate,
      addressRegion: primaryLoc?.governorate || seller.governorate,
      addressCountry: 'LB',
    },
    ...(primaryLoc && Number.isFinite(primaryLoc.lat) && Number.isFinite(primaryLoc.lng)
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: primaryLoc.lat,
            longitude: primaryLoc.lng,
          },
        }
      : {}),
    ...(seller.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(seller.rating || 5).toFixed(1),
            reviewCount: seller.reviewCount,
          },
        }
      : {}),
  };
}

export function useSeoMetadata(input: SeoPageInput, deps: unknown[] = []): void {
  const { seoMetadata, locale } = useMarketplace();
  useEffect(() => {
    applySeoMetadata(input, seoMetadata, locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    seoMetadata,
    locale,
    input.entityType,
    input.entityKey,
    input.title,
    input.description,
    input.canonicalPath,
    input.ogType,
    input.ogImageUrl,
    input.robots,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...deps,
  ]);
}
