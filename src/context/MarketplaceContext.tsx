import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  AttributeItem,
  BrandItem,
  Campaign,
  Category,
  Currency,
  DeliveryZone,
  FeaturedPlacement,
  FlashSale,
  HomeSection,
  Locale,
  MarketingPopup,
  NotificationItem,
  NotificationPreferences,
  Offer,
  OfferBanner,
  PaymentConfig,
  PlatformSettings,
  Product,
  Seller,
  SeoMetadataConfig,
  SiteChromeSettings,
  SubscriptionPlan,
  ThemeMode,
  UserRole,
} from '../shared/types.ts';
import { DEFAULT_SITE_CHROME } from '../shared/homeSections.ts';
import { getCopy } from '../shared/i18n.ts';

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface AuthSessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleKey: UserRole;
  sellerId?: string;
  totpEnabled: boolean;
  emailVerifiedAt?: string | null;
  phoneVerifiedAt?: string | null;
  isFullyVerified?: boolean;
  preferredLocale?: Locale;
  preferredCurrency?: Currency;
  permissions: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

export type DocumentDirection = 'ltr' | 'rtl';

interface MarketplaceContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
  locale: Locale;
  toggleLocale: () => void;
  setLocale: (l: Locale) => void;
  direction: DocumentDirection;
  toggleDirection: () => void;
  setDirection: (d: DocumentDirection) => void;
  currency: Currency;
  toggleCurrency: () => void;
  setCurrency: (c: Currency) => void;
  t: ReturnType<typeof getCopy>;
  route: string;
  navigate: (to: string) => void;
  settings: PlatformSettings;
  paymentsConfig: PaymentConfig;
  categories: Category[];
  brands: BrandItem[];
  attributes: AttributeItem[];
  sellers: Seller[];
  products: Product[];
  subscriptionPlans: SubscriptionPlan[];
  deliveryZones: DeliveryZone[];
  homeSections: HomeSection[];
  siteChrome: SiteChromeSettings;
  seoMetadata?: SeoMetadataConfig;
  setSeoMetadata: (seo: SeoMetadataConfig) => void;
  banners: OfferBanner[];
  popups: MarketingPopup[];
  featuredPlacements: FeaturedPlacement[];
  offers: Offer[];
  flashSales: FlashSale[];
  campaigns: Campaign[];
  previewDrafts: boolean;
  setPreviewDrafts: (v: boolean) => void;
  loading: boolean;
  authChecked: boolean;
  refreshBootstrap: () => Promise<void>;
  refreshFxRate: () => Promise<void>;
  refreshAuth: () => Promise<AuthSessionUser | null>;
  unreadNotificationsCount: number;
  notifications: NotificationItem[];
  notificationPrefs: NotificationPreferences;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (idOrAll: string) => Promise<void>;
  updateNotificationPreferences: (patch: Partial<NotificationPreferences>) => Promise<NotificationPreferences | null>;
  sendNotificationEmailSummary: () => Promise<{
    ok: boolean;
    sentCount: number;
    status: string;
    error?: string | null;
    previewSubject?: string;
    lastSummarySentAt?: string | null;
  } | null>;
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cart: CartItem[];
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  updateCartQty: (productId: string, variantId: string, quantity: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  authUser: AuthSessionUser | null;
  setAuthUser: (user: AuthSessionUser | null) => void;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  toast: ToastMessage | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  apiFetch: <T = unknown>(url: string, init?: RequestInit) => Promise<T>;
  mapsApiKey: string;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  exchangeRateLbpPerUsd: 89500,
  fxLastUpdatedAt: null,
  fxSource: 'default',
  fxAutoSyncEnabled: true,
  defaultCommissionBps: 1000,
  codFeeUsdCents: 150,
  holdPeriodDays: 3,
  announcement: { en: '', ar: '' },
};

const DEFAULT_PAYMENTS: PaymentConfig = {
  codEnabled: true,
  whishManualEnabled: false,
  whishAccountNumber: '',
  whishInstructions: { en: '', ar: '' },
  cardEnabled: false,
  cardGatewayConfigured: false,
};

const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  emailSummaryEnabled: true,
  summaryFrequency: 'daily',
  orderUpdates: true,
  priceDrops: true,
  promotionalOffers: true,
  lastSummarySentAt: null,
};

