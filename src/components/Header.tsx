import React, { useEffect, useRef, useState } from 'react';
import { Bell, Check, ChevronDown, Globe, Heart, LogOut, Mail, Moon, Search, ShoppingBag, Sun, User, X } from 'lucide-react';
import type { Locale, NotificationCategory, SiteChromeSettings, ThemeMode } from '../shared/types.ts';
import { getCopy } from '../shared/i18n.ts';
import { useMarketplace } from '../context/MarketplaceContext.tsx';
import { safeNavigateOrOpen } from '../utils/url.ts';

export function Header({
  previewLocale,
  previewTheme,
  previewChrome,
  previewMode = false,
}: {
  previewLocale?: Locale;
  previewTheme?: ThemeMode;
  previewChrome?: SiteChromeSettings;
  previewMode?: boolean;
} = {}) {
  const ctx = useMarketplace();
  const locale = previewLocale ?? ctx.locale;
  const theme = previewTheme ?? ctx.theme;
  const chrome = previewChrome ?? ctx.siteChrome;
  const t = previewLocale ? getCopy(previewLocale) : ctx.t;
  const {
    toggleTheme,
    toggleLocale,
    direction,
    toggleDirection,
    currency,
    toggleCurrency,
    route,
    navigate,
    settings,
    cart,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
    authUser,
    logout,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    sendNotificationEmailSummary,
  } = ctx;

  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [dismissedTopBarIds, setDismissedTopBarIds] = useState<string[]>([]);
  const [megaOpen, setMegaOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [bellCategory, setBellCategory] = useState<'all' | NotificationCategory>('all');
  const [emailSummaryBusy, setEmailSummaryBusy] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bellOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBellOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [bellOpen]);
  const bagCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const announcementText = settings.announcement?.[locale]?.trim() || '';

  const topBarBanners = previewMode
    ? []
    : (ctx.banners || [])
        .filter((b) => b.placement === 'top_bar' && !dismissedTopBarIds.includes(b.id))
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 1);

  const navItems = (chrome.headerLinks || []).filter((link) => link.visible);
  const isActive = (path: string) => !previewMode && route.startsWith(path);
  const safeNavigate = (to: string) => {
    setMegaOpen(false);
    setBellOpen(false);
    if (!previewMode) safeNavigateOrOpen(to, navigate, '/');
  };

  const filteredBellItems = notifications.filter((n) =>
    bellCategory === 'all' ? true : (n.category || 'system') === bellCategory
  );

  const categoryLabel = (cat?: NotificationCategory) => {
    if (cat === 'order') return locale === 'ar' ? 'طلب' : 'Order';
    if (cat === 'price_drop') return locale === 'ar' ? 'تخفيض' : 'Price Drop';
    if (cat === 'promo') return locale === 'ar' ? 'عرض' : 'Offer';
    return locale === 'ar' ? 'تنبيه' : 'Update';
  };

  return (
    <div className={`${previewMode ? 'relative' : 'sticky top-0 z-40'} bg-[var(--ink)] border-b border-[var(--line)]`}>
      {topBarBanners.map((tb) => (
        <div
          key={tb.id}
          className="border-b border-[var(--line)] bg-[var(--ember)] text-[var(--ember-fg)] text-xs px-4 py-1.5 flex items-center justify-center gap-3 font-medium"
        >
          <button
            type="button"
            onClick={() => {
              void fetch(`/api/banners/${encodeURIComponent(tb.id)}/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event: 'click' }),
                keepalive: true,
              }).catch(() => {});
              safeNavigate(tb.targetUrl || '/catalog');
            }}
            className="underline-offset-2 hover:underline cursor-pointer truncate"
          >
            {tb.title[locale] || tb.title.en}
            {tb.ctaLabel?.[locale] ? ` — ${tb.ctaLabel[locale]}` : ''}
          </button>
          {tb.dismissible !== false && (
            <button
              type="button"
              onClick={() => setDismissedTopBarIds((prev) => [...prev, tb.id])}
              aria-label="Dismiss top bar promo"
              className="p-0.5 opacity-80 hover:opacity-100 cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}

      {!previewMode && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-[var(--ember)] focus:text-[var(--ember-fg)] focus:text-xs focus:font-semibold"
        >
          {locale === 'ar' ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to content'}
        </a>
      )}

      {/* Slim Utility & Optional Announcement Row (<= 38px) */}
      <div className="border-b border-[var(--line)] bg-[var(--graphite)] text-xs">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            {announcementText && !bannerDismissed ? (
              <>
                <p className="truncate text-[var(--muted)]">{announcementText}</p>
                <button
                  type="button"
                  onClick={() => setBannerDismissed(true)}
                  aria-label="Dismiss announcement"
                  className="text-[var(--muted)] hover:text-[var(--bone)] shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <span
                className="text-[var(--muted)] font-mono-tabular truncate"
                title={
                  settings.fxLastUpdatedAt
                    ? `Daily FX (${settings.fxSource || 'live'}): ${new Date(settings.fxLastUpdatedAt).toLocaleDateString()}`
                    : `FX source: ${settings.fxSource || 'default'}`
                }
              >
                1 USD = {new Intl.NumberFormat('en-US').format(settings.exchangeRateLbpPerUsd)} LBP
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono-tabular">
            {!previewMode && (
              <>
                <button
                  type="button"
                  onClick={() => safeNavigate('/support')}
                  className="hidden sm:inline-flex text-[var(--muted)] hover:text-[var(--bone)] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.navSupport}
                </button>
                <span className="hidden sm:inline text-[var(--line)]" aria-hidden="true">|</span>
                {authUser ? (
                  <>
                    {(authUser.roleKey === 'admin_super' || authUser.roleKey === 'admin_staff') && (
                      <button
                        type="button"
                        onClick={() => safeNavigate('/admin')}
                        className="hidden sm:inline-flex items-center text-[var(--cyan)] hover:text-[var(--ember)] whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {t.navAdmin}
                      </button>
                    )}
                    {(authUser.roleKey === 'seller_owner' || authUser.roleKey === 'seller_staff') && (
                      <button
                        type="button"
                        onClick={() => safeNavigate('/seller')}
                        className="hidden sm:inline-flex items-center text-[var(--ember)] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {t.navSell}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => safeNavigate('/account')}
                      title={authUser.email}
                      className="inline-flex items-center gap-1 text-[var(--cedar)] hover:text-[var(--ember)] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <User className="w-3 h-3" aria-hidden="true" />
                      <span className="hidden sm:inline">{authUser.name}</span>
                      {unreadNotificationsCount > 0 && (
                        <span className="text-[var(--ember)] font-bold">· {unreadNotificationsCount}</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => void logout()}
                      aria-label="Sign out"
                      title="Sign out"
                      className="inline-flex items-center text-[var(--muted)] hover:text-[var(--ember)] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => safeNavigate('/account')}
                    className="inline-flex items-center gap-1 text-[var(--bone)] hover:text-[var(--ember)] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <User className="w-3 h-3" aria-hidden="true" />
                    <span>{t.navAccount}</span>
                  </button>
                )}
                <span className="text-[var(--line)]" aria-hidden="true">|</span>
              </>
            )}

            <button
              type="button"
              onClick={() => !previewMode && toggleLocale()}
              className="inline-flex items-center gap-1 text-[var(--bone)] hover:text-[var(--ember)] whitespace-nowrap shrink-0 cursor-pointer"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{locale === 'en' ? 'العربية' : 'EN'}</span>
            </button>

            <span className="text-[var(--line)]" aria-hidden="true">|</span>

            <button
              type="button"
              onClick={() => !previewMode && toggleDirection()}
              className="text-[var(--bone)] hover:text-[var(--ember)] whitespace-nowrap shrink-0 uppercase cursor-pointer"
              aria-label={`Switch layout direction (currently ${direction.toUpperCase()})`}
              title={`Document direction: ${direction.toUpperCase()}`}
            >
              {direction.toUpperCase()}
            </button>

            <span className="text-[var(--line)]" aria-hidden="true">|</span>

            <button
              type="button"
              onClick={() => !previewMode && toggleCurrency()}
              className="text-[var(--bone)] hover:text-[var(--ember)] whitespace-nowrap shrink-0 cursor-pointer"
              aria-label="Toggle currency"
            >
              {currency === 'USD' ? 'USD $' : 'LBP ل.ل'}
            </button>

            <span className="text-[var(--line)]" aria-hidden="true">|</span>

            <button
              type="button"
              onClick={() => !previewMode && toggleTheme()}
              className="inline-flex items-center gap-1 text-[var(--bone)] hover:text-[var(--ember)] whitespace-nowrap shrink-0 cursor-pointer"
              aria-label="Toggle dark or light theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Header Contract */}
      <header className="max-w-[1440px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => safeNavigate('/')}
            className="inline-flex items-center gap-2 font-display text-2xl font-bold text-[var(--bone)] hover:text-[var(--ember)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {chrome.brandLogoUrl && (
              <img
                src={chrome.brandLogoUrl}
                alt={t.brand}
                referrerPolicy="no-referrer"
                className="h-7 w-7 object-contain border border-[var(--line)] bg-[var(--graphite)] p-0.5"
              />
            )}
            <span>{t.brand}</span>
          </button>

          {chrome.showMegaMenu && chrome.megaMenuDepartments.length > 0 && (
            <button
              type="button"
              onClick={() => setMegaOpen((o) => !o)}
              aria-expanded={megaOpen}
              className="hidden sm:inline-flex items-center gap-1.5 border border-[var(--line)] px-2.5 py-1 text-xs font-medium text-[var(--bone)] hover:border-[var(--ember)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{locale === 'ar' ? 'الأقسام' : 'Departments'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => safeNavigate(item.url)}
              className={`editorial-link py-1 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                isActive(item.url) ? 'text-[var(--bone)] font-semibold' : 'hover:text-[var(--bone)]'
              }`}
            >
              {item.label[locale] || item.label.en}
            </button>
          ))}
        </nav>

        <div className="shrink-0 flex items-center gap-2">
          {!previewMode && (
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label={locale === 'ar' ? 'فتح البحث الشامل (Ctrl+K)' : 'Open global search (Ctrl+K)'}
              title={locale === 'ar' ? 'بحث شامل (Ctrl+K)' : 'Search Marketplace (Ctrl+K)'}
              className="inline-flex items-center gap-2 px-2.5 py-2 text-xs border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)] hover:text-[var(--ember)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden lg:inline">{t.searchBtn}</span>
              <span className="hidden lg:inline font-mono-tabular text-[10px] text-[var(--muted)] border border-[var(--line)] px-1">
                ⌘K
              </span>
            </button>
          )}
          {!previewMode && authUser && (
            <div ref={bellRef} className="relative">
              <button
                type="button"
                onClick={() => setBellOpen((o) => !o)}
                aria-expanded={bellOpen}
                aria-haspopup="dialog"
                aria-label={
                  locale === 'ar'
                    ? `الإشعارات (${unreadNotificationsCount} غير مقروء)`
                    : `Notifications (${unreadNotificationsCount} unread)`
                }
                title={t.notifications}
                className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-mono-tabular border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)] hover:text-[var(--ember)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Bell
                  className={`w-3.5 h-3.5 ${unreadNotificationsCount > 0 ? 'text-[var(--ember)]' : ''}`}
                  aria-hidden="true"
                />
                <span>{unreadNotificationsCount}</span>
              </button>

              {bellOpen && (
                <div
                  role="dialog"
                  aria-label={t.notifications}
                  className="absolute end-0 mt-2 w-[340px] sm:w-[390px] border border-[var(--line)] bg-[var(--graphite)] text-[var(--bone)] z-50 shadow-2xl"
                >
                  <div className="px-4 py-3 border-b border-[var(--line)] bg-[var(--ink)] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-[var(--ember)]" aria-hidden="true" />
                      <span className="text-xs font-semibold uppercase tracking-wider">{t.notifications}</span>
                      {unreadNotificationsCount > 0 && (
                        <span className="font-mono-tabular text-[11px] text-[var(--ember)] font-bold">
                          · {unreadNotificationsCount}
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        type="button"
                        onClick={() => void markNotificationRead('all')}
                        className="text-[11px] text-[var(--cedar)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" aria-hidden="true" />
                        <span>{t.bellMarkAllRead}</span>
                      </button>
                    )}
                  </div>

                  <div className="px-3 py-2 border-b border-[var(--line)] flex items-center gap-1.5 overflow-x-auto">
                    {(
                      [
                        ['all', t.bellAll],
                        ['order', t.bellOrders],
                        ['price_drop', t.bellPriceDrops],
                        ['promo', t.bellOffers],
                      ] as const
                    ).map(([catKey, label]) => (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setBellCategory(catKey)}
                        className={`px-2 py-0.5 text-[11px] border whitespace-nowrap shrink-0 cursor-pointer ${
                          bellCategory === catKey
                            ? 'border-[var(--ember)] bg-[var(--ember)] text-[var(--ember-fg)] font-semibold'
                            : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--bone)]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[var(--line)]">
                    {filteredBellItems.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[var(--muted)]">{t.bellEmpty}</div>
                    ) : (
                      filteredBellItems.slice(0, 12).map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => {
                            if (!n.readAt) void markNotificationRead(n.id);
                            safeNavigate(n.actionUrl || '/account?tab=notifications');
                          }}
                          className={`w-full text-start px-4 py-3 space-y-1 hover:bg-[var(--ink)] transition-colors cursor-pointer ${
                            !n.readAt ? 'bg-[var(--ink)]/50 border-s-2 border-s-[var(--ember)]' : 'opacity-80'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-[10px] font-mono-tabular uppercase">
                            <span
                              className={
                                n.category === 'price_drop'
                                  ? 'text-[var(--cedar)] font-semibold'
                                  : n.category === 'promo'
                                    ? 'text-[var(--ember)] font-semibold'
                                    : n.category === 'order'
                                      ? 'text-[var(--cyan)] font-semibold'
                                      : 'text-[var(--muted)]'
                              }
                            >
                              {categoryLabel(n.category)}
                            </span>
                            <span className="text-[var(--muted)]">{n.createdAt.slice(0, 10)}</span>
                          </div>
                          <p className="text-xs font-semibold text-[var(--bone)] line-clamp-1">
                            {n.title[locale] || n.title.en}
                          </p>
                          <p className="text-[11px] text-[var(--muted)] line-clamp-2">
                            {n.body[locale] || n.body.en}
                          </p>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="px-3 py-2.5 border-t border-[var(--line)] bg-[var(--ink)] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={emailSummaryBusy}
                      onClick={async () => {
                        setEmailSummaryBusy(true);
                        await sendNotificationEmailSummary();
                        setEmailSummaryBusy(false);
                      }}
                      className="inline-flex items-center gap-1.5 border border-[var(--line)] px-2.5 py-1 text-[11px] text-[var(--bone)] hover:border-[var(--ember)] cursor-pointer disabled:opacity-50"
                    >
                      <Mail className="w-3 h-3 text-[var(--ember)]" aria-hidden="true" />
                      <span>{t.bellSendSummary}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => safeNavigate('/account?tab=notifications')}
                      className="text-[11px] font-medium text-[var(--ember)] hover:underline cursor-pointer"
                    >
                      {t.bellManagePrefs}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {!previewMode && (
            <button
              type="button"
              onClick={() => safeNavigate('/catalog?wishlist=true')}
              aria-label={locale === 'ar' ? `المفضلة (${wishlist.length})` : `Wishlist (${wishlist.length})`}
              title={locale === 'ar' ? 'المفضلة' : 'Wishlist'}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-mono-tabular border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)] hover:text-[var(--ember)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? 'fill-[var(--ember)] text-[var(--ember)]' : ''}`} aria-hidden="true" />
              <span>{wishlist.length}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => !previewMode && setIsCartOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[var(--ember)] text-[var(--ember-fg)] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>{t.bag}</span>
            <span className="font-mono-tabular">({bagCount})</span>
          </button>
        </div>
      </header>

      {/* Hairline Department Mega-Menu Panel */}
      {megaOpen && chrome.showMegaMenu && chrome.megaMenuDepartments.length > 0 && (
        <div className="border-t border-[var(--line)] bg-[var(--graphite)]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-5">
            <div className="hairline-grid grid-cols-1 md:grid-cols-3">
              {chrome.megaMenuDepartments.map((dept) => (
                <div key={dept.slug} className="hairline-cell p-4 space-y-2.5">
                  <div>
                    <p className="font-display text-lg font-bold text-[var(--bone)]">
                      {dept.title[locale] || dept.title.en}
                    </p>
                    <p className="text-xs text-[var(--muted)]">{dept.tagline[locale] || dept.tagline.en}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {dept.links.map((lnk, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => safeNavigate(lnk.url)}
                        className="editorial-link text-xs font-medium text-[var(--ember)] cursor-pointer"
                      >
                        {lnk.label[locale] || lnk.label.en}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

