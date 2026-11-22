import React, { useEffect, useMemo, useState } from 'react';
import { Code2, ExternalLink, Globe, Search, Trash2 } from 'lucide-react';
import type {
  Campaign,
  Product,
  Seller,
  SeoEntityOverride,
  SeoEntityType,
  SeoMetadataConfig,
  SeoRobotsDirective,
} from '../../shared/types.ts';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { EmptyState, StatusLabel } from '../HairlineUI.tsx';

const CORE_PAGE_KEYS = [
  { key: 'home', label: 'Home Page (/)' },
  { key: 'catalog', label: 'Catalog Page (/catalog)' },
  { key: 'support', label: 'Support & FAQ (/support)' },
  { key: 'legal', label: 'Legal & Terms (/legal)' },
];

export function AdminSeoPanel({
  seoMetadata,
  products,
  campaigns,
  sellers,
  onReload,
}: {
  seoMetadata: SeoMetadataConfig;
  products: Product[];
  campaigns: Campaign[];
  sellers: Seller[];
  onReload: () => Promise<void>;
}) {
  const { apiFetch, showToast, setSeoMetadata, refreshBootstrap } = useMarketplace();

  // Global SEO draft
  const [siteName, setSiteName] = useState(seoMetadata.global.siteName);
  const [titleTemplate, setTitleTemplate] = useState(seoMetadata.global.titleTemplate);
  const [canonicalBaseUrl, setCanonicalBaseUrl] = useState(seoMetadata.global.canonicalBaseUrl);
  const [defTitleEn, setDefTitleEn] = useState(seoMetadata.global.defaultTitle.en);
  const [defTitleAr, setDefTitleAr] = useState(seoMetadata.global.defaultTitle.ar);
  const [defDescEn, setDefDescEn] = useState(seoMetadata.global.defaultDescription.en);
  const [defDescAr, setDefDescAr] = useState(seoMetadata.global.defaultDescription.ar);
  const [defOgImg, setDefOgImg] = useState(seoMetadata.global.defaultOgImageUrl);
  const [twitterCardType, setTwitterCardType] = useState<'summary' | 'summary_large_image'>(
    seoMetadata.global.twitterCardType
  );
  const [twitterSiteHandle, setTwitterSiteHandle] = useState(seoMetadata.global.twitterSiteHandle);
  const [orgName, setOrgName] = useState(seoMetadata.global.organizationJsonLd.name);
  const [orgLogo, setOrgLogo] = useState(seoMetadata.global.organizationJsonLd.logoUrl);
  const [orgPhone, setOrgPhone] = useState(seoMetadata.global.organizationJsonLd.contactPhone);
  const [orgEmail, setOrgEmail] = useState(seoMetadata.global.organizationJsonLd.contactEmail);
  const [orgSameAs, setOrgSameAs] = useState(seoMetadata.global.organizationJsonLd.sameAs.join('\n'));
  const [savingGlobal, setSavingGlobal] = useState(false);

  useEffect(() => {
    setSiteName(seoMetadata.global.siteName);
    setTitleTemplate(seoMetadata.global.titleTemplate);
    setCanonicalBaseUrl(seoMetadata.global.canonicalBaseUrl);
    setDefTitleEn(seoMetadata.global.defaultTitle.en);
    setDefTitleAr(seoMetadata.global.defaultTitle.ar);
    setDefDescEn(seoMetadata.global.defaultDescription.en);
    setDefDescAr(seoMetadata.global.defaultDescription.ar);
    setDefOgImg(seoMetadata.global.defaultOgImageUrl);
    setTwitterCardType(seoMetadata.global.twitterCardType);
    setTwitterSiteHandle(seoMetadata.global.twitterSiteHandle);
    setOrgName(seoMetadata.global.organizationJsonLd.name);
    setOrgLogo(seoMetadata.global.organizationJsonLd.logoUrl);
    setOrgPhone(seoMetadata.global.organizationJsonLd.contactPhone);
    setOrgEmail(seoMetadata.global.organizationJsonLd.contactEmail);
    setOrgSameAs(seoMetadata.global.organizationJsonLd.sameAs.join('\n'));
  }, [seoMetadata.global]);

  // Per-entity override editor
  const [entityType, setEntityType] = useState<SeoEntityType>('product');
  const [entityKey, setEntityKey] = useState<string>(products[0]?.slug || 'home');
  const [metaTitleEn, setMetaTitleEn] = useState('');
  const [metaTitleAr, setMetaTitleAr] = useState('');
  const [metaDescEn, setMetaDescEn] = useState('');
  const [metaDescAr, setMetaDescAr] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [robots, setRobots] = useState<SeoRobotsDirective>('index,follow');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [gtin, setGtin] = useState('');
  const [priceValidUntil, setPriceValidUntil] = useState('');
  const [customJson, setCustomJson] = useState('');
  const [savingOverride, setSavingOverride] = useState(false);

  const availableEntities = useMemo(() => {
    if (entityType === 'product') {
      return products.map((p) => ({
        key: p.slug || p.id,
        label: `${p.title.en} (${p.slug || p.id})`,
      }));
    }
    if (entityType === 'campaign') {
      return campaigns.map((c) => ({
        key: c.slug,
        label: `${c.title.en} (/campaign/${c.slug})`,
      }));
    }
    if (entityType === 'store') {
      return sellers.map((s) => ({
        key: s.slug,
        label: `${s.name.en} (/store/${s.slug})`,
      }));
    }
    return CORE_PAGE_KEYS;
  }, [entityType, products, campaigns, sellers]);

  const loadOverrideIntoForm = (type: SeoEntityType, key: string) => {
    setEntityType(type);
    setEntityKey(key);
    const match = seoMetadata.overrides.find((o) => o.entityType === type && o.entityKey === key);
    if (match) {
      setMetaTitleEn(match.metaTitle.en || '');
      setMetaTitleAr(match.metaTitle.ar || '');
      setMetaDescEn(match.metaDescription.en || '');
      setMetaDescAr(match.metaDescription.ar || '');
      setCanonicalUrl(match.canonicalUrl || '');
      setOgImageUrl(match.ogImageUrl || '');
      setRobots(match.robots || 'index,follow');
      setBrand(match.structuredData?.brand || '');
      setSku(match.structuredData?.sku || '');
      setGtin(match.structuredData?.gtin || '');
      setPriceValidUntil(match.structuredData?.priceValidUntil || '');
      setCustomJson(match.structuredData?.customJson || '');
      return;
    }

    // Populate clean defaults from underlying entity so admin edits fast
    setCanonicalUrl('');
    setRobots('index,follow');
    setBrand('');
    setSku('');
    setGtin('');
    setPriceValidUntil('');
    setCustomJson('');
    if (type === 'product') {
      const p = products.find((x) => x.slug === key || x.id === key);
      const seller = p ? sellers.find((s) => s.id === p.sellerId) : undefined;
      setMetaTitleEn(p?.title.en || '');
      setMetaTitleAr(p?.title.ar || '');
      setMetaDescEn(p?.description.en?.slice(0, 160) || '');
      setMetaDescAr(p?.description.ar?.slice(0, 160) || '');
      setOgImageUrl(p?.images[0] || '');
      setBrand(seller?.name.en || '');
      setSku(p?.variants[0]?.sku || '');
    } else if (type === 'campaign') {
      const c = campaigns.find((x) => x.slug === key);
      setMetaTitleEn(c?.title.en || '');
      setMetaTitleAr(c?.title.ar || '');
      setMetaDescEn(c?.description?.en?.slice(0, 160) || c?.subtitle?.en || '');
      setMetaDescAr(c?.description?.ar?.slice(0, 160) || c?.subtitle?.ar || '');
      setOgImageUrl(c?.heroImageUrl || '');
    } else if (type === 'store') {
      const s = sellers.find((x) => x.slug === key);
      setMetaTitleEn(s?.seoTitle || s?.name.en || '');
      setMetaTitleAr(s?.name.ar || '');
      setMetaDescEn(s?.seoDescription || s?.tagline?.en || '');
      setMetaDescAr(s?.tagline?.ar || '');
      setOgImageUrl(s?.bannerImage || s?.logoImage || '');
    } else {
      setMetaTitleEn('');
      setMetaTitleAr('');
      setMetaDescEn('');
      setMetaDescAr('');
      setOgImageUrl('');
    }
  };

  useEffect(() => {
    if (availableEntities.length > 0 && !availableEntities.some((x) => x.key === entityKey)) {
      loadOverrideIntoForm(entityType, availableEntities[0].key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, availableEntities.length]);

  const handleSaveGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGlobal(true);
    try {
      const sameAsList = orgSameAs
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await apiFetch<{ seoMetadata: SeoMetadataConfig }>('/api/admin/seo/global', {
        method: 'PUT',
        body: JSON.stringify({
          siteName: siteName.trim(),
          titleTemplate: titleTemplate.trim(),
          canonicalBaseUrl: canonicalBaseUrl.trim(),
          defaultTitle: { en: defTitleEn.trim(), ar: defTitleAr.trim() },
          defaultDescription: { en: defDescEn.trim(), ar: defDescAr.trim() },
          defaultOgImageUrl: defOgImg.trim(),
          twitterCardType,
          twitterSiteHandle: twitterSiteHandle.trim(),
          organizationJsonLd: {
            name: orgName.trim(),
            logoUrl: orgLogo.trim(),
            contactPhone: orgPhone.trim(),
            contactEmail: orgEmail.trim(),
            sameAs: sameAsList,
          },
        }),
      });
      setSeoMetadata(res.seoMetadata);
      showToast('Global SEO defaults & Organization JSON-LD saved', 'success');
      await onReload();
      await refreshBootstrap();
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSavingGlobal(false);
    }
  };

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityKey.trim()) {
      showToast('Select or enter a target entity key/slug.', 'error');
      return;
    }
    if (customJson.trim()) {
      try {
        const parsed = JSON.parse(customJson);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          showToast('Custom JSON-LD must be a JSON object ({ ... }).', 'error');
          return;
        }
      } catch {
        showToast('Custom JSON-LD contains invalid JSON syntax.', 'error');
        return;
      }
    }
    setSavingOverride(true);
    try {
      const res = await apiFetch<{ seoMetadata: SeoMetadataConfig }>('/api/admin/seo/override', {
        method: 'PUT',
        body: JSON.stringify({
          entityType,
          entityKey: entityKey.trim(),
          metaTitle: { en: metaTitleEn.trim(), ar: metaTitleAr.trim() },
          metaDescription: { en: metaDescEn.trim(), ar: metaDescAr.trim() },
          canonicalUrl: canonicalUrl.trim(),
          ogImageUrl: ogImageUrl.trim(),
          robots,
          structuredData: {
            brand: brand.trim() || undefined,
            sku: sku.trim() || undefined,
            gtin: gtin.trim() || undefined,
            priceValidUntil: priceValidUntil.trim() || undefined,
            customJson: customJson.trim() || undefined,
          },
        }),
      });
      setSeoMetadata(res.seoMetadata);
      showToast(`SEO override saved for ${entityType}: ${entityKey}`, 'success');
      await onReload();
      await refreshBootstrap();
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSavingOverride(false);
    }
  };

  const handleDeleteOverride = async (ov: SeoEntityOverride) => {
    try {
      const res = await apiFetch<{ seoMetadata: SeoMetadataConfig }>('/api/admin/seo/override', {
        method: 'DELETE',
        body: JSON.stringify({ entityType: ov.entityType, entityKey: ov.entityKey }),
      });
      setSeoMetadata(res.seoMetadata);
      showToast(`Removed SEO override for ${ov.entityType}: ${ov.entityKey}`, 'info');
      await onReload();
      await refreshBootstrap();
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  };

  const previewTitle = (metaTitleEn || defTitleEn || siteName).slice(0, 65);
  const previewDesc = (metaDescEn || defDescEn).slice(0, 158);
  const previewCanonical =
    canonicalUrl.trim() ||
    `${canonicalBaseUrl.replace(/\/$/, '') || 'https://nilelink.lb'}/${
      entityType === 'page'
        ? entityKey === 'home'
          ? ''
          : entityKey
        : entityType === 'product'
          ? `product/${entityKey}`
          : entityType === 'campaign'
            ? `campaign/${entityKey}`
            : `store/${entityKey}`
    }`;

  return (
    <div className="space-y-6">
      {/* Crawlability & Indexing Status Strip */}
      <div className="border border-[var(--line)] bg-[var(--graphite)] p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-[var(--cyan)]">
            <Globe className="w-4 h-4" />
            <span>Dynamic SEO, Canonical &amp; Schema.org JSON-LD Utility</span>
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage global defaults, canonical base domains, OpenGraph cards, robots indexing rules, and Schema.org Product/Campaign/Store JSON-LD metadata.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-mono-tabular">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)]"
          >
            <span>Inspect /sitemap.xml</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)]"
          >
            <span>Inspect /robots.txt</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="hairline-grid grid-cols-1 lg:grid-cols-12">
        {/* Global SEO & Organization Schema */}
        <form onSubmit={handleSaveGlobal} className="hairline-cell lg:col-span-5 p-6 space-y-3 text-xs">
          <h3 className="font-display text-xl font-bold text-[var(--bone)]">
            Global Defaults &amp; Organization Schema
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Site Brand Name</span>
              <input
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-[var(--bone)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Title Template (%s)</span>
              <input
                required
                value={titleTemplate}
                onChange={(e) => setTitleTemplate(e.target.value)}
                placeholder="%s · NileLink"
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 font-mono-tabular text-[var(--bone)]"
              />
            </label>
          </div>

          <label className="block space-y-1">
            <span className="font-mono-tabular text-[var(--muted)]">Canonical Production Origin URL</span>
            <input
              value={canonicalBaseUrl}
              onChange={(e) => setCanonicalBaseUrl(e.target.value)}
              placeholder="https://nilelink.lb"
              className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 font-mono-tabular text-[var(--bone)]"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Default Title (EN)</span>
              <input
                value={defTitleEn}
                onChange={(e) => setDefTitleEn(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-[var(--bone)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Default Title (AR)</span>
              <input
                dir="rtl"
                value={defTitleAr}
                onChange={(e) => setDefTitleAr(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-[var(--bone)]"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Default Description (EN)</span>
              <textarea
                rows={2}
                value={defDescEn}
                onChange={(e) => setDefDescEn(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] p-2 text-[var(--bone)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Default Description (AR)</span>
              <textarea
                rows={2}
                dir="rtl"
                value={defDescAr}
                onChange={(e) => setDefDescAr(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] p-2 text-[var(--bone)]"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Default OG Image Path/URL</span>
              <input
                value={defOgImg}
                onChange={(e) => setDefOgImg(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 font-mono-tabular text-[var(--bone)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Twitter Card / Handle</span>
              <div className="flex gap-1.5">
                <select
                  value={twitterCardType}
                  onChange={(e) => setTwitterCardType(e.target.value as 'summary' | 'summary_large_image')}
                  className="w-1/2 bg-[var(--ink)] border border-[var(--line)] px-2 py-2 text-[var(--bone)]"
                >
                  <option value="summary_large_image">Large Image</option>
                  <option value="summary">Summary</option>
                </select>
                <input
                  value={twitterSiteHandle}
                  onChange={(e) => setTwitterSiteHandle(e.target.value)}
                  placeholder="@nilelinklb"
                  className="w-1/2 bg-[var(--ink)] border border-[var(--line)] px-2 py-2 font-mono-tabular text-[var(--bone)]"
                />
              </div>
            </label>
          </div>

          <div className="pt-3 border-t border-[var(--line)] space-y-2">
            <p className="font-mono-tabular uppercase text-[11px] text-[var(--ember)]">
              Organization JSON-LD Identity
            </p>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Organization Name"
                className="bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-[var(--bone)]"
              />
              <input
                value={orgLogo}
                onChange={(e) => setOrgLogo(e.target.value)}
                placeholder="Logo URL or /src/assets/..."
                className="bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 font-mono-tabular text-[var(--bone)]"
              />
              <input
                value={orgPhone}
                onChange={(e) => setOrgPhone(e.target.value)}
                placeholder="+961 1 000 000"
                className="bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 font-mono-tabular text-[var(--bone)]"
              />
              <input
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
                placeholder="support@nilelink.lb"
                className="bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 font-mono-tabular text-[var(--bone)]"
              />
            </div>
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Social Profiles (`sameAs` URLs, one per line)</span>
              <textarea
                rows={2}
                value={orgSameAs}
                onChange={(e) => setOrgSameAs(e.target.value)}
                placeholder="https://instagram.com/nilelinklb"
                className="w-full bg-[var(--ink)] border border-[var(--line)] p-2 font-mono-tabular text-[var(--bone)]"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={savingGlobal}
            className="w-full py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] font-bold uppercase cursor-pointer"
          >
            {savingGlobal ? 'Saving Global SEO...' : 'Save Global SEO & Schema'}
          </button>
        </form>

        {/* Per-Product / Campaign / Store / Page Override Editor */}
        <form onSubmit={handleSaveOverride} className="hairline-cell lg:col-span-7 p-6 space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-xl font-bold text-[var(--bone)]">
              Product, Campaign &amp; Page SEO Overrides
            </h3>
            <span className="font-mono-tabular text-[var(--muted)]">
              Active overrides: {seoMetadata.overrides.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Entity Type</span>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value as SeoEntityType)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-[var(--bone)]"
              >
                <option value="product">Product Page</option>
                <option value="campaign">Campaign Page</option>
                <option value="store">Seller Storefront</option>
                <option value="page">Core Marketplace Page</option>
              </select>
            </label>
            <label className="block space-y-1 sm:col-span-2">
              <span className="font-mono-tabular text-[var(--muted)]">Select Target Entity</span>
              <select
                value={entityKey}
                onChange={(e) => loadOverrideIntoForm(entityType, e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-[var(--bone)]"
              >
                {availableEntities.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Meta Title (EN) · {metaTitleEn.length}/60</span>
              <input
                value={metaTitleEn}
                onChange={(e) => setMetaTitleEn(e.target.value)}
                placeholder="Keyword-rich product or campaign title"
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-[var(--bone)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Meta Title (AR)</span>
              <input
                dir="rtl"
                value={metaTitleAr}
                onChange={(e) => setMetaTitleAr(e.target.value)}
                placeholder="عنوان الصفحة لمحركات البحث"
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-[var(--bone)]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Meta Description (EN) · {metaDescEn.length}/160</span>
              <textarea
                rows={2}
                value={metaDescEn}
                onChange={(e) => setMetaDescEn(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] p-2 text-[var(--bone)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Meta Description (AR)</span>
              <textarea
                rows={2}
                dir="rtl"
                value={metaDescAr}
                onChange={(e) => setMetaDescAr(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] p-2 text-[var(--bone)]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Canonical URL Override</span>
              <input
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="Auto-resolved if blank"
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 font-mono-tabular text-[var(--bone)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Social OG Image URL</span>
              <input
                value={ogImageUrl}
                onChange={(e) => setOgImageUrl(e.target.value)}
                placeholder="/src/assets/... or https://..."
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 font-mono-tabular text-[var(--bone)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">Robots Indexing Directive</span>
              <select
                value={robots}
                onChange={(e) => setRobots(e.target.value as SeoRobotsDirective)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 font-mono-tabular text-[var(--bone)]"
              >
                <option value="index,follow">index,follow (Index + Sitemap)</option>
                <option value="noindex,follow">noindex,follow (Exclude from index)</option>
                <option value="index,nofollow">index,nofollow</option>
                <option value="noindex,nofollow">noindex,nofollow</option>
              </select>
            </label>
          </div>

          <div className="border border-[var(--line)] bg-[var(--ink)] p-3 space-y-2">
            <p className="font-mono-tabular uppercase text-[11px] text-[var(--gold)] inline-flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Schema.org JSON-LD Enrichment
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Brand (Schema)"
                className="bg-[var(--graphite)] border border-[var(--line)] px-2 py-1.5 text-[var(--bone)]"
              />
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU"
                className="bg-[var(--graphite)] border border-[var(--line)] px-2 py-1.5 font-mono-tabular text-[var(--bone)]"
              />
              <input
                value={gtin}
                onChange={(e) => setGtin(e.target.value)}
                placeholder="GTIN / EAN"
                className="bg-[var(--graphite)] border border-[var(--line)] px-2 py-1.5 font-mono-tabular text-[var(--bone)]"
              />
              <input
                type="date"
                value={priceValidUntil}
                onChange={(e) => setPriceValidUntil(e.target.value)}
                aria-label="Price valid until"
                className="bg-[var(--graphite)] border border-[var(--line)] px-2 py-1.5 font-mono-tabular text-[var(--bone)]"
              />
            </div>
            <label className="block space-y-1">
              <span className="font-mono-tabular text-[var(--muted)]">
                Extra JSON-LD Properties (merged cleanly into page schema object)
              </span>
              <textarea
                rows={2}
                value={customJson}
                onChange={(e) => setCustomJson(e.target.value)}
                placeholder='{"countryOfOrigin": "LB", "material": "Brushed Aluminum"}'
                className="w-full bg-[var(--graphite)] border border-[var(--line)] p-2 font-mono-tabular text-[var(--bone)]"
              />
            </label>
          </div>

          {/* Live SERP & Social Preview */}
          <div className="border border-[var(--line)] bg-[var(--ink)] p-3 space-y-1">
            <p className="text-[10px] font-mono-tabular uppercase text-[var(--muted)] inline-flex items-center gap-1">
              <Search className="w-3 h-3" /> Live Search Snippet Preview
            </p>
            <p className="text-[11px] font-mono-tabular text-[var(--cedar)] truncate">{previewCanonical}</p>
            <p className="text-base font-bold text-[#8AB4F8] truncate">{previewTitle}</p>
            <p className="text-xs text-[var(--muted)] line-clamp-2">{previewDesc}</p>
          </div>

          <button
            type="submit"
            disabled={savingOverride}
            className="px-5 py-2.5 bg-[var(--cedar)] text-[#17181B] font-bold uppercase cursor-pointer"
          >
            {savingOverride ? 'Saving Override...' : `Save ${entityType.toUpperCase()} SEO Override`}
          </button>
        </form>
      </div>

      {/* Overrides Directory */}
      <div className="border border-[var(--line)] bg-[var(--graphite)] p-5 space-y-3">
        <h3 className="font-display text-lg font-bold text-[var(--bone)]">
          Saved SEO &amp; Schema Overrides ({seoMetadata.overrides.length})
        </h3>
        {seoMetadata.overrides.length === 0 ? (
          <EmptyState
            title="No custom SEO overrides configured yet"
            description="Every page automatically inherits dynamic titles, canonical tags, and Schema.org JSON-LD. Add an override above to customize any product, campaign, or store."
          />
        ) : (
          <div className="divide-y divide-[var(--line)] border border-[var(--line)]">
            {seoMetadata.overrides.map((ov) => (
              <div key={ov.id} className="p-3.5 bg-[var(--ink)] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono-tabular">
                    <StatusLabel status={ov.entityType} tone="gold" />
                    <span className="text-[var(--bone)] font-bold">{ov.entityKey}</span>
                    <StatusLabel status={ov.robots} tone={ov.robots.startsWith('noindex') ? 'ember' : 'cedar'} />
                  </div>
                  <p className="text-[var(--bone)] truncate">{ov.metaTitle.en || '(Default title inherited)'}</p>
                  <p className="text-[var(--muted)] font-mono-tabular text-[11px] truncate">
                    {ov.canonicalUrl || 'Auto canonical'}
                    {ov.structuredData?.sku ? ` · SKU: ${ov.structuredData.sku}` : ''}
                    {ov.structuredData?.brand ? ` · Brand: ${ov.structuredData.brand}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadOverrideIntoForm(ov.entityType, ov.entityKey)}
                    className="px-3 py-1.5 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)] cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteOverride(ov)}
                    aria-label="Delete SEO override"
                    className="p-1.5 border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ember)] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
