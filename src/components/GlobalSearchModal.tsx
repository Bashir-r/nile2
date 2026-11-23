import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, FolderKanban, Package, Search, Store, X } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext.tsx';
import { searchMarketplaceEntities, type SearchScope, type UnifiedSearchHit } from '../shared/fuzzySearch.ts';
import { PriceDisplay } from './HairlineUI.tsx';

export function GlobalSearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    sellers,
    categories,
    offers,
    flashSales,
    locale,
    t,
    navigate,
  } = useMarketplace();

  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<SearchScope>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcuts: Cmd/Ctrl+K toggles modal; "/" opens modal when not inside a text field
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }
      if (e.key === '/' && !isSearchOpen && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) {
          return;
        }
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Manage focus entry & restoration
  useEffect(() => {
    if (isSearchOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 20);
      return () => window.clearTimeout(timer);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus?.();
      previousFocusRef.current = null;
    }
  }, [isSearchOpen]);

  const results = useMemo(
    () =>
      searchMarketplaceEntities({
        query,
        products,
        sellers,
        categories,
        offers,
        flashSales,
        locale,
        scope,
        limitPerGroup: 6,
      }),
    [query, products, sellers, categories, offers, flashSales, locale, scope]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query, scope, isSearchOpen]);

  const closeModal = () => {
    setIsSearchOpen(false);
  };

  const handleSelectHit = (hit: UnifiedSearchHit) => {
    setIsSearchOpen(false);
    navigate(hit.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    const total = results.orderedHits.length;
    if (total === 0) {
      if (e.key === 'Enter' && query.trim()) {
        e.preventDefault();
        setIsSearchOpen(false);
        navigate(`/catalog?q=${encodeURIComponent(query.trim())}`);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % total);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + total) % total);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results.orderedHits[activeIndex] || results.orderedHits[0];
      if (target) {
        handleSelectHit(target);
      } else if (query.trim()) {
        setIsSearchOpen(false);
        navigate(`/catalog?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  useEffect(() => {
    if (!isSearchOpen || !listRef.current) return;
    const activeEl = listRef.current.querySelector(`[data-hit-idx="${activeIndex}"]`) as HTMLElement | null;
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isSearchOpen]);

  if (!isSearchOpen) return null;

  const isAr = locale === 'ar';
  const hitIndexMap = new Map<string, number>();
  results.orderedHits.forEach((hit, idx) => {
    hitIndexMap.set(`${hit.kind}:${hit.id}`, idx);
  });

  const scopes: Array<{ id: SearchScope; label: string }> = [
    { id: 'all', label: t.globalSearchAll },
    { id: 'products', label: t.globalSearchProducts },
    { id: 'stores', label: t.globalSearchStores },
    { id: 'categories', label: t.globalSearchCategories },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 pt-12 md:pt-20 px-4"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isAr ? 'البحث الشامل في المتجر' : 'Global marketplace fuzzy search'}
        className="w-full max-w-2xl border border-[var(--line)] bg-[var(--graphite)] text-[var(--bone)] flex flex-col max-h-[80vh]"
      >
        {/* Top Input Row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--line)] bg-[var(--ink)]">
          <Search className="w-4 h-4 text-[var(--ember)] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.globalSearchPlaceholder}
            aria-label={t.globalSearchPlaceholder}
            className="flex-1 bg-transparent text-sm text-[var(--bone)] placeholder:text-[var(--muted)] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label={isAr ? 'مسح البحث' : 'Clear search'}
              className="p-1 text-[var(--muted)] hover:text-[var(--bone)] cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={closeModal}
            aria-label={isAr ? 'إغلاق البحث' : 'Close search'}
            className="border border-[var(--line)] px-2 py-0.5 text-[10px] font-mono-tabular text-[var(--muted)] hover:text-[var(--bone)] hover:border-[var(--ember)] cursor-pointer shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Scope Filter Tabs */}
        <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-[var(--line)] bg-[var(--graphite)] overflow-x-auto">
          <div className="flex items-center gap-1.5" role="tablist" aria-label={isAr ? 'نطاق البحث' : 'Search scope'}>
            {scopes.map((sc) => {
              const active = scope === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setScope(sc.id)}
                  className={`px-2.5 py-1 text-xs font-medium border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    active
                      ? 'border-[var(--ember)] bg-[var(--ember)] text-[var(--ember-fg)] font-semibold'
                      : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--bone)] hover:border-[var(--bone)]'
                  }`}
                >
                  {sc.label}
                </button>
              );
            })}
          </div>
          <span className="text-[11px] font-mono-tabular text-[var(--muted)] shrink-0">
            {query.trim()
              ? isAr
                ? `${results.totalCount} نتيجة`
                : `${results.totalCount} matches`
              : t.globalSearchSuggestions}
          </span>
        </div>

        {/* Results Body */}
        <div ref={listRef} className="flex-1 overflow-y-auto divide-y divide-[var(--line)]" role="listbox">
          {results.orderedHits.length === 0 ? (
            <div className="px-6 py-12 text-center space-y-3">
              <p className="text-sm text-[var(--muted)]">{t.globalSearchEmpty}</p>
              {query.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigate(`/catalog?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="inline-flex items-center gap-2 border border-[var(--ember)] px-3 py-1.5 text-xs font-semibold text-[var(--ember)] hover:bg-[var(--ember)] hover:text-[var(--ember-fg)] cursor-pointer"
                >
                  <span>{t.globalSearchViewAll}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Products Group */}
              {results.products.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--muted)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[var(--ember)]" aria-hidden="true" />
                      {t.globalSearchProducts}
                    </span>
                    <span>{results.products.length}</span>
                  </div>
                  {results.products.map((hit) => {
                    const idx = hitIndexMap.get(`product:${hit.id}`) ?? -1;
                    const active = idx === activeIndex;
                    const p = hit.product;
                    const img = p.images?.[0];
                    return (
                      <button
                        key={p.id}
                        type="button"
                        role="option"
                        aria-selected={active}
                        data-hit-idx={idx}
                        onMouseEnter={() => idx >= 0 && setActiveIndex(idx)}
                        onClick={() => handleSelectHit(hit)}
                        className={`w-full px-4 py-2.5 flex items-center justify-between gap-3 text-start cursor-pointer transition-colors ${
                          active ? 'bg-[var(--ink)] border-s-2 border-s-[var(--ember)]' : 'hover:bg-[var(--ink)]/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 border border-[var(--line)] bg-[var(--ink)] shrink-0 overflow-hidden flex items-center justify-center">
                            {img ? (
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-4 h-4 text-[var(--muted)]" aria-hidden="true" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--bone)] truncate">
                              {p.title[locale] || p.title.en}
                            </p>
                            <p className="text-[11px] text-[var(--muted)] truncate">
                              {(hit.category?.name[locale] || hit.category?.name.en || p.department)}
                              {hit.seller ? ` · ${hit.seller.name[locale] || hit.seller.name.en}` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 text-end">
                          <PriceDisplay
                            usdCents={hit.effectiveUsdCents}
                            compareAtUsdCents={hit.hasDiscount ? p.basePriceUsdCents : p.compareAtUsdCents}
                            size="sm"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Stores Group */}
              {results.stores.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--muted)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-[var(--cedar)]" aria-hidden="true" />
                      {t.globalSearchStores}
                    </span>
                    <span>{results.stores.length}</span>
                  </div>
                  {results.stores.map((hit) => {
                    const idx = hitIndexMap.get(`store:${hit.id}`) ?? -1;
                    const active = idx === activeIndex;
                    const s = hit.seller;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        role="option"
                        aria-selected={active}
                        data-hit-idx={idx}
                        onMouseEnter={() => idx >= 0 && setActiveIndex(idx)}
                        onClick={() => handleSelectHit(hit)}
                        className={`w-full px-4 py-2.5 flex items-center justify-between gap-3 text-start cursor-pointer transition-colors ${
                          active ? 'bg-[var(--ink)] border-s-2 border-s-[var(--ember)]' : 'hover:bg-[var(--ink)]/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 border border-[var(--line)] bg-[var(--ink)] shrink-0 overflow-hidden flex items-center justify-center">
                            {s.logoImage ? (
                              <img src={s.logoImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Store className="w-4 h-4 text-[var(--muted)]" aria-hidden="true" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--bone)] truncate inline-flex items-center gap-1.5">
                              <span>{s.name[locale] || s.name.en}</span>
                              {s.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--cedar)] shrink-0" aria-hidden="true" />}
                            </p>
                            <p className="text-[11px] text-[var(--muted)] truncate">
                              {s.governorate} · {s.district} · {isAr ? `${hit.productCount} منتج` : `${hit.productCount} products`}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Categories Group */}
              {results.categories.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--muted)]">
                    <span className="inline-flex items-center gap-1.5">
                      <FolderKanban className="w-3.5 h-3.5 text-[var(--gold)]" aria-hidden="true" />
                      {t.globalSearchCategories}
                    </span>
                    <span>{results.categories.length}</span>
                  </div>
                  {results.categories.map((hit) => {
                    const idx = hitIndexMap.get(`category:${hit.id}`) ?? -1;
                    const active = idx === activeIndex;
                    const c = hit.category;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        role="option"
                        aria-selected={active}
                        data-hit-idx={idx}
                        onMouseEnter={() => idx >= 0 && setActiveIndex(idx)}
                        onClick={() => handleSelectHit(hit)}
                        className={`w-full px-4 py-2.5 flex items-center justify-between gap-3 text-start cursor-pointer transition-colors ${
                          active ? 'bg-[var(--ink)] border-s-2 border-s-[var(--ember)]' : 'hover:bg-[var(--ink)]/60'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--bone)] truncate">
                            {c.name[locale] || c.name.en}
                          </p>
                          <p className="text-[11px] text-[var(--muted)] truncate">
                            {c.department} · {isAr ? `${hit.productCount} منتج` : `${hit.productCount} items`}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Shortcut Legend + Catalog Fallback */}
        <div className="px-4 py-2.5 border-t border-[var(--line)] bg-[var(--ink)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--muted)] font-mono-tabular">
          <div className="flex items-center gap-3">
            <span>↑↓ {isAr ? 'تنقل' : 'Navigate'}</span>
            <span>↵ {isAr ? 'فتح' : 'Open'}</span>
            <span>ESC {isAr ? 'إغلاق' : 'Close'}</span>
          </div>
          {query.trim() && (
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                navigate(`/catalog?q=${encodeURIComponent(query.trim())}`);
              }}
              className="text-[var(--ember)] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              <span>{t.globalSearchViewAll}</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