function readCookie(name: string): string {
  const prefix = `${name}=`;
  const parts = document.cookie.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return '';
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('nl_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('nl_locale');
    return saved === 'ar' ? 'ar' : 'en';
  });

  const [direction, setDirectionState] = useState<DocumentDirection>(() => {
    const savedDir = localStorage.getItem('nl_direction');
    if (savedDir === 'ltr' || savedDir === 'rtl') return savedDir;
    return localStorage.getItem('nl_locale') === 'ar' ? 'rtl' : 'ltr';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('nl_currency');
    return saved === 'LBP' ? 'LBP' : 'USD';
  });

  const [route, setRoute] = useState<string>(() => window.location.pathname + window.location.search || '/');
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [paymentsConfig, setPaymentsConfig] = useState<PaymentConfig>(DEFAULT_PAYMENTS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [homeSections, setHomeSections] = useState<HomeSection[]>([]);
  const [siteChrome, setSiteChrome] = useState<SiteChromeSettings>(DEFAULT_SITE_CHROME);
  const [seoMetadata, setSeoMetadata] = useState<SeoMetadataConfig | undefined>(undefined);
  const [banners, setBanners] = useState<OfferBanner[]>([]);
  const [popups, setPopups] = useState<MarketingPopup[]>([]);
  const [featuredPlacements, setFeaturedPlacements] = useState<FeaturedPlacement[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFS);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [previewDrafts, setPreviewDrafts] = useState<boolean>(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('previewDrafts') === '1' || p.get('previewDrafts') === 'true';
  });
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nl_cart');
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nl_wishlist');
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [authUser, setAuthUser] = useState<AuthSessionUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [mapsApiKey, setMapsApiKey] = useState<string>(
    () => String(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim()
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('nl_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    localStorage.setItem('nl_locale', locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.dir = direction;
    localStorage.setItem('nl_direction', direction);
  }, [direction]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    setDirectionState(next === 'ar' ? 'rtl' : 'ltr');
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const next = prev === 'en' ? 'ar' : 'en';
      setDirectionState(next === 'ar' ? 'rtl' : 'ltr');
      return next;
    });
  }, []);

  const setDirection = useCallback((next: DocumentDirection) => {
    setDirectionState(next);
  }, []);

  const toggleDirection = useCallback(() => {
    setDirectionState((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'));
  }, []);

  useEffect(() => {
    localStorage.setItem('nl_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('nl_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!authUser) {
      localStorage.setItem('nl_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, authUser]);

  useEffect(() => {
    const onPop = () => {
      const nextRoute = window.location.pathname + window.location.search || '/';
      setRoute(nextRoute);
      const p = new URLSearchParams(window.location.search);
      setPreviewDrafts(p.get('previewDrafts') === '1' || p.get('previewDrafts') === 'true');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = String(Date.now());
    setToast({ id, type, text });
    window.setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3600);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to !== window.location.pathname + window.location.search) {
      window.history.pushState({}, '', to);
      setRoute(to);
      const qs = to.split('?')[1] || '';
      const p = new URLSearchParams(qs);
      if (p.has('previewDrafts')) {
        setPreviewDrafts(p.get('previewDrafts') === '1' || p.get('previewDrafts') === 'true');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const apiFetch = useCallback(async <T = unknown>(url: string, init: RequestInit = {}): Promise<T> => {
    const headers = new Headers(init.headers || {});
    if (!headers.has('Content-Type') && init.body) {
      headers.set('Content-Type', 'application/json');
    }
    const method = (init.method || 'GET').toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') {
      const csrf = readCookie('nl_csrf');
      if (csrf) headers.set('X-CSRF-Token', csrf);
    }
    const res = await fetch(url, { ...init, headers, credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Request failed (${res.status})`);
    }
    return data as T;
  }, []);

  const refreshBootstrap = useCallback(async () => {
    try {
      const qs = new URLSearchParams({
        locale,
        includeDrafts: previewDrafts ? 'true' : 'false',
      });
      const res = await fetch(`/api/bootstrap?${qs.toString()}`, { credentials: 'include' });
      const data = await res.json();
      setSettings(data.settings || DEFAULT_SETTINGS);
      setPaymentsConfig(data.paymentsConfig || DEFAULT_PAYMENTS);
      setCategories(data.categories || []);
      setBrands(data.brands || []);
      setAttributes(data.attributes || []);
      setSellers(data.sellers || []);
      setProducts(data.products || []);
      setSubscriptionPlans(data.subscriptionPlans || []);
      setDeliveryZones(data.deliveryZones || []);
      setHomeSections(data.homeSections || []);
      setSiteChrome(data.siteChrome || DEFAULT_SITE_CHROME);
      if (data.seoMetadata) setSeoMetadata(data.seoMetadata);
      setBanners(data.banners || []);
      setPopups(data.popups || []);
      setFeaturedPlacements(data.featuredPlacements || []);
      setOffers(data.offers || []);
      setFlashSales(data.flashSales || []);
      setCampaigns(data.campaigns || []);
      if (typeof data.mapsApiKey === 'string' && data.mapsApiKey.trim()) {
        setMapsApiKey(data.mapsApiKey.trim());
      }
    } catch {
      showToast('Failed to load marketplace catalog.', 'error');
    } finally {
      setLoading(false);
    }
  }, [locale, previewDrafts, showToast]);

  const refreshFxRate = useCallback(async () => {
    try {
      const res = await fetch('/api/fx/rate', { credentials: 'include' });
      if (!res.ok) return;
      const fx = await res.json();
      if (typeof fx.exchangeRateLbpPerUsd === 'number' && fx.exchangeRateLbpPerUsd >= 1500) {
        setSettings((curr) => ({
          ...curr,
          exchangeRateLbpPerUsd: fx.exchangeRateLbpPerUsd,
          fxLastUpdatedAt: fx.fxLastUpdatedAt ?? curr.fxLastUpdatedAt ?? null,
          fxSource: fx.fxSource ?? curr.fxSource,
          fxAutoSyncEnabled: fx.fxAutoSyncEnabled ?? curr.fxAutoSyncEnabled,
        }));
      }
    } catch {
      // Ignore transient network errors; retain cached rate
    }
  }, []);

  useEffect(() => {
    void refreshFxRate();
    const timer = window.setInterval(() => {
      void refreshFxRate();
    }, 12 * 3_600_000);
    return () => window.clearInterval(timer);
  }, [refreshFxRate]);

  const refreshNotifications = useCallback(async () => {
    try {
      const data = await apiFetch<{
        notifications: NotificationItem[];
        unreadCount?: number;
        preferences?: NotificationPreferences;
      }>('/api/account/notifications');
      const list = data.notifications || [];
      setNotifications(list);
      setUnreadNotificationsCount(
        typeof data.unreadCount === 'number' ? data.unreadCount : list.filter((n) => !n.readAt).length
      );
      if (data.preferences) {
        setNotificationPrefs(data.preferences);
      }
    } catch {
      setNotifications([]);
      setUnreadNotificationsCount(0);
    }
  }, [apiFetch]);

  const markNotificationRead = useCallback(
    async (idOrAll: string) => {
      if (!authUser) return;
      try {
        await apiFetch(`/api/account/notifications/${encodeURIComponent(idOrAll)}/read`, { method: 'POST' });
        await refreshNotifications();
      } catch (err) {
        showToast((err as Error).message, 'error');
      }
    },
    [authUser, apiFetch, refreshNotifications, showToast]
  );

  const updateNotificationPreferences = useCallback(
    async (patch: Partial<NotificationPreferences>): Promise<NotificationPreferences | null> => {
      if (!authUser) return null;
      try {
        const res = await apiFetch<{ preferences: NotificationPreferences }>('/api/account/notifications/preferences', {
          method: 'PATCH',
          body: JSON.stringify(patch),
        });
        setNotificationPrefs(res.preferences);
        showToast(locale === 'ar' ? 'تم حفظ تفضيلات الإشعارات' : 'Notification preferences saved', 'success');
        return res.preferences;
      } catch (err) {
        showToast((err as Error).message, 'error');
        return null;
      }
    },
    [authUser, apiFetch, locale, showToast]
  );

  const sendNotificationEmailSummary = useCallback(async () => {
    if (!authUser) return null;
    try {
      const res = await apiFetch<{
        ok: boolean;
        sentCount: number;
        status: string;
        error?: string | null;
        previewSubject?: string;
        lastSummarySentAt?: string | null;
      }>('/api/account/notifications/email-summary', { method: 'POST' });
      await refreshNotifications();
      if (res.sentCount === 0) {
        showToast(locale === 'ar' ? 'لا توجد إشعارات لتلخيصها حالياً.' : 'No notifications to summarize right now.', 'info');
      } else if (res.ok) {
        showToast(
          locale === 'ar'
            ? `تم إرسال الملخص البريدي (${res.sentCount} إشعار).`
            : `Email summary sent (${res.sentCount} items).`,
          'success'
        );
      } else {
        showToast(
          locale === 'ar'
            ? `تم تجهيز الملخص (${res.sentCount} إشعار) — ${res.error || 'خادم البريد غير مهيأ'}`
            : `Summary compiled (${res.sentCount} items) — ${res.error || 'SMTP not configured'}`,
          'info'
        );
      }
      return res;
    } catch (err) {
      showToast((err as Error).message, 'error');
      return null;
    }
  }, [authUser, apiFetch, locale, refreshNotifications, showToast]);

  const refreshAuth = useCallback(async (): Promise<AuthSessionUser | null> => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      const data = await res.json();
      if (data.user) {
        setAuthUser(data.user);
        const serverCart: CartItem[] = Array.isArray(data.cart) ? data.cart : [];
        let mergedCart: CartItem[] = serverCart;
        setCart((localCart) => {
          if (localCart.length === 0) {
            mergedCart = serverCart;
            return serverCart;
          }
          if (serverCart.length === 0) {
            mergedCart = localCart;
            return localCart;
          }
          const byKey = new Map<string, CartItem>();
          for (const item of serverCart) {
            byKey.set(`${item.productId}::${item.variantId}`, { ...item });
          }
          for (const item of localCart) {
            const key = `${item.productId}::${item.variantId}`;
            const existing = byKey.get(key);
            if (!existing) {
              byKey.set(key, { ...item });
            } else {
              byKey.set(key, { ...existing, quantity: Math.max(existing.quantity, item.quantity) });
            }
          }
          mergedCart = Array.from(byKey.values());
          return mergedCart;
        });
        if (mergedCart.length > 0 && mergedCart.length !== serverCart.length) {
          const csrf = readCookie('nl_csrf');
          void fetch('/api/account/cart', {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
            },
            body: JSON.stringify({ items: mergedCart }),
          }).catch(() => {});
        }
        const serverWish: string[] = Array.isArray(data.wishlist) ? (data.wishlist as string[]) : [];
        let localGuestWish: string[] = [];
        try {
          const raw = localStorage.getItem('nl_wishlist');
          localGuestWish = raw ? (JSON.parse(raw) as string[]) : [];
        } catch {
          localGuestWish = [];
        }
        const mergedWish = Array.from(new Set([...localGuestWish, ...serverWish]));
        setWishlist(mergedWish);

        if (localGuestWish.some((id) => !serverWish.includes(id))) {
          const csrf = readCookie('nl_csrf');
          void fetch('/api/account/wishlist', {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
            },
            body: JSON.stringify({ productIds: mergedWish }),
          })
            .then((r) => (r.ok ? r.json() : null))
            .then((synced) => {
              if (synced && Array.isArray(synced.wishlist)) {
                setWishlist(synced.wishlist as string[]);
              }
              localStorage.removeItem('nl_wishlist');
            })
            .catch(() => {});
        } else {
          localStorage.removeItem('nl_wishlist');
        }
        return data.user as AuthSessionUser;
      } else {
        setAuthUser(null);
        setUnreadNotificationsCount(0);
        return null;
      }
    } catch {
      setAuthUser(null);
      setUnreadNotificationsCount(0);
      return null;
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    void refreshBootstrap();
  }, [refreshBootstrap, authUser?.id]);

  useEffect(() => {
    if (authUser) {
      void refreshNotifications();
    } else {
      setNotifications([]);
      setNotificationPrefs(DEFAULT_NOTIFICATION_PREFS);
      setUnreadNotificationsCount(0);
    }
  }, [authUser, refreshNotifications]);

  const syncCartRemote = useCallback(
    (nextCart: CartItem[]) => {
      if (!authUser) return;
      void apiFetch('/api/account/cart', {
        method: 'PUT',
        body: JSON.stringify({ items: nextCart }),
      }).catch(() => {});
    },
    [authUser, apiFetch]
  );

  const logout = useCallback(async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setAuthUser(null);
    setWishlist([]);
    localStorage.removeItem('nl_wishlist');
    showToast(locale === 'ar' ? 'تم تسجيل الخروج' : 'Signed out', 'info');
  }, [apiFetch, locale, showToast]);

  const logoutAllDevices = useCallback(async () => {
    await apiFetch('/api/auth/logout-all', { method: 'POST' }).catch(() => {});
    setAuthUser(null);
    setWishlist([]);
    localStorage.removeItem('nl_wishlist');
    showToast(locale === 'ar' ? 'تم تسجيل الخروج من جميع الأجهزة' : 'Signed out of all devices', 'info');
  }, [apiFetch, locale, showToast]);

  const addToCart = useCallback(
    (productId: string, variantId: string, quantity = 1) => {
      setCart((prev) => {
        const idx = prev.findIndex((i) => i.productId === productId && i.variantId === variantId);
        const next =
          idx >= 0
            ? prev.map((it, i) => (i === idx ? { ...it, quantity: it.quantity + quantity } : it))
            : [...prev, { productId, variantId, quantity }];
        syncCartRemote(next);
        return next;
      });
      setIsCartOpen(true);
      showToast(locale === 'ar' ? 'تمت الإضافة إلى الحقيبة' : 'Added to bag', 'success');
    },
    [locale, showToast, syncCartRemote]
  );

  const updateCartQty = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      setCart((prev) => {
        const next =
          quantity <= 0
            ? prev.filter((i) => !(i.productId === productId && i.variantId === variantId))
            : prev.map((i) => (i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i));
        syncCartRemote(next);
        return next;
      });
    },
    [syncCartRemote]
  );

  const removeFromCart = useCallback(
    (productId: string, variantId: string) => {
      setCart((prev) => {
        const next = prev.filter((i) => !(i.productId === productId && i.variantId === variantId));
        syncCartRemote(next);
        return next;
      });
    },
    [syncCartRemote]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    syncCartRemote([]);
  }, [syncCartRemote]);

  const toggleWishlist = useCallback(
    (productId: string) => {
      if (authUser) {
        let wasWished = false;
        setWishlist((prev) => {
          wasWished = prev.includes(productId);
          return wasWished ? prev.filter((id) => id !== productId) : [productId, ...prev];
        });
        void apiFetch<{ wished: boolean; wishlist: string[] }>('/api/account/wishlist/toggle', {
          method: 'POST',
          body: JSON.stringify({ productId }),
        })
          .then((res) => {
            setWishlist(res.wishlist);
            showToast(
              res.wished
                ? locale === 'ar'
                  ? 'تم الحفظ في المفضلة'
                  : 'Saved to wishlist'
                : locale === 'ar'
                  ? 'تمت الإزالة من المفضلة'
                  : 'Removed from wishlist',
              'info'
            );
          })
          .catch((err) => {
            setWishlist((prev) =>
              wasWished ? Array.from(new Set([productId, ...prev])) : prev.filter((id) => id !== productId)
            );
            showToast((err as Error).message || 'Could not update wishlist', 'error');
          });
        return;
      }

      setWishlist((prev) => {
        const exists = prev.includes(productId);
        const next = exists ? prev.filter((id) => id !== productId) : [productId, ...prev];
        showToast(
          exists
            ? locale === 'ar'
              ? 'تمت الإزالة من المفضلة'
              : 'Removed from wishlist'
            : locale === 'ar'
              ? 'تم الحفظ في المفضلة (محلياً على جهازك)'
              : 'Saved to wishlist',
          'info'
        );
        return next;
      });
    },
    [authUser, apiFetch, locale, showToast]
  );

  const t = useMemo(() => getCopy(locale), [locale]);

  return (
    <MarketplaceContext.Provider
      value={{
        theme,
        toggleTheme: () => setThemeState((p) => (p === 'dark' ? 'light' : 'dark')),
        setTheme: setThemeState,
        locale,
        toggleLocale,
        setLocale,
        direction,
        toggleDirection,
        setDirection,
        currency,
        toggleCurrency: () => setCurrencyState((p) => (p === 'USD' ? 'LBP' : 'USD')),
        setCurrency: setCurrencyState,
        t,
        route,
        navigate,
        settings,
        paymentsConfig,
        categories,
        brands,
        attributes,
        sellers,
        products,
        subscriptionPlans,
        deliveryZones,
        homeSections,
        siteChrome,
        seoMetadata,
        setSeoMetadata,
        banners,
        popups,
        featuredPlacements,
        offers,
        flashSales,
        campaigns,
        previewDrafts,
        setPreviewDrafts,
        loading,
        authChecked,
        refreshBootstrap,
        refreshFxRate,
        refreshAuth,
        unreadNotificationsCount,
        notifications,
        notificationPrefs,
        refreshNotifications,
        markNotificationRead,
        updateNotificationPreferences,
        sendNotificationEmailSummary,
        isSearchOpen,
        setIsSearchOpen,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        authUser,
        setAuthUser,
        logout,
        logoutAllDevices,
        toast,
        showToast,
        apiFetch,
        mapsApiKey,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used inside MarketplaceProvider');
  return ctx;
}
