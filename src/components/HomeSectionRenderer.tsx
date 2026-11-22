import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Box,
  ChevronDown,
  Clock,
  Copy,
  Flame,
  Heart,
  Megaphone,
  Play,
  Search,
  ShieldCheck,
  Star,
  Tag,
  Truck,
  Wallet,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { HeroAnnouncementItem, HomeSection, Locale, LocalizedText } from '../shared/types.ts';
import { getCopy } from '../shared/i18n.ts';
import { parseUtcTimestampMs, resolveUnitOfferPrice } from '../shared/offers.ts';
import { formatMoney } from '../shared/money.ts';
import { safeNavigateOrOpen } from '../utils/url.ts';
import { useMarketplace } from '../context/MarketplaceContext.tsx';
import {
  EmptyState,
  PriceDisplay,
  ProductCard,
  ResilientImage,
  SectionHeading,
  StampBadge,
} from './HairlineUI.tsx';

function getLocalized(val: unknown, locale: Locale, fallback = ''): string {
  if (!val) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    const obj = val as Partial<LocalizedText>;
    return obj[locale] || obj.en || obj.ar || fallback;
  }
  return fallback;
}

function formatCountdown(msRemaining: number): string {
  const totalSec = Math.max(0, Math.floor(msRemaining / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return days > 0 ? `${days}d ${pad(hours)}:${pad(mins)}:${pad(secs)}` : `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}

function getSafeVideoEmbed(url: string): { kind: 'iframe' | 'video' | 'none'; src: string } {
  const clean = (url || '').trim();
  if (!clean) return { kind: 'none', src: '' };
  try {
    const u = new URL(clean, window.location.origin);
    if (u.hostname.includes('youtube.com')) {
      const vid = u.searchParams.get('v');
      if (vid && /^[a-zA-Z0-9_-]{6,20}$/.test(vid)) {
        return { kind: 'iframe', src: `https://www.youtube.com/embed/${vid}` };
      }
    }
    if (u.hostname === 'youtu.be') {
      const vid = u.pathname.replace('/', '');
      if (vid && /^[a-zA-Z0-9_-]{6,20}$/.test(vid)) {
        return { kind: 'iframe', src: `https://www.youtube.com/embed/${vid}` };
      }
    }
    if (u.hostname.includes('vimeo.com')) {
      const vid = u.pathname.split('/').filter(Boolean).pop();
      if (vid && /^\d+$/.test(vid)) {
        return { kind: 'iframe', src: `https://player.vimeo.com/video/${vid}` };
      }
    }
    if (/\.(mp4|webm)(\?.*)?$/i.test(u.pathname) && (u.protocol === 'https:' || u.protocol === 'http:' || clean.startsWith('/'))) {
      return { kind: 'video', src: clean };
    }
  } catch {
    return { kind: 'none', src: '' };
  }
  return { kind: 'none', src: '' };
}

