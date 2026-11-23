import React, { useEffect, useMemo, useState } from 'react';
import { Heart, LayoutGrid, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import type { NaturalSearchParsed, Product } from '../shared/types.ts';
import { LEBANON_GOVERNORATES } from '../shared/lebanon.ts';
import { useMarketplace } from '../context/MarketplaceContext.tsx';
import { EmptyState, ProductCard, SectionHeading, SkeletonCell } from '../components/HairlineUI.tsx';
import { OfferBannerStrip } from '../components/OfferBannerStrip.tsx';
import { FeaturedPlacementStrip } from '../components/FeaturedPlacementStrip.tsx';
import { StoreLocationsMap } from '../components/maps/StoreLocationsMap.tsx';
import { buildBreadcrumbSchema, resolveAbsoluteUrl, resolveBaseOrigin, useSeoMetadata } from '../utils/seo.ts';

export function CatalogPage({ initialView = 'products' }: { initialView?: 'products' | 'stores-map' }) {
  const { route, locale, t, sellers, navigate, seoMetadata, wishlist } = useMarketplace();
  const params = new URLSearchParams(route.split('?')[1] || '');

  const [viewMode, setViewMode] = useState<'products' | 'stores-map'>(
    params.get('view') === 'stores-map' ? 'stores-map' : initialView
  );
  const [mapGovernorate, setMapGovernorate] = useState('');
  const [query, setQuery] = useState(params.get('q') || '');
  const [department, setDepartment] = useState(params.get('department') || '');
  const [dealsOnly, setDealsOnly] = useState(params.get('deals') === 'true' || params.get('deals') === '1');
  const [inStockOnly, setInStockOnly] = useState(params.get('inStock') === 'true' || params.get('inStock') === '1');
  const [wishlistOnly, setWishlistOnly] = useState(params.get('wishlist') === 'true' || params.get('wishlist') === '1');
  const [sort, setSort] = useState(params.get('sort') || 'featured');
  const [sellerId, setSellerId] = useState(params.get('sellerId') || '');
  const [items, setItems] = useState<Product[]>([]);
  const [parsed, setParsed] = useState<NaturalSearchParsed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = new URLSearchParams(route.split('?')[1] || '');
    const pathname = route.split('?')[0] || '';
    if (pathname === '/stores' || p.get('view') === 'stores-map') {
      setViewMode('stores-map');
    } else if (initialView === 'products') {
      setViewMode('products');
    }
    setQuery(p.get('q') || '');
    setDepartment(p.get('department') || '');
    setDealsOnly(p.get('deals') === 'true' || p.get('deals') === '1');
    setInStockOnly(p.get('inStock') === 'true' || p.get('inStock') === '1');
    setWishlistOnly(p.get('wishlist') === 'true' || p.get('wishlist') === '1');
    setSort(p.get('sort') || 'featured');
    setSellerId(p.get('sellerId') || '');
  }, [route, initialView]);

  const deptLabel = useMemo(() => {
    if (department === 'fashion') return t.fashionTitle;
    if (department === 'electronics') return t.electronicsTitle;
    if (department === 'home-gadgets') return t.homeTitle;
    return '';
  }, [department, t]);

  const visibleItems = useMemo(
    () => (wishlistOnly ? items.filter((p) => wishlist.includes(p.id)) : items),
    [items, wishlistOnly, wishlist]
  );

  const baseOrigin = resolveBaseOrigin(seoMetadata?.global.canonicalBaseUrl);
  const canonicalPath = wishlistOnly
    ? '/catalog?wishlist=true'
    : dealsOnly
      ? '/catalog?deals=true'
      : department
        ? `/catalog?department=${encodeURIComponent(department)}`
        : '/catalog';
  useSeoMetadata(
    {
      entityType: 'page',
      entityKey: department ? `category_${department}` : 'catalog',
      title: wishlistOnly
        ? locale === 'ar'
          ? 'قائمة المفضلة'
          : 'Saved Wishlist'
        : dealsOnly
          ? locale === 'ar'
            ? 'العروض والتخفيضات النشطة'
            : 'Active Marketplace Deals'
          : deptLabel
            ? `${deptLabel} — ${t.allProducts}`
            : viewMode === 'stores-map'
              ? locale === 'ar'
                ? 'خريطة المتاجر اللبنانية'
                : 'Lebanon Verified Store Locator'
              : t.allProducts,
      description: deptLabel
        ? locale === 'ar'
          ? `تصفح قسم ${deptLabel} من المتاجر اللبنانية الموثقة مع تسعير مزدوج بالدولار والليرة وتوصيل لجميع المحافظات.`
          : `Shop curated ${deptLabel} from verified Lebanese merchants with dual USD/LBP pricing and nationwide delivery.`
        : locale === 'ar'
          ? 'استكشف منتجات التجار اللبنانيين المعتمدين بالبحث الطبيعي والأسعار بالدولار والليرة.'
          : 'Browse verified Lebanese merchant inventory with natural-language search and dual USD/LBP pricing.',
      canonicalPath,
      ogImageUrl: visibleItems[0]?.images[0],
      robots: wishlistOnly ? 'noindex,follow' : 'index,follow',
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: deptLabel || t.allProducts,
          url: resolveAbsoluteUrl(canonicalPath, baseOrigin),
          numberOfItems: visibleItems.length,
        },
        buildBreadcrumbSchema(
          [
            { name: t.brand, path: '/' },
            { name: t.navCatalog, path: '/catalog' },
            ...(deptLabel ? [{ name: deptLabel, path: `/catalog?department=${encodeURIComponent(department)}` }] : []),
          ],
          baseOrigin
        ),
      ],
    },
    [department, deptLabel, dealsOnly, wishlistOnly, viewMode, visibleItems.length, locale]
  );

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const qs = new URLSearchParams();
      if (query.trim()) qs.set('q', query.trim());
      if (department) qs.set('department', department);
      if (sellerId) qs.set('sellerId', sellerId);
      if (dealsOnly) qs.set('deals', 'true');
      if (inStockOnly) qs.set('inStock', 'true');
      if (sort) qs.set('sort', sort);

      try {
        const res = await fetch(`/api/products?${qs.toString()}`);
        const data = await res.json();
        if (active) {
          setItems(data.products || []);
          setParsed(data.parsedQuery || null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [query, department, sellerId, dealsOnly, inStockOnly, sort]);

  const clearFilters = () => {
    setQuery('');
    setDepartment('');
    setSellerId('');
    setDealsOnly(false);
    setInStockOnly(false);
    setWishlistOnly(false);
    setSort('featured');
    navigate('/catalog');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 space-y-6">
      <OfferBannerStrip page="catalog" placement="page_strip" />
      <OfferBannerStrip page="catalog" placement="category_header" categorySlug={department || undefined} />
      <FeaturedPlacementStrip
        slots={query.trim() ? ['search_promoted', 'catalog_top_sponsored'] : ['catalog_top_sponsored', 'category_top_spotlight']}
        headingEn="Sponsored & Promoted"
        headingAr="منتجات ومتاجر مميزة"
      />
      <OfferBannerStrip page="catalog" placement="inline_card" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          title={viewMode === 'stores-map' ? (locale === 'ar' ? 'خريطة المتاجر في لبنان' : 'Lebanon Store Locator Map') : t.allProducts}
          subtitle={
            viewMode === 'stores-map'
              ? locale === 'ar'
                ? 'استكشف فروع ومواقع التجار المعتمدين عبر جميع المحافظات اللبنانية.'
                : 'Explore verified independent merchant branches and pickup points across Lebanon.'
              : locale === 'ar'
                ? 'جرّب البحث الطبيعي مثل "black sneakers size 42 under $60" أو استخدم الفلاتر المباشرة.'
                : 'Try natural-language queries like "black sneakers size 42 under $60" or filter directly below.'
          }
        />

        <div className="inline-flex border border-[var(--line)] bg-[var(--graphite)] shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('products')}
            className={`px-3.5 py-2 text-xs font-mono-tabular uppercase inline-flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'products'
                ? 'bg-[var(--ember)] text-[var(--ember-fg)] font-semibold'
                : 'text-[var(--bone)] hover:text-[var(--ember)]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{locale === 'ar' ? 'المنتجات' : 'Products'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('stores-map')}
            className={`px-3.5 py-2 text-xs font-mono-tabular uppercase inline-flex items-center gap-1.5 border-s border-[var(--line)] cursor-pointer ${
              viewMode === 'stores-map'
                ? 'bg-[var(--ember)] text-[var(--ember-fg)] font-semibold'
                : 'text-[var(--bone)] hover:text-[var(--ember)]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              {locale === 'ar' ? 'خريطة المتاجر' : 'Stores Map'} ({sellers.length})
            </span>
          </button>
        </div>
      </div>

      {/* Sticky Dense Filter & Natural Search Bar */}
      <div className="hairline-grid grid-cols-1 lg:grid-cols-12">
        <div className="hairline-cell lg:col-span-5 p-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-[var(--muted)] shrink-0" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label="Filter catalog by keyword or natural query"
            className="w-full bg-transparent text-sm text-[var(--bone)] placeholder:text-[var(--muted)] focus:outline-none"
          />
        </div>

        <div className="hairline-cell lg:col-span-7 p-3 flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[var(--muted)] me-1" aria-hidden="true" />
          {[
            { id: '', label: locale === 'ar' ? 'الكل' : 'All' },
            { id: 'fashion', label: t.fashionTitle },
            { id: 'electronics', label: t.electronicsTitle },
            { id: 'home-gadgets', label: t.homeTitle },
          ].map((tab) => (
            <button
              key={tab.id || 'all'}
              type="button"
              onClick={() => setDepartment(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                department === tab.id
                  ? 'border-[var(--ember)] bg-[var(--ember)] text-[var(--ember-fg)] font-semibold'
                  : 'border-[var(--line)] text-[var(--bone)] hover:border-[var(--bone)]'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setDealsOnly((v) => !v)}
            className={`px-3 py-1.5 text-xs font-medium border whitespace-nowrap shrink-0 cursor-pointer ${
              dealsOnly
                ? 'border-[var(--gold)] text-[var(--gold)]'
                : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--bone)]'
            }`}
          >
            {t.navDeals}
          </button>

          <button
            type="button"
            onClick={() => setInStockOnly((v) => !v)}
            className={`px-3 py-1.5 text-xs font-medium border whitespace-nowrap shrink-0 cursor-pointer ${
              inStockOnly
                ? 'border-[var(--cedar)] text-[var(--cedar)]'
                : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--bone)]'
            }`}
          >
            {t.filterInStock}
          </button>

          <button
            type="button"
            onClick={() => setWishlistOnly((v) => !v)}
            className={`px-3 py-1.5 text-xs font-medium border inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              wishlistOnly
                ? 'border-[var(--ember)] text-[var(--ember)] font-semibold'
                : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--bone)]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlistOnly ? 'fill-[var(--ember)] text-[var(--ember)]' : ''}`} aria-hidden="true" />
            <span>{locale === 'ar' ? `المفضلة (${wishlist.length})` : `Wishlist (${wishlist.length})`}</span>
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label={t.sortBy}
            className="ms-auto bg-[var(--ink)] border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--bone)] cursor-pointer"
          >
            <option value="featured">{t.sortFeatured}</option>
            <option value="price_asc">{t.sortPriceAsc}</option>
            <option value="price_desc">{t.sortPriceDesc}</option>
            <option value="rating">{t.sortRating}</option>
          </select>
        </div>
      </div>

      {/* Natural Language & Seller Filter Notices */}
      {(sellerId || (parsed && (parsed.maxPriceUsdCents || parsed.size || parsed.color || parsed.department))) && (
        <div className="border border-[var(--line)] bg-[var(--graphite)] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tabular">
          <div className="flex flex-wrap items-center gap-3">
            {sellerId && (
              <span className="text-[var(--gold)] font-semibold">
                {locale === 'ar' ? 'المتجر:' : 'Store:'}{' '}
                {sellers.find((s) => s.id === sellerId)?.name[locale] || sellerId}
              </span>
            )}
            {parsed && (parsed.maxPriceUsdCents || parsed.size || parsed.color || parsed.department) && (
              <>
                <span className="text-[var(--cedar)] font-semibold">{t.naturalMatch}:</span>
                {parsed.department && <span>dept={parsed.department}</span>}
                {parsed.color && <span>color={parsed.color}</span>}
                {parsed.size && <span>size={parsed.size}</span>}
                {parsed.maxPriceUsdCents && <span>max=${(parsed.maxPriceUsdCents / 100).toFixed(0)}</span>}
              </>
            )}
          </div>
          {sellerId && (
            <button
              type="button"
              onClick={() => setSellerId('')}
              className="text-[var(--ember)] hover:underline cursor-pointer"
            >
              {locale === 'ar' ? 'إزالة فلتر المتجر' : 'Clear Store Filter'}
            </button>
          )}
        </div>
      )}

      {/* Dense Scannable Product Grid */}
      {viewMode === 'stores-map' ? (
        <StoreLocatorSection
          sellers={sellers}
          department={department}
          mapGovernorate={mapGovernorate}
          onChangeGovernorate={setMapGovernorate}
          locale={locale}
        />
      ) : loading ? (
        <div className="hairline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCell />
          <SkeletonCell />
          <SkeletonCell />
        </div>
      ) : visibleItems.length === 0 ? (
        <EmptyState
          title={
            wishlistOnly
              ? locale === 'ar'
                ? 'قائمة المفضلة فارغة حالياً'
                : 'Your wishlist is empty'
              : locale === 'ar'
                ? 'لم يتم العثور على منتجات مطابقة'
                : 'No matching products'
          }
          description={
            wishlistOnly
              ? locale === 'ar'
                ? 'اضغط على أيقونة القلب على أي منتج لحفظه هنا.'
                : 'Tap the heart icon on any product card to save items for later.'
              : locale === 'ar'
                ? 'حاول توسيع نطاق السعر أو إزالة أحد الفلاتر.'
                : 'Try clearing active filters or adjusting your natural-language query.'
          }
          actionLabel={locale === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
          onAction={clearFilters}
        />
      ) : (
        <div className="hairline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              seller={sellers.find((s) => s.id === product.sellerId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StoreLocatorSection({
  sellers,
  department,
  mapGovernorate,
  onChangeGovernorate,
  locale,
}: {
  sellers: ReturnType<typeof useMarketplace>['sellers'];
  department: string;
  mapGovernorate: string;
  onChangeGovernorate: (g: string) => void;
  locale: 'en' | 'ar';
}) {
  const filteredSellers = useMemo(() => {
    return sellers.filter((s) => {
      if (department && s.department !== department) return false;
      if (mapGovernorate) {
        const matchesLoc = (s.locations || []).some((l) => l.governorate === mapGovernorate);
        if (!matchesLoc && s.governorate !== mapGovernorate) return false;
      }
      return true;
    });
  }, [sellers, department, mapGovernorate]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-[var(--line)] bg-[var(--graphite)] px-4 py-3 text-xs">
        <span className="font-mono-tabular uppercase text-[var(--muted)]">
          {locale === 'ar' ? 'تصفية حسب المحافظة:' : 'Filter by Governorate:'}
        </span>
        <select
          value={mapGovernorate}
          onChange={(e) => onChangeGovernorate(e.target.value)}
          aria-label="Filter map by governorate"
          className="bg-[var(--ink)] border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--bone)]"
        >
          <option value="">{locale === 'ar' ? 'جميع المحافظات' : 'All Lebanese Governorates'}</option>
          {LEBANON_GOVERNORATES.map((g) => (
            <option key={g.code} value={g.code}>
              {g.name[locale]}
            </option>
          ))}
        </select>
      </div>

      {filteredSellers.length === 0 ? (
        <EmptyState
          title={locale === 'ar' ? 'لا توجد متاجر مطابقة' : 'No matching stores'}
          description={
            locale === 'ar'
              ? 'جرّب اختيار جميع المحافظات أو إزالة فلتر القسم.'
              : 'Try switching back to All Governorates or clearing the department filter.'
          }
        />
      ) : (
        <StoreLocationsMap sellers={filteredSellers} heightClass="h-[440px]" showDirectoryList />
      )}
    </div>
  );
}