export function HomeSectionRenderer({
  section,
  isPreview = false,
  selected = false,
  onSelect,
  previewOverride,
}: {
  section: HomeSection;
  isPreview?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  previewOverride?: {
    locale?: Locale;
    asOfMs?: number;
    isMobilePreview?: boolean;
  };
}) {
  const ctx = useMarketplace();
  const locale = previewOverride?.locale ?? ctx.locale;
  const t = previewOverride?.locale ? getCopy(previewOverride.locale) : ctx.t;
  const {
    navigate,
    products,
    sellers,
    banners,
    offers,
    flashSales,
    campaigns,
    subscriptionPlans,
    deliveryZones,
    currency,
    settings,
    showToast,
    apiFetch,
    wishlist,
    toggleWishlist,
  } = ctx;

  const prefersReducedMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [dispatchEmail, setDispatchEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [annPaused, setAnnPaused] = useState(false);
  const [nowMs, setNowMs] = useState(() => previewOverride?.asOfMs ?? Date.now());
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (previewOverride?.asOfMs) {
      setNowMs(previewOverride.asOfMs);
      return;
    }
    if (
      section.sectionType !== 'flash_sale_block' &&
      section.sectionType !== 'announcement_bar' &&
      section.sectionType !== 'hero'
    ) {
      return;
    }
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [section.sectionType, previewOverride?.asOfMs]);

  useEffect(() => {
    if (section.sectionType !== 'hero' || onSelect) return;
    const annTimer = window.setInterval(() => {
      if (!annPaused) {
        setAnnouncementIdx((prev) => prev + 1);
      }
    }, 4500);
    return () => window.clearInterval(annTimer);
  }, [section.sectionType, onSelect, annPaused]);

  useEffect(() => {
    if (section.sectionType !== 'hero' || onSelect) return;
    const slideTimer = window.setInterval(() => {
      if (!heroPaused) {
        setSlideIdx((prev) => prev + 1);
      }
    }, 5200);
    return () => window.clearInterval(slideTimer);
  }, [section.sectionType, onSelect, heroPaused]);

  const c = section.content || {};
  const titleText = section.title[locale] || section.title.en || section.title.ar;
  const safeNav = (url: string) => {
    if (onSelect) return;
    safeNavigateOrOpen(url, navigate, '/catalog');
  };

  const padStyle = section.style?.padding || 'standard';
  const paddingClass =
    padStyle === 'compact' ? 'py-2' : padStyle === 'spacious' ? 'py-5' : '';
  const surfaceClass =
    section.style?.surface === 'ink' ? 'bg-[var(--ink)]' : '';

  const wrapPreviewHeader = (node: React.ReactNode) => (
    <motion.section
      initial={onSelect ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      aria-label={titleText}
      onClick={
        onSelect
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect();
            }
          : undefined
      }
      className={`${paddingClass} ${surfaceClass} ${
        onSelect
          ? `relative cursor-pointer transition-colors p-2 ${
              selected
                ? 'outline outline-2 outline-[var(--ember)] bg-[var(--graphite)]/40'
                : 'hover:outline hover:outline-1 hover:outline-[var(--muted)]'
            }`
          : isPreview && section.status !== 'published'
            ? 'relative border border-dashed border-[var(--gold)] p-3'
            : ''
      }`}
    >
      {(onSelect || (isPreview && section.status !== 'published')) && (
        <div className="mb-2 flex items-center justify-between gap-2 text-[11px] font-mono-tabular uppercase">
          <span className={selected ? 'text-[var(--ember)] font-semibold' : 'text-[var(--gold)]'}>
            {selected ? 'SELECTED · ' : isPreview ? 'PREVIEW · ' : ''}
            {section.sectionType} · {section.status}
            {!section.visible ? ' · HIDDEN' : ''} · v{section.version}
          </span>
        </div>
      )}
      {node}
    </motion.section>
  );

  // Helper to resolve product selection
  const selectProductsList = (
    sourceMode: string,
    department: string,
    manualIds: unknown,
    limit: number
  ) => {
    const idList = Array.isArray(manualIds) ? manualIds.map(String) : [];
    if (sourceMode === 'manual' && idList.length > 0) {
      const picked = idList
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is (typeof products)[number] => Boolean(p));
      return picked.slice(0, limit);
    }
    let list = [...products];
    if (department) list = list.filter((p) => p.department === department);
    if (sourceMode === 'featured') list = list.filter((p) => p.isFeatured);
    if (sourceMode === 'deals') {
      list = list.filter((p) => p.isDeal || resolveUnitOfferPrice(p.basePriceUsdCents, p, offers, nowMs).appliedOffer !== null);
    }
    if (sourceMode === 'top_rated') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }
    if (sourceMode === 'newest') {
      list = [...list].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    }
    return list.slice(0, limit);
  };

  // 1. hero
  if (section.sectionType === 'hero') {
    const mode = String(c.mode || 'split');
    const configuredSlides = Array.isArray(c.slides) ? (c.slides as Array<Record<string, unknown>>) : [];
    const activeHeroBanners = (banners || [])
      .filter((b) => b.active && b.pages.includes('home'))
      .sort((a, b) => b.priority - a.priority);

    const activeHeroFlashSales = (flashSales || []).filter((fs) => {
      if (fs.status === 'ended') return false;
      const sMs = parseUtcTimestampMs(fs.startsAt);
      const eMs = parseUtcTimestampMs(fs.endsAt);
      return (!sMs || nowMs >= sMs) && (!eMs || nowMs <= eMs);
    });
    const activeHeroOffers = (offers || [])
      .filter((o) => {
        if (!o.active || o.approvalStatus !== 'approved') return false;
        const sMs = parseUtcTimestampMs(o.startsAt);
        const eMs = parseUtcTimestampMs(o.endsAt);
        return (!sMs || nowMs >= sMs) && (!eMs || nowMs <= eMs);
      })
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 4);
    const featuredCampaignSlug = typeof c.featuredCampaignSlug === 'string' ? c.featuredCampaignSlug.trim() : '';
    const activeHeroCampaigns = (campaigns || [])
      .filter((cmp) => {
        if (featuredCampaignSlug && cmp.slug === featuredCampaignSlug) return true;
        if (cmp.status !== 'active') return false;
        const sMs = parseUtcTimestampMs(cmp.startsAt);
        const eMs = parseUtcTimestampMs(cmp.endsAt);
        return (!sMs || nowMs >= sMs) && (!eMs || nowMs <= eMs);
      })
      .slice(0, 3);

    // Build unified interactive Offer & Banner Showcase Slide Deck
    const visualSlides: Array<{
      id: string;
      bannerId?: string;
      productId?: string;
      badge: string;
      title: string;
      subtitle: string;
      ctaLabel?: string;
      ctaUrl?: string;
      imageUrl: string;
      focalX: number;
      focalY: number;
    }> = [];

    if (mode === 'slider' && configuredSlides.length > 0) {
      configuredSlides.forEach((sl, idx) => {
        visualSlides.push({
          id: `slide-${idx}`,
          badge: getLocalized(sl.kicker ?? c.badgeLabel, locale, locale === 'ar' ? 'عرض مميز' : 'Featured'),
          title: getLocalized(sl.title, locale, titleText),
          subtitle: getLocalized(sl.subline ?? c.subline, locale, ''),
          ctaLabel: getLocalized(sl.ctaLabel, locale, ''),
          ctaUrl: typeof sl.ctaUrl === 'string' ? sl.ctaUrl : '/catalog?deals=true',
          imageUrl:
            typeof sl.imageUrl === 'string' && sl.imageUrl
              ? sl.imageUrl
              : '/src/assets/images/hero_beirut_editorial_1795297173320.jpg',
          focalX: Number(sl.focalX ?? 50),
          focalY: Number(sl.focalY ?? 50),
        });
      });
    } else {
      visualSlides.push({
        id: 'hero-primary-visual',
        badge: getLocalized(c.badgeLabel, locale, locale === 'ar' ? 'بائع موثق' : 'Verified'),
        title: titleText,
        subtitle:
          locale === 'ar'
            ? 'متاجر لبنانية مستقلة، مواصفات موثقة وتوصيل لكل المحافظات'
            : 'Verified Lebanese Merchants · Dual USD & LBP',
        ctaLabel: getLocalized(c.primaryCtaLabel, locale, t.heroPrimaryCta),
        ctaUrl: typeof c.primaryCtaUrl === 'string' && c.primaryCtaUrl ? String(c.primaryCtaUrl) : '/catalog',
        imageUrl:
          typeof c.imageUrl === 'string' && c.imageUrl
            ? String(c.imageUrl)
            : '/src/assets/images/hero_beirut_editorial_1795297173320.jpg',
        focalX: Number(c.focalX ?? 50),
        focalY: Number(c.focalY ?? 50),
      });
    }

    for (const bn of activeHeroBanners.slice(0, 4)) {
      if (bn.imageUrl || bn.ctaLabel?.[locale] || bn.title?.[locale]) {
        visualSlides.push({
          id: `banner-${bn.id}`,
          bannerId: bn.id,
          badge: locale === 'ar' ? 'عرض حصري' : 'PROMO',
          title: bn.title[locale] || bn.title.en,
          subtitle:
            bn.ctaLabel?.[locale] ||
            bn.ctaLabel?.en ||
            (locale === 'ar' ? 'عرض نشط الآن على نايل لينك' : 'Active Platform Offer'),
          ctaLabel: bn.ctaLabel?.[locale] || bn.ctaLabel?.en || (locale === 'ar' ? 'تسوق العرض' : 'Shop Offer'),
          ctaUrl: bn.targetUrl || '/catalog?deals=true',
          imageUrl:
            bn.imageUrl ||
            (typeof c.imageUrl === 'string' && c.imageUrl
              ? String(c.imageUrl)
              : '/src/assets/images/hero_beirut_editorial_1795297173320.jpg'),
          focalX: 50,
          focalY: 45,
        });
      }
    }

    for (const fs of activeHeroFlashSales.slice(0, 2)) {
      const firstItem = fs.items[0];
      const linkedProd = firstItem ? products.find((p) => p.id === firstItem.productId) : undefined;
      const maxPct = fs.items.reduce((m, it) => Math.max(m, it.discountPercent), 0);
      visualSlides.push({
        id: `hero-slide-fs-${fs.id}`,
        productId: linkedProd?.id,
        badge: locale === 'ar' ? `عرض فلاش · -${maxPct}%` : `FLASH · -${maxPct}%`,
        title: fs.title[locale] || fs.title.en,
        subtitle:
          linkedProd
            ? `${linkedProd.title[locale] || linkedProd.title.en} · ${fs.items.length} ${locale === 'ar' ? 'منتجات' : 'SKUs'}`
            : locale === 'ar'
              ? 'تخفيضات محدودة الوقت بكميات مخصصة'
              : 'Limited-time flash drops while inventory lasts',
        ctaLabel: locale === 'ar' ? 'اقتنص العرض' : 'Shop Flash Deal',
        ctaUrl: linkedProd ? `/product/${linkedProd.slug}` : '/catalog?deals=true',
        imageUrl: linkedProd?.images[0] || '/src/assets/images/cat_electronics_audio_1795297173898.jpg',
        focalX: 50,
        focalY: 50,
      });
    }

    for (const off of activeHeroOffers.slice(0, 3)) {
      const linkedProd =
        off.targetType === 'product' && off.targetId
          ? products.find((p) => p.id === off.targetId)
          : products.find((p) => resolveUnitOfferPrice(p.basePriceUsdCents, p, [off], nowMs).appliedOffer !== null);
      const valBadge =
        off.offerType === 'fixed_usd_cents'
          ? `-$${(off.discountValue / 100).toFixed(0)}`
          : off.offerType === 'free_shipping'
            ? locale === 'ar'
              ? 'شحن مجاني'
              : 'FREE SHIP'
            : off.offerType === 'bogo'
              ? 'BOGO'
              : off.offerType === 'buy_x_get_y'
                ? `${locale === 'ar' ? 'اشترِ' : 'BUY'} ${off.rules?.buyQty || 2} + ${off.rules?.getQty || 1}`
                : `-${off.discountValue}%`;
      visualSlides.push({
        id: `hero-slide-off-${off.id}`,
        productId: linkedProd?.id,
        badge: `${locale === 'ar' ? 'عرض' : 'OFFER'} · ${valBadge}`,
        title: off.title[locale] || off.title.en,
        subtitle: linkedProd
          ? linkedProd.title[locale] || linkedProd.title.en
          : locale === 'ar'
            ? 'خصم تلقائي يطبق مباشرة في حقيبة التسوق'
            : 'Applied automatically at checkout across eligible SKUs',
        ctaLabel: locale === 'ar' ? 'تسوق العرض' : 'Shop Offer',
        ctaUrl: linkedProd ? `/product/${linkedProd.slug}` : '/catalog?deals=true',
        imageUrl:
          linkedProd?.images[0] ||
          (off.targetId === 'fashion'
            ? '/src/assets/images/cat_fashion_linen_1795297173988.jpg'
            : off.targetId === 'electronics'
              ? '/src/assets/images/cat_electronics_audio_1795297173898.jpg'
              : '/src/assets/images/cat_home_gadgets_1795297173679.jpg'),
        focalX: 50,
        focalY: 48,
      });
    }

    for (const cmp of activeHeroCampaigns) {
      visualSlides.push({
        id: `hero-slide-cmp-${cmp.id}`,
        badge: locale === 'ar' ? 'حملة موسمية' : 'CAMPAIGN',
        title: cmp.title[locale] || cmp.title.en,
        subtitle:
          cmp.subtitle?.[locale] ||
          cmp.subtitle?.en ||
          (locale === 'ar' ? 'تشكيلة عروض حصرية في نايل لينك' : 'Curated seasonal offer showcase'),
        ctaLabel: locale === 'ar' ? 'استكشف الحملة' : 'Open Campaign',
        ctaUrl: `/campaign/${cmp.slug}`,
        imageUrl: cmp.heroImageUrl || '/src/assets/images/cat_fashion_linen_1795297173988.jpg',
        focalX: 50,
        focalY: 45,
      });
    }

    // Ensure rich multi-slide continuous showcase even before external banners are added
    if (visualSlides.length < 3) {
      visualSlides.push(
        {
          id: 'curated-offer-deals',
          badge: locale === 'ar' ? 'العروض النشطة' : 'ACTIVE DEALS',
          title: locale === 'ar' ? 'تخفيضات مباشرة على منتجات مختارة تحت 60$' : 'Curated Storefront Deals Under $60',
          subtitle:
            locale === 'ar'
              ? 'اكتشف منتجات الأزياء والإلكترونيات وأدوات المنزل بتسعير مزدوج شفاف'
              : 'Fashion, studio electronics, and home rituals with transparent USD & LBP pricing',
          ctaLabel: locale === 'ar' ? 'تصفح العروض' : 'Browse Active Deals',
          ctaUrl: '/catalog?deals=true',
          imageUrl: '/src/assets/images/cat_fashion_linen_1795297173988.jpg',
          focalX: 50,
          focalY: 42,
        },
        {
          id: 'curated-offer-electronics',
          badge: locale === 'ar' ? 'ضمان محلي' : 'VERIFIED TECH',
          title: locale === 'ar' ? 'الإلكترونيات والهواتف بضمان المتاجر اللبنانية' : 'Studio Tech & Verified Warranty',
          subtitle:
            locale === 'ar'
              ? 'شحن سريع لجميع المحافظات مع تتبع مستقل لكل متجر'
              : 'Direct nationwide dispatch split cleanly per merchant',
          ctaLabel: locale === 'ar' ? 'قسم الإلكترونيات' : 'Shop Electronics',
          ctaUrl: '/catalog?department=electronics',
          imageUrl: '/src/assets/images/cat_electronics_audio_1795297173898.jpg',
          focalX: 50,
          focalY: 50,
        }
      );
    }

    const activeSlidePosition = slideIdx % visualSlides.length;
    const activeVisual = visualSlides[activeSlidePosition];
    const activeSlide =
      mode === 'slider' && configuredSlides.length > 0
        ? configuredSlides[slideIdx % configuredSlides.length]
        : null;

    const slideTitle = activeSlide ? getLocalized(activeSlide.title, locale, titleText) : titleText;
    const kicker = getLocalized(activeSlide?.kicker ?? c.kicker, locale, t.heroKicker);
    const subline = getLocalized(activeSlide?.subline ?? c.subline, locale, t.heroSubline);
    const primaryCtaLabel = getLocalized(activeSlide?.ctaLabel ?? c.primaryCtaLabel, locale, t.heroPrimaryCta);
    const primaryCtaUrl =
      typeof (activeSlide?.ctaUrl ?? c.primaryCtaUrl) === 'string' && (activeSlide?.ctaUrl ?? c.primaryCtaUrl)
        ? String(activeSlide?.ctaUrl ?? c.primaryCtaUrl)
        : '/catalog';
    const secondaryCtaLabel = getLocalized(c.secondaryCtaLabel, locale, t.heroSecondaryCta);
    const secondaryCtaUrl = typeof c.secondaryCtaUrl === 'string' && c.secondaryCtaUrl ? c.secondaryCtaUrl : '/seller';
    const showSearch = c.showSearch !== false;
    const badgeLabel = getLocalized(c.badgeLabel, locale, locale === 'ar' ? 'بائع موثق' : 'Verified');
    const showOffersRail = c.showOffersRail !== false;
    const showAnnouncementsBar = c.showAnnouncementsBar !== false;
    const offersRailHeading = getLocalized(
      c.offersRailHeading,
      locale,
      locale === 'ar' ? 'العروض الحية والتخفيضات السريعة' : 'Live Deals & Flash Drops'
    );
    const promoCouponCode = typeof c.promoCouponCode === 'string' ? c.promoCouponCode.trim() : '';
    const promoText = getLocalized(
      c.promoText,
      locale,
      locale === 'ar' ? 'استخدم الرمز عند الدفع لخصم إضافي' : 'Use code at checkout for extra savings'
    );

    // Updated announcements ticker items: platform announcement + configured hero announcements + top campaigns/offers
    const announcementFeed: Array<{
      id: string;
      tag: string;
      text: string;
      ctaLabel?: string;
      ctaUrl?: string;
      tone: 'ember' | 'cedar' | 'gold' | 'cyan';
    }> = [];

    const sysAnn = settings.announcement?.[locale]?.trim();
    if (sysAnn) {
      announcementFeed.push({
        id: 'platform-announcement',
        tag: locale === 'ar' ? 'تحديث المنصة' : 'UPDATE',
        text: sysAnn,
        ctaLabel: locale === 'ar' ? 'تصفح' : 'Explore',
        ctaUrl: '/catalog?deals=true',
        tone: 'ember',
      });
    }

    for (const off of activeHeroOffers.slice(0, 2)) {
      const offTitle = off.title[locale] || off.title.en;
      if (offTitle) {
        announcementFeed.push({
          id: `ann-offer-${off.id}`,
          tag: locale === 'ar' ? 'عرض نشط' : 'OFFER',
          text: `${offTitle}${off.offerType === 'percent' ? ` (-${off.discountValue}%)` : ''}`,
          ctaLabel: locale === 'ar' ? 'تسوق العرض' : 'Shop Deal',
          ctaUrl: '/catalog?deals=true',
          tone: 'ember',
        });
      }
    }

    const customAnnouncements = Array.isArray(c.announcements) ? (c.announcements as HeroAnnouncementItem[]) : [];
    for (const item of customAnnouncements) {
      const txt = item.text?.[locale] || item.text?.en;
      if (!txt) continue;
      announcementFeed.push({
        id: item.id,
        tag: item.tag?.[locale] || item.tag?.en || (locale === 'ar' ? 'إعلان' : 'NOTICE'),
        text: txt,
        ctaLabel: item.ctaLabel?.[locale] || item.ctaLabel?.en,
        ctaUrl: item.ctaUrl,
        tone: item.tone || 'cedar',
      });
    }

    if (announcementFeed.length === 0) {
      announcementFeed.push(
        {
          id: 'default-ann-1',
          tag: locale === 'ar' ? 'التوصيل' : 'LOGISTICS',
          text:
            locale === 'ar'
              ? 'شحن مباشر ومقسم لكل بائع إلى جميع المحافظات الثماني في لبنان.'
              : 'Nationwide split-seller delivery across all 8 Lebanese governorates.',
          ctaLabel: locale === 'ar' ? 'مناطق التوصيل' : 'Delivery Zones',
          ctaUrl: '/support',
          tone: 'cedar',
        },
        {
          id: 'default-ann-2',
          tag: locale === 'ar' ? 'عروض اليوم' : 'DEALS',
          text:
            locale === 'ar'
              ? 'تسعير مزدوج بالدولار والليرة اللبنانية محدّث يومياً مع عروض تلقائية.'
              : 'Daily synced USD & LBP dual pricing with instant checkout offers.',
          ctaLabel: locale === 'ar' ? 'العروض النشطة' : 'Active Deals',
          ctaUrl: '/catalog?deals=true',
          tone: 'gold',
        }
      );
    }

    const activeAnnPosition = announcementIdx % announcementFeed.length;
    const activeAnn = announcementFeed[activeAnnPosition];

    type HeroSpotlightCard = {
      id: string;
      productId?: string;
      badge: string;
      title: string;
      meta: string;
      accent: 'ember' | 'gold' | 'cedar' | 'cyan';
      url: string;
    };

    const spotlightCards: HeroSpotlightCard[] = [
      ...activeHeroFlashSales.slice(0, 2).map((fs) => {
        const endMs = parseUtcTimestampMs(fs.endsAt);
        const maxPct = fs.items.reduce((m, it) => Math.max(m, it.discountPercent), 0);
        return {
          id: `hero-fs-${fs.id}`,
          productId: fs.items[0]?.productId,
          badge: locale === 'ar' ? `عرض فلاش · حتى -${maxPct}%` : `FLASH · UP TO -${maxPct}%`,
          title: fs.title[locale] || fs.title.en,
          meta:
            endMs && endMs > nowMs
              ? `${locale === 'ar' ? 'ينتهي خلال' : 'Ends in'} ${formatCountdown(endMs - nowMs)}`
              : `${fs.items.length} ${locale === 'ar' ? 'منتجات' : 'SKUs'}`,
          accent: 'ember' as const,
          url: '/catalog?deals=true',
        };
      }),
      ...activeHeroOffers.slice(0, 3).map((off) => {
        const valLabel =
          off.offerType === 'fixed_usd_cents'
            ? `-$${(off.discountValue / 100).toFixed(0)}`
            : off.offerType === 'free_shipping'
              ? locale === 'ar'
                ? 'شحن مجاني'
                : 'FREE SHIP'
              : off.offerType === 'bogo'
                ? 'BOGO'
                : off.offerType === 'buy_x_get_y'
                  ? `BUY ${off.rules?.buyQty || 2} GET ${off.rules?.getQty || 1}`
                  : `-${off.discountValue}%`;
        return {
          id: `hero-off-${off.id}`,
          productId: off.targetType === 'product' && off.targetId ? off.targetId : undefined,
          badge: valLabel,
          title: off.title[locale] || off.title.en,
          meta: `${off.targetType.toUpperCase()} · ${
            off.stackingRule === 'stackable'
              ? locale === 'ar'
                ? 'قابل للدمج'
                : 'Stackable'
              : locale === 'ar'
                ? 'عرض حصري'
                : 'Auto-applied'
          }`,
          accent: 'cedar' as const,
          url: off.campaignId
            ? (() => {
                const linked = activeHeroCampaigns.find((cmp) => cmp.id === off.campaignId);
                return linked ? `/campaign/${linked.slug}` : '/catalog?deals=true';
              })()
            : '/catalog?deals=true',
        };
      }),
      ...activeHeroCampaigns.slice(0, 2).map((cmp) => ({
        id: `hero-cmp-${cmp.id}`,
        badge: locale === 'ar' ? 'حملة موسمية' : 'CAMPAIGN',
        title: cmp.title[locale] || cmp.title.en,
        meta:
          cmp.subtitle?.[locale] ||
          cmp.subtitle?.en ||
          (locale === 'ar' ? 'تصفح صفحة الحملة' : 'Open campaign showcase'),
        accent: 'gold' as const,
        url: `/campaign/${cmp.slug}`,
      })),
    ].slice(0, 6);

    const primaryCampaign = activeHeroCampaigns[0] || null;
    const toneColorMap: Record<'ember' | 'cedar' | 'gold' | 'cyan', string> = {
      ember: 'var(--ember)',
      cedar: 'var(--cedar)',
      gold: 'var(--gold)',
      cyan: 'var(--cyan)',
    };

    const quickFilters = [
      { label: locale === 'ar' ? 'العروض النشطة' : 'Active Deals', url: '/catalog?deals=true' },
      { label: locale === 'ar' ? 'تحت 60$' : 'Under $60', url: '/catalog?q=under%20%2460' },
      { label: t.fashionTitle, url: '/catalog?department=fashion' },
      { label: locale === 'ar' ? 'الإلكترونيات' : 'Electronics', url: '/catalog?department=electronics' },
      { label: t.homeTitle, url: '/catalog?department=home-gadgets' },
      ...(wishlist.length > 0
        ? [{ label: `${t.wishlist} (${wishlist.length})`, url: '/catalog?wishlist=true' }]
        : []),
    ];

    const isActiveVisualWished = Boolean(activeVisual.productId && wishlist.includes(activeVisual.productId));

    return wrapPreviewHeader(
      <div className="border border-[var(--line)] bg-[var(--line)] space-y-px overflow-hidden">
        {/* Continuous Auto-Advancing Announcements & Offer Ticker (No Arrows) */}
        {showAnnouncementsBar && activeAnn && (
          <div
            onMouseEnter={() => setAnnPaused(true)}
            onMouseLeave={() => setAnnPaused(false)}
            onFocus={() => setAnnPaused(true)}
            onBlur={() => setAnnPaused(false)}
            className="bg-[var(--ink)] px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs relative overflow-hidden"
          >
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeAnn.id + activeAnnPosition}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 min-w-0"
                >
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-mono-tabular font-bold uppercase shrink-0"
                    style={{ borderColor: toneColorMap[activeAnn.tone], color: toneColorMap[activeAnn.tone] }}
                  >
                    <Megaphone className="w-3 h-3" aria-hidden="true" />
                    <span>{activeAnn.tag}</span>
                  </span>
                  <p className="text-[var(--bone)] text-xs sm:text-[13px] font-medium leading-snug break-words sm:truncate">
                    {activeAnn.text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 shrink-0 font-mono-tabular">
              {activeAnn.ctaUrl && activeAnn.ctaLabel && (
                <button
                  type="button"
                  onClick={() => safeNav(activeAnn.ctaUrl!)}
                  className="editorial-link text-[var(--ember)] font-semibold uppercase inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <span>{activeAnn.ctaLabel}</span>
                </button>
              )}
              {announcementFeed.length > 1 && (
                <div className="flex items-center gap-1" role="tablist" aria-label="Announcement slides">
                  {announcementFeed.map((item, idx) => {
                    const isCurrent = idx === activeAnnPosition;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={isCurrent}
                        aria-label={`${item.tag}: ${item.text}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnnouncementIdx(idx);
                        }}
                        className="py-2 px-0.5 cursor-pointer group"
                      >
                        <span
                          className={`block h-1 transition-all duration-300 ${
                            isCurrent
                              ? 'w-6 bg-[var(--ember)]'
                              : 'w-2.5 bg-[var(--line)] group-hover:bg-[var(--muted)]'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Primary 12-Col Hero Grid: Editorial Copy + Continuously Advancing Offer Slider */}
        <div
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-[var(--line)] items-stretch"
        >
          <div className="bg-[var(--graphite)] lg:col-span-7 p-4 sm:p-6 md:p-10 flex flex-col justify-between gap-5 md:gap-6 min-w-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] sm:text-xs font-mono-tabular text-[var(--muted)] tracking-wider uppercase break-words">
                  {kicker}
                </p>
              </div>
              <h1
                className="mt-3 font-display font-bold text-[var(--bone)] leading-[1.08] break-words"
                style={{ fontSize: 'clamp(1.75rem, 4.4vw, 3.5rem)', textWrap: 'balance' }}
              >
                {slideTitle}
              </h1>
              <span className="heading-dash hairline-draw-x" aria-hidden="true" />
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[var(--muted)] max-w-xl leading-relaxed">
                {subline}
              </p>
            </div>

            <div className="space-y-4">
              {showSearch && (
                <div className="space-y-2.5">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const encoded = encodeURIComponent(searchQuery.trim());
                      safeNav(encoded ? `/catalog?q=${encoded}` : '/catalog');
                    }}
                    className="flex flex-col xs:flex-row sm:flex-row border border-[var(--line)] bg-[var(--ink)]"
                  >
                    <div className="flex flex-1 items-center min-w-0">
                      <div className="flex items-center ps-3.5 text-[var(--muted)] shrink-0">
                        <Search className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        aria-label="Search marketplace products"
                        className="flex-1 min-w-0 bg-transparent px-3 py-3 min-h-[44px] text-sm text-[var(--bone)] placeholder:text-[var(--muted)] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-3 min-h-[44px] text-xs font-semibold bg-[var(--graphite)] border-t sm:border-t-0 sm:border-s border-[var(--line)] text-[var(--bone)] hover:bg-[var(--ember)] hover:text-[var(--ember-fg)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {t.searchBtn}
                    </button>
                  </form>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono-tabular">
                    {quickFilters.map((qf) => (
                      <button
                        key={qf.url}
                        type="button"
                        onClick={() => safeNav(qf.url)}
                        className="px-3 py-1.5 min-h-[34px] border border-[var(--line)] bg-[var(--ink)] text-[var(--muted)] hover:border-[var(--ember)] hover:text-[var(--bone)] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                      >
                        {qf.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(promoCouponCode || primaryCampaign) && (
                <div className="border border-[var(--line)] bg-[var(--ink)] px-3 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <Tag className="w-3.5 h-3.5 text-[var(--ember)] shrink-0" aria-hidden="true" />
                    <span className="text-[var(--bone)] truncate">
                      {promoCouponCode ? promoText : primaryCampaign?.title[locale] || primaryCampaign?.title.en}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {promoCouponCode && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!isPreview && navigator.clipboard) {
                            void navigator.clipboard.writeText(promoCouponCode).catch(() => {});
                            showToast(
                              locale === 'ar'
                                ? `تم نسخ الكود ${promoCouponCode}`
                                : `Copied code ${promoCouponCode}`,
                              'success'
                            );
                          }
                        }}
                        className="min-h-[36px] px-2.5 py-1 border border-[var(--ember)] text-[var(--ember)] font-mono-tabular font-bold uppercase inline-flex items-center gap-1.5 hover:bg-[var(--ember)] hover:text-[var(--ember-fg)] transition-colors cursor-pointer"
                      >
                        <span>{promoCouponCode}</span>
                        <Copy className="w-3 h-3" aria-hidden="true" />
                      </button>
                    )}
                    {primaryCampaign && (
                      <button
                        type="button"
                        onClick={() => safeNav(`/campaign/${primaryCampaign.slug}`)}
                        className="editorial-link font-mono-tabular text-[var(--gold)] uppercase cursor-pointer"
                      >
                        <span>{locale === 'ar' ? 'الحملة' : 'Campaign'}</span>
                        <ArrowRight className="w-3 h-3 rtl:rotate-180" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-6 pt-1">
                <button
                  type="button"
                  onClick={() => safeNav(primaryCtaUrl)}
                  className="min-h-[44px] px-6 py-3 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{primaryCtaLabel}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
                </button>
                {secondaryCtaLabel && (
                  <button
                    type="button"
                    onClick={() => safeNav(secondaryCtaUrl)}
                    className="editorial-link min-h-[44px] text-sm font-medium text-[var(--bone)] inline-flex items-center justify-center sm:justify-start cursor-pointer"
                  >
                    {secondaryCtaLabel}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Stage: Continuously Auto-Advancing Offer Showcase Slider (Zero Arrow Clutter) */}
          <div className="bg-[var(--graphite)] lg:col-span-5 relative overflow-hidden group min-h-[290px] sm:min-h-[340px] flex flex-col justify-between">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeVisual.id}
                initial={prefersReducedMotion ? false : { opacity: 0.25, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0.2 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={activeVisual.imageUrl}
                  alt={activeVisual.title}
                  referrerPolicy="no-referrer"
                  style={{ objectPosition: `${activeVisual.focalX}% ${activeVisual.focalY}%` }}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/92 via-black/40 to-black/15" />
              </motion.div>
            </AnimatePresence>

            {/* Top Hairline Offer Selector Tabs & Verified Badge */}
            <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between gap-2">
              {visualSlides.length > 1 ? (
                <div className="flex flex-1 items-center gap-1.5" role="tablist" aria-label="Hero offer showcase slides">
                  {visualSlides.map((vs, idx) => {
                    const isCurrent = idx === activeSlidePosition;
                    return (
                      <button
                        key={vs.id}
                        type="button"
                        role="tab"
                        aria-selected={isCurrent}
                        aria-label={vs.title}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSlideIdx(idx);
                        }}
                        className="flex-1 py-2 cursor-pointer group"
                      >
                        <span className="block h-1 w-full bg-white/25 overflow-hidden">
                          {isCurrent ? (
                            <motion.span
                              key={`bar-${activeVisual.id}-${heroPaused}`}
                              initial={{ scaleX: prefersReducedMotion ? 1 : 0 }}
                              animate={{ scaleX: 1 }}
                              transition={
                                prefersReducedMotion || heroPaused
                                  ? { duration: 0 }
                                  : { duration: 5.1, ease: 'linear' }
                              }
                              style={{ transformOrigin: locale === 'ar' ? '100% 50%' : '0% 50%' }}
                              className="block h-full w-full bg-[var(--ember)]"
                            />
                          ) : (
                            <span className="block h-full w-0 bg-white/60 group-hover:w-full transition-all duration-200" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div />
              )}
              <StampBadge label={badgeLabel} tone="cedar" />
            </div>

            {/* Bottom Animated Offer Showcase Card */}
            <div className="relative z-10 p-4 sm:p-5 mt-auto">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`card-${activeVisual.id}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="border border-white/20 bg-black/75 p-3.5 sm:p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono-tabular font-bold uppercase tracking-wider text-[var(--ember)]">
                      {activeVisual.badge}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {activeVisual.productId && !onSelect && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(activeVisual.productId!);
                          }}
                          aria-pressed={isActiveVisualWished}
                          aria-label={isActiveVisualWished ? 'Remove offer from wishlist' : 'Save offer to wishlist'}
                          className="w-8 h-8 border border-white/25 bg-black/60 flex items-center justify-center text-white hover:border-[var(--ember)] cursor-pointer transition-colors"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isActiveVisualWished ? 'fill-[var(--ember)] text-[var(--ember)]' : ''
                            }`}
                          />
                        </button>
                      )}
                      {visualSlides.length > 1 && (
                        <span className="text-[11px] font-mono-tabular text-white/70">
                          {activeSlidePosition + 1} / {visualSlides.length}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-display font-bold text-white leading-snug line-clamp-2">
                    {activeVisual.title}
                  </p>
                  <p className="text-xs text-white/75 line-clamp-2">{activeVisual.subtitle}</p>

                  {activeVisual.ctaUrl && activeVisual.ctaLabel && (
                    <div className="pt-1 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeVisual.bannerId && !isPreview) {
                            void fetch(`/api/banners/${encodeURIComponent(activeVisual.bannerId)}/track`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ event: 'click' }),
                              keepalive: true,
                            }).catch(() => {});
                          }
                          safeNav(activeVisual.ctaUrl!);
                        }}
                        className="px-3.5 py-2 bg-[var(--ember)] text-[var(--ember-fg)] text-[11px] font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        {activeVisual.ctaLabel}
                      </button>
                      <span className="text-[11px] font-mono-tabular text-white/65 truncate">
                        {locale === 'ar' ? 'تحديث تلقائي مستمر' : 'Live Auto-Showcase'}
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Offers, Flash Drops & Campaigns Spotlight */}
        {showOffersRail && spotlightCards.length > 0 && (
          <div className="bg-[var(--ink)] p-3 sm:p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="inline-flex items-center gap-2 text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--ember)]">
                <Flame className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{offersRailHeading}</span>
              </p>
              <button
                type="button"
                onClick={() => safeNav('/catalog?deals=true')}
                className="editorial-link text-xs font-mono-tabular text-[var(--bone)] cursor-pointer"
              >
                <span>{locale === 'ar' ? 'كل العروض' : 'All Active Deals'}</span>
                <ArrowRight className="w-3 h-3 rtl:rotate-180" aria-hidden="true" />
              </button>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-2.5 pb-1 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-px sm:bg-[var(--line)] sm:border sm:border-[var(--line)]">
              {spotlightCards.map((card) => {
                const accentVar =
                  card.accent === 'ember'
                    ? 'var(--ember)'
                    : card.accent === 'gold'
                      ? 'var(--gold)'
                      : card.accent === 'cedar'
                        ? 'var(--cedar)'
                        : 'var(--cyan)';
                const cardWished = Boolean(card.productId && wishlist.includes(card.productId));
                return (
                  <div
                    key={card.id}
                    className="min-w-[240px] sm:min-w-0 snap-start bg-[var(--graphite)] border border-[var(--line)] sm:border-0 p-3.5 min-h-[76px] hover:bg-[var(--ink)] transition-colors flex items-start justify-between gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => safeNav(card.url)}
                      className="flex-1 min-w-0 text-start flex flex-col justify-between gap-1.5 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2 font-mono-tabular text-[11px]">
                        <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider" style={{ color: accentVar }}>
                          <Zap className="w-3 h-3 shrink-0" aria-hidden="true" />
                          <span>{card.badge}</span>
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[var(--bone)] truncate w-full">{card.title}</p>
                      <p className="text-[11px] font-mono-tabular text-[var(--muted)] truncate w-full">{card.meta}</p>
                    </button>
                    {card.productId && !onSelect && (
                      <button
                        type="button"
                        onClick={() => toggleWishlist(card.productId!)}
                        aria-pressed={cardWished}
                        aria-label={cardWished ? 'Remove from wishlist' : 'Save to wishlist'}
                        className="w-8 h-8 border border-[var(--line)] flex items-center justify-center text-[var(--bone)] hover:border-[var(--ember)] shrink-0 cursor-pointer"
                      >
                        <Heart className={`w-3.5 h-3.5 ${cardWished ? 'fill-[var(--ember)] text-[var(--ember)]' : ''}`} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. announcement_bar
  if (section.sectionType === 'announcement_bar') {
    const kicker = getLocalized(c.kicker, locale, locale === 'ar' ? 'تنبيه' : 'Notice');
    const ctaLabel = getLocalized(c.ctaLabel, locale);
    const ctaUrl = typeof c.ctaUrl === 'string' && c.ctaUrl ? c.ctaUrl : '/catalog';
    const accent = String(c.accentToken || 'ember');
    const countdownMs = typeof c.countdownEndsAt === 'string' ? parseUtcTimestampMs(c.countdownEndsAt) : null;
    const borderVar =
      accent === 'cedar'
        ? 'border-[var(--cedar)]'
        : accent === 'gold'
          ? 'border-[var(--gold)]'
          : accent === 'cyan'
            ? 'border-[var(--cyan)]'
            : accent === 'graphite'
              ? 'border-[var(--line)]'
              : 'border-[var(--ember)]';
    const textVar =
      accent === 'cedar'
        ? 'text-[var(--cedar)]'
        : accent === 'gold'
          ? 'text-[var(--gold)]'
          : accent === 'cyan'
            ? 'text-[var(--cyan)]'
            : accent === 'graphite'
              ? 'text-[var(--bone)]'
              : 'text-[var(--ember)]';

    return wrapPreviewHeader(
      <div className={`border ${borderVar} bg-[var(--graphite)] px-5 py-3.5 flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          {kicker && <span className={`text-xs font-mono-tabular uppercase tracking-wider font-bold ${textVar}`}>{kicker}</span>}
          <span className="text-[var(--line)]" aria-hidden="true">|</span>
          <p className="text-sm font-medium text-[var(--bone)]">{titleText}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {countdownMs && countdownMs > nowMs && (
            <span className="inline-flex items-center gap-1.5 font-mono-tabular text-xs text-[var(--gold)]">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {formatCountdown(countdownMs - nowMs)}
            </span>
          )}
          {ctaLabel && (
            <button
              type="button"
              onClick={() => safeNav(ctaUrl)}
              className={`editorial-link text-xs font-bold uppercase tracking-wider cursor-pointer ${textVar}`}
            >
              {ctaLabel} →
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. promo_strip
  if (section.sectionType === 'promo_strip') {
    const kicker = getLocalized(c.kicker, locale);
    const body = getLocalized(c.body, locale);
    const statLabel = getLocalized(c.statLabel, locale);
    const statValue = typeof c.statValue === 'string' || typeof c.statValue === 'number' ? String(c.statValue) : '';
    const ctaLabel = getLocalized(c.ctaLabel, locale, locale === 'ar' ? 'استكشف' : 'Explore');
    const ctaUrl = typeof c.ctaUrl === 'string' && c.ctaUrl ? c.ctaUrl : '/catalog';

    return wrapPreviewHeader(
      <div className="hairline-grid grid-cols-1 md:grid-cols-12 items-stretch">
        <div className="hairline-cell md:col-span-8 p-6 md:p-8 space-y-3">
          {kicker && <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--ember)]">{kicker}</p>}
          <h2 className="font-display text-3xl font-bold text-[var(--bone)]">{titleText}</h2>
          <span className="heading-dash" aria-hidden="true" />
          {body && <p className="text-sm text-[var(--muted)] max-w-2xl leading-relaxed">{body}</p>}
        </div>
        <div className="hairline-cell md:col-span-4 p-6 md:p-8 flex flex-col justify-between gap-5 bg-[var(--ink)]">
          {statValue ? (
            <div>
              {statLabel && (
                <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--muted)]">{statLabel}</p>
              )}
              <p className="mt-1 font-display text-4xl font-bold font-mono-tabular text-[var(--cedar)]">{statValue}</p>
            </div>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={() => safeNav(ctaUrl)}
            className="self-start px-5 py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    );
  }

  // 4. bento_grid
  if (section.sectionType === 'bento_grid') {
    const tiles = Array.isArray(c.tiles) ? (c.tiles as Array<Record<string, unknown>>) : [];
    return wrapPreviewHeader(
      <div className="space-y-5">
        <SectionHeading title={titleText} />
        <div className="hairline-grid grid-cols-1 md:grid-cols-4">
          {tiles.map((tile, idx) => {
            const isWide = tile.span === 'wide';
            const tint = tile.tint === 'cyan' ? 'var(--cyan)' : tile.tint === 'sage' ? 'var(--sage)' : tile.tint === 'ember' ? 'var(--ember)' : 'var(--sand)';
            const img = String(tile.imageUrl || '/src/assets/images/cat_fashion_linen_1795297173988.jpg');
            const fx = Number(tile.focalX ?? 50);
            const fy = Number(tile.focalY ?? 50);
            return (
              <button
                key={String(tile.id || idx)}
                type="button"
                onClick={() => safeNav(String(tile.url || '/catalog'))}
                className={`hairline-cell group text-start p-5 flex flex-col justify-between gap-4 hover:bg-[var(--ink)] cursor-pointer ${
                  isWide ? 'md:col-span-2' : 'md:col-span-1'
                }`}
              >
                <div className="space-y-3">
                  <div className={`${isWide ? 'aspect-[16/9]' : 'aspect-[4/3]'} w-full overflow-hidden bg-[var(--ink)]`}>
                    <img
                      src={img}
                      alt={getLocalized(tile.title, locale)}
                      style={{ objectPosition: `${fx}% ${fy}%` }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider" style={{ color: tint }}>
                    {getLocalized(tile.tag, locale)}
                  </p>
                  <h3 className="font-display text-2xl font-bold text-[var(--bone)]">{getLocalized(tile.title, locale)}</h3>
                  <p className="text-sm text-[var(--muted)]">{getLocalized(tile.subtitle, locale)}</p>
                </div>
                <span className="editorial-link text-xs font-semibold text-[var(--bone)]">
                  {locale === 'ar' ? 'استكشاف' : 'Explore'}
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 5. product_grid
  if (section.sectionType === 'product_grid') {
    const sourceMode = String(c.sourceMode || c.filterMode || 'all');
    const deptFilter = String(c.department || '');
    const limit = Math.max(1, Math.min(12, Number(c.limit || 6)));
    const columns = Number(c.columns || 3);
    const colClass = columns === 4 ? 'lg:grid-cols-4 md:grid-cols-2' : columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
    const subtitle = getLocalized(c.subtitle, locale);
    const ctaLabel = getLocalized(c.ctaLabel, locale, locale === 'ar' ? 'تصفح الكتالوج' : 'Browse Catalog');
    const ctaUrl = typeof c.ctaUrl === 'string' && c.ctaUrl ? c.ctaUrl : '/catalog';
    const visible = selectProductsList(sourceMode, deptFilter, c.productIds, limit);

    return wrapPreviewHeader(
      <div className="space-y-5">
        <SectionHeading
          title={titleText}
          subtitle={subtitle || undefined}
          action={
            <button
              type="button"
              onClick={() => safeNav(ctaUrl)}
              className="editorial-link text-xs font-semibold text-[var(--bone)] cursor-pointer"
            >
              {ctaLabel}
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
            </button>
          }
        />
        {visible.length === 0 ? (
          <EmptyState
            title={locale === 'ar' ? 'لا توجد منتجات منشورة بعد' : 'No products published yet'}
            description={
              locale === 'ar'
                ? 'يمكن للبائعين اللبنانيين التقديم وإضافة أول منتج فور الموافقة على المتجر.'
                : 'Lebanese merchants can apply in Seller Hub and publish the first SKU once approved.'
            }
            actionLabel={t.heroSecondaryCta}
            onAction={() => safeNav('/seller')}
          />
        ) : (
          <div className={`hairline-grid grid-cols-1 ${colClass}`}>
            {visible.map((product) => (
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

  // 6. product_carousel
  if (section.sectionType === 'product_carousel') {
    const sourceMode = String(c.sourceMode || 'featured');
    const deptFilter = String(c.department || '');
    const limit = Math.max(2, Math.min(16, Number(c.limit || 8)));
    const subtitle = getLocalized(c.subtitle, locale);
    const ctaLabel = getLocalized(c.ctaLabel, locale, locale === 'ar' ? 'عرض الكل' : 'View All');
    const ctaUrl = typeof c.ctaUrl === 'string' && c.ctaUrl ? c.ctaUrl : '/catalog';
    const visible = selectProductsList(sourceMode, deptFilter, c.productIds, limit);

    const stepRail = (dir: -1 | 1) => {
      if (!carouselRef.current) return;
      const offset = dir * 340 * (locale === 'ar' ? -1 : 1);
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    };

    return wrapPreviewHeader(
      <div className="space-y-5">
        <SectionHeading
          title={titleText}
          subtitle={subtitle || undefined}
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepRail(-1);
                }}
                aria-label="Previous products"
                className="w-8 h-8 border border-[var(--line)] flex items-center justify-center text-[var(--bone)] hover:border-[var(--ember)] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepRail(1);
                }}
                aria-label="Next products"
                className="w-8 h-8 border border-[var(--line)] flex items-center justify-center text-[var(--bone)] hover:border-[var(--ember)] cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => safeNav(ctaUrl)}
                className="ms-2 editorial-link text-xs font-semibold text-[var(--bone)] cursor-pointer"
              >
                {ctaLabel}
              </button>
            </div>
          }
        />
        {visible.length === 0 ? (
          <EmptyState
            title={locale === 'ar' ? 'لا توجد منتجات للعرض' : 'No products in carousel yet'}
            description={
              locale === 'ar'
                ? 'أضف منتجات من المتاجر المعتمدة أو اختر يدوياً من لوحة الإعدادات.'
                : 'Published merchant products matching this filter will scroll here automatically.'
            }
          />
        ) : (
          <div
            ref={carouselRef}
            className="flex gap-px bg-[var(--line)] border border-[var(--line)] overflow-x-auto snap-x snap-mandatory"
          >
            {visible.map((product) => (
              <div key={product.id} className="min-w-[240px] sm:min-w-[300px] snap-start bg-[var(--graphite)]">
                <ProductCard product={product} seller={sellers.find((s) => s.id === product.sellerId)} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 7. category_tiles
  if (section.sectionType === 'category_tiles') {
    const columns = Number(c.columns || 3);
    const colClass = columns === 4 ? 'lg:grid-cols-4 md:grid-cols-2' : columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
    const rawItems = Array.isArray(c.items) ? (c.items as Array<Record<string, unknown>>) : [];

    return wrapPreviewHeader(
      <div className="space-y-5">
        <SectionHeading title={titleText} />
        <div className={`hairline-grid grid-cols-1 ${colClass}`}>
          {rawItems.map((it, idx) => {
            const tint = String(it.tint || 'var(--sand)');
            const img = String(it.image || '/src/assets/images/cat_fashion_linen_1795297173988.jpg');
            const fx = Number(it.focalX ?? 50);
            const fy = Number(it.focalY ?? 50);
            const url = String(it.url || `/catalog?department=${String(it.slug || 'fashion')}`);
            const itemTitle = getLocalized(it.title, locale);

            return (
              <button
                key={String(it.slug || idx)}
                type="button"
                onClick={() => safeNav(url)}
                className="hairline-cell group text-start p-5 flex flex-col justify-between gap-4 hover:bg-[var(--ink)] cursor-pointer"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--ink)]">
                    <img
                      src={img}
                      alt={itemTitle}
                      style={{ objectPosition: `${fx}% ${fy}%` }}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-4 text-[11px] font-mono-tabular uppercase tracking-wider" style={{ color: tint }}>
                    {getLocalized(it.tag, locale)}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-bold text-[var(--bone)]">{itemTitle}</h3>
                  <p className="mt-1.5 text-sm text-[var(--muted)]">{getLocalized(it.desc, locale)}</p>
                </div>
                <span className="editorial-link text-xs font-semibold text-[var(--bone)]">
                  {locale === 'ar' ? 'تصفح القسم' : 'Browse Department'}
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 8. department_spotlight
  if (section.sectionType === 'department_spotlight') {
    const department = String(c.department || 'electronics');
    const description = getLocalized(c.description, locale);
    const ctaLabel = getLocalized(c.ctaLabel, locale, locale === 'ar' ? 'عرض القسم' : 'View Department');
    const limit = Math.max(1, Math.min(6, Number(c.limit || 3)));
    const deptProducts = products.filter((p) => p.department === department).slice(0, limit);

    return wrapPreviewHeader(
      <div className="hairline-grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="hairline-cell lg:col-span-4 p-6 md:p-8 flex flex-col justify-between gap-6">
          <div>
            <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--cyan)]">
              {department.replace('-', ' ')}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[var(--bone)]">{titleText}</h2>
            <span className="heading-dash" aria-hidden="true" />
            {description && <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{description}</p>}
          </div>
          <button
            type="button"
            onClick={() => safeNav(`/catalog?department=${encodeURIComponent(department)}`)}
            className="self-start px-5 py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        <div className="hairline-cell lg:col-span-8 p-4 md:p-6">
          {deptProducts.length === 0 ? (
            <EmptyState
              title={locale === 'ar' ? 'لا توجد منتجات في هذا القسم بعد' : 'No products in this department yet'}
              description={
                locale === 'ar'
                  ? 'سيتم عرض المنتجات المعتمدة لهذا القسم فور نشرها.'
                  : 'Approved merchant products for this department will appear here automatically.'
              }
            />
          ) : (
            <div className="hairline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {deptProducts.map((p) => (
                <ProductCard key={p.id} product={p} seller={sellers.find((s) => s.id === p.sellerId)} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 9. flash_sale_block
  if (section.sectionType === 'flash_sale_block') {
    const subtitle = getLocalized(c.subtitle, locale);
    const limit = Math.max(1, Math.min(9, Number(c.limit || 3)));
    const showCountdown = c.showCountdown !== false;
    const manualIds = Array.isArray(c.productIds) ? c.productIds.map(String) : [];

    const scheduledEnds = offers
      .map((o) => parseUtcTimestampMs(o.endsAt))
      .filter((ms): ms is number => ms !== null && ms > nowMs)
      .sort((a, b) => a - b);
    const nearestEndMs = scheduledEnds[0] ?? null;

    const discountedProducts =
      manualIds.length > 0
        ? manualIds
            .map((id) => products.find((p) => p.id === id))
            .filter((p): p is (typeof products)[number] => Boolean(p))
            .slice(0, limit)
        : products
            .filter((p) => resolveUnitOfferPrice(p.basePriceUsdCents, p, offers, nowMs).appliedOffer !== null)
            .slice(0, limit);

    return wrapPreviewHeader(
      <div className="space-y-5">
        <SectionHeading
          title={titleText}
          subtitle={subtitle || undefined}
          action={
            showCountdown && nearestEndMs ? (
              <div className="inline-flex items-center gap-2 border border-[var(--ember)] bg-[var(--graphite)] px-3.5 py-2 text-xs font-mono-tabular text-[var(--ember)]">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{formatCountdown(nearestEndMs - nowMs)}</span>
              </div>
            ) : undefined
          }
        />

        {discountedProducts.length === 0 ? (
          <EmptyState
            title={locale === 'ar' ? 'لا توجد عروض مجدولة نشطة حالياً' : 'No active scheduled offers right now'}
            description={
              locale === 'ar'
                ? 'يمكن للإدارة أو التجار المعتمدين جدولة عروض مؤقتة من لوحة التحكم.'
                : 'Approved platform or seller-submitted offers appear here automatically when active.'
            }
          />
        ) : (
          <div className="hairline-grid grid-cols-1 md:grid-cols-3">
            {discountedProducts.map((p) => (
              <ProductCard key={p.id} product={p} seller={sellers.find((s) => s.id === p.sellerId)} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 10. featured_stores
  if (section.sectionType === 'featured_stores') {
    const limit = Math.max(1, Math.min(12, Number(c.limit || 6)));
    const subtitle = getLocalized(c.subtitle, locale);
    const manualIds = Array.isArray(c.sellerIds) ? c.sellerIds.map(String) : [];
    const visibleSellers =
      manualIds.length > 0
        ? manualIds
            .map((id) => sellers.find((s) => s.id === id))
            .filter((s): s is (typeof sellers)[number] => Boolean(s))
            .slice(0, limit)
        : sellers.slice(0, limit);

    return wrapPreviewHeader(
      <div className="space-y-5">
        <SectionHeading title={titleText} subtitle={subtitle || undefined} />
        {visibleSellers.length === 0 ? (
          <EmptyState
            title={locale === 'ar' ? 'لا توجد متاجر مفعّلة بعد' : 'No live storefronts yet'}
            description={
              locale === 'ar'
                ? 'سجّل متجرك الآن ليظهر في واجهة المتاجر الموثقة بعد المراجعة.'
                : 'Apply as a Lebanese merchant to launch the first verified storefront on NileLink.'
            }
            actionLabel={t.heroSecondaryCta}
            onAction={() => safeNav('/seller')}
          />
        ) : (
          <div className="hairline-grid grid-cols-1 md:grid-cols-3">
            {visibleSellers.map((seller) => (
              <div key={seller.id} className="hairline-cell p-5 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono-tabular text-[var(--muted)] uppercase">
                      {seller.governorate} · {seller.district}
                    </span>
                    {seller.verified && <StampBadge label={t.verifiedSeller} tone="cedar" />}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold text-[var(--bone)]">{seller.name[locale]}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{seller.tagline[locale]}</p>
                </div>

                <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs">
                  <span className="font-mono-tabular text-[var(--bone)]">
                    ★ {seller.rating.toFixed(1)} · {seller.reviewCount}{' '}
                    {locale === 'ar' ? 'تقييم' : 'reviews'}
                  </span>
                  <button
                    type="button"
                    onClick={() => safeNav(`/store/${seller.slug}`)}
                    className="editorial-link font-semibold text-[var(--ember)] cursor-pointer"
                  >
                    {t.viewStore}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 11. brand_bar
  if (section.sectionType === 'brand_bar') {
    const items = Array.isArray(c.items) ? (c.items as Array<Record<string, unknown>>) : [];
    return wrapPreviewHeader(
      <div className="space-y-4">
        <SectionHeading title={titleText} />
        <div className="hairline-grid grid-cols-2 md:grid-cols-4">
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => safeNav(String(item.url || '/catalog'))}
              className="hairline-cell p-5 text-start hover:bg-[var(--ink)] flex items-center justify-between gap-3 cursor-pointer"
            >
              <div>
                <p className="font-display text-xl font-bold text-[var(--bone)]">{String(item.name || '')}</p>
                <p className="text-[11px] font-mono-tabular uppercase text-[var(--muted)] mt-0.5">
                  {getLocalized(item.note, locale)}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--ember)] rtl:rotate-180 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 12. trust_cells
  if (section.sectionType === 'trust_cells') {
    const mode = String(c.mode || 'guarantees');
    if (mode === 'governorates') {
      const subtitle = getLocalized(c.subtitle, locale);
      return wrapPreviewHeader(
        <div className="space-y-5">
          <SectionHeading title={titleText} subtitle={subtitle || undefined} />
          <div className="hairline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {deliveryZones.map((zone) => (
              <div key={zone.governorateCode} className="hairline-cell p-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--bone)]">{zone.name[locale]}</p>
                  <p className="mt-1 text-xs font-mono-tabular text-[var(--muted)]">{zone.etaDays}</p>
                </div>
                <div className="text-end font-mono-tabular text-xs font-semibold text-[var(--cedar)]">
                  {formatMoney(zone.platformFeeUsdCents, currency, settings.exchangeRateLbpPerUsd, locale)}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const showSpotlight = c.showSpotlightProduct !== false;
    const heroFeatured = showSpotlight ? products.find((p) => p.isFeatured) || products[0] || null : null;
    const rawCells = Array.isArray(c.cells) ? (c.cells as Array<Record<string, unknown>>) : [];
    const fallbackCells = [
      { icon: 'wallet', title: { en: t.currencyTitle, ar: t.currencyTitle }, desc: { en: t.currencyDesc, ar: t.currencyDesc } },
      { icon: 'shield', title: { en: t.trustTitle, ar: t.trustTitle }, desc: { en: t.trustDesc, ar: t.trustDesc } },
      { icon: 'truck', title: { en: t.deliveryTitle, ar: t.deliveryTitle }, desc: { en: t.deliveryDesc, ar: t.deliveryDesc } },
    ];
    const cells = rawCells.length >= 3 ? rawCells : fallbackCells;

    const renderIcon = (icon: unknown) => {
      if (icon === 'shield') return <ShieldCheck className="w-5 h-5 text-[var(--cedar)] shrink-0 mt-0.5" aria-hidden="true" />;
      if (icon === 'truck') return <Truck className="w-5 h-5 text-[var(--cyan)] shrink-0 mt-0.5" aria-hidden="true" />;
      return <Wallet className="w-5 h-5 text-[var(--gold)] shrink-0 mt-0.5" aria-hidden="true" />;
    };

    const firstCell = cells[0];
    const remainingCells = cells.slice(1, 3);

    return wrapPreviewHeader(
      <div className="hairline-grid grid-cols-1 md:grid-cols-3">
        {heroFeatured ? (
          <button
            type="button"
            onClick={() => safeNav(`/product/${heroFeatured.slug}`)}
            className="hairline-cell p-5 text-start flex items-center justify-between gap-4 hover:bg-[var(--ink)] cursor-pointer group"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--gold)]">
                {locale === 'ar' ? 'المنتج المميز' : 'Spotlight'}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--bone)] truncate group-hover:text-[var(--ember)]">
                {heroFeatured.title[locale]}
              </p>
              <div className="mt-1.5">
                <PriceDisplay
                  usdCents={resolveUnitOfferPrice(heroFeatured.basePriceUsdCents, heroFeatured, offers, nowMs).effectiveUsdCents}
                  size="sm"
                />
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--muted)] shrink-0 rtl:rotate-180" aria-hidden="true" />
          </button>
        ) : (
          <div className="hairline-cell p-5 flex items-start gap-3.5">
            {renderIcon(firstCell.icon)}
            <div>
              <h2 className="text-sm font-semibold text-[var(--bone)]">{getLocalized(firstCell.title, locale)}</h2>
              <p className="mt-1 text-xs text-[var(--muted)]">{getLocalized(firstCell.desc, locale)}</p>
            </div>
          </div>
        )}

        {remainingCells.map((cell, i) => (
          <div key={i} className="hairline-cell p-5 flex items-start gap-3.5">
            {renderIcon(cell.icon)}
            <div>
              <h2 className="text-sm font-semibold text-[var(--bone)]">{getLocalized(cell.title, locale)}</h2>
              <p className="mt-1 text-xs text-[var(--muted)]">{getLocalized(cell.desc, locale)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 13. social_proof
  if (section.sectionType === 'social_proof') {
    const subtitle = getLocalized(c.subtitle, locale);
    const items = Array.isArray(c.items) ? (c.items as Array<Record<string, unknown>>) : [];
    return wrapPreviewHeader(
      <div className="space-y-5">
        <SectionHeading title={titleText} subtitle={subtitle || undefined} />
        <div className="hairline-grid grid-cols-1 md:grid-cols-3">
          {items.map((item, idx) => {
            const stars = Math.max(1, Math.min(5, Number(item.rating ?? 5)));
            return (
              <div key={idx} className="hairline-cell p-6 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[var(--gold)]">
                    {Array.from({ length: stars }).map((_, sIdx) => (
                      <Star key={sIdx} className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--bone)] leading-relaxed">
                    “{getLocalized(item.quote, locale)}”
                  </p>
                </div>
                <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-mono-tabular">
                  <span className="text-[var(--bone)] font-semibold">{String(item.author || 'Buyer')}</span>
                  <span className="text-[var(--muted)]">{getLocalized(item.city, locale)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 14. how_it_works
  if (section.sectionType === 'how_it_works') {
    const eyebrow = getLocalized(c.eyebrow, locale);
    const body = getLocalized(c.body, locale);
    const ctaLabel = getLocalized(c.ctaLabel, locale, t.heroSecondaryCta);
    const ctaUrl = typeof c.ctaUrl === 'string' && c.ctaUrl ? c.ctaUrl : '/seller';
    const showPlans = c.showPlans !== false;
    const steps = Array.isArray(c.steps) ? (c.steps as Array<Record<string, unknown>>) : [];

    return wrapPreviewHeader(
      <div className="space-y-6">
        <div className="hairline-grid grid-cols-1 lg:grid-cols-12">
          <div className="hairline-cell lg:col-span-5 p-6 md:p-8 flex flex-col justify-between gap-6">
            <div>
              {eyebrow && (
                <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--cedar)]">{eyebrow}</p>
              )}
              <h2 className="mt-2 font-display text-3xl font-bold text-[var(--bone)]">{titleText}</h2>
              <span className="heading-dash" aria-hidden="true" />
              {body && <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{body}</p>}
            </div>
            <button
              type="button"
              onClick={() => safeNav(ctaUrl)}
              className="self-start px-6 py-3 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          <div className="hairline-cell lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)]">
            {showPlans && subscriptionPlans.length > 0
              ? subscriptionPlans.map((plan) => (
                  <div key={plan.tier} className="p-6 flex flex-col justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono-tabular uppercase text-[var(--muted)]">{plan.tier}</p>
                      <h3 className="mt-1 font-display text-2xl font-bold text-[var(--bone)]">{plan.name[locale]}</h3>
                      <p className="mt-2 font-mono-tabular text-lg font-bold text-[var(--ember)]">
                        {plan.monthlyFeeUsdCents === 0
                          ? locale === 'ar'
                            ? 'مجاني'
                            : 'Free'
                          : formatMoney(plan.monthlyFeeUsdCents, currency, settings.exchangeRateLbpPerUsd, locale) +
                            (locale === 'ar' ? ' / شهر' : '/mo')}
                      </p>
                      <ul className="mt-3 space-y-1.5 text-xs text-[var(--muted)]">
                        {plan.features.slice(0, 3).map((f, idx) => (
                          <li key={idx}>· {f[locale]}</li>
                        ))}
                      </ul>
                    </div>
                    <span className="text-[11px] font-mono-tabular text-[var(--cedar)]">
                      {plan.productLimit
                        ? `${plan.productLimit} SKUs max`
                        : locale === 'ar'
                          ? 'منتجات غير محدودة'
                          : 'Unlimited SKUs'}
                    </span>
                  </div>
                ))
              : steps.map((st, idx) => (
                  <div key={idx} className="p-6 space-y-2">
                    <span className="font-mono-tabular text-sm font-bold text-[var(--ember)]">
                      {String(st.num || `0${idx + 1}`)}
                    </span>
                    <h3 className="font-display text-xl font-bold text-[var(--bone)]">
                      {getLocalized(st.title, locale)}
                    </h3>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">{getLocalized(st.desc, locale)}</p>
                  </div>
                ))}
          </div>
        </div>
      </div>
    );
  }

  // 15. newsletter_box
  if (section.sectionType === 'newsletter_box') {
    const desc = getLocalized(c.desc, locale);
    const ctaLabel = getLocalized(c.ctaLabel, locale, locale === 'ar' ? 'اشتراك' : 'Subscribe');
    const placeholder = getLocalized(c.placeholder, locale, locale === 'ar' ? 'بريدك الإلكتروني' : 'you@example.com');

    return wrapPreviewHeader(
      <div className="border border-[var(--line)] bg-[var(--graphite)] p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-bold text-[var(--bone)]">{titleText}</h2>
          <span className="heading-dash" aria-hidden="true" />
          {desc && <p className="mt-2 text-sm text-[var(--muted)]">{desc}</p>}
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (onSelect || !dispatchEmail.trim()) return;
            setSubscribing(true);
            try {
              await apiFetch('/api/newsletter/subscribe', {
                method: 'POST',
                body: JSON.stringify({ email: dispatchEmail.trim(), locale, source: `home:${section.id}` }),
              });
              setDispatchEmail('');
              showToast(
                locale === 'ar'
                  ? 'تم تسجيل بريدك في النشرة بنجاح.'
                  : 'Subscribed to NileLink launch & offer dispatches.',
                'success'
              );
            } catch (err) {
              showToast((err as Error).message, 'error');
            } finally {
              setSubscribing(false);
            }
          }}
          className="flex w-full lg:w-auto lg:min-w-[380px] border border-[var(--line)] bg-[var(--ink)]"
        >
          <input
            type="email"
            required
            value={dispatchEmail}
            onChange={(e) => setDispatchEmail(e.target.value)}
            placeholder={placeholder}
            aria-label="Dispatch email"
            className="flex-1 min-w-0 bg-transparent px-3.5 py-2.5 text-sm text-[var(--bone)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={subscribing}
            className="px-5 py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase tracking-wider cursor-pointer shrink-0 disabled:opacity-50"
          >
            {subscribing ? '...' : ctaLabel}
          </button>
        </form>
      </div>
    );
  }

  // 16. faq_accordion
  if (section.sectionType === 'faq_accordion') {
    const items = Array.isArray(c.items) ? (c.items as Array<Record<string, unknown>>) : [];

    return wrapPreviewHeader(
      <div className="space-y-5">
        <SectionHeading title={titleText} />
        <div className="border border-[var(--line)] bg-[var(--graphite)] divide-y divide-[var(--line)]">
          {items.map((item, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={idx}>
                <button
                  type="button"
                  onClick={(e) => {
                    if (onSelect) return;
                    e.stopPropagation();
                    setOpenFaqIdx(isOpen ? null : idx);
                  }}
                  aria-expanded={isOpen}
                  className="w-full p-5 flex items-center justify-between gap-4 text-start hover:bg-[var(--ink)] cursor-pointer"
                >
                  <span className="text-sm font-semibold text-[var(--bone)]">{getLocalized(item.q, locale)}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--muted)] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[var(--ember)]' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                      className="px-5 pb-5 text-sm text-[var(--muted)] leading-relaxed"
                    >
                      {getLocalized(item.a, locale)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 18. video_3d_embed
  if (section.sectionType === 'video_3d_embed') {
    const eyebrow = getLocalized(c.eyebrow, locale);
    const body = getLocalized(c.body, locale);
    const mediaMode = String(c.mediaMode || 'video');
    const videoEmbed = getSafeVideoEmbed(String(c.videoUrl || ''));
    const posterImage =
      typeof c.posterImageUrl === 'string' && c.posterImageUrl
        ? c.posterImageUrl
        : '/src/assets/images/hero_beirut_editorial_1795297173320.jpg';
    const fx = Number(c.focalX ?? 50);
    const fy = Number(c.focalY ?? 50);
    const ctaLabel = getLocalized(c.ctaLabel, locale, locale === 'ar' ? 'استكشف الكتالوج' : 'Inspect Catalog');
    const ctaUrl = typeof c.ctaUrl === 'string' && c.ctaUrl ? c.ctaUrl : '/catalog';

    return wrapPreviewHeader(
      <div className="hairline-grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="hairline-cell lg:col-span-5 p-6 md:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            {eyebrow && (
              <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--cyan)]">{eyebrow}</p>
            )}
            <h2 className="font-display text-3xl font-bold text-[var(--bone)]">{titleText}</h2>
            <span className="heading-dash" aria-hidden="true" />
            {body && <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>}
          </div>
          {ctaLabel && (
            <button
              type="button"
              onClick={() => safeNav(ctaUrl)}
              className="self-start px-5 py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          )}
        </div>

        <div className="hairline-cell lg:col-span-7 relative bg-[var(--ink)] min-h-[260px] flex items-center justify-center overflow-hidden">
          {mediaMode === 'video' && videoEmbed.kind === 'iframe' ? (
            <iframe
              src={videoEmbed.src}
              title={titleText}
              className="w-full aspect-video border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : mediaMode === 'video' && videoEmbed.kind === 'video' ? (
            <video src={videoEmbed.src} poster={posterImage} controls className="w-full h-full max-h-[380px] object-cover" />
          ) : (
            <div className="relative w-full h-full min-h-[260px]">
              <img
                src={posterImage}
                alt={titleText}
                style={{ objectPosition: `${fx}% ${fy}%` }}
                className="w-full h-full max-h-[380px] object-cover"
              />
              <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center gap-2 text-white">
                {mediaMode === '3d' ? <Box className="w-8 h-8 text-[var(--cyan)]" /> : <Play className="w-8 h-8 text-[var(--ember)]" />}
                <span className="text-xs font-mono-tabular uppercase tracking-wider bg-black/75 px-3 py-1 border border-white/20">
                  {mediaMode === '3d'
                    ? locale === 'ar'
                      ? 'معاينة ثلاثية الأبعاد'
                      : 'Interactive 3D View Ready'
                    : locale === 'ar'
                      ? 'أضف رابط فيديو YouTube / MP4'
                      : 'Video Showcase · Poster Preview'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 17. rich_block (editorial / manifesto / comparison)
  const variant = String(c.variant || 'editorial');
  if (variant === 'manifesto') {
    const eyebrow = getLocalized(c.eyebrow, locale);
    const statement = getLocalized(c.statement ?? c.body, locale);
    const ctaLabel = getLocalized(c.ctaLabel, locale);
    const ctaUrl = typeof c.ctaUrl === 'string' && c.ctaUrl ? c.ctaUrl : '/styleguide';

    return wrapPreviewHeader(
      <div className="border border-[var(--line)] bg-[var(--graphite)] p-8 md:p-12 space-y-4">
        {eyebrow && <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--gold)]">{eyebrow}</p>}
        <h2 className="font-display text-3xl md:text-5xl font-bold text-[var(--bone)] max-w-4xl leading-tight">
          {titleText}
        </h2>
        <span className="heading-dash" aria-hidden="true" />
        {statement && <p className="text-base md:text-lg text-[var(--muted)] max-w-3xl leading-relaxed">{statement}</p>}
        {ctaLabel && (
          <button
            type="button"
            onClick={() => safeNav(ctaUrl)}
            className="editorial-link text-xs font-semibold uppercase tracking-wider text-[var(--ember)] pt-2 cursor-pointer"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        )}
      </div>
    );
  }

  if (variant === 'comparison') {
    const colAHeader = getLocalized(c.colAHeader, locale, 'Option A');
    const colBHeader = getLocalized(c.colBHeader, locale, 'Option B');
    const rows = Array.isArray(c.rows) ? (c.rows as Array<Record<string, unknown>>) : [];

    return wrapPreviewHeader(
      <div className="space-y-5">
        <SectionHeading title={titleText} />
        <div className="border border-[var(--line)] bg-[var(--graphite)] overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="border-b border-[var(--line)] bg-[var(--ink)] text-xs font-mono-tabular uppercase text-[var(--muted)]">
              <tr>
                <th className="p-4 text-start">{locale === 'ar' ? 'المعيار' : 'Specification'}</th>
                <th className="p-4 text-start text-[var(--bone)]">{colAHeader}</th>
                <th className="p-4 text-start text-[var(--bone)]">{colBHeader}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {rows.map((r, i) => (
                <tr key={i}>
                  <th className="p-4 text-start font-medium text-[var(--muted)]">{getLocalized(r.label, locale)}</th>
                  <td className="p-4 text-start text-[var(--bone)]">{getLocalized(r.colA, locale)}</td>
                  <td className="p-4 text-start text-[var(--bone)]">{getLocalized(r.colB, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Default rich_block editorial
  const eyebrow = getLocalized(c.eyebrow, locale);
  const body = getLocalized(c.body, locale);
  const imageUrl = typeof c.imageUrl === 'string' ? c.imageUrl : '';
  const fx = Number(c.focalX ?? 50);
  const fy = Number(c.focalY ?? 50);
  const ctaLabel = getLocalized(c.ctaLabel, locale);
  const ctaUrl = typeof c.ctaUrl === 'string' && c.ctaUrl ? c.ctaUrl : '/catalog';

  return wrapPreviewHeader(
    <div className={`hairline-grid grid-cols-1 ${imageUrl ? 'lg:grid-cols-12' : ''} items-stretch`}>
      <div className={`hairline-cell ${imageUrl ? 'lg:col-span-7' : ''} p-6 md:p-10 space-y-4`}>
        {eyebrow && <p className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--ember)]">{eyebrow}</p>}
        <h2 className="font-display text-3xl font-bold text-[var(--bone)]">{titleText}</h2>
        <span className="heading-dash" aria-hidden="true" />
        {body && <p className="text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">{body}</p>}
        {ctaLabel && (
          <button
            type="button"
            onClick={() => safeNav(ctaUrl)}
            className="px-5 py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        )}
      </div>
      {imageUrl && (
        <div className="hairline-cell lg:col-span-5 overflow-hidden">
          <div className="aspect-[4/3] lg:h-full w-full overflow-hidden bg-[var(--ink)]">
            <img
              src={imageUrl}
              alt={titleText}
              style={{ objectPosition: `${fx}% ${fy}%` }}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
