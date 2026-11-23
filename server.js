var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/shared/homeSections.ts
function mapLegacySectionType(type) {
  if (ALL_HOME_SECTION_TYPES.includes(type)) {
    return type;
  }
  return LEGACY_TO_V2_TYPE_MAP[type] || "rich_block";
}
function migrateLegacySectionPayload(rawType, rawContent) {
  const isAlreadyV2 = ALL_HOME_SECTION_TYPES.includes(rawType);
  const toType = mapLegacySectionType(rawType);
  const content = { ...rawContent || {} };
  if (isAlreadyV2) {
    return { toType, content, changed: false };
  }
  if (rawType === "hero_split") {
    content.mode = content.mode || "split";
    if (content.focalX === void 0) content.focalX = 50;
    if (content.focalY === void 0) content.focalY = 50;
  } else if (rawType === "trust_strip") {
    content.mode = "guarantees";
  } else if (rawType === "governorates_coverage_grid") {
    content.mode = "governorates";
  } else if (rawType === "dynamic_products_grid") {
    content.sourceMode = content.filterMode || content.sourceMode || "all";
    content.columns = content.columns || 3;
  } else if (rawType === "brand_manifesto_band") {
    content.variant = "manifesto";
    if (content.statement && !content.body) content.body = content.statement;
  } else if (rawType === "comparison_table") {
    content.variant = "comparison";
  } else if (rawType === "custom_rich_editorial") {
    content.variant = "editorial";
  } else if (rawType === "seller_recruitment_cta") {
    content.showPlans = true;
  } else if (rawType === "departments_bento") {
    content.columns = 3;
    if (Array.isArray(content.items)) {
      content.items = content.items.map((it) => ({
        ...it,
        url: it.url || `/catalog?department=${String(it.slug || "fashion")}`,
        focalX: it.focalX ?? 50,
        focalY: it.focalY ?? 50
      }));
    }
  } else if (rawType === "flash_deals_countdown") {
    content.showCountdown = true;
  }
  return { toType, content, changed: true };
}
function normalizeTargeting(raw, legacyAudience) {
  const base = raw && typeof raw === "object" ? { ...raw } : {};
  if (!base.visitor) {
    if (legacyAudience === "guest" || legacyAudience === "logged_in" || legacyAudience === "new_visitor" || legacyAudience === "returning") {
      base.visitor = legacyAudience;
    } else {
      base.visitor = "all";
    }
  }
  if (!base.device) base.device = "all";
  if (!base.locale) {
    if (legacyAudience === "arabic") base.locale = "ar";
    else if (legacyAudience === "english") base.locale = "en";
    else base.locale = "all";
  }
  return base;
}
var HOME_SECTION_PRESETS, ALL_HOME_SECTION_TYPES, LEGACY_TO_V2_TYPE_MAP, DEFAULT_SITE_CHROME, STARTER_TEMPLATES;
var init_homeSections = __esm({
  "src/shared/homeSections.ts"() {
    HOME_SECTION_PRESETS = [
      {
        type: "hero",
        category: "hero_promo",
        label: { en: "01 \xB7 Hero Banner / Slider", ar: "01 \xB7 \u0627\u0644\u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629 \u0623\u0648 \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0631" },
        description: {
          en: "Primary split hero or multi-slide visual showcase with search, dual CTAs, and focal point.",
          ar: "\u0627\u0644\u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629 \u0627\u0644\u0645\u0642\u0633\u0645\u0629 \u0623\u0648 \u0645\u062A\u0639\u062F\u062F\u0629 \u0627\u0644\u0634\u0631\u0627\u0626\u062D \u0645\u0639 \u0628\u062D\u062B \u0648\u0623\u0632\u0631\u0627\u0631 \u0625\u062C\u0631\u0627\u0621 \u0648\u0646\u0642\u0637\u0629 \u062A\u0631\u0643\u064A\u0632 \u0644\u0644\u0635\u0648\u0631\u0629."
        },
        defaultTitle: { en: "Curated Commerce Across Lebanon", ar: "\u062A\u062C\u0627\u0631\u0629 \u0645\u0646\u062A\u0642\u0627\u0629 \u0641\u064A \u0643\u0644 \u0644\u0628\u0646\u0627\u0646" },
        defaultContent: {
          mode: "split",
          kicker: { en: "Beirut \xB7 Mount Lebanon \xB7 North \xB7 South \xB7 Bekaa", ar: "\u0628\u064A\u0631\u0648\u062A \xB7 \u062C\u0628\u0644 \u0644\u0628\u0646\u0627\u0646 \xB7 \u0627\u0644\u0634\u0645\u0627\u0644 \xB7 \u0627\u0644\u062C\u0646\u0648\u0628 \xB7 \u0627\u0644\u0628\u0642\u0627\u0639" },
          subline: {
            en: "Independent Lebanese merchants, verified specs, dual USD/LBP pricing, and nationwide delivery split cleanly by seller.",
            ar: "\u0645\u062A\u0627\u062C\u0631 \u0644\u0628\u0646\u0627\u0646\u064A\u0629 \u0645\u0633\u062A\u0642\u0644\u0629\u060C \u0645\u0648\u0627\u0635\u0641\u0627\u062A \u0645\u0648\u062B\u0642\u0629\u060C \u062A\u0633\u0639\u064A\u0631 \u0645\u0632\u062F\u0648\u062C \u0628\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0648\u0627\u0644\u0644\u064A\u0631\u0629\u060C \u0648\u062A\u0648\u0635\u064A\u0644 \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A \u0645\u0642\u0633\u0645 \u0628\u0648\u0636\u0648\u062D \u0644\u0643\u0644 \u0628\u0627\u0626\u0639."
          },
          primaryCtaLabel: { en: "Explore Catalog", ar: "\u062A\u0635\u0641\u062D \u0627\u0644\u0643\u062A\u0627\u0644\u0648\u062C" },
          primaryCtaUrl: "/catalog",
          secondaryCtaLabel: { en: "Start Selling", ar: "\u0627\u0628\u062F\u0623 \u0627\u0644\u0628\u064A\u0639 \u0639\u0644\u0649 \u0627\u0644\u0645\u0646\u0635\u0629" },
          secondaryCtaUrl: "/seller",
          showSearch: true,
          imageUrl: "/src/assets/images/hero_beirut_editorial_1795297173320.jpg",
          focalX: 50,
          focalY: 50,
          badgeLabel: { en: "Verified", ar: "\u0628\u0627\u0626\u0639 \u0645\u0648\u062B\u0642" },
          showOffersRail: true,
          showAnnouncementsBar: true,
          announcements: [
            {
              id: "ann-dispatch",
              tag: { en: "LOGISTICS", ar: "\u0627\u0644\u062A\u0648\u0635\u064A\u0644" },
              text: {
                en: "Same-day Beirut courier dispatch on orders placed before 2:00 PM EET.",
                ar: "\u0634\u062D\u0646 \u0641\u064A \u0646\u0641\u0633 \u0627\u0644\u064A\u0648\u0645 \u062F\u0627\u062E\u0644 \u0628\u064A\u0631\u0648\u062A \u0644\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0624\u0643\u062F\u0629 \u0642\u0628\u0644 \u0627\u0644\u0633\u0627\u0639\u0629 \u0662 \u0638\u0647\u0631\u0627\u064B."
              },
              ctaLabel: { en: "View Zones", ar: "\u0645\u0646\u0627\u0637\u0642 \u0627\u0644\u062A\u0648\u0635\u064A\u0644" },
              ctaUrl: "/support",
              tone: "cedar"
            },
            {
              id: "ann-fx",
              tag: { en: "PRICING", ar: "\u0627\u0644\u062A\u0633\u0639\u064A\u0631" },
              text: {
                en: "Live USD & LBP dual checkout locked cleanly per seller sub-order.",
                ar: "\u062F\u0641\u0639 \u0645\u0631\u0646 \u0628\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0648\u0627\u0644\u0644\u064A\u0631\u0629 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629 \u0645\u0639 \u0634\u062D\u0646 \u0645\u0642\u0633\u0645 \u0628\u0648\u0636\u0648\u062D \u0644\u0643\u0644 \u062A\u0627\u062C\u0631."
              },
              ctaLabel: { en: "Explore Deals", ar: "\u062A\u0635\u0641\u062D \u0627\u0644\u0639\u0631\u0648\u0636" },
              ctaUrl: "/catalog?deals=true",
              tone: "gold"
            }
          ],
          offersRailHeading: { en: "Live Deals & Flash Drops", ar: "\u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u062D\u064A\u0629 \u0648\u0627\u0644\u062A\u062E\u0641\u064A\u0636\u0627\u062A \u0627\u0644\u0633\u0631\u064A\u0639\u0629" },
          promoCouponCode: "NILE10",
          promoText: { en: "Use code at checkout for extra savings", ar: "\u0627\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0631\u0645\u0632 \u0639\u0646\u062F \u0627\u0644\u062F\u0641\u0639 \u0644\u062E\u0635\u0645 \u0625\u0636\u0627\u0641\u064A" },
          featuredCampaignSlug: "",
          slides: []
        }
      },
      {
        type: "announcement_bar",
        category: "hero_promo",
        label: { en: "02 \xB7 Inline Announcement Ribbon", ar: "02 \xB7 \u0634\u0631\u064A\u0637 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0648\u0627\u0644\u062A\u0646\u0628\u064A\u0647" },
        description: {
          en: "Compact hairline promo strip with optional target link, accent token, and countdown target.",
          ar: "\u0634\u0631\u064A\u0637 \u062A\u0646\u0628\u064A\u0647 \u0645\u062F\u0645\u062C \u0645\u0639 \u0631\u0627\u0628\u0637 \u0648\u0627\u062E\u062A\u064A\u0627\u0631 \u0644\u0648\u0646 \u0648\u0639\u062F\u0627\u062F \u062A\u0646\u0627\u0632\u0644\u064A \u0627\u062E\u062A\u064A\u0627\u0631\u064A."
        },
        defaultTitle: { en: "Nationwide Split-Seller Dispatch", ar: "\u0634\u062D\u0646 \u0645\u0628\u0627\u0634\u0631 \u0648\u0645\u0642\u0633\u0645 \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A" },
        defaultContent: {
          kicker: { en: "Notice", ar: "\u062A\u0646\u0628\u064A\u0647" },
          accentToken: "ember",
          ctaLabel: { en: "Browse Catalog", ar: "\u062A\u0635\u0641\u062D \u0627\u0644\u0643\u062A\u0627\u0644\u0648\u062C" },
          ctaUrl: "/catalog",
          countdownEndsAt: ""
        }
      },
      {
        type: "promo_strip",
        category: "hero_promo",
        label: { en: "03 \xB7 Promo Split Callout", ar: "03 \xB7 \u0628\u0637\u0627\u0642\u0629 \u0625\u0639\u0644\u0627\u0646 \u0645\u0642\u0633\u0645\u0629" },
        description: {
          en: "2-column campaign spotlight with bold metric/stat highlight and direct action link.",
          ar: "\u0625\u0639\u0644\u0627\u0646 \u0645\u0646 \u0639\u0645\u0648\u062F\u064A\u0646 \u0645\u0639 \u0631\u0642\u0645 \u0628\u0627\u0631\u0632 \u0648\u0632\u0631 \u0627\u0646\u062A\u0642\u0627\u0644."
        },
        defaultTitle: { en: "Direct Sub-Order Logistics", ar: "\u0634\u062D\u0646 \u0645\u0642\u0633\u0645 \u0628\u0648\u0636\u0648\u062D \u0644\u0643\u0644 \u0628\u0627\u0626\u0639" },
        defaultContent: {
          kicker: { en: "Platform Architecture", ar: "\u0628\u0646\u064A\u0629 \u0627\u0644\u0645\u0646\u0635\u0629" },
          body: {
            en: "Every multi-store order splits cleanly at checkout so each Lebanese merchant fulfills directly with transparent delivery fees.",
            ar: "\u064A\u0646\u0642\u0633\u0645 \u0643\u0644 \u0637\u0644\u0628 \u0645\u062A\u0639\u062F\u062F \u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0625\u0644\u0649 \u0637\u0644\u0628\u0627\u062A \u0641\u0631\u0639\u064A\u0629 \u0648\u0627\u0636\u062D\u0629 \u0627\u0644\u062A\u0643\u0644\u0641\u0629 \u0644\u0643\u0644 \u062A\u0627\u062C\u0631."
          },
          statLabel: { en: "Governorates Covered", ar: "\u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A \u0627\u0644\u0645\u063A\u0637\u0627\u0629" },
          statValue: "8 / 8",
          ctaLabel: { en: "Explore Storefronts", ar: "\u0627\u0633\u062A\u0643\u0634\u0641 \u0627\u0644\u0645\u062A\u0627\u062C\u0631" },
          ctaUrl: "/catalog"
        }
      },
      {
        type: "bento_grid",
        category: "hero_promo",
        label: { en: "04 \xB7 Editorial Bento Grid", ar: "04 \xB7 \u0634\u0628\u0643\u0629 \u0627\u0644\u0628\u064A\u0646\u062A\u0648 \u0627\u0644\u062A\u062D\u0631\u064A\u0631\u064A\u0629" },
        description: {
          en: "Asymmetric 2 to 4 editorial feature cards with imagery, focal points, and department tints.",
          ar: "\u0628\u0637\u0627\u0642\u0627\u062A \u062A\u062D\u0631\u064A\u0631\u064A\u0629 \u063A\u064A\u0631 \u0645\u062A\u0645\u0627\u062B\u0644\u0629 \u0645\u0639 \u0635\u0648\u0631 \u0648\u0646\u0642\u0627\u0637 \u062A\u0631\u0643\u064A\u0632 \u0648\u0631\u0648\u0627\u0628\u0637 \u0645\u062E\u0635\u0635\u0629."
        },
        defaultTitle: { en: "Curated Collections", ar: "\u062A\u0634\u0643\u064A\u0644\u0627\u062A \u0645\u062E\u062A\u0627\u0631\u0629" },
        defaultContent: {
          tiles: [
            {
              id: "tile-1",
              span: "wide",
              tag: { en: "Fashion", ar: "\u0627\u0644\u0623\u0632\u064A\u0627\u0621" },
              title: { en: "Mediterranean Linen", ar: "\u0643\u062A\u0627\u0646 \u0645\u062A\u0648\u0633\u0637\u064A" },
              subtitle: { en: "Cut and tailored in Beirut.", ar: "\u062A\u0635\u0645\u064A\u0645 \u0648\u062E\u064A\u0627\u0637\u0629 \u0641\u064A \u0628\u064A\u0631\u0648\u062A." },
              url: "/catalog?department=fashion",
              imageUrl: "/src/assets/images/cat_fashion_linen_1795297173988.jpg",
              focalX: 50,
              focalY: 45,
              tint: "sand"
            },
            {
              id: "tile-2",
              span: "normal",
              tag: { en: "Electronics", ar: "\u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A" },
              title: { en: "Studio Acoustics", ar: "\u0635\u0648\u062A\u064A\u0627\u062A \u0627\u0633\u062A\u0648\u062F\u064A\u0648" },
              subtitle: { en: "Verified local warranty.", ar: "\u0636\u0645\u0627\u0646 \u0645\u062D\u0644\u064A \u0645\u0648\u062B\u0642." },
              url: "/catalog?department=electronics",
              imageUrl: "/src/assets/images/cat_electronics_audio_1795297173898.jpg",
              focalX: 50,
              focalY: 50,
              tint: "cyan"
            },
            {
              id: "tile-3",
              span: "normal",
              tag: { en: "Home Gadgets", ar: "\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0645\u0646\u0632\u0644" },
              title: { en: "Precision Home Rituals", ar: "\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0642\u0647\u0648\u0629 \u0648\u0627\u0644\u0645\u0646\u0632\u0644" },
              subtitle: { en: "Ceramics and brew tools.", ar: "\u062E\u0632\u0641 \u0648\u0623\u062F\u0648\u0627\u062A \u062A\u062D\u0636\u064A\u0631 \u062F\u0642\u064A\u0642\u0629." },
              url: "/catalog?department=home-gadgets",
              imageUrl: "/src/assets/images/cat_home_gadgets_1795297173679.jpg",
              focalX: 50,
              focalY: 50,
              tint: "sage"
            }
          ]
        }
      },
      {
        type: "product_grid",
        category: "merchandising",
        label: { en: "05 \xB7 Product Grid", ar: "05 \xB7 \u0634\u0628\u0643\u0629 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A" },
        description: {
          en: "Displays auto-filtered live products (newest, featured, deals, top rated) or handpicked SKUs.",
          ar: "\u064A\u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u062D\u064A\u0629 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0623\u0648 \u064A\u062F\u0648\u064A\u0627\u064B \u0645\u0639 \u0639\u062F\u062F \u0623\u0639\u0645\u062F\u0629 \u0642\u0627\u0628\u0644 \u0644\u0644\u062A\u062E\u0635\u064A\u0635."
        },
        defaultTitle: { en: "Marketplace Releases", ar: "\u0623\u062D\u062F\u062B \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0629" },
        defaultContent: {
          subtitle: {
            en: "Live SKUs published by approved Lebanese merchants.",
            ar: "\u0645\u0646\u062A\u062C\u0627\u062A \u0645\u0646\u0634\u0648\u0631\u0629 \u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0646 \u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629."
          },
          sourceMode: "all",
          department: "",
          productIds: [],
          columns: 3,
          limit: 6,
          ctaLabel: { en: "Browse Catalog", ar: "\u062A\u0635\u0641\u062D \u0627\u0644\u0643\u062A\u0627\u0644\u0648\u062C" },
          ctaUrl: "/catalog"
        }
      },
      {
        type: "product_carousel",
        category: "merchandising",
        label: { en: "06 \xB7 Product Carousel Rail", ar: "06 \xB7 \u0634\u0631\u064A\u0637 \u062A\u0645\u0631\u064A\u0631 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A" },
        description: {
          en: "Horizontal snap-scroll product rail with previous/next controls for high-density browsing.",
          ar: "\u0634\u0631\u064A\u0637 \u0645\u0646\u062A\u062C\u0627\u062A \u0623\u0641\u0642\u064A \u0642\u0627\u0628\u0644 \u0644\u0644\u062A\u0645\u0631\u064A\u0631 \u0645\u0639 \u0623\u0632\u0631\u0627\u0631 \u062A\u0646\u0642\u0644."
        },
        defaultTitle: { en: "Trending Across Storefronts", ar: "\u0645\u0646\u062A\u062C\u0627\u062A \u0631\u0627\u0626\u062C\u0629 \u0641\u064A \u0627\u0644\u0645\u062A\u0627\u062C\u0631" },
        defaultContent: {
          subtitle: {
            en: "Swipe or step through curated marketplace selections.",
            ar: "\u062A\u0635\u0641\u062D \u0633\u0631\u064A\u0639 \u0644\u0623\u0628\u0631\u0632 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u062E\u062A\u0627\u0631\u0629."
          },
          sourceMode: "featured",
          department: "",
          productIds: [],
          limit: 8,
          ctaLabel: { en: "View All", ar: "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644" },
          ctaUrl: "/catalog"
        }
      },
      {
        type: "category_tiles",
        category: "merchandising",
        label: { en: "07 \xB7 Category / Department Tiles", ar: "07 \xB7 \u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0648\u0627\u0644\u0641\u0626\u0627\u062A" },
        description: {
          en: "Structured department & category tiles with curated editorial imagery and accent tags.",
          ar: "\u0628\u0637\u0627\u0642\u0627\u062A \u0645\u0646\u0638\u0645\u0629 \u0644\u0644\u0623\u0642\u0633\u0627\u0645 \u0648\u0627\u0644\u0641\u0626\u0627\u062A \u0645\u0639 \u0635\u0648\u0631 \u0648\u0631\u0648\u0627\u0628\u0637 \u0645\u0628\u0627\u0634\u0631\u0629."
        },
        defaultTitle: { en: "Departments", ar: "\u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629" },
        defaultContent: {
          columns: 3,
          items: [
            {
              slug: "fashion",
              tint: "var(--sand)",
              tag: { en: "Editorial Lookbook \xB7 Size Guide", ar: "\u0623\u0633\u0644\u0648\u0628 \u062A\u062D\u0631\u064A\u0631\u064A \xB7 \u0645\u0642\u0627\u0633\u0627\u062A \u062F\u0642\u064A\u0642\u0629" },
              title: { en: "Fashion", ar: "\u0627\u0644\u0623\u0632\u064A\u0627\u0621" },
              desc: {
                en: "Mediterranean linen, artisanal leather, and Beirut tailoring.",
                ar: "\u0643\u062A\u0627\u0646 \u0645\u062A\u0648\u0633\u0637\u064A\u060C \u062C\u0644\u0648\u062F \u062D\u0631\u0641\u064A\u0629\u060C \u0648\u062E\u064A\u0627\u0637\u0629 \u0628\u064A\u0631\u0648\u062A\u064A\u0629 \u0645\u0639\u0627\u0635\u0631\u0629."
              },
              image: "/src/assets/images/cat_fashion_linen_1795297173988.jpg",
              focalX: 50,
              focalY: 50,
              url: "/catalog?department=fashion"
            },
            {
              slug: "electronics",
              tint: "var(--cyan)",
              tag: { en: "Spec Tables \xB7 Verified Warranty", ar: "\u0645\u0648\u0627\u0635\u0641\u0627\u062A \u062A\u0642\u0646\u064A\u0629 \xB7 \u0636\u0645\u0627\u0646\u0627\u062A \u0645\u0648\u062B\u0642\u0629" },
              title: { en: "Electronics & Mobiles", ar: "\u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A \u0648\u0627\u0644\u0647\u0648\u0627\u062A\u0641" },
              desc: {
                en: "Studio audio, mechanical hardware, and verified warranties.",
                ar: "\u0635\u0648\u062A\u064A\u0627\u062A \u0627\u0633\u062A\u0648\u062F\u064A\u0648\u060C \u0644\u0648\u062D\u0627\u062A \u0645\u064A\u0643\u0627\u0646\u064A\u0643\u064A\u0629\u060C \u0648\u0636\u0645\u0627\u0646\u0627\u062A \u0645\u0639\u062A\u0645\u062F\u0629."
              },
              image: "/src/assets/images/cat_electronics_audio_1795297173898.jpg",
              focalX: 50,
              focalY: 50,
              url: "/catalog?department=electronics"
            },
            {
              slug: "home-gadgets",
              tint: "var(--sage)",
              tag: { en: "Home Rituals \xB7 Precision Gear", ar: "\u0623\u062F\u0648\u0627\u062A \u0639\u0645\u0644\u064A\u0629 \xB7 \u062E\u0632\u0641 \u0648\u0642\u0647\u0648\u0629" },
              title: { en: "Home Gadgets", ar: "\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0645\u0646\u0632\u0644" },
              desc: {
                en: "Precision brew gear, smart ceramics, and quiet home tools.",
                ar: "\u0623\u062F\u0648\u0627\u062A \u0642\u0647\u0648\u0629 \u062F\u0642\u064A\u0642\u0629\u060C \u062E\u0632\u0641 \u0645\u0637\u0641\u064A\u060C \u0648\u062A\u062C\u0647\u064A\u0632\u0627\u062A \u0645\u0646\u0632\u0644\u064A\u0629 \u0630\u0643\u064A\u0629."
              },
              image: "/src/assets/images/cat_home_gadgets_1795297173679.jpg",
              focalX: 50,
              focalY: 50,
              url: "/catalog?department=home-gadgets"
            }
          ]
        }
      },
      {
        type: "department_spotlight",
        category: "merchandising",
        label: { en: "08 \xB7 Department Spotlight", ar: "08 \xB7 \u062A\u0633\u0644\u064A\u0637 \u0627\u0644\u0636\u0648\u0621 \u0639\u0644\u0649 \u0642\u0633\u0645" },
        description: {
          en: "Left editorial department intro paired with a live product grid from that department.",
          ar: "\u0645\u0642\u062F\u0645\u0629 \u062A\u062D\u0631\u064A\u0631\u064A\u0629 \u0644\u0642\u0633\u0645 \u0645\u062D\u062F\u062F \u0645\u0639 \u0639\u0631\u0636 \u0645\u0646\u062A\u062C\u0627\u062A\u0647 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B."
        },
        defaultTitle: { en: "Electronics & Studio Hardware", ar: "\u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A \u0648\u0645\u0639\u062F\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u0648\u062F\u064A\u0648" },
        defaultContent: {
          department: "electronics",
          description: {
            en: "Full technical specification tables, verified warranty coverage, and USD/LBP transparent checkout.",
            ar: "\u062C\u062F\u0627\u0648\u0644 \u0645\u0648\u0627\u0635\u0641\u0627\u062A \u062A\u0642\u0646\u064A\u0629 \u0643\u0627\u0645\u0644\u0629 \u0645\u0639 \u0636\u0645\u0627\u0646 \u0645\u0648\u062B\u0642 \u0648\u062F\u0641\u0639 \u0628\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0623\u0648 \u0627\u0644\u0644\u064A\u0631\u0629."
          },
          ctaLabel: { en: "View Department", ar: "\u0639\u0631\u0636 \u0627\u0644\u0642\u0633\u0645" },
          limit: 3
        }
      },
      {
        type: "flash_sale_block",
        category: "merchandising",
        label: { en: "09 \xB7 Flash Deals & Countdown", ar: "09 \xB7 \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u0633\u0631\u064A\u0639\u0629 \u0648\u0627\u0644\u0639\u062F \u0627\u0644\u062A\u0646\u0627\u0632\u0644\u064A" },
        description: {
          en: "Displays approved scheduled offers or selected flash SKUs with a live countdown clock.",
          ar: "\u064A\u0639\u0631\u0636 \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u0645\u062C\u062F\u0648\u0644\u0629 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629 \u0645\u0639 \u0639\u062F\u0627\u062F \u062A\u0646\u0627\u0632\u0644\u064A \u062D\u064A."
        },
        defaultTitle: { en: "Scheduled Offers & Markdowns", ar: "\u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u0645\u062C\u062F\u0648\u0644\u0629 \u0648\u0627\u0644\u062A\u062E\u0641\u064A\u0636\u0627\u062A" },
        defaultContent: {
          subtitle: {
            en: "Verified price reductions approved by platform governance.",
            ar: "\u062A\u062E\u0641\u064A\u0636\u0627\u062A \u0633\u0639\u0631\u064A\u0629 \u0645\u0639\u062A\u0645\u062F\u0629 \u0645\u0646 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0646\u0635\u0629."
          },
          productIds: [],
          limit: 3,
          showCountdown: true,
          ctaLabel: { en: "All Active Deals", ar: "\u0643\u0644 \u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u0646\u0634\u0637\u0629" },
          ctaUrl: "/catalog?deals=true"
        }
      },
      {
        type: "featured_stores",
        category: "discovery_trust",
        label: { en: "10 \xB7 Featured Storefronts", ar: "10 \xB7 \u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u0645\u0648\u062B\u0642\u0629 \u0627\u0644\u0645\u0645\u064A\u0632\u0629" },
        description: {
          en: "Showcases approved independent Lebanese storefronts (auto or handpicked) with governorate and ratings.",
          ar: "\u064A\u0639\u0631\u0636 \u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629 \u0627\u0644\u0645\u0633\u062A\u0642\u0644\u0629 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629 \u0645\u0639 \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0629 \u0648\u0627\u0644\u062A\u0642\u064A\u064A\u0645."
        },
        defaultTitle: { en: "Verified Storefronts", ar: "\u0645\u062A\u0627\u062C\u0631 \u0645\u0648\u062B\u0642\u0629" },
        defaultContent: {
          subtitle: {
            en: "Independent merchants approved after commercial verification.",
            ar: "\u062A\u062C\u0627\u0631 \u0645\u0633\u062A\u0642\u0644\u0648\u0646 \u0628\u0639\u062F \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u062A\u062C\u0627\u0631\u064A."
          },
          sellerIds: [],
          limit: 6
        }
      },
      {
        type: "brand_bar",
        category: "discovery_trust",
        label: { en: "11 \xB7 Brand & Partner Strip", ar: "11 \xB7 \u0634\u0631\u064A\u0637 \u0627\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0648\u0627\u0644\u0634\u0631\u0643\u0627\u0621" },
        description: {
          en: "Clean architectural strip highlighting merchant brands, partners, or certified ateliers.",
          ar: "\u0634\u0631\u064A\u0637 \u0623\u0641\u0642\u064A \u0644\u0639\u0631\u0636 \u0627\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0629 \u0623\u0648 \u0627\u0644\u0634\u0631\u0643\u0627\u0621 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u064A\u0646."
        },
        defaultTitle: { en: "Verified Lebanese Houses & Brands", ar: "\u0628\u064A\u0648\u062A \u0648\u0639\u0644\u0627\u0645\u0627\u062A \u0644\u0628\u0646\u0627\u0646\u064A\u0629 \u0645\u0648\u062B\u0642\u0629" },
        defaultContent: {
          items: [
            { name: "Cedar Atelier", note: { en: "Beirut", ar: "\u0628\u064A\u0631\u0648\u062A" }, url: "/catalog?department=fashion" },
            { name: "Hamra Sound Lab", note: { en: "Audio", ar: "\u0635\u0648\u062A\u064A\u0627\u062A" }, url: "/catalog?department=electronics" },
            { name: "Byblos Ceramics", note: { en: "Homeware", ar: "\u062E\u0632\u0641" }, url: "/catalog?department=home-gadgets" },
            { name: "Tripoli Roasters", note: { en: "Craft", ar: "\u062D\u0631\u0641\u064A" }, url: "/catalog" }
          ]
        }
      },
      {
        type: "trust_cells",
        category: "discovery_trust",
        label: { en: "12 \xB7 Trust, Currency & Delivery Cells", ar: "12 \xB7 \u062E\u0644\u0627\u064A\u0627 \u0627\u0644\u062B\u0642\u0629 \u0648\u0627\u0644\u0639\u0645\u0644\u0627\u062A \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644" },
        description: {
          en: "3-cell guarantee bar OR live 8-governorate delivery tariff matrix powered by MySQL.",
          ar: "\u0634\u0631\u064A\u0637 \u0636\u0645\u0627\u0646\u0627\u062A \u062B\u0644\u0627\u062B\u064A \u0623\u0648 \u062C\u062F\u0648\u0644 \u062A\u0639\u0631\u0641\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0644\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629 \u0627\u0644\u062B\u0645\u0627\u0646\u064A."
        },
        defaultTitle: { en: "Platform Guarantees", ar: "\u0636\u0645\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0646\u0635\u0629" },
        defaultContent: {
          mode: "guarantees",
          showSpotlightProduct: true,
          subtitle: {
            en: "Live platform courier tariffs per governorate and dual-currency protection.",
            ar: "\u062A\u0639\u0631\u0641\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629 \u0639\u0628\u0631 \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A \u0648\u062D\u0645\u0627\u064A\u0629 \u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0648\u0627\u0644\u0644\u064A\u0631\u0629."
          },
          cells: [
            {
              icon: "wallet",
              title: { en: "Dual Currency Ledger", ar: "\u0633\u062C\u0644 \u0645\u0627\u0644\u064A \u0645\u0632\u062F\u0648\u062C \u0627\u0644\u0639\u0645\u0644\u0629" },
              desc: {
                en: "Integer minor-unit accounting in USD and LBP with transparent rates.",
                ar: "\u0645\u062D\u0627\u0633\u0628\u0629 \u062F\u0642\u064A\u0642\u0629 \u0628\u0627\u0644\u0648\u062D\u062F\u0627\u062A \u0627\u0644\u0635\u063A\u0631\u0649 \u0644\u0644\u062F\u0648\u0644\u0627\u0631 \u0648\u0627\u0644\u0644\u064A\u0631\u0629 \u0648\u0633\u0639\u0631 \u0635\u0631\u0641 \u0648\u0627\u0636\u062D."
              }
            },
            {
              icon: "shield",
              title: { en: "Verified Merchants", ar: "\u062A\u062C\u0627\u0631 \u0645\u0648\u062B\u0642\u0648\u0646" },
              desc: {
                en: "Commercial registration checked before every store goes live.",
                ar: "\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u062A\u062C\u0627\u0631\u064A \u0648\u0627\u0644\u0647\u0648\u064A\u0629 \u0642\u0628\u0644 \u062A\u0641\u0639\u064A\u0644 \u0623\u064A \u0645\u062A\u062C\u0631."
              }
            },
            {
              icon: "truck",
              title: { en: "Nationwide Logistics", ar: "\u062A\u0648\u0635\u064A\u0644 \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A" },
              desc: {
                en: "Platform courier or seller fleet across all 8 Lebanese governorates.",
                ar: "\u0623\u0633\u0637\u0648\u0644 \u0627\u0644\u0628\u0627\u0626\u0639 \u0623\u0648 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u0631\u0643\u0632\u064A \u0639\u0628\u0631 \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629 \u0627\u0644\u062B\u0645\u0627\u0646\u064A."
              }
            }
          ]
        }
      },
      {
        type: "social_proof",
        category: "discovery_trust",
        label: { en: "13 \xB7 Customer Testimonials & Proof", ar: "13 \xB7 \u0622\u0631\u0627\u0621 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0646 \u0648\u062A\u062C\u0627\u0631\u0628\u0647\u0645" },
        description: {
          en: "3-column verified customer testimonials with city, rating, and store reference.",
          ar: "\u0634\u0647\u0627\u062F\u0627\u062A \u0648\u0622\u0631\u0627\u0621 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0645\u0639 \u0627\u0644\u0645\u062F\u064A\u0646\u0629 \u0648\u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0648\u0627\u0633\u0645 \u0627\u0644\u0645\u062A\u062C\u0631."
        },
        defaultTitle: { en: "Verified Buyer Voices", ar: "\u0622\u0631\u0627\u0621 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0646 \u0627\u0644\u0645\u0648\u062B\u0642\u064A\u0646" },
        defaultContent: {
          subtitle: {
            en: "Feedback recorded on fulfilled multi-vendor orders across Lebanon.",
            ar: "\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0645\u0646 \u0637\u0644\u0628\u0627\u062A \u0645\u0646\u062C\u0632\u0629 \u0639\u0628\u0631 \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629."
          },
          items: [
            {
              quote: {
                en: "Split delivery between two Beirut and Metn sellers arrived cleanly tracked in one checkout.",
                ar: "\u0648\u0635\u0644 \u0627\u0644\u0637\u0644\u0628 \u0627\u0644\u0645\u0642\u0633\u0645 \u0628\u064A\u0646 \u0628\u0627\u0626\u0639\u064A\u0646 \u0641\u064A \u0628\u064A\u0631\u0648\u062A \u0648\u0627\u0644\u0645\u062A\u0646 \u0628\u062A\u062A\u0628\u0639 \u0648\u0627\u0636\u062D \u0648\u0641\u0627\u062A\u0648\u0631\u0629 \u0648\u0627\u062D\u062F\u0629."
              },
              author: "Rami K.",
              city: { en: "Achrafieh, Beirut", ar: "\u0627\u0644\u0623\u0634\u0631\u0641\u064A\u0629\u060C \u0628\u064A\u0631\u0648\u062A" },
              rating: 5
            },
            {
              quote: {
                en: "Exact USD and LBP conversion at checkout with zero surprise fees on Cash on Delivery.",
                ar: "\u0633\u0639\u0631 \u0635\u0631\u0641 \u062F\u0642\u064A\u0642 \u0628\u064A\u0646 \u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0648\u0627\u0644\u0644\u064A\u0631\u0629 \u0639\u0646\u062F \u0627\u0644\u062F\u0641\u0639 \u0628\u062F\u0648\u0646 \u0623\u064A \u0631\u0633\u0648\u0645 \u0645\u0641\u0627\u062C\u0626\u0629."
              },
              author: "Nour H.",
              city: { en: "Jounieh, Mount Lebanon", ar: "\u062C\u0648\u0646\u064A\u0629\u060C \u062C\u0628\u0644 \u0644\u0628\u0646\u0627\u0646" },
              rating: 5
            },
            {
              quote: {
                en: "Direct communication with the merchant and verified commercial registration gave me full confidence.",
                ar: "\u062A\u0648\u0627\u0635\u0644 \u0645\u0628\u0627\u0634\u0631 \u0645\u0639 \u0627\u0644\u0645\u062A\u062C\u0631 \u0648\u062A\u0648\u062B\u064A\u0642 \u062A\u062C\u0627\u0631\u064A \u064A\u0645\u0646\u062D \u062B\u0642\u0629 \u0643\u0627\u0645\u0644\u0629 \u0639\u0646\u062F \u0627\u0644\u0634\u0631\u0627\u0621."
              },
              author: "Karim S.",
              city: { en: "Tripoli, North", ar: "\u0637\u0631\u0627\u0628\u0644\u0633\u060C \u0627\u0644\u0634\u0645\u0627\u0644" },
              rating: 5
            }
          ]
        }
      },
      {
        type: "how_it_works",
        category: "discovery_trust",
        label: { en: "14 \xB7 How It Works & Seller Plans", ar: "14 \xB7 \u0622\u0644\u064A\u0629 \u0627\u0644\u0639\u0645\u0644 \u0648\u062E\u0637\u0637 \u0627\u0644\u0628\u0627\u0626\u0639\u064A\u0646" },
        description: {
          en: "Numbered onboarding steps plus optional live database Subscription Plans grid.",
          ar: "\u062E\u0637\u0648\u0627\u062A \u0648\u0627\u0636\u062D\u0629 \u0644\u0644\u0628\u064A\u0639 \u0623\u0648 \u0627\u0644\u0634\u0631\u0627\u0621 \u0645\u0639 \u0639\u0631\u0636 \u0628\u0627\u0642\u0627\u062A \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0627\u0644\u0641\u0639\u0644\u064A\u0629."
        },
        defaultTitle: { en: "Launch Your Branded Storefront", ar: "\u0623\u0637\u0644\u0642 \u0645\u062A\u062C\u0631\u0643 \u0627\u0644\u0645\u0633\u062A\u0642\u0644 \u0639\u0644\u0649 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643" },
        defaultContent: {
          eyebrow: { en: "Merchant Onboarding", ar: "\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u062A\u062C\u0627\u0631 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u064A\u0646" },
          body: {
            en: "Start on the Free tier with commercial verification, choose an accessible storefront theme, and settle earnings via Whish, OMT, or Bank IBAN.",
            ar: "\u0627\u0628\u062F\u0623 \u0645\u062C\u0627\u0646\u0627\u064B \u0645\u0639 \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u060C \u0627\u062E\u062A\u0631 \u0647\u0648\u064A\u0629 \u0645\u062A\u062C\u0631\u0643\u060C \u0648\u0627\u0633\u062A\u0644\u0645 \u0623\u0631\u0628\u0627\u062D\u0643 \u0639\u0628\u0631 Whish \u0623\u0648 OMT \u0623\u0648 \u0627\u0644\u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0628\u0646\u0643\u064A."
          },
          ctaLabel: { en: "Apply as Seller", ar: "\u0627\u0644\u062A\u0642\u062F\u064A\u0645 \u0643\u0628\u0627\u0626\u0639" },
          ctaUrl: "/seller",
          showPlans: true,
          steps: [
            {
              num: "01",
              title: { en: "Submit Commercial KYC", ar: "\u062A\u0642\u062F\u064A\u0645 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u062A\u062C\u0627\u0631\u064A" },
              desc: { en: "Verify business identity and select your Lebanese governorate.", ar: "\u062A\u0648\u062B\u064A\u0642 \u0627\u0644\u0647\u0648\u064A\u0629 \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0629 \u0648\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0629." }
            },
            {
              num: "02",
              title: { en: "Publish USD or LBP SKUs", ar: "\u0625\u062F\u0631\u0627\u062C \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A" },
              desc: { en: "Add variants, stock counts, and technical specification tables.", ar: "\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u0648\u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0648\u062C\u062F\u0627\u0648\u0644 \u0627\u0644\u0645\u0648\u0627\u0635\u0641\u0627\u062A." }
            },
            {
              num: "03",
              title: { en: "Fulfill & Settle Cleanly", ar: "\u0627\u0644\u0634\u062D\u0646 \u0648\u062A\u0633\u0648\u064A\u0629 \u0627\u0644\u0623\u0631\u0628\u0627\u062D" },
              desc: { en: "Receive automatic split sub-orders and track payouts in ledger.", ar: "\u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0642\u0633\u0645\u0629 \u0648\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u0645\u0627\u0644\u064A." }
            }
          ]
        }
      },
      {
        type: "newsletter_box",
        category: "editorial_media",
        label: { en: "15 \xB7 Newsletter Signup Box", ar: "15 \xB7 \u0635\u0646\u062F\u0648\u0642 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0641\u064A \u0627\u0644\u0646\u0634\u0631\u0629" },
        description: {
          en: "Persisted email dispatch signup saved directly to newsletter_subscribers in MySQL.",
          ar: "\u0646\u0645\u0648\u0630\u062C \u0627\u0634\u062A\u0631\u0627\u0643 \u0641\u0639\u0644\u064A \u064A\u062D\u0641\u0638 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0641\u064A \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A."
        },
        defaultTitle: { en: "Marketplace Dispatch", ar: "\u0646\u0634\u0631\u0629 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643 \u0627\u0644\u0628\u0631\u064A\u062F\u064A\u0629" },
        defaultContent: {
          desc: {
            en: "Receive verified merchant launch notices and seasonal platform schedule announcements.",
            ar: "\u0627\u0633\u062A\u0644\u0645 \u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0625\u0637\u0644\u0627\u0642 \u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u0648\u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u0645\u062C\u062F\u0648\u0644\u0629 \u0641\u064A \u0644\u0628\u0646\u0627\u0646."
          },
          ctaLabel: { en: "Subscribe", ar: "\u0627\u0634\u062A\u0631\u0627\u0643" },
          placeholder: { en: "you@example.com", ar: "\u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" }
        }
      },
      {
        type: "faq_accordion",
        category: "editorial_media",
        label: { en: "16 \xB7 FAQ Accordion", ar: "16 \xB7 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629" },
        description: {
          en: "Expandable bilingual FAQ list managed visually without touching code or JSON.",
          ar: "\u0642\u0627\u0626\u0645\u0629 \u0623\u0633\u0626\u0644\u0629 \u0648\u0623\u062C\u0648\u0628\u0629 \u0628\u0627\u0644\u0644\u063A\u062A\u064A\u0646 \u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0628\u0635\u0631\u064A \u0627\u0644\u0645\u0628\u0627\u0634\u0631."
        },
        defaultTitle: { en: "Frequently Asked Questions", ar: "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629" },
        defaultContent: {
          items: [
            {
              q: {
                en: "How does multi-seller checkout splitting work?",
                ar: "\u0643\u064A\u0641 \u064A\u062A\u0645 \u062A\u0642\u0633\u064A\u0645 \u0627\u0644\u0637\u0644\u0628 \u0639\u0646\u062F \u0627\u0644\u0634\u0631\u0627\u0621 \u0645\u0646 \u0623\u0643\u062B\u0631 \u0645\u0646 \u0645\u062A\u062C\u0631\u061F"
              },
              a: {
                en: "Your cart automatically groups items by seller into independent sub-orders with clear delivery fees and tracking per merchant.",
                ar: "\u062A\u0642\u0648\u0645 \u0627\u0644\u062D\u0642\u064A\u0628\u0629 \u0628\u062A\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u062D\u0633\u0628 \u0627\u0644\u0628\u0627\u0626\u0639 \u0641\u064A \u0637\u0644\u0628\u0627\u062A \u0641\u0631\u0639\u064A\u0629 \u0645\u0633\u062A\u0642\u0644\u0629 \u0645\u0639 \u0631\u0633\u0648\u0645 \u062A\u0648\u0635\u064A\u0644 \u0648\u062A\u062A\u0628\u0639 \u0648\u0627\u0636\u062D \u0644\u0643\u0644 \u0645\u062A\u062C\u0631."
              }
            },
            {
              q: {
                en: "How are USD and LBP prices calculated?",
                ar: "\u0643\u064A\u0641 \u064A\u062A\u0645 \u0627\u062D\u062A\u0633\u0627\u0628 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0628\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0648\u0627\u0644\u0644\u064A\u0631\u0629 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629\u061F"
              },
              a: {
                en: "All ledger amounts use integer USD minor units and convert cleanly using the live rate configured in Admin Console.",
                ar: "\u062A\u064F\u062D\u0641\u0638 \u0627\u0644\u0645\u0628\u0627\u0644\u063A \u0628\u0648\u062D\u062F\u0627\u062A \u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0627\u0644\u0635\u063A\u0631\u0649 \u0648\u062A\u064F\u062D\u0648\u0651\u0644 \u0628\u062F\u0642\u0629 \u0648\u0641\u0642 \u0633\u0639\u0631 \u0627\u0644\u0635\u0631\u0641 \u0627\u0644\u0645\u0639\u062A\u0645\u062F \u0641\u064A \u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629."
              }
            }
          ]
        }
      },
      {
        type: "rich_block",
        category: "editorial_media",
        label: { en: "17 \xB7 Rich Editorial / Manifesto / Table", ar: "17 \xB7 \u0643\u062A\u0644\u0629 \u062A\u062D\u0631\u064A\u0631\u064A\u0629 \u0623\u0648 \u0628\u064A\u0627\u0646 \u0623\u0648 \u062C\u062F\u0648\u0644 \u0645\u0642\u0627\u0631\u0646\u0629" },
        description: {
          en: "Flexible editorial feature, full-width manifesto band, or 2-column comparison matrix.",
          ar: "\u0642\u0633\u0645 \u062A\u062D\u0631\u064A\u0631\u064A \u0645\u0631\u0646 \u0623\u0648 \u0628\u064A\u0627\u0646 \u0639\u0644\u0627\u0645\u0629 \u062A\u062C\u0627\u0631\u064A\u0629 \u0623\u0648 \u062C\u062F\u0648\u0644 \u0645\u0642\u0627\u0631\u0646\u0629 \u0645\u0646 \u0639\u0645\u0648\u062F\u064A\u0646."
        },
        defaultTitle: { en: "Built for Real Lebanese Commerce", ar: "\u0645\u0635\u0645\u0645\u0629 \u0644\u0644\u062A\u062C\u0627\u0631\u0629 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629" },
        defaultContent: {
          variant: "editorial",
          eyebrow: { en: "NileLink Standard", ar: "\u0645\u0639\u064A\u0627\u0631 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643" },
          body: {
            en: "Every price in integer minor units. Every seller commercially verified. Zero hidden currency spread.",
            ar: "\u062A\u0633\u0639\u064A\u0631 \u062F\u0642\u064A\u0642 \u0628\u0627\u0644\u0648\u062D\u062F\u0627\u062A \u0627\u0644\u0635\u063A\u0631\u0649\u060C \u062A\u0648\u062B\u064A\u0642 \u062A\u062C\u0627\u0631\u064A \u0644\u0643\u0644 \u0628\u0627\u0626\u0639\u060C \u0648\u0634\u0641\u0627\u0641\u064A\u0629 \u0643\u0627\u0645\u0644\u0629 \u0628\u064A\u0646 \u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0648\u0627\u0644\u0644\u064A\u0631\u0629."
          },
          imageUrl: "",
          focalX: 50,
          focalY: 50,
          ctaLabel: { en: "Explore Catalog", ar: "\u062A\u0635\u0641\u062D \u0627\u0644\u0643\u062A\u0627\u0644\u0648\u062C" },
          ctaUrl: "/catalog",
          colAHeader: { en: "Platform Courier", ar: "\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u0646\u0635\u0629 \u0627\u0644\u0645\u0631\u0643\u0632\u064A" },
          colBHeader: { en: "Seller Direct Fleet", ar: "\u0623\u0633\u0637\u0648\u0644 \u0627\u0644\u0628\u0627\u0626\u0639 \u0627\u0644\u062E\u0627\u0635" },
          rows: [
            {
              label: { en: "Zone Pricing", ar: "\u062A\u0633\u0639\u064A\u0631 \u0627\u0644\u0645\u0646\u0627\u0637\u0642" },
              colA: { en: "Standard 8-governorate table", ar: "\u062A\u0639\u0631\u0641\u0629 \u0645\u0648\u062D\u062F\u0629 \u0644\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A \u0627\u0644\u062B\u0645\u0627\u0646\u064A" },
              colB: { en: "Custom per governorate", ar: "\u062A\u0633\u0639\u064A\u0631 \u0645\u062E\u0635\u0635 \u0644\u0643\u0644 \u0645\u062D\u0627\u0641\u0638\u0629" }
            },
            {
              label: { en: "Sub-Order Tracking", ar: "\u062A\u062A\u0628\u0639 \u0627\u0644\u0637\u0644\u0628 \u0627\u0644\u0641\u0631\u0639\u064A" },
              colA: { en: "Integrated courier status", ar: "\u062A\u062D\u062F\u064A\u062B\u0627\u062A \u0645\u0628\u0627\u0634\u0631\u0629 \u0644\u0644\u062D\u0627\u0644\u0629" },
              colB: { en: "Direct merchant dispatch", ar: "\u062A\u062C\u0647\u064A\u0632 \u0648\u0634\u062D\u0646 \u0645\u0628\u0627\u0634\u0631 \u0645\u0646 \u0627\u0644\u0645\u062A\u062C\u0631" }
            }
          ]
        }
      },
      {
        type: "video_3d_embed",
        category: "editorial_media",
        label: { en: "18 \xB7 Video & 3D Product Showcase", ar: "18 \xB7 \u0639\u0631\u0636 \u0641\u064A\u062F\u064A\u0648 \u0623\u0648 \u0646\u0645\u0648\u0630\u062C \u062B\u0644\u0627\u062B\u064A \u0627\u0644\u0623\u0628\u0639\u0627\u062F" },
        description: {
          en: "Safe validated video highlight or interactive 3D showcase panel with poster and CTA.",
          ar: "\u0639\u0631\u0636 \u0641\u064A\u062F\u064A\u0648 \u062A\u0631\u0648\u064A\u062C\u064A \u0623\u0648 \u0645\u0639\u0627\u064A\u0646\u0629 \u0646\u0645\u0648\u0630\u062C \u062B\u0644\u0627\u062B\u064A \u0627\u0644\u0623\u0628\u0639\u0627\u062F \u0645\u0639 \u0635\u0648\u0631\u0629 \u063A\u0644\u0627\u0641 \u0648\u0632\u0631 \u0625\u062C\u0631\u0627\u0621."
        },
        defaultTitle: { en: "Inside the Workshop", ar: "\u0645\u0646 \u062F\u0627\u062E\u0644 \u0627\u0644\u0645\u0634\u063A\u0644 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A" },
        defaultContent: {
          eyebrow: { en: "Craftsmanship & Specs", ar: "\u0627\u0644\u062D\u0631\u0641\u064A\u0629 \u0648\u0627\u0644\u0645\u0648\u0627\u0635\u0641\u0627\u062A" },
          body: {
            en: "Watch merchant craft stories or inspect hardware specifications in detail before ordering.",
            ar: "\u0634\u0627\u0647\u062F \u0642\u0635\u0635 \u0627\u0644\u0635\u0646\u0627\u0639\u0629 \u0627\u0644\u0645\u062D\u0644\u064A\u0629 \u0623\u0648 \u0639\u0627\u064A\u0646 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0642\u0628\u0644 \u0627\u0644\u0637\u0644\u0628."
          },
          mediaMode: "video",
          videoUrl: "",
          posterImageUrl: "/src/assets/images/hero_beirut_editorial_1795297173320.jpg",
          focalX: 50,
          focalY: 50,
          productId: "",
          ctaLabel: { en: "Inspect Catalog", ar: "\u0627\u0633\u062A\u0643\u0634\u0641 \u0627\u0644\u0643\u062A\u0627\u0644\u0648\u062C" },
          ctaUrl: "/catalog"
        }
      }
    ];
    ALL_HOME_SECTION_TYPES = HOME_SECTION_PRESETS.map((p) => p.type);
    LEGACY_TO_V2_TYPE_MAP = {
      hero_split: "hero",
      trust_strip: "trust_cells",
      departments_bento: "category_tiles",
      dynamic_products_grid: "product_grid",
      verified_stores_grid: "featured_stores",
      category_spotlight: "department_spotlight",
      flash_deals_countdown: "flash_sale_block",
      promo_announcement_split: "promo_strip",
      brand_manifesto_band: "rich_block",
      seller_recruitment_cta: "how_it_works",
      governorates_coverage_grid: "trust_cells",
      comparison_table: "rich_block",
      newsletter_dispatch: "newsletter_box",
      faq_accordion: "faq_accordion",
      custom_rich_editorial: "rich_block"
    };
    DEFAULT_SITE_CHROME = {
      brandLogoUrl: "",
      headerLinks: [
        { id: "nav-catalog", label: { en: "Catalog", ar: "\u0627\u0644\u0643\u062A\u0627\u0644\u0648\u062C" }, url: "/catalog", visible: true },
        { id: "nav-orders", label: { en: "My Orders", ar: "\u0637\u0644\u0628\u0627\u062A\u064A" }, url: "/orders", visible: true },
        { id: "nav-styleguide", label: { en: "Styleguide", ar: "\u062F\u0644\u064A\u0644 \u0627\u0644\u062A\u0635\u0645\u064A\u0645" }, url: "/styleguide", visible: true },
        { id: "nav-seller", label: { en: "Sell on NileLink", ar: "\u0628\u0639 \u0639\u0644\u0649 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643" }, url: "/seller", visible: true },
        { id: "nav-admin", label: { en: "Admin", ar: "\u0627\u0644\u0625\u062F\u0627\u0631\u0629" }, url: "/admin", visible: true }
      ],
      showMegaMenu: true,
      megaMenuDepartments: [
        {
          slug: "fashion",
          title: { en: "Fashion", ar: "\u0627\u0644\u0623\u0632\u064A\u0627\u0621" },
          tagline: { en: "Lebanese Linen & Tailoring", ar: "\u0643\u062A\u0627\u0646 \u0648\u062E\u064A\u0627\u0637\u0629 \u0644\u0628\u0646\u0627\u0646\u064A\u0629" },
          links: [
            { label: { en: "All Fashion", ar: "\u0643\u0644 \u0627\u0644\u0623\u0632\u064A\u0627\u0621" }, url: "/catalog?department=fashion" },
            { label: { en: "Deals in Fashion", ar: "\u0639\u0631\u0648\u0636 \u0627\u0644\u0623\u0632\u064A\u0627\u0621" }, url: "/catalog?department=fashion&deals=true" }
          ]
        },
        {
          slug: "electronics",
          title: { en: "Electronics & Mobiles", ar: "\u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A \u0648\u0627\u0644\u0647\u0648\u0627\u062A\u0641" },
          tagline: { en: "Verified Warranties & Specs", ar: "\u0645\u0648\u0627\u0635\u0641\u0627\u062A \u0648\u0636\u0645\u0627\u0646\u0627\u062A \u0645\u0648\u062B\u0642\u0629" },
          links: [
            { label: { en: "All Electronics", ar: "\u0643\u0644 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A" }, url: "/catalog?department=electronics" },
            { label: { en: "Audio & Gear", ar: "\u0627\u0644\u0635\u0648\u062A\u064A\u0627\u062A \u0648\u0627\u0644\u0623\u062C\u0647\u0632\u0629" }, url: "/catalog?department=electronics&inStock=true" }
          ]
        },
        {
          slug: "home-gadgets",
          title: { en: "Home Gadgets", ar: "\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0645\u0646\u0632\u0644" },
          tagline: { en: "Ceramics & Precision Brew", ar: "\u062E\u0632\u0641 \u0648\u0623\u062F\u0648\u0627\u062A \u062A\u062D\u0636\u064A\u0631" },
          links: [
            { label: { en: "All Home Gadgets", ar: "\u0643\u0644 \u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0645\u0646\u0632\u0644" }, url: "/catalog?department=home-gadgets" }
          ]
        }
      ],
      footerColumns: [
        {
          id: "col-directory",
          title: { en: "Directory", ar: "\u0631\u0648\u0627\u0628\u0637 \u0633\u0631\u064A\u0639\u0629" },
          links: [
            { label: { en: "Catalog", ar: "\u0627\u0644\u0643\u062A\u0627\u0644\u0648\u062C" }, url: "/catalog" },
            { label: { en: "Styleguide", ar: "\u062F\u0644\u064A\u0644 \u0627\u0644\u062A\u0635\u0645\u064A\u0645" }, url: "/styleguide" },
            { label: { en: "Seller Hub", ar: "\u0644\u0648\u062D\u0629 \u0627\u0644\u0628\u0627\u0626\u0639" }, url: "/seller" },
            { label: { en: "Admin Console", ar: "\u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629" }, url: "/admin" }
          ]
        }
      ],
      footerNote: {
        en: "Lebanese multi-vendor marketplace connecting verified independent storefronts with nationwide delivery.",
        ar: "\u0633\u0648\u0642 \u0644\u0628\u0646\u0627\u0646\u064A \u0645\u062A\u0639\u062F\u062F \u0627\u0644\u0628\u0627\u0626\u0639\u064A\u0646 \u064A\u0631\u0628\u0637 \u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u0645\u0648\u062B\u0642\u0629 \u0628\u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0646 \u0639\u0628\u0631 \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A \u0627\u0644\u062B\u0645\u0627\u0646\u064A."
      },
      paymentBadges: ["COD Lebanon", "Whish Money", "USD / LBP"],
      homeSeo: {
        title: {
          en: "NileLink \u2014 Lebanese Multi-Vendor Marketplace",
          ar: "\u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643 \u2014 \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A \u0645\u062A\u0639\u062F\u062F \u0627\u0644\u0628\u0627\u0626\u0639\u064A\u0646"
        },
        description: {
          en: "Curated Lebanese merchants, verified specifications, dual USD/LBP integer pricing, and split-seller delivery across all 8 governorates.",
          ar: "\u0645\u062A\u0627\u062C\u0631 \u0644\u0628\u0646\u0627\u0646\u064A\u0629 \u0645\u0648\u062B\u0642\u0629\u060C \u0645\u0648\u0627\u0635\u0641\u0627\u062A \u0648\u0627\u0636\u062D\u0629\u060C \u062A\u0633\u0639\u064A\u0631 \u0645\u0632\u062F\u0648\u062C \u0628\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0648\u0627\u0644\u0644\u064A\u0631\u0629\u060C \u0648\u062A\u0648\u0635\u064A\u0644 \u0645\u0642\u0633\u0645 \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A."
        },
        ogImageUrl: "/src/assets/images/hero_beirut_editorial_1795297173320.jpg"
      }
    };
    STARTER_TEMPLATES = [
      {
        id: "tmpl-beirut-hero",
        name: { en: "Hero \xB7 Beirut Editorial Split", ar: "\u0648\u0627\u062C\u0647\u0629 \u0631\u0626\u064A\u0633\u064A\u0629 \xB7 \u062A\u062D\u0631\u064A\u0631\u064A \u0628\u064A\u0631\u0648\u062A" },
        description: { en: "Hero with search bar and dual merchant/catalog buttons.", ar: "\u0648\u0627\u062C\u0647\u0629 \u0631\u0626\u064A\u0633\u064A\u0629 \u0645\u0639 \u0634\u0631\u064A\u0637 \u0628\u062D\u062B \u0648\u0632\u0631\u064A\u0646." },
        sectionType: "hero",
        content: HOME_SECTION_PRESETS[0].defaultContent
      },
      {
        id: "tmpl-flash-ribbon",
        name: { en: "Promo Ribbon \xB7 Weekend Deal", ar: "\u0634\u0631\u064A\u0637 \u062A\u0631\u0648\u064A\u062C\u064A \xB7 \u0639\u0631\u0636 \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0623\u0633\u0628\u0648\u0639" },
        description: { en: "Compact ember announcement ribbon with countdown.", ar: "\u0634\u0631\u064A\u0637 \u062A\u0646\u0628\u064A\u0647 \u0645\u062F\u0645\u062C \u0645\u0639 \u0639\u062F\u0627\u062F \u062A\u0646\u0627\u0632\u0644\u064A." },
        sectionType: "announcement_bar",
        content: HOME_SECTION_PRESETS[1].defaultContent
      },
      {
        id: "tmpl-3col-bento",
        name: { en: "Editorial Bento \xB7 3 Departments", ar: "\u0634\u0628\u0643\u0629 \u0628\u064A\u0646\u062A\u0648 \xB7 3 \u0623\u0642\u0633\u0627\u0645" },
        description: { en: "Asymmetric showcase across Fashion, Electronics, Home.", ar: "\u0639\u0631\u0636 \u063A\u064A\u0631 \u0645\u062A\u0645\u0627\u062B\u0644 \u0644\u0644\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629." },
        sectionType: "bento_grid",
        content: HOME_SECTION_PRESETS[3].defaultContent
      },
      {
        id: "tmpl-lebanon-zones",
        name: { en: "Delivery \xB7 8 Governorates Matrix", ar: "\u062A\u0648\u0635\u064A\u0644 \xB7 \u062C\u062F\u0648\u0644 \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A \u0627\u0644\u062B\u0645\u0627\u0646\u064A" },
        description: { en: "Live delivery fees from database for all governorates.", ar: "\u062A\u0639\u0631\u0641\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u062D\u064A\u0629 \u0639\u0628\u0631 \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A." },
        sectionType: "trust_cells",
        content: {
          ...HOME_SECTION_PRESETS[11].defaultContent,
          mode: "governorates"
        }
      }
    ];
  }
});

// src/shared/offers.ts
function parseUtcTimestampMs(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmed) ? trimmed.replace(" ", "T") + "Z" : trimmed;
  const ms = Date.parse(normalized);
  return Number.isNaN(ms) ? null : ms;
}
function isWithinSchedule(startsAt, endsAt, nowMs = Date.now()) {
  const startMs = parseUtcTimestampMs(startsAt);
  if (startMs !== null && nowMs < startMs) return false;
  const endMs = parseUtcTimestampMs(endsAt);
  if (endMs !== null && nowMs > endMs) return false;
  return true;
}
function offerMatchesTarget(targetType, targetId, product) {
  if (targetType === "all") return true;
  if (targetType === "department") return targetId === product.department;
  if (targetType === "category") return targetId === product.categoryId;
  if (targetType === "seller") return targetId === product.sellerId;
  if (targetType === "product") return targetId === product.id;
  return false;
}
function resolveUnitOfferPrice(baseUnitUsdCents, product, offers2, nowMs = Date.now(), flashSales2 = [], ctx = {}) {
  let bestUnitCents = baseUnitUsdCents;
  let bestOffer = null;
  let bestFlashItem = null;
  for (const fs4 of flashSales2) {
    if (fs4.status === "ended") continue;
    if (!isWithinSchedule(fs4.startsAt, fs4.endsAt, nowMs)) continue;
    for (const item of fs4.items || []) {
      if (item.productId !== product.id) continue;
      if (item.stockCap > 0 && item.claimedCount >= item.stockCap) continue;
      const pctPrice = Math.max(
        1,
        Math.round(baseUnitUsdCents - baseUnitUsdCents * Math.min(90, Math.max(1, item.discountPercent)) / 100)
      );
      const flashUnit = item.salePriceUsdCents > 0 ? Math.min(pctPrice, item.salePriceUsdCents) : pctPrice;
      if (flashUnit < bestUnitCents) {
        bestUnitCents = flashUnit;
        bestFlashItem = item;
        bestOffer = null;
      }
    }
  }
  for (const offer of offers2) {
    if (!offer.active || offer.approvalStatus !== "approved") continue;
    if (!isWithinSchedule(offer.startsAt, offer.endsAt, nowMs)) continue;
    if (!offerMatchesTarget(offer.targetType, offer.targetId, product)) continue;
    if (offer.offerType === "first_order" && ctx.isFirstOrder === false) continue;
    if (offer.offerType === "vip_exclusive" && !ctx.isLoggedIn) continue;
    let discountedCents = baseUnitUsdCents;
    if (offer.offerType === "percent" || offer.offerType === "flash_percent" || offer.offerType === "first_order" || offer.offerType === "vip_exclusive") {
      const pct = Math.min(90, Math.max(1, Math.round(offer.discountValue)));
      const discount = Math.round(baseUnitUsdCents * pct / 100);
      discountedCents = Math.max(1, baseUnitUsdCents - discount);
    } else if (offer.offerType === "fixed_usd_cents") {
      const offCents = Math.max(0, Math.round(offer.discountValue));
      discountedCents = Math.max(1, baseUnitUsdCents - Math.min(baseUnitUsdCents - 1, offCents));
    } else {
      continue;
    }
    if (discountedCents < bestUnitCents) {
      bestUnitCents = discountedCents;
      bestOffer = offer;
      bestFlashItem = null;
    }
  }
  const savingsUsdCents = Math.max(0, baseUnitUsdCents - bestUnitCents);
  const compareAtUsdCents = bestOffer || bestFlashItem ? Math.max(baseUnitUsdCents, product.compareAtUsdCents || 0) : product.compareAtUsdCents ?? null;
  return {
    effectiveUsdCents: bestUnitCents,
    compareAtUsdCents,
    savingsUsdCents,
    appliedOffer: bestOffer,
    appliedFlashItem: bestFlashItem
  };
}
function evaluateCartPromotions(inputLines, offers2, flashSales2 = [], ctx = {}, nowMs = Date.now()) {
  const approvedActive = offers2.filter((o) => o.active && o.approvalStatus === "approved" && isWithinSchedule(o.startsAt, o.endsAt, nowMs)).filter((o) => {
    if (o.offerType === "first_order") return ctx.isFirstOrder !== false;
    if (o.offerType === "vip_exclusive") return Boolean(ctx.isLoggedIn);
    return true;
  }).sort((a, b) => (b.priority || 0) - (a.priority || 0));
  const unitResolved = inputLines.map((line) => {
    const resolved = resolveUnitOfferPrice(
      line.baseUnitUsdCents,
      line.product,
      approvedActive,
      nowMs,
      flashSales2,
      ctx
    );
    const lineSubtotal = resolved.effectiveUsdCents * line.quantity;
    return {
      input: line,
      resolved,
      lineSubtotal,
      extraLineDiscountUsdCents: 0,
      appliedOfferId: resolved.appliedOffer?.id ?? null,
      appliedFlashItemId: resolved.appliedFlashItem?.id ?? null,
      fundingSource: resolved.appliedOffer?.fundingSource ?? "platform",
      fundingPlatformBps: resolved.appliedOffer?.fundingPlatformBps ?? 1e4
    };
  });
  const promoTitles = /* @__PURE__ */ new Set();
  const appliedOfferIds = /* @__PURE__ */ new Set();
  for (const item of unitResolved) {
    if (item.resolved.appliedOffer) {
      promoTitles.add(item.resolved.appliedOffer.title.en);
      appliedOfferIds.add(item.resolved.appliedOffer.id);
    }
  }
  for (const item of unitResolved) {
    const qty = item.input.quantity;
    if (qty <= 0) continue;
    if (item.resolved.appliedOffer?.stackingRule === "exclusive") continue;
    let bestExtra = 0;
    let bestMultiOffer = null;
    for (const offer of approvedActive) {
      if (!offerMatchesTarget(offer.targetType, offer.targetId, item.input.product)) continue;
      if (item.resolved.appliedOffer && offer.stackingRule === "best_only" && item.resolved.appliedOffer.stackingRule === "best_only") {
      }
      const unitPrice = item.resolved.effectiveUsdCents;
      let candidateDiscount = 0;
      if (offer.offerType === "bogo") {
        const freeUnits = Math.floor(qty / 2);
        const pct = Math.min(100, Math.max(1, offer.rules?.getDiscountPct ?? 100));
        candidateDiscount = Math.round(freeUnits * unitPrice * pct / 100);
      } else if (offer.offerType === "buy_x_get_y") {
        const buyX = Math.max(1, offer.rules?.buyQty ?? 2);
        const getY = Math.max(1, offer.rules?.getQty ?? 1);
        const cycle = buyX + getY;
        const discountedUnits = Math.floor(qty / cycle) * getY;
        const pct = Math.min(100, Math.max(1, offer.rules?.getDiscountPct ?? (offer.discountValue || 50)));
        candidateDiscount = Math.round(discountedUnits * unitPrice * pct / 100);
      } else if (offer.offerType === "tiered_qty") {
        const tiers = [...offer.rules?.tiers || []].sort((a, b) => b.minQty - a.minQty);
        const matchedTier = tiers.find((t) => qty >= t.minQty);
        if (matchedTier) {
          const pct = Math.min(90, Math.max(1, matchedTier.discountPercent));
          candidateDiscount = Math.round(item.lineSubtotal * pct / 100);
        }
      }
      if (offer.rules?.maxDiscountUsdCents && candidateDiscount > offer.rules.maxDiscountUsdCents) {
        candidateDiscount = offer.rules.maxDiscountUsdCents;
      }
      if (candidateDiscount > bestExtra && candidateDiscount < item.lineSubtotal) {
        bestExtra = candidateDiscount;
        bestMultiOffer = offer;
      }
    }
    if (bestMultiOffer && bestExtra > 0) {
      item.extraLineDiscountUsdCents = bestExtra;
      item.appliedOfferId = bestMultiOffer.id;
      item.fundingSource = bestMultiOffer.fundingSource;
      item.fundingPlatformBps = bestMultiOffer.fundingPlatformBps;
      promoTitles.add(bestMultiOffer.title.en);
      appliedOfferIds.add(bestMultiOffer.id);
    }
  }
  const currentTotal = unitResolved.reduce((sum, l) => sum + (l.lineSubtotal - l.extraLineDiscountUsdCents), 0);
  const productIdsInCart = new Set(inputLines.map((l) => l.product.id));
  let bestCartOffer = null;
  let bestCartExtra = 0;
  let freeShippingApplied = false;
  for (const offer of approvedActive) {
    if (offer.offerType === "bundle_deal") {
      const reqIds = offer.rules?.bundleProductIds || [];
      if (reqIds.length >= 2 && reqIds.every((id) => productIdsInCart.has(id))) {
        const matchingSubtotal = unitResolved.filter((l) => reqIds.includes(l.input.product.id)).reduce((s, l) => s + (l.lineSubtotal - l.extraLineDiscountUsdCents), 0);
        const pct = Math.min(90, Math.max(1, offer.rules?.bundleDiscountPct ?? offer.discountValue));
        let disc = Math.round(matchingSubtotal * pct / 100);
        if (offer.rules?.maxDiscountUsdCents) disc = Math.min(disc, offer.rules.maxDiscountUsdCents);
        if (disc > bestCartExtra) {
          bestCartExtra = disc;
          bestCartOffer = offer;
        }
      }
    } else if (offer.offerType === "cart_threshold") {
      const minCart = Math.max(0, offer.rules?.minCartUsdCents ?? 0);
      if (currentTotal >= minCart && currentTotal > 0) {
        let disc = offer.discountValue <= 90 && !offer.rules?.minCartUsdCents ? Math.round(currentTotal * offer.discountValue / 100) : offer.discountValue > 90 ? offer.discountValue : Math.round(currentTotal * offer.discountValue / 100);
        if (offer.rules?.maxDiscountUsdCents) disc = Math.min(disc, offer.rules.maxDiscountUsdCents);
        disc = Math.min(currentTotal - 1, Math.max(0, disc));
        if (disc > bestCartExtra) {
          bestCartExtra = disc;
          bestCartOffer = offer;
        }
      }
    } else if (offer.offerType === "free_shipping") {
      const minCart = Math.max(0, offer.rules?.minCartUsdCents ?? 0);
      const hasMatchingTarget = unitResolved.some(
        (l) => offerMatchesTarget(offer.targetType, offer.targetId, l.input.product)
      );
      if (hasMatchingTarget && currentTotal >= minCart) {
        freeShippingApplied = true;
        promoTitles.add(offer.title.en);
        appliedOfferIds.add(offer.id);
      }
    }
  }
  if (bestCartOffer && bestCartExtra > 0 && currentTotal > 0) {
    promoTitles.add(bestCartOffer.title.en);
    appliedOfferIds.add(bestCartOffer.id);
    let distributed = 0;
    const eligible = bestCartOffer.offerType === "bundle_deal" ? unitResolved.filter((l) => (bestCartOffer.rules?.bundleProductIds || []).includes(l.input.product.id)) : unitResolved;
    const eligibleSum = eligible.reduce((s, l) => s + (l.lineSubtotal - l.extraLineDiscountUsdCents), 0);
    if (eligibleSum > 0) {
      eligible.forEach((l, idx) => {
        const net = l.lineSubtotal - l.extraLineDiscountUsdCents;
        const share = idx === eligible.length - 1 ? Math.max(0, bestCartExtra - distributed) : Math.round(bestCartExtra * net / eligibleSum);
        const bounded = Math.min(net - 1, Math.max(0, share));
        l.extraLineDiscountUsdCents += bounded;
        distributed += bounded;
      });
    }
  }
  const lines = unitResolved.map((item) => ({
    productId: item.input.product.id,
    sellerId: item.input.product.sellerId,
    quantity: item.input.quantity,
    baseUnitUsdCents: item.input.baseUnitUsdCents,
    effectiveUnitUsdCents: item.resolved.effectiveUsdCents,
    lineSubtotalUsdCents: item.lineSubtotal,
    extraLineDiscountUsdCents: item.extraLineDiscountUsdCents,
    appliedOfferId: item.appliedOfferId,
    appliedFlashItemId: item.appliedFlashItemId,
    fundingSource: item.fundingSource,
    fundingPlatformBps: item.fundingPlatformBps
  }));
  const subtotalAfterUnitOffersUsdCents = lines.reduce((s, l) => s + l.lineSubtotalUsdCents, 0);
  const extraOfferDiscountUsdCents = lines.reduce((s, l) => s + l.extraLineDiscountUsdCents, 0);
  return {
    lines,
    subtotalAfterUnitOffersUsdCents,
    extraOfferDiscountUsdCents,
    freeShippingApplied,
    appliedPromoTitles: Array.from(promoTitles),
    appliedOfferIds: Array.from(appliedOfferIds)
  };
}
var init_offers = __esm({
  "src/shared/offers.ts"() {
  }
});

// server/paymentAdapters.ts
function isCardGatewayConfigured() {
  return Boolean(
    (process.env.CARD_GATEWAY_PROVIDER || "").trim() && (process.env.CARD_GATEWAY_MERCHANT_ID || "").trim() && (process.env.CARD_GATEWAY_SECRET_KEY || "").trim()
  );
}
function getPaymentAdapter(method) {
  const adapter = ADAPTERS[method];
  if (!adapter) {
    throw new Error(`Unsupported payment method: ${method}`);
  }
  return adapter;
}
var CodPaymentAdapter, WhishManualAdapter, CardGatewayAdapter, ADAPTERS;
var init_paymentAdapters = __esm({
  "server/paymentAdapters.ts"() {
    CodPaymentAdapter = class {
      constructor() {
        this.method = "cod";
      }
      authorize(input) {
        return {
          paymentStatus: "pending",
          gatewayName: "Cash on Delivery (Lebanon)",
          reference: `COD-${input.orderNumber}`,
          note: "Amount due upon delivery; seller or courier marks collected."
        };
      }
    };
    WhishManualAdapter = class {
      constructor() {
        this.method = "whish_manual";
      }
      authorize(input) {
        if (!input.whishAccountNumber || input.whishAccountNumber.trim().length < 4) {
          throw new Error("Whish / OMT receiving account is not configured yet by platform admin.");
        }
        const ref = (input.transferReference || "").trim();
        if (ref.length < 4) {
          throw new Error("Whish / OMT transfer reference number is required (minimum 4 characters).");
        }
        return {
          paymentStatus: "pending_verification",
          gatewayName: "Whish Money / OMT (Manual Verification)",
          reference: ref,
          note: "Awaiting admin verification of transfer receipt."
        };
      }
    };
    CardGatewayAdapter = class {
      constructor() {
        this.method = "card";
      }
      authorize(input) {
        if (!isCardGatewayConfigured() || !input.cardEnabledInSettings) {
          throw new Error(
            "Needs my input: Card payments are disabled until Lebanese acquiring gateway credentials (CARD_GATEWAY_PROVIDER, CARD_GATEWAY_MERCHANT_ID, CARD_GATEWAY_SECRET_KEY) are configured."
          );
        }
        throw new Error("Live card gateway webhook verification is required before marking card orders paid.");
      }
    };
    ADAPTERS = {
      cod: new CodPaymentAdapter(),
      whish_manual: new WhishManualAdapter(),
      card: new CardGatewayAdapter()
    };
  }
});

// server/searchParser.ts
function parseNaturalQuery(rawQuery) {
  const trimmed = rawQuery.trim();
  if (!trimmed) {
    return { rawQuery: "", keywords: [] };
  }
  let working = trimmed.toLowerCase();
  const parsed = {
    rawQuery: trimmed,
    keywords: []
  };
  const underMatch = working.match(/(?:under|below|less than|<|أقل من|تحت)\s*\$?\s*(\d{1,5})\s*\$?/i);
  if (underMatch) {
    parsed.maxPriceUsdCents = Number(underMatch[1]) * 100;
    working = working.replace(underMatch[0], " ");
  }
  const overMatch = working.match(/(?:above|over|>|فوق|أكثر من)\s*\$?\s*(\d{1,5})\s*\$?/i);
  if (overMatch) {
    parsed.minPriceUsdCents = Number(overMatch[1]) * 100;
    working = working.replace(overMatch[0], " ");
  }
  const sizeMatch = working.match(/(?:size|مقاس)\s*([a-z0-9]{1,4})/i);
  if (sizeMatch) {
    parsed.size = sizeMatch[1].toUpperCase();
    working = working.replace(sizeMatch[0], " ");
  }
  if (/\b(?:in stock|available|متوفر)\b/i.test(working)) {
    parsed.inStockOnly = true;
  }
  const tokens = working.replace(/[^\p{L}\p{N}\s-]/gu, " ").split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    if (COLOR_MAP[token] && !parsed.color) {
      parsed.color = COLOR_MAP[token];
    }
    if (DEPARTMENT_HINTS[token] && !parsed.department) {
      parsed.department = DEPARTMENT_HINTS[token];
    }
    if (!STOP_WORDS.has(token) && !COLOR_MAP[token]) {
      parsed.keywords.push(token);
    }
  }
  return parsed;
}
var COLOR_MAP, DEPARTMENT_HINTS, STOP_WORDS;
var init_searchParser = __esm({
  "server/searchParser.ts"() {
    COLOR_MAP = {
      black: "Black",
      \u0623\u0633\u0648\u062F: "Black",
      sand: "Sand",
      beige: "Sand",
      \u0631\u0645\u0644\u064A: "Sand",
      cognac: "Cognac",
      brown: "Cognac",
      \u0628\u0646\u064A: "Cognac",
      sage: "Sage",
      green: "Sage",
      \u0623\u062E\u0636\u0631: "Sage",
      charcoal: "Charcoal",
      titanium: "Titanium",
      brass: "Brass",
      cyan: "Slate Cyan"
    };
    DEPARTMENT_HINTS = {
      sneakers: "fashion",
      shoes: "fashion",
      shirt: "fashion",
      overshirt: "fashion",
      linen: "fashion",
      bag: "fashion",
      leather: "fashion",
      \u0642\u0645\u064A\u0635: "fashion",
      \u062D\u0630\u0627\u0621: "fashion",
      \u0633\u0646\u064A\u0643\u0631\u0632: "fashion",
      \u062D\u0642\u064A\u0628\u0629: "fashion",
      headphones: "electronics",
      keyboard: "electronics",
      phone: "electronics",
      dac: "electronics",
      wireless: "electronics",
      \u0633\u0645\u0627\u0639\u0627\u062A: "electronics",
      \u0647\u0627\u062A\u0641: "electronics",
      \u0643\u064A\u0628\u0648\u0631\u062F: "electronics",
      kettle: "home-gadgets",
      coffee: "home-gadgets",
      scale: "home-gadgets",
      ceramic: "home-gadgets",
      \u0642\u0647\u0648\u0629: "home-gadgets",
      \u0625\u0628\u0631\u064A\u0642: "home-gadgets"
    };
    STOP_WORDS = /* @__PURE__ */ new Set([
      "under",
      "below",
      "less",
      "than",
      "above",
      "over",
      "size",
      "in",
      "stock",
      "with",
      "for",
      "and",
      "the",
      "a",
      "an",
      "usd",
      "\u0623\u0642\u0644",
      "\u0645\u0646",
      "\u062A\u062D\u062A",
      "\u0645\u0642\u0627\u0633",
      "\u0645\u062A\u0648\u0641\u0631"
    ]);
  }
});

// server/services/security.ts
import crypto2 from "node:crypto";
function normalizePhoneNumber(raw) {
  const cleaned = raw.trim().replace(/[\s().-]/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("00")) {
    return `+${cleaned.slice(2)}`;
  }
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  if (/^0\d{7,8}$/.test(cleaned)) {
    return `+961${cleaned.slice(1)}`;
  }
  if (/^(3|70|71|76|78|79|81)\d{6}$/.test(cleaned)) {
    return `+961${cleaned}`;
  }
  if (/^961\d{7,8}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  return cleaned;
}
function hashOtpCode(userId, channel, purpose, code) {
  const pepper = process.env.SESSION_SECRET || process.env.CRON_SECRET || EPHEMERAL_OTP_PEPPER;
  return crypto2.createHmac("sha256", pepper).update(`${userId}:${channel}:${purpose}:${code.trim()}`).digest("hex");
}
function toSqlTimestamp(date = /* @__PURE__ */ new Date()) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}
function sha256Hex(value) {
  return crypto2.createHash("sha256").update(value).digest("hex");
}
function timingSafeStringMatch(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto2.timingSafeEqual(bufA, bufB);
}
function validatePasswordStrength(password) {
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must include at least one letter and one number.";
  }
  return null;
}
function hashPassword(password) {
  const salt = crypto2.randomBytes(16).toString("hex");
  const derived = crypto2.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}
function verifyPassword(password, storedHash) {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  if (!salt || !keyHex) return false;
  const keyBuf = Buffer.from(keyHex, "hex");
  const derived = crypto2.scryptSync(password, salt, 64);
  if (keyBuf.length !== derived.length) return false;
  return crypto2.timingSafeEqual(keyBuf, derived);
}
function base32Encode(buf) {
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of buf) {
    value = value << 8 | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[value >>> bits - 5 & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[value << 5 - bits & 31];
  }
  return output;
}
function base32Decode(str) {
  const clean = str.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const bytes = [];
  for (const ch of clean) {
    const idx = BASE32_ALPHABET.indexOf(ch);
    if (idx === -1) continue;
    value = value << 5 | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push(value >>> bits - 8 & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}
function generateTotpSecret() {
  return base32Encode(crypto2.randomBytes(20));
}
function buildOtpAuthUri(email, secret, issuer = "NileLink") {
  const label = encodeURIComponent(`${issuer}:${email}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&digits=6&period=30`;
}
function computeTotpCode(secret, counterOffset = 0, nowMs = Date.now()) {
  const key = base32Decode(secret);
  const counter = Math.floor(nowMs / 1e3 / 30) + counterOffset;
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter), 0);
  const hmac = crypto2.createHmac("sha1", key).update(msg).digest();
  const offset = hmac[hmac.length - 1] & 15;
  const binCode = (hmac[offset] & 127) << 24 | (hmac[offset + 1] & 255) << 16 | (hmac[offset + 2] & 255) << 8 | hmac[offset + 3] & 255;
  return String(binCode % 1e6).padStart(6, "0");
}
function verifyTotpCode(secret, submittedCode) {
  const clean = submittedCode.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(clean)) return false;
  for (const offset of [-1, 0, 1]) {
    if (timingSafeStringMatch(computeTotpCode(secret, offset), clean)) {
      return true;
    }
  }
  return false;
}
function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim().slice(0, 64);
  }
  return (req.ip || "unknown").slice(0, 64);
}
function isHttpsRequest(req) {
  if (req.secure) return true;
  const proto = String(req.headers["x-forwarded-proto"] || "").toLowerCase();
  if (proto.includes("https")) return true;
  return process.env.NODE_ENV === "production";
}
function setSessionCookies(req, res, rawToken, csrfToken) {
  const https = isHttpsRequest(req);
  const maxAgeSec = Math.floor(SESSION_TTL_MS / 1e3);
  const common = https ? `Path=/; Max-Age=${maxAgeSec}; SameSite=None; Secure; Partitioned` : `Path=/; Max-Age=${maxAgeSec}; SameSite=Lax`;
  res.setHeader("Set-Cookie", [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(rawToken)}; HttpOnly; ${common}`,
    `${CSRF_COOKIE_NAME}=${encodeURIComponent(csrfToken)}; ${common}`
  ]);
}
function clearSessionCookies(req, res) {
  const https = isHttpsRequest(req);
  const common = https ? "Path=/; Max-Age=0; SameSite=None; Secure; Partitioned" : "Path=/; Max-Age=0; SameSite=Lax";
  res.setHeader("Set-Cookie", [
    `${SESSION_COOKIE_NAME}=; HttpOnly; ${common}`,
    `${CSRF_COOKIE_NAME}=; ${common}`
  ]);
}
async function createSession(txOrDb, userId, req) {
  const sessionId = `ses-${crypto2.randomUUID()}`;
  const rawToken = crypto2.randomBytes(32).toString("hex");
  const csrfToken = crypto2.randomBytes(24).toString("hex");
  const tokenHash = sha256Hex(rawToken);
  const expiresAt = toSqlTimestamp(new Date(Date.now() + SESSION_TTL_MS));
  const ua = String(req.headers["user-agent"] || "").slice(0, 250);
  const ip = getClientIp(req);
  await txOrDb.execute(
    "INSERT INTO sessions (id, user_id, token_hash, csrf_token, user_agent, ip_address, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [sessionId, userId, tokenHash, csrfToken, ua, ip, expiresAt, toSqlTimestamp()]
  );
  return { sessionId, rawToken, csrfToken, expiresAt };
}
async function rotateSession(db, oldSessionId, userId, req) {
  return db.transaction(async (tx) => {
    if (oldSessionId) {
      await tx.execute("DELETE FROM sessions WHERE id = ?", [oldSessionId]);
    }
    return createSession(tx, userId, req);
  });
}
async function revokeSession(db, sessionId) {
  await db.execute("DELETE FROM sessions WHERE id = ?", [sessionId]);
}
async function revokeAllUserSessions(db, userId) {
  await db.execute("DELETE FROM sessions WHERE user_id = ?", [userId]);
}
async function getSessionUser(db, rawToken) {
  if (!rawToken) return null;
  const tokenHash = sha256Hex(rawToken);
  const now = toSqlTimestamp();
  const row = await db.queryOne(
    `SELECT s.id AS session_id, s.csrf_token, u.id AS user_id, u.name, u.email, u.phone,
            u.role_key, u.totp_enabled, u.email_verified_at, u.phone_verified_at,
            u.preferred_locale, u.preferred_currency, u.is_blocked, u.deleted_at
     FROM sessions s
     INNER JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ?`,
    [tokenHash, now]
  );
  if (!row || row.is_blocked || row.deleted_at) return null;
  let sellerRow = await db.queryOne(
    "SELECT id FROM sellers WHERE owner_user_id = ? AND deleted_at IS NULL LIMIT 1",
    [row.user_id]
  );
  if (!sellerRow && row.role_key === "seller_staff") {
    const keyCol = db.driver === "mysql" ? "`key`" : "key";
    const mapRow = await db.queryOne(
      `SELECT value_json FROM settings WHERE ${keyCol} = 'seller_staff_map'`
    );
    if (mapRow?.value_json) {
      try {
        const parsed = typeof mapRow.value_json === "string" ? JSON.parse(mapRow.value_json) : mapRow.value_json;
        const mappedSellerId = parsed[row.user_id];
        if (mappedSellerId) {
          sellerRow = await db.queryOne(
            "SELECT id FROM sellers WHERE id = ? AND deleted_at IS NULL LIMIT 1",
            [mappedSellerId]
          );
        }
      } catch {
      }
    }
  }
  const rolePerms = await db.query(
    "SELECT permission_key FROM role_permissions WHERE role_key = ?",
    [row.role_key]
  );
  const userPerms = await db.query(
    "SELECT permission_key FROM user_permissions WHERE user_id = ?",
    [row.user_id]
  );
  const permSet = row.role_key === "seller_staff" && userPerms.length > 0 ? new Set(userPerms.map((p) => p.permission_key)) : /* @__PURE__ */ new Set([
    ...rolePerms.map((p) => p.permission_key),
    ...userPerms.map((p) => p.permission_key)
  ]);
  const emailVerifiedAt = row.email_verified_at ? String(row.email_verified_at) : null;
  const phoneVerifiedAt = row.phone_verified_at ? String(row.phone_verified_at) : null;
  return {
    id: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    roleKey: row.role_key,
    sellerId: sellerRow?.id,
    totpEnabled: Boolean(row.totp_enabled),
    emailVerifiedAt,
    phoneVerifiedAt,
    isFullyVerified: Boolean(emailVerifiedAt && phoneVerifiedAt),
    preferredLocale: row.preferred_locale === "ar" ? "ar" : "en",
    preferredCurrency: row.preferred_currency === "LBP" ? "LBP" : "USD",
    permissions: Array.from(permSet),
    sessionId: row.session_id,
    csrfToken: row.csrf_token
  };
}
function hasPermission(user, permission) {
  if (!user) return false;
  if (user.roleKey === "admin_super") return true;
  return user.permissions.includes(permission);
}
function isAdminRole(roleKey) {
  return roleKey === "admin_super" || roleKey === "admin_staff";
}
function isSellerRole(roleKey) {
  return roleKey === "seller_owner" || roleKey === "seller_staff";
}
async function writeAuditLog(txOrDb, input) {
  await txOrDb.execute(
    "INSERT INTO audit_log (id, actor_user_id, action, entity_type, entity_id, before_json, after_json, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      `aud-${crypto2.randomUUID()}`,
      input.actorUserId,
      input.action,
      input.entityType,
      input.entityId,
      input.before !== void 0 ? JSON.stringify(input.before) : null,
      input.after !== void 0 ? JSON.stringify(input.after) : null,
      input.ipAddress || null,
      toSqlTimestamp()
    ]
  );
}
var EPHEMERAL_OTP_PEPPER, SESSION_COOKIE_NAME, CSRF_COOKIE_NAME, SESSION_TTL_MS, BASE32_ALPHABET;
var init_security = __esm({
  "server/services/security.ts"() {
    EPHEMERAL_OTP_PEPPER = crypto2.randomBytes(32).toString("hex");
    SESSION_COOKIE_NAME = "nl_session";
    CSRF_COOKIE_NAME = "nl_csrf";
    SESSION_TTL_MS = 1e3 * 60 * 60 * 24 * 7;
    BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  }
});

// server/services/email.ts
import crypto3 from "node:crypto";
import nodemailer from "nodemailer";
function getSmtpConfig() {
  const host = (process.env.SMTP_HOST || "").trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = (process.env.SMTP_USER || "").trim();
  const pass = process.env.SMTP_PASS || "";
  const from = (process.env.SMTP_FROM || "no-reply@nilelink.lb").trim();
  return { host, port, user, pass, from };
}
function interpolate(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_match, k) => vars[k] ?? "");
}
function escapeHtml(raw) {
  return String(raw ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function safeEmailUrl(raw, baseUrl) {
  const s = String(raw || "").trim();
  if (!s || /^\s*(javascript|data|vbscript):/i.test(s)) return baseUrl;
  if (s.startsWith("/")) return `${baseUrl}${s}`;
  if (/^https?:\/\//i.test(s)) return s;
  return baseUrl;
}
function renderEmailBlocks(blocks, opts) {
  const locale = opts.locale === "ar" ? "ar" : "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  const baseUrl = (opts.appUrl || process.env.APP_URL || "https://nilelink.lb").replace(/\/$/, "");
  const productMap = new Map((opts.products || []).map((p) => [p.id, p]));
  const textParts = [opts.subject];
  const htmlBlocks = [];
  for (const b of blocks) {
    const title = locale === "ar" ? b.titleAr || b.titleEn || "" : b.titleEn || b.titleAr || "";
    const body = locale === "ar" ? b.bodyAr || b.bodyEn || "" : b.bodyEn || b.bodyAr || "";
    const btnLabel = locale === "ar" ? b.buttonLabelAr || b.buttonLabelEn || "" : b.buttonLabelEn || b.buttonLabelAr || "";
    if (b.type === "header") {
      textParts.push(title || "NileLink");
      htmlBlocks.push(
        `<div style="padding:20px 24px;border-bottom:1px solid #30343B;background:#17181B;">
          <div style="font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#EA580C;">NILELINK LEBANON</div>
          ${title ? `<h1 style="margin:6px 0 0;font-size:22px;line-height:1.25;color:#F3EFE8;">${escapeHtml(title)}</h1>` : ""}
        </div>`
      );
    } else if (b.type === "hero_text") {
      if (title) textParts.push(title);
      if (body) textParts.push(body);
      const safeImg = b.imageUrl ? safeEmailUrl(b.imageUrl, baseUrl) : "";
      htmlBlocks.push(
        `<div style="padding:24px;border-bottom:1px solid #30343B;background:#222428;">
          ${safeImg && safeImg !== baseUrl ? `<img src="${escapeHtml(safeImg)}" alt="${escapeHtml(title)}" style="display:block;width:100%;max-height:280px;object-fit:cover;margin-bottom:16px;border:1px solid #30343B;" />` : ""}
          ${title ? `<h2 style="margin:0 0 10px;font-size:20px;color:#F3EFE8;">${escapeHtml(title)}</h2>` : ""}
          ${body ? `<p style="margin:0;font-size:14px;line-height:1.65;color:#C7C4BC;">${escapeHtml(body).replace(/\n/g, "<br/>")}</p>` : ""}
        </div>`
      );
    } else if (b.type === "product_spotlight") {
      const ids = b.productIds || [];
      const cards = [];
      for (const pid of ids) {
        const prod = productMap.get(pid);
        if (!prod) continue;
        const pTitle = locale === "ar" ? prod.titleAr : prod.titleEn;
        const pPrice = `$${(prod.priceUsdCents / 100).toFixed(2)}`;
        const pUrl = `${baseUrl}/product/${encodeURIComponent(prod.slug)}`;
        textParts.push(`${pTitle} \u2014 ${pPrice} (${pUrl})`);
        cards.push(
          `<div style="padding:14px;border:1px solid #30343B;background:#17181B;margin-bottom:10px;">
            <div style="font-size:14px;font-weight:bold;color:#F3EFE8;">${escapeHtml(pTitle)}</div>
            <div style="margin-top:4px;font-family:monospace;font-size:13px;color:#65A30D;">${escapeHtml(pPrice)}</div>
            <a href="${escapeHtml(pUrl)}" style="display:inline-block;margin-top:10px;padding:7px 14px;border:1px solid #EA580C;color:#EA580C;text-decoration:none;font-size:12px;font-weight:bold;text-transform:uppercase;">${locale === "ar" ? "\u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062A\u062C" : "View Product"}</a>
          </div>`
        );
      }
      if (cards.length > 0 || title) {
        htmlBlocks.push(
          `<div style="padding:20px 24px;border-bottom:1px solid #30343B;background:#222428;">
            ${title ? `<h3 style="margin:0 0 12px;font-size:16px;color:#F3EFE8;">${escapeHtml(title)}</h3>` : ""}
            ${cards.join("")}
          </div>`
        );
      }
    } else if (b.type === "coupon_box") {
      const code = (b.couponCode || opts.attachCouponCode || "").trim().toUpperCase();
      if (code) {
        textParts.push(`${title || "Coupon"}: ${code}`);
        htmlBlocks.push(
          `<div style="padding:20px 24px;border-bottom:1px solid #30343B;background:#17181B;text-align:center;">
            ${title ? `<div style="font-size:12px;color:#C7C4BC;margin-bottom:6px;">${escapeHtml(title)}</div>` : ""}
            <div style="display:inline-block;padding:10px 20px;border:1px dashed #D97706;font-family:monospace;font-size:20px;font-weight:bold;letter-spacing:3px;color:#D97706;">${escapeHtml(code)}</div>
            ${body ? `<div style="font-size:12px;color:#9CA3AF;margin-top:8px;">${escapeHtml(body)}</div>` : ""}
          </div>`
        );
      }
    } else if (b.type === "cta_button") {
      const href = safeEmailUrl(b.buttonUrl || "/catalog", baseUrl);
      const label = btnLabel || (locale === "ar" ? "\u062A\u0633\u0648\u0642 \u0627\u0644\u0622\u0646" : "Shop Now");
      textParts.push(`${label}: ${href}`);
      htmlBlocks.push(
        `<div style="padding:22px 24px;border-bottom:1px solid #30343B;background:#222428;text-align:center;">
          <a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 28px;background:#EA580C;color:#17181B;text-decoration:none;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">${escapeHtml(label)}</a>
        </div>`
      );
    } else if (b.type === "divider_footer") {
      if (body) textParts.push(body);
      htmlBlocks.push(
        `<div style="padding:16px 24px;background:#17181B;font-size:12px;color:#9CA3AF;line-height:1.5;">
          ${body ? escapeHtml(body) : escapeHtml(locale === "ar" ? "\u0646\u064A\u0644 \u0644\u064A\u0646\u0643 \u2014 \u0633\u0648\u0642 \u0644\u0628\u0646\u0627\u0646 \u0645\u062A\u0639\u062F\u062F \u0627\u0644\u0628\u0627\u0626\u0639\u064A\u0646" : "NileLink \u2014 Lebanese Multi-Vendor Marketplace")}
        </div>`
      );
    }
  }
  if (opts.attachCouponCode && !blocks.some((b) => b.type === "coupon_box")) {
    const code = opts.attachCouponCode.trim().toUpperCase();
    textParts.push(`Promo Code: ${code}`);
    htmlBlocks.push(
      `<div style="padding:18px 24px;border-bottom:1px solid #30343B;background:#17181B;text-align:center;">
        <div style="display:inline-block;padding:8px 18px;border:1px dashed #D97706;font-family:monospace;font-size:18px;font-weight:bold;color:#D97706;">${escapeHtml(code)}</div>
      </div>`
    );
  }
  const unsubUrl = opts.unsubscribeUrl || `${baseUrl}/legal`;
  textParts.push(`${locale === "ar" ? "\u0644\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643:" : "Unsubscribe:"} ${unsubUrl}`);
  const html = `<!doctype html>
<html lang="${locale}" dir="${dir}">
  <body style="margin:0;padding:24px 12px;background:#111215;font-family:Arial,Helvetica,sans-serif;color:#F3EFE8;">
    ${opts.previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(opts.previewText)}</div>` : ""}
    <div style="max-width:600px;margin:0 auto;border:1px solid #30343B;background:#222428;">
      ${htmlBlocks.join("\n")}
      <div style="padding:16px 24px;background:#17181B;border-top:1px solid #30343B;font-size:11px;color:#9CA3AF;text-align:center;">
        <a href="${escapeHtml(unsubUrl)}" style="color:#9CA3AF;text-decoration:underline;">
          ${locale === "ar" ? "\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0645\u0646 \u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u062A\u0633\u0648\u064A\u0642" : "Unsubscribe from marketing emails"}
        </a>
      </div>
    </div>
  </body>
</html>`;
  return { html, text: textParts.join("\n\n") };
}
async function queueEmail(db, payload) {
  await db.execute(
    "INSERT INTO jobs (id, job_type, payload_json, status, attempts, run_at, created_at) VALUES (?, ?, ?, ?, 0, ?, ?)",
    [
      `job-${crypto3.randomUUID()}`,
      "send_email",
      JSON.stringify(payload),
      "queued",
      toSqlTimestamp(),
      toSqlTimestamp()
    ]
  );
}
async function processEmailJob(db, payload) {
  const keyCol = db.driver === "mysql" ? "`key`" : "key";
  const tplRow = await db.queryOne(
    `SELECT subject_json, body_json FROM email_templates WHERE ${keyCol} = ?`,
    [payload.templateKey]
  );
  const locale = payload.locale === "ar" ? "ar" : "en";
  const vars = payload.vars || {};
  let subject = `NileLink Notification (${payload.templateKey})`;
  let body = "";
  if (tplRow) {
    const subJson = typeof tplRow.subject_json === "string" ? JSON.parse(tplRow.subject_json) : tplRow.subject_json;
    const bodJson = typeof tplRow.body_json === "string" ? JSON.parse(tplRow.body_json) : tplRow.body_json;
    subject = interpolate(String(subJson?.[locale] || subJson?.en || subject), vars);
    body = interpolate(String(bodJson?.[locale] || bodJson?.en || ""), vars);
  }
  const res = await emailAdapter.send({ to: payload.to, subject, text: body });
  await db.execute(
    "INSERT INTO email_log (id, recipient_email, template_key, status, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [
      `eml-${crypto3.randomUUID()}`,
      payload.to,
      payload.templateKey,
      res.ok ? "sent" : emailAdapter.isConfigured() ? "failed" : "unconfigured",
      res.error || null,
      toSqlTimestamp()
    ]
  );
}
async function processMarketingEmailJob(db, payload) {
  const emailNorm = String(payload.to || "").trim().toLowerCase();
  if (!emailNorm) return;
  const subRow = await db.queryOne(
    "SELECT status, unsubscribe_token FROM newsletter_subscribers WHERE LOWER(email) = ? LIMIT 1",
    [emailNorm]
  );
  if (subRow && subRow.status === "unsubscribed") {
    if (payload.campaignId) {
      await db.execute(
        "UPDATE email_campaigns SET unsubscribed_count = unsubscribed_count + 1 WHERE id = ?",
        [payload.campaignId]
      );
    }
    return;
  }
  const productIds = /* @__PURE__ */ new Set();
  for (const b of payload.blocks || []) {
    for (const pid of b.productIds || []) productIds.add(pid);
  }
  const products2 = [];
  if (productIds.size > 0) {
    const placeholders = Array.from(productIds).map(() => "?").join(", ");
    const rows = await db.query(
      `SELECT id, slug, title_json, base_price_usd_cents FROM products WHERE id IN (${placeholders})`,
      Array.from(productIds)
    );
    for (const r of rows) {
      const tj = typeof r.title_json === "string" ? JSON.parse(r.title_json) : r.title_json;
      products2.push({
        id: r.id,
        slug: r.slug,
        titleEn: String(tj?.en || "Product"),
        titleAr: String(tj?.ar || tj?.en || "\u0645\u0646\u062A\u062C"),
        priceUsdCents: Number(r.base_price_usd_cents || 0)
      });
    }
  }
  const baseUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const token = payload.unsubscribeToken || subRow?.unsubscribe_token || "";
  const unsubscribeUrl = token ? `${baseUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}` : `${baseUrl}/legal`;
  const rendered = renderEmailBlocks(payload.blocks || [], {
    locale: payload.locale || "en",
    subject: payload.subject,
    previewText: payload.previewText,
    products: products2,
    attachCouponCode: payload.attachCouponCode,
    unsubscribeUrl,
    appUrl: baseUrl
  });
  const res = await emailAdapter.send({
    to: emailNorm,
    subject: payload.subject,
    text: rendered.text,
    html: rendered.html
  });
  const tplKey = payload.campaignId ? `campaign:${payload.campaignId}` : payload.flowId ? `flow:${payload.flowId}` : "marketing";
  await db.execute(
    "INSERT INTO email_log (id, recipient_email, template_key, status, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [
      `eml-${crypto3.randomUUID()}`,
      emailNorm,
      tplKey.slice(0, 64),
      res.ok ? "sent" : emailAdapter.isConfigured() ? "failed" : "unconfigured",
      res.error || null,
      toSqlTimestamp()
    ]
  );
  if (payload.campaignId) {
    if (res.ok) {
      await db.execute("UPDATE email_campaigns SET sent_count = sent_count + 1 WHERE id = ?", [payload.campaignId]);
    } else {
      await db.execute("UPDATE email_campaigns SET failed_count = failed_count + 1 WHERE id = ?", [payload.campaignId]);
    }
  }
  if (payload.flowId && res.ok) {
    await db.execute("UPDATE automation_flows SET total_sent = total_sent + 1 WHERE id = ?", [payload.flowId]);
  }
}
function renderNotificationSummaryEmail(opts) {
  const locale = opts.locale === "ar" ? "ar" : "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  const baseUrl = (opts.appUrl || process.env.APP_URL || "https://nilelink.lb").replace(/\/$/, "");
  const count = opts.notifications.length;
  const freqLabel = opts.frequency === "instant" ? locale === "ar" ? "\u062A\u0646\u0628\u064A\u0647 \u0641\u0648\u0631\u064A" : "Instant Alert" : opts.frequency === "weekly" ? locale === "ar" ? "\u0627\u0644\u0645\u0644\u062E\u0635 \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064A" : "Weekly Summary" : locale === "ar" ? "\u0627\u0644\u0645\u0644\u062E\u0635 \u0627\u0644\u064A\u0648\u0645\u064A" : "Daily Summary";
  const subject = locale === "ar" ? `\u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643 \u2014 ${freqLabel} (${count} ${count === 1 ? "\u0625\u0634\u0639\u0627\u0631" : "\u0625\u0634\u0639\u0627\u0631\u0627\u062A"})` : `NileLink ${freqLabel} \xB7 ${count} ${count === 1 ? "update" : "updates"}`;
  const grouped = /* @__PURE__ */ new Map();
  for (const n of opts.notifications) {
    const cat = n.category || "system";
    const arr = grouped.get(cat) || [];
    arr.push(n);
    grouped.set(cat, arr);
  }
  const orderOrder = ["order", "price_drop", "promo", "system"];
  const textSections = [
    locale === "ar" ? `\u0645\u0631\u062D\u0628\u0627\u064B ${opts.userName}\u060C \u0625\u0644\u064A\u0643 \u0645\u0644\u062E\u0635 \u0625\u0634\u0639\u0627\u0631\u0627\u062A\u0643 \u0639\u0644\u0649 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643:` : `Hello ${opts.userName}, here is your NileLink notifications digest:`
  ];
  const htmlSections = [];
  for (const cat of orderOrder) {
    const items = grouped.get(cat);
    if (!items || items.length === 0) continue;
    const labelMeta = CATEGORY_LABELS[cat];
    const heading = locale === "ar" ? labelMeta.ar : labelMeta.en;
    textSections.push(`
## ${heading}`);
    const itemCards = [];
    for (const item of items) {
      const title = locale === "ar" ? item.title.ar || item.title.en : item.title.en || item.title.ar;
      const body = locale === "ar" ? item.body.ar || item.body.en : item.body.en || item.body.ar;
      const href = safeEmailUrl(item.actionUrl || "/account?tab=notifications", baseUrl);
      textSections.push(`- ${title}: ${body} (${href})`);
      itemCards.push(
        `<div style="padding:12px 14px;border:1px solid #30343B;background:#17181B;margin-bottom:8px;">
          <div style="font-size:14px;font-weight:bold;color:#F3EFE8;">${escapeHtml(title)}</div>
          <div style="margin-top:4px;font-size:13px;line-height:1.5;color:#C7C4BC;">${escapeHtml(body)}</div>
          <div style="margin-top:8px;">
            <a href="${escapeHtml(href)}" style="font-size:11px;font-weight:bold;text-transform:uppercase;color:${labelMeta.color};text-decoration:none;border-bottom:1px solid ${labelMeta.color};">${locale === "ar" ? "\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" : "Open Details"}</a>
          </div>
        </div>`
      );
    }
    htmlSections.push(
      `<div style="padding:18px 24px;border-bottom:1px solid #30343B;background:#222428;">
        <div style="font-family:monospace;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:${labelMeta.color};margin-bottom:10px;">
          ${escapeHtml(heading)} (${items.length})
        </div>
        ${itemCards.join("")}
      </div>`
    );
  }
  const prefsUrl = `${baseUrl}/account?tab=notifications`;
  textSections.push(
    locale === "ar" ? `
\u0625\u062F\u0627\u0631\u0629 \u062A\u0641\u0636\u064A\u0644\u0627\u062A \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A: ${prefsUrl}` : `
Manage notification preferences: ${prefsUrl}`
  );
  const html = `<!doctype html>
<html lang="${locale}" dir="${dir}">
  <body style="margin:0;padding:24px 12px;background:#111215;font-family:Arial,Helvetica,sans-serif;color:#F3EFE8;">
    <div style="max-width:600px;margin:0 auto;border:1px solid #30343B;background:#222428;">
      <div style="padding:20px 24px;border-bottom:1px solid #30343B;background:#17181B;">
        <div style="font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#EA580C;">NILELINK LEBANON \xB7 ${escapeHtml(freqLabel)}</div>
        <h1 style="margin:6px 0 0;font-size:20px;line-height:1.3;color:#F3EFE8;">${escapeHtml(
    locale === "ar" ? `\u0645\u0631\u062D\u0628\u0627\u064B ${opts.userName}` : `Hello ${opts.userName}`
  )}</h1>
      </div>
      ${htmlSections.join("\n")}
      <div style="padding:16px 24px;background:#17181B;font-size:11px;color:#9CA3AF;text-align:center;">
        <a href="${escapeHtml(prefsUrl)}" style="color:#C7C4BC;text-decoration:underline;">
          ${locale === "ar" ? "\u062A\u0639\u062F\u064A\u0644 \u062A\u0641\u0636\u064A\u0644\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0648\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A" : "Manage Email Digest & Notification Preferences"}
        </a>
      </div>
    </div>
  </body>
</html>`;
  return { subject, html, text: textSections.join("\n") };
}
async function sendNotificationSummaryForUser(db, userId, opts = {}) {
  const user = await db.queryOne(
    "SELECT id, name, email, preferred_locale, deleted_at, is_blocked FROM users WHERE id = ? LIMIT 1",
    [userId]
  );
  if (!user || user.deleted_at || user.is_blocked || !user.email) {
    return {
      ok: false,
      sentCount: 0,
      status: "empty",
      error: "Active user email not found.",
      previewSubject: "",
      previewText: "",
      lastSummarySentAt: null
    };
  }
  const prefRow = await db.queryOne("SELECT * FROM notification_preferences WHERE user_id = ?", [userId]);
  const frequency = prefRow?.summary_frequency || "daily";
  const emailEnabled = prefRow ? Boolean(prefRow.email_summary_enabled) : true;
  if (!opts.force && (!emailEnabled || frequency === "off")) {
    return {
      ok: true,
      sentCount: 0,
      status: "empty",
      previewSubject: "",
      previewText: "",
      lastSummarySentAt: prefRow?.last_summary_sent_at ? String(prefRow.last_summary_sent_at) : null
    };
  }
  let rows = [];
  if (opts.singleNotificationId) {
    rows = await db.query(
      "SELECT id, category, title_json, body_json, action_url, created_at FROM notifications WHERE id = ? AND user_id = ? LIMIT 1",
      [opts.singleNotificationId, userId]
    );
  } else {
    rows = await db.query(
      "SELECT id, category, title_json, body_json, action_url, created_at FROM notifications WHERE user_id = ? AND emailed_at IS NULL AND read_at IS NULL ORDER BY created_at DESC LIMIT 25",
      [userId]
    );
    if (rows.length === 0 && opts.force) {
      rows = await db.query(
        "SELECT id, category, title_json, body_json, action_url, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 15",
        [userId]
      );
    }
  }
  const allowOrder = prefRow ? Boolean(prefRow.order_updates) : true;
  const allowPriceDrop = prefRow ? Boolean(prefRow.price_drops) : true;
  const allowPromo = prefRow ? Boolean(prefRow.promotional_offers) : true;
  const entries = [];
  for (const r of rows) {
    const cat = r.category || "system";
    if (!opts.force) {
      if (cat === "order" && !allowOrder) continue;
      if (cat === "price_drop" && !allowPriceDrop) continue;
      if (cat === "promo" && !allowPromo) continue;
    }
    const tj = typeof r.title_json === "string" ? JSON.parse(r.title_json) : r.title_json;
    const bj = typeof r.body_json === "string" ? JSON.parse(r.body_json) : r.body_json;
    entries.push({
      id: r.id,
      category: cat,
      title: { en: String(tj?.en || ""), ar: String(tj?.ar || tj?.en || "") },
      body: { en: String(bj?.en || ""), ar: String(bj?.ar || bj?.en || "") },
      actionUrl: r.action_url ? String(r.action_url) : null,
      createdAt: String(r.created_at)
    });
  }
  if (entries.length === 0) {
    return {
      ok: true,
      sentCount: 0,
      status: "empty",
      previewSubject: "",
      previewText: "",
      lastSummarySentAt: prefRow?.last_summary_sent_at ? String(prefRow.last_summary_sent_at) : null
    };
  }
  const locale = user.preferred_locale === "ar" ? "ar" : "en";
  const rendered = renderNotificationSummaryEmail({
    userName: user.name,
    locale,
    frequency: opts.singleNotificationId ? "instant" : frequency,
    notifications: entries
  });
  const sendRes = await emailAdapter.send({
    to: user.email,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html
  });
  const status = sendRes.ok ? "sent" : emailAdapter.isConfigured() ? "failed" : "unconfigured";
  const now = toSqlTimestamp();
  await db.execute(
    "INSERT INTO email_log (id, recipient_email, template_key, status, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [
      `eml-${crypto3.randomUUID()}`,
      user.email,
      "notification_summary",
      status,
      sendRes.error || null,
      now
    ]
  );
  if (sendRes.ok || opts.force) {
    const placeholders = entries.map(() => "?").join(", ");
    await db.execute(`UPDATE notifications SET emailed_at = ? WHERE id IN (${placeholders})`, [
      now,
      ...entries.map((e) => e.id)
    ]);
    await db.execute(
      `INSERT INTO notification_preferences (user_id, email_summary_enabled, summary_frequency, order_updates, price_drops, promotional_offers, last_summary_sent_at, updated_at)
       VALUES (?, 1, ?, 1, 1, 1, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET last_summary_sent_at = excluded.last_summary_sent_at, updated_at = excluded.updated_at`,
      [userId, frequency, now, now]
    ).catch(async () => {
      await db.execute(
        `INSERT INTO notification_preferences (user_id, email_summary_enabled, summary_frequency, order_updates, price_drops, promotional_offers, last_summary_sent_at, updated_at)
         VALUES (?, 1, ?, 1, 1, 1, ?, ?)
         ON DUPLICATE KEY UPDATE last_summary_sent_at = VALUES(last_summary_sent_at), updated_at = VALUES(updated_at)`,
        [userId, frequency, now, now]
      );
    });
  }
  return {
    ok: sendRes.ok,
    sentCount: entries.length,
    status,
    error: sendRes.error,
    previewSubject: rendered.subject,
    previewText: rendered.text,
    lastSummarySentAt: now
  };
}
async function dispatchDueNotificationDigests(db) {
  const candidates = await db.query(
    `SELECT DISTINCT n.user_id
     FROM notifications n
     LEFT JOIN notification_preferences np ON np.user_id = n.user_id
     INNER JOIN users u ON u.id = n.user_id
     WHERE n.emailed_at IS NULL
       AND n.read_at IS NULL
       AND u.deleted_at IS NULL
       AND u.is_blocked = 0
       AND COALESCE(np.email_summary_enabled, 1) = 1
       AND COALESCE(np.summary_frequency, 'daily') IN ('daily', 'weekly')
     LIMIT 30`
  );
  let dispatched = 0;
  const nowMs = Date.now();
  for (const row of candidates) {
    const pref = await db.queryOne(
      "SELECT summary_frequency, last_summary_sent_at FROM notification_preferences WHERE user_id = ?",
      [row.user_id]
    );
    const freq = pref?.summary_frequency || "daily";
    const minAgeMs = freq === "weekly" ? 6.9 * 864e5 : 23 * 36e5;
    const lastMs = pref?.last_summary_sent_at ? Date.parse(pref.last_summary_sent_at) : 0;
    if (lastMs && nowMs - lastMs < minAgeMs) continue;
    const res = await sendNotificationSummaryForUser(db, row.user_id, { force: false });
    if (res.sentCount > 0) dispatched++;
  }
  return dispatched;
}
var SmtpEmailAdapter, emailAdapter, CATEGORY_LABELS;
var init_email = __esm({
  "server/services/email.ts"() {
    init_security();
    SmtpEmailAdapter = class {
      isConfigured() {
        const cfg = getSmtpConfig();
        return Boolean(cfg.host && cfg.user && cfg.pass);
      }
      async send(payload) {
        const cfg = getSmtpConfig();
        if (!this.isConfigured()) {
          return { ok: false, error: "Needs my input: configure SMTP_HOST, SMTP_USER, and SMTP_PASS." };
        }
        try {
          const transporter = nodemailer.createTransport({
            host: cfg.host,
            port: cfg.port,
            secure: cfg.port === 465,
            auth: { user: cfg.user, pass: cfg.pass }
          });
          await transporter.sendMail({
            from: cfg.from,
            to: payload.to,
            subject: payload.subject,
            text: payload.text,
            html: payload.html
          });
          return { ok: true };
        } catch (err) {
          return { ok: false, error: err.message };
        }
      }
    };
    emailAdapter = new SmtpEmailAdapter();
    CATEGORY_LABELS = {
      order: { en: "Order Status Updates", ar: "\u062A\u062D\u062F\u064A\u062B\u0627\u062A \u062D\u0627\u0644\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A", color: "#06B6D4" },
      price_drop: { en: "Wishlisted Price Drops", ar: "\u0627\u0646\u062E\u0641\u0627\u0636 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0645\u0641\u0636\u0644\u0629", color: "#65A30D" },
      promo: { en: "Promotional Offers", ar: "\u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A\u0629", color: "#EA580C" },
      system: { en: "Marketplace Updates", ar: "\u062A\u062D\u062F\u064A\u062B\u0627\u062A \u0627\u0644\u0645\u0646\u0635\u0629", color: "#D97706" }
    };
  }
});

// server/services/sms.ts
function getProviderConfig() {
  const provider = (process.env.SMS_PROVIDER || "").trim().toLowerCase();
  const apiKey = (process.env.SMS_API_KEY || "").trim();
  const senderId = (process.env.SMS_SENDER_ID || "NileLink").trim();
  const apiUrl = (process.env.SMS_API_URL || "").trim();
  return { provider, apiKey, senderId, apiUrl };
}
function isAllowedHttpsUrl(raw) {
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}
var ProductionSmsAdapter, smsAdapter;
var init_sms = __esm({
  "server/services/sms.ts"() {
    ProductionSmsAdapter = class {
      isConfigured() {
        const { provider, apiKey, apiUrl } = getProviderConfig();
        if (!provider || !apiKey) return false;
        if (provider === "twilio") {
          return apiKey.includes(":");
        }
        if (provider === "webhook" || provider === "http") {
          return isAllowedHttpsUrl(apiUrl);
        }
        return isAllowedHttpsUrl(apiUrl);
      }
      async sendOtp(phone, code, messageText) {
        const { provider, apiKey, senderId, apiUrl } = getProviderConfig();
        if (!provider || !apiKey) {
          return {
            sent: false,
            reason: "Configure SMS_PROVIDER and SMS_API_KEY in environment variables."
          };
        }
        const bodyText = messageText || `Your NileLink verification code is: ${code}. Valid for 10 minutes.`;
        try {
          if (provider === "twilio") {
            const sep = apiKey.indexOf(":");
            if (sep <= 0) {
              return { sent: false, reason: "Twilio SMS_API_KEY must be formatted as ACCOUNT_SID:AUTH_TOKEN." };
            }
            const accountSid = apiKey.slice(0, sep);
            const authToken = apiKey.slice(sep + 1);
            const form = new URLSearchParams({
              To: phone,
              From: senderId,
              Body: bodyText
            });
            const res2 = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`, {
              method: "POST",
              headers: {
                Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: form.toString(),
              signal: AbortSignal.timeout(8e3)
            });
            if (!res2.ok) {
              const errText = await res2.text().catch(() => "");
              return { sent: false, reason: `Twilio gateway error (${res2.status}): ${errText.slice(0, 160)}` };
            }
            return { sent: true };
          }
          if (!isAllowedHttpsUrl(apiUrl)) {
            return {
              sent: false,
              reason: "Configure an HTTPS SMS_API_URL endpoint for non-Twilio SMS providers."
            };
          }
          const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              to: phone,
              senderId,
              message: bodyText,
              code
            }),
            signal: AbortSignal.timeout(8e3)
          });
          if (!res.ok) {
            const errText = await res.text().catch(() => "");
            return { sent: false, reason: `SMS gateway error (${res.status}): ${errText.slice(0, 160)}` };
          }
          return { sent: true };
        } catch (err) {
          return { sent: false, reason: err.message || "SMS request failed." };
        }
      }
    };
    smsAdapter = new ProductionSmsAdapter();
  }
});

// server/services/currencyRate.ts
function parseUsdToLbpPayload(payload) {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload;
  let raw = void 0;
  if (obj.rates && typeof obj.rates === "object") {
    const rates = obj.rates;
    raw = rates.LBP ?? rates.lbp;
  } else if (obj.usd && typeof obj.usd === "object") {
    const usd = obj.usd;
    raw = usd.lbp ?? usd.LBP;
  } else if (typeof obj.rate === "number" || typeof obj.rate === "string") {
    raw = obj.rate;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return null;
  const rounded = Math.round(parsed);
  if (rounded < 1500 || rounded > 5e5) return null;
  return rounded;
}
async function fetchJsonWithTimeout(url, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}
async function fetchLiveLbpRate() {
  const customUrl = (process.env.FX_API_URL || "").trim();
  const candidates = [
    ...customUrl ? [{ url: customUrl, label: "custom-fx-api" }] : [],
    { url: "https://open.er-api.com/v6/latest/USD", label: "open.er-api.com" },
    {
      url: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
      label: "fawazahmed0/currency-api"
    }
  ];
  let lastError = "All FX providers unreachable";
  for (const provider of candidates) {
    try {
      const payload = await fetchJsonWithTimeout(provider.url);
      const rate = parseUsdToLbpPayload(payload);
      if (rate !== null) {
        return {
          rate,
          source: provider.label,
          fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      lastError = `${provider.label}: LBP rate missing or out of bounds`;
    } catch (err) {
      lastError = `${provider.label}: ${err.message}`;
    }
  }
  throw new Error(`Unable to fetch live LBP rate (${lastError})`);
}
async function syncDailyLbpRate(db, options = {}) {
  const kCol = db.driver === "mysql" ? "`key`" : "key";
  const row = await db.queryOne(`SELECT value_json FROM settings WHERE ${kCol} = 'platform'`);
  if (!row) {
    return { updated: false, skippedReason: "missing_settings", rate: 89500, source: "default", lastUpdatedAt: null };
  }
  let current;
  try {
    current = JSON.parse(row.value_json);
  } catch {
    return { updated: false, skippedReason: "invalid_settings_json", rate: 89500, source: "default", lastUpdatedAt: null };
  }
  const autoEnabled = current.fxAutoSyncEnabled !== false;
  if (!options.force && !autoEnabled) {
    return {
      updated: false,
      skippedReason: "auto_sync_disabled",
      rate: current.exchangeRateLbpPerUsd,
      source: current.fxSource || "manual",
      lastUpdatedAt: current.fxLastUpdatedAt || null
    };
  }
  const lastMs = current.fxLastUpdatedAt ? Date.parse(current.fxLastUpdatedAt) : 0;
  if (!options.force && lastMs > 0 && Date.now() - lastMs < DAY_MS) {
    return {
      updated: false,
      skippedReason: "fresh_within_24h",
      rate: current.exchangeRateLbpPerUsd,
      source: current.fxSource || "cached",
      lastUpdatedAt: current.fxLastUpdatedAt || null
    };
  }
  try {
    const live = await fetchLiveLbpRate();
    const nextSettings = {
      ...current,
      exchangeRateLbpPerUsd: live.rate,
      fxLastUpdatedAt: live.fetchedAt,
      fxSource: live.source,
      fxAutoSyncEnabled: autoEnabled
    };
    await db.execute(`UPDATE settings SET value_json = ?, updated_at = ? WHERE ${kCol} = 'platform'`, [
      JSON.stringify(nextSettings),
      toSqlTimestamp()
    ]);
    if (live.rate !== current.exchangeRateLbpPerUsd || options.force) {
      await writeAuditLog(db, {
        actorUserId: options.actorUserId || null,
        action: "fx.daily_sync",
        entityType: "settings",
        entityId: "platform",
        before: { exchangeRateLbpPerUsd: current.exchangeRateLbpPerUsd, fxSource: current.fxSource },
        after: { exchangeRateLbpPerUsd: live.rate, fxSource: live.source, fxLastUpdatedAt: live.fetchedAt },
        ipAddress: options.ipAddress
      });
    }
    return {
      updated: true,
      rate: live.rate,
      source: live.source,
      lastUpdatedAt: live.fetchedAt
    };
  } catch (err) {
    return {
      updated: false,
      skippedReason: err.message,
      rate: current.exchangeRateLbpPerUsd,
      source: current.fxSource || "fallback-cached",
      lastUpdatedAt: current.fxLastUpdatedAt || null
    };
  }
}
var DAY_MS, FETCH_TIMEOUT_MS;
var init_currencyRate = __esm({
  "server/services/currencyRate.ts"() {
    init_security();
    DAY_MS = 864e5;
    FETCH_TIMEOUT_MS = 6e3;
  }
});

// server/services/jobs.ts
import crypto4 from "node:crypto";
async function enqueueJob(db, jobType, payload, runAt = /* @__PURE__ */ new Date()) {
  const id = `job-${crypto4.randomUUID()}`;
  await db.execute(
    "INSERT INTO jobs (id, job_type, payload_json, status, attempts, run_at, created_at) VALUES (?, ?, ?, ?, 0, ?, ?)",
    [id, jobType, JSON.stringify(payload), "queued", toSqlTimestamp(runAt), toSqlTimestamp()]
  );
  return id;
}
async function releaseEligibleEscrowHolds(db) {
  const keyCol = db.driver === "mysql" ? "`key`" : "key";
  const platRow = await db.queryOne(
    `SELECT value_json FROM settings WHERE ${keyCol} = 'platform'`
  );
  const plat = platRow ? typeof platRow.value_json === "string" ? JSON.parse(platRow.value_json) : platRow.value_json : { holdPeriodDays: 3 };
  const holdDays = Number(plat?.holdPeriodDays ?? 3);
  const cutoff = toSqlTimestamp(new Date(Date.now() - holdDays * 864e5));
  return db.transaction(async (tx) => {
    const eligibleSubs = await tx.query(
      "SELECT id FROM sub_orders WHERE status = 'delivered' AND delivered_at IS NOT NULL AND delivered_at <= ?",
      [cutoff]
    );
    let released = 0;
    for (const sub of eligibleSubs) {
      const res = await tx.execute(
        "UPDATE ledger_entries SET availability = 'available' WHERE sub_order_id = ? AND availability = 'pending'",
        [sub.id]
      );
      released += res.affectedRows;
    }
    return released;
  });
}
async function publishDueHomePageSnapshots(db) {
  const now = toSqlTimestamp();
  const due = await db.query(
    "SELECT * FROM home_page_snapshots WHERE status = 'scheduled' AND scheduled_publish_at IS NOT NULL AND scheduled_publish_at <= ? ORDER BY scheduled_publish_at ASC",
    [now]
  );
  if (due.length === 0) return 0;
  const keyCol = db.driver === "mysql" ? "`key`" : "key";
  let publishedCount = 0;
  for (const snap of due) {
    await db.transaction(async (tx) => {
      const sectionsArr = typeof snap.sections_snapshot_json === "string" ? JSON.parse(snap.sections_snapshot_json) : snap.sections_snapshot_json || [];
      const chromeStr = typeof snap.chrome_snapshot_json === "string" ? snap.chrome_snapshot_json : JSON.stringify(snap.chrome_snapshot_json || {});
      await tx.execute("DELETE FROM home_sections");
      for (let i = 0; i < sectionsArr.length; i++) {
        const sr = sectionsArr[i];
        const sid = String(sr.id || `hs-${crypto4.randomUUID()}`);
        const statusVal = sr.status === "archived" ? "archived" : "published";
        await tx.execute(
          `INSERT INTO home_sections (id, section_type, title_json, content_json, sort_order, status, visible, audience, targeting_json, style_json, schedule_priority, starts_at, ends_at, version, updated_by_user_id, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            sid,
            mapLegacySectionType(String(sr.section_type || "rich_block")),
            typeof sr.title_json === "string" ? sr.title_json : JSON.stringify(sr.title_json || { en: "", ar: "" }),
            typeof sr.content_json === "string" ? sr.content_json : JSON.stringify(sr.content_json || {}),
            Number(sr.sort_order ?? (i + 1) * 10),
            statusVal,
            sr.visible === void 0 ? 1 : sr.visible ? 1 : 0,
            String(sr.audience || "all"),
            sr.targeting_json ? typeof sr.targeting_json === "string" ? sr.targeting_json : JSON.stringify(sr.targeting_json) : null,
            sr.style_json ? typeof sr.style_json === "string" ? sr.style_json : JSON.stringify(sr.style_json) : null,
            Number(sr.schedule_priority ?? 0),
            sr.starts_at ? String(sr.starts_at) : null,
            sr.ends_at ? String(sr.ends_at) : null,
            Number(sr.version ?? 1),
            snap.created_by_user_id ? String(snap.created_by_user_id) : null,
            now
          ]
        );
      }
      for (const settingKey of ["site_chrome_draft", "site_chrome_published"]) {
        await tx.execute(
          db.driver === "mysql" ? `INSERT INTO settings (${keyCol}, value_json, updated_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), updated_at = VALUES(updated_at)` : `INSERT INTO settings (${keyCol}, value_json, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`,
          [settingKey, chromeStr, now]
        );
      }
      await tx.execute("UPDATE home_page_snapshots SET status = 'published', published_at = ? WHERE id = ?", [
        now,
        String(snap.id)
      ]);
      await writeAuditLog(tx, {
        actorUserId: snap.created_by_user_id ? String(snap.created_by_user_id) : null,
        action: "cron.publish_scheduled_home",
        entityType: "home_page",
        entityId: String(snap.id),
        after: { version: Number(snap.version), sectionCount: sectionsArr.length }
      });
      publishedCount++;
    });
  }
  return publishedCount;
}
async function syncFlashSalesAndCampaigns(db) {
  const now = toSqlTimestamp();
  const actRes = await db.execute(
    "UPDATE flash_sales SET status = 'active' WHERE status = 'scheduled' AND starts_at <= ? AND ends_at > ?",
    [now, now]
  );
  const expiredFlash = await db.query(
    "SELECT id, slug FROM flash_sales WHERE status IN ('scheduled', 'active') AND ends_at <= ? AND auto_revert = 1",
    [now]
  );
  let endedFlashSales = 0;
  for (const fsRow of expiredFlash) {
    const res = await db.execute("UPDATE flash_sales SET status = 'ended' WHERE id = ?", [fsRow.id]);
    if (res.affectedRows > 0) {
      endedFlashSales += res.affectedRows;
      await writeAuditLog(db, {
        actorUserId: null,
        action: "cron.flash_sale_reverted",
        entityType: "flash_sale",
        entityId: fsRow.id,
        after: { slug: fsRow.slug, status: "ended", revertedAt: now }
      });
    }
  }
  const c1 = await db.execute(
    "UPDATE campaigns SET status = 'active' WHERE status = 'scheduled' AND starts_at IS NOT NULL AND starts_at <= ? AND (ends_at IS NULL OR ends_at > ?)",
    [now, now]
  );
  const c2 = await db.execute(
    "UPDATE campaigns SET status = 'ended' WHERE status IN ('scheduled', 'active') AND ends_at IS NOT NULL AND ends_at <= ?",
    [now]
  );
  return {
    activatedFlashSales: actRes.affectedRows,
    endedFlashSales,
    syncedCampaigns: c1.affectedRows + c2.affectedRows
  };
}
async function dispatchDueEmailCampaignsAndFlows(db) {
  const now = toSqlTimestamp();
  let campaignsDispatched = 0;
  let automationJobsQueued = 0;
  const dueCampaigns = await db.query(
    "SELECT * FROM email_campaigns WHERE status = 'scheduled' AND scheduled_at IS NOT NULL AND scheduled_at <= ?",
    [now]
  );
  if (dueCampaigns.length > 0) {
    const { MarketplaceRepo: MarketplaceRepo2 } = await Promise.resolve().then(() => (init_marketplaceRepo(), marketplaceRepo_exports));
    const repo = new MarketplaceRepo2(db);
    for (const cmp of dueCampaigns) {
      const queuedCount = await repo.enqueueEmailCampaignRecipients(String(cmp.id));
      if (queuedCount >= 0) campaignsDispatched++;
    }
  }
  const activeFlows = await db.query(
    "SELECT * FROM automation_flows WHERE active = 1"
  );
  for (const flow of activeFlows) {
    const flowId = String(flow.id);
    const triggerType = String(flow.trigger_type);
    const delayHours = Math.max(0, Number(flow.delay_hours ?? 0));
    const cutoffSql = toSqlTimestamp(new Date(Date.now() - delayHours * 36e5));
    const subjectJson = typeof flow.subject_json === "string" ? JSON.parse(flow.subject_json) : flow.subject_json;
    const blocks = typeof flow.blocks_json === "string" ? JSON.parse(flow.blocks_json) : flow.blocks_json;
    const attachCouponCode = flow.attach_coupon_code ? String(flow.attach_coupon_code) : null;
    const recordAndEnqueue = async (dedupKey, email, locale, unsubToken) => {
      const existing = await db.queryOne(
        "SELECT id FROM automation_executions WHERE flow_id = ? AND dedup_key = ?",
        [flowId, dedupKey]
      );
      if (existing) return;
      await db.execute(
        "INSERT INTO automation_executions (id, flow_id, dedup_key, recipient_email, created_at) VALUES (?, ?, ?, ?, ?)",
        [`aex-${crypto4.randomUUID()}`, flowId, dedupKey, email.toLowerCase(), now]
      );
      const payload = {
        flowId,
        to: email.toLowerCase(),
        locale,
        subject: subjectJson[locale] || subjectJson.en,
        blocks,
        attachCouponCode,
        unsubscribeToken: unsubToken || null
      };
      await enqueueJob(db, "send_marketing_email", payload);
      await db.execute(
        "UPDATE automation_flows SET total_triggered = total_triggered + 1, last_run_at = ? WHERE id = ?",
        [now, flowId]
      );
      automationJobsQueued++;
    };
    if (triggerType === "abandoned_cart") {
      const carts2 = await db.query(
        `SELECT c.id AS cart_id, c.user_id, c.updated_at, u.email, u.preferred_locale
         FROM carts c
         INNER JOIN users u ON u.id = c.user_id
         WHERE c.updated_at <= ?
           AND EXISTS (SELECT 1 FROM cart_items ci WHERE ci.cart_id = c.id)
           AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = c.user_id AND o.created_at >= c.updated_at)`,
        [cutoffSql]
      );
      for (const c of carts2) {
        const dedupKey = `cart:${c.cart_id}:${String(c.updated_at).slice(0, 16)}`;
        await recordAndEnqueue(dedupKey, c.email, c.preferred_locale === "ar" ? "ar" : "en");
      }
    } else if (triggerType === "post_purchase") {
      const minWindow = toSqlTimestamp(new Date(Date.now() - 14 * 864e5));
      const orders2 = await db.query(
        `SELECT o.id AS order_id, u.email, u.preferred_locale
         FROM orders o
         INNER JOIN users u ON u.id = o.user_id
         WHERE o.created_at <= ? AND o.created_at >= ?`,
        [cutoffSql, minWindow]
      );
      for (const o of orders2) {
        await recordAndEnqueue(`order:${o.order_id}`, o.email, o.preferred_locale === "ar" ? "ar" : "en");
      }
    } else if (triggerType === "winback_30d") {
      const daysAgo = Math.max(30, Math.round(delayHours / 24));
      const staleCutoff = toSqlTimestamp(new Date(Date.now() - daysAgo * 864e5));
      const monthBucket = now.slice(0, 7);
      const staleUsers = await db.query(
        `SELECT u.id, u.email, u.preferred_locale
         FROM users u
         WHERE u.role_key = 'customer' AND u.deleted_at IS NULL
           AND EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)
           AND NOT EXISTS (SELECT 1 FROM orders o2 WHERE o2.user_id = u.id AND o2.created_at > ?)`,
        [staleCutoff]
      );
      for (const u of staleUsers) {
        await recordAndEnqueue(`winback:${u.id}:${monthBucket}`, u.email, u.preferred_locale === "ar" ? "ar" : "en");
      }
    }
  }
  return { campaignsDispatched, automationJobsQueued };
}
async function processPendingJobs(db, limit = 20) {
  const autoDispatch = await dispatchDueEmailCampaignsAndFlows(db);
  const now = toSqlTimestamp();
  const safeLimit = Math.max(1, Math.min(100, Math.trunc(limit)));
  const queued = await db.query(
    `SELECT id, job_type, payload_json, attempts FROM jobs WHERE status = 'queued' AND run_at <= ? ORDER BY created_at ASC LIMIT ${safeLimit}`,
    [now]
  );
  let processed = 0;
  let failed = 0;
  for (const job of queued) {
    try {
      const payload = typeof job.payload_json === "string" ? JSON.parse(job.payload_json) : job.payload_json;
      if (job.job_type === "send_email") {
        await processEmailJob(db, payload);
      } else if (job.job_type === "send_marketing_email") {
        await processMarketingEmailJob(db, payload);
      } else if (job.job_type === "send_notification_summary") {
        await sendNotificationSummaryForUser(db, String(payload.userId || ""), {
          singleNotificationId: payload.notificationId ? String(payload.notificationId) : void 0
        });
      }
      await db.execute("UPDATE jobs SET status = 'completed', attempts = attempts + 1 WHERE id = ?", [job.id]);
      processed++;
    } catch (err) {
      failed++;
      const nextStatus = job.attempts + 1 >= 3 ? "failed" : "queued";
      await db.execute(
        "UPDATE jobs SET status = ?, attempts = attempts + 1, last_error = ? WHERE id = ?",
        [nextStatus, err.message.slice(0, 500), job.id]
      );
    }
  }
  const queuedCampaigns = await db.query("SELECT id FROM email_campaigns WHERE status = 'queued'");
  if (queuedCampaigns.length > 0) {
    const pendingJobs = await db.query(
      "SELECT payload_json FROM jobs WHERE job_type = 'send_marketing_email' AND status = 'queued'"
    );
    const activeCampaignIds = /* @__PURE__ */ new Set();
    for (const pj of pendingJobs) {
      const p = typeof pj.payload_json === "string" ? JSON.parse(pj.payload_json) : pj.payload_json;
      if (p?.campaignId) activeCampaignIds.add(String(p.campaignId));
    }
    for (const qc of queuedCampaigns) {
      if (!activeCampaignIds.has(qc.id)) {
        await db.execute("UPDATE email_campaigns SET status = 'sent', sent_at = COALESCE(sent_at, ?) WHERE id = ?", [
          now,
          qc.id
        ]);
      }
    }
  }
  const releasedHolds = await releaseEligibleEscrowHolds(db);
  const publishedHomeSnapshots = await publishDueHomePageSnapshots(db);
  const flashSync = await syncFlashSalesAndCampaigns(db);
  const fxSync = await syncDailyLbpRate(db);
  await dispatchDueNotificationDigests(db);
  const sessRes = await db.execute("DELETE FROM sessions WHERE expires_at <= ?", [now]);
  return {
    processed,
    failed,
    releasedHolds,
    cleanedSessions: sessRes.affectedRows,
    publishedHomeSnapshots,
    flashSalesEnded: flashSync.endedFlashSales,
    fxUpdated: fxSync.updated,
    campaignsDispatched: autoDispatch.campaignsDispatched,
    automationJobsQueued: autoDispatch.automationJobsQueued
  };
}
var init_jobs = __esm({
  "server/services/jobs.ts"() {
    init_homeSections();
    init_email();
    init_currencyRate();
    init_security();
  }
});

// server/db/marketplaceRepo.ts
var marketplaceRepo_exports = {};
__export(marketplaceRepo_exports, {
  MarketplaceRepo: () => MarketplaceRepo
});
import crypto5 from "node:crypto";
function parseJson(val, fallback) {
  if (val === null || val === void 0) return fallback;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val;
}
function normalizePhone(phone) {
  return phone.replace(/[^\d]/g, "").slice(-8);
}
var DEFAULT_SEO_METADATA, MarketplaceRepo;
var init_marketplaceRepo = __esm({
  "server/db/marketplaceRepo.ts"() {
    init_homeSections();
    init_offers();
    init_paymentAdapters();
    init_searchParser();
    init_security();
    init_email();
    init_sms();
    init_jobs();
    DEFAULT_SEO_METADATA = {
      global: {
        siteName: "NileLink",
        titleTemplate: "%s | NileLink Lebanon",
        canonicalBaseUrl: "",
        defaultTitle: {
          en: "NileLink \u2014 Lebanese Multi-Vendor Marketplace",
          ar: "\u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643 \u2014 \u0633\u0648\u0642 \u0627\u0644\u062A\u062C\u0627\u0631\u0629 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A"
        },
        defaultDescription: {
          en: "Curated Lebanese independent merchants, verified specifications, dual USD & LBP pricing, and split-seller nationwide delivery across Lebanon.",
          ar: "\u0645\u062A\u0627\u062C\u0631 \u0644\u0628\u0646\u0627\u0646\u064A\u0629 \u0645\u0633\u062A\u0642\u0644\u0629 \u0648\u0645\u0648\u062B\u0642\u0629\u060C \u0645\u0648\u0627\u0635\u0641\u0627\u062A \u0648\u0627\u0636\u062D\u0629\u060C \u062A\u0633\u0639\u064A\u0631 \u0628\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0648\u0627\u0644\u0644\u064A\u0631\u0629 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629\u060C \u0648\u062A\u0648\u0635\u064A\u0644 \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A."
        },
        defaultOgImageUrl: "/src/assets/images/hero_beirut_editorial_1795297173320.jpg",
        twitterCardType: "summary_large_image",
        twitterSiteHandle: "@nilelinklb",
        organizationJsonLd: {
          name: "NileLink Marketplace",
          logoUrl: "/src/assets/images/hero_beirut_editorial_1795297173320.jpg",
          contactPhone: "+961 1 555 010",
          contactEmail: "support@nilelink.lb",
          sameAs: []
        }
      },
      overrides: []
    };
    MarketplaceRepo = class {
      constructor(db) {
        this.db = db;
        this.publishedChromeCache = null;
        this.publishedHomeSectionsCache = null;
      }
      invalidateHomeCache() {
        this.publishedChromeCache = null;
        this.publishedHomeSectionsCache = null;
      }
      keyCol() {
        return this.db.driver === "mysql" ? "`key`" : "key";
      }
      // --- Settings & Config ---
      async getPlatformSettings() {
        const row = await this.db.queryOne(
          `SELECT value_json FROM settings WHERE ${this.keyCol()} = 'platform'`
        );
        const parsed = parseJson(row?.value_json, {
          siteName: "NileLink",
          exchangeRateLbpPerUsd: 89500,
          fxLastUpdatedAt: null,
          fxSource: "default",
          fxAutoSyncEnabled: true,
          defaultCommissionBps: 1e3,
          codFeeUsdCents: 150,
          holdPeriodDays: 3,
          maintenanceMode: false,
          announcement: { en: "", ar: "" }
        });
        return {
          fxAutoSyncEnabled: true,
          fxSource: "manual",
          fxLastUpdatedAt: null,
          ...parsed
        };
      }
      async getPaymentConfig() {
        const row = await this.db.queryOne(
          `SELECT value_json FROM settings WHERE ${this.keyCol()} = 'payments'`
        );
        const saved = parseJson(row?.value_json, {
          codEnabled: true,
          whishManualEnabled: true,
          whishAccountNumber: "",
          whishInstructions: { en: "", ar: "" },
          cardEnabled: false
        });
        const cardGatewayConfigured = isCardGatewayConfigured();
        return {
          codEnabled: Boolean(saved.codEnabled),
          whishManualEnabled: Boolean(saved.whishManualEnabled) && Boolean(saved.whishAccountNumber?.trim()),
          whishAccountNumber: saved.whishAccountNumber || "",
          whishInstructions: saved.whishInstructions || { en: "", ar: "" },
          cardEnabled: Boolean(saved.cardEnabled) && cardGatewayConfigured,
          cardGatewayConfigured
        };
      }
      async getCategories() {
        const rows = await this.db.query("SELECT id, parent_id, slug, department, name_json, commission_bps FROM categories WHERE active = 1 ORDER BY sort_order ASC");
        return rows.map((r) => ({
          id: r.id,
          parentId: r.parent_id,
          slug: r.slug,
          department: r.department,
          name: parseJson(r.name_json, { en: r.slug, ar: r.slug }),
          commissionBps: r.commission_bps
        }));
      }
      async getDeliveryZones() {
        const rows = await this.db.query("SELECT governorate_code, name_json, platform_fee_usd_cents, eta_days FROM delivery_zones");
        return rows.map((r) => ({
          governorateCode: r.governorate_code,
          name: parseJson(r.name_json, { en: r.governorate_code, ar: r.governorate_code }),
          platformFeeUsdCents: Number(r.platform_fee_usd_cents),
          etaDays: r.eta_days
        }));
      }
      async getSubscriptionPlans() {
        const rows = await this.db.query("SELECT tier, name_json, monthly_fee_usd_cents, product_limit, commission_discount_bps, features_json FROM subscription_plans ORDER BY monthly_fee_usd_cents ASC");
        return rows.map((r) => ({
          tier: r.tier,
          name: parseJson(r.name_json, { en: r.tier, ar: r.tier }),
          monthlyFeeUsdCents: Number(r.monthly_fee_usd_cents),
          productLimit: r.product_limit === null ? null : Number(r.product_limit),
          commissionDiscountBps: Number(r.commission_discount_bps),
          features: parseJson(r.features_json, [])
        }));
      }
      // --- First-Run Admin Setup & Auth ---
      async getAdminSetupStatus() {
        const adminRow = await this.db.queryOne(
          "SELECT COUNT(*) AS cnt FROM users WHERE role_key = 'admin_super' AND deleted_at IS NULL"
        );
        const hasSuperAdmin = Number(adminRow?.cnt ?? 0) > 0;
        const tokRow = await this.db.queryOne(
          `SELECT value_json FROM settings WHERE ${this.keyCol()} = 'admin_setup_token_hash'`
        );
        return { hasSuperAdmin, setupTokenPending: !hasSuperAdmin && Boolean(tokRow) };
      }
      async setupInitialAdmin(input) {
        const pwErr = validatePasswordStrength(input.password);
        if (pwErr) throw new Error(pwErr);
        return this.db.transaction(async (tx) => {
          const adminRow = await tx.queryOne(
            "SELECT COUNT(*) AS cnt FROM users WHERE role_key = 'admin_super' AND deleted_at IS NULL"
          );
          if (Number(adminRow?.cnt ?? 0) > 0) {
            throw new Error("Super admin is already configured. Sign in with your email, password, and 2FA code.");
          }
          const tokRow = await tx.queryOne(
            `SELECT value_json FROM settings WHERE ${this.keyCol()} = 'admin_setup_token_hash'`
          );
          if (!tokRow) {
            throw new Error("No pending admin setup token found.");
          }
          const parsed = parseJson(tokRow.value_json, { hash: "" });
          const submittedHash = sha256Hex(input.setupToken.trim());
          if (!parsed.hash || !timingSafeStringMatch(parsed.hash, submittedHash)) {
            throw new Error("Invalid one-time setup token. Check server startup logs.");
          }
          const emailNorm = input.email.trim().toLowerCase();
          const dup = await tx.queryOne("SELECT id FROM users WHERE LOWER(email) = ?", [emailNorm]);
          if (dup) throw new Error("Email is already registered.");
          const userId = `usr-${crypto5.randomUUID()}`;
          const totpSecret = generateTotpSecret();
          const now = toSqlTimestamp();
          await tx.execute(
            `INSERT INTO users (id, name, email, phone, password_hash, role_key, email_verified_at, totp_secret, totp_enabled, preferred_locale, preferred_currency, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'admin_super', ?, ?, 1, 'en', 'USD', ?, ?)`,
            [userId, input.name.trim(), emailNorm, input.phone.trim(), hashPassword(input.password), now, totpSecret, now, now]
          );
          await tx.execute(`DELETE FROM settings WHERE ${this.keyCol()} = 'admin_setup_token_hash'`);
          await writeAuditLog(tx, {
            actorUserId: userId,
            action: "admin.initial_setup",
            entityType: "user",
            entityId: userId,
            after: { email: emailNorm, roleKey: "admin_super", totpEnabled: true },
            ipAddress: input.ipAddress
          });
          return {
            userId,
            email: emailNorm,
            name: input.name.trim(),
            totpSecret,
            otpauthUri: buildOtpAuthUri(emailNorm, totpSecret)
          };
        });
      }
      async registerCustomer(input) {
        const pwErr = validatePasswordStrength(input.password);
        if (pwErr) throw new Error(pwErr);
        const emailNorm = input.email.trim().toLowerCase();
        const phoneNorm = normalizePhoneNumber(input.phone);
        if (!phoneNorm || phoneNorm.length < 7) {
          throw new Error("Please provide a valid Lebanese or international phone number.");
        }
        return this.db.transaction(async (tx) => {
          const dup = await tx.queryOne(
            "SELECT id FROM users WHERE LOWER(email) = ? AND deleted_at IS NULL",
            [emailNorm]
          );
          if (dup) throw new Error("An account with this email already exists.");
          const dupPhone = await tx.queryOne(
            "SELECT id FROM users WHERE phone = ? AND deleted_at IS NULL",
            [phoneNorm]
          );
          if (dupPhone) throw new Error("An account with this phone number already exists.");
          const id = `usr-${crypto5.randomUUID()}`;
          const now = toSqlTimestamp();
          const locale = input.locale === "ar" ? "ar" : "en";
          await tx.execute(
            `INSERT INTO users (id, name, email, phone, password_hash, role_key, preferred_locale, preferred_currency, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'customer', ?, 'USD', ?, ?)`,
            [id, input.name.trim(), emailNorm, phoneNorm, hashPassword(input.password), locale, now, now]
          );
          await queueEmail(tx, {
            to: emailNorm,
            templateKey: "welcome",
            locale,
            vars: { name: input.name.trim() }
          });
          await writeAuditLog(tx, {
            actorUserId: id,
            action: "auth.register_customer",
            entityType: "user",
            entityId: id,
            ipAddress: input.ipAddress
          });
          return {
            id,
            name: input.name.trim(),
            email: emailNorm,
            phone: phoneNorm,
            roleKey: "customer",
            emailVerifiedAt: null,
            phoneVerifiedAt: null,
            isFullyVerified: false
          };
        });
      }
      async findUserByIdentifier(identifier) {
        const clean = identifier.trim();
        if (!clean) return null;
        if (clean.includes("@")) {
          return this.db.queryOne("SELECT * FROM users WHERE LOWER(email) = ? AND deleted_at IS NULL LIMIT 1", [clean.toLowerCase()]);
        }
        const phoneNorm = normalizePhoneNumber(clean);
        const digitsTail = phoneNorm.replace(/[^\d]/g, "").slice(-8);
        return this.db.queryOne(
          `SELECT * FROM users
       WHERE deleted_at IS NULL
         AND (phone = ? OR phone = ? OR (? != '' AND REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+', '') LIKE ?))
       LIMIT 1`,
          [phoneNorm, clean, digitsTail, `%${digitsTail}`]
        );
      }
      async loginUser(input) {
        const rawId = (input.identifier || input.email || "").trim();
        if (!rawId) {
          throw new Error("Email or phone number is required.");
        }
        const row = await this.findUserByIdentifier(rawId);
        if (!row || row.deleted_at) {
          throw new Error("Invalid email/phone or password.");
        }
        if (row.is_blocked) {
          throw new Error("Account suspended. Contact NileLink support.");
        }
        const nowMs = Date.now();
        if (row.locked_until && (/* @__PURE__ */ new Date(row.locked_until.replace(" ", "T") + "Z")).getTime() > nowMs) {
          throw new Error("Too many failed sign-in attempts. Please wait 15 minutes before retrying.");
        }
        if (!verifyPassword(input.password, row.password_hash)) {
          const nextAttempts = Number(row.failed_login_attempts || 0) + 1;
          const lockedUntil = nextAttempts >= 5 ? toSqlTimestamp(new Date(nowMs + 15 * 6e4)) : null;
          await this.db.execute(
            "UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?",
            [nextAttempts, lockedUntil, row.id]
          );
          throw new Error("Invalid email/phone or password.");
        }
        const requiresTotp = row.role_key === "admin_super" || row.role_key === "admin_staff" || Boolean(row.totp_enabled);
        if (requiresTotp) {
          if (!row.totp_secret) {
            throw new Error("2FA secret is not enrolled on this privileged account.");
          }
          if (!input.totpCode || !verifyTotpCode(row.totp_secret, input.totpCode)) {
            throw new Error("Valid 6-digit 2FA authenticator code is required.");
          }
        }
        await this.db.execute(
          "UPDATE users SET failed_login_attempts = 0, locked_until = NULL, updated_at = ? WHERE id = ?",
          [toSqlTimestamp(), row.id]
        );
        return { id: row.id, name: row.name, email: row.email, roleKey: row.role_key };
      }
      async startTotpEnrollment(userId) {
        const user = await this.db.queryOne("SELECT email FROM users WHERE id = ?", [userId]);
        if (!user) throw new Error("User not found.");
        const secret = generateTotpSecret();
        await this.db.execute("UPDATE users SET totp_secret = ?, totp_enabled = 0 WHERE id = ?", [secret, userId]);
        return { secret, otpauthUri: buildOtpAuthUri(user.email, secret) };
      }
      async confirmTotpEnrollment(userId, code) {
        const user = await this.db.queryOne(
          "SELECT totp_secret FROM users WHERE id = ?",
          [userId]
        );
        if (!user?.totp_secret) throw new Error("Start 2FA enrollment first.");
        if (!verifyTotpCode(user.totp_secret, code)) {
          throw new Error("Invalid 6-digit authenticator code.");
        }
        await this.db.execute("UPDATE users SET totp_enabled = 1 WHERE id = ?", [userId]);
        return { totpEnabled: true };
      }
      async dispatchOtpChallenge(tx, input) {
        const code = String(crypto5.randomInt(1e5, 1e6));
        const now = toSqlTimestamp();
        const expiresAt = toSqlTimestamp(new Date(Date.now() + 10 * 6e4));
        const codeHash = hashOtpCode(input.userId, input.channel, input.purpose, code);
        await tx.execute(
          "UPDATE verification_codes SET consumed_at = ? WHERE user_id = ? AND channel = ? AND purpose = ? AND consumed_at IS NULL",
          [now, input.userId, input.channel, input.purpose]
        );
        await tx.execute(
          `INSERT INTO verification_codes (id, user_id, channel, target, purpose, code_hash, attempts, expires_at, consumed_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, NULL, ?)`,
          [`vcd-${crypto5.randomUUID()}`, input.userId, input.channel, input.target, input.purpose, codeHash, expiresAt, now]
        );
        let deliveryConfigured = false;
        if (input.channel === "email") {
          deliveryConfigured = emailAdapter.isConfigured();
          const isReset = input.purpose === "password_reset_otp";
          const subject = input.locale === "ar" ? isReset ? `\u0631\u0645\u0632 \u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0641\u064A \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643: ${code}` : `\u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u062E\u0627\u0635 \u0628\u0643 \u0641\u064A \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643: ${code}` : isReset ? `Your NileLink password reset code: ${code}` : `Your NileLink verification code: ${code}`;
          const text2 = input.locale === "ar" ? isReset ? `\u0645\u0631\u062D\u0628\u0627\u064B ${input.userName}\u060C
\u0631\u0645\u0632 \u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062E\u0627\u0635 \u0628\u0643 \u0647\u0648: ${code}
\u0635\u0627\u0644\u062D \u0644\u0645\u062F\u0629 10 \u062F\u0642\u0627\u0626\u0642. \u0644\u0627 \u062A\u0634\u0627\u0631\u0643 \u0647\u0630\u0627 \u0627\u0644\u0631\u0645\u0632 \u0645\u0639 \u0623\u064A \u0634\u062E\u0635.` : `\u0645\u0631\u062D\u0628\u0627\u064B ${input.userName}\u060C
\u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u062E\u0627\u0635 \u0628\u0643 \u0647\u0648: ${code}
\u0635\u0627\u0644\u062D \u0644\u0645\u062F\u0629 10 \u062F\u0642\u0627\u0626\u0642.` : isReset ? `Hello ${input.userName},
Your NileLink password reset verification code is: ${code}
It expires in 10 minutes. Never share this code.` : `Hello ${input.userName},
Your NileLink verification code is: ${code}
It expires in 10 minutes.`;
          const sent = deliveryConfigured ? await emailAdapter.send({ to: input.target, subject, text: text2 }) : { ok: false };
          const templateKey = input.purpose === "login_otp" ? "otp_login" : input.purpose === "password_reset_otp" ? "password_reset_otp" : "otp_verify";
          await tx.execute(
            "INSERT INTO email_log (id, recipient_email, template_key, status, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            [
              `eml-${crypto5.randomUUID()}`,
              input.target,
              templateKey,
              sent.ok ? "sent" : "queued_preview",
              sent.ok ? null : "SMTP not configured",
              now
            ]
          );
        } else {
          deliveryConfigured = smsAdapter.isConfigured();
          if (deliveryConfigured) {
            const smsText = input.purpose === "password_reset_otp" ? `NileLink password reset code: ${code}. Valid for 10 minutes.` : `NileLink verification code: ${code}. Valid for 10 minutes.`;
            await smsAdapter.sendOtp(input.target, code, smsText);
          }
        }
        return { code, deliveryConfigured };
      }
      async requestAuthVerificationOtp(userId, input, ipAddress) {
        const user = await this.db.queryOne("SELECT id, name, email, phone, preferred_locale FROM users WHERE id = ? AND deleted_at IS NULL", [userId]);
        if (!user) throw new Error("User not found.");
        const locale = user.preferred_locale === "ar" ? "ar" : "en";
        let target = input.channel === "email" ? user.email : user.phone;
        if (input.target && input.target.trim()) {
          if (input.channel === "email") {
            const cleanEmail = input.target.trim().toLowerCase();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
              throw new Error("Invalid email address format.");
            }
            if (cleanEmail !== user.email.toLowerCase()) {
              const dup = await this.db.queryOne(
                "SELECT id FROM users WHERE LOWER(email) = ? AND id != ? AND deleted_at IS NULL",
                [cleanEmail, userId]
              );
              if (dup) throw new Error("This email address is already linked to another account.");
              await this.db.execute(
                "UPDATE users SET email = ?, email_verified_at = NULL, updated_at = ? WHERE id = ?",
                [cleanEmail, toSqlTimestamp(), userId]
              );
            }
            target = cleanEmail;
          } else {
            const normPhone = normalizePhoneNumber(input.target);
            if (!normPhone || normPhone.length < 7) {
              throw new Error("Invalid phone number format.");
            }
            if (normPhone !== user.phone) {
              const dup = await this.db.queryOne(
                "SELECT id FROM users WHERE phone = ? AND id != ? AND deleted_at IS NULL",
                [normPhone, userId]
              );
              if (dup) throw new Error("This phone number is already linked to another account.");
              await this.db.execute(
                "UPDATE users SET phone = ?, phone_verified_at = NULL, updated_at = ? WHERE id = ?",
                [normPhone, toSqlTimestamp(), userId]
              );
            }
            target = normPhone;
          }
        }
        if (!target) {
          throw new Error(`No ${input.channel} is configured on this account.`);
        }
        const dispatched = await this.db.transaction(async (tx) => {
          const res = await this.dispatchOtpChallenge(tx, {
            userId: user.id,
            userName: user.name,
            channel: input.channel,
            target,
            purpose: "verify_contact",
            locale
          });
          await writeAuditLog(tx, {
            actorUserId: user.id,
            action: `auth.verification_otp_sent.${input.channel}`,
            entityType: "user",
            entityId: user.id,
            after: { target },
            ipAddress
          });
          return res;
        });
        const isDevOrTest = process.env.NODE_ENV !== "production";
        return {
          ok: true,
          channel: input.channel,
          target,
          deliveryConfigured: dispatched.deliveryConfigured,
          expiresInSeconds: 600,
          ...isDevOrTest && !dispatched.deliveryConfigured ? { devOtpCode: dispatched.code } : {}
        };
      }
      async confirmAuthVerificationOtp(userId, input, ipAddress) {
        const cleanCode = input.code.replace(/\s+/g, "");
        if (!/^\d{6}$/.test(cleanCode)) {
          throw new Error("Please enter the 6-digit verification code.");
        }
        const now = toSqlTimestamp();
        const txRes = await this.db.transaction(async (tx) => {
          const challenge = await tx.queryOne(
            `SELECT id, target, code_hash, attempts, expires_at
         FROM verification_codes
         WHERE user_id = ? AND channel = ? AND purpose = 'verify_contact' AND consumed_at IS NULL
         ORDER BY created_at DESC LIMIT 1`,
            [userId, input.channel]
          );
          if (!challenge || String(challenge.expires_at) <= now) {
            throw new Error("Verification code expired or not found. Request a new code.");
          }
          if (Number(challenge.attempts) >= 5) {
            throw new Error("Too many invalid verification attempts. Please request a new code.");
          }
          const submittedHash = hashOtpCode(userId, input.channel, "verify_contact", cleanCode);
          if (!timingSafeStringMatch(challenge.code_hash, submittedHash)) {
            await tx.execute("UPDATE verification_codes SET attempts = attempts + 1 WHERE id = ?", [challenge.id]);
            return { failed: true, message: "Invalid 6-digit verification code." };
          }
          await tx.execute("UPDATE verification_codes SET consumed_at = ? WHERE id = ?", [now, challenge.id]);
          if (input.channel === "email") {
            await tx.execute("UPDATE users SET email_verified_at = ?, updated_at = ? WHERE id = ?", [now, now, userId]);
          } else {
            await tx.execute("UPDATE users SET phone_verified_at = ?, updated_at = ? WHERE id = ?", [now, now, userId]);
          }
          await writeAuditLog(tx, {
            actorUserId: userId,
            action: `auth.verification_confirmed.${input.channel}`,
            entityType: "user",
            entityId: userId,
            after: { target: challenge.target },
            ipAddress
          });
          const updated = await tx.queryOne(
            "SELECT email_verified_at, phone_verified_at FROM users WHERE id = ?",
            [userId]
          );
          const emailVerifiedAt = updated?.email_verified_at ? String(updated.email_verified_at) : null;
          const phoneVerifiedAt = updated?.phone_verified_at ? String(updated.phone_verified_at) : null;
          return {
            failed: false,
            data: {
              ok: true,
              channel: input.channel,
              emailVerifiedAt,
              phoneVerifiedAt,
              isFullyVerified: Boolean(emailVerifiedAt && phoneVerifiedAt)
            }
          };
        });
        if (txRes.failed) {
          throw new Error(txRes.message);
        }
        return txRes.data;
      }
      async requestLoginOtp(identifier, ipAddress) {
        const clean = identifier.trim();
        const channel = clean.includes("@") ? "email" : "phone";
        const user = await this.findUserByIdentifier(clean);
        if (!user || user.deleted_at || user.is_blocked) {
          return { ok: true, channel, deliveryConfigured: true, expiresInSeconds: 600 };
        }
        const target = channel === "email" ? user.email : user.phone;
        const locale = user.preferred_locale === "ar" ? "ar" : "en";
        const dispatched = await this.db.transaction(async (tx) => {
          const res = await this.dispatchOtpChallenge(tx, {
            userId: user.id,
            userName: user.name,
            channel,
            target,
            purpose: "login_otp",
            locale
          });
          await writeAuditLog(tx, {
            actorUserId: user.id,
            action: `auth.login_otp_requested.${channel}`,
            entityType: "user",
            entityId: user.id,
            ipAddress
          });
          return res;
        });
        const isDevOrTest = process.env.NODE_ENV !== "production";
        return {
          ok: true,
          channel,
          deliveryConfigured: dispatched.deliveryConfigured,
          expiresInSeconds: 600,
          ...isDevOrTest && !dispatched.deliveryConfigured ? { devOtpCode: dispatched.code } : {}
        };
      }
      async verifyLoginOtp(input, ipAddress) {
        const clean = input.identifier.trim();
        const cleanCode = input.code.replace(/\s+/g, "");
        if (!/^\d{6}$/.test(cleanCode)) {
          throw new Error("Please enter the 6-digit OTP code.");
        }
        const user = await this.findUserByIdentifier(clean);
        if (!user || user.deleted_at) {
          throw new Error("Invalid credentials or expired OTP code.");
        }
        if (user.is_blocked) {
          throw new Error("Account suspended. Contact NileLink support.");
        }
        const nowMs = Date.now();
        if (user.locked_until && (/* @__PURE__ */ new Date(user.locked_until.replace(" ", "T") + "Z")).getTime() > nowMs) {
          throw new Error("Too many failed sign-in attempts. Please wait 15 minutes before retrying.");
        }
        const channel = clean.includes("@") ? "email" : "phone";
        const now = toSqlTimestamp();
        const requiresTotp = user.role_key === "admin_super" || user.role_key === "admin_staff" || Boolean(user.totp_enabled);
        if (requiresTotp) {
          if (!user.totp_secret || !input.totpCode || !verifyTotpCode(user.totp_secret, input.totpCode)) {
            throw new Error("Valid 6-digit 2FA authenticator code is required for this account.");
          }
        }
        const txRes = await this.db.transaction(async (tx) => {
          const challenge = await tx.queryOne(
            `SELECT id, code_hash, attempts, expires_at
         FROM verification_codes
         WHERE user_id = ? AND channel = ? AND purpose = 'login_otp' AND consumed_at IS NULL
         ORDER BY created_at DESC LIMIT 1`,
            [user.id, channel]
          );
          if (!challenge || String(challenge.expires_at) <= now) {
            throw new Error("Invalid credentials or expired OTP code.");
          }
          if (Number(challenge.attempts) >= 5) {
            throw new Error("Too many failed OTP attempts. Please request a new code.");
          }
          const submittedHash = hashOtpCode(user.id, channel, "login_otp", cleanCode);
          if (!timingSafeStringMatch(challenge.code_hash, submittedHash)) {
            await tx.execute("UPDATE verification_codes SET attempts = attempts + 1 WHERE id = ?", [challenge.id]);
            return { failed: true, message: "Invalid credentials or expired OTP code." };
          }
          await tx.execute("UPDATE verification_codes SET consumed_at = ? WHERE id = ?", [now, challenge.id]);
          if (channel === "email" && !user.email_verified_at) {
            await tx.execute(
              "UPDATE users SET email_verified_at = ?, failed_login_attempts = 0, locked_until = NULL, updated_at = ? WHERE id = ?",
              [now, now, user.id]
            );
          } else if (channel === "phone" && !user.phone_verified_at) {
            await tx.execute(
              "UPDATE users SET phone_verified_at = ?, failed_login_attempts = 0, locked_until = NULL, updated_at = ? WHERE id = ?",
              [now, now, user.id]
            );
          } else {
            await tx.execute(
              "UPDATE users SET failed_login_attempts = 0, locked_until = NULL, updated_at = ? WHERE id = ?",
              [now, user.id]
            );
          }
          await writeAuditLog(tx, {
            actorUserId: user.id,
            action: `auth.login_otp_verified.${channel}`,
            entityType: "user",
            entityId: user.id,
            ipAddress
          });
          return {
            failed: false,
            user: { id: user.id, name: user.name, email: user.email, roleKey: user.role_key }
          };
        });
        if (txRes.failed) {
          throw new Error(txRes.message);
        }
        return txRes.user;
      }
      async createAdminStaff(input) {
        const pwErr = validatePasswordStrength(input.password);
        if (pwErr) throw new Error(pwErr);
        const emailNorm = input.email.trim().toLowerCase();
        return this.db.transaction(async (tx) => {
          const dup = await tx.queryOne("SELECT id FROM users WHERE LOWER(email) = ?", [emailNorm]);
          if (dup) throw new Error("Email already registered.");
          const id = `usr-${crypto5.randomUUID()}`;
          const totpSecret = generateTotpSecret();
          const now = toSqlTimestamp();
          await tx.execute(
            `INSERT INTO users (id, name, email, phone, password_hash, role_key, email_verified_at, totp_secret, totp_enabled, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'admin_staff', ?, ?, 1, ?, ?)`,
            [id, input.name.trim(), emailNorm, input.phone.trim(), hashPassword(input.password), now, totpSecret, now, now]
          );
          for (const perm of input.permissions) {
            await tx.execute(
              "INSERT INTO user_permissions (id, user_id, permission_key) VALUES (?, ?, ?)",
              [`up-${crypto5.randomUUID()}`, id, perm]
            );
          }
          await writeAuditLog(tx, {
            actorUserId: input.actorUserId,
            action: "admin.create_staff",
            entityType: "user",
            entityId: id,
            after: { email: emailNorm, permissions: input.permissions },
            ipAddress: input.ipAddress
          });
          return { id, email: emailNorm, name: input.name.trim(), totpSecret, otpauthUri: buildOtpAuthUri(emailNorm, totpSecret) };
        });
      }
      // --- Sellers & Stores Mapping ---
      async mapSellerRow(row, tx = this.db) {
        const bannerMedia = row.banner_media_id ? await tx.queryOne("SELECT public_url FROM media WHERE id = ?", [row.banner_media_id]) : null;
        const logoMedia = row.logo_media_id ? await tx.queryOne("SELECT public_url FROM media WHERE id = ?", [row.logo_media_id]) : null;
        const subRow = await tx.queryOne(
          "SELECT plan_tier, status, next_due_at FROM subscriptions WHERE seller_id = ? ORDER BY created_at DESC LIMIT 1",
          [row.id]
        );
        const socialRaw = row.social_links_json ? parseJson(row.social_links_json, {}) : {};
        const storedComm = socialRaw?.communicationPrefs || null;
        const whatsappPhoneVal = String(row.whatsapp_phone || row.phone || "");
        const phoneVal = row.phone ? String(row.phone) : String(row.whatsapp_phone || "");
        const communicationPrefs = {
          whatsappEnabled: storedComm?.whatsappEnabled !== void 0 ? Boolean(storedComm.whatsappEnabled) : Boolean(whatsappPhoneVal),
          whatsappGreeting: typeof storedComm?.whatsappGreeting === "string" ? storedComm.whatsappGreeting : "",
          systemChatEnabled: storedComm?.systemChatEnabled !== void 0 ? Boolean(storedComm.systemChatEnabled) : true,
          phoneCallsEnabled: storedComm?.phoneCallsEnabled !== void 0 ? Boolean(storedComm.phoneCallsEnabled) : Boolean(phoneVal),
          preferredChannel: storedComm?.preferredChannel === "system_chat" || storedComm?.preferredChannel === "phone" ? storedComm.preferredChannel : "whatsapp"
        };
        return {
          id: String(row.id),
          slug: String(row.slug),
          userId: String(row.owner_user_id),
          name: parseJson(row.name_json, { en: String(row.legal_name), ar: String(row.legal_name) }),
          tagline: parseJson(row.tagline_json, { en: "", ar: "" }),
          about: parseJson(row.about_json, { en: "", ar: "" }),
          department: String(row.department_slug),
          status: String(row.status),
          statusReason: row.status_reason ? String(row.status_reason) : null,
          verified: Boolean(row.verified),
          rating: Number(row.rating_avg_x10 || 0) / 10,
          reviewCount: Number(row.review_count || 0),
          governorate: String(row.governorate),
          district: String(row.district),
          cityAddress: String(row.city_address || ""),
          phone: phoneVal,
          whatsappPhone: whatsappPhoneVal,
          communicationPrefs,
          payoutMethod: String(row.payout_method || "whish"),
          payoutAccount: String(row.payout_account || ""),
          commercialRegRef: String(row.commercial_reg_ref || ""),
          customCommissionBps: row.custom_commission_bps !== null && row.custom_commission_bps !== void 0 ? Number(row.custom_commission_bps) : null,
          subscriptionTier: subRow?.plan_tier || "free",
          subscriptionStatus: subRow?.status || "active",
          subscriptionNextDue: subRow?.next_due_at || toSqlTimestamp(),
          deliveryMode: String(row.delivery_mode || "platform"),
          selfDeliveryFeesUsdCents: parseJson(row.self_delivery_fees_json, {}),
          storefrontTheme: String(row.theme_id || "obsidian-ember"),
          announcement: row.announcement_json ? parseJson(row.announcement_json, null) : null,
          bannerImage: bannerMedia?.public_url || "/src/assets/images/hero_beirut_editorial_1795297173320.jpg",
          logoImage: logoMedia?.public_url || null,
          returnPolicy: row.return_policy_json ? parseJson(row.return_policy_json, null) : null,
          processingHours: row.processing_hours !== null && row.processing_hours !== void 0 ? Number(row.processing_hours) : 24,
          vacationMode: Boolean(row.vacation_mode),
          workingHours: row.working_hours_json ? parseJson(row.working_hours_json, null) : null,
          seoTitle: row.seo_title ? String(row.seo_title) : null,
          seoDescription: row.seo_description ? String(row.seo_description) : null,
          locations: row.locations_json ? parseJson(row.locations_json, []) : [],
          createdAt: String(row.created_at)
        };
      }
      async mapProductRows(rows, tx = this.db) {
        const out = [];
        for (const r of rows) {
          const variants = await tx.query("SELECT id, sku, size, color, color_hex, stock, price_delta_usd_cents FROM product_variants WHERE product_id = ?", [
            r.id
          ]);
          const mediaRows = await tx.query(
            "SELECT public_url FROM media WHERE entity_type = 'product_image' AND entity_id = ? ORDER BY created_at ASC",
            [r.id]
          );
          out.push({
            id: String(r.id),
            slug: String(r.slug),
            sellerId: String(r.seller_id),
            categoryId: String(r.category_id),
            brandId: r.brand_id ? String(r.brand_id) : null,
            department: String(r.department),
            title: parseJson(r.title_json, { en: "", ar: "" }),
            subtitle: parseJson(r.subtitle_json, { en: "", ar: "" }),
            description: parseJson(r.description_json, { en: "", ar: "" }),
            basePriceUsdCents: Number(r.base_price_usd_cents),
            compareAtUsdCents: r.compare_at_usd_cents !== null && r.compare_at_usd_cents !== void 0 ? Number(r.compare_at_usd_cents) : null,
            sellerCurrency: String(r.seller_currency || "USD"),
            images: mediaRows.map((m) => m.public_url),
            model3dUrl: r.model_3d_url ? String(r.model_3d_url) : null,
            rating: Number(r.rating_avg_x10 || 0) / 10,
            reviewCount: Number(r.review_count || 0),
            isDeal: Boolean(r.compare_at_usd_cents && Number(r.compare_at_usd_cents) > Number(r.base_price_usd_cents)),
            isFeatured: Boolean(r.featured),
            published: Boolean(r.published),
            moderationStatus: String(r.moderation_status || "pending"),
            variants: variants.map((v) => ({
              id: v.id,
              sku: v.sku,
              size: v.size || void 0,
              color: v.color,
              colorHex: v.color_hex,
              stock: Number(v.stock),
              priceDeltaUsdCents: Number(v.price_delta_usd_cents)
            })),
            specs: parseJson(r.specs_json, []),
            tags: [],
            createdAt: String(r.created_at)
          });
        }
        return out;
      }
      async getPublicSellers() {
        const rows = await this.db.query(
          `SELECT sel.*, st.slug, st.name_json, st.tagline_json, st.about_json, st.announcement_json,
              st.department_slug, st.theme_id, st.logo_media_id, st.banner_media_id, st.locations_json, st.rating_avg_x10, st.review_count,
              ss.delivery_mode, ss.self_delivery_fees_json, ss.processing_hours, ss.vacation_mode, ss.working_hours_json, ss.return_policy_json, ss.social_links_json, ss.seo_title, ss.seo_description
       FROM sellers sel
       INNER JOIN stores st ON st.seller_id = sel.id
       LEFT JOIN store_settings ss ON ss.store_id = st.id
       WHERE sel.status = 'approved' AND sel.deleted_at IS NULL
       ORDER BY sel.created_at DESC`
        );
        const list = [];
        for (const r of rows) list.push(await this.mapSellerRow(r));
        return list;
      }
      async getSellerById(sellerId) {
        const row = await this.db.queryOne(
          `SELECT sel.*, st.slug, st.name_json, st.tagline_json, st.about_json, st.announcement_json,
              st.department_slug, st.theme_id, st.logo_media_id, st.banner_media_id, st.locations_json, st.rating_avg_x10, st.review_count,
              ss.delivery_mode, ss.self_delivery_fees_json, ss.processing_hours, ss.vacation_mode, ss.working_hours_json, ss.return_policy_json, ss.social_links_json, ss.seo_title, ss.seo_description
       FROM sellers sel
       INNER JOIN stores st ON st.seller_id = sel.id
       LEFT JOIN store_settings ss ON ss.store_id = st.id
       WHERE sel.id = ? AND sel.deleted_at IS NULL LIMIT 1`,
          [sellerId]
        );
        return row ? this.mapSellerRow(row) : null;
      }
      async getSellerBySlug(slug) {
        const row = await this.db.queryOne(
          `SELECT sel.*, st.slug, st.name_json, st.tagline_json, st.about_json, st.announcement_json,
              st.department_slug, st.theme_id, st.logo_media_id, st.banner_media_id, st.locations_json, st.rating_avg_x10, st.review_count,
              ss.delivery_mode, ss.self_delivery_fees_json, ss.processing_hours, ss.vacation_mode, ss.working_hours_json, ss.return_policy_json, ss.social_links_json, ss.seo_title, ss.seo_description
       FROM sellers sel
       INNER JOIN stores st ON st.seller_id = sel.id
       LEFT JOIN store_settings ss ON ss.store_id = st.id
       WHERE st.slug = ? AND sel.deleted_at IS NULL LIMIT 1`,
          [slug]
        );
        return row ? this.mapSellerRow(row) : null;
      }
      async getPublicProducts() {
        const rows = await this.db.query(
          `SELECT p.*
       FROM products p
       INNER JOIN sellers sel ON sel.id = p.seller_id
       WHERE p.published = 1 AND p.moderation_status = 'approved' AND p.deleted_at IS NULL AND sel.status = 'approved' AND sel.deleted_at IS NULL
       ORDER BY p.created_at DESC`
        );
        return this.mapProductRows(rows);
      }
      async searchPublicProducts(filters) {
        const q = (filters.q || "").trim();
        const parsed = q ? parseNaturalQuery(q) : null;
        const [allProducts, activeOffers] = await Promise.all([this.getPublicProducts(), this.getActiveOffers()]);
        let results = allProducts;
        const effPrice = (p) => resolveUnitOfferPrice(p.basePriceUsdCents, p, activeOffers).effectiveUsdCents;
        const effDept = filters.department || parsed?.department;
        if (effDept) results = results.filter((p) => p.department === effDept);
        if (filters.sellerId) results = results.filter((p) => p.sellerId === filters.sellerId);
        if (filters.dealsOnly) {
          results = results.filter(
            (p) => Boolean(p.isDeal) || resolveUnitOfferPrice(p.basePriceUsdCents, p, activeOffers).appliedOffer !== null
          );
        }
        const effMax = filters.maxPrice ?? parsed?.maxPriceUsdCents;
        if (effMax !== void 0 && !Number.isNaN(effMax)) {
          results = results.filter((p) => effPrice(p) <= effMax);
        }
        if (parsed?.minPriceUsdCents !== void 0) {
          results = results.filter((p) => effPrice(p) >= parsed.minPriceUsdCents);
        }
        if (filters.minRating !== void 0 && !Number.isNaN(filters.minRating)) {
          results = results.filter((p) => p.rating >= filters.minRating);
        }
        if (filters.inStockOnly || parsed?.inStockOnly) {
          results = results.filter((p) => p.variants.some((v) => v.stock > 0));
        }
        if (parsed?.size) {
          results = results.filter(
            (p) => p.variants.some((v) => (v.size || "").toUpperCase() === parsed.size)
          );
        }
        if (parsed?.color) {
          results = results.filter(
            (p) => p.variants.some((v) => v.color.toLowerCase().includes(parsed.color.toLowerCase()))
          );
        }
        if (parsed && parsed.keywords.length > 0) {
          results = results.filter((p) => {
            const haystack = `${p.title.en} ${p.title.ar} ${p.subtitle.en} ${p.subtitle.ar} ${p.description.en}`.toLowerCase();
            return parsed.keywords.every((kw) => haystack.includes(kw));
          });
        }
        if (filters.sort === "price_asc") results = [...results].sort((a, b) => effPrice(a) - effPrice(b));
        if (filters.sort === "price_desc") results = [...results].sort((a, b) => effPrice(b) - effPrice(a));
        if (filters.sort === "rating") results = [...results].sort((a, b) => b.rating - a.rating);
        return { products: results, parsedQuery: parsed };
      }
      async getProductDetail(slugOrId) {
        const row = await this.db.queryOne(
          `SELECT p.* FROM products p
       INNER JOIN sellers sel ON sel.id = p.seller_id
       WHERE (p.slug = ? OR p.id = ?) AND p.published = 1 AND p.moderation_status = 'approved' AND p.deleted_at IS NULL AND sel.status = 'approved'
       LIMIT 1`,
          [slugOrId, slugOrId]
        );
        if (!row) return null;
        const [product] = await this.mapProductRows([row]);
        const seller = await this.getSellerById(product.sellerId);
        const reviews2 = await this.getReviewsForProduct(product.id);
        return { product, seller, reviews: reviews2 };
      }
      async getStorefrontDetail(slug) {
        const seller = await this.getSellerBySlug(slug);
        if (!seller || seller.status !== "approved") return null;
        const rows = await this.db.query(
          "SELECT * FROM products WHERE seller_id = ? AND published = 1 AND moderation_status = 'approved' AND deleted_at IS NULL ORDER BY created_at DESC",
          [seller.id]
        );
        const products2 = await this.mapProductRows(rows);
        const reviews2 = await this.getReviewsForSeller(seller.id);
        return { seller, products: products2, reviews: reviews2 };
      }
      async getReviewsForProduct(productId) {
        const rows = await this.db.query(
          `SELECT r.*, u.name AS author_name
       FROM reviews r
       INNER JOIN users u ON u.id = r.user_id
       WHERE r.product_id = ? AND r.moderation_status = 'approved'
       ORDER BY r.created_at DESC`,
          [productId]
        );
        return rows.map((r) => ({
          id: r.id,
          productId: r.product_id,
          sellerId: r.seller_id,
          userId: r.user_id,
          authorName: r.author_name,
          rating: Number(r.rating),
          comment: r.comment,
          verifiedBuyer: Boolean(r.verified_buyer),
          sellerReply: r.seller_reply || void 0,
          createdAt: String(r.created_at)
        }));
      }
      async getReviewsForSeller(sellerId) {
        const rows = await this.db.query(
          `SELECT r.*, u.name AS author_name
       FROM reviews r
       INNER JOIN users u ON u.id = r.user_id
       WHERE r.seller_id = ? AND r.moderation_status = 'approved'
       ORDER BY r.created_at DESC`,
          [sellerId]
        );
        return rows.map((r) => ({
          id: r.id,
          productId: r.product_id,
          sellerId: r.seller_id,
          userId: r.user_id,
          authorName: r.author_name,
          rating: Number(r.rating),
          comment: r.comment,
          verifiedBuyer: Boolean(r.verified_buyer),
          sellerReply: r.seller_reply || void 0,
          createdAt: String(r.created_at)
        }));
      }
      async getBootstrapData(ctx) {
        const [
          settings2,
          paymentsConfig,
          categories2,
          brands2,
          attributes2,
          sellers2,
          products2,
          subscriptionPlans2,
          deliveryZones2,
          homeSections2,
          banners2,
          popups,
          featuredPlacements2,
          offers2,
          flashSales2,
          campaigns2,
          siteChrome,
          seoMetadata
        ] = await Promise.all([
          this.getPlatformSettings(),
          this.getPaymentConfig(),
          this.getCategories(),
          this.getBrands(),
          this.getAttributes(),
          this.getPublicSellers(),
          this.getPublicProducts(),
          this.getSubscriptionPlans(),
          this.getDeliveryZones(),
          this.getPublicHomeSections(ctx),
          this.getActiveBanners(),
          this.getActivePopups(),
          this.getActiveFeaturedPlacements(),
          this.getActiveOffers(),
          this.getActiveFlashSales(),
          this.getActiveCampaigns(),
          this.getSiteChrome(Boolean(ctx?.includeDrafts)),
          this.getSeoMetadata()
        ]);
        return {
          settings: settings2,
          paymentsConfig,
          categories: categories2,
          brands: brands2,
          attributes: attributes2,
          sellers: sellers2,
          products: products2,
          subscriptionPlans: subscriptionPlans2,
          deliveryZones: deliveryZones2,
          homeSections: homeSections2,
          banners: banners2,
          popups,
          featuredPlacements: featuredPlacements2,
          offers: offers2,
          flashSales: flashSales2,
          campaigns: campaigns2,
          siteChrome,
          seoMetadata
        };
      }
      // --- Pages ---
      async getAllPages() {
        const rows = await this.db.query("SELECT * FROM pages ORDER BY slug ASC");
        return rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          title: parseJson(r.title_json, { en: r.slug, ar: r.slug }),
          body: parseJson(r.body_json, { en: "", ar: "" }),
          published: Boolean(r.published),
          updatedAt: String(r.updated_at)
        }));
      }
      async getPageBySlug(slug) {
        const row = await this.db.queryOne("SELECT * FROM pages WHERE slug = ? AND published = 1 LIMIT 1", [slug]);
        if (!row) return null;
        return {
          id: row.id,
          slug: row.slug,
          title: parseJson(row.title_json, { en: row.slug, ar: row.slug }),
          body: parseJson(row.body_json, { en: "", ar: "" }),
          published: Boolean(row.published),
          updatedAt: String(row.updated_at)
        };
      }
      // --- User Cart & Wishlist Sync ---
      async getUserCart(userId) {
        const cartRow = await this.db.queryOne("SELECT id FROM carts WHERE user_id = ? LIMIT 1", [userId]);
        if (!cartRow) return [];
        const items = await this.db.query(
          "SELECT product_id, variant_id, quantity FROM cart_items WHERE cart_id = ?",
          [cartRow.id]
        );
        return items.map((i) => ({ productId: i.product_id, variantId: i.variant_id, quantity: Number(i.quantity) }));
      }
      async saveUserCart(userId, items) {
        await this.db.transaction(async (tx) => {
          let cartRow = await tx.queryOne("SELECT id FROM carts WHERE user_id = ? LIMIT 1", [userId]);
          if (!cartRow) {
            const cartId = `crt-${crypto5.randomUUID()}`;
            await tx.execute("INSERT INTO carts (id, user_id, updated_at) VALUES (?, ?, ?)", [
              cartId,
              userId,
              toSqlTimestamp()
            ]);
            cartRow = { id: cartId };
          } else {
            await tx.execute("UPDATE carts SET updated_at = ? WHERE id = ?", [toSqlTimestamp(), cartRow.id]);
          }
          await tx.execute("DELETE FROM cart_items WHERE cart_id = ?", [cartRow.id]);
          for (const item of items) {
            if (item.quantity > 0) {
              await tx.execute(
                "INSERT INTO cart_items (id, cart_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?, ?)",
                [`ci-${crypto5.randomUUID()}`, cartRow.id, item.productId, item.variantId, item.quantity]
              );
            }
          }
        });
      }
      async getUserWishlist(userId) {
        const rows = await this.db.query(
          `SELECT w.product_id
       FROM wishlists w
       INNER JOIN products p ON p.id = w.product_id
       WHERE w.user_id = ? AND p.deleted_at IS NULL
       ORDER BY w.created_at DESC`,
          [userId]
        );
        return rows.map((r) => r.product_id);
      }
      async toggleUserWishlist(userId, productId) {
        const cleanId = productId.trim();
        const prod = await this.db.queryOne(
          "SELECT id FROM products WHERE id = ? AND deleted_at IS NULL",
          [cleanId]
        );
        if (!prod) {
          throw new Error("Product not found.");
        }
        const existing = await this.db.queryOne(
          "SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?",
          [userId, cleanId]
        );
        if (existing) {
          await this.db.execute("DELETE FROM wishlists WHERE id = ?", [existing.id]);
        } else {
          await this.db.execute(
            "INSERT INTO wishlists (id, user_id, product_id, created_at) VALUES (?, ?, ?, ?)",
            [`wsh-${crypto5.randomUUID()}`, userId, cleanId, toSqlTimestamp()]
          );
        }
        const wishlist = await this.getUserWishlist(userId);
        return { wished: !existing, wishlist };
      }
      async syncUserWishlist(userId, productIds) {
        const uniqueIds = Array.from(new Set(productIds.map((id) => String(id || "").trim()).filter(Boolean))).slice(0, 200);
        if (uniqueIds.length === 0) {
          return this.getUserWishlist(userId);
        }
        const now = toSqlTimestamp();
        for (const productId of uniqueIds) {
          const prod = await this.db.queryOne(
            "SELECT id FROM products WHERE id = ? AND deleted_at IS NULL",
            [productId]
          );
          if (!prod) continue;
          const existing = await this.db.queryOne(
            "SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?",
            [userId, productId]
          );
          if (!existing) {
            await this.db.execute(
              "INSERT INTO wishlists (id, user_id, product_id, created_at) VALUES (?, ?, ?, ?)",
              [`wsh-${crypto5.randomUUID()}`, userId, productId, now]
            );
          }
        }
        return this.getUserWishlist(userId);
      }
      async removeUserWishlistItem(userId, productId) {
        await this.db.execute("DELETE FROM wishlists WHERE user_id = ? AND product_id = ?", [userId, productId.trim()]);
        return this.getUserWishlist(userId);
      }
      // --- Commission Resolution & Orders ---
      async resolveCommissionBps(sellerId, categoryId, tx = this.db) {
        const sellerRow = await tx.queryOne(
          "SELECT custom_commission_bps FROM sellers WHERE id = ?",
          [sellerId]
        );
        if (sellerRow && sellerRow.custom_commission_bps !== null && sellerRow.custom_commission_bps !== void 0) {
          return { bps: Number(sellerRow.custom_commission_bps), source: "seller_custom" };
        }
        const catRow = await tx.queryOne(
          "SELECT commission_bps FROM categories WHERE id = ?",
          [categoryId]
        );
        if (catRow && catRow.commission_bps !== null && catRow.commission_bps !== void 0) {
          return { bps: Number(catRow.commission_bps), source: "category" };
        }
        const plat = await this.getPlatformSettings();
        return { bps: Number(plat.defaultCommissionBps), source: "platform_default" };
      }
      mapCouponRow(row) {
        const dType = String(row.discount_type || "percent");
        const dVal = Number(row.discount_value ?? 0);
        return {
          id: String(row.id),
          code: String(row.code),
          sellerId: row.seller_id ? String(row.seller_id) : null,
          discountType: dType,
          discountValue: dVal,
          discountPercent: dType === "percent" ? dVal : 0,
          maxDiscountUsdCents: row.max_discount_usd_cents !== null && row.max_discount_usd_cents !== void 0 ? Number(row.max_discount_usd_cents) : null,
          minOrderUsdCents: Number(row.min_order_usd_cents ?? 0),
          targetType: String(row.target_type || "all"),
          targetId: row.target_id ? String(row.target_id) : null,
          campaignId: row.campaign_id ? String(row.campaign_id) : null,
          maxUses: row.max_uses !== null && row.max_uses !== void 0 ? Number(row.max_uses) : null,
          perCustomerLimit: Number(row.per_customer_limit ?? 1),
          usedCount: Number(row.used_count ?? 0),
          firstOrderOnly: Boolean(row.first_order_only),
          autoGeneratedBatch: row.auto_generated_batch ? String(row.auto_generated_batch) : null,
          startsAt: row.starts_at ? String(row.starts_at) : null,
          endsAt: row.ends_at ? String(row.ends_at) : null,
          active: Boolean(row.active)
        };
      }
      async validateCoupon(code, subtotalUsdCents, sellerIds, opts) {
        const db = opts?.tx || this.db;
        const clean = code.trim().toUpperCase();
        const row = await db.queryOne(
          "SELECT * FROM coupons WHERE UPPER(code) = ? AND active = 1 LIMIT 1",
          [clean]
        );
        if (!row) throw new Error("Invalid or expired coupon code.");
        const coupon = this.mapCouponRow(row);
        if (!isWithinSchedule(coupon.startsAt, coupon.endsAt)) {
          throw new Error("This coupon is outside its active schedule window.");
        }
        if (coupon.maxUses !== null && coupon.maxUses !== void 0 && coupon.usedCount >= coupon.maxUses) {
          throw new Error("This coupon has reached its redemption limit.");
        }
        if (subtotalUsdCents < coupon.minOrderUsdCents) {
          throw new Error(`Minimum order for ${coupon.code} is $${(coupon.minOrderUsdCents / 100).toFixed(2)}.`);
        }
        if (coupon.sellerId && !sellerIds.includes(coupon.sellerId)) {
          throw new Error(`Coupon ${coupon.code} applies only to items from its issuing store.`);
        }
        const phoneNorm = opts?.customerPhone ? normalizePhone(opts.customerPhone) : "";
        if (coupon.perCustomerLimit > 0 && (opts?.userId || phoneNorm.length >= 6)) {
          const clauses = [];
          const params = [coupon.id];
          if (opts?.userId) {
            clauses.push("user_id = ?");
            params.push(opts.userId);
          }
          if (phoneNorm.length >= 6) {
            clauses.push("customer_phone_norm = ?");
            params.push(phoneNorm);
          }
          const red = await db.queryOne(
            `SELECT COUNT(*) AS cnt FROM coupon_redemptions WHERE coupon_id = ? AND (${clauses.join(" OR ")})`,
            params
          );
          if (Number(red?.cnt ?? 0) >= coupon.perCustomerLimit) {
            throw new Error(`Coupon ${coupon.code} usage limit reached for your account.`);
          }
        }
        if (coupon.firstOrderOnly && (opts?.userId || phoneNorm.length >= 6)) {
          const existingOrd = opts?.userId ? await db.queryOne("SELECT id FROM orders WHERE user_id = ? LIMIT 1", [opts.userId]) : await db.queryOne("SELECT id FROM orders WHERE customer_phone LIKE ? LIMIT 1", [`%${phoneNorm}`]);
          if (existingOrd) {
            throw new Error(`Coupon ${coupon.code} is valid for first-time orders only.`);
          }
        }
        return coupon;
      }
      async createOrder(input, ipAddress) {
        if (!input.items || input.items.length === 0) throw new Error("Your cart is empty.");
        const settings2 = await this.getPlatformSettings();
        const payCfg = await this.getPaymentConfig();
        if (input.paymentMethod === "cod" && !payCfg.codEnabled) {
          throw new Error("Cash on Delivery is currently disabled by platform settings.");
        }
        if (input.paymentMethod === "whish_manual" && !payCfg.whishManualEnabled) {
          throw new Error("Whish / OMT transfer is not available until configured in Admin Console.");
        }
        const orderNumber = `NL-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(crypto5.randomInt(1e5, 999999))}`;
        const phoneNorm = normalizePhone(input.customerPhone);
        return this.db.transaction(async (tx) => {
          const [activeOffers, activeFlashSales] = await Promise.all([
            this.getActiveOffers(tx),
            this.getActiveFlashSales(tx)
          ]);
          let isFirstOrder = true;
          if (input.userId) {
            const prior = await tx.queryOne("SELECT id FROM orders WHERE user_id = ? LIMIT 1", [input.userId]);
            isFirstOrder = !prior;
          } else if (phoneNorm.length >= 6) {
            const prior = await tx.queryOne("SELECT id FROM orders WHERE customer_phone LIKE ? LIMIT 1", [`%${phoneNorm}`]);
            isFirstOrder = !prior;
          }
          const resolvedCartLines = [];
          for (const reqItem of input.items) {
            if (reqItem.quantity < 1) throw new Error("Invalid item quantity.");
            const pRow = await tx.queryOne(
              "SELECT * FROM products WHERE id = ? AND published = 1 AND deleted_at IS NULL",
              [reqItem.productId]
            );
            if (!pRow) throw new Error("One or more items in your bag are unavailable.");
            const [product] = await this.mapProductRows([pRow], tx);
            const variant = product.variants.find((v) => v.id === reqItem.variantId);
            if (!variant) throw new Error(`Selected variant unavailable for ${product.title.en}.`);
            if (variant.stock < reqItem.quantity) {
              throw new Error(`Insufficient stock for ${product.title.en} (${variant.sku}).`);
            }
            const seller = await this.getSellerById(product.sellerId);
            if (!seller || seller.status !== "approved") {
              throw new Error("Merchant storefront is currently unavailable.");
            }
            const stockRes = await tx.execute(
              "UPDATE product_variants SET stock = stock - ? WHERE id = ? AND stock >= ?",
              [reqItem.quantity, variant.id, reqItem.quantity]
            );
            if (stockRes.affectedRows === 0) {
              throw new Error(`Stock race conflict for ${variant.sku}; please retry.`);
            }
            await tx.execute(
              "INSERT INTO stock_movements (id, variant_id, delta, reason, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
              [`stk-${crypto5.randomUUID()}`, variant.id, -reqItem.quantity, "order_reserved", orderNumber, toSqlTimestamp()]
            );
            const baseUnitUsdCents = product.basePriceUsdCents + variant.priceDeltaUsdCents;
            resolvedCartLines.push({ product, variant, seller, quantity: reqItem.quantity, baseUnitUsdCents });
          }
          const promoEval = evaluateCartPromotions(
            resolvedCartLines.map((l) => ({
              product: l.product,
              baseUnitUsdCents: l.baseUnitUsdCents,
              quantity: l.quantity
            })),
            activeOffers,
            activeFlashSales,
            { isLoggedIn: Boolean(input.userId), isFirstOrder }
          );
          for (let i = 0; i < promoEval.lines.length; i++) {
            const evalLine = promoEval.lines[i];
            const rawLine = resolvedCartLines[i];
            if (evalLine.appliedFlashItemId) {
              const claimRes = await tx.execute(
                "UPDATE flash_sale_items SET claimed_count = claimed_count + ? WHERE id = ? AND (stock_cap = 0 OR claimed_count + ? <= stock_cap)",
                [rawLine.quantity, evalLine.appliedFlashItemId, rawLine.quantity]
              );
              if (claimRes.affectedRows === 0) {
                throw new Error(`Flash deal stock cap reached for ${rawLine.product.title.en}; remove item or retry.`);
              }
            }
          }
          const grouped = /* @__PURE__ */ new Map();
          let subtotalUsdCents = 0;
          for (let i = 0; i < resolvedCartLines.length; i++) {
            const raw = resolvedCartLines[i];
            const ev = promoEval.lines[i];
            const unitPrice = ev.effectiveUnitUsdCents;
            const lineTotal = ev.lineSubtotalUsdCents;
            const netLineTotal = Math.max(1, lineTotal - ev.extraLineDiscountUsdCents);
            const comm = await this.resolveCommissionBps(raw.seller.id, raw.product.categoryId, tx);
            const commCents = Math.round(netLineTotal * comm.bps / 1e4);
            subtotalUsdCents += lineTotal;
            const bucket = grouped.get(raw.seller.id) || { seller: raw.seller, items: [] };
            bucket.items.push({
              product: raw.product,
              variant: raw.variant,
              quantity: raw.quantity,
              unitPrice,
              lineTotal,
              extraOfferDiscountUsdCents: ev.extraLineDiscountUsdCents,
              commBps: comm.bps,
              commSource: comm.source,
              commCents
            });
            grouped.set(raw.seller.id, bucket);
          }
          let couponRecord = null;
          if (input.couponCode && input.couponCode.trim()) {
            const c = await this.validateCoupon(
              input.couponCode,
              subtotalUsdCents - promoEval.extraOfferDiscountUsdCents,
              Array.from(grouped.keys()),
              { userId: input.userId, customerPhone: input.customerPhone, tx }
            );
            couponRecord = c;
            await tx.execute("UPDATE coupons SET used_count = used_count + 1 WHERE id = ?", [c.id]);
          }
          const zoneRow = await tx.queryOne(
            "SELECT platform_fee_usd_cents FROM delivery_zones WHERE governorate_code = ?",
            [input.governorate]
          );
          const platformZoneFee = Number(zoneRow?.platform_fee_usd_cents ?? 500);
          const waiveShipping = promoEval.freeShippingApplied || couponRecord?.discountType === "free_shipping";
          let deliveryTotalUsdCents = 0;
          let discountTotalUsdCents = 0;
          let couponTotalUsedUsdCents = 0;
          const orderId = `ord-${crypto5.randomUUID()}`;
          const createdAt = toSqlTimestamp();
          const builtSubOrders = [];
          const matchingSubOrderEntries = Array.from(grouped.entries());
          const couponTargetSubtotal = matchingSubOrderEntries.reduce((sum, [sid, b]) => {
            if (couponRecord?.sellerId && couponRecord.sellerId !== sid) return sum;
            return sum + b.items.reduce((s, i) => s + (i.lineTotal - i.extraOfferDiscountUsdCents), 0);
          }, 0);
          let fixedCouponBudget = 0;
          if (couponRecord && couponTargetSubtotal > 0) {
            if (couponRecord.discountType === "fixed_usd_cents") {
              fixedCouponBudget = Math.min(couponTargetSubtotal - 1, Math.max(0, couponRecord.discountValue));
            } else if (couponRecord.discountType === "percent") {
              fixedCouponBudget = Math.round(couponTargetSubtotal * couponRecord.discountValue / 100);
            }
            if (couponRecord.maxDiscountUsdCents && fixedCouponBudget > couponRecord.maxDiscountUsdCents) {
              fixedCouponBudget = couponRecord.maxDiscountUsdCents;
            }
          }
          let distributedCoupon = 0;
          const eligibleCouponSellers = matchingSubOrderEntries.filter(
            ([sid]) => !couponRecord?.sellerId || couponRecord.sellerId === sid
          );
          for (const [sellerId, bucket] of matchingSubOrderEntries) {
            const subSubtotal = bucket.items.reduce((s, i) => s + i.lineTotal, 0);
            const subPromoDiscount = bucket.items.reduce((s, i) => s + i.extraOfferDiscountUsdCents, 0);
            const subComm = bucket.items.reduce((s, i) => s + i.commCents, 0);
            let subCouponDiscount = 0;
            if (couponRecord && fixedCouponBudget > 0 && (!couponRecord.sellerId || couponRecord.sellerId === sellerId)) {
              const netSub = Math.max(0, subSubtotal - subPromoDiscount);
              const idxInEligible = eligibleCouponSellers.findIndex(([esid]) => esid === sellerId);
              if (idxInEligible === eligibleCouponSellers.length - 1) {
                subCouponDiscount = Math.max(0, fixedCouponBudget - distributedCoupon);
              } else if (couponTargetSubtotal > 0) {
                subCouponDiscount = Math.round(fixedCouponBudget * netSub / couponTargetSubtotal);
              }
              subCouponDiscount = Math.min(netSub, subCouponDiscount);
              distributedCoupon += subCouponDiscount;
            }
            const subDiscount = subPromoDiscount + subCouponDiscount;
            couponTotalUsedUsdCents += subCouponDiscount;
            const baseDeliveryFee = bucket.seller.deliveryMode === "self" ? Number(bucket.seller.selfDeliveryFeesUsdCents[input.governorate] ?? platformZoneFee) : platformZoneFee;
            const deliveryFee = waiveShipping ? 0 : baseDeliveryFee;
            deliveryTotalUsdCents += deliveryFee;
            discountTotalUsdCents += subDiscount;
            const sellerNet = subSubtotal - subDiscount - subComm + (bucket.seller.deliveryMode === "self" ? deliveryFee : 0);
            const subOrderId = `sub-${crypto5.randomUUID()}`;
            await tx.execute(
              `INSERT INTO sub_orders (id, order_id, seller_id, status, delivery_mode, delivery_fee_usd_cents, subtotal_usd_cents, discount_usd_cents, commission_usd_cents, seller_net_usd_cents, cod_collected, updated_at)
           VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, 0, ?)`,
              [
                subOrderId,
                orderId,
                sellerId,
                bucket.seller.deliveryMode,
                deliveryFee,
                subSubtotal,
                subDiscount,
                subComm,
                sellerNet,
                createdAt
              ]
            );
            const orderItemsOut = [];
            for (const item of bucket.items) {
              const itemId = `oi-${crypto5.randomUUID()}`;
              const variantLabel = `${item.variant.size ? item.variant.size + " \xB7 " : ""}${item.variant.color}`;
              await tx.execute(
                `INSERT INTO order_items (id, sub_order_id, product_id, variant_id, title_snapshot_json, variant_label, sku, quantity, unit_price_usd_cents, line_total_usd_cents, commission_bps_snapshot, commission_usd_cents)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  itemId,
                  subOrderId,
                  item.product.id,
                  item.variant.id,
                  JSON.stringify(item.product.title),
                  variantLabel,
                  item.variant.sku,
                  item.quantity,
                  item.unitPrice,
                  item.lineTotal,
                  item.commBps,
                  item.commCents
                ]
              );
              await tx.execute(
                `INSERT INTO commissions_log (id, order_item_id, seller_id, applied_bps, source_rule, amount_usd_cents, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [`cml-${crypto5.randomUUID()}`, itemId, sellerId, item.commBps, item.commSource, item.commCents, createdAt]
              );
              orderItemsOut.push({
                id: itemId,
                productId: item.product.id,
                variantId: item.variant.id,
                titleSnapshot: item.product.title,
                variantLabel,
                sku: item.variant.sku,
                quantity: item.quantity,
                unitPriceUsdCents: item.unitPrice,
                lineTotalUsdCents: item.lineTotal,
                commissionBpsSnapshot: item.commBps,
                commissionUsdCents: item.commCents
              });
            }
            await tx.execute(
              `INSERT INTO ledger_entries (id, seller_id, sub_order_id, order_number, entry_type, direction, amount_usd_cents, availability, note, created_at)
           VALUES (?, ?, ?, ?, 'ORDER_GROSS', 'credit', ?, 'pending', ?, ?)`,
              [`led-${crypto5.randomUUID()}`, sellerId, subOrderId, orderNumber, subSubtotal - subDiscount, `Order ${orderNumber} gross`, createdAt]
            );
            await tx.execute(
              `INSERT INTO ledger_entries (id, seller_id, sub_order_id, order_number, entry_type, direction, amount_usd_cents, availability, note, created_at)
           VALUES (?, ?, ?, ?, 'PLATFORM_COMMISSION', 'debit', ?, 'pending', ?, ?)`,
              [`led-${crypto5.randomUUID()}`, sellerId, subOrderId, orderNumber, subComm, `Platform commission on ${orderNumber}`, createdAt]
            );
            if (bucket.seller.deliveryMode === "self" && deliveryFee > 0) {
              await tx.execute(
                `INSERT INTO ledger_entries (id, seller_id, sub_order_id, order_number, entry_type, direction, amount_usd_cents, availability, note, created_at)
             VALUES (?, ?, ?, ?, 'DELIVERY_FEE', 'credit', ?, 'pending', ?, ?)`,
                [`led-${crypto5.randomUUID()}`, sellerId, subOrderId, orderNumber, deliveryFee, `Self-delivery fee on ${orderNumber}`, createdAt]
              );
            }
            builtSubOrders.push({
              id: subOrderId,
              orderId,
              sellerId,
              sellerName: bucket.seller.name,
              status: "pending",
              deliveryMode: bucket.seller.deliveryMode,
              deliveryFeeUsdCents: deliveryFee,
              subtotalUsdCents: subSubtotal,
              discountUsdCents: subDiscount,
              commissionUsdCents: subComm,
              sellerNetUsdCents: sellerNet,
              codCollected: false,
              items: orderItemsOut,
              updatedAt: createdAt
            });
          }
          if (couponRecord) {
            await tx.execute(
              `INSERT INTO coupon_redemptions (id, coupon_id, user_id, customer_phone_norm, order_id, discount_usd_cents, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [`cred-${crypto5.randomUUID()}`, couponRecord.id, input.userId, phoneNorm || "guest", orderId, couponTotalUsedUsdCents, createdAt]
            );
          }
          const codFeeUsdCents = input.paymentMethod === "cod" ? Number(settings2.codFeeUsdCents) : 0;
          const grandTotalUsdCents = subtotalUsdCents - discountTotalUsdCents + deliveryTotalUsdCents + codFeeUsdCents;
          const payAdapter = getPaymentAdapter(input.paymentMethod);
          const payRes = payAdapter.authorize({
            orderNumber,
            amountUsdCents: grandTotalUsdCents,
            method: input.paymentMethod,
            transferReference: input.transferReference,
            whishAccountNumber: payCfg.whishAccountNumber,
            cardEnabledInSettings: payCfg.cardEnabled
          });
          await tx.execute(
            `INSERT INTO orders (id, order_number, user_id, customer_name, customer_phone, governorate, district, town, address_notes, payment_method, payment_status, coupon_code, exchange_rate_snapshot, subtotal_usd_cents, delivery_total_usd_cents, cod_fee_usd_cents, discount_total_usd_cents, grand_total_usd_cents, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              orderId,
              orderNumber,
              input.userId,
              input.customerName.trim(),
              input.customerPhone.trim(),
              input.governorate,
              input.district,
              input.town,
              input.addressNotes.trim(),
              input.paymentMethod,
              payRes.paymentStatus,
              couponRecord?.code || null,
              settings2.exchangeRateLbpPerUsd,
              subtotalUsdCents,
              deliveryTotalUsdCents,
              codFeeUsdCents,
              discountTotalUsdCents,
              grandTotalUsdCents,
              createdAt
            ]
          );
          await tx.execute(
            `INSERT INTO payments (id, order_id, method, gateway_name, reference, amount_usd_cents, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [`pay-${crypto5.randomUUID()}`, orderId, input.paymentMethod, payRes.gatewayName, payRes.reference, grandTotalUsdCents, payRes.paymentStatus, createdAt]
          );
          if (input.userId) {
            await this.createNotification(
              tx,
              input.userId,
              { en: `Order ${orderNumber} placed`, ar: `\u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0637\u0644\u0628 ${orderNumber}` },
              {
                en: `Your order totaling $${(grandTotalUsdCents / 100).toFixed(2)} is confirmed.`,
                ar: `\u062A\u0645 \u062A\u0623\u0643\u064A\u062F \u0637\u0644\u0628\u0643 \u0628\u0642\u064A\u0645\u0629 ${(grandTotalUsdCents / 100).toFixed(2)} \u062F\u0648\u0644\u0627\u0631.`
              },
              { category: "order", actionUrl: "/orders", metadata: { orderId, orderNumber } }
            );
          }
          for (const [, bucket] of matchingSubOrderEntries) {
            await this.createNotification(
              tx,
              bucket.seller.userId,
              { en: `New order ${orderNumber}`, ar: `\u0637\u0644\u0628 \u062C\u062F\u064A\u062F ${orderNumber}` },
              {
                en: `${bucket.items.length} item(s) ordered from ${bucket.seller.name.en}.`,
                ar: `\u062A\u0645 \u0637\u0644\u0628 ${bucket.items.length} \u0645\u0646\u062A\u062C \u0645\u0646 \u0645\u062A\u062C\u0631\u0643 ${bucket.seller.name.ar}.`
              },
              { category: "order", actionUrl: "/seller", metadata: { orderId, orderNumber } }
            );
          }
          await writeAuditLog(tx, {
            actorUserId: input.userId,
            action: "order.created",
            entityType: "order",
            entityId: orderId,
            after: { orderNumber, grandTotalUsdCents, paymentMethod: input.paymentMethod },
            ipAddress
          });
          return {
            id: orderId,
            orderNumber,
            userId: input.userId,
            customerName: input.customerName.trim(),
            customerPhone: input.customerPhone.trim(),
            governorate: input.governorate,
            district: input.district,
            town: input.town,
            addressNotes: input.addressNotes.trim(),
            paymentMethod: input.paymentMethod,
            paymentStatus: payRes.paymentStatus,
            transferReference: input.transferReference || null,
            couponCode: couponRecord?.code || null,
            exchangeRateSnapshot: settings2.exchangeRateLbpPerUsd,
            subtotalUsdCents,
            deliveryTotalUsdCents,
            codFeeUsdCents,
            discountTotalUsdCents,
            grandTotalUsdCents,
            subOrders: builtSubOrders,
            createdAt
          };
        });
      }
      async hydrateOrders(orderRows) {
        const out = [];
        for (const o of orderRows) {
          const payRow = await this.db.queryOne(
            "SELECT reference FROM payments WHERE order_id = ? LIMIT 1",
            [o.id]
          );
          const subRows = await this.db.query(
            `SELECT so.*, st.name_json AS seller_name_json
         FROM sub_orders so
         LEFT JOIN stores st ON st.seller_id = so.seller_id
         WHERE so.order_id = ?`,
            [o.id]
          );
          const subOrders2 = [];
          for (const sr of subRows) {
            const itemRows = await this.db.query(
              "SELECT * FROM order_items WHERE sub_order_id = ?",
              [sr.id]
            );
            subOrders2.push({
              id: String(sr.id),
              orderId: String(sr.order_id),
              sellerId: String(sr.seller_id),
              sellerName: parseJson(sr.seller_name_json, { en: "Store", ar: "\u0645\u062A\u062C\u0631" }),
              status: String(sr.status),
              deliveryMode: String(sr.delivery_mode),
              deliveryFeeUsdCents: Number(sr.delivery_fee_usd_cents),
              subtotalUsdCents: Number(sr.subtotal_usd_cents),
              discountUsdCents: Number(sr.discount_usd_cents),
              commissionUsdCents: Number(sr.commission_usd_cents),
              sellerNetUsdCents: Number(sr.seller_net_usd_cents),
              codCollected: Boolean(sr.cod_collected),
              courierName: sr.courier_name ? String(sr.courier_name) : null,
              trackingCode: sr.tracking_code ? String(sr.tracking_code) : null,
              items: itemRows.map((ir) => ({
                id: String(ir.id),
                productId: String(ir.product_id),
                variantId: String(ir.variant_id),
                titleSnapshot: parseJson(ir.title_snapshot_json, { en: "", ar: "" }),
                variantLabel: String(ir.variant_label),
                sku: String(ir.sku),
                quantity: Number(ir.quantity),
                unitPriceUsdCents: Number(ir.unit_price_usd_cents),
                lineTotalUsdCents: Number(ir.line_total_usd_cents),
                commissionBpsSnapshot: Number(ir.commission_bps_snapshot),
                commissionUsdCents: Number(ir.commission_usd_cents)
              })),
              updatedAt: String(sr.updated_at)
            });
          }
          out.push({
            id: String(o.id),
            orderNumber: String(o.order_number),
            userId: o.user_id ? String(o.user_id) : null,
            customerName: String(o.customer_name),
            customerPhone: String(o.customer_phone),
            governorate: String(o.governorate),
            district: String(o.district),
            town: String(o.town),
            addressNotes: String(o.address_notes),
            paymentMethod: String(o.payment_method),
            paymentStatus: String(o.payment_status),
            transferReference: payRow?.reference || null,
            couponCode: o.coupon_code ? String(o.coupon_code) : null,
            exchangeRateSnapshot: Number(o.exchange_rate_snapshot),
            subtotalUsdCents: Number(o.subtotal_usd_cents),
            deliveryTotalUsdCents: Number(o.delivery_total_usd_cents),
            codFeeUsdCents: Number(o.cod_fee_usd_cents),
            discountTotalUsdCents: Number(o.discount_total_usd_cents),
            grandTotalUsdCents: Number(o.grand_total_usd_cents),
            subOrders: subOrders2,
            createdAt: String(o.created_at)
          });
        }
        return out;
      }
      async lookupOrders(input) {
        const orderNum = (input.orderNumber || "").trim();
        if (input.user) {
          if (orderNum) {
            const rows3 = await this.db.query(
              "SELECT * FROM orders WHERE UPPER(order_number) = UPPER(?) AND user_id = ? ORDER BY created_at DESC",
              [orderNum, input.user.id]
            );
            return this.hydrateOrders(rows3);
          }
          const rows2 = await this.db.query(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 30",
            [input.user.id]
          );
          return this.hydrateOrders(rows2);
        }
        if (!orderNum || !input.phone) return [];
        const normSubmitted = normalizePhone(input.phone);
        if (normSubmitted.length < 6) return [];
        const rows = await this.db.query(
          "SELECT * FROM orders WHERE UPPER(order_number) = UPPER(?) LIMIT 5",
          [orderNum]
        );
        const matching = rows.filter((r) => normalizePhone(String(r.customer_phone)) === normSubmitted);
        return this.hydrateOrders(matching);
      }
      async addVerifiedReview(input) {
        if (input.rating < 1 || input.rating > 5) throw new Error("Rating must be between 1 and 5.");
        if (input.comment.trim().length < 4) throw new Error("Please write at least a few words.");
        return this.db.transaction(async (tx) => {
          const prod = await tx.queryOne("SELECT id, seller_id FROM products WHERE id = ?", [
            input.productId
          ]);
          if (!prod) throw new Error("Product not found.");
          const purchase = await tx.queryOne(
            `SELECT o.id FROM orders o
         INNER JOIN sub_orders so ON so.order_id = o.id
         INNER JOIN order_items oi ON oi.sub_order_id = so.id
         WHERE o.user_id = ? AND oi.product_id = ? AND so.status IN ('confirmed', 'packed', 'shipped', 'delivered')
         LIMIT 1`,
            [input.userId, input.productId]
          );
          if (!purchase) {
            throw new Error("Verified buyer requirement: purchase and confirm this product before reviewing.");
          }
          const userRow = await tx.queryOne("SELECT name FROM users WHERE id = ?", [input.userId]);
          const id = `rev-${crypto5.randomUUID()}`;
          const now = toSqlTimestamp();
          await tx.execute(
            `INSERT INTO reviews (id, product_id, seller_id, user_id, rating, comment, verified_buyer, moderation_status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, 'approved', ?)`,
            [id, input.productId, prod.seller_id, input.userId, Math.round(input.rating), input.comment.trim(), now]
          );
          const pStats = await tx.queryOne(
            "SELECT AVG(rating) AS avg_r, COUNT(*) AS cnt FROM reviews WHERE product_id = ? AND moderation_status = 'approved'",
            [input.productId]
          );
          await tx.execute("UPDATE products SET rating_avg_x10 = ?, review_count = ? WHERE id = ?", [
            Math.round(Number(pStats?.avg_r || 0) * 10),
            Number(pStats?.cnt || 0),
            input.productId
          ]);
          const sStats = await tx.queryOne(
            "SELECT AVG(rating) AS avg_r, COUNT(*) AS cnt FROM reviews WHERE seller_id = ? AND moderation_status = 'approved'",
            [prod.seller_id]
          );
          await tx.execute("UPDATE stores SET rating_avg_x10 = ?, review_count = ? WHERE seller_id = ?", [
            Math.round(Number(sStats?.avg_r || 0) * 10),
            Number(sStats?.cnt || 0),
            prod.seller_id
          ]);
          return {
            id,
            productId: input.productId,
            sellerId: prod.seller_id,
            userId: input.userId,
            authorName: userRow?.name || "Verified Buyer",
            rating: Math.round(input.rating),
            comment: input.comment.trim(),
            verifiedBuyer: true,
            createdAt: now
          };
        });
      }
      // --- Seller Workspace & Operations ---
      async registerSeller(input) {
        const pwErr = validatePasswordStrength(input.password);
        if (pwErr) throw new Error(pwErr);
        const emailNorm = input.email.trim().toLowerCase();
        return this.db.transaction(async (tx) => {
          const dup = await tx.queryOne("SELECT id FROM users WHERE LOWER(email) = ?", [emailNorm]);
          if (dup) throw new Error("An account with this email already exists.");
          const userId = `usr-${crypto5.randomUUID()}`;
          const sellerId = `sel-${crypto5.randomUUID()}`;
          const storeId = `str-${crypto5.randomUUID()}`;
          const slugBase = input.storeNameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "store";
          const slug = `${slugBase}-${crypto5.randomInt(100, 999)}`;
          const now = toSqlTimestamp();
          const nextDue = toSqlTimestamp(new Date(Date.now() + 30 * 864e5));
          await tx.execute(
            `INSERT INTO users (id, name, email, phone, password_hash, role_key, preferred_locale, preferred_currency, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'seller_owner', 'en', 'USD', ?, ?)`,
            [userId, input.ownerName.trim(), emailNorm, input.phone.trim(), hashPassword(input.password), now, now]
          );
          await tx.execute(
            `INSERT INTO sellers (id, owner_user_id, business_type, legal_name, commercial_reg_ref, governorate, district, city_address, phone, whatsapp_phone, status, verified, payout_method, payout_account, onboarding_step, created_at, updated_at)
         VALUES (?, ?, 'business', ?, ?, ?, ?, ?, ?, ?, 'pending', 0, ?, ?, 2, ?, ?)`,
            [
              sellerId,
              userId,
              input.storeNameEn.trim(),
              input.commercialRegRef.trim(),
              input.governorate,
              input.district,
              input.district,
              input.phone.trim(),
              normalizePhone(input.phone),
              input.payoutMethod,
              input.payoutAccount.trim(),
              now,
              now
            ]
          );
          await tx.execute(
            `INSERT INTO stores (id, seller_id, slug, name_json, tagline_json, about_json, department_slug, theme_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'obsidian-ember', ?, ?)`,
            [
              storeId,
              sellerId,
              slug,
              JSON.stringify({ en: input.storeNameEn.trim(), ar: (input.storeNameAr || input.storeNameEn).trim() }),
              JSON.stringify({ en: "Independent Lebanese merchant on NileLink", ar: "\u0645\u062A\u062C\u0631 \u0644\u0628\u0646\u0627\u0646\u064A \u0645\u0633\u062A\u0642\u0644 \u0639\u0644\u0649 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643" }),
              JSON.stringify({ en: "Store profile awaiting final setup.", ar: "\u0645\u0644\u0641 \u0627\u0644\u0645\u062A\u062C\u0631 \u0642\u064A\u062F \u0627\u0644\u0627\u0633\u062A\u0643\u0645\u0627\u0644." }),
              input.department,
              now,
              now
            ]
          );
          await tx.execute(
            `INSERT INTO store_settings (store_id, delivery_mode, self_delivery_fees_json, processing_hours, vacation_mode)
         VALUES (?, 'platform', '{}', 24, 0)`,
            [storeId]
          );
          await tx.execute(
            `INSERT INTO subscriptions (id, seller_id, plan_tier, status, next_due_at, created_at)
         VALUES (?, ?, 'free', 'active', ?, ?)`,
            [`subp-${crypto5.randomUUID()}`, sellerId, nextDue, now]
          );
          await writeAuditLog(tx, {
            actorUserId: userId,
            action: "seller.register",
            entityType: "seller",
            entityId: sellerId,
            after: { storeName: input.storeNameEn.trim(), slug, status: "pending" },
            ipAddress: input.ipAddress
          });
          const seller = await this.mapSellerRow(
            await tx.queryOne(
              `SELECT sel.*, st.slug, st.name_json, st.tagline_json, st.about_json, st.announcement_json,
                  st.department_slug, st.theme_id, st.logo_media_id, st.banner_media_id, st.locations_json, st.rating_avg_x10, st.review_count,
                  ss.delivery_mode, ss.self_delivery_fees_json, ss.processing_hours, ss.vacation_mode, ss.working_hours_json, ss.return_policy_json, ss.social_links_json, ss.seo_title, ss.seo_description
           FROM sellers sel INNER JOIN stores st ON st.seller_id = sel.id LEFT JOIN store_settings ss ON ss.store_id = st.id
           WHERE sel.id = ?`,
              [sellerId]
            ),
            tx
          );
          return {
            user: { id: userId, name: input.ownerName.trim(), email: emailNorm, roleKey: "seller_owner", sellerId },
            seller
          };
        });
      }
      async attachSellerDocument(sellerId, docType, mediaId) {
        const id = `doc-${crypto5.randomUUID()}`;
        await this.db.execute(
          "INSERT INTO seller_documents (id, seller_id, doc_type, media_id, review_status, created_at) VALUES (?, ?, ?, ?, ?, ?)",
          [id, sellerId, docType, mediaId, "pending", toSqlTimestamp()]
        );
        return { id, sellerId, docType, mediaId, reviewStatus: "pending" };
      }
      async getSellerBalance(sellerId) {
        const rows = await this.db.query("SELECT * FROM ledger_entries WHERE seller_id = ? ORDER BY created_at DESC", [sellerId]);
        const entries = rows.map((r) => ({
          id: r.id,
          sellerId: r.seller_id,
          subOrderId: r.sub_order_id,
          orderNumber: r.order_number,
          type: r.entry_type,
          direction: r.direction,
          amountUsdCents: Number(r.amount_usd_cents),
          availability: r.availability,
          note: r.note,
          createdAt: String(r.created_at)
        }));
        let pendingUsdCents = 0;
        let availableUsdCents = 0;
        let totalGrossUsdCents = 0;
        let totalCommissionUsdCents = 0;
        let totalPaidOutUsdCents = 0;
        for (const e of entries) {
          const signed = e.direction === "credit" ? e.amountUsdCents : -e.amountUsdCents;
          if (e.availability === "pending") pendingUsdCents += signed;
          if (e.availability === "available") availableUsdCents += signed;
          if (e.type === "ORDER_GROSS") totalGrossUsdCents += e.amountUsdCents;
          if (e.type === "PLATFORM_COMMISSION") totalCommissionUsdCents += e.amountUsdCents;
          if (e.type === "PAYOUT_SETTLED") totalPaidOutUsdCents += e.amountUsdCents;
        }
        const payoutRows = await this.db.query(
          "SELECT amount_usd_cents FROM payouts WHERE seller_id = ? AND status = 'pending'",
          [sellerId]
        );
        const reservedForPayoutsUsdCents = payoutRows.reduce((s, p) => s + Number(p.amount_usd_cents), 0);
        return {
          pendingUsdCents,
          availableUsdCents,
          reservedForPayoutsUsdCents,
          totalGrossUsdCents,
          totalCommissionUsdCents,
          totalPaidOutUsdCents,
          entries
        };
      }
      async getSellerWorkspace(sellerId) {
        const seller = await this.getSellerById(sellerId);
        if (!seller) throw new Error("Seller not found.");
        const prodRows = await this.db.query(
          "SELECT * FROM products WHERE seller_id = ? AND deleted_at IS NULL ORDER BY created_at DESC",
          [sellerId]
        );
        const products2 = await this.mapProductRows(prodRows);
        const subRows = await this.db.query(
          `SELECT so.*, o.order_number, o.customer_name, o.customer_phone, o.governorate, o.district, o.town, o.payment_method, o.payment_status, st.name_json AS seller_name_json
       FROM sub_orders so
       INNER JOIN orders o ON o.id = so.order_id
       LEFT JOIN stores st ON st.seller_id = so.seller_id
       WHERE so.seller_id = ?
       ORDER BY o.created_at DESC`,
          [sellerId]
        );
        const subOrders2 = [];
        for (const sr of subRows) {
          const itemRows = await this.db.query("SELECT * FROM order_items WHERE sub_order_id = ?", [
            sr.id
          ]);
          subOrders2.push({
            id: String(sr.id),
            orderId: String(sr.order_id),
            sellerId: String(sr.seller_id),
            sellerName: parseJson(sr.seller_name_json, seller.name),
            status: String(sr.status),
            deliveryMode: String(sr.delivery_mode),
            deliveryFeeUsdCents: Number(sr.delivery_fee_usd_cents),
            subtotalUsdCents: Number(sr.subtotal_usd_cents),
            discountUsdCents: Number(sr.discount_usd_cents),
            commissionUsdCents: Number(sr.commission_usd_cents),
            sellerNetUsdCents: Number(sr.seller_net_usd_cents),
            codCollected: Boolean(sr.cod_collected),
            courierName: sr.courier_name ? String(sr.courier_name) : null,
            trackingCode: sr.tracking_code ? String(sr.tracking_code) : null,
            items: itemRows.map((ir) => ({
              id: String(ir.id),
              productId: String(ir.product_id),
              variantId: String(ir.variant_id),
              titleSnapshot: parseJson(ir.title_snapshot_json, { en: "", ar: "" }),
              variantLabel: String(ir.variant_label),
              sku: String(ir.sku),
              quantity: Number(ir.quantity),
              unitPriceUsdCents: Number(ir.unit_price_usd_cents),
              lineTotalUsdCents: Number(ir.line_total_usd_cents),
              commissionBpsSnapshot: Number(ir.commission_bps_snapshot),
              commissionUsdCents: Number(ir.commission_usd_cents)
            })),
            updatedAt: String(sr.updated_at),
            orderNumber: String(sr.order_number),
            customerName: String(sr.customer_name),
            customerPhone: String(sr.customer_phone),
            governorate: String(sr.governorate),
            district: String(sr.district),
            town: String(sr.town),
            paymentMethod: String(sr.payment_method),
            paymentStatus: String(sr.payment_status)
          });
        }
        const balance = await this.getSellerBalance(sellerId);
        const payoutRows = await this.db.query(
          "SELECT * FROM payouts WHERE seller_id = ? ORDER BY created_at DESC",
          [sellerId]
        );
        const payouts2 = payoutRows.map((p) => ({
          id: String(p.id),
          sellerId: String(p.seller_id),
          sellerName: seller.name,
          amountUsdCents: Number(p.amount_usd_cents),
          method: String(p.method),
          accountDetails: String(p.account_details),
          status: String(p.status),
          referenceCode: p.reference_code ? String(p.reference_code) : null,
          createdAt: String(p.created_at),
          settledAt: p.settled_at ? String(p.settled_at) : null
        }));
        const couponRows = await this.db.query("SELECT * FROM coupons WHERE seller_id = ?", [sellerId]);
        const coupons2 = couponRows.map((c) => this.mapCouponRow(c));
        const docs = await this.db.query(
          `SELECT d.id, d.doc_type, d.media_id, d.review_status, d.reviewer_note, m.public_url, d.created_at
       FROM seller_documents d INNER JOIN media m ON m.id = d.media_id
       WHERE d.seller_id = ? ORDER BY d.created_at DESC`,
          [sellerId]
        );
        const reviews2 = await this.getReviewsForSeller(sellerId);
        const catId = `cat-${seller.department === "home-gadgets" ? "home" : seller.department}`;
        const commissionInfo = await this.resolveCommissionBps(seller.id, catId);
        const stockMovementRows = await this.db.query(
          `SELECT sm.id, sm.variant_id, pv.sku, p.title_json, sm.delta, sm.reason, sm.reference_id, sm.created_at
       FROM stock_movements sm
       INNER JOIN product_variants pv ON pv.id = sm.variant_id
       INNER JOIN products p ON p.id = pv.product_id
       WHERE p.seller_id = ?
       ORDER BY sm.created_at DESC
       LIMIT 60`,
          [sellerId]
        );
        const stockMovements2 = stockMovementRows.map((sm) => ({
          id: sm.id,
          variantId: sm.variant_id,
          sku: sm.sku,
          productTitle: parseJson(sm.title_json, { en: sm.sku, ar: sm.sku }),
          delta: Number(sm.delta),
          reason: sm.reason,
          referenceId: sm.reference_id,
          createdAt: String(sm.created_at)
        }));
        const returnRows = await this.db.query(
          `SELECT r.*, o.order_number, so.seller_id
       FROM returns r
       INNER JOIN sub_orders so ON so.id = r.sub_order_id
       INNER JOIN orders o ON o.id = so.order_id
       WHERE so.seller_id = ?
       ORDER BY r.created_at DESC`,
          [sellerId]
        );
        const returnsList = returnRows.map((r) => ({
          id: String(r.id),
          subOrderId: String(r.sub_order_id),
          userId: String(r.user_id),
          reason: String(r.reason),
          status: String(r.status),
          refundUsdCents: Number(r.refund_usd_cents || 0),
          createdAt: String(r.created_at),
          orderNumber: r.order_number ? String(r.order_number) : void 0,
          sellerId: String(r.seller_id)
        }));
        const disputeRows = await this.db.query(
          `SELECT d.*, o.order_number, so.seller_id
       FROM disputes d
       INNER JOIN sub_orders so ON so.id = d.sub_order_id
       INNER JOIN orders o ON o.id = so.order_id
       WHERE so.seller_id = ?
       ORDER BY d.created_at DESC`,
          [sellerId]
        );
        const disputesList = disputeRows.map((d) => ({
          id: String(d.id),
          subOrderId: String(d.sub_order_id),
          openedByUserId: String(d.opened_by_user_id),
          reason: String(d.reason),
          status: String(d.status),
          resolutionNote: d.resolution_note ? String(d.resolution_note) : null,
          createdAt: String(d.created_at),
          orderNumber: d.order_number ? String(d.order_number) : void 0,
          sellerId: String(d.seller_id)
        }));
        const [
          subscriptionPlans2,
          deliveryZones2,
          sellerOffers,
          sellerPromoRules,
          categories2,
          brands2,
          attributes2,
          sellerStaff,
          notifications2
        ] = await Promise.all([
          this.getSubscriptionPlans(),
          this.getDeliveryZones(),
          this.sellerListOffers(sellerId),
          this.getSellerPromoRules(),
          this.getCategories(),
          this.getBrands(),
          this.getAttributes(),
          this.listSellerStaff(sellerId),
          this.getUserNotifications(seller.userId)
        ]);
        return {
          seller,
          products: products2,
          subOrders: subOrders2,
          balance,
          payouts: payouts2,
          coupons: coupons2,
          offers: sellerOffers,
          sellerPromoRules,
          reviews: reviews2,
          documents: docs.map((d) => ({
            id: d.id,
            doc_type: d.doc_type,
            media_id: d.media_id,
            review_status: d.review_status,
            reviewer_note: d.reviewer_note,
            public_url: d.public_url,
            created_at: String(d.created_at)
          })),
          commissionInfo,
          subscriptionPlans: subscriptionPlans2,
          deliveryZones: deliveryZones2,
          categories: categories2,
          brands: brands2,
          attributes: attributes2,
          stockMovements: stockMovements2,
          sellerStaff,
          returns: returnsList,
          disputes: disputesList,
          notifications: notifications2
        };
      }
      async updateSellerProfile(sellerId, actorUserId, patch, ipAddress) {
        return this.db.transaction(async (tx) => {
          const storeRow = await tx.queryOne("SELECT id, name_json, tagline_json, about_json, announcement_json, locations_json FROM stores WHERE seller_id = ?", [sellerId]);
          if (!storeRow) throw new Error("Store not found.");
          if (patch.bannerMediaId) {
            const bm = await tx.queryOne("SELECT id FROM media WHERE id = ?", [patch.bannerMediaId]);
            if (!bm) throw new Error("Banner image media asset not found.");
          }
          if (patch.logoMediaId) {
            const lm = await tx.queryOne("SELECT id FROM media WHERE id = ?", [patch.logoMediaId]);
            if (!lm) throw new Error("Store logo media asset not found.");
          }
          const currName = parseJson(storeRow.name_json, { en: "", ar: "" });
          const currTagline = parseJson(storeRow.tagline_json, { en: "", ar: "" });
          const currAbout = parseJson(storeRow.about_json, { en: "", ar: "" });
          const currAnn = storeRow.announcement_json ? parseJson(storeRow.announcement_json, { en: "", ar: "" }) : { en: "", ar: "" };
          const nextName = {
            en: patch.nameEn !== void 0 && patch.nameEn.trim() ? patch.nameEn.trim() : currName.en,
            ar: patch.nameAr !== void 0 && patch.nameAr.trim() ? patch.nameAr.trim() : currName.ar
          };
          const nextTagline = {
            en: patch.taglineEn !== void 0 ? patch.taglineEn : currTagline.en,
            ar: patch.taglineAr !== void 0 ? patch.taglineAr : currTagline.ar
          };
          const nextAbout = {
            en: patch.aboutEn !== void 0 ? patch.aboutEn : currAbout.en,
            ar: patch.aboutAr !== void 0 ? patch.aboutAr : currAbout.ar
          };
          const hasAnnChange = patch.announcementEn !== void 0 || patch.announcementAr !== void 0;
          const nextAnn = hasAnnChange ? {
            en: patch.announcementEn !== void 0 ? patch.announcementEn : currAnn.en,
            ar: patch.announcementAr !== void 0 ? patch.announcementAr : currAnn.ar
          } : null;
          let nextLocationsJson = null;
          let primaryLocation;
          if (patch.locations !== void 0) {
            const cleaned = patch.locations.filter((l) => Number.isFinite(l.lat) && Number.isFinite(l.lng)).slice(0, 15).map((l, idx) => ({
              id: (l.id || `loc-${idx + 1}`).trim().slice(0, 64),
              label: (l.label || `Branch ${idx + 1}`).trim().slice(0, 120),
              address: (l.address || "").trim().slice(0, 240),
              governorate: (l.governorate || "beirut").trim().slice(0, 60),
              district: (l.district || "").trim().slice(0, 80),
              lat: Number(l.lat),
              lng: Number(l.lng),
              placeId: l.placeId ? String(l.placeId).trim().slice(0, 140) : null,
              phone: l.phone ? String(l.phone).trim().slice(0, 40) : null,
              hours: l.hours ? String(l.hours).trim().slice(0, 120) : null,
              isPrimary: Boolean(l.isPrimary)
            }));
            if (cleaned.length > 0 && !cleaned.some((l) => l.isPrimary)) {
              cleaned[0].isPrimary = true;
            }
            let foundPrimary = false;
            const normalizedLocs = cleaned.map((l) => {
              if (l.isPrimary && !foundPrimary) {
                foundPrimary = true;
                return { ...l, isPrimary: true };
              }
              return { ...l, isPrimary: false };
            });
            primaryLocation = normalizedLocs.find((l) => l.isPrimary) || normalizedLocs[0];
            nextLocationsJson = JSON.stringify(normalizedLocs);
          }
          await tx.execute(
            `UPDATE stores SET name_json = ?, tagline_json = ?, about_json = ?,
         announcement_json = COALESCE(?, announcement_json),
         theme_id = COALESCE(?, theme_id),
         banner_media_id = COALESCE(?, banner_media_id),
         logo_media_id = COALESCE(?, logo_media_id),
         locations_json = CASE WHEN ? IS NOT NULL THEN ? ELSE locations_json END,
         updated_at = ?
         WHERE id = ?`,
            [
              JSON.stringify(nextName),
              JSON.stringify(nextTagline),
              JSON.stringify(nextAbout),
              nextAnn ? JSON.stringify(nextAnn) : null,
              patch.storefrontTheme || null,
              patch.bannerMediaId || null,
              patch.logoMediaId || null,
              nextLocationsJson,
              nextLocationsJson,
              toSqlTimestamp(),
              storeRow.id
            ]
          );
          const settingsRow = await tx.queryOne("SELECT * FROM store_settings WHERE store_id = ?", [storeRow.id]);
          const currRet = settingsRow?.return_policy_json ? parseJson(settingsRow.return_policy_json, { en: "", ar: "" }) : { en: "", ar: "" };
          const nextRet = patch.returnPolicyEn !== void 0 || patch.returnPolicyAr !== void 0 ? {
            en: patch.returnPolicyEn !== void 0 ? patch.returnPolicyEn : currRet.en,
            ar: patch.returnPolicyAr !== void 0 ? patch.returnPolicyAr : currRet.ar
          } : currRet;
          const nextFees = patch.selfDeliveryFeesUsdCents !== void 0 ? patch.selfDeliveryFeesUsdCents : parseJson(settingsRow?.self_delivery_fees_json, {});
          const currWorkingHours = settingsRow?.working_hours_json ? parseJson(settingsRow.working_hours_json, null) : null;
          const nextWorkingHours = patch.workingHours !== void 0 ? patch.workingHours : currWorkingHours;
          const currSocial = settingsRow?.social_links_json ? parseJson(settingsRow.social_links_json, {}) : {};
          const nextSocial = patch.communicationPrefs !== void 0 ? {
            ...currSocial,
            communicationPrefs: {
              whatsappEnabled: Boolean(patch.communicationPrefs.whatsappEnabled),
              whatsappGreeting: (patch.communicationPrefs.whatsappGreeting || "").trim().slice(0, 300),
              systemChatEnabled: Boolean(patch.communicationPrefs.systemChatEnabled),
              phoneCallsEnabled: Boolean(patch.communicationPrefs.phoneCallsEnabled),
              preferredChannel: patch.communicationPrefs.preferredChannel || "whatsapp"
            }
          } : currSocial;
          await tx.execute(
            `UPDATE store_settings
         SET delivery_mode = ?, self_delivery_fees_json = ?, processing_hours = ?, vacation_mode = ?, working_hours_json = ?, return_policy_json = ?, social_links_json = ?, seo_title = ?, seo_description = ?
         WHERE store_id = ?`,
            [
              patch.deliveryMode || settingsRow?.delivery_mode || "platform",
              JSON.stringify(nextFees),
              patch.processingHours !== void 0 ? Math.max(1, Math.min(360, Math.trunc(patch.processingHours))) : Number(settingsRow?.processing_hours ?? 24),
              patch.vacationMode !== void 0 ? patch.vacationMode ? 1 : 0 : settingsRow?.vacation_mode ? 1 : 0,
              nextWorkingHours ? JSON.stringify(nextWorkingHours) : null,
              JSON.stringify(nextRet),
              JSON.stringify(nextSocial),
              patch.seoTitle !== void 0 ? patch.seoTitle.trim() || null : settingsRow?.seo_title ?? null,
              patch.seoDescription !== void 0 ? patch.seoDescription.trim() || null : settingsRow?.seo_description ?? null,
              storeRow.id
            ]
          );
          if (patch.payoutMethod || patch.payoutAccount !== void 0 || patch.phone !== void 0 || patch.whatsappPhone !== void 0 || patch.cityAddress !== void 0 || primaryLocation) {
            await tx.execute(
              `UPDATE sellers
           SET payout_method = COALESCE(?, payout_method),
               payout_account = COALESCE(?, payout_account),
               phone = COALESCE(?, phone),
               whatsapp_phone = COALESCE(?, whatsapp_phone),
               governorate = COALESCE(?, governorate),
               district = COALESCE(?, district),
               city_address = COALESCE(?, city_address),
               updated_at = ?
           WHERE id = ?`,
              [
                patch.payoutMethod || null,
                patch.payoutAccount !== void 0 ? patch.payoutAccount.trim() : null,
                patch.phone !== void 0 ? normalizePhoneNumber(patch.phone) || patch.phone.trim() : null,
                patch.whatsappPhone !== void 0 ? patch.whatsappPhone.trim() : null,
                primaryLocation?.governorate || null,
                primaryLocation?.district || null,
                patch.cityAddress !== void 0 ? patch.cityAddress.trim() : primaryLocation?.address || null,
                toSqlTimestamp(),
                sellerId
              ]
            );
          }
          await writeAuditLog(tx, {
            actorUserId,
            action: "seller.update_storefront",
            entityType: "store",
            entityId: storeRow.id,
            after: patch,
            ipAddress
          });
          const updatedSellerRow = await tx.queryOne(
            `SELECT sel.*, st.slug, st.name_json, st.tagline_json, st.about_json, st.announcement_json,
                st.department_slug, st.theme_id, st.logo_media_id, st.banner_media_id, st.locations_json, st.rating_avg_x10, st.review_count,
                ss.delivery_mode, ss.self_delivery_fees_json, ss.processing_hours, ss.vacation_mode, ss.working_hours_json, ss.return_policy_json, ss.social_links_json, ss.seo_title, ss.seo_description
         FROM sellers sel INNER JOIN stores st ON st.seller_id = sel.id LEFT JOIN store_settings ss ON ss.store_id = st.id
         WHERE sel.id = ? LIMIT 1`,
            [sellerId]
          );
          return updatedSellerRow ? this.mapSellerRow(updatedSellerRow, tx) : null;
        });
      }
      async createSellerProduct(sellerId, actorUserId, input, ipAddress) {
        if (!Number.isInteger(input.basePriceUsdCents) || input.basePriceUsdCents <= 0) {
          throw new Error("Price must be a positive integer in USD cents.");
        }
        const seller = await this.getSellerById(sellerId);
        if (!seller) throw new Error("Seller not found.");
        return this.db.transaction(async (tx) => {
          const planRow = await tx.queryOne(
            "SELECT product_limit FROM subscription_plans WHERE tier = ?",
            [seller.subscriptionTier]
          );
          if (planRow && planRow.product_limit !== null) {
            const cntRow = await tx.queryOne(
              "SELECT COUNT(*) AS cnt FROM products WHERE seller_id = ? AND deleted_at IS NULL",
              [sellerId]
            );
            if (Number(cntRow?.cnt ?? 0) >= Number(planRow.product_limit)) {
              throw new Error(`Your ${seller.subscriptionTier.toUpperCase()} plan limit (${planRow.product_limit} SKUs) has been reached.`);
            }
          }
          const prodId = `prd-${crypto5.randomUUID()}`;
          const slugBase = input.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
          const slug = `${slugBase}-${crypto5.randomInt(1e3, 9999)}`;
          const dept = input.department || seller.department;
          const categoryId = input.categoryId?.trim() || `cat-${dept === "home-gadgets" ? "home" : dept}`;
          const now = toSqlTimestamp();
          await tx.execute(
            `INSERT INTO products (id, seller_id, category_id, brand_id, department, slug, title_json, subtitle_json, description_json, specs_json, base_price_usd_cents, compare_at_usd_cents, seller_currency, moderation_status, published, featured, model_3d_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'USD', 'approved', ?, 0, ?, ?, ?)`,
            [
              prodId,
              sellerId,
              categoryId,
              input.brandId || null,
              dept,
              slug,
              JSON.stringify({ en: input.titleEn.trim(), ar: (input.titleAr || input.titleEn).trim() }),
              JSON.stringify({ en: (input.subtitleEn || "").trim(), ar: (input.subtitleAr || input.subtitleEn || "").trim() }),
              JSON.stringify({ en: (input.descriptionEn || input.titleEn).trim(), ar: (input.descriptionAr || input.titleAr || input.titleEn).trim() }),
              JSON.stringify(input.specs || []),
              input.basePriceUsdCents,
              input.compareAtUsdCents || null,
              input.published === false ? 0 : 1,
              input.model3dUrl?.trim() || null,
              now,
              now
            ]
          );
          const variantsInput = input.variants && input.variants.length > 0 ? input.variants : [
            {
              sku: input.sku,
              size: input.size,
              color: input.color,
              colorHex: input.colorHex,
              stock: input.stock,
              priceDeltaUsdCents: 0
            }
          ];
          for (const v of variantsInput) {
            const varId = `var-${crypto5.randomUUID()}`;
            const vStock = Math.max(0, Math.trunc(v.stock));
            await tx.execute(
              `INSERT INTO product_variants (id, product_id, sku, size, color, color_hex, stock, price_delta_usd_cents)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                varId,
                prodId,
                v.sku.trim(),
                v.size?.trim() || null,
                (v.color || "Default").trim(),
                v.colorHex || "#1C1D21",
                vStock,
                Math.trunc(v.priceDeltaUsdCents || 0)
              ]
            );
            await tx.execute(
              "INSERT INTO stock_movements (id, variant_id, delta, reason, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
              [`stk-${crypto5.randomUUID()}`, varId, vStock, "initial_stock", prodId, now]
            );
          }
          if (input.mediaIds && input.mediaIds.length > 0) {
            for (const mId of input.mediaIds) {
              await tx.execute("UPDATE media SET entity_id = ? WHERE id = ? AND owner_user_id = ?", [
                prodId,
                mId,
                actorUserId
              ]);
            }
          }
          await writeAuditLog(tx, {
            actorUserId,
            action: "seller.create_product",
            entityType: "product",
            entityId: prodId,
            after: { sku: input.sku.trim(), basePriceUsdCents: input.basePriceUsdCents },
            ipAddress
          });
          const created = await tx.queryOne("SELECT * FROM products WHERE id = ?", [prodId]);
          const [mapped] = await this.mapProductRows([created], tx);
          return mapped;
        });
      }
      async toggleProductPublished(sellerId, productId, actorUserId, ipAddress) {
        const row = await this.db.queryOne(
          "SELECT * FROM products WHERE id = ? AND seller_id = ? AND deleted_at IS NULL",
          [productId, sellerId]
        );
        if (!row) throw new Error("Product not found.");
        const nextPub = row.published ? 0 : 1;
        await this.db.execute("UPDATE products SET published = ?, updated_at = ? WHERE id = ?", [
          nextPub,
          toSqlTimestamp(),
          productId
        ]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "seller.toggle_product",
          entityType: "product",
          entityId: productId,
          after: { published: Boolean(nextPub) },
          ipAddress
        });
        const updated = await this.db.queryOne("SELECT * FROM products WHERE id = ?", [productId]);
        const [mapped] = await this.mapProductRows([updated]);
        return mapped;
      }
      async updateSubOrderStatus(subOrderId, actor, patch, ipAddress) {
        return this.db.transaction(async (tx) => {
          const sub = await tx.queryOne("SELECT * FROM sub_orders WHERE id = ?", [subOrderId]);
          if (!sub) throw new Error("Sub-order not found.");
          const isAdmin = actor.roleKey === "admin_super" || actor.roleKey === "admin_staff";
          if (!isAdmin && sub.seller_id !== actor.sellerId) {
            throw new Error("Unauthorized sub-order access.");
          }
          const nextStatus = patch.status || String(sub.status);
          const nextCod = patch.codCollected !== void 0 ? patch.codCollected ? 1 : 0 : Number(sub.cod_collected);
          const now = toSqlTimestamp();
          const deliveredAt = nextStatus === "delivered" && !sub.delivered_at ? now : sub.delivered_at;
          await tx.execute(
            `UPDATE sub_orders SET status = ?, cod_collected = ?, courier_name = COALESCE(?, courier_name), tracking_code = COALESCE(?, tracking_code), delivered_at = ?, updated_at = ? WHERE id = ?`,
            [nextStatus, nextCod, patch.courierName || null, patch.trackingCode || null, deliveredAt, now, subOrderId]
          );
          if (patch.codCollected && !sub.cod_collected) {
            const orderRow = await tx.queryOne("SELECT order_number FROM orders WHERE id = ?", [
              sub.order_id
            ]);
            await tx.execute(
              `INSERT INTO ledger_entries (id, seller_id, sub_order_id, order_number, entry_type, direction, amount_usd_cents, availability, note, created_at)
           VALUES (?, ?, ?, ?, 'COD_COLLECTED', 'credit', 0, 'pending', ?, ?)`,
              [
                `led-${crypto5.randomUUID()}`,
                sub.seller_id,
                subOrderId,
                orderRow?.order_number || null,
                `COD collected on ${orderRow?.order_number || subOrderId}`,
                now
              ]
            );
          }
          if (patch.status && patch.status !== sub.status) {
            const orderRow = await tx.queryOne(
              "SELECT order_number, user_id FROM orders WHERE id = ?",
              [sub.order_id]
            );
            if (orderRow?.user_id) {
              await this.createNotification(
                tx,
                orderRow.user_id,
                {
                  en: `Order ${orderRow.order_number} update: ${nextStatus}`,
                  ar: `\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0637\u0644\u0628 ${orderRow.order_number}: ${nextStatus}`
                },
                {
                  en: `Shipment status changed to ${nextStatus}${patch.trackingCode ? ` (Tracking: ${patch.trackingCode})` : ""}.`,
                  ar: `\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u0627\u0644\u0634\u062D\u0646\u0629 \u0625\u0644\u0649 ${nextStatus}${patch.trackingCode ? ` (\u0631\u0645\u0632 \u0627\u0644\u062A\u062A\u0628\u0639: ${patch.trackingCode})` : ""}.`
                },
                {
                  category: "order",
                  actionUrl: "/orders",
                  metadata: {
                    subOrderId,
                    orderNumber: orderRow.order_number,
                    status: nextStatus,
                    trackingCode: patch.trackingCode || null
                  }
                }
              );
            }
          }
          await writeAuditLog(tx, {
            actorUserId: actor.id,
            action: "sub_order.update",
            entityType: "sub_order",
            entityId: subOrderId,
            before: { status: sub.status, codCollected: Boolean(sub.cod_collected) },
            after: { status: nextStatus, codCollected: Boolean(nextCod) },
            ipAddress
          });
          return tx.queryOne("SELECT * FROM sub_orders WHERE id = ?", [subOrderId]);
        });
      }
      async createCoupon(sellerId, actorUserId, input, ipAddress) {
        const clean = input.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
        if (clean.length < 3) throw new Error("Coupon code must be at least 3 alphanumeric characters.");
        const discountType = input.discountType || "percent";
        const rawVal = input.discountValue ?? input.discountPercent ?? 10;
        const discountValue = discountType === "free_shipping" ? 0 : Math.round(rawVal);
        if (discountType === "percent" && (discountValue < 1 || discountValue > 90)) {
          throw new Error("Discount percent must be 1\u201390%.");
        }
        if (discountType === "fixed_usd_cents" && discountValue < 50) {
          throw new Error("Fixed USD coupon discount must be at least $0.50 (50 cents).");
        }
        const dup = await this.db.queryOne("SELECT id FROM coupons WHERE UPPER(code) = ?", [clean]);
        if (dup) throw new Error(`Coupon code ${clean} already exists.`);
        const id = `cpn-${crypto5.randomUUID()}`;
        await this.db.execute(
          `INSERT INTO coupons (id, code, seller_id, discount_type, discount_value, max_discount_usd_cents, min_order_usd_cents, target_type, target_id, campaign_id, max_uses, per_customer_limit, used_count, first_order_only, auto_generated_batch, starts_at, ends_at, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`,
          [
            id,
            clean,
            sellerId,
            discountType,
            discountValue,
            input.maxDiscountUsdCents ? Math.max(1, Math.trunc(input.maxDiscountUsdCents)) : null,
            Math.max(0, Math.trunc(input.minOrderUsdCents || 0)),
            input.targetType || "all",
            input.targetId?.trim() || null,
            input.campaignId?.trim() || null,
            input.maxUses ? Math.max(1, Math.trunc(input.maxUses)) : null,
            Math.max(1, Math.trunc(input.perCustomerLimit ?? 1)),
            input.firstOrderOnly ? 1 : 0,
            input.autoGeneratedBatch || null,
            input.startsAt ? toSqlTimestamp(new Date(input.startsAt)) : null,
            input.endsAt ? toSqlTimestamp(new Date(input.endsAt)) : null,
            input.active === false ? 0 : 1
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "coupon.created",
          entityType: "coupon",
          entityId: id,
          after: { code: clean, discountType, discountValue, sellerId },
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM coupons WHERE id = ?", [id]);
        return this.mapCouponRow(row);
      }
      async adminGenerateBulkCoupons(actorUserId, input, ipAddress) {
        const safePrefix = input.prefix.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "") || "NL";
        const qty = Math.min(200, Math.max(1, Math.trunc(input.count)));
        const batchId = `batch-${crypto5.randomUUID().slice(0, 8)}`;
        const created = [];
        for (let i = 0; i < qty; i++) {
          const suffix = crypto5.randomBytes(3).toString("hex").toUpperCase();
          const code = `${safePrefix}-${suffix}`;
          const c = await this.createCoupon(
            null,
            actorUserId,
            {
              code,
              discountType: input.discountType,
              discountValue: input.discountValue,
              minOrderUsdCents: input.minOrderUsdCents,
              maxDiscountUsdCents: input.maxDiscountUsdCents,
              perCustomerLimit: input.perCustomerLimit ?? 1,
              maxUses: input.maxUsesPerCode ?? 1,
              startsAt: input.startsAt,
              endsAt: input.endsAt,
              campaignId: input.campaignId,
              autoGeneratedBatch: batchId
            },
            ipAddress
          );
          created.push(c);
        }
        return { batchId, created };
      }
      async adminImportCouponsCsv(actorUserId, csvText, ipAddress) {
        const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        let imported = 0;
        const skipped = [];
        for (let i = 0; i < lines.length; i++) {
          const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
          if (i === 0 && cols[0]?.toLowerCase() === "code") continue;
          const code = (cols[0] || "").toUpperCase().replace(/[^A-Z0-9_-]/g, "");
          const dType = cols[1] || "percent";
          const dVal = Math.round(Number(cols[2] || 10));
          const minOrderCents = Math.max(0, Math.round(Number(cols[3] || 0) * 100));
          const maxUses = cols[4] ? Math.max(1, Math.trunc(Number(cols[4]))) : null;
          const perCust = cols[5] ? Math.max(1, Math.trunc(Number(cols[5]))) : 1;
          if (!code || code.length < 3 || Number.isNaN(dVal)) {
            skipped.push(cols[0] || `row_${i + 1}`);
            continue;
          }
          try {
            await this.createCoupon(
              null,
              actorUserId,
              {
                code,
                discountType: ["percent", "fixed_usd_cents", "free_shipping"].includes(dType) ? dType : "percent",
                discountValue: dType === "fixed_usd_cents" && dVal < 100 ? dVal * 100 : dVal,
                minOrderUsdCents: minOrderCents,
                maxUses,
                perCustomerLimit: perCust
              },
              ipAddress
            );
            imported++;
          } catch {
            skipped.push(code);
          }
        }
        return { imported, skipped };
      }
      async adminExportCouponsCsv() {
        const rows = await this.db.query("SELECT * FROM coupons ORDER BY code ASC");
        const safeCsvCell = (raw) => {
          const s = String(raw ?? "");
          const neutralized = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
          return `"${neutralized.replace(/"/g, '""')}"`;
        };
        const header = "code,discount_type,discount_value,min_order_usd,max_uses,per_customer_limit,used_count,active";
        const body = rows.map((r) => {
          const c = this.mapCouponRow(r);
          return [
            safeCsvCell(c.code),
            safeCsvCell(c.discountType),
            String(c.discountValue),
            (c.minOrderUsdCents / 100).toFixed(2),
            c.maxUses ?? "",
            String(c.perCustomerLimit),
            String(c.usedCount),
            c.active ? "1" : "0"
          ].join(",");
        });
        return [header, ...body].join("\n");
      }
      async adminUpdateCoupon(id, actorUserId, patch, ipAddress) {
        const existing = await this.db.queryOne("SELECT * FROM coupons WHERE id = ?", [id]);
        if (!existing) throw new Error("Coupon not found.");
        await this.db.execute("UPDATE coupons SET active = ?, max_uses = ?, ends_at = ? WHERE id = ?", [
          patch.active !== void 0 ? patch.active ? 1 : 0 : existing.active ? 1 : 0,
          patch.maxUses !== void 0 ? patch.maxUses : existing.max_uses,
          patch.endsAt !== void 0 ? patch.endsAt ? toSqlTimestamp(new Date(patch.endsAt)) : null : existing.ends_at,
          id
        ]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "coupon.updated",
          entityType: "coupon",
          entityId: id,
          after: patch,
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM coupons WHERE id = ?", [id]);
        return this.mapCouponRow(row);
      }
      async adminDeleteCoupon(id, actorUserId, ipAddress) {
        await this.db.execute("DELETE FROM coupons WHERE id = ?", [id]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "coupon.deleted",
          entityType: "coupon",
          entityId: id,
          ipAddress
        });
      }
      async requestPayout(sellerId, actorUserId, amountUsdCents, ipAddress) {
        if (!Number.isInteger(amountUsdCents) || amountUsdCents < 1e3) {
          throw new Error("Minimum payout request is $10.00.");
        }
        const seller = await this.getSellerById(sellerId);
        if (!seller) throw new Error("Seller not found.");
        return this.db.transaction(async (tx) => {
          const bal = await this.getSellerBalance(sellerId);
          const withdrawable = bal.availableUsdCents - bal.reservedForPayoutsUsdCents;
          if (amountUsdCents > withdrawable) {
            throw new Error(`Requested payout exceeds available balance ($${(withdrawable / 100).toFixed(2)}).`);
          }
          const id = `payreq-${crypto5.randomUUID()}`;
          const now = toSqlTimestamp();
          await tx.execute(
            `INSERT INTO payouts (id, seller_id, amount_usd_cents, method, account_details, status, created_at)
         VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
            [id, sellerId, amountUsdCents, seller.payoutMethod, seller.payoutAccount, now]
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: "payout.requested",
            entityType: "payout",
            entityId: id,
            after: { sellerId, amountUsdCents },
            ipAddress
          });
          return {
            id,
            sellerId,
            sellerName: seller.name,
            amountUsdCents,
            method: seller.payoutMethod,
            accountDetails: seller.payoutAccount,
            status: "pending",
            createdAt: now
          };
        });
      }
      async replyToReview(sellerId, reviewId, reply) {
        const rev = await this.db.queryOne("SELECT id FROM reviews WHERE id = ? AND seller_id = ?", [
          reviewId,
          sellerId
        ]);
        if (!rev) throw new Error("Review not found.");
        await this.db.execute("UPDATE reviews SET seller_reply = ? WHERE id = ?", [reply.trim(), reviewId]);
        return this.db.queryOne("SELECT * FROM reviews WHERE id = ?", [reviewId]);
      }
      // --- Admin Console ---
      async getAdminOverview() {
        const [settings2, paymentsConfig, categories2, brands2, attributes2, deliveryZones2, subscriptionPlans2, pages2, menus2] = await Promise.all([
          this.getPlatformSettings(),
          this.getPaymentConfig(),
          this.getCategories(),
          this.getBrands(),
          this.getAttributes(),
          this.getDeliveryZones(),
          this.getSubscriptionPlans(),
          this.getAllPages(),
          this.adminListMenus()
        ]);
        const sellerRows = await this.db.query(
          `SELECT sel.*, st.slug, st.name_json, st.tagline_json, st.about_json, st.announcement_json,
              st.department_slug, st.theme_id, st.logo_media_id, st.banner_media_id, st.locations_json, st.rating_avg_x10, st.review_count,
              ss.delivery_mode, ss.self_delivery_fees_json, ss.processing_hours, ss.vacation_mode, ss.working_hours_json, ss.return_policy_json, ss.social_links_json, ss.seo_title, ss.seo_description
       FROM sellers sel
       INNER JOIN stores st ON st.seller_id = sel.id
       LEFT JOIN store_settings ss ON ss.store_id = st.id
       WHERE sel.deleted_at IS NULL ORDER BY sel.created_at DESC`
        );
        const sellers2 = [];
        for (const r of sellerRows) sellers2.push(await this.mapSellerRow(r));
        const prodRows = await this.db.query(
          "SELECT * FROM products WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 200"
        );
        const products2 = await this.mapProductRows(prodRows);
        const sellerDocRows = await this.db.query(
          `SELECT d.id, d.seller_id, d.doc_type, d.media_id, m.public_url, d.review_status, d.reviewer_note, d.created_at
       FROM seller_documents d
       INNER JOIN media m ON m.id = d.media_id
       ORDER BY d.created_at DESC LIMIT 100`
        );
        const sellerDocuments2 = sellerDocRows.map((d) => ({
          id: d.id,
          sellerId: d.seller_id,
          docType: d.doc_type,
          mediaId: d.media_id,
          publicUrl: d.public_url,
          reviewStatus: d.review_status,
          reviewerNote: d.reviewer_note,
          createdAt: String(d.created_at)
        }));
        const orderRows = await this.db.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100");
        const orders2 = await this.hydrateOrders(orderRows);
        const returnRows = await this.db.query(
          `SELECT r.*, o.order_number, so.seller_id
       FROM returns r
       INNER JOIN sub_orders so ON so.id = r.sub_order_id
       INNER JOIN orders o ON o.id = so.order_id
       ORDER BY r.created_at DESC LIMIT 100`
        );
        const returnsList = returnRows.map((r) => ({
          id: String(r.id),
          subOrderId: String(r.sub_order_id),
          userId: String(r.user_id),
          reason: String(r.reason),
          status: String(r.status),
          refundUsdCents: Number(r.refund_usd_cents || 0),
          createdAt: String(r.created_at),
          orderNumber: r.order_number ? String(r.order_number) : void 0,
          sellerId: r.seller_id ? String(r.seller_id) : void 0
        }));
        const disputeRows = await this.db.query(
          `SELECT d.*, o.order_number, so.seller_id
       FROM disputes d
       INNER JOIN sub_orders so ON so.id = d.sub_order_id
       INNER JOIN orders o ON o.id = so.order_id
       ORDER BY d.created_at DESC LIMIT 100`
        );
        const disputesList = disputeRows.map((d) => ({
          id: String(d.id),
          subOrderId: String(d.sub_order_id),
          openedByUserId: String(d.opened_by_user_id),
          reason: String(d.reason),
          status: String(d.status),
          resolutionNote: d.resolution_note ? String(d.resolution_note) : null,
          createdAt: String(d.created_at),
          orderNumber: d.order_number ? String(d.order_number) : void 0,
          sellerId: d.seller_id ? String(d.seller_id) : void 0
        }));
        const ticketRows = await this.db.query(
          "SELECT * FROM support_tickets ORDER BY created_at DESC LIMIT 100"
        );
        const supportTickets2 = ticketRows.map((t) => ({
          id: String(t.id),
          userId: t.user_id ? String(t.user_id) : null,
          email: String(t.email),
          subject: String(t.subject),
          message: String(t.message),
          status: String(t.status),
          createdAt: String(t.created_at)
        }));
        const reviewRows = await this.db.query(
          `SELECT r.*, u.name AS author_name, p.title_json AS product_title_json
       FROM reviews r
       INNER JOIN users u ON u.id = r.user_id
       LEFT JOIN products p ON p.id = r.product_id
       ORDER BY r.created_at DESC LIMIT 100`
        );
        const reviews2 = reviewRows.map((r) => ({
          id: r.id,
          productId: r.product_id,
          sellerId: r.seller_id,
          userId: r.user_id,
          authorName: r.author_name,
          rating: Number(r.rating),
          comment: r.comment,
          verifiedBuyer: Boolean(r.verified_buyer),
          sellerReply: r.seller_reply || void 0,
          moderationStatus: r.moderation_status || "approved",
          productTitle: r.product_title_json ? parseJson(r.product_title_json, { en: r.product_id, ar: r.product_id }) : void 0,
          createdAt: String(r.created_at)
        }));
        const emailTplRows = await this.db.query(`SELECT ${this.keyCol()} AS tpl_key, subject_json, body_json, updated_at FROM email_templates ORDER BY ${this.keyCol()} ASC`);
        const emailTemplates2 = emailTplRows.map((et) => ({
          key: String(et.tpl_key),
          subject: parseJson(et.subject_json, { en: "", ar: "" }),
          body: parseJson(et.body_json, { en: "", ar: "" }),
          updatedAt: String(et.updated_at)
        }));
        const payoutRows = await this.db.query("SELECT * FROM payouts ORDER BY created_at DESC LIMIT 100");
        const payouts2 = payoutRows.map((p) => {
          const sel = sellers2.find((s) => s.id === p.seller_id);
          return {
            id: String(p.id),
            sellerId: String(p.seller_id),
            sellerName: sel?.name || { en: "Seller", ar: "\u0628\u0627\u0626\u0639" },
            amountUsdCents: Number(p.amount_usd_cents),
            method: String(p.method),
            accountDetails: String(p.account_details),
            status: String(p.status),
            referenceCode: p.reference_code ? String(p.reference_code) : null,
            createdAt: String(p.created_at),
            settledAt: p.settled_at ? String(p.settled_at) : null
          };
        });
        const couponRows = await this.db.query("SELECT * FROM coupons ORDER BY code ASC");
        const coupons2 = couponRows.map((c) => this.mapCouponRow(c));
        const ledgerRows = await this.db.query("SELECT * FROM ledger_entries ORDER BY created_at DESC LIMIT 50");
        const ledger = ledgerRows.map((r) => ({
          id: String(r.id),
          sellerId: String(r.seller_id),
          subOrderId: r.sub_order_id ? String(r.sub_order_id) : null,
          orderNumber: r.order_number ? String(r.order_number) : null,
          type: String(r.entry_type),
          direction: String(r.direction),
          amountUsdCents: Number(r.amount_usd_cents),
          availability: String(r.availability),
          note: String(r.note),
          createdAt: String(r.created_at)
        }));
        const auditRows = await this.db.query("SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 60");
        const auditLog2 = auditRows.map((a) => ({
          id: String(a.id),
          actorUserId: a.actor_user_id ? String(a.actor_user_id) : null,
          action: String(a.action),
          entityType: String(a.entity_type),
          entityId: String(a.entity_id),
          beforeJson: a.before_json ? String(a.before_json) : null,
          afterJson: a.after_json ? String(a.after_json) : null,
          ipAddress: a.ip_address ? String(a.ip_address) : null,
          createdAt: String(a.created_at)
        }));
        const staffRows = await this.db.query(
          "SELECT id, name, email, role_key, totp_enabled, created_at FROM users WHERE role_key IN ('admin_super', 'admin_staff') AND deleted_at IS NULL ORDER BY created_at ASC"
        );
        const staffUsers = [];
        for (const u of staffRows) {
          const perms = await this.db.query("SELECT permission_key FROM user_permissions WHERE user_id = ?", [
            u.id
          ]);
          staffUsers.push({
            id: u.id,
            name: u.name,
            email: u.email,
            roleKey: u.role_key,
            totpEnabled: Boolean(u.totp_enabled),
            permissions: perms.map((p) => p.permission_key),
            createdAt: String(u.created_at)
          });
        }
        const userSummaryRows = await this.db.query(
          "SELECT id, name, email, phone, role_key, is_blocked, totp_enabled, email_verified_at, phone_verified_at, created_at FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 120"
        );
        const users2 = [];
        for (const u of userSummaryRows) {
          const [perms, ordCntRow, sessCntRow, lastAuditRow] = await Promise.all([
            this.db.query("SELECT permission_key FROM user_permissions WHERE user_id = ?", [u.id]),
            this.db.queryOne("SELECT COUNT(*) AS cnt FROM orders WHERE user_id = ?", [u.id]),
            this.db.queryOne("SELECT COUNT(*) AS cnt FROM sessions WHERE user_id = ?", [u.id]),
            this.db.queryOne(
              "SELECT created_at FROM audit_log WHERE actor_user_id = ? OR (entity_type = 'user' AND entity_id = ?) ORDER BY created_at DESC LIMIT 1",
              [u.id, u.id]
            )
          ]);
          const ownedSeller = sellers2.find((s) => s.userId === u.id) || null;
          const emailVerifiedAt = u.email_verified_at ? String(u.email_verified_at) : null;
          const phoneVerifiedAt = u.phone_verified_at ? String(u.phone_verified_at) : null;
          users2.push({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            roleKey: u.role_key,
            isBlocked: Boolean(u.is_blocked),
            totpEnabled: Boolean(u.totp_enabled),
            emailVerifiedAt,
            phoneVerifiedAt,
            isFullyVerified: Boolean(emailVerifiedAt && phoneVerifiedAt),
            permissions: perms.map((p) => p.permission_key),
            ordersCount: Number(ordCntRow?.cnt ?? 0),
            activeSessionsCount: Number(sessCntRow?.cnt ?? 0),
            sellerId: ownedSeller?.id ?? null,
            sellerName: ownedSeller ? ownedSeller.name.en : null,
            lastActivityAt: lastAuditRow?.created_at ? String(lastAuditRow.created_at) : String(u.created_at),
            createdAt: String(u.created_at)
          });
        }
        const recentJobs = await this.db.query("SELECT id, job_type, status, attempts, last_error, created_at FROM jobs ORDER BY created_at DESC LIMIT 25");
        const emailLog2 = await this.db.query("SELECT * FROM email_log ORDER BY created_at DESC LIMIT 25");
        const errorLog2 = await this.db.query("SELECT id, route, message, created_at FROM error_log ORDER BY created_at DESC LIMIT 25");
        const prodCnt = await this.db.queryOne("SELECT COUNT(*) AS cnt FROM products WHERE deleted_at IS NULL");
        const totalGmvUsdCents = orders2.reduce((sum, o) => sum + o.subtotalUsdCents - o.discountTotalUsdCents, 0);
        const totalCommissionUsdCents = orders2.reduce(
          (sum, o) => sum + o.subOrders.reduce((sSum, sub) => sSum + sub.commissionUsdCents, 0),
          0
        );
        const activeSubsUsdCents = sellers2.filter((s) => s.status === "approved").reduce((sum, s) => {
          const plan = subscriptionPlans2.find((p) => p.tier === s.subscriptionTier);
          return sum + (plan?.monthlyFeeUsdCents || 0);
        }, 0);
        const [
          homeBuilderData,
          bannersList,
          popupsList,
          featuredPlacementsList,
          offersList,
          flashSalesList,
          campaignsList,
          segmentsList,
          emailCampaignsList,
          automationFlowsList,
          newsletterSubscribersList,
          sellerPromoRules,
          marketingAnalytics,
          seoMetadata
        ] = await Promise.all([
          this.adminListHomeSections(),
          this.adminListBanners(),
          this.adminListPopups(),
          this.adminListFeaturedPlacements(),
          this.adminListOffers(),
          this.adminListFlashSales(),
          this.adminListCampaigns(),
          this.adminListSegments(),
          this.adminListEmailCampaigns(),
          this.adminListAutomationFlows(),
          this.adminListNewsletterSubscribers(),
          this.getSellerPromoRules(),
          this.getMarketingAnalytics(),
          this.getSeoMetadata()
        ]);
        return {
          metrics: {
            totalGmvUsdCents,
            totalCommissionUsdCents,
            activeSubsUsdCents,
            ordersCount: orders2.length,
            sellersCount: sellers2.length,
            productsCount: Number(prodCnt?.cnt ?? 0)
          },
          settings: settings2,
          paymentsConfig,
          categories: categories2,
          brands: brands2,
          attributes: attributes2,
          sellers: sellers2,
          products: products2,
          sellerDocuments: sellerDocuments2,
          orders: orders2,
          returns: returnsList,
          disputes: disputesList,
          supportTickets: supportTickets2,
          reviews: reviews2,
          emailTemplates: emailTemplates2,
          payouts: payouts2,
          coupons: coupons2,
          deliveryZones: deliveryZones2,
          subscriptionPlans: subscriptionPlans2,
          ledger,
          pages: pages2,
          menus: menus2,
          homeSections: homeBuilderData.sections,
          homeSectionVersions: homeBuilderData.versionsBySectionId,
          banners: bannersList,
          popups: popupsList,
          featuredPlacements: featuredPlacementsList,
          offers: offersList,
          flashSales: flashSalesList,
          campaigns: campaignsList,
          segments: segmentsList,
          emailCampaigns: emailCampaignsList,
          automationFlows: automationFlowsList,
          newsletterSubscribers: newsletterSubscribersList,
          sellerPromoRules,
          marketingAnalytics,
          seoMetadata,
          auditLog: auditLog2,
          staffUsers,
          users: users2,
          recentJobs,
          emailLog: emailLog2,
          errorLog: errorLog2
        };
      }
      async adminUpdateSeller(sellerId, actorUserId, patch, ipAddress) {
        return this.db.transaction(async (tx) => {
          const prev = await tx.queryOne("SELECT status, owner_user_id FROM sellers WHERE id = ?", [
            sellerId
          ]);
          if (!prev) throw new Error("Seller not found.");
          const now = toSqlTimestamp();
          await tx.execute(
            `UPDATE sellers SET
         status = COALESCE(?, status),
         verified = COALESCE(?, verified),
         custom_commission_bps = ?,
         updated_at = ?
         WHERE id = ?`,
            [
              patch.status || null,
              patch.verified !== void 0 ? patch.verified ? 1 : 0 : null,
              patch.customCommissionBps !== void 0 ? patch.customCommissionBps : null,
              now,
              sellerId
            ]
          );
          if (patch.subscriptionTier) {
            await tx.execute(
              "UPDATE subscriptions SET plan_tier = ? WHERE seller_id = ?",
              [patch.subscriptionTier, sellerId]
            );
          }
          if (patch.status && patch.status !== prev.status) {
            await this.createNotification(
              tx,
              prev.owner_user_id,
              { en: `Store status: ${patch.status}`, ar: `\u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u062A\u062C\u0631: ${patch.status}` },
              {
                en: `Your merchant account status was updated to ${patch.status}.`,
                ar: `\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u062D\u0633\u0627\u0628 \u0645\u062A\u062C\u0631\u0643 \u0625\u0644\u0649 ${patch.status}.`
              }
            );
          }
          if (patch.status === "approved" && prev.status !== "approved") {
            const owner = await tx.queryOne("SELECT email, preferred_locale FROM users WHERE id = ?", [
              prev.owner_user_id
            ]);
            const store = await tx.queryOne("SELECT name_json FROM stores WHERE seller_id = ?", [
              sellerId
            ]);
            if (owner) {
              const storeName = parseJson(store?.name_json, { en: "Store", ar: "\u0645\u062A\u062C\u0631" });
              await queueEmail(tx, {
                to: owner.email,
                templateKey: "seller_approved",
                locale: owner.preferred_locale === "ar" ? "ar" : "en",
                vars: { storeName: storeName.en }
              });
            }
          }
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.update_seller",
            entityType: "seller",
            entityId: sellerId,
            before: { status: prev.status },
            after: patch,
            ipAddress
          });
          const updatedRow = await tx.queryOne(
            `SELECT sel.*, st.slug, st.name_json, st.tagline_json, st.about_json, st.announcement_json,
                st.department_slug, st.theme_id, st.logo_media_id, st.banner_media_id, st.locations_json, st.rating_avg_x10, st.review_count,
                ss.delivery_mode, ss.self_delivery_fees_json, ss.processing_hours, ss.vacation_mode, ss.working_hours_json, ss.return_policy_json, ss.social_links_json, ss.seo_title, ss.seo_description
         FROM sellers sel INNER JOIN stores st ON st.seller_id = sel.id LEFT JOIN store_settings ss ON ss.store_id = st.id
         WHERE sel.id = ? LIMIT 1`,
            [sellerId]
          );
          return updatedRow ? this.mapSellerRow(updatedRow, tx) : null;
        });
      }
      async adminUpdateSettings(actorUserId, patch, ipAddress) {
        return this.db.transaction(async (tx) => {
          const kCol = this.keyCol();
          if (patch.platform) {
            const curr = await this.getPlatformSettings();
            const next = { ...curr, ...patch.platform };
            await tx.execute(`UPDATE settings SET value_json = ?, updated_at = ? WHERE ${kCol} = 'platform'`, [
              JSON.stringify(next),
              toSqlTimestamp()
            ]);
          }
          if (patch.payments) {
            const row = await tx.queryOne(`SELECT value_json FROM settings WHERE ${kCol} = 'payments'`);
            const curr = parseJson(row?.value_json, {});
            const next = { ...curr, ...patch.payments };
            await tx.execute(`UPDATE settings SET value_json = ?, updated_at = ? WHERE ${kCol} = 'payments'`, [
              JSON.stringify(next),
              toSqlTimestamp()
            ]);
          }
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.update_settings",
            entityType: "settings",
            entityId: "global",
            after: patch,
            ipAddress
          });
          return { settings: await this.getPlatformSettings(), paymentsConfig: await this.getPaymentConfig() };
        });
      }
      async adminVerifyOrderPayment(orderId, actorUserId, status, ipAddress) {
        return this.db.transaction(async (tx) => {
          const orderRow = await tx.queryOne("SELECT id, payment_status FROM orders WHERE id = ?", [
            orderId
          ]);
          if (!orderRow) throw new Error("Order not found.");
          await tx.execute("UPDATE orders SET payment_status = ? WHERE id = ?", [status, orderId]);
          await tx.execute("UPDATE payments SET status = ?, verified_by_user_id = ? WHERE order_id = ?", [
            status,
            actorUserId,
            orderId
          ]);
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.verify_payment",
            entityType: "order",
            entityId: orderId,
            before: { paymentStatus: orderRow.payment_status },
            after: { paymentStatus: status },
            ipAddress
          });
          const updated = await tx.query("SELECT * FROM orders WHERE id = ?", [orderId]);
          const [hydrated] = await this.hydrateOrders(updated);
          return hydrated;
        });
      }
      async adminSettlePayout(payoutId, actorUserId, referenceCode, ipAddress) {
        if (referenceCode.trim().length < 3) throw new Error("Transfer reference code is required.");
        return this.db.transaction(async (tx) => {
          const pay = await tx.queryOne(
            "SELECT id, seller_id, amount_usd_cents, status FROM payouts WHERE id = ?",
            [payoutId]
          );
          if (!pay) throw new Error("Payout request not found.");
          if (pay.status === "paid") throw new Error("Payout already settled.");
          const now = toSqlTimestamp();
          await tx.execute(
            "UPDATE payouts SET status = 'paid', reference_code = ?, settled_by_user_id = ?, settled_at = ? WHERE id = ?",
            [referenceCode.trim(), actorUserId, now, payoutId]
          );
          await tx.execute(
            `INSERT INTO ledger_entries (id, seller_id, entry_type, direction, amount_usd_cents, availability, note, created_at)
         VALUES (?, ?, 'PAYOUT_SETTLED', 'debit', ?, 'settled', ?, ?)`,
            [`led-${crypto5.randomUUID()}`, pay.seller_id, pay.amount_usd_cents, `Payout settled (${referenceCode.trim()})`, now]
          );
          const owner = await tx.queryOne(
            `SELECT u.id, u.email, u.preferred_locale FROM sellers s INNER JOIN users u ON u.id = s.owner_user_id WHERE s.id = ?`,
            [pay.seller_id]
          );
          if (owner) {
            await this.createNotification(
              tx,
              owner.id,
              { en: `Payout settled ($${(Number(pay.amount_usd_cents) / 100).toFixed(2)})`, ar: `\u062A\u0645 \u062A\u062D\u0648\u064A\u0644 \u0623\u0631\u0628\u0627\u062D\u0643 ($${(Number(pay.amount_usd_cents) / 100).toFixed(2)})` },
              { en: `Transfer reference: ${referenceCode.trim()}`, ar: `\u0645\u0631\u062C\u0639 \u0627\u0644\u062A\u062D\u0648\u064A\u0644: ${referenceCode.trim()}` }
            );
            await queueEmail(tx, {
              to: owner.email,
              templateKey: "payout_paid",
              locale: owner.preferred_locale === "ar" ? "ar" : "en",
              vars: { amount: `$${(Number(pay.amount_usd_cents) / 100).toFixed(2)}`, reference: referenceCode.trim() }
            });
          }
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.settle_payout",
            entityType: "payout",
            entityId: payoutId,
            after: { referenceCode: referenceCode.trim(), amountUsdCents: pay.amount_usd_cents },
            ipAddress
          });
          return tx.queryOne("SELECT * FROM payouts WHERE id = ?", [payoutId]);
        });
      }
      async adminUpdatePage(slug, actorUserId, patch, ipAddress) {
        const existing = await this.db.queryOne(
          "SELECT * FROM pages WHERE slug = ?",
          [slug]
        );
        if (!existing) throw new Error("Page not found.");
        const currTitle = parseJson(existing.title_json, { en: slug, ar: slug });
        const currBody = parseJson(existing.body_json, { en: "", ar: "" });
        const nextTitle = {
          en: patch.titleEn !== void 0 ? patch.titleEn : currTitle.en,
          ar: patch.titleAr !== void 0 ? patch.titleAr : currTitle.ar
        };
        const nextBody = {
          en: patch.bodyEn !== void 0 ? patch.bodyEn : currBody.en,
          ar: patch.bodyAr !== void 0 ? patch.bodyAr : currBody.ar
        };
        await this.db.execute(
          "UPDATE pages SET title_json = ?, body_json = ?, published = ?, updated_at = ? WHERE id = ?",
          [
            JSON.stringify(nextTitle),
            JSON.stringify(nextBody),
            patch.published !== void 0 ? patch.published ? 1 : 0 : existing.published ? 1 : 0,
            toSqlTimestamp(),
            existing.id
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.update_page",
          entityType: "page",
          entityId: existing.id,
          after: { slug },
          ipAddress
        });
        return this.getPageBySlug(slug);
      }
      // --- Home Builder v2: Sections, Page Snapshots, Templates, Chrome/SEO, Media Library ---
      mapHomeSectionRow(row) {
        const legacyAudience = String(row.audience || "all");
        const targeting = normalizeTargeting(
          row.targeting_json ? parseJson(row.targeting_json, null) : null,
          legacyAudience
        );
        const style = parseJson(row.style_json, { surface: "graphite", padding: "standard" });
        return {
          id: String(row.id),
          sectionType: mapLegacySectionType(String(row.section_type)),
          title: parseJson(row.title_json, { en: "", ar: "" }),
          content: parseJson(row.content_json, {}),
          sortOrder: Number(row.sort_order ?? 0),
          status: String(row.status || "draft"),
          visible: row.visible === void 0 || row.visible === null ? true : Boolean(row.visible),
          audience: legacyAudience,
          targeting,
          style,
          schedulePriority: Number(row.schedule_priority ?? 0),
          startsAt: row.starts_at ? String(row.starts_at) : null,
          endsAt: row.ends_at ? String(row.ends_at) : null,
          version: Number(row.version ?? 1),
          updatedByUserId: row.updated_by_user_id ? String(row.updated_by_user_id) : null,
          updatedAt: String(row.updated_at)
        };
      }
      async getSiteChrome(draft = false) {
        if (!draft && this.publishedChromeCache && Date.now() - this.publishedChromeCache.cachedAt < 6e4) {
          return this.publishedChromeCache.value;
        }
        const key = draft ? "site_chrome_draft" : "site_chrome_published";
        const row = await this.db.queryOne(
          `SELECT value_json FROM settings WHERE ${this.keyCol()} = ?`,
          [key]
        );
        const parsed = parseJson(row?.value_json, DEFAULT_SITE_CHROME);
        const merged = {
          ...DEFAULT_SITE_CHROME,
          ...parsed,
          homeSeo: {
            ...DEFAULT_SITE_CHROME.homeSeo,
            ...parsed.homeSeo || {}
          }
        };
        if (!draft) {
          this.publishedChromeCache = { value: merged, cachedAt: Date.now() };
        }
        return merged;
      }
      async getSeoMetadata() {
        const row = await this.db.queryOne(
          `SELECT value_json FROM settings WHERE ${this.keyCol()} = 'seo_metadata'`
        );
        const parsed = row?.value_json ? parseJson(row.value_json, {}) : {};
        const globalCfg = {
          ...DEFAULT_SEO_METADATA.global,
          ...parsed.global || {},
          defaultTitle: {
            ...DEFAULT_SEO_METADATA.global.defaultTitle,
            ...parsed.global?.defaultTitle || {}
          },
          defaultDescription: {
            ...DEFAULT_SEO_METADATA.global.defaultDescription,
            ...parsed.global?.defaultDescription || {}
          },
          organizationJsonLd: {
            ...DEFAULT_SEO_METADATA.global.organizationJsonLd,
            ...parsed.global?.organizationJsonLd || {},
            sameAs: Array.isArray(parsed.global?.organizationJsonLd?.sameAs) ? parsed.global.organizationJsonLd.sameAs : []
          }
        };
        const overrides = Array.isArray(parsed.overrides) ? parsed.overrides : [];
        return { global: globalCfg, overrides };
      }
      async adminSaveGlobalSeo(actorUserId, patch, ipAddress) {
        return this.db.transaction(async (tx) => {
          const current = await this.getSeoMetadata();
          const next = {
            global: {
              ...current.global,
              ...patch,
              defaultTitle: {
                ...current.global.defaultTitle,
                ...patch.defaultTitle || {}
              },
              defaultDescription: {
                ...current.global.defaultDescription,
                ...patch.defaultDescription || {}
              },
              organizationJsonLd: {
                ...current.global.organizationJsonLd,
                ...patch.organizationJsonLd || {},
                sameAs: Array.isArray(patch.organizationJsonLd?.sameAs) ? patch.organizationJsonLd.sameAs.filter((u) => typeof u === "string" && u.trim().length > 0) : current.global.organizationJsonLd.sameAs
              }
            },
            overrides: current.overrides
          };
          const kCol = this.keyCol();
          const now = toSqlTimestamp();
          await tx.execute(
            this.db.driver === "mysql" ? `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES ('seo_metadata', ?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), updated_at = VALUES(updated_at)` : `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES ('seo_metadata', ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`,
            [JSON.stringify(next), now]
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.update_seo_global",
            entityType: "settings",
            entityId: "seo_metadata",
            before: current.global,
            after: next.global,
            ipAddress
          });
          return next;
        });
      }
      async adminUpsertSeoOverride(actorUserId, input, ipAddress) {
        const cleanKey = input.entityKey.trim();
        if (!cleanKey) throw new Error("Entity key is required.");
        return this.db.transaction(async (tx) => {
          const current = await this.getSeoMetadata();
          const now = toSqlTimestamp();
          const existingIdx = current.overrides.findIndex(
            (o) => o.entityType === input.entityType && o.entityKey === cleanKey
          );
          const nextEntry = {
            id: existingIdx >= 0 ? current.overrides[existingIdx].id : `seo-${crypto5.randomUUID()}`,
            entityType: input.entityType,
            entityKey: cleanKey,
            metaTitle: {
              en: input.metaTitle.en.trim(),
              ar: input.metaTitle.ar.trim()
            },
            metaDescription: {
              en: input.metaDescription.en.trim(),
              ar: input.metaDescription.ar.trim()
            },
            canonicalUrl: (input.canonicalUrl || "").trim(),
            ogImageUrl: (input.ogImageUrl || "").trim(),
            robots: input.robots || "index,follow",
            structuredData: {
              brand: input.structuredData?.brand?.trim() || void 0,
              sku: input.structuredData?.sku?.trim() || void 0,
              gtin: input.structuredData?.gtin?.trim() || void 0,
              priceValidUntil: input.structuredData?.priceValidUntil?.trim() || void 0,
              customJson: input.structuredData?.customJson?.trim() || void 0
            },
            updatedAt: now
          };
          const nextOverrides = existingIdx >= 0 ? current.overrides.map((o, i) => i === existingIdx ? nextEntry : o) : [nextEntry, ...current.overrides];
          const next = {
            global: current.global,
            overrides: nextOverrides
          };
          const kCol = this.keyCol();
          await tx.execute(
            this.db.driver === "mysql" ? `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES ('seo_metadata', ?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), updated_at = VALUES(updated_at)` : `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES ('seo_metadata', ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`,
            [JSON.stringify(next), now]
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.upsert_seo_override",
            entityType: "seo_override",
            entityId: `${input.entityType}:${cleanKey}`,
            after: nextEntry,
            ipAddress
          });
          return next;
        });
      }
      async adminDeleteSeoOverride(actorUserId, entityType, entityKey, ipAddress) {
        const cleanKey = entityKey.trim();
        return this.db.transaction(async (tx) => {
          const current = await this.getSeoMetadata();
          const now = toSqlTimestamp();
          const next = {
            global: current.global,
            overrides: current.overrides.filter(
              (o) => !(o.entityType === entityType && o.entityKey === cleanKey)
            )
          };
          const kCol = this.keyCol();
          await tx.execute(
            this.db.driver === "mysql" ? `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES ('seo_metadata', ?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), updated_at = VALUES(updated_at)` : `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES ('seo_metadata', ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`,
            [JSON.stringify(next), now]
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.delete_seo_override",
            entityType: "seo_override",
            entityId: `${entityType}:${cleanKey}`,
            ipAddress
          });
          return next;
        });
      }
      async getPublicHomeSections(ctx) {
        let allMapped;
        if (!ctx?.includeDrafts && !ctx?.asOf && this.publishedHomeSectionsCache && Date.now() - this.publishedHomeSectionsCache.cachedAt < 3e4) {
          allMapped = this.publishedHomeSectionsCache.value;
        } else {
          const rows = await this.db.query(
            "SELECT * FROM home_sections ORDER BY sort_order ASC, schedule_priority DESC, updated_at ASC"
          );
          allMapped = rows.map((r) => this.mapHomeSectionRow(r));
          if (!ctx?.includeDrafts && !ctx?.asOf) {
            this.publishedHomeSectionsCache = { value: allMapped, cachedAt: Date.now() };
          }
        }
        const evalMs = ctx?.asOf ? Date.parse(ctx.asOf) || Date.now() : Date.now();
        const visitorSim = ctx?.audiencePreview || (ctx?.isLoggedIn ? "logged_in" : ctx?.isNewVisitor ? "new_visitor" : "guest");
        return allMapped.filter((s) => {
          if (s.status === "archived") return false;
          if (!ctx?.includeDrafts) {
            if (!s.visible) return false;
            if (s.status !== "published") return false;
          } else {
            if (!s.visible) return false;
          }
          if (!isWithinSchedule(s.startsAt, s.endsAt, evalMs)) return false;
          const t = s.targeting || normalizeTargeting(null, s.audience);
          if (t.locale && t.locale !== "all" && ctx?.locale && t.locale !== ctx.locale) return false;
          if (t.device && t.device !== "all" && ctx?.device && t.device !== ctx.device) return false;
          if (t.visitor && t.visitor !== "all") {
            if (ctx?.audiencePreview === "all") return true;
            if (t.visitor === "guest" && visitorSim !== "guest" && visitorSim !== "new_visitor") return false;
            if (t.visitor === "logged_in" && visitorSim !== "logged_in" && visitorSim !== "returning") return false;
            if (t.visitor === "new_visitor" && visitorSim !== "new_visitor" && visitorSim !== "guest") return false;
            if (t.visitor === "returning" && visitorSim !== "returning" && visitorSim !== "logged_in") return false;
          }
          return true;
        });
      }
      async adminListHomeSections() {
        const rows = await this.db.query(
          "SELECT * FROM home_sections ORDER BY sort_order ASC, updated_at ASC"
        );
        const sections = rows.map((r) => this.mapHomeSectionRow(r));
        const versionRows = await this.db.query(
          "SELECT * FROM home_section_versions ORDER BY version DESC, created_at DESC"
        );
        const versionsBySectionId = {};
        for (const vr of versionRows) {
          const sid = String(vr.section_id);
          if (!versionsBySectionId[sid]) versionsBySectionId[sid] = [];
          const snapRaw = parseJson(vr.snapshot_json, {});
          versionsBySectionId[sid].push({
            id: String(vr.id),
            sectionId: sid,
            version: Number(vr.version),
            changeNote: vr.change_note ? String(vr.change_note) : null,
            snapshot: {
              sectionType: mapLegacySectionType(String(snapRaw.sectionType || "rich_block")),
              title: parseJson(snapRaw.title, { en: "", ar: "" }),
              content: snapRaw.content || {},
              status: snapRaw.status || "draft",
              visible: snapRaw.visible === void 0 ? true : Boolean(snapRaw.visible),
              audience: snapRaw.audience || "all",
              targeting: snapRaw.targeting || void 0,
              style: snapRaw.style || void 0,
              startsAt: snapRaw.startsAt ? String(snapRaw.startsAt) : null,
              endsAt: snapRaw.endsAt ? String(snapRaw.endsAt) : null
            },
            editedByUserId: vr.edited_by_user_id ? String(vr.edited_by_user_id) : null,
            createdAt: String(vr.created_at)
          });
        }
        return { sections, versionsBySectionId };
      }
      async adminGetHomeBuilderState() {
        const [{ sections, versionsBySectionId }, chromeDraft, chromePublished, templates, pageSnapshots, mediaLibrary, migrationRow] = await Promise.all([
          this.adminListHomeSections(),
          this.getSiteChrome(true),
          this.getSiteChrome(false),
          this.adminListSectionTemplates(),
          this.adminListPageSnapshots(),
          this.adminListMediaLibrary(),
          this.db.queryOne(
            `SELECT value_json FROM settings WHERE ${this.keyCol()} = 'home_migration_report'`
          )
        ]);
        const migrationReport = parseJson(migrationRow?.value_json, {
          ranAt: (/* @__PURE__ */ new Date()).toISOString(),
          migratedSections: [],
          migratedVersionsCount: 0,
          alreadyUpToDateCount: sections.length
        });
        return {
          sections,
          versionsBySectionId,
          chromeDraft,
          chromePublished,
          templates,
          pageSnapshots,
          mediaLibrary,
          migrationReport
        };
      }
      async adminCreateHomeSection(actorUserId, input, ipAddress) {
        const created = await this.db.transaction(async (tx) => {
          const existingRows = await tx.query(
            "SELECT id, sort_order FROM home_sections ORDER BY sort_order ASC"
          );
          const id = `hs-${crypto5.randomUUID()}`;
          const status = input.status || "draft";
          const visible = input.visible !== false;
          const audience = input.audience || "all";
          const targeting = normalizeTargeting(input.targeting, audience);
          const style = input.style || { surface: "graphite", padding: "standard" };
          const now = toSqlTimestamp();
          let nextSort = (existingRows.length + 1) * 10;
          if (input.insertAtIndex !== void 0 && input.insertAtIndex >= 0 && input.insertAtIndex <= existingRows.length) {
            const ordered = existingRows.map((r) => r.id);
            ordered.splice(input.insertAtIndex, 0, id);
            nextSort = (input.insertAtIndex + 1) * 10;
            for (let i = 0; i < ordered.length; i++) {
              if (ordered[i] !== id) {
                await tx.execute("UPDATE home_sections SET sort_order = ? WHERE id = ?", [(i + 1) * 10, ordered[i]]);
              }
            }
          }
          await tx.execute(
            `INSERT INTO home_sections (id, section_type, title_json, content_json, sort_order, status, visible, audience, targeting_json, style_json, schedule_priority, starts_at, ends_at, version, updated_by_user_id, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
            [
              id,
              input.sectionType,
              JSON.stringify(input.title),
              JSON.stringify(input.content || {}),
              nextSort,
              status,
              visible ? 1 : 0,
              audience,
              JSON.stringify(targeting),
              JSON.stringify(style),
              Math.trunc(input.schedulePriority ?? 0),
              input.startsAt ? toSqlTimestamp(new Date(input.startsAt)) : null,
              input.endsAt ? toSqlTimestamp(new Date(input.endsAt)) : null,
              actorUserId,
              now
            ]
          );
          await tx.execute(
            `INSERT INTO home_section_versions (id, section_id, version, change_note, snapshot_json, edited_by_user_id, created_at)
         VALUES (?, ?, 1, 'Created block', ?, ?, ?)`,
            [
              `hsv-${crypto5.randomUUID()}`,
              id,
              JSON.stringify({
                sectionType: input.sectionType,
                title: input.title,
                content: input.content || {},
                status,
                visible,
                audience,
                targeting,
                style,
                startsAt: input.startsAt || null,
                endsAt: input.endsAt || null
              }),
              actorUserId,
              now
            ]
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.create_home_section",
            entityType: "home_section",
            entityId: id,
            after: { sectionType: input.sectionType, status, audience },
            ipAddress
          });
          const row = await tx.queryOne("SELECT * FROM home_sections WHERE id = ?", [id]);
          return this.mapHomeSectionRow(row);
        });
        this.invalidateHomeCache();
        return created;
      }
      async adminUpdateHomeSection(sectionId, actorUserId, patch, ipAddress) {
        const updated = await this.db.transaction(async (tx) => {
          const existingRow = await tx.queryOne("SELECT * FROM home_sections WHERE id = ?", [sectionId]);
          if (!existingRow) throw new Error("Home section not found.");
          const existing = this.mapHomeSectionRow(existingRow);
          const nextType = patch.sectionType || existing.sectionType;
          const nextTitle = patch.title || existing.title;
          const nextContent = patch.content !== void 0 ? patch.content : existing.content;
          const nextStatus = patch.status || existing.status;
          const nextVisible = patch.visible !== void 0 ? patch.visible : existing.visible;
          const nextAudience = patch.audience || existing.audience;
          const nextTargeting = patch.targeting !== void 0 ? normalizeTargeting(patch.targeting, nextAudience) : existing.targeting || normalizeTargeting(null, nextAudience);
          const nextStyle = patch.style !== void 0 ? patch.style : existing.style || { surface: "graphite", padding: "standard" };
          const nextPriority = patch.schedulePriority !== void 0 ? Math.trunc(patch.schedulePriority) : existing.schedulePriority ?? 0;
          const nextStarts = patch.startsAt !== void 0 ? patch.startsAt ? toSqlTimestamp(new Date(patch.startsAt)) : null : existing.startsAt;
          const nextEnds = patch.endsAt !== void 0 ? patch.endsAt ? toSqlTimestamp(new Date(patch.endsAt)) : null : existing.endsAt;
          const nextSort = patch.sortOrder !== void 0 ? patch.sortOrder : existing.sortOrder;
          const nextVersion = existing.version + 1;
          const now = toSqlTimestamp();
          await tx.execute(
            `UPDATE home_sections
         SET section_type = ?, title_json = ?, content_json = ?, sort_order = ?, status = ?, visible = ?, audience = ?, targeting_json = ?, style_json = ?, schedule_priority = ?, starts_at = ?, ends_at = ?, version = ?, updated_by_user_id = ?, updated_at = ?
         WHERE id = ?`,
            [
              nextType,
              JSON.stringify(nextTitle),
              JSON.stringify(nextContent),
              nextSort,
              nextStatus,
              nextVisible ? 1 : 0,
              nextAudience,
              JSON.stringify(nextTargeting),
              JSON.stringify(nextStyle),
              nextPriority,
              nextStarts,
              nextEnds,
              nextVersion,
              actorUserId,
              now,
              sectionId
            ]
          );
          await tx.execute(
            `INSERT INTO home_section_versions (id, section_id, version, change_note, snapshot_json, edited_by_user_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              `hsv-${crypto5.randomUUID()}`,
              sectionId,
              nextVersion,
              patch.changeNote?.slice(0, 240) || "Updated block settings",
              JSON.stringify({
                sectionType: nextType,
                title: nextTitle,
                content: nextContent,
                status: nextStatus,
                visible: nextVisible,
                audience: nextAudience,
                targeting: nextTargeting,
                style: nextStyle,
                startsAt: nextStarts,
                endsAt: nextEnds
              }),
              actorUserId,
              now
            ]
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.update_home_section",
            entityType: "home_section",
            entityId: sectionId,
            before: { version: existing.version, status: existing.status, visible: existing.visible },
            after: { version: nextVersion, status: nextStatus, visible: nextVisible, audience: nextAudience },
            ipAddress
          });
          const row = await tx.queryOne("SELECT * FROM home_sections WHERE id = ?", [sectionId]);
          return this.mapHomeSectionRow(row);
        });
        this.invalidateHomeCache();
        return updated;
      }
      async adminDuplicateHomeSection(sectionId, actorUserId, ipAddress) {
        const existingRow = await this.db.queryOne("SELECT * FROM home_sections WHERE id = ?", [sectionId]);
        if (!existingRow) throw new Error("Home section not found.");
        const existing = this.mapHomeSectionRow(existingRow);
        const allRows = await this.db.query("SELECT id FROM home_sections ORDER BY sort_order ASC");
        const idx = allRows.findIndex((r) => r.id === sectionId);
        const insertAt = idx >= 0 ? idx + 1 : allRows.length;
        return this.adminCreateHomeSection(
          actorUserId,
          {
            sectionType: existing.sectionType,
            title: { en: `${existing.title.en} (Copy)`, ar: `${existing.title.ar} (\u0646\u0633\u062E\u0629)` },
            content: existing.content,
            status: "draft",
            visible: existing.visible,
            audience: existing.audience,
            targeting: existing.targeting,
            style: existing.style,
            schedulePriority: existing.schedulePriority,
            startsAt: existing.startsAt,
            endsAt: existing.endsAt,
            insertAtIndex: insertAt
          },
          ipAddress
        );
      }
      async adminReorderHomeSections(orderedIds, actorUserId, ipAddress) {
        const list = await this.db.transaction(async (tx) => {
          const now = toSqlTimestamp();
          for (let i = 0; i < orderedIds.length; i++) {
            await tx.execute("UPDATE home_sections SET sort_order = ?, updated_by_user_id = ?, updated_at = ? WHERE id = ?", [
              (i + 1) * 10,
              actorUserId,
              now,
              orderedIds[i]
            ]);
          }
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.reorder_home_sections",
            entityType: "home_section",
            entityId: "order",
            after: { orderedIds },
            ipAddress
          });
          const rows = await tx.query(
            "SELECT * FROM home_sections ORDER BY sort_order ASC, updated_at ASC"
          );
          return rows.map((r) => this.mapHomeSectionRow(r));
        });
        this.invalidateHomeCache();
        return list;
      }
      async adminRollbackHomeSection(sectionId, versionId, actorUserId, ipAddress) {
        const restored = await this.db.transaction(async (tx) => {
          const currentRow = await tx.queryOne("SELECT * FROM home_sections WHERE id = ?", [sectionId]);
          if (!currentRow) throw new Error("Home section not found.");
          const current = this.mapHomeSectionRow(currentRow);
          const verRow = await tx.queryOne(
            "SELECT * FROM home_section_versions WHERE id = ? AND section_id = ?",
            [versionId, sectionId]
          );
          if (!verRow) throw new Error("Version snapshot not found.");
          const snapRaw = parseJson(verRow.snapshot_json, {});
          const snapType = mapLegacySectionType(String(snapRaw.sectionType || current.sectionType));
          const snapTitle = parseJson(snapRaw.title, current.title);
          const snapContent = snapRaw.content || current.content;
          const snapStatus = snapRaw.status || current.status;
          const snapVisible = snapRaw.visible === void 0 ? true : Boolean(snapRaw.visible);
          const snapAudience = snapRaw.audience || current.audience;
          const snapTargeting = normalizeTargeting(snapRaw.targeting, snapAudience);
          const snapStyle = snapRaw.style || current.style || { surface: "graphite", padding: "standard" };
          const snapStarts = snapRaw.startsAt ? String(snapRaw.startsAt) : null;
          const snapEnds = snapRaw.endsAt ? String(snapRaw.endsAt) : null;
          const nextVersion = current.version + 1;
          const now = toSqlTimestamp();
          await tx.execute(
            `UPDATE home_sections
         SET section_type = ?, title_json = ?, content_json = ?, status = ?, visible = ?, audience = ?, targeting_json = ?, style_json = ?, starts_at = ?, ends_at = ?, version = ?, updated_by_user_id = ?, updated_at = ?
         WHERE id = ?`,
            [
              snapType,
              JSON.stringify(snapTitle),
              JSON.stringify(snapContent),
              snapStatus,
              snapVisible ? 1 : 0,
              snapAudience,
              JSON.stringify(snapTargeting),
              JSON.stringify(snapStyle),
              snapStarts,
              snapEnds,
              nextVersion,
              actorUserId,
              now,
              sectionId
            ]
          );
          await tx.execute(
            `INSERT INTO home_section_versions (id, section_id, version, change_note, snapshot_json, edited_by_user_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              `hsv-${crypto5.randomUUID()}`,
              sectionId,
              nextVersion,
              `Rolled back to v${Number(verRow.version)}`,
              JSON.stringify({
                sectionType: snapType,
                title: snapTitle,
                content: snapContent,
                status: snapStatus,
                visible: snapVisible,
                audience: snapAudience,
                targeting: snapTargeting,
                style: snapStyle,
                startsAt: snapStarts,
                endsAt: snapEnds
              }),
              actorUserId,
              now
            ]
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.rollback_home_section",
            entityType: "home_section",
            entityId: sectionId,
            before: { version: current.version },
            after: { restoredFromVersion: Number(verRow.version), newVersion: nextVersion },
            ipAddress
          });
          const updated = await tx.queryOne("SELECT * FROM home_sections WHERE id = ?", [sectionId]);
          return this.mapHomeSectionRow(updated);
        });
        this.invalidateHomeCache();
        return restored;
      }
      async adminDeleteHomeSection(sectionId, actorUserId, ipAddress) {
        await this.db.transaction(async (tx) => {
          await tx.execute("DELETE FROM home_section_versions WHERE section_id = ?", [sectionId]);
          await tx.execute("DELETE FROM home_sections WHERE id = ?", [sectionId]);
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.delete_home_section",
            entityType: "home_section",
            entityId: sectionId,
            ipAddress
          });
        });
        this.invalidateHomeCache();
      }
      async adminListPageSnapshots() {
        const rows = await this.db.query(
          "SELECT * FROM home_page_snapshots ORDER BY version DESC, created_at DESC LIMIT 30"
        );
        return rows.map((r) => {
          const secs = parseJson(r.sections_snapshot_json, []);
          return {
            id: String(r.id),
            version: Number(r.version),
            status: String(r.status || "published"),
            changeNote: r.change_note ? String(r.change_note) : null,
            scheduledPublishAt: r.scheduled_publish_at ? String(r.scheduled_publish_at) : null,
            publishedAt: r.published_at ? String(r.published_at) : null,
            createdByUserId: r.created_by_user_id ? String(r.created_by_user_id) : null,
            createdAt: String(r.created_at),
            sectionCount: secs.length
          };
        });
      }
      async adminPublishHomePage(actorUserId, input, ipAddress) {
        const snap = await this.db.transaction(async (tx) => {
          const now = toSqlTimestamp();
          const maxVerRow = await tx.queryOne("SELECT MAX(version) AS max_v FROM home_page_snapshots");
          const nextVersion = Number(maxVerRow?.max_v ?? 0) + 1;
          const isScheduled = Boolean(input.scheduledPublishAt && Date.parse(input.scheduledPublishAt) > Date.now());
          if (!isScheduled) {
            await tx.execute(
              "UPDATE home_sections SET status = 'published', updated_by_user_id = ?, updated_at = ? WHERE status = 'draft'",
              [actorUserId, now]
            );
            const kCol = this.keyCol();
            const draftChromeRow = await tx.queryOne(
              `SELECT value_json FROM settings WHERE ${kCol} = 'site_chrome_draft'`
            );
            if (draftChromeRow) {
              await tx.execute(
                this.db.driver === "mysql" ? `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES ('site_chrome_published', ?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), updated_at = VALUES(updated_at)` : `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES ('site_chrome_published', ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`,
                [typeof draftChromeRow.value_json === "string" ? draftChromeRow.value_json : JSON.stringify(draftChromeRow.value_json), now]
              );
            }
          }
          const sectionRows = await tx.query(
            "SELECT * FROM home_sections WHERE status != ? ORDER BY sort_order ASC",
            ["archived"]
          );
          const chrome = await this.getSiteChrome(true);
          const id = `hps-${crypto5.randomUUID()}`;
          const status = isScheduled ? "scheduled" : "published";
          const schedSql = isScheduled && input.scheduledPublishAt ? toSqlTimestamp(new Date(input.scheduledPublishAt)) : null;
          await tx.execute(
            `INSERT INTO home_page_snapshots (id, version, status, change_note, sections_snapshot_json, chrome_snapshot_json, scheduled_publish_at, published_at, created_by_user_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              nextVersion,
              status,
              input.changeNote?.trim() || (isScheduled ? "Scheduled publish" : "Published Home & Chrome"),
              JSON.stringify(sectionRows),
              JSON.stringify(chrome),
              schedSql,
              isScheduled ? null : now,
              actorUserId,
              now
            ]
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: isScheduled ? "admin.schedule_home_page" : "admin.publish_home_page",
            entityType: "home_page",
            entityId: id,
            after: { version: nextVersion, status, sectionCount: sectionRows.length },
            ipAddress
          });
          return {
            id,
            version: nextVersion,
            status,
            changeNote: input.changeNote?.trim() || null,
            scheduledPublishAt: schedSql,
            publishedAt: isScheduled ? null : now,
            createdByUserId: actorUserId,
            createdAt: now,
            sectionCount: sectionRows.length
          };
        });
        this.invalidateHomeCache();
        return snap;
      }
      async adminRollbackHomePage(snapshotId, actorUserId, ipAddress) {
        const result = await this.db.transaction(async (tx) => {
          const target = await tx.queryOne("SELECT * FROM home_page_snapshots WHERE id = ?", [snapshotId]);
          if (!target) throw new Error("Home page snapshot not found.");
          const sectionsArr = parseJson(target.sections_snapshot_json, []);
          const chromeObj = parseJson(target.chrome_snapshot_json, DEFAULT_SITE_CHROME);
          const now = toSqlTimestamp();
          await tx.execute("DELETE FROM home_sections");
          for (let i = 0; i < sectionsArr.length; i++) {
            const sr = sectionsArr[i];
            const sid = String(sr.id || `hs-${crypto5.randomUUID()}`);
            await tx.execute(
              `INSERT INTO home_sections (id, section_type, title_json, content_json, sort_order, status, visible, audience, targeting_json, style_json, schedule_priority, starts_at, ends_at, version, updated_by_user_id, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                sid,
                mapLegacySectionType(String(sr.section_type || "rich_block")),
                typeof sr.title_json === "string" ? sr.title_json : JSON.stringify(sr.title_json || { en: "", ar: "" }),
                typeof sr.content_json === "string" ? sr.content_json : JSON.stringify(sr.content_json || {}),
                Number(sr.sort_order ?? (i + 1) * 10),
                String(sr.status || "published"),
                sr.visible === void 0 ? 1 : sr.visible ? 1 : 0,
                String(sr.audience || "all"),
                sr.targeting_json ? typeof sr.targeting_json === "string" ? sr.targeting_json : JSON.stringify(sr.targeting_json) : null,
                sr.style_json ? typeof sr.style_json === "string" ? sr.style_json : JSON.stringify(sr.style_json) : null,
                Number(sr.schedule_priority ?? 0),
                sr.starts_at ? String(sr.starts_at) : null,
                sr.ends_at ? String(sr.ends_at) : null,
                Number(sr.version ?? 1) + 1,
                actorUserId,
                now
              ]
            );
          }
          const kCol = this.keyCol();
          const chromeStr = JSON.stringify(chromeObj);
          for (const settingKey of ["site_chrome_draft", "site_chrome_published"]) {
            await tx.execute(
              this.db.driver === "mysql" ? `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), updated_at = VALUES(updated_at)` : `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`,
              [settingKey, chromeStr, now]
            );
          }
          const maxVerRow = await tx.queryOne("SELECT MAX(version) AS max_v FROM home_page_snapshots");
          const nextVersion = Number(maxVerRow?.max_v ?? 0) + 1;
          const newId = `hps-${crypto5.randomUUID()}`;
          const note = `Rolled back full page to v${Number(target.version)}`;
          await tx.execute(
            `INSERT INTO home_page_snapshots (id, version, status, change_note, sections_snapshot_json, chrome_snapshot_json, published_at, created_by_user_id, created_at)
         VALUES (?, ?, 'published', ?, ?, ?, ?, ?, ?)`,
            [newId, nextVersion, note, JSON.stringify(sectionsArr), chromeStr, now, actorUserId, now]
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.rollback_home_page",
            entityType: "home_page",
            entityId: newId,
            after: { restoredFromVersion: Number(target.version), newVersion: nextVersion },
            ipAddress
          });
          return {
            id: newId,
            version: nextVersion,
            status: "published",
            changeNote: note,
            scheduledPublishAt: null,
            publishedAt: now,
            createdByUserId: actorUserId,
            createdAt: now,
            sectionCount: sectionsArr.length
          };
        });
        this.invalidateHomeCache();
        return result;
      }
      async adminSaveSiteChrome(chrome, publishNow, actorUserId, ipAddress) {
        const now = toSqlTimestamp();
        const clean = { ...chrome, updatedAt: now };
        const kCol = this.keyCol();
        const jsonVal = JSON.stringify(clean);
        const keys = publishNow ? ["site_chrome_draft", "site_chrome_published"] : ["site_chrome_draft"];
        for (const k of keys) {
          await this.db.execute(
            this.db.driver === "mysql" ? `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), updated_at = VALUES(updated_at)` : `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`,
            [k, jsonVal, now]
          );
        }
        await writeAuditLog(this.db, {
          actorUserId,
          action: publishNow ? "admin.publish_site_chrome" : "admin.save_site_chrome_draft",
          entityType: "site_chrome",
          entityId: "global",
          after: { publishNow, linksCount: clean.headerLinks.length },
          ipAddress
        });
        this.invalidateHomeCache();
        return clean;
      }
      async adminListSectionTemplates() {
        const rows = await this.db.query(
          "SELECT * FROM home_section_templates ORDER BY is_system DESC, created_at DESC"
        );
        return rows.map((r) => ({
          id: String(r.id),
          name: parseJson(r.name_json, { en: "Template", ar: "\u0642\u0627\u0644\u0628" }),
          description: parseJson(r.description_json, { en: "", ar: "" }),
          sectionType: mapLegacySectionType(String(r.section_type)),
          content: parseJson(r.content_json, {}),
          style: parseJson(r.style_json, { surface: "graphite", padding: "standard" }),
          isSystem: Boolean(r.is_system),
          createdAt: String(r.created_at)
        }));
      }
      async adminCreateSectionTemplate(actorUserId, input, ipAddress) {
        const id = `tmpl-${crypto5.randomUUID()}`;
        const now = toSqlTimestamp();
        const desc = input.description || { en: "Saved custom section template", ar: "\u0642\u0627\u0644\u0628 \u0642\u0633\u0645 \u0645\u062D\u0641\u0648\u0638" };
        await this.db.execute(
          `INSERT INTO home_section_templates (id, name_json, description_json, section_type, content_json, style_json, is_system, created_by_user_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)`,
          [
            id,
            JSON.stringify(input.name),
            JSON.stringify(desc),
            input.sectionType,
            JSON.stringify(input.content || {}),
            JSON.stringify(input.style || { surface: "graphite", padding: "standard" }),
            actorUserId,
            now
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.create_home_template",
          entityType: "home_section_template",
          entityId: id,
          after: { name: input.name, sectionType: input.sectionType },
          ipAddress
        });
        return {
          id,
          name: input.name,
          description: desc,
          sectionType: input.sectionType,
          content: input.content || {},
          style: input.style,
          isSystem: false,
          createdAt: now
        };
      }
      async adminDeleteSectionTemplate(templateId, actorUserId, ipAddress) {
        const row = await this.db.queryOne("SELECT is_system FROM home_section_templates WHERE id = ?", [
          templateId
        ]);
        if (!row) throw new Error("Template not found.");
        if (Boolean(row.is_system)) throw new Error("Starter system templates cannot be deleted.");
        await this.db.execute("DELETE FROM home_section_templates WHERE id = ?", [templateId]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_home_template",
          entityType: "home_section_template",
          entityId: templateId,
          ipAddress
        });
      }
      async adminListMediaLibrary(folderFilter) {
        const [mediaRows, sections, stores2, prodMedia] = await Promise.all([
          this.db.query(
            folderFilter && folderFilter !== "all" ? "SELECT * FROM media WHERE folder = ? ORDER BY created_at DESC LIMIT 200" : "SELECT * FROM media ORDER BY created_at DESC LIMIT 200",
            folderFilter && folderFilter !== "all" ? [folderFilter] : []
          ),
          this.db.query("SELECT id, title_json, content_json FROM home_sections"),
          this.db.query(
            "SELECT id, name_json, logo_media_id, banner_media_id FROM stores"
          ),
          this.db.query("SELECT id, entity_id FROM media WHERE entity_type = ?", ["product_image"])
        ]);
        return mediaRows.map((m) => {
          const publicUrl = String(m.public_url);
          const id = String(m.id);
          const usedIn = [];
          for (const sec of sections) {
            const cStr = typeof sec.content_json === "string" ? sec.content_json : JSON.stringify(sec.content_json || {});
            if (cStr.includes(publicUrl) || cStr.includes(id)) {
              const title = parseJson(sec.title_json, { en: sec.id, ar: sec.id });
              usedIn.push({ kind: "home_section", id: sec.id, label: title.en || sec.id });
            }
          }
          for (const st of stores2) {
            if (st.logo_media_id === id || st.banner_media_id === id) {
              const name = parseJson(st.name_json, { en: st.id, ar: st.id });
              usedIn.push({ kind: "store", id: st.id, label: name.en || st.id });
            }
          }
          for (const pm of prodMedia) {
            if (pm.id === id && pm.entity_id) {
              usedIn.push({ kind: "product", id: pm.entity_id, label: `Product ${pm.entity_id.slice(0, 10)}` });
            }
          }
          return {
            id,
            ownerUserId: String(m.owner_user_id),
            entityType: String(m.entity_type),
            folder: String(m.folder || "general"),
            publicUrl,
            mimeType: String(m.mime_type),
            sizeBytes: Number(m.size_bytes ?? 0),
            width: m.width === null || m.width === void 0 ? null : Number(m.width),
            height: m.height === null || m.height === void 0 ? null : Number(m.height),
            alt: parseJson(m.alt_json, { en: "", ar: "" }),
            focalX: Number(m.focal_x ?? 50),
            focalY: Number(m.focal_y ?? 50),
            createdAt: String(m.created_at),
            usedIn
          };
        });
      }
      async adminUpdateMediaAsset(mediaId, patch) {
        const existing = await this.db.queryOne("SELECT * FROM media WHERE id = ?", [mediaId]);
        if (!existing) throw new Error("Media asset not found.");
        const nextFolder = patch.folder ? patch.folder.replace(/[^a-z0-9_-]/gi, "").slice(0, 60) || "general" : String(existing.folder || "general");
        const nextAlt = patch.alt !== void 0 ? patch.alt : parseJson(existing.alt_json, { en: "", ar: "" });
        const nextFx = patch.focalX !== void 0 ? Math.max(0, Math.min(100, Math.round(patch.focalX))) : Number(existing.focal_x ?? 50);
        const nextFy = patch.focalY !== void 0 ? Math.max(0, Math.min(100, Math.round(patch.focalY))) : Number(existing.focal_y ?? 50);
        await this.db.execute("UPDATE media SET folder = ?, alt_json = ?, focal_x = ?, focal_y = ? WHERE id = ?", [
          nextFolder,
          JSON.stringify(nextAlt),
          nextFx,
          nextFy,
          mediaId
        ]);
        const list = await this.adminListMediaLibrary();
        return list.find((item) => item.id === mediaId);
      }
      async adminDeleteMediaAsset(mediaId, actorUserId, ipAddress) {
        const list = await this.adminListMediaLibrary();
        const target = list.find((m) => m.id === mediaId);
        if (!target) throw new Error("Media asset not found.");
        if (target.usedIn.length > 0) {
          throw new Error(`Media is in use (${target.usedIn.map((u) => u.label).join(", ")}). Replace references before deleting.`);
        }
        await this.db.execute("DELETE FROM media WHERE id = ?", [mediaId]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_media",
          entityType: "media",
          entityId: mediaId,
          after: { publicUrl: target.publicUrl },
          ipAddress
        });
      }
      async subscribeNewsletter(email, locale, source = "home") {
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
          throw new Error(locale === "ar" ? "\u0623\u062F\u062E\u0644 \u0628\u0631\u064A\u062F\u0627\u064B \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u064B \u0635\u062D\u064A\u062D\u0627\u064B" : "Please enter a valid email address.");
        }
        const existing = await this.db.queryOne(
          "SELECT id, status, unsubscribe_token FROM newsletter_subscribers WHERE LOWER(email) = ?",
          [cleanEmail]
        );
        const now = toSqlTimestamp();
        let subscriberId;
        let unsubscribeToken;
        let alreadySubscribed = false;
        if (existing) {
          subscriberId = existing.id;
          unsubscribeToken = existing.unsubscribe_token;
          alreadySubscribed = true;
          await this.db.execute(
            "UPDATE newsletter_subscribers SET status = 'subscribed', locale = ?, source = ?, consented_at = ? WHERE id = ?",
            [locale, source.slice(0, 60), now, existing.id]
          );
        } else {
          subscriberId = `sub-${crypto5.randomUUID()}`;
          unsubscribeToken = crypto5.randomBytes(24).toString("hex");
          await this.db.execute(
            `INSERT INTO newsletter_subscribers (id, email, locale, source, status, unsubscribe_token, consented_at, created_at)
         VALUES (?, ?, ?, ?, 'subscribed', ?, ?, ?)`,
            [subscriberId, cleanEmail, locale, source.slice(0, 60), unsubscribeToken, now, now]
          );
        }
        const welcomeFlows = await this.db.query(
          "SELECT * FROM automation_flows WHERE trigger_type = 'welcome_subscriber' AND active = 1"
        );
        for (const flow of welcomeFlows) {
          const flowId = String(flow.id);
          const dedupKey = `welcome:${subscriberId}`;
          const dupExec = await this.db.queryOne(
            "SELECT id FROM automation_executions WHERE flow_id = ? AND dedup_key = ?",
            [flowId, dedupKey]
          );
          if (dupExec) continue;
          await this.db.execute(
            "INSERT INTO automation_executions (id, flow_id, dedup_key, recipient_email, created_at) VALUES (?, ?, ?, ?, ?)",
            [`aex-${crypto5.randomUUID()}`, flowId, dedupKey, cleanEmail, now]
          );
          const subjectJson = parseJson(flow.subject_json, { en: "Welcome to NileLink", ar: "\u0623\u0647\u0644\u0627\u064B \u0628\u0643 \u0641\u064A \u0646\u064A\u0644 \u0644\u064A\u0646\u0643" });
          const blocks = parseJson(flow.blocks_json, []);
          const delayHours = Math.max(0, Number(flow.delay_hours ?? 0));
          const runAt = delayHours > 0 ? new Date(Date.now() + delayHours * 36e5) : /* @__PURE__ */ new Date();
          const payload = {
            flowId,
            to: cleanEmail,
            locale,
            subject: subjectJson[locale] || subjectJson.en || "Welcome to NileLink",
            blocks,
            attachCouponCode: flow.attach_coupon_code ? String(flow.attach_coupon_code) : null,
            unsubscribeToken
          };
          await enqueueJob(this.db, "send_marketing_email", payload, runAt);
          await this.db.execute(
            "UPDATE automation_flows SET total_triggered = total_triggered + 1, last_run_at = ? WHERE id = ?",
            [now, flowId]
          );
        }
        return { id: subscriberId, email: cleanEmail, status: "subscribed", alreadySubscribed };
      }
      async unsubscribeNewsletterByToken(token) {
        const clean = token.trim();
        if (!clean) return false;
        const row = await this.db.queryOne(
          "SELECT id FROM newsletter_subscribers WHERE unsubscribe_token = ? LIMIT 1",
          [clean]
        );
        if (!row) return false;
        await this.db.execute("UPDATE newsletter_subscribers SET status = 'unsubscribed' WHERE id = ?", [row.id]);
        return true;
      }
      async adminListNewsletterSubscribers() {
        const rows = await this.db.query(
          "SELECT id, email, locale, source, status, consented_at FROM newsletter_subscribers ORDER BY consented_at DESC LIMIT 500"
        );
        return rows.map((r) => ({
          id: String(r.id),
          email: String(r.email),
          locale: r.locale === "ar" ? "ar" : "en",
          source: String(r.source || "home"),
          status: r.status === "unsubscribed" ? "unsubscribed" : "subscribed",
          consentedAt: String(r.consented_at)
        }));
      }
      // --- Step 3: Multi-Placement Banners, Bot-Filtered Tracking, Popups & Featured Placements ---
      mapBannerRow(row) {
        const rawTitle = parseJson(row.title_json, {
          en: "",
          ar: ""
        });
        const ctaLabel = rawTitle.ctaEn || rawTitle.ctaAr ? { en: rawTitle.ctaEn || rawTitle.ctaAr || "", ar: rawTitle.ctaAr || rawTitle.ctaEn || "" } : void 0;
        return {
          id: String(row.id),
          title: { en: rawTitle.en || "", ar: rawTitle.ar || "" },
          ctaLabel,
          bgToken: String(row.bg_token || "graphite"),
          targetUrl: String(row.target_url || "/catalog"),
          pages: parseJson(row.pages_json, ["home"]),
          placement: String(row.placement || "page_strip"),
          imageUrl: row.image_url ? String(row.image_url) : null,
          dismissible: row.dismissible === void 0 ? true : Boolean(row.dismissible),
          audience: String(row.audience || "all"),
          deviceTarget: String(row.device_target || "all"),
          categorySlug: row.category_slug ? String(row.category_slug) : null,
          priority: Number(row.priority ?? 0),
          impressions: Number(row.impressions ?? 0),
          clicks: Number(row.clicks ?? 0),
          botFilteredCount: Number(row.bot_filtered_count ?? 0),
          startsAt: row.starts_at ? String(row.starts_at) : null,
          endsAt: row.ends_at ? String(row.ends_at) : null,
          active: Boolean(row.active)
        };
      }
      async getActiveBanners(page) {
        const rows = await this.db.query(
          "SELECT * FROM banners WHERE active = 1 ORDER BY priority DESC"
        );
        const nowMs = Date.now();
        return rows.map((r) => this.mapBannerRow(r)).filter((b) => {
          if (!isWithinSchedule(b.startsAt, b.endsAt, nowMs)) return false;
          if (page && !b.pages.includes(page)) return false;
          return true;
        });
      }
      async adminListBanners() {
        const rows = await this.db.query("SELECT * FROM banners ORDER BY priority DESC");
        return rows.map((r) => this.mapBannerRow(r));
      }
      async adminCreateBanner(actorUserId, input, ipAddress) {
        const id = `bnr-${crypto5.randomUUID()}`;
        const storedTitle = {
          en: input.title.en.trim(),
          ar: input.title.ar.trim(),
          ctaEn: input.ctaLabel?.en?.trim() || void 0,
          ctaAr: input.ctaLabel?.ar?.trim() || void 0
        };
        await this.db.execute(
          `INSERT INTO banners (id, title_json, bg_token, target_url, pages_json, placement, image_url, dismissible, audience, device_target, category_slug, priority, impressions, clicks, bot_filtered_count, starts_at, ends_at, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?, ?)`,
          [
            id,
            JSON.stringify(storedTitle),
            input.bgToken,
            input.targetUrl.trim() || "/catalog",
            JSON.stringify(input.pages.length > 0 ? input.pages : ["home"]),
            input.placement || "page_strip",
            input.imageUrl ? input.imageUrl.trim() : null,
            input.dismissible === false ? 0 : 1,
            input.audience || "all",
            input.deviceTarget || "all",
            input.categorySlug ? input.categorySlug.trim() : null,
            Math.trunc(input.priority ?? 10),
            input.startsAt ? toSqlTimestamp(new Date(input.startsAt)) : null,
            input.endsAt ? toSqlTimestamp(new Date(input.endsAt)) : null,
            input.active === false ? 0 : 1
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.create_banner",
          entityType: "banner",
          entityId: id,
          after: { bgToken: input.bgToken, placement: input.placement || "page_strip", pages: input.pages },
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM banners WHERE id = ?", [id]);
        return this.mapBannerRow(row);
      }
      async adminUpdateBanner(id, actorUserId, patch, ipAddress) {
        const existingRow = await this.db.queryOne("SELECT * FROM banners WHERE id = ?", [id]);
        if (!existingRow) throw new Error("Banner not found.");
        const existing = this.mapBannerRow(existingRow);
        const nextTitleObj = {
          en: patch.title?.en ?? existing.title.en,
          ar: patch.title?.ar ?? existing.title.ar,
          ctaEn: patch.ctaLabel ? patch.ctaLabel.en : existing.ctaLabel?.en,
          ctaAr: patch.ctaLabel ? patch.ctaLabel.ar : existing.ctaLabel?.ar
        };
        await this.db.execute(
          `UPDATE banners SET title_json = ?, bg_token = ?, target_url = ?, pages_json = ?, placement = ?, image_url = ?, dismissible = ?, audience = ?, device_target = ?, category_slug = ?, priority = ?, starts_at = ?, ends_at = ?, active = ? WHERE id = ?`,
          [
            JSON.stringify(nextTitleObj),
            patch.bgToken ?? existing.bgToken,
            patch.targetUrl ?? existing.targetUrl,
            JSON.stringify(patch.pages ?? existing.pages),
            patch.placement ?? existing.placement,
            patch.imageUrl !== void 0 ? patch.imageUrl ? patch.imageUrl.trim() : null : existing.imageUrl ?? null,
            patch.dismissible !== void 0 ? patch.dismissible ? 1 : 0 : existing.dismissible ? 1 : 0,
            patch.audience ?? existing.audience,
            patch.deviceTarget ?? existing.deviceTarget,
            patch.categorySlug !== void 0 ? patch.categorySlug ? patch.categorySlug.trim() : null : existing.categorySlug ?? null,
            patch.priority !== void 0 ? Math.trunc(patch.priority) : existing.priority,
            patch.startsAt !== void 0 ? patch.startsAt ? toSqlTimestamp(new Date(patch.startsAt)) : null : existing.startsAt,
            patch.endsAt !== void 0 ? patch.endsAt ? toSqlTimestamp(new Date(patch.endsAt)) : null : existing.endsAt,
            patch.active !== void 0 ? patch.active ? 1 : 0 : existing.active ? 1 : 0,
            id
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.update_banner",
          entityType: "banner",
          entityId: id,
          after: patch,
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM banners WHERE id = ?", [id]);
        return this.mapBannerRow(row);
      }
      async adminDeleteBanner(id, actorUserId, ipAddress) {
        await this.db.execute("DELETE FROM banners WHERE id = ?", [id]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_banner",
          entityType: "banner",
          entityId: id,
          ipAddress
        });
      }
      isBotTraffic(userAgent) {
        const ua = (userAgent || "").trim();
        if (!ua || ua.length < 4) return true;
        return /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|bingpreview|headless|lighthouse|phantomjs|puppeteer|playwright|curl\/|wget\/|python-requests|scrapy|ahrefs|semrush|mj12bot|dotbot|bytespider|gptbot|claudebot|yandex|baidu/i.test(
          ua
        );
      }
      async trackMarketingEvent(params) {
        const table = params.kind === "banner" ? "banners" : params.kind === "popup" ? "marketing_popups" : "featured_placements";
        if (this.isBotTraffic(params.userAgent)) {
          await this.db.execute(`UPDATE ${table} SET bot_filtered_count = bot_filtered_count + 1 WHERE id = ?`, [params.id]);
          return { counted: false, reason: "bot_filtered" };
        }
        const col = params.event === "click" ? "clicks" : params.event === "conversion" ? "conversions" : params.event === "dismissal" ? "dismissals" : "impressions";
        const visitorHash = sha256Hex(`${params.ip}|${params.userAgent.slice(0, 120)}|${params.sessionHint || ""}`).slice(0, 48);
        const windowMs = params.event === "impression" ? 10 * 6e4 : 6e4;
        const bucketKey = String(Math.floor(Date.now() / windowMs));
        const dedupSql = this.db.driver === "mysql" ? "INSERT IGNORE INTO marketing_events_dedup (id, entity_kind, entity_id, event_type, visitor_hash, bucket_key) VALUES (?, ?, ?, ?, ?, ?)" : "INSERT OR IGNORE INTO marketing_events_dedup (id, entity_kind, entity_id, event_type, visitor_hash, bucket_key) VALUES (?, ?, ?, ?, ?, ?)";
        const dedupRes = await this.db.execute(dedupSql, [
          `mkd-${crypto5.randomUUID()}`,
          params.kind,
          params.id,
          params.event,
          visitorHash,
          bucketKey
        ]);
        if (dedupRes.affectedRows === 0) {
          return { counted: false, reason: "deduplicated" };
        }
        await this.db.execute(`UPDATE ${table} SET ${col} = ${col} + 1 WHERE id = ?`, [params.id]);
        return { counted: true, reason: null };
      }
      async trackBannerEvent(id, event, meta) {
        return this.trackMarketingEvent({
          kind: "banner",
          id,
          event,
          ip: meta?.ip || "unknown",
          userAgent: meta?.userAgent || "Mozilla/5.0",
          sessionHint: meta?.sessionHint
        });
      }
      // --- Marketing Popups & Frequency Caps ---
      mapPopupRow(row) {
        return {
          id: String(row.id),
          title: parseJson(row.title_json, { en: "", ar: "" }),
          body: parseJson(row.body_json, { en: "", ar: "" }),
          ctaLabel: parseJson(row.cta_label_json, { en: "Shop Now", ar: "\u062A\u0633\u0648\u0642 \u0627\u0644\u0622\u0646" }),
          targetUrl: String(row.target_url || "/catalog"),
          imageUrl: row.image_url ? String(row.image_url) : null,
          bgToken: String(row.bg_token || "ember"),
          popupType: String(row.popup_type || "promo"),
          triggerType: String(row.trigger_type || "delay_seconds"),
          triggerValue: Number(row.trigger_value ?? 5),
          frequencyCap: String(row.frequency_cap || "once_per_day"),
          pages: parseJson(row.pages_json, ["home"]),
          audience: String(row.audience || "all"),
          deviceTarget: String(row.device_target || "all"),
          showNewsletterForm: Boolean(row.show_newsletter_form),
          couponCode: row.coupon_code ? String(row.coupon_code) : null,
          startsAt: row.starts_at ? String(row.starts_at) : null,
          endsAt: row.ends_at ? String(row.ends_at) : null,
          active: Boolean(row.active),
          impressions: Number(row.impressions ?? 0),
          conversions: Number(row.conversions ?? 0),
          dismissals: Number(row.dismissals ?? 0),
          botFilteredCount: Number(row.bot_filtered_count ?? 0)
        };
      }
      async getActivePopups() {
        const rows = await this.db.query(
          "SELECT * FROM marketing_popups WHERE active = 1 ORDER BY created_at DESC"
        );
        const nowMs = Date.now();
        return rows.map((r) => this.mapPopupRow(r)).filter((p) => isWithinSchedule(p.startsAt, p.endsAt, nowMs));
      }
      async adminListPopups() {
        const rows = await this.db.query("SELECT * FROM marketing_popups ORDER BY created_at DESC");
        return rows.map((r) => this.mapPopupRow(r));
      }
      async adminCreatePopup(actorUserId, input, ipAddress) {
        const id = `pop-${crypto5.randomUUID()}`;
        await this.db.execute(
          `INSERT INTO marketing_popups (id, title_json, body_json, cta_label_json, target_url, image_url, bg_token, popup_type, trigger_type, trigger_value, frequency_cap, pages_json, audience, device_target, show_newsletter_form, coupon_code, starts_at, ends_at, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            JSON.stringify(input.title),
            JSON.stringify(input.body),
            JSON.stringify(input.ctaLabel),
            input.targetUrl.trim() || "/catalog",
            input.imageUrl ? input.imageUrl.trim() : null,
            input.bgToken,
            input.popupType,
            input.triggerType,
            Math.max(0, Math.trunc(input.triggerValue)),
            input.frequencyCap,
            JSON.stringify(input.pages.length > 0 ? input.pages : ["home"]),
            input.audience,
            input.deviceTarget,
            input.showNewsletterForm ? 1 : 0,
            input.couponCode ? input.couponCode.trim().toUpperCase() : null,
            input.startsAt ? toSqlTimestamp(new Date(input.startsAt)) : null,
            input.endsAt ? toSqlTimestamp(new Date(input.endsAt)) : null,
            input.active === false ? 0 : 1
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.create_popup",
          entityType: "marketing_popup",
          entityId: id,
          after: { popupType: input.popupType, triggerType: input.triggerType, frequencyCap: input.frequencyCap },
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM marketing_popups WHERE id = ?", [id]);
        return this.mapPopupRow(row);
      }
      async adminUpdatePopup(id, actorUserId, patch, ipAddress) {
        const existingRow = await this.db.queryOne("SELECT * FROM marketing_popups WHERE id = ?", [id]);
        if (!existingRow) throw new Error("Popup not found.");
        const existing = this.mapPopupRow(existingRow);
        await this.db.execute(
          `UPDATE marketing_popups SET title_json = ?, body_json = ?, cta_label_json = ?, target_url = ?, image_url = ?, bg_token = ?, popup_type = ?, trigger_type = ?, trigger_value = ?, frequency_cap = ?, pages_json = ?, audience = ?, device_target = ?, show_newsletter_form = ?, coupon_code = ?, starts_at = ?, ends_at = ?, active = ? WHERE id = ?`,
          [
            JSON.stringify(patch.title ?? existing.title),
            JSON.stringify(patch.body ?? existing.body),
            JSON.stringify(patch.ctaLabel ?? existing.ctaLabel),
            patch.targetUrl ?? existing.targetUrl,
            patch.imageUrl !== void 0 ? patch.imageUrl ? patch.imageUrl.trim() : null : existing.imageUrl ?? null,
            patch.bgToken ?? existing.bgToken,
            patch.popupType ?? existing.popupType,
            patch.triggerType ?? existing.triggerType,
            patch.triggerValue !== void 0 ? Math.max(0, Math.trunc(patch.triggerValue)) : existing.triggerValue,
            patch.frequencyCap ?? existing.frequencyCap,
            JSON.stringify(patch.pages ?? existing.pages),
            patch.audience ?? existing.audience,
            patch.deviceTarget ?? existing.deviceTarget,
            patch.showNewsletterForm !== void 0 ? patch.showNewsletterForm ? 1 : 0 : existing.showNewsletterForm ? 1 : 0,
            patch.couponCode !== void 0 ? patch.couponCode ? patch.couponCode.trim().toUpperCase() : null : existing.couponCode ?? null,
            patch.startsAt !== void 0 ? patch.startsAt ? toSqlTimestamp(new Date(patch.startsAt)) : null : existing.startsAt,
            patch.endsAt !== void 0 ? patch.endsAt ? toSqlTimestamp(new Date(patch.endsAt)) : null : existing.endsAt,
            patch.active !== void 0 ? patch.active ? 1 : 0 : existing.active ? 1 : 0,
            id
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.update_popup",
          entityType: "marketing_popup",
          entityId: id,
          after: patch,
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM marketing_popups WHERE id = ?", [id]);
        return this.mapPopupRow(row);
      }
      async adminDeletePopup(id, actorUserId, ipAddress) {
        await this.db.execute("DELETE FROM marketing_popups WHERE id = ?", [id]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_popup",
          entityType: "marketing_popup",
          entityId: id,
          ipAddress
        });
      }
      // --- Featured Placements (Sponsored / Editorial Slots + Optional Ledger Fee) ---
      mapFeaturedPlacementRow(row) {
        return {
          id: String(row.id),
          slotKey: String(row.slot_key),
          targetType: String(row.target_type),
          targetId: String(row.target_id),
          sellerId: String(row.seller_id),
          targetLabel: row.target_label_json ? parseJson(row.target_label_json, { en: "Featured", ar: "\u0645\u0645\u064A\u0632" }) : null,
          sellerName: row.seller_name_json ? parseJson(row.seller_name_json, { en: "Store", ar: "\u0645\u062A\u062C\u0631" }) : null,
          badgeText: parseJson(row.badge_json, { en: "Featured", ar: "\u0645\u0645\u064A\u0632" }),
          priority: Number(row.priority ?? 10),
          feeUsdCents: Number(row.fee_usd_cents ?? 0),
          ledgerCharged: Boolean(row.ledger_charged),
          ledgerEntryId: row.ledger_entry_id ? String(row.ledger_entry_id) : null,
          startsAt: row.starts_at ? String(row.starts_at) : null,
          endsAt: row.ends_at ? String(row.ends_at) : null,
          active: Boolean(row.active),
          impressions: Number(row.impressions ?? 0),
          clicks: Number(row.clicks ?? 0),
          botFilteredCount: Number(row.bot_filtered_count ?? 0),
          createdAt: String(row.created_at)
        };
      }
      async getActiveFeaturedPlacements() {
        const rows = await this.db.query(
          `SELECT fp.*,
              st.name_json AS seller_name_json,
              COALESCE(p.title_json, st2.name_json) AS target_label_json
       FROM featured_placements fp
       LEFT JOIN stores st ON st.seller_id = fp.seller_id
       LEFT JOIN products p ON fp.target_type = 'product' AND p.id = fp.target_id
       LEFT JOIN stores st2 ON fp.target_type = 'store' AND st2.seller_id = fp.target_id
       WHERE fp.active = 1
       ORDER BY fp.priority DESC, fp.created_at DESC`
        );
        const nowMs = Date.now();
        return rows.map((r) => this.mapFeaturedPlacementRow(r)).filter((fp) => isWithinSchedule(fp.startsAt, fp.endsAt, nowMs));
      }
      async adminListFeaturedPlacements() {
        const rows = await this.db.query(
          `SELECT fp.*,
              st.name_json AS seller_name_json,
              COALESCE(p.title_json, st2.name_json) AS target_label_json
       FROM featured_placements fp
       LEFT JOIN stores st ON st.seller_id = fp.seller_id
       LEFT JOIN products p ON fp.target_type = 'product' AND p.id = fp.target_id
       LEFT JOIN stores st2 ON fp.target_type = 'store' AND st2.seller_id = fp.target_id
       ORDER BY fp.priority DESC, fp.created_at DESC`
        );
        return rows.map((r) => this.mapFeaturedPlacementRow(r));
      }
      async adminCreateFeaturedPlacement(actorUserId, input, ipAddress) {
        return this.db.transaction(async (tx) => {
          let resolvedSellerId = "";
          if (input.targetType === "product") {
            const prod = await tx.queryOne("SELECT seller_id FROM products WHERE id = ? AND deleted_at IS NULL", [
              input.targetId
            ]);
            if (!prod) throw new Error("Target product not found.");
            resolvedSellerId = prod.seller_id;
          } else {
            const seller = await tx.queryOne("SELECT id FROM sellers WHERE id = ? AND deleted_at IS NULL", [
              input.targetId
            ]);
            if (!seller) throw new Error("Target seller store not found.");
            resolvedSellerId = seller.id;
          }
          const id = `fpl-${crypto5.randomUUID()}`;
          const feeCents = Math.max(0, Math.trunc(input.feeUsdCents ?? 0));
          const shouldCharge = Boolean(input.chargeLedgerFee && feeCents > 0);
          const now = toSqlTimestamp();
          let ledgerEntryId = null;
          if (shouldCharge) {
            ledgerEntryId = `led-${crypto5.randomUUID()}`;
            await tx.execute(
              `INSERT INTO ledger_entries (id, seller_id, entry_type, direction, amount_usd_cents, availability, note, created_at)
           VALUES (?, ?, 'FEATURED_PLACEMENT_FEE', 'debit', ?, 'settled', ?, ?)`,
              [
                ledgerEntryId,
                resolvedSellerId,
                feeCents,
                `Featured placement (${input.slotKey}) for ${input.targetType} ${input.targetId}`,
                now
              ]
            );
          }
          await tx.execute(
            `INSERT INTO featured_placements (id, slot_key, target_type, target_id, seller_id, badge_json, priority, fee_usd_cents, ledger_charged, ledger_entry_id, starts_at, ends_at, active, created_by_user_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              input.slotKey,
              input.targetType,
              input.targetId,
              resolvedSellerId,
              JSON.stringify(input.badgeText),
              Math.trunc(input.priority ?? 10),
              feeCents,
              shouldCharge ? 1 : 0,
              ledgerEntryId,
              input.startsAt ? toSqlTimestamp(new Date(input.startsAt)) : null,
              input.endsAt ? toSqlTimestamp(new Date(input.endsAt)) : null,
              input.active === false ? 0 : 1,
              actorUserId,
              now
            ]
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.create_featured_placement",
            entityType: "featured_placement",
            entityId: id,
            after: { slotKey: input.slotKey, targetType: input.targetType, targetId: input.targetId, feeUsdCents: feeCents, ledgerCharged: shouldCharge },
            ipAddress
          });
          const row = await tx.queryOne(
            `SELECT fp.*,
                st.name_json AS seller_name_json,
                COALESCE(p.title_json, st2.name_json) AS target_label_json
         FROM featured_placements fp
         LEFT JOIN stores st ON st.seller_id = fp.seller_id
         LEFT JOIN products p ON fp.target_type = 'product' AND p.id = fp.target_id
         LEFT JOIN stores st2 ON fp.target_type = 'store' AND st2.seller_id = fp.target_id
         WHERE fp.id = ?`,
            [id]
          );
          return this.mapFeaturedPlacementRow(row);
        });
      }
      async adminUpdateFeaturedPlacement(id, actorUserId, patch, ipAddress) {
        return this.db.transaction(async (tx) => {
          const existingRow = await tx.queryOne("SELECT * FROM featured_placements WHERE id = ?", [id]);
          if (!existingRow) throw new Error("Featured placement not found.");
          const existing = this.mapFeaturedPlacementRow(existingRow);
          let ledgerCharged = existing.ledgerCharged;
          let ledgerEntryId = existing.ledgerEntryId ?? null;
          if (patch.chargeLedgerFeeNow && !existing.ledgerCharged && existing.feeUsdCents > 0) {
            ledgerEntryId = `led-${crypto5.randomUUID()}`;
            await tx.execute(
              `INSERT INTO ledger_entries (id, seller_id, entry_type, direction, amount_usd_cents, availability, note, created_at)
           VALUES (?, ?, 'FEATURED_PLACEMENT_FEE', 'debit', ?, 'settled', ?, ?)`,
              [
                ledgerEntryId,
                existing.sellerId,
                existing.feeUsdCents,
                `Featured placement (${existing.slotKey}) fee`,
                toSqlTimestamp()
              ]
            );
            ledgerCharged = true;
          }
          await tx.execute(
            `UPDATE featured_placements SET slot_key = ?, badge_json = ?, priority = ?, ledger_charged = ?, ledger_entry_id = ?, starts_at = ?, ends_at = ?, active = ? WHERE id = ?`,
            [
              patch.slotKey ?? existing.slotKey,
              JSON.stringify(patch.badgeText ?? existing.badgeText),
              patch.priority !== void 0 ? Math.trunc(patch.priority) : existing.priority,
              ledgerCharged ? 1 : 0,
              ledgerEntryId,
              patch.startsAt !== void 0 ? patch.startsAt ? toSqlTimestamp(new Date(patch.startsAt)) : null : existing.startsAt,
              patch.endsAt !== void 0 ? patch.endsAt ? toSqlTimestamp(new Date(patch.endsAt)) : null : existing.endsAt,
              patch.active !== void 0 ? patch.active ? 1 : 0 : existing.active ? 1 : 0,
              id
            ]
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.update_featured_placement",
            entityType: "featured_placement",
            entityId: id,
            after: patch,
            ipAddress
          });
          const row = await tx.queryOne(
            `SELECT fp.*,
                st.name_json AS seller_name_json,
                COALESCE(p.title_json, st2.name_json) AS target_label_json
         FROM featured_placements fp
         LEFT JOIN stores st ON st.seller_id = fp.seller_id
         LEFT JOIN products p ON fp.target_type = 'product' AND p.id = fp.target_id
         LEFT JOIN stores st2 ON fp.target_type = 'store' AND st2.seller_id = fp.target_id
         WHERE fp.id = ?`,
            [id]
          );
          return this.mapFeaturedPlacementRow(row);
        });
      }
      async adminDeleteFeaturedPlacement(id, actorUserId, ipAddress) {
        await this.db.execute("DELETE FROM featured_placements WHERE id = ?", [id]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_featured_placement",
          entityType: "featured_placement",
          entityId: id,
          ipAddress
        });
      }
      // --- Phase B & Marketing Hub: Offers, Conflict Check, Flash Sales & Campaigns ---
      mapOfferRow(row) {
        return {
          id: String(row.id),
          sellerId: row.seller_id ? String(row.seller_id) : null,
          sellerName: row.seller_name_json ? parseJson(row.seller_name_json, { en: "Store", ar: "\u0645\u062A\u062C\u0631" }) : null,
          title: parseJson(row.title_json, { en: "", ar: "" }),
          offerType: String(row.offer_type),
          discountValue: Number(row.discount_value),
          targetType: String(row.target_type),
          targetId: row.target_id ? String(row.target_id) : null,
          stackingRule: String(row.stacking_rule || "best_only"),
          fundingSource: String(row.funding_source || "platform"),
          fundingPlatformBps: Number(row.funding_platform_bps ?? 1e4),
          campaignId: row.campaign_id ? String(row.campaign_id) : null,
          priority: Number(row.priority ?? 10),
          rules: row.rules_json ? parseJson(row.rules_json, {}) : void 0,
          approvalStatus: String(row.approval_status || "pending"),
          startsAt: row.starts_at ? String(row.starts_at) : null,
          endsAt: row.ends_at ? String(row.ends_at) : null,
          active: Boolean(row.active)
        };
      }
      async getActiveOffers(tx = this.db) {
        const rows = await tx.query(
          `SELECT o.*, st.name_json AS seller_name_json
       FROM offers o
       LEFT JOIN stores st ON st.seller_id = o.seller_id
       WHERE o.approval_status = 'approved' AND o.active = 1
       ORDER BY o.priority DESC`
        );
        const nowMs = Date.now();
        return rows.map((r) => this.mapOfferRow(r)).filter((o) => isWithinSchedule(o.startsAt, o.endsAt, nowMs));
      }
      async adminListOffers() {
        const rows = await this.db.query(
          `SELECT o.*, st.name_json AS seller_name_json
       FROM offers o
       LEFT JOIN stores st ON st.seller_id = o.seller_id
       ORDER BY o.priority DESC, o.approval_status ASC, o.id DESC`
        );
        return rows.map((r) => this.mapOfferRow(r));
      }
      async checkOfferConflicts(input) {
        const [all, activeFlashSales] = await Promise.all([
          this.adminListOffers(),
          this.adminListFlashSales()
        ]);
        const sNew = input.startsAt ? Date.parse(input.startsAt) : -Infinity;
        const eNew = input.endsAt ? Date.parse(input.endsAt) : Infinity;
        if (Number.isFinite(sNew) && Number.isFinite(eNew) && eNew <= sNew) {
          return [
            {
              conflictingOfferId: "invalid-dates",
              conflictingTitle: "Invalid Schedule Window",
              reason: "End timestamp must be strictly after start timestamp.",
              severity: "error",
              conflictType: "exclusivity"
            }
          ];
        }
        const conflicts = [];
        const candidatePriority = Math.trunc(input.priority ?? 10);
        const highestExistingPriority = all.reduce((max, o) => Math.max(max, o.priority), 10);
        const suggestedPriority = highestExistingPriority + 5;
        let stackablePercentTotal = input.stackingRule === "stackable" && ["percent", "flash_percent", "first_order", "vip_exclusive", "bundle_deal"].includes(input.offerType) ? Number(input.discountValue || 0) : 0;
        for (const existing of all) {
          if (existing.id === input.excludeOfferId) continue;
          if (!existing.active || existing.approvalStatus === "rejected") continue;
          const sOld = existing.startsAt ? Date.parse(existing.startsAt) : -Infinity;
          const eOld = existing.endsAt ? Date.parse(existing.endsAt) : Infinity;
          const datesOverlap = sNew <= eOld && eNew >= sOld;
          if (!datesOverlap) continue;
          const sameScope = existing.targetType === "all" || input.targetType === "all" || existing.targetType === input.targetType && (existing.targetId || "") === (input.targetId || "");
          if (!sameScope) continue;
          if (existing.stackingRule === "exclusive" || input.stackingRule === "exclusive") {
            conflicts.push({
              conflictingOfferId: existing.id,
              conflictingTitle: existing.title.en,
              reason: `Exclusive blocking conflict on ${existing.targetType} scope (${existing.stackingRule}) during overlapping dates.`,
              severity: "error",
              conflictType: "exclusivity",
              suggestedPriority
            });
          } else if (existing.priority === candidatePriority) {
            conflicts.push({
              conflictingOfferId: existing.id,
              conflictingTitle: existing.title.en,
              reason: `Priority tie at P${candidatePriority} on ${existing.targetType} scope. Set a distinct priority (e.g. P${suggestedPriority}) for deterministic evaluation.`,
              severity: "warning",
              conflictType: "priority_tie",
              suggestedPriority
            });
          } else {
            if (existing.stackingRule === "stackable" && input.stackingRule === "stackable" && ["percent", "flash_percent", "first_order", "vip_exclusive", "bundle_deal"].includes(existing.offerType)) {
              stackablePercentTotal += Number(existing.discountValue || 0);
            }
            conflicts.push({
              conflictingOfferId: existing.id,
              conflictingTitle: existing.title.en,
              reason: `Overlapping ${existing.offerType} promotion on ${existing.targetType} (${existing.stackingRule} \xB7 P${existing.priority}).`,
              severity: "warning",
              conflictType: "stacking_overlap",
              suggestedPriority
            });
          }
        }
        if (stackablePercentTotal > 85) {
          conflicts.push({
            conflictingOfferId: "stack-saturation",
            conflictingTitle: "Stackable Margin Saturation Guard",
            reason: `Combined stackable discounts on overlapping scope reach ~${stackablePercentTotal}%. Consider using best_only or lowering discount %.`,
            severity: "error",
            conflictType: "stacking_overlap"
          });
        }
        for (const fs4 of activeFlashSales) {
          if (fs4.status === "ended") continue;
          const fsStart = Date.parse(fs4.startsAt);
          const fsEnd = Date.parse(fs4.endsAt);
          if (sNew <= fsEnd && eNew >= fsStart) {
            const affectsProduct = input.targetType === "all" || input.targetType === "product" && fs4.items.some((it) => it.productId === input.targetId);
            if (affectsProduct) {
              conflicts.push({
                conflictingOfferId: fs4.id,
                conflictingTitle: `Flash Sale: ${fs4.title.en}`,
                reason: `Overlaps timed Flash Sale window (${fs4.items.length} capped SKU(s)). Flash price overrides standard offers unless stacked.`,
                severity: "warning",
                conflictType: "flash_overlap",
                suggestedPriority
              });
            }
          }
        }
        return conflicts;
      }
      async adminCreateOffer(actorUserId, input, ipAddress) {
        if (["percent", "flash_percent", "first_order", "vip_exclusive"].includes(input.offerType) && (input.discountValue < 1 || input.discountValue > 90)) {
          throw new Error("Percentage discount must be between 1% and 90%.");
        }
        if (input.offerType === "fixed_usd_cents" && input.discountValue < 1) {
          throw new Error("Fixed discount must be at least 1 USD cent.");
        }
        const id = `off-${crypto5.randomUUID()}`;
        const fundingSource = input.fundingSource || "platform";
        const fundingPlatformBps = fundingSource === "platform" ? 1e4 : fundingSource === "seller" ? 0 : Math.min(1e4, Math.max(0, Math.trunc(input.fundingPlatformBps ?? 5e3)));
        await this.db.execute(
          `INSERT INTO offers (id, seller_id, title_json, offer_type, discount_value, target_type, target_id, stacking_rule, funding_source, funding_platform_bps, campaign_id, priority, rules_json, approval_status, starts_at, ends_at, active)
       VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?, ?)`,
          [
            id,
            JSON.stringify(input.title),
            input.offerType,
            Math.round(input.discountValue),
            input.targetType,
            input.targetId?.trim() || null,
            input.stackingRule || "best_only",
            fundingSource,
            fundingPlatformBps,
            input.campaignId?.trim() || null,
            Math.trunc(input.priority ?? 10),
            input.rules ? JSON.stringify(input.rules) : null,
            input.startsAt ? toSqlTimestamp(new Date(input.startsAt)) : null,
            input.endsAt ? toSqlTimestamp(new Date(input.endsAt)) : null,
            input.active === false ? 0 : 1
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.create_offer",
          entityType: "offer",
          entityId: id,
          after: {
            offerType: input.offerType,
            discountValue: input.discountValue,
            targetType: input.targetType,
            stackingRule: input.stackingRule || "best_only",
            fundingSource
          },
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM offers WHERE id = ?", [id]);
        const mappedOffer = this.mapOfferRow(row);
        if (mappedOffer.active && mappedOffer.approvalStatus === "approved") {
          await this.dispatchOfferActivatedNotifications(this.db, mappedOffer);
        }
        return mappedOffer;
      }
      async adminUpdateOffer(id, actorUserId, patch, ipAddress) {
        const existing = await this.db.queryOne("SELECT * FROM offers WHERE id = ?", [id]);
        if (!existing) throw new Error("Offer not found.");
        const nextStatus = patch.approvalStatus ?? String(existing.approval_status);
        const nextActive = patch.active !== void 0 ? patch.active ? 1 : 0 : existing.active ? 1 : 0;
        const nextPriority = patch.priority !== void 0 ? Math.trunc(patch.priority) : Number(existing.priority ?? 10);
        const nextStacking = patch.stackingRule ?? String(existing.stacking_rule || "best_only");
        const nextStartsAt = patch.startsAt !== void 0 ? patch.startsAt ? toSqlTimestamp(new Date(patch.startsAt)) : null : existing.starts_at;
        const nextEndsAt = patch.endsAt !== void 0 ? patch.endsAt ? toSqlTimestamp(new Date(patch.endsAt)) : null : existing.ends_at;
        if (nextStartsAt && nextEndsAt && Date.parse(nextEndsAt) <= Date.parse(nextStartsAt)) {
          throw new Error("Offer end date must be after start date.");
        }
        await this.db.execute(
          "UPDATE offers SET approval_status = ?, active = ?, priority = ?, stacking_rule = ?, starts_at = ?, ends_at = ? WHERE id = ?",
          [nextStatus, nextActive, nextPriority, nextStacking, nextStartsAt, nextEndsAt, id]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.update_offer",
          entityType: "offer",
          entityId: id,
          before: {
            approvalStatus: existing.approval_status,
            active: Boolean(existing.active),
            priority: Number(existing.priority ?? 10),
            stackingRule: existing.stacking_rule
          },
          after: {
            approvalStatus: nextStatus,
            active: Boolean(nextActive),
            priority: nextPriority,
            stackingRule: nextStacking,
            startsAt: nextStartsAt,
            endsAt: nextEndsAt
          },
          ipAddress
        });
        const row = await this.db.queryOne(
          `SELECT o.*, st.name_json AS seller_name_json FROM offers o LEFT JOIN stores st ON st.seller_id = o.seller_id WHERE o.id = ?`,
          [id]
        );
        const mappedOffer = this.mapOfferRow(row);
        const becameActive = (String(existing.approval_status) !== "approved" || !Boolean(existing.active)) && mappedOffer.approvalStatus === "approved" && mappedOffer.active;
        if (becameActive) {
          await this.dispatchOfferActivatedNotifications(this.db, mappedOffer);
        }
        return mappedOffer;
      }
      async adminDeleteOffer(id, actorUserId, ipAddress) {
        await this.db.execute("DELETE FROM offers WHERE id = ?", [id]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_offer",
          entityType: "offer",
          entityId: id,
          ipAddress
        });
      }
      // --- Flash Sales & Stock Caps ---
      async hydrateFlashSales(saleRows, tx = this.db) {
        const results = [];
        for (const s of saleRows) {
          const itemRows = await tx.query(
            `SELECT fsi.*, p.title_json AS product_title_json, p.base_price_usd_cents AS base_price_usd_cents
         FROM flash_sale_items fsi
         LEFT JOIN products p ON p.id = fsi.product_id
         WHERE fsi.flash_sale_id = ?`,
            [String(s.id)]
          );
          const items = itemRows.map((it) => ({
            id: String(it.id),
            flashSaleId: String(it.flash_sale_id),
            productId: String(it.product_id),
            productTitle: it.product_title_json ? parseJson(it.product_title_json, { en: "Product", ar: "\u0645\u0646\u062A\u062C" }) : void 0,
            basePriceUsdCents: it.base_price_usd_cents !== null && it.base_price_usd_cents !== void 0 ? Number(it.base_price_usd_cents) : void 0,
            salePriceUsdCents: Number(it.sale_price_usd_cents),
            discountPercent: Number(it.discount_percent),
            stockCap: Number(it.stock_cap),
            claimedCount: Number(it.claimed_count)
          }));
          results.push({
            id: String(s.id),
            slug: String(s.slug),
            title: parseJson(s.title_json, { en: "", ar: "" }),
            bgToken: String(s.bg_token || "ember"),
            startsAt: String(s.starts_at),
            endsAt: String(s.ends_at),
            status: String(s.status || "scheduled"),
            autoRevert: Boolean(s.auto_revert),
            items,
            createdAt: String(s.created_at)
          });
        }
        return results;
      }
      async getActiveFlashSales(tx = this.db) {
        const rows = await tx.query(
          "SELECT * FROM flash_sales WHERE status != 'ended' ORDER BY ends_at ASC"
        );
        const hydrated = await this.hydrateFlashSales(rows, tx);
        const nowMs = Date.now();
        return hydrated.filter((fs4) => isWithinSchedule(fs4.startsAt, fs4.endsAt, nowMs));
      }
      async adminListFlashSales() {
        const rows = await this.db.query("SELECT * FROM flash_sales ORDER BY created_at DESC");
        return this.hydrateFlashSales(rows);
      }
      async adminCreateFlashSale(actorUserId, input, ipAddress) {
        if (!input.items || input.items.length === 0) throw new Error("Select at least one product for a flash sale.");
        const startMs = Date.parse(input.startsAt);
        const endMs = Date.parse(input.endsAt);
        if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs <= startMs) {
          throw new Error("Flash sale end date must be after start date.");
        }
        return this.db.transaction(async (tx) => {
          const id = `fls-${crypto5.randomUUID()}`;
          const baseSlug = (input.slug || input.title.en || "flash-sale").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "flash";
          const slug = `${baseSlug}-${crypto5.randomInt(100, 999)}`;
          const nowMs = Date.now();
          const status = nowMs >= startMs && nowMs < endMs ? "active" : nowMs >= endMs ? "ended" : "scheduled";
          const nowSql = toSqlTimestamp();
          await tx.execute(
            `INSERT INTO flash_sales (id, slug, title_json, bg_token, starts_at, ends_at, status, auto_revert, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              slug,
              JSON.stringify(input.title),
              input.bgToken || "ember",
              toSqlTimestamp(new Date(startMs)),
              toSqlTimestamp(new Date(endMs)),
              status,
              input.autoRevert === false ? 0 : 1,
              nowSql
            ]
          );
          for (const item of input.items) {
            const prod = await tx.queryOne(
              "SELECT id, base_price_usd_cents FROM products WHERE id = ? AND deleted_at IS NULL",
              [item.productId]
            );
            if (!prod) throw new Error(`Product ${item.productId} not found.`);
            const pct = Math.min(90, Math.max(1, Math.round(item.discountPercent)));
            const salePrice = Math.max(1, Math.round(Number(prod.base_price_usd_cents) * (100 - pct) / 100));
            await tx.execute(
              `INSERT INTO flash_sale_items (id, flash_sale_id, product_id, sale_price_usd_cents, discount_percent, stock_cap, claimed_count)
           VALUES (?, ?, ?, ?, ?, ?, 0)`,
              [`fsi-${crypto5.randomUUID()}`, id, prod.id, salePrice, pct, Math.max(0, Math.trunc(item.stockCap || 0))]
            );
          }
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.create_flash_sale",
            entityType: "flash_sale",
            entityId: id,
            after: { slug, status, itemCount: input.items.length },
            ipAddress
          });
          const [created] = await this.hydrateFlashSales(
            await tx.query("SELECT * FROM flash_sales WHERE id = ?", [id]),
            tx
          );
          if (created.status === "active") {
            await this.dispatchFlashSaleNotifications(tx, created);
          }
          return created;
        });
      }
      async adminUpdateFlashSale(id, actorUserId, patch, ipAddress) {
        const existing = await this.db.queryOne("SELECT * FROM flash_sales WHERE id = ?", [id]);
        if (!existing) throw new Error("Flash sale not found.");
        const nextStatus = patch.status ?? String(existing.status);
        const nextStartsAt = patch.startsAt ? toSqlTimestamp(new Date(patch.startsAt)) : String(existing.starts_at);
        const nextEndsAt = patch.endsAt ? toSqlTimestamp(new Date(patch.endsAt)) : String(existing.ends_at);
        if (Date.parse(nextEndsAt) <= Date.parse(nextStartsAt)) {
          throw new Error("Flash sale end date must be after start date.");
        }
        await this.db.execute("UPDATE flash_sales SET status = ?, starts_at = ?, ends_at = ? WHERE id = ?", [
          nextStatus,
          nextStartsAt,
          nextEndsAt,
          id
        ]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.update_flash_sale",
          entityType: "flash_sale",
          entityId: id,
          after: { status: nextStatus, startsAt: nextStartsAt, endsAt: nextEndsAt },
          ipAddress
        });
        const [row] = await this.hydrateFlashSales(
          await this.db.query("SELECT * FROM flash_sales WHERE id = ?", [id])
        );
        if (String(existing.status) !== "active" && row.status === "active") {
          await this.dispatchFlashSaleNotifications(this.db, row);
        }
        return row;
      }
      async adminUpdateFlashSaleStatus(id, actorUserId, status, ipAddress) {
        return this.adminUpdateFlashSale(id, actorUserId, { status }, ipAddress);
      }
      async adminDeleteFlashSale(id, actorUserId, ipAddress) {
        await this.db.execute("DELETE FROM flash_sale_items WHERE flash_sale_id = ?", [id]);
        await this.db.execute("DELETE FROM flash_sales WHERE id = ?", [id]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_flash_sale",
          entityType: "flash_sale",
          entityId: id,
          ipAddress
        });
      }
      // --- Marketing Campaigns ---
      mapCampaignRow(row) {
        return {
          id: String(row.id),
          slug: String(row.slug),
          title: parseJson(row.title_json, { en: "", ar: "" }),
          subtitle: parseJson(row.subtitle_json, { en: "", ar: "" }),
          description: parseJson(row.description_json, { en: "", ar: "" }),
          heroImageUrl: row.hero_image_url ? String(row.hero_image_url) : null,
          bgToken: String(row.bg_token || "ember"),
          startsAt: row.starts_at ? String(row.starts_at) : null,
          endsAt: row.ends_at ? String(row.ends_at) : null,
          status: String(row.status || "draft"),
          featuredOfferIds: parseJson(row.featured_offer_ids_json, []),
          featuredCouponCodes: parseJson(row.featured_coupon_codes_json, []),
          featuredFlashSaleId: row.featured_flash_sale_id ? String(row.featured_flash_sale_id) : null,
          createdAt: String(row.created_at)
        };
      }
      async getActiveCampaigns() {
        const rows = await this.db.query(
          "SELECT * FROM campaigns WHERE status IN ('active', 'scheduled') ORDER BY created_at DESC"
        );
        const nowMs = Date.now();
        return rows.map((r) => this.mapCampaignRow(r)).filter((c) => c.status === "active" && isWithinSchedule(c.startsAt, c.endsAt, nowMs));
      }
      async getPublicCampaignBySlug(slug) {
        const row = await this.db.queryOne(
          "SELECT * FROM campaigns WHERE slug = ? AND status != 'draft' LIMIT 1",
          [slug.trim()]
        );
        return row ? this.mapCampaignRow(row) : null;
      }
      async adminListCampaigns() {
        const rows = await this.db.query("SELECT * FROM campaigns ORDER BY created_at DESC");
        return rows.map((r) => this.mapCampaignRow(r));
      }
      async adminCreateCampaign(actorUserId, input, ipAddress) {
        const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || `campaign-${crypto5.randomInt(100, 999)}`;
        const dup = await this.db.queryOne("SELECT id FROM campaigns WHERE slug = ?", [cleanSlug]);
        if (dup) throw new Error(`Campaign slug '${cleanSlug}' already exists.`);
        const id = `cmp-${crypto5.randomUUID()}`;
        const now = toSqlTimestamp();
        await this.db.execute(
          `INSERT INTO campaigns (id, slug, title_json, subtitle_json, description_json, hero_image_url, bg_token, starts_at, ends_at, status, featured_offer_ids_json, featured_coupon_codes_json, featured_flash_sale_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            cleanSlug,
            JSON.stringify(input.title),
            JSON.stringify(input.subtitle),
            JSON.stringify(input.description),
            input.heroImageUrl ? input.heroImageUrl.trim() : null,
            input.bgToken || "ember",
            input.startsAt ? toSqlTimestamp(new Date(input.startsAt)) : null,
            input.endsAt ? toSqlTimestamp(new Date(input.endsAt)) : null,
            input.status || "active",
            JSON.stringify(input.featuredOfferIds || []),
            JSON.stringify((input.featuredCouponCodes || []).map((c) => c.trim().toUpperCase()).filter(Boolean)),
            input.featuredFlashSaleId || null,
            now
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.create_campaign",
          entityType: "campaign",
          entityId: id,
          after: { slug: cleanSlug, status: input.status || "active" },
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM campaigns WHERE id = ?", [id]);
        const created = this.mapCampaignRow(row);
        if (created.status === "active") {
          await this.notifyPromotionalOfferFanout(this.db, {
            entityType: "campaign",
            entityId: created.id,
            title: created.title,
            body: {
              en: `${created.subtitle.en || created.description.en || "New curated campaign live on NileLink."}`,
              ar: `${created.subtitle.ar || created.description.ar || "\u062D\u0645\u0644\u0629 \u0639\u0631\u0648\u0636 \u062C\u062F\u064A\u062F\u0629 \u0645\u062A\u0627\u062D\u0629 \u0627\u0644\u0622\u0646 \u0639\u0644\u0649 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643."}`
            },
            actionUrl: `/campaign/${created.slug}`
          });
        }
        return created;
      }
      async adminUpdateCampaign(id, actorUserId, patch, ipAddress) {
        const existingRow = await this.db.queryOne("SELECT * FROM campaigns WHERE id = ?", [id]);
        if (!existingRow) throw new Error("Campaign not found.");
        const existing = this.mapCampaignRow(existingRow);
        await this.db.execute(
          `UPDATE campaigns SET title_json = ?, subtitle_json = ?, description_json = ?, hero_image_url = ?, bg_token = ?, starts_at = ?, ends_at = ?, status = ?, featured_offer_ids_json = ?, featured_coupon_codes_json = ?, featured_flash_sale_id = ? WHERE id = ?`,
          [
            JSON.stringify(patch.title ?? existing.title),
            JSON.stringify(patch.subtitle ?? existing.subtitle),
            JSON.stringify(patch.description ?? existing.description),
            patch.heroImageUrl !== void 0 ? patch.heroImageUrl ? patch.heroImageUrl.trim() : null : existing.heroImageUrl ?? null,
            patch.bgToken ?? existing.bgToken,
            patch.startsAt !== void 0 ? patch.startsAt ? toSqlTimestamp(new Date(patch.startsAt)) : null : existing.startsAt,
            patch.endsAt !== void 0 ? patch.endsAt ? toSqlTimestamp(new Date(patch.endsAt)) : null : existing.endsAt,
            patch.status ?? existing.status,
            JSON.stringify(patch.featuredOfferIds ?? existing.featuredOfferIds),
            JSON.stringify(patch.featuredCouponCodes ?? existing.featuredCouponCodes),
            patch.featuredFlashSaleId !== void 0 ? patch.featuredFlashSaleId : existing.featuredFlashSaleId ?? null,
            id
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.update_campaign",
          entityType: "campaign",
          entityId: id,
          after: patch,
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM campaigns WHERE id = ?", [id]);
        const updated = this.mapCampaignRow(row);
        if (existing.status !== "active" && updated.status === "active") {
          await this.notifyPromotionalOfferFanout(this.db, {
            entityType: "campaign",
            entityId: updated.id,
            title: updated.title,
            body: {
              en: `${updated.subtitle.en || updated.description.en || "New promotional campaign is now live."}`,
              ar: `${updated.subtitle.ar || updated.description.ar || "\u0627\u0646\u0637\u0644\u0642\u062A \u062D\u0645\u0644\u0629 \u0639\u0631\u0648\u0636 \u062A\u0631\u0648\u064A\u062C\u064A\u0629 \u062C\u062F\u064A\u062F\u0629 \u0627\u0644\u0622\u0646."}`
            },
            actionUrl: `/campaign/${updated.slug}`
          });
        }
        return updated;
      }
      async adminDeleteCampaign(id, actorUserId, ipAddress) {
        await this.db.execute("DELETE FROM campaigns WHERE id = ?", [id]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_campaign",
          entityType: "campaign",
          entityId: id,
          ipAddress
        });
      }
      async sellerListOffers(sellerId) {
        const rows = await this.db.query(
          `SELECT o.*, st.name_json AS seller_name_json
       FROM offers o
       LEFT JOIN stores st ON st.seller_id = o.seller_id
       WHERE o.seller_id = ?
       ORDER BY o.id DESC`,
          [sellerId]
        );
        return rows.map((r) => this.mapOfferRow(r));
      }
      async sellerProposeOffer(sellerId, actorUserId, input, ipAddress) {
        const rules = await this.getSellerPromoRules();
        if (!rules.sellerOffersEnabled) {
          throw new Error("Seller-submitted offers are currently paused by marketplace administration.");
        }
        if (input.offerType === "flash_percent" && !rules.allowFlashOffersBySellers) {
          throw new Error("Flash offers are restricted to admin campaigns under current marketplace rules.");
        }
        if (input.offerType !== "fixed_usd_cents" && (input.discountValue < 1 || input.discountValue > rules.maxDiscountPercent)) {
          throw new Error(`Seller discount percent must be between 1% and ${rules.maxDiscountPercent}%.`);
        }
        if (input.offerType === "fixed_usd_cents" && (input.discountValue < 100 || input.discountValue > rules.maxFixedDiscountUsdCents)) {
          throw new Error(
            `Seller fixed discount must be between $1.00 and $${(rules.maxFixedDiscountUsdCents / 100).toFixed(2)}.`
          );
        }
        const activeCntRow = await this.db.queryOne(
          "SELECT COUNT(*) AS cnt FROM offers WHERE seller_id = ? AND approval_status != 'rejected' AND active = 1",
          [sellerId]
        );
        if (Number(activeCntRow?.cnt ?? 0) >= rules.maxActiveOffersPerSeller) {
          throw new Error(`Maximum ${rules.maxActiveOffersPerSeller} active/pending offers allowed per seller.`);
        }
        let resolvedTargetId = sellerId;
        if (input.targetType === "product") {
          if (!input.targetId) throw new Error("Select a product for product-level offers.");
          const prod = await this.db.queryOne(
            "SELECT id FROM products WHERE id = ? AND seller_id = ? AND deleted_at IS NULL",
            [input.targetId, sellerId]
          );
          if (!prod) throw new Error("Product does not belong to your store.");
          resolvedTargetId = prod.id;
        }
        const approvalStatus = rules.requireAdminApproval ? "pending" : "approved";
        const id = `off-${crypto5.randomUUID()}`;
        await this.db.execute(
          `INSERT INTO offers (id, seller_id, title_json, offer_type, discount_value, target_type, target_id, approval_status, starts_at, ends_at, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            id,
            sellerId,
            JSON.stringify(input.title),
            input.offerType,
            Math.round(input.discountValue),
            input.targetType,
            resolvedTargetId,
            approvalStatus,
            input.startsAt ? toSqlTimestamp(new Date(input.startsAt)) : null,
            input.endsAt ? toSqlTimestamp(new Date(input.endsAt)) : null
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "seller.propose_offer",
          entityType: "offer",
          entityId: id,
          after: { sellerId, targetType: input.targetType, resolvedTargetId, approvalStatus },
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM offers WHERE id = ?", [id]);
        const offer = this.mapOfferRow(row);
        if (offer.approvalStatus === "approved" && offer.active) {
          await this.dispatchOfferActivatedNotifications(this.db, offer);
        }
        return offer;
      }
      // --- Step 5: Customer Segments, Email Block Campaigns & Automated Flows ---
      mapSegmentRow(row) {
        return {
          id: String(row.id),
          name: parseJson(row.name_json, { en: "Segment", ar: "\u0634\u0631\u064A\u062D\u0629" }),
          description: String(row.description || ""),
          rules: parseJson(row.rules_json, { audienceScope: "all_contacts" }),
          cachedMemberCount: Number(row.cached_member_count ?? 0),
          updatedAt: String(row.updated_at)
        };
      }
      mapEmailCampaignRow(row) {
        return {
          id: String(row.id),
          name: String(row.name),
          subject: parseJson(row.subject_json, { en: "", ar: "" }),
          previewText: parseJson(row.preview_text_json, { en: "", ar: "" }),
          segmentId: row.segment_id ? String(row.segment_id) : null,
          blocks: parseJson(row.blocks_json, []),
          status: String(row.status || "draft"),
          scheduledAt: row.scheduled_at ? String(row.scheduled_at) : null,
          sentCount: Number(row.sent_count ?? 0),
          failedCount: Number(row.failed_count ?? 0),
          unsubscribedCount: Number(row.unsubscribed_count ?? 0),
          createdAt: String(row.created_at),
          sentAt: row.sent_at ? String(row.sent_at) : null
        };
      }
      mapAutomationFlowRow(row) {
        return {
          id: String(row.id),
          name: parseJson(row.name_json, { en: "Automation Flow", ar: "\u0633\u064A\u0631 \u0639\u0645\u0644 \u062A\u0644\u0642\u0627\u0626\u064A" }),
          triggerType: String(row.trigger_type || "welcome_subscriber"),
          delayHours: Number(row.delay_hours ?? 0),
          subject: parseJson(row.subject_json, { en: "", ar: "" }),
          blocks: parseJson(row.blocks_json, []),
          attachCouponCode: row.attach_coupon_code ? String(row.attach_coupon_code) : null,
          active: Boolean(row.active),
          totalTriggered: Number(row.total_triggered ?? 0),
          totalSent: Number(row.total_sent ?? 0),
          lastRunAt: row.last_run_at ? String(row.last_run_at) : null,
          createdAt: String(row.created_at)
        };
      }
      async evaluateSegmentContacts(rules) {
        const [customerRows, orderRows, addressRows, subscriberRows] = await Promise.all([
          this.db.query(
            "SELECT id, name, email, preferred_locale FROM users WHERE role_key = 'customer' AND deleted_at IS NULL AND is_blocked = 0"
          ),
          this.db.query(
            "SELECT user_id, governorate, grand_total_usd_cents, created_at FROM orders WHERE user_id IS NOT NULL ORDER BY created_at DESC"
          ),
          this.db.query(
            "SELECT user_id, governorate FROM addresses WHERE is_default = 1"
          ),
          this.db.query(
            "SELECT email, locale, status, unsubscribe_token FROM newsletter_subscribers"
          )
        ]);
        const orderStatsByUserId = /* @__PURE__ */ new Map();
        for (const o of orderRows) {
          const uid = String(o.user_id);
          const prev = orderStatsByUserId.get(uid);
          if (!prev) {
            orderStatsByUserId.set(uid, {
              count: 1,
              totalSpentUsdCents: Number(o.grand_total_usd_cents || 0),
              latestGovernorate: o.governorate ? String(o.governorate) : void 0,
              lastOrderAt: String(o.created_at)
            });
          } else {
            prev.count += 1;
            prev.totalSpentUsdCents += Number(o.grand_total_usd_cents || 0);
          }
        }
        const defaultGovByUserId = /* @__PURE__ */ new Map();
        for (const a of addressRows) {
          if (a.governorate) defaultGovByUserId.set(String(a.user_id), String(a.governorate));
        }
        const subByEmail = /* @__PURE__ */ new Map();
        const unsubscribedEmails = /* @__PURE__ */ new Set();
        for (const s of subscriberRows) {
          const emailNorm = String(s.email).trim().toLowerCase();
          subByEmail.set(emailNorm, {
            locale: s.locale === "ar" ? "ar" : "en",
            status: String(s.status),
            unsubscribeToken: String(s.unsubscribe_token)
          });
          if (s.status === "unsubscribed") {
            unsubscribedEmails.add(emailNorm);
          }
        }
        const customerByEmail = /* @__PURE__ */ new Map();
        for (const u of customerRows) {
          const emailNorm = String(u.email).trim().toLowerCase();
          const stats = orderStatsByUserId.get(String(u.id));
          const gov = stats?.latestGovernorate || defaultGovByUserId.get(String(u.id));
          customerByEmail.set(emailNorm, {
            email: emailNorm,
            name: String(u.name || emailNorm),
            locale: u.preferred_locale === "ar" ? "ar" : "en",
            governorate: gov,
            orderCount: stats?.count || 0,
            totalSpentUsdCents: stats?.totalSpentUsdCents || 0,
            lastOrderAt: stats?.lastOrderAt
          });
        }
        const contactsMap = /* @__PURE__ */ new Map();
        if (rules.audienceScope === "registered_customers" || rules.audienceScope === "all_contacts") {
          for (const [emailNorm, cust] of customerByEmail.entries()) {
            if (unsubscribedEmails.has(emailNorm)) continue;
            const sub = subByEmail.get(emailNorm);
            contactsMap.set(emailNorm, {
              email: emailNorm,
              name: cust.name,
              locale: cust.locale,
              governorate: cust.governorate,
              orderCount: cust.orderCount,
              totalSpentUsdCents: cust.totalSpentUsdCents,
              source: "customer",
              unsubscribeToken: sub?.unsubscribeToken,
              _lastOrderAt: cust.lastOrderAt
            });
          }
        }
        if (rules.audienceScope === "newsletter_subscribers" || rules.audienceScope === "all_contacts") {
          for (const [emailNorm, sub] of subByEmail.entries()) {
            if (sub.status === "unsubscribed") continue;
            if (contactsMap.has(emailNorm)) continue;
            const cust = customerByEmail.get(emailNorm);
            contactsMap.set(emailNorm, {
              email: emailNorm,
              name: cust?.name || emailNorm.split("@")[0],
              locale: cust?.locale || sub.locale,
              governorate: cust?.governorate,
              orderCount: cust?.orderCount || 0,
              totalSpentUsdCents: cust?.totalSpentUsdCents || 0,
              source: "subscriber",
              unsubscribeToken: sub.unsubscribeToken,
              _lastOrderAt: cust?.lastOrderAt
            });
          }
        }
        const nowMs = Date.now();
        const govFilter = rules.governorate && rules.governorate !== "all" ? rules.governorate.trim().toLowerCase() : "";
        const minOrders = typeof rules.minOrderCount === "number" && Number.isFinite(rules.minOrderCount) ? rules.minOrderCount : void 0;
        const maxOrders = typeof rules.maxOrderCount === "number" && Number.isFinite(rules.maxOrderCount) ? rules.maxOrderCount : void 0;
        const minSpent = typeof rules.minTotalSpentUsdCents === "number" && Number.isFinite(rules.minTotalSpentUsdCents) ? rules.minTotalSpentUsdCents : void 0;
        const minDaysInactive = typeof rules.daysSinceLastOrder === "number" && Number.isFinite(rules.daysSinceLastOrder) && rules.daysSinceLastOrder > 0 ? rules.daysSinceLastOrder : void 0;
        const results = [];
        for (const c of contactsMap.values()) {
          if (govFilter && (c.governorate || "").toLowerCase() !== govFilter) continue;
          if (minOrders !== void 0 && c.orderCount < minOrders) continue;
          if (maxOrders !== void 0 && c.orderCount > maxOrders) continue;
          if (minSpent !== void 0 && c.totalSpentUsdCents < minSpent) continue;
          if (rules.locale && rules.locale !== "all" && c.locale !== rules.locale) continue;
          if (minDaysInactive !== void 0) {
            if (!c._lastOrderAt) continue;
            const iso = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(c._lastOrderAt) ? c._lastOrderAt.replace(" ", "T") + "Z" : c._lastOrderAt;
            const orderMs = new Date(iso).getTime();
            if (Number.isNaN(orderMs)) continue;
            const days = (nowMs - orderMs) / 864e5;
            if (days < minDaysInactive) continue;
          }
          const { _lastOrderAt: _drop, ...clean } = c;
          results.push(clean);
        }
        return results;
      }
      async adminListSegments() {
        const rows = await this.db.query("SELECT * FROM customer_segments ORDER BY updated_at DESC");
        return rows.map((r) => this.mapSegmentRow(r));
      }
      async adminPreviewSegment(rules) {
        const contacts = await this.evaluateSegmentContacts(rules);
        return { count: contacts.length, contacts: contacts.slice(0, 50) };
      }
      async adminCreateSegment(actorUserId, input, ipAddress) {
        const contacts = await this.evaluateSegmentContacts(input.rules);
        const id = `seg-${crypto5.randomUUID()}`;
        const now = toSqlTimestamp();
        await this.db.execute(
          `INSERT INTO customer_segments (id, name_json, description, rules_json, cached_member_count, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
          [id, JSON.stringify(input.name), (input.description || "").trim().slice(0, 400), JSON.stringify(input.rules), contacts.length, now]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.create_segment",
          entityType: "customer_segment",
          entityId: id,
          after: { name: input.name.en, memberCount: contacts.length, rules: input.rules },
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM customer_segments WHERE id = ?", [id]);
        return this.mapSegmentRow(row);
      }
      async adminDeleteSegment(id, actorUserId, ipAddress) {
        await this.db.execute("DELETE FROM customer_segments WHERE id = ?", [id]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_segment",
          entityType: "customer_segment",
          entityId: id,
          ipAddress
        });
      }
      async adminListEmailCampaigns() {
        const rows = await this.db.query("SELECT * FROM email_campaigns ORDER BY created_at DESC");
        return rows.map((r) => this.mapEmailCampaignRow(r));
      }
      async adminCreateEmailCampaign(actorUserId, input, ipAddress) {
        const id = `ecmp-${crypto5.randomUUID()}`;
        const now = toSqlTimestamp();
        const scheduledSql = input.scheduledAt ? toSqlTimestamp(new Date(input.scheduledAt)) : null;
        const status = scheduledSql ? "scheduled" : "draft";
        await this.db.execute(
          `INSERT INTO email_campaigns (id, name, subject_json, preview_text_json, segment_id, blocks_json, status, scheduled_at, sent_count, failed_count, unsubscribed_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?)`,
          [
            id,
            input.name.trim().slice(0, 160),
            JSON.stringify(input.subject),
            JSON.stringify(input.previewText || { en: "", ar: "" }),
            input.segmentId || null,
            JSON.stringify(input.blocks),
            status,
            scheduledSql,
            now
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.create_email_campaign",
          entityType: "email_campaign",
          entityId: id,
          after: { name: input.name, status, blockCount: input.blocks.length },
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM email_campaigns WHERE id = ?", [id]);
        return this.mapEmailCampaignRow(row);
      }
      async adminDeleteEmailCampaign(id, actorUserId, ipAddress) {
        await this.db.execute("DELETE FROM email_campaigns WHERE id = ?", [id]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_email_campaign",
          entityType: "email_campaign",
          entityId: id,
          ipAddress
        });
      }
      async enqueueEmailCampaignRecipients(campaignId) {
        const row = await this.db.queryOne("SELECT * FROM email_campaigns WHERE id = ?", [campaignId]);
        if (!row) throw new Error("Email campaign not found.");
        const campaign = this.mapEmailCampaignRow(row);
        let rules = { audienceScope: "all_contacts" };
        if (campaign.segmentId) {
          const segRow = await this.db.queryOne("SELECT * FROM customer_segments WHERE id = ?", [
            campaign.segmentId
          ]);
          if (segRow) {
            rules = parseJson(segRow.rules_json, rules);
          }
        }
        const contacts = await this.evaluateSegmentContacts(rules);
        if (campaign.segmentId) {
          await this.db.execute("UPDATE customer_segments SET cached_member_count = ?, updated_at = ? WHERE id = ?", [
            contacts.length,
            toSqlTimestamp(),
            campaign.segmentId
          ]);
        }
        const now = toSqlTimestamp();
        if (contacts.length === 0) {
          await this.db.execute("UPDATE email_campaigns SET status = 'sent', sent_at = COALESCE(sent_at, ?) WHERE id = ?", [
            now,
            campaign.id
          ]);
          return 0;
        }
        await this.db.execute("UPDATE email_campaigns SET status = 'queued', sent_at = COALESCE(sent_at, ?) WHERE id = ?", [
          now,
          campaign.id
        ]);
        for (const c of contacts) {
          const locale = c.locale === "ar" ? "ar" : "en";
          const subject = (locale === "ar" ? campaign.subject.ar : campaign.subject.en) || campaign.subject.en || campaign.name;
          const previewText = (locale === "ar" ? campaign.previewText.ar : campaign.previewText.en) || campaign.previewText.en || "";
          const payload = {
            campaignId: campaign.id,
            to: c.email,
            locale,
            subject,
            previewText,
            blocks: campaign.blocks,
            unsubscribeToken: c.unsubscribeToken || null
          };
          await enqueueJob(this.db, "send_marketing_email", payload);
        }
        return contacts.length;
      }
      async adminSendOrScheduleEmailCampaign(id, actorUserId, opts, ipAddress) {
        const existing = await this.db.queryOne("SELECT * FROM email_campaigns WHERE id = ?", [id]);
        if (!existing) throw new Error("Email campaign not found.");
        let queuedCount = 0;
        if (opts.sendNow) {
          queuedCount = await this.enqueueEmailCampaignRecipients(id);
        } else if (opts.scheduledAt) {
          await this.db.execute("UPDATE email_campaigns SET status = 'scheduled', scheduled_at = ? WHERE id = ?", [
            toSqlTimestamp(new Date(opts.scheduledAt)),
            id
          ]);
        }
        await writeAuditLog(this.db, {
          actorUserId,
          action: opts.sendNow ? "admin.send_email_campaign" : "admin.schedule_email_campaign",
          entityType: "email_campaign",
          entityId: id,
          after: { queuedCount, scheduledAt: opts.scheduledAt || null },
          ipAddress
        });
        const updated = await this.db.queryOne("SELECT * FROM email_campaigns WHERE id = ?", [id]);
        return { campaign: this.mapEmailCampaignRow(updated), queuedCount };
      }
      async adminListAutomationFlows() {
        const rows = await this.db.query("SELECT * FROM automation_flows ORDER BY created_at DESC");
        return rows.map((r) => this.mapAutomationFlowRow(r));
      }
      async adminCreateAutomationFlow(actorUserId, input, ipAddress) {
        const id = `flow-${crypto5.randomUUID()}`;
        const now = toSqlTimestamp();
        await this.db.execute(
          `INSERT INTO automation_flows (id, name_json, trigger_type, delay_hours, subject_json, blocks_json, attach_coupon_code, active, total_triggered, total_sent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)`,
          [
            id,
            JSON.stringify(input.name),
            input.triggerType,
            Math.max(0, Math.round(input.delayHours)),
            JSON.stringify(input.subject),
            JSON.stringify(input.blocks),
            input.attachCouponCode ? input.attachCouponCode.trim().toUpperCase() : null,
            input.active === false ? 0 : 1,
            now
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.create_automation_flow",
          entityType: "automation_flow",
          entityId: id,
          after: { triggerType: input.triggerType, delayHours: input.delayHours, active: input.active !== false },
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM automation_flows WHERE id = ?", [id]);
        return this.mapAutomationFlowRow(row);
      }
      async adminUpdateAutomationFlow(id, actorUserId, patch, ipAddress) {
        const existingRow = await this.db.queryOne("SELECT * FROM automation_flows WHERE id = ?", [id]);
        if (!existingRow) throw new Error("Automation flow not found.");
        const existing = this.mapAutomationFlowRow(existingRow);
        await this.db.execute(
          `UPDATE automation_flows SET name_json = ?, delay_hours = ?, subject_json = ?, blocks_json = ?, attach_coupon_code = ?, active = ? WHERE id = ?`,
          [
            JSON.stringify(patch.name ?? existing.name),
            patch.delayHours !== void 0 ? Math.max(0, Math.round(patch.delayHours)) : existing.delayHours,
            JSON.stringify(patch.subject ?? existing.subject),
            JSON.stringify(patch.blocks ?? existing.blocks),
            patch.attachCouponCode !== void 0 ? patch.attachCouponCode ? patch.attachCouponCode.trim().toUpperCase() : null : existing.attachCouponCode ?? null,
            patch.active !== void 0 ? patch.active ? 1 : 0 : existing.active ? 1 : 0,
            id
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.update_automation_flow",
          entityType: "automation_flow",
          entityId: id,
          after: patch,
          ipAddress
        });
        const row = await this.db.queryOne("SELECT * FROM automation_flows WHERE id = ?", [id]);
        return this.mapAutomationFlowRow(row);
      }
      async adminDeleteAutomationFlow(id, actorUserId, ipAddress) {
        await this.db.execute("DELETE FROM automation_executions WHERE flow_id = ?", [id]);
        await this.db.execute("DELETE FROM automation_flows WHERE id = ?", [id]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_automation_flow",
          entityType: "automation_flow",
          entityId: id,
          ipAddress
        });
      }
      // --- Step 6: Seller Promotion Rules & Marketing Attribution Analytics ---
      async getSellerPromoRules() {
        const kCol = this.db.driver === "mysql" ? "`key`" : "key";
        const row = await this.db.queryOne(
          `SELECT value_json, updated_at FROM settings WHERE ${kCol} = 'seller_promo_rules'`
        );
        const parsed = row ? parseJson(row.value_json, {}) : {};
        return {
          sellerOffersEnabled: parsed.sellerOffersEnabled !== void 0 ? Boolean(parsed.sellerOffersEnabled) : true,
          requireAdminApproval: parsed.requireAdminApproval !== void 0 ? Boolean(parsed.requireAdminApproval) : true,
          maxDiscountPercent: Math.max(5, Math.min(90, Math.round(Number(parsed.maxDiscountPercent ?? 60)))),
          maxFixedDiscountUsdCents: Math.max(500, Math.round(Number(parsed.maxFixedDiscountUsdCents ?? 15e3))),
          maxActiveOffersPerSeller: Math.max(1, Math.min(50, Math.round(Number(parsed.maxActiveOffersPerSeller ?? 5)))),
          allowFlashOffersBySellers: parsed.allowFlashOffersBySellers !== void 0 ? Boolean(parsed.allowFlashOffersBySellers) : true,
          updatedAt: String(row?.updated_at || toSqlTimestamp())
        };
      }
      async adminUpdateSellerPromoRules(actorUserId, patch, ipAddress) {
        const current = await this.getSellerPromoRules();
        const next = {
          sellerOffersEnabled: patch.sellerOffersEnabled ?? current.sellerOffersEnabled,
          requireAdminApproval: patch.requireAdminApproval ?? current.requireAdminApproval,
          maxDiscountPercent: Math.max(5, Math.min(90, Math.round(Number(patch.maxDiscountPercent ?? current.maxDiscountPercent)))),
          maxFixedDiscountUsdCents: Math.max(
            500,
            Math.round(Number(patch.maxFixedDiscountUsdCents ?? current.maxFixedDiscountUsdCents))
          ),
          maxActiveOffersPerSeller: Math.max(
            1,
            Math.min(50, Math.round(Number(patch.maxActiveOffersPerSeller ?? current.maxActiveOffersPerSeller)))
          ),
          allowFlashOffersBySellers: patch.allowFlashOffersBySellers ?? current.allowFlashOffersBySellers,
          updatedAt: toSqlTimestamp()
        };
        const kCol = this.db.driver === "mysql" ? "`key`" : "key";
        const jsonVal = JSON.stringify(next);
        await this.db.execute(
          this.db.driver === "mysql" ? `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES ('seller_promo_rules', ?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), updated_at = VALUES(updated_at)` : `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES ('seller_promo_rules', ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`,
          [jsonVal, next.updatedAt]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.update_seller_promo_rules",
          entityType: "settings",
          entityId: "seller_promo_rules",
          before: current,
          after: next,
          ipAddress
        });
        return next;
      }
      async getMarketingAnalytics() {
        const [
          orderRows,
          orderItemRows,
          couponRows,
          offersList,
          flashSalesList,
          campaignsList,
          bannersList,
          popupsList,
          featuredList,
          emailCampaignsList,
          flowsList
        ] = await Promise.all([
          this.db.query("SELECT id, coupon_code, discount_total_usd_cents, grand_total_usd_cents FROM orders"),
          this.db.query(
            `SELECT so.order_id, oi.product_id, so.seller_id, oi.line_total_usd_cents
         FROM order_items oi
         INNER JOIN sub_orders so ON so.id = oi.sub_order_id`
          ),
          this.db.query("SELECT * FROM coupons ORDER BY used_count DESC, code ASC"),
          this.adminListOffers(),
          this.adminListFlashSales(),
          this.adminListCampaigns(),
          this.adminListBanners(),
          this.adminListPopups(),
          this.adminListFeaturedPlacements(),
          this.adminListEmailCampaigns(),
          this.adminListAutomationFlows()
        ]);
        const coupons2 = couponRows.map((c) => this.mapCouponRow(c));
        const orderItemsByOrderId = /* @__PURE__ */ new Map();
        for (const oi of orderItemRows) {
          const list = orderItemsByOrderId.get(oi.order_id) || [];
          list.push({
            productId: String(oi.product_id),
            sellerId: String(oi.seller_id),
            lineTotalUsdCents: Number(oi.line_total_usd_cents || 0)
          });
          orderItemsByOrderId.set(oi.order_id, list);
        }
        const activeOfferTargets = /* @__PURE__ */ new Set();
        const offerTargetById = /* @__PURE__ */ new Map();
        for (const off of offersList) {
          offerTargetById.set(off.id, { targetType: off.targetType, targetId: off.targetId, sellerId: off.sellerId });
          if (off.approvalStatus === "approved" && off.active) {
            if (off.targetId) activeOfferTargets.add(`${off.targetType}:${off.targetId}`);
            else if (off.targetType === "all") activeOfferTargets.add("all");
          }
        }
        const flashProductIds = /* @__PURE__ */ new Set();
        const flashProductsBySaleId = /* @__PURE__ */ new Map();
        for (const fs4 of flashSalesList) {
          const s = /* @__PURE__ */ new Set();
          for (const item of fs4.items) {
            flashProductIds.add(item.productId);
            s.add(item.productId);
          }
          flashProductsBySaleId.set(fs4.id, s);
        }
        let totalOrderGmvUsdCents = 0;
        let promoAttributedGmvUsdCents = 0;
        let totalDiscountsGrantedUsdCents = 0;
        let couponOrdersCount = 0;
        const ordersByCoupon = /* @__PURE__ */ new Map();
        for (const o of orderRows) {
          const grand = Number(o.grand_total_usd_cents || 0);
          const disc = Number(o.discount_total_usd_cents || 0);
          const code = o.coupon_code ? String(o.coupon_code).trim().toUpperCase() : "";
          totalOrderGmvUsdCents += grand;
          totalDiscountsGrantedUsdCents += disc;
          if (code) {
            couponOrdersCount += 1;
            const prev = ordersByCoupon.get(code) || { ordersCount: 0, revenueUsdCents: 0, discountUsdCents: 0 };
            prev.ordersCount += 1;
            prev.revenueUsdCents += grand;
            prev.discountUsdCents += disc;
            ordersByCoupon.set(code, prev);
          }
          const items = orderItemsByOrderId.get(o.id) || [];
          const hasFlashItem = items.some((it) => flashProductIds.has(it.productId));
          const hasOfferItem = activeOfferTargets.has("all") || items.some(
            (it) => activeOfferTargets.has(`product:${it.productId}`) || activeOfferTargets.has(`seller:${it.sellerId}`)
          );
          if (code || disc > 0 || hasFlashItem || hasOfferItem) {
            promoAttributedGmvUsdCents += grand;
          }
        }
        const couponAttribution = coupons2.map((c) => {
          const stats = ordersByCoupon.get(c.code.toUpperCase()) || {
            ordersCount: 0,
            revenueUsdCents: 0,
            discountUsdCents: 0
          };
          return {
            code: c.code,
            discountType: c.discountType,
            discountValue: c.discountValue,
            usedCount: c.usedCount,
            maxUses: c.maxUses ?? null,
            ordersCount: stats.ordersCount,
            revenueUsdCents: stats.revenueUsdCents,
            discountUsdCents: stats.discountUsdCents
          };
        });
        const campaignAttribution = campaignsList.map((cmp) => {
          const couponSet = new Set(cmp.featuredCouponCodes.map((c) => c.toUpperCase()));
          const flashSet = cmp.featuredFlashSaleId ? flashProductsBySaleId.get(cmp.featuredFlashSaleId) || /* @__PURE__ */ new Set() : /* @__PURE__ */ new Set();
          const offerTargets = cmp.featuredOfferIds.map((oid) => offerTargetById.get(oid)).filter(Boolean);
          let ordersCount = 0;
          let revenueUsdCents = 0;
          let discountUsdCents = 0;
          for (const o of orderRows) {
            const code = o.coupon_code ? String(o.coupon_code).trim().toUpperCase() : "";
            const items = orderItemsByOrderId.get(o.id) || [];
            const matchedCoupon = Boolean(code && couponSet.has(code));
            const matchedFlash = items.some((it) => flashSet.has(it.productId));
            const matchedOffer = offerTargets.some(
              (ot) => ot.targetType === "all" || items.some(
                (it) => ot.targetType === "product" && it.productId === ot.targetId || ot.targetType === "seller" && it.sellerId === ot.targetId
              )
            );
            if (matchedCoupon || matchedFlash || matchedOffer) {
              ordersCount += 1;
              revenueUsdCents += Number(o.grand_total_usd_cents || 0);
              discountUsdCents += Number(o.discount_total_usd_cents || 0);
            }
          }
          return {
            id: cmp.id,
            slug: cmp.slug,
            title: cmp.title,
            status: cmp.status,
            ordersCount,
            revenueUsdCents,
            discountUsdCents
          };
        });
        const flashSalePerformance = flashSalesList.map((fs4) => ({
          id: fs4.id,
          slug: fs4.slug,
          title: fs4.title,
          status: fs4.status,
          itemsCount: fs4.items.length,
          soldCount: fs4.items.reduce((s, it) => s + it.claimedCount, 0),
          stockCapTotal: fs4.items.reduce((s, it) => s + it.stockCap, 0),
          estimatedRevenueUsdCents: fs4.items.reduce((s, it) => s + it.salePriceUsdCents * it.claimedCount, 0)
        }));
        const bannerImpressions = bannersList.reduce((s, b) => s + b.impressions, 0);
        const bannerClicks = bannersList.reduce((s, b) => s + b.clicks, 0);
        const bannerBotFiltered = bannersList.reduce((s, b) => s + (b.botFilteredCount ?? 0), 0);
        const bannerCtrBps = bannerImpressions > 0 ? Math.round(bannerClicks * 1e4 / bannerImpressions) : 0;
        const popupImpressions = popupsList.reduce((s, p) => s + p.impressions, 0);
        const popupConversions = popupsList.reduce((s, p) => s + p.conversions, 0);
        const popupDismissals = popupsList.reduce((s, p) => s + p.dismissals, 0);
        const popupConversionBps = popupImpressions > 0 ? Math.round(popupConversions * 1e4 / popupImpressions) : 0;
        const emailDeliveredCount = emailCampaignsList.reduce((s, c) => s + c.sentCount, 0) + flowsList.reduce((s, f) => s + f.totalSent, 0);
        const emailFailedCount = emailCampaignsList.reduce((s, c) => s + c.failedCount, 0);
        const emailUnsubscribedSkipped = emailCampaignsList.reduce((s, c) => s + c.unsubscribedCount, 0);
        return {
          kpis: {
            totalOrderGmvUsdCents,
            promoAttributedGmvUsdCents,
            totalDiscountsGrantedUsdCents,
            couponOrdersCount,
            bannerImpressions,
            bannerClicks,
            bannerBotFiltered,
            bannerCtrBps,
            popupImpressions,
            popupConversions,
            popupDismissals,
            popupConversionBps,
            emailDeliveredCount,
            emailFailedCount,
            emailUnsubscribedSkipped
          },
          couponAttribution,
          campaignAttribution,
          flashSalePerformance,
          placementsTelemetry: {
            banners: bannersList.map((b) => ({
              id: b.id,
              title: b.title,
              placement: b.placement,
              impressions: b.impressions,
              clicks: b.clicks,
              botFilteredCount: b.botFilteredCount ?? 0,
              ctrBps: b.impressions > 0 ? Math.round(b.clicks * 1e4 / b.impressions) : 0
            })),
            popups: popupsList.map((p) => ({
              id: p.id,
              title: p.title,
              popupType: p.popupType,
              impressions: p.impressions,
              conversions: p.conversions,
              dismissals: p.dismissals,
              conversionBps: p.impressions > 0 ? Math.round(p.conversions * 1e4 / p.impressions) : 0
            })),
            featuredSlots: featuredList.map((f) => ({
              id: f.id,
              slotKey: f.slotKey,
              targetType: f.targetType,
              impressions: f.impressions,
              clicks: f.clicks,
              ctrBps: f.impressions > 0 ? Math.round(f.clicks * 1e4 / f.impressions) : 0
            }))
          },
          emailPerformance: {
            campaigns: emailCampaignsList.map((c) => ({
              id: c.id,
              name: c.name,
              status: c.status,
              sentCount: c.sentCount,
              failedCount: c.failedCount,
              unsubscribedCount: c.unsubscribedCount
            })),
            automations: flowsList.map((f) => ({
              id: f.id,
              name: f.name,
              triggerType: f.triggerType,
              active: f.active,
              totalTriggered: f.totalTriggered,
              totalSent: f.totalSent
            }))
          }
        };
      }
      // =========================================================================
      // PHASE C: Customer Auth, Addresses, Notifications, Cases, Support,
      //          Seller Catalog/Staff/Logistics, & Admin Moderation/Operations
      // =========================================================================
      async getBrands() {
        const rows = await this.db.query(
          "SELECT id, slug, name_json, active FROM brands WHERE active = 1 ORDER BY slug ASC"
        );
        return rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          name: parseJson(r.name_json, { en: r.slug, ar: r.slug }),
          active: Boolean(r.active)
        }));
      }
      async getAttributes() {
        const rows = await this.db.query(
          "SELECT id, code, name_json, values_json FROM attributes ORDER BY code ASC"
        );
        return rows.map((r) => ({
          id: r.id,
          code: r.code,
          name: parseJson(r.name_json, { en: r.code, ar: r.code }),
          values: parseJson(r.values_json, [])
        }));
      }
      async getNotificationPreferences(userId, txOrDb = this.db) {
        const row = await txOrDb.queryOne("SELECT * FROM notification_preferences WHERE user_id = ?", [userId]);
        return {
          emailSummaryEnabled: row ? Boolean(row.email_summary_enabled) : true,
          summaryFrequency: row?.summary_frequency || "daily",
          orderUpdates: row ? Boolean(row.order_updates) : true,
          priceDrops: row ? Boolean(row.price_drops) : true,
          promotionalOffers: row ? Boolean(row.promotional_offers) : true,
          lastSummarySentAt: row?.last_summary_sent_at ? String(row.last_summary_sent_at) : null
        };
      }
      async updateNotificationPreferences(userId, patch) {
        const current = await this.getNotificationPreferences(userId);
        const next = {
          emailSummaryEnabled: patch.emailSummaryEnabled ?? current.emailSummaryEnabled,
          summaryFrequency: patch.summaryFrequency ?? current.summaryFrequency,
          orderUpdates: patch.orderUpdates ?? current.orderUpdates,
          priceDrops: patch.priceDrops ?? current.priceDrops,
          promotionalOffers: patch.promotionalOffers ?? current.promotionalOffers,
          lastSummarySentAt: current.lastSummarySentAt ?? null
        };
        const now = toSqlTimestamp();
        const existing = await this.db.queryOne(
          "SELECT user_id FROM notification_preferences WHERE user_id = ?",
          [userId]
        );
        if (existing) {
          await this.db.execute(
            `UPDATE notification_preferences
         SET email_summary_enabled = ?, summary_frequency = ?, order_updates = ?, price_drops = ?, promotional_offers = ?, updated_at = ?
         WHERE user_id = ?`,
            [
              next.emailSummaryEnabled ? 1 : 0,
              next.summaryFrequency,
              next.orderUpdates ? 1 : 0,
              next.priceDrops ? 1 : 0,
              next.promotionalOffers ? 1 : 0,
              now,
              userId
            ]
          );
        } else {
          await this.db.execute(
            `INSERT INTO notification_preferences (user_id, email_summary_enabled, summary_frequency, order_updates, price_drops, promotional_offers, last_summary_sent_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NULL, ?)`,
            [
              userId,
              next.emailSummaryEnabled ? 1 : 0,
              next.summaryFrequency,
              next.orderUpdates ? 1 : 0,
              next.priceDrops ? 1 : 0,
              next.promotionalOffers ? 1 : 0,
              now
            ]
          );
        }
        return this.getNotificationPreferences(userId);
      }
      async createNotification(txOrDb, userId, title, body, opts) {
        const category = opts?.category || "system";
        const prefs = await this.getNotificationPreferences(userId, txOrDb);
        if (opts?.respectPreference !== false) {
          if (category === "order" && !prefs.orderUpdates) return null;
          if (category === "price_drop" && !prefs.priceDrops) return null;
          if (category === "promo" && !prefs.promotionalOffers) return null;
        }
        const id = `ntf-${crypto5.randomUUID()}`;
        const now = toSqlTimestamp();
        await txOrDb.execute(
          "INSERT INTO notifications (id, user_id, category, title_json, body_json, action_url, metadata_json, emailed_at, read_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?)",
          [
            id,
            userId,
            category,
            JSON.stringify(title),
            JSON.stringify(body),
            opts?.actionUrl || null,
            opts?.metadata ? JSON.stringify(opts.metadata) : null,
            now
          ]
        );
        if (prefs.emailSummaryEnabled && prefs.summaryFrequency === "instant") {
          await txOrDb.execute(
            "INSERT INTO jobs (id, job_type, payload_json, status, attempts, run_at, created_at) VALUES (?, ?, ?, ?, 0, ?, ?)",
            [
              `job-${crypto5.randomUUID()}`,
              "send_notification_summary",
              JSON.stringify({ userId, notificationId: id }),
              "queued",
              now,
              now
            ]
          );
        }
        return id;
      }
      async notifyWishlistPriceDrop(txOrDb, input) {
        if (input.newPriceUsdCents >= input.oldPriceUsdCents || input.newPriceUsdCents <= 0) return 0;
        const prod = await txOrDb.queryOne(
          "SELECT id, slug, title_json FROM products WHERE id = ? AND deleted_at IS NULL",
          [input.productId]
        );
        if (!prod) return 0;
        const prodTitle = parseJson(prod.title_json, { en: "Product", ar: "\u0645\u0646\u062A\u062C" });
        const oldUsd = (input.oldPriceUsdCents / 100).toFixed(2);
        const newUsd = (input.newPriceUsdCents / 100).toFixed(2);
        const pctOff = Math.max(1, Math.round((input.oldPriceUsdCents - input.newPriceUsdCents) / input.oldPriceUsdCents * 100));
        const wishers = await txOrDb.query(
          `SELECT DISTINCT w.user_id
       FROM wishlists w
       INNER JOIN users u ON u.id = w.user_id
       WHERE w.product_id = ? AND u.deleted_at IS NULL AND u.is_blocked = 0`,
          [input.productId]
        );
        let sent = 0;
        for (const w of wishers) {
          const createdId = await this.createNotification(
            txOrDb,
            w.user_id,
            {
              en: `Price drop: ${prodTitle.en} (-${pctOff}%)`,
              ar: `\u0627\u0646\u062E\u0641\u0627\u0636 \u0627\u0644\u0633\u0639\u0631: ${prodTitle.ar} (-${pctOff}%)`
            },
            {
              en: `${prodTitle.en} dropped from $${oldUsd} to $${newUsd}${input.offerTitle?.en ? ` (${input.offerTitle.en})` : ""}.`,
              ar: `\u0627\u0646\u062E\u0641\u0636 \u0633\u0639\u0631 ${prodTitle.ar} \u0645\u0646 $${oldUsd} \u0625\u0644\u0649 $${newUsd}${input.offerTitle?.ar ? ` (${input.offerTitle.ar})` : ""}.`
            },
            {
              category: "price_drop",
              actionUrl: `/product/${prod.slug}`,
              metadata: {
                productId: prod.id,
                oldPriceUsdCents: input.oldPriceUsdCents,
                newPriceUsdCents: input.newPriceUsdCents,
                percentOff: pctOff
              }
            }
          );
          if (createdId) sent++;
        }
        return sent;
      }
      async notifyPromotionalOfferFanout(txOrDb, input) {
        const users2 = await txOrDb.query(
          `SELECT id FROM users
       WHERE deleted_at IS NULL AND is_blocked = 0 AND role_key IN ('customer', 'seller_owner')
       LIMIT 300`
        );
        let sent = 0;
        for (const u of users2) {
          const createdId = await this.createNotification(txOrDb, u.id, input.title, input.body, {
            category: "promo",
            actionUrl: input.actionUrl,
            metadata: { entityType: input.entityType, entityId: input.entityId }
          });
          if (createdId) sent++;
        }
        return sent;
      }
      async dispatchOfferActivatedNotifications(txOrDb, offer) {
        if (!["percent", "fixed_usd_cents", "flash_percent"].includes(offer.offerType)) {
          if (offer.targetType === "all" || offer.targetType === "category") {
            await this.notifyPromotionalOfferFanout(txOrDb, {
              entityType: "offer",
              entityId: offer.id,
              title: { en: `New offer: ${offer.title.en}`, ar: `\u0639\u0631\u0636 \u062C\u062F\u064A\u062F: ${offer.title.ar}` },
              body: {
                en: "New savings are now live on NileLink Marketplace.",
                ar: "\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0639\u0631\u0636 \u062A\u0648\u0641\u064A\u0631 \u062C\u062F\u064A\u062F \u0627\u0644\u0622\u0646 \u0639\u0644\u0649 \u0633\u0648\u0642 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643."
              },
              actionUrl: offer.targetType === "category" && offer.targetId ? `/catalog?category=${encodeURIComponent(offer.targetId)}` : "/catalog?deals=true"
            });
          }
          return;
        }
        const calcNewPrice = (baseCents) => {
          if (offer.offerType === "fixed_usd_cents") {
            return Math.max(1, baseCents - offer.discountValue);
          }
          return Math.max(1, Math.round(baseCents * (100 - offer.discountValue) / 100));
        };
        if (offer.targetType === "product" && offer.targetId) {
          const prod = await txOrDb.queryOne(
            "SELECT id, base_price_usd_cents FROM products WHERE id = ? AND deleted_at IS NULL AND published = 1",
            [offer.targetId]
          );
          if (prod) {
            await this.notifyWishlistPriceDrop(txOrDb, {
              productId: prod.id,
              oldPriceUsdCents: Number(prod.base_price_usd_cents),
              newPriceUsdCents: calcNewPrice(Number(prod.base_price_usd_cents)),
              offerTitle: offer.title
            });
          }
        } else if (offer.targetType === "seller" && offer.targetId) {
          const wishedProds = await txOrDb.query(
            `SELECT DISTINCT p.id, p.base_price_usd_cents
         FROM products p
         INNER JOIN wishlists w ON w.product_id = p.id
         WHERE p.seller_id = ? AND p.deleted_at IS NULL AND p.published = 1
         LIMIT 100`,
            [offer.targetId]
          );
          for (const wp of wishedProds) {
            await this.notifyWishlistPriceDrop(txOrDb, {
              productId: wp.id,
              oldPriceUsdCents: Number(wp.base_price_usd_cents),
              newPriceUsdCents: calcNewPrice(Number(wp.base_price_usd_cents)),
              offerTitle: offer.title
            });
          }
        } else {
          const labelOff = offer.offerType === "fixed_usd_cents" ? `$${(offer.discountValue / 100).toFixed(2)} OFF` : `${offer.discountValue}% OFF`;
          await this.notifyPromotionalOfferFanout(txOrDb, {
            entityType: "offer",
            entityId: offer.id,
            title: { en: `${offer.title.en} \xB7 ${labelOff}`, ar: `${offer.title.ar} \xB7 \u062E\u0635\u0645 ${labelOff}` },
            body: {
              en: `Limited-time promotional offer is now active across eligible NileLink items.`,
              ar: `\u0639\u0631\u0636 \u062A\u0631\u0648\u064A\u062C\u064A \u0644\u0641\u062A\u0631\u0629 \u0645\u062D\u062F\u0648\u062F\u0629 \u0645\u062A\u0627\u062D \u0627\u0644\u0622\u0646 \u0639\u0644\u0649 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0624\u0647\u0644\u0629 \u0641\u064A \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643.`
            },
            actionUrl: offer.targetType === "category" && offer.targetId ? `/catalog?category=${encodeURIComponent(offer.targetId)}` : "/catalog?deals=true"
          });
        }
      }
      async dispatchFlashSaleNotifications(txOrDb, flashSale) {
        for (const item of flashSale.items) {
          if (item.basePriceUsdCents && item.salePriceUsdCents < item.basePriceUsdCents) {
            await this.notifyWishlistPriceDrop(txOrDb, {
              productId: item.productId,
              oldPriceUsdCents: item.basePriceUsdCents,
              newPriceUsdCents: item.salePriceUsdCents,
              offerTitle: flashSale.title
            });
          }
        }
        await this.notifyPromotionalOfferFanout(txOrDb, {
          entityType: "flash_sale",
          entityId: flashSale.id,
          title: { en: `Flash Sale Live: ${flashSale.title.en}`, ar: `\u0639\u0631\u0636 \u062E\u0627\u0637\u0641 \u0645\u0628\u0627\u0634\u0631: ${flashSale.title.ar}` },
          body: {
            en: `${flashSale.items.length} curated item(s) discounted with limited stock caps.`,
            ar: `${flashSale.items.length} \u0645\u0646\u062A\u062C\u0627\u062A \u0645\u062E\u062A\u0627\u0631\u0629 \u0628\u062E\u0635\u0648\u0645\u0627\u062A \u062D\u0635\u0631\u064A\u0629 \u0648\u0643\u0645\u064A\u0627\u062A \u0645\u062D\u062F\u0648\u062F\u0629.`
          },
          actionUrl: "/catalog?deals=true"
        });
      }
      async getUserNotifications(userId) {
        const rows = await this.db.query("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 80", [userId]);
        return rows.map((r) => ({
          id: r.id,
          userId: r.user_id,
          category: r.category || "system",
          title: parseJson(r.title_json, { en: "", ar: "" }),
          body: parseJson(r.body_json, { en: "", ar: "" }),
          actionUrl: r.action_url ? String(r.action_url) : null,
          metadata: r.metadata_json ? parseJson(r.metadata_json, null) : null,
          emailedAt: r.emailed_at ? String(r.emailed_at) : null,
          readAt: r.read_at ? String(r.read_at) : null,
          createdAt: String(r.created_at)
        }));
      }
      async markNotificationRead(userId, idOrAll) {
        const now = toSqlTimestamp();
        if (idOrAll === "all") {
          const res2 = await this.db.execute(
            "UPDATE notifications SET read_at = ? WHERE user_id = ? AND read_at IS NULL",
            [now, userId]
          );
          return { updated: res2.affectedRows };
        }
        const res = await this.db.execute(
          "UPDATE notifications SET read_at = ? WHERE id = ? AND user_id = ? AND read_at IS NULL",
          [now, idOrAll, userId]
        );
        return { updated: res.affectedRows };
      }
      async requestPasswordResetOtp(input, ipAddress) {
        const rawIdentifier = (input.identifier || input.email || "").trim();
        if (!rawIdentifier || rawIdentifier.length < 3) {
          throw new Error("Email or phone number is required.");
        }
        const requestedUiChannel = input.channel === "sms" || !input.channel && !rawIdentifier.includes("@") ? "sms" : "email";
        const dbChannel = requestedUiChannel === "sms" ? "phone" : "email";
        const user = await this.findUserByIdentifier(rawIdentifier);
        if (!user || user.deleted_at || user.is_blocked) {
          return {
            ok: true,
            channel: requestedUiChannel,
            deliveryConfigured: true,
            expiresInSeconds: 600
          };
        }
        const target = dbChannel === "email" ? user.email : user.phone;
        if (!target || !target.trim()) {
          return {
            ok: true,
            channel: requestedUiChannel,
            deliveryConfigured: true,
            expiresInSeconds: 600
          };
        }
        const locale = user.preferred_locale === "ar" ? "ar" : "en";
        const dispatched = await this.db.transaction(async (tx) => {
          const res = await this.dispatchOtpChallenge(tx, {
            userId: user.id,
            userName: user.name,
            channel: dbChannel,
            target,
            purpose: "password_reset_otp",
            locale
          });
          await writeAuditLog(tx, {
            actorUserId: user.id,
            action: `auth.password_reset_otp_requested.${dbChannel}`,
            entityType: "user",
            entityId: user.id,
            ipAddress
          });
          return res;
        });
        const isDevOrTest = process.env.NODE_ENV !== "production";
        return {
          ok: true,
          channel: requestedUiChannel,
          deliveryConfigured: dispatched.deliveryConfigured,
          expiresInSeconds: 600,
          ...isDevOrTest && !dispatched.deliveryConfigured ? { devOtpCode: dispatched.code } : {}
        };
      }
      async verifyPasswordResetOtp(input, ipAddress) {
        const rawIdentifier = input.identifier.trim();
        const cleanCode = input.code.replace(/\s+/g, "");
        if (!/^\d{6}$/.test(cleanCode)) {
          throw new Error("Please enter the 6-digit reset verification code.");
        }
        const user = await this.findUserByIdentifier(rawIdentifier);
        if (!user || user.deleted_at || user.is_blocked) {
          throw new Error("Invalid or expired verification code.");
        }
        const dbChannel = input.channel === "sms" || !input.channel && !rawIdentifier.includes("@") ? "phone" : "email";
        const now = toSqlTimestamp();
        const txRes = await this.db.transaction(async (tx) => {
          const challenge = await tx.queryOne(
            `SELECT id, code_hash, attempts, expires_at
         FROM verification_codes
         WHERE user_id = ? AND channel = ? AND purpose = 'password_reset_otp' AND consumed_at IS NULL
         ORDER BY created_at DESC LIMIT 1`,
            [user.id, dbChannel]
          );
          if (!challenge || String(challenge.expires_at) <= now) {
            throw new Error("Reset verification code expired or not found. Request a new OTP.");
          }
          if (Number(challenge.attempts) >= 5) {
            throw new Error("Too many failed verification attempts. Please request a new OTP code.");
          }
          const submittedHash = hashOtpCode(user.id, dbChannel, "password_reset_otp", cleanCode);
          if (!timingSafeStringMatch(challenge.code_hash, submittedHash)) {
            await tx.execute("UPDATE verification_codes SET attempts = attempts + 1 WHERE id = ?", [challenge.id]);
            return { failed: true, message: "Invalid 6-digit verification code." };
          }
          await tx.execute("UPDATE verification_codes SET consumed_at = ? WHERE id = ?", [now, challenge.id]);
          const rawResetToken = crypto5.randomBytes(24).toString("hex");
          const tokenHash = sha256Hex(rawResetToken);
          const resetExpiresAt = toSqlTimestamp(new Date(Date.now() + 15 * 6e4));
          await tx.execute(
            `UPDATE password_resets SET used_at = ? WHERE user_id = ? AND purpose = 'password_reset' AND used_at IS NULL`,
            [now, user.id]
          );
          await tx.execute(
            `INSERT INTO password_resets (id, user_id, token_hash, purpose, expires_at, used_at, created_at)
         VALUES (?, ?, ?, 'password_reset', ?, NULL, ?)`,
            [`pwr-${crypto5.randomUUID()}`, user.id, tokenHash, resetExpiresAt, now]
          );
          await writeAuditLog(tx, {
            actorUserId: user.id,
            action: `auth.password_reset_otp_verified.${dbChannel}`,
            entityType: "user",
            entityId: user.id,
            ipAddress
          });
          return { failed: false, resetToken: rawResetToken };
        });
        if (txRes.failed) {
          throw new Error(txRes.message);
        }
        return {
          ok: true,
          resetToken: txRes.resetToken,
          expiresInSeconds: 900
        };
      }
      async requestPasswordReset(email, ipAddress) {
        const emailNorm = email.trim().toLowerCase();
        const user = await this.db.queryOne("SELECT id, name, email, preferred_locale, deleted_at, is_blocked FROM users WHERE LOWER(email) = ? LIMIT 1", [
          emailNorm
        ]);
        if (!user || user.deleted_at || user.is_blocked) {
          return { ok: true };
        }
        const rawToken = crypto5.randomBytes(24).toString("hex");
        const tokenHash = sha256Hex(rawToken);
        const now = toSqlTimestamp();
        const expiresAt = toSqlTimestamp(new Date(Date.now() + 60 * 6e4));
        await this.db.transaction(async (tx) => {
          await tx.execute(
            `INSERT INTO password_resets (id, user_id, token_hash, purpose, expires_at, used_at, created_at)
         VALUES (?, ?, ?, 'password_reset', ?, NULL, ?)`,
            [`pwr-${crypto5.randomUUID()}`, user.id, tokenHash, expiresAt, now]
          );
          await queueEmail(tx, {
            to: user.email,
            templateKey: "password_reset",
            locale: user.preferred_locale === "ar" ? "ar" : "en",
            vars: {
              name: user.name,
              token: rawToken,
              link: `/account?resetToken=${rawToken}`
            }
          });
          await writeAuditLog(tx, {
            actorUserId: user.id,
            action: "auth.password_reset_requested",
            entityType: "user",
            entityId: user.id,
            ipAddress
          });
        });
        const isDevOrTest = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
        const hasSmtp = Boolean(process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
        return isDevOrTest && !hasSmtp ? { ok: true, devResetToken: rawToken } : { ok: true };
      }
      async confirmPasswordReset(token, newPassword, ipAddress) {
        const pwErr = validatePasswordStrength(newPassword);
        if (pwErr) throw new Error(pwErr);
        const tokenHash = sha256Hex(token.trim());
        const now = toSqlTimestamp();
        return this.db.transaction(async (tx) => {
          const resetRow = await tx.queryOne(
            "SELECT id, user_id, expires_at, used_at FROM password_resets WHERE token_hash = ? AND purpose = 'password_reset' LIMIT 1",
            [tokenHash]
          );
          if (!resetRow || resetRow.used_at || String(resetRow.expires_at) <= now) {
            throw new Error("Password reset token is invalid or expired.");
          }
          await tx.execute(
            "UPDATE users SET password_hash = ?, failed_login_attempts = 0, locked_until = NULL, updated_at = ? WHERE id = ?",
            [hashPassword(newPassword), now, resetRow.user_id]
          );
          await tx.execute("UPDATE password_resets SET used_at = ? WHERE id = ?", [now, resetRow.id]);
          await tx.execute("DELETE FROM sessions WHERE user_id = ?", [resetRow.user_id]);
          await writeAuditLog(tx, {
            actorUserId: resetRow.user_id,
            action: "auth.password_reset_completed",
            entityType: "user",
            entityId: resetRow.user_id,
            ipAddress
          });
          return { ok: true };
        });
      }
      async updateAccountProfile(userId, patch) {
        const curr = await this.db.queryOne("SELECT name, phone, preferred_locale, preferred_currency FROM users WHERE id = ?", [userId]);
        if (!curr) throw new Error("User not found.");
        const nextName = patch.name !== void 0 ? patch.name.trim() : curr.name;
        const nextPhone = patch.phone !== void 0 ? patch.phone.trim() : curr.phone;
        const nextLocale = patch.preferredLocale || (curr.preferred_locale === "ar" ? "ar" : "en");
        const nextCurr = patch.preferredCurrency || (curr.preferred_currency === "LBP" ? "LBP" : "USD");
        await this.db.execute(
          "UPDATE users SET name = ?, phone = ?, preferred_locale = ?, preferred_currency = ?, updated_at = ? WHERE id = ?",
          [nextName, nextPhone, nextLocale, nextCurr, toSqlTimestamp(), userId]
        );
        return {
          name: nextName,
          phone: nextPhone,
          preferredLocale: nextLocale,
          preferredCurrency: nextCurr
        };
      }
      async getUserAddresses(userId) {
        const rows = await this.db.query(
          "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC",
          [userId]
        );
        return rows.map((r) => ({
          id: String(r.id),
          userId: String(r.user_id),
          label: String(r.label),
          governorate: String(r.governorate),
          district: String(r.district),
          town: String(r.town),
          phone: String(r.phone),
          notes: r.notes ? String(r.notes) : "",
          isDefault: Boolean(r.is_default)
        }));
      }
      async createUserAddress(userId, input) {
        const id = `adr-${crypto5.randomUUID()}`;
        return this.db.transaction(async (tx) => {
          if (input.isDefault) {
            await tx.execute("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [userId]);
          } else {
            const cntRow = await tx.queryOne("SELECT COUNT(*) AS cnt FROM addresses WHERE user_id = ?", [userId]);
            if (Number(cntRow?.cnt ?? 0) === 0) input.isDefault = true;
          }
          await tx.execute(
            `INSERT INTO addresses (id, user_id, label, governorate, district, town, phone, notes, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              userId,
              input.label.trim(),
              input.governorate,
              input.district,
              input.town.trim(),
              input.phone.trim(),
              (input.notes || "").trim(),
              input.isDefault ? 1 : 0
            ]
          );
          return {
            id,
            userId,
            label: input.label.trim(),
            governorate: input.governorate,
            district: input.district,
            town: input.town.trim(),
            phone: input.phone.trim(),
            notes: (input.notes || "").trim(),
            isDefault: Boolean(input.isDefault)
          };
        });
      }
      async updateUserAddress(userId, addressId, patch) {
        return this.db.transaction(async (tx) => {
          const existing = await tx.queryOne(
            "SELECT * FROM addresses WHERE id = ? AND user_id = ?",
            [addressId, userId]
          );
          if (!existing) throw new Error("Address not found.");
          if (patch.isDefault) {
            await tx.execute("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [userId]);
          }
          const next = {
            label: patch.label !== void 0 ? patch.label.trim() : String(existing.label),
            governorate: patch.governorate !== void 0 ? patch.governorate : String(existing.governorate),
            district: patch.district !== void 0 ? patch.district : String(existing.district),
            town: patch.town !== void 0 ? patch.town.trim() : String(existing.town),
            phone: patch.phone !== void 0 ? patch.phone.trim() : String(existing.phone),
            notes: patch.notes !== void 0 ? patch.notes.trim() : String(existing.notes || ""),
            isDefault: patch.isDefault !== void 0 ? patch.isDefault : Boolean(existing.is_default)
          };
          await tx.execute(
            `UPDATE addresses SET label = ?, governorate = ?, district = ?, town = ?, phone = ?, notes = ?, is_default = ?
         WHERE id = ? AND user_id = ?`,
            [next.label, next.governorate, next.district, next.town, next.phone, next.notes, next.isDefault ? 1 : 0, addressId, userId]
          );
          return { id: addressId, userId, ...next };
        });
      }
      async deleteUserAddress(userId, addressId) {
        await this.db.execute("DELETE FROM addresses WHERE id = ? AND user_id = ?", [addressId, userId]);
      }
      async verifySubOrderOwnership(tx, subOrderId, opts) {
        const row = await tx.queryOne(
          `SELECT so.id AS sub_id, so.seller_id, so.subtotal_usd_cents, so.discount_usd_cents,
              o.id AS order_id, o.order_number, o.user_id AS order_user_id, o.customer_phone,
              sel.owner_user_id
       FROM sub_orders so
       INNER JOIN orders o ON o.id = so.order_id
       INNER JOIN sellers sel ON sel.id = so.seller_id
       WHERE so.id = ? LIMIT 1`,
          [subOrderId]
        );
        if (!row) throw new Error("Sub-order not found.");
        if (opts.userId) {
          if (row.order_user_id !== opts.userId) {
            throw new Error("You do not own this order.");
          }
          return row;
        }
        const ordNum = (opts.orderNumber || "").trim().toUpperCase();
        const normSubmitted = normalizePhone(opts.phone || "");
        if (!ordNum || normSubmitted.length < 6) {
          throw new Error("Order number and customer phone are required for guest requests.");
        }
        if (row.order_number.toUpperCase() !== ordNum || normalizePhone(row.customer_phone) !== normSubmitted) {
          throw new Error("Order verification failed.");
        }
        return row;
      }
      async createReturnRequest(input) {
        return this.db.transaction(async (tx) => {
          const sub = await this.verifySubOrderOwnership(tx, input.subOrderId, {
            userId: input.userId,
            orderNumber: input.orderNumber,
            phone: input.phone
          });
          const dup = await tx.queryOne(
            "SELECT id FROM returns WHERE sub_order_id = ? AND status IN ('requested', 'approved', 'refunded') LIMIT 1",
            [input.subOrderId]
          );
          if (dup) throw new Error("A return request already exists for this shipment.");
          const id = `ret-${crypto5.randomUUID()}`;
          const now = toSqlTimestamp();
          const refundUsdCents = Math.max(0, Number(sub.subtotal_usd_cents) - Number(sub.discount_usd_cents || 0));
          const actorId = input.userId || `guest:${normalizePhone(input.phone || "")}`;
          await tx.execute(
            "INSERT INTO returns (id, sub_order_id, user_id, reason, status, refund_usd_cents, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [id, input.subOrderId, actorId, input.reason.trim(), "requested", refundUsdCents, now]
          );
          await this.createNotification(
            tx,
            sub.owner_user_id,
            { en: `Return requested on ${sub.order_number}`, ar: `\u0637\u0644\u0628 \u0625\u0631\u062C\u0627\u0639 \u0639\u0644\u0649 \u0627\u0644\u0637\u0644\u0628 ${sub.order_number}` },
            { en: input.reason.trim().slice(0, 140), ar: input.reason.trim().slice(0, 140) }
          );
          await writeAuditLog(tx, {
            actorUserId: input.userId || null,
            action: "customer.return_requested",
            entityType: "return",
            entityId: id,
            after: { subOrderId: input.subOrderId, refundUsdCents }
          });
          return {
            id,
            subOrderId: input.subOrderId,
            userId: actorId,
            reason: input.reason.trim(),
            status: "requested",
            refundUsdCents,
            createdAt: now,
            orderNumber: sub.order_number,
            sellerId: sub.seller_id
          };
        });
      }
      async createDispute(input) {
        return this.db.transaction(async (tx) => {
          const sub = await this.verifySubOrderOwnership(tx, input.subOrderId, {
            userId: input.userId,
            orderNumber: input.orderNumber,
            phone: input.phone
          });
          const id = `dsp-${crypto5.randomUUID()}`;
          const now = toSqlTimestamp();
          const actorId = input.userId || `guest:${normalizePhone(input.phone || "")}`;
          await tx.execute(
            "INSERT INTO disputes (id, sub_order_id, opened_by_user_id, reason, status, resolution_note, created_at) VALUES (?, ?, ?, ?, ?, NULL, ?)",
            [id, input.subOrderId, actorId, input.reason.trim(), "open", now]
          );
          await this.createNotification(
            tx,
            sub.owner_user_id,
            { en: `Dispute opened on ${sub.order_number}`, ar: `\u062A\u0645 \u0641\u062A\u062D \u0646\u0632\u0627\u0639 \u0639\u0644\u0649 \u0627\u0644\u0637\u0644\u0628 ${sub.order_number}` },
            { en: input.reason.trim().slice(0, 140), ar: input.reason.trim().slice(0, 140) }
          );
          await writeAuditLog(tx, {
            actorUserId: input.userId || null,
            action: "customer.dispute_opened",
            entityType: "dispute",
            entityId: id,
            after: { subOrderId: input.subOrderId }
          });
          return {
            id,
            subOrderId: input.subOrderId,
            openedByUserId: actorId,
            reason: input.reason.trim(),
            status: "open",
            resolutionNote: null,
            createdAt: now,
            orderNumber: sub.order_number,
            sellerId: sub.seller_id
          };
        });
      }
      async getUserCases(userId) {
        const returnRows = await this.db.query(
          `SELECT r.*, o.order_number, so.seller_id
       FROM returns r
       INNER JOIN sub_orders so ON so.id = r.sub_order_id
       INNER JOIN orders o ON o.id = so.order_id
       WHERE r.user_id = ? OR o.user_id = ?
       ORDER BY r.created_at DESC`,
          [userId, userId]
        );
        const disputeRows = await this.db.query(
          `SELECT d.*, o.order_number, so.seller_id
       FROM disputes d
       INNER JOIN sub_orders so ON so.id = d.sub_order_id
       INNER JOIN orders o ON o.id = so.order_id
       WHERE d.opened_by_user_id = ? OR o.user_id = ?
       ORDER BY d.created_at DESC`,
          [userId, userId]
        );
        return {
          returns: returnRows.map((r) => ({
            id: String(r.id),
            subOrderId: String(r.sub_order_id),
            userId: String(r.user_id),
            reason: String(r.reason),
            status: String(r.status),
            refundUsdCents: Number(r.refund_usd_cents || 0),
            createdAt: String(r.created_at),
            orderNumber: r.order_number ? String(r.order_number) : void 0,
            sellerId: r.seller_id ? String(r.seller_id) : void 0
          })),
          disputes: disputeRows.map((d) => ({
            id: String(d.id),
            subOrderId: String(d.sub_order_id),
            openedByUserId: String(d.opened_by_user_id),
            reason: String(d.reason),
            status: String(d.status),
            resolutionNote: d.resolution_note ? String(d.resolution_note) : null,
            createdAt: String(d.created_at),
            orderNumber: d.order_number ? String(d.order_number) : void 0,
            sellerId: d.seller_id ? String(d.seller_id) : void 0
          }))
        };
      }
      async getCasesForSubOrders(subOrderIds) {
        if (subOrderIds.length === 0) return { returns: [], disputes: [] };
        const placeholders = subOrderIds.map(() => "?").join(", ");
        const [returnRows, disputeRows] = await Promise.all([
          this.db.query(
            `SELECT r.*, o.order_number, so.seller_id
         FROM returns r
         INNER JOIN sub_orders so ON so.id = r.sub_order_id
         INNER JOIN orders o ON o.id = so.order_id
         WHERE r.sub_order_id IN (${placeholders})
         ORDER BY r.created_at DESC`,
            subOrderIds
          ),
          this.db.query(
            `SELECT d.*, o.order_number, so.seller_id
         FROM disputes d
         INNER JOIN sub_orders so ON so.id = d.sub_order_id
         INNER JOIN orders o ON o.id = so.order_id
         WHERE d.sub_order_id IN (${placeholders})
         ORDER BY d.created_at DESC`,
            subOrderIds
          )
        ]);
        return {
          returns: returnRows.map((r) => ({
            id: String(r.id),
            subOrderId: String(r.sub_order_id),
            userId: String(r.user_id),
            reason: String(r.reason),
            status: String(r.status),
            refundUsdCents: Number(r.refund_usd_cents || 0),
            createdAt: String(r.created_at),
            orderNumber: r.order_number ? String(r.order_number) : void 0,
            sellerId: r.seller_id ? String(r.seller_id) : void 0
          })),
          disputes: disputeRows.map((d) => ({
            id: String(d.id),
            subOrderId: String(d.sub_order_id),
            openedByUserId: String(d.opened_by_user_id),
            reason: String(d.reason),
            status: String(d.status),
            resolutionNote: d.resolution_note ? String(d.resolution_note) : null,
            createdAt: String(d.created_at),
            orderNumber: d.order_number ? String(d.order_number) : void 0,
            sellerId: d.seller_id ? String(d.seller_id) : void 0
          }))
        };
      }
      async createSupportTicket(input) {
        const id = `tkt-${crypto5.randomUUID()}`;
        const now = toSqlTimestamp();
        await this.db.execute(
          "INSERT INTO support_tickets (id, user_id, email, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [id, input.userId, input.email.trim().toLowerCase(), input.subject.trim(), input.message.trim(), "open", now]
        );
        return {
          id,
          userId: input.userId,
          email: input.email.trim().toLowerCase(),
          subject: input.subject.trim(),
          message: input.message.trim(),
          status: "open",
          createdAt: now
        };
      }
      async getUserSupportTickets(userId) {
        const rows = await this.db.query(
          "SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
          [userId]
        );
        return rows.map((t) => ({
          id: String(t.id),
          userId: t.user_id ? String(t.user_id) : null,
          email: String(t.email),
          subject: String(t.subject),
          message: String(t.message),
          status: String(t.status),
          createdAt: String(t.created_at)
        }));
      }
      // --- Seller Extended Catalog, Plan Upgrade, Staff & Returns ---
      async updateSellerProduct(sellerId, productId, actorUserId, patch, ipAddress) {
        if (patch.basePriceUsdCents !== void 0 && (!Number.isInteger(patch.basePriceUsdCents) || patch.basePriceUsdCents <= 0)) {
          throw new Error("Price must be a positive integer in USD cents.");
        }
        return this.db.transaction(async (tx) => {
          const existing = await tx.queryOne(
            "SELECT * FROM products WHERE id = ? AND seller_id = ? AND deleted_at IS NULL",
            [productId, sellerId]
          );
          if (!existing) throw new Error("Product not found.");
          const currTitle = parseJson(existing.title_json, { en: "", ar: "" });
          const currSub = parseJson(existing.subtitle_json, { en: "", ar: "" });
          const currDesc = parseJson(existing.description_json, { en: "", ar: "" });
          const now = toSqlTimestamp();
          const nextTitle = {
            en: patch.titleEn !== void 0 ? patch.titleEn.trim() : currTitle.en,
            ar: patch.titleAr !== void 0 ? patch.titleAr.trim() : currTitle.ar
          };
          const nextSub = {
            en: patch.subtitleEn !== void 0 ? patch.subtitleEn.trim() : currSub.en,
            ar: patch.subtitleAr !== void 0 ? patch.subtitleAr.trim() : currSub.ar
          };
          const nextDesc = {
            en: patch.descriptionEn !== void 0 ? patch.descriptionEn.trim() : currDesc.en,
            ar: patch.descriptionAr !== void 0 ? patch.descriptionAr.trim() : currDesc.ar
          };
          await tx.execute(
            `UPDATE products
         SET category_id = COALESCE(?, category_id),
             brand_id = ?,
             department = COALESCE(?, department),
             title_json = ?,
             subtitle_json = ?,
             description_json = ?,
             specs_json = COALESCE(?, specs_json),
             base_price_usd_cents = COALESCE(?, base_price_usd_cents),
             compare_at_usd_cents = ?,
             model_3d_url = ?,
             published = COALESCE(?, published),
             updated_at = ?
         WHERE id = ?`,
            [
              patch.categoryId || null,
              patch.brandId !== void 0 ? patch.brandId : existing.brand_id,
              patch.department || null,
              JSON.stringify(nextTitle),
              JSON.stringify(nextSub),
              JSON.stringify(nextDesc),
              patch.specs ? JSON.stringify(patch.specs) : null,
              patch.basePriceUsdCents ?? null,
              patch.compareAtUsdCents !== void 0 ? patch.compareAtUsdCents : existing.compare_at_usd_cents,
              patch.model3dUrl !== void 0 ? patch.model3dUrl?.trim() || null : existing.model_3d_url,
              patch.published !== void 0 ? patch.published ? 1 : 0 : null,
              now,
              productId
            ]
          );
          if (patch.variants && patch.variants.length > 0) {
            const existingVars = await tx.query(
              "SELECT id, stock FROM product_variants WHERE product_id = ?",
              [productId]
            );
            const existingMap = new Map(existingVars.map((v) => [v.id, Number(v.stock)]));
            const keepIds = /* @__PURE__ */ new Set();
            for (const v of patch.variants) {
              const vStock = Math.max(0, Math.trunc(v.stock));
              const deltaCents = Math.trunc(v.priceDeltaUsdCents || 0);
              if (v.id && existingMap.has(v.id)) {
                keepIds.add(v.id);
                const prevStock = existingMap.get(v.id);
                await tx.execute(
                  `UPDATE product_variants SET sku = ?, size = ?, color = ?, color_hex = ?, stock = ?, price_delta_usd_cents = ?
               WHERE id = ? AND product_id = ?`,
                  [v.sku.trim(), v.size?.trim() || null, v.color.trim(), v.colorHex || "#1C1D21", vStock, deltaCents, v.id, productId]
                );
                if (vStock !== prevStock) {
                  await tx.execute(
                    "INSERT INTO stock_movements (id, variant_id, delta, reason, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                    [`stk-${crypto5.randomUUID()}`, v.id, vStock - prevStock, "manual_adjustment", productId, now]
                  );
                }
              } else {
                const newVarId = `var-${crypto5.randomUUID()}`;
                keepIds.add(newVarId);
                await tx.execute(
                  `INSERT INTO product_variants (id, product_id, sku, size, color, color_hex, stock, price_delta_usd_cents)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                  [newVarId, productId, v.sku.trim(), v.size?.trim() || null, v.color.trim(), v.colorHex || "#1C1D21", vStock, deltaCents]
                );
                await tx.execute(
                  "INSERT INTO stock_movements (id, variant_id, delta, reason, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                  [`stk-${crypto5.randomUUID()}`, newVarId, vStock, "initial_stock", productId, now]
                );
              }
            }
            for (const oldVar of existingVars) {
              if (!keepIds.has(oldVar.id)) {
                const hasOrders = await tx.queryOne(
                  "SELECT id FROM order_items WHERE variant_id = ? LIMIT 1",
                  [oldVar.id]
                );
                if (!hasOrders) {
                  await tx.execute("DELETE FROM product_variants WHERE id = ?", [oldVar.id]);
                }
              }
            }
          }
          if (patch.mediaIds && patch.mediaIds.length > 0) {
            for (const mId of patch.mediaIds) {
              await tx.execute("UPDATE media SET entity_id = ? WHERE id = ? AND owner_user_id = ?", [
                productId,
                mId,
                actorUserId
              ]);
            }
          }
          await writeAuditLog(tx, {
            actorUserId,
            action: "seller.update_product",
            entityType: "product",
            entityId: productId,
            after: { titleEn: nextTitle.en, basePriceUsdCents: patch.basePriceUsdCents },
            ipAddress
          });
          const prevPrice = Number(existing.base_price_usd_cents);
          if (patch.basePriceUsdCents !== void 0 && patch.basePriceUsdCents < prevPrice) {
            await this.notifyWishlistPriceDrop(tx, {
              productId,
              oldPriceUsdCents: prevPrice,
              newPriceUsdCents: patch.basePriceUsdCents
            });
          }
          const updated = await tx.queryOne("SELECT * FROM products WHERE id = ?", [productId]);
          const [mapped] = await this.mapProductRows([updated], tx);
          return mapped;
        });
      }
      async deleteSellerProduct(sellerId, productId, actorUserId, ipAddress) {
        const existing = await this.db.queryOne(
          "SELECT id FROM products WHERE id = ? AND seller_id = ? AND deleted_at IS NULL",
          [productId, sellerId]
        );
        if (!existing) throw new Error("Product not found.");
        const now = toSqlTimestamp();
        await this.db.execute("UPDATE products SET deleted_at = ?, published = 0, updated_at = ? WHERE id = ?", [
          now,
          now,
          productId
        ]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "seller.delete_product",
          entityType: "product",
          entityId: productId,
          ipAddress
        });
      }
      async switchSellerPlan(sellerId, actorUserId, planTier, ipAddress) {
        return this.db.transaction(async (tx) => {
          const plan = await tx.queryOne(
            "SELECT tier, monthly_fee_usd_cents FROM subscription_plans WHERE tier = ?",
            [planTier]
          );
          if (!plan) throw new Error("Subscription plan not found.");
          const nextDue = toSqlTimestamp(new Date(Date.now() + 30 * 864e5));
          const now = toSqlTimestamp();
          const existingSub = await tx.queryOne(
            "SELECT id, plan_tier FROM subscriptions WHERE seller_id = ? ORDER BY created_at DESC LIMIT 1",
            [sellerId]
          );
          if (existingSub) {
            await tx.execute("UPDATE subscriptions SET plan_tier = ?, status = 'active', next_due_at = ? WHERE id = ?", [
              planTier,
              nextDue,
              existingSub.id
            ]);
          } else {
            await tx.execute(
              "INSERT INTO subscriptions (id, seller_id, plan_tier, status, next_due_at, created_at) VALUES (?, ?, ?, 'active', ?, ?)",
              [`subp-${crypto5.randomUUID()}`, sellerId, planTier, nextDue, now]
            );
          }
          if (Number(plan.monthly_fee_usd_cents) > 0 && existingSub?.plan_tier !== planTier) {
            await tx.execute(
              `INSERT INTO ledger_entries (id, seller_id, entry_type, direction, amount_usd_cents, availability, note, created_at)
           VALUES (?, ?, 'SUBSCRIPTION_FEE', 'debit', ?, 'available', ?, ?)`,
              [`led-${crypto5.randomUUID()}`, sellerId, Number(plan.monthly_fee_usd_cents), `Plan upgrade to ${planTier.toUpperCase()}`, now]
            );
          }
          await writeAuditLog(tx, {
            actorUserId,
            action: "seller.switch_plan",
            entityType: "subscription",
            entityId: sellerId,
            before: { planTier: existingSub?.plan_tier || "free" },
            after: { planTier },
            ipAddress
          });
          return { planTier, nextDue };
        });
      }
      async listSellerStaff(sellerId) {
        const mapRow = await this.db.queryOne(
          `SELECT value_json FROM settings WHERE ${this.keyCol()} = 'seller_staff_map'`
        );
        const map = parseJson(mapRow?.value_json, {});
        const staffIds = Object.entries(map).filter(([, sid]) => sid === sellerId).map(([uid]) => uid);
        if (staffIds.length === 0) return [];
        const placeholders = staffIds.map(() => "?").join(", ");
        const rows = await this.db.query(
          `SELECT id, name, email, phone, totp_enabled, created_at FROM users WHERE id IN (${placeholders}) AND deleted_at IS NULL`,
          staffIds
        );
        const out = [];
        for (const r of rows) {
          const perms = await this.db.query(
            "SELECT permission_key FROM user_permissions WHERE user_id = ?",
            [r.id]
          );
          out.push({
            userId: r.id,
            sellerId,
            name: r.name,
            email: r.email,
            phone: r.phone,
            permissions: perms.map((p) => p.permission_key),
            totpEnabled: Boolean(r.totp_enabled),
            createdAt: String(r.created_at)
          });
        }
        return out;
      }
      async createSellerStaff(sellerId, actorUserId, input, ipAddress) {
        const pwErr = validatePasswordStrength(input.password);
        if (pwErr) throw new Error(pwErr);
        const allowedSellerPerms = /* @__PURE__ */ new Set(["seller.catalog", "seller.orders", "seller.finance"]);
        const cleanPerms = input.permissions.filter((p) => allowedSellerPerms.has(p));
        if (cleanPerms.length === 0) throw new Error("Select at least one valid seller permission.");
        const emailNorm = input.email.trim().toLowerCase();
        return this.db.transaction(async (tx) => {
          const dup = await tx.queryOne("SELECT id FROM users WHERE LOWER(email) = ?", [emailNorm]);
          if (dup) throw new Error("Email is already registered.");
          const userId = `usr-${crypto5.randomUUID()}`;
          const now = toSqlTimestamp();
          await tx.execute(
            `INSERT INTO users (id, name, email, phone, password_hash, role_key, email_verified_at, preferred_locale, preferred_currency, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'seller_staff', ?, 'en', 'USD', ?, ?)`,
            [userId, input.name.trim(), emailNorm, input.phone.trim(), hashPassword(input.password), now, now, now]
          );
          for (const perm of cleanPerms) {
            await tx.execute("INSERT INTO user_permissions (id, user_id, permission_key) VALUES (?, ?, ?)", [
              `up-${crypto5.randomUUID()}`,
              userId,
              perm
            ]);
          }
          const kCol = this.keyCol();
          const mapRow = await tx.queryOne(
            `SELECT value_json FROM settings WHERE ${kCol} = 'seller_staff_map'`
          );
          const currMap = parseJson(mapRow?.value_json, {});
          currMap[userId] = sellerId;
          await tx.execute(
            this.db.driver === "mysql" ? `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES ('seller_staff_map', ?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), updated_at = VALUES(updated_at)` : `INSERT INTO settings (${kCol}, value_json, updated_at) VALUES ('seller_staff_map', ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`,
            [JSON.stringify(currMap), now]
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: "seller.create_staff",
            entityType: "user",
            entityId: userId,
            after: { sellerId, email: emailNorm, permissions: cleanPerms },
            ipAddress
          });
          return {
            userId,
            sellerId,
            name: input.name.trim(),
            email: emailNorm,
            phone: input.phone.trim(),
            permissions: cleanPerms,
            totpEnabled: false,
            createdAt: now
          };
        });
      }
      async removeSellerStaff(sellerId, staffUserId, actorUserId, ipAddress) {
        return this.db.transaction(async (tx) => {
          const kCol = this.keyCol();
          const mapRow = await tx.queryOne(
            `SELECT value_json FROM settings WHERE ${kCol} = 'seller_staff_map'`
          );
          const currMap = parseJson(mapRow?.value_json, {});
          if (currMap[staffUserId] !== sellerId) {
            throw new Error("Staff member not found for this store.");
          }
          delete currMap[staffUserId];
          const now = toSqlTimestamp();
          await tx.execute(`UPDATE settings SET value_json = ?, updated_at = ? WHERE ${kCol} = 'seller_staff_map'`, [
            JSON.stringify(currMap),
            now
          ]);
          await tx.execute("UPDATE users SET deleted_at = ?, is_blocked = 1, updated_at = ? WHERE id = ?", [
            now,
            now,
            staffUserId
          ]);
          await tx.execute("DELETE FROM sessions WHERE user_id = ?", [staffUserId]);
          await writeAuditLog(tx, {
            actorUserId,
            action: "seller.remove_staff",
            entityType: "user",
            entityId: staffUserId,
            after: { sellerId },
            ipAddress
          });
        });
      }
      async sellerUpdateReturn(sellerId, actorUserId, returnId, patch, ipAddress) {
        return this.db.transaction(async (tx) => {
          const row = await tx.queryOne(
            `SELECT r.id, r.user_id, r.status, o.order_number
         FROM returns r
         INNER JOIN sub_orders so ON so.id = r.sub_order_id
         INNER JOIN orders o ON o.id = so.order_id
         WHERE r.id = ? AND so.seller_id = ? LIMIT 1`,
            [returnId, sellerId]
          );
          if (!row) throw new Error("Return request not found.");
          if (row.status === "refunded") throw new Error("Refund already finalized.");
          await tx.execute("UPDATE returns SET status = ? WHERE id = ?", [patch.status, returnId]);
          if (!row.user_id.startsWith("guest:")) {
            await this.createNotification(
              tx,
              row.user_id,
              { en: `Return ${patch.status} (${row.order_number})`, ar: `\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0625\u0631\u062C\u0627\u0639: ${patch.status}` },
              { en: `Merchant marked return request as ${patch.status}.`, ar: `\u0642\u0627\u0645 \u0627\u0644\u062A\u0627\u062C\u0631 \u0628\u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u0627\u0644\u0625\u0631\u062C\u0627\u0639 \u0625\u0644\u0649 ${patch.status}.` }
            );
          }
          await writeAuditLog(tx, {
            actorUserId,
            action: "seller.update_return",
            entityType: "return",
            entityId: returnId,
            before: { status: row.status },
            after: { status: patch.status },
            ipAddress
          });
          return tx.queryOne("SELECT * FROM returns WHERE id = ?", [returnId]);
        });
      }
      // --- Admin Moderation, Categories/Brands/Attributes, KYC, Cases, Support, Zones, Plans, Templates, Menus, Users ---
      async adminModerateProduct(productId, actorUserId, patch, ipAddress) {
        return this.db.transaction(async (tx) => {
          const existing = await tx.queryOne(
            "SELECT * FROM products WHERE id = ? AND deleted_at IS NULL",
            [productId]
          );
          if (!existing) throw new Error("Product not found.");
          const nextMod = patch.moderationStatus || String(existing.moderation_status || "pending");
          const nextPub = patch.published !== void 0 ? patch.published ? 1 : 0 : Number(existing.published);
          const nextFeat = patch.featured !== void 0 ? patch.featured ? 1 : 0 : Number(existing.featured);
          await tx.execute(
            "UPDATE products SET moderation_status = ?, published = ?, featured = ?, updated_at = ? WHERE id = ?",
            [nextMod, nextPub, nextFeat, toSqlTimestamp(), productId]
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.moderate_product",
            entityType: "product",
            entityId: productId,
            before: { moderationStatus: existing.moderation_status, published: Boolean(existing.published), featured: Boolean(existing.featured) },
            after: { moderationStatus: nextMod, published: Boolean(nextPub), featured: Boolean(nextFeat) },
            ipAddress
          });
          const updated = await tx.queryOne("SELECT * FROM products WHERE id = ?", [productId]);
          const [mapped] = await this.mapProductRows([updated], tx);
          return mapped;
        });
      }
      async adminCreateCategory(actorUserId, input, ipAddress) {
        const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
        if (cleanSlug.length < 2) throw new Error("Category slug must be at least 2 characters.");
        const dup = await this.db.queryOne("SELECT id FROM categories WHERE slug = ?", [cleanSlug]);
        if (dup) throw new Error(`Category slug "${cleanSlug}" already exists.`);
        const id = `cat-${cleanSlug}-${crypto5.randomBytes(2).toString("hex")}`;
        await this.db.execute(
          `INSERT INTO categories (id, parent_id, slug, department, name_json, commission_bps, sort_order, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            id,
            input.parentId || null,
            cleanSlug,
            input.department,
            JSON.stringify(input.name),
            input.commissionBps ?? null,
            Math.trunc(input.sortOrder ?? 10)
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.create_category",
          entityType: "category",
          entityId: id,
          after: { slug: cleanSlug, commissionBps: input.commissionBps },
          ipAddress
        });
        return {
          id,
          parentId: input.parentId || null,
          slug: cleanSlug,
          department: input.department,
          name: input.name,
          commissionBps: input.commissionBps ?? null
        };
      }
      async adminUpdateCategory(id, actorUserId, patch, ipAddress) {
        const existing = await this.db.queryOne("SELECT * FROM categories WHERE id = ?", [id]);
        if (!existing) throw new Error("Category not found.");
        const nextName = patch.name || parseJson(existing.name_json, { en: id, ar: id });
        await this.db.execute(
          "UPDATE categories SET name_json = ?, commission_bps = ?, sort_order = ?, active = ? WHERE id = ?",
          [
            JSON.stringify(nextName),
            patch.commissionBps !== void 0 ? patch.commissionBps : existing.commission_bps,
            patch.sortOrder !== void 0 ? Math.trunc(patch.sortOrder) : Number(existing.sort_order),
            patch.active !== void 0 ? patch.active ? 1 : 0 : Number(existing.active),
            id
          ]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.update_category",
          entityType: "category",
          entityId: id,
          after: patch,
          ipAddress
        });
        return {
          id,
          parentId: existing.parent_id ? String(existing.parent_id) : null,
          slug: String(existing.slug),
          department: String(existing.department),
          name: nextName,
          commissionBps: patch.commissionBps !== void 0 ? patch.commissionBps : existing.commission_bps
        };
      }
      async adminDeleteCategory(id, actorUserId, ipAddress) {
        if (["cat-fashion", "cat-electronics", "cat-home"].includes(id)) {
          throw new Error("Core department categories cannot be deleted.");
        }
        await this.db.execute("UPDATE categories SET active = 0 WHERE id = ?", [id]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_category",
          entityType: "category",
          entityId: id,
          ipAddress
        });
      }
      async adminCreateBrand(actorUserId, input, ipAddress) {
        const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
        if (cleanSlug.length < 2) throw new Error("Brand slug must be at least 2 characters.");
        const dup = await this.db.queryOne("SELECT id FROM brands WHERE slug = ? AND active = 1", [cleanSlug]);
        if (dup) throw new Error(`Brand "${cleanSlug}" already exists.`);
        const id = `brd-${crypto5.randomUUID()}`;
        await this.db.execute("INSERT INTO brands (id, slug, name_json, active) VALUES (?, ?, ?, 1)", [
          id,
          cleanSlug,
          JSON.stringify(input.name)
        ]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.create_brand",
          entityType: "brand",
          entityId: id,
          after: { slug: cleanSlug },
          ipAddress
        });
        return { id, slug: cleanSlug, name: input.name, active: true };
      }
      async adminDeleteBrand(id, actorUserId, ipAddress) {
        await this.db.execute("UPDATE brands SET active = 0 WHERE id = ?", [id]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_brand",
          entityType: "brand",
          entityId: id,
          ipAddress
        });
      }
      async adminCreateAttribute(actorUserId, input, ipAddress) {
        const cleanCode = input.code.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "_");
        const cleanVals = input.values.map((v) => v.trim()).filter(Boolean);
        const id = `atr-${crypto5.randomUUID()}`;
        await this.db.execute("INSERT INTO attributes (id, code, name_json, values_json) VALUES (?, ?, ?, ?)", [
          id,
          cleanCode,
          JSON.stringify(input.name),
          JSON.stringify(cleanVals)
        ]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.create_attribute",
          entityType: "attribute",
          entityId: id,
          after: { code: cleanCode, values: cleanVals },
          ipAddress
        });
        return { id, code: cleanCode, name: input.name, values: cleanVals };
      }
      async adminDeleteAttribute(id, actorUserId, ipAddress) {
        await this.db.execute("DELETE FROM attributes WHERE id = ?", [id]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_attribute",
          entityType: "attribute",
          entityId: id,
          ipAddress
        });
      }
      async adminReviewSellerDocument(docId, actorUserId, patch, ipAddress) {
        return this.db.transaction(async (tx) => {
          const doc = await tx.queryOne(
            "SELECT id, seller_id, doc_type FROM seller_documents WHERE id = ?",
            [docId]
          );
          if (!doc) throw new Error("Document not found.");
          await tx.execute("UPDATE seller_documents SET review_status = ?, reviewer_note = ? WHERE id = ?", [
            patch.reviewStatus,
            patch.reviewerNote?.trim() || null,
            docId
          ]);
          const seller = await tx.queryOne("SELECT owner_user_id FROM sellers WHERE id = ?", [
            doc.seller_id
          ]);
          if (seller) {
            await this.createNotification(
              tx,
              seller.owner_user_id,
              { en: `KYC document ${patch.reviewStatus}`, ar: `\u0645\u0633\u062A\u0646\u062F \u0627\u0644\u062A\u062D\u0642\u0642: ${patch.reviewStatus}` },
              {
                en: `${doc.doc_type} marked ${patch.reviewStatus}${patch.reviewerNote ? `: ${patch.reviewerNote}` : "."}`,
                ar: `\u062A\u0645\u062A \u0645\u0631\u0627\u062C\u0639\u0629 ${doc.doc_type} \u0643\u0640 ${patch.reviewStatus}${patch.reviewerNote ? `: ${patch.reviewerNote}` : "."}`
              }
            );
          }
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.review_seller_document",
            entityType: "seller_document",
            entityId: docId,
            after: patch,
            ipAddress
          });
          return tx.queryOne("SELECT * FROM seller_documents WHERE id = ?", [docId]);
        });
      }
      async adminResolveReturn(returnId, actorUserId, patch, ipAddress) {
        return this.db.transaction(async (tx) => {
          const ret = await tx.queryOne("SELECT * FROM returns WHERE id = ?", [returnId]);
          if (!ret) throw new Error("Return request not found.");
          if (ret.status === "refunded") throw new Error("Return is already refunded.");
          const sub = await tx.queryOne(
            `SELECT so.id, so.order_id, so.seller_id, so.subtotal_usd_cents, so.discount_usd_cents, o.order_number, sel.owner_user_id
         FROM sub_orders so
         INNER JOIN orders o ON o.id = so.order_id
         INNER JOIN sellers sel ON sel.id = so.seller_id
         WHERE so.id = ? LIMIT 1`,
            [ret.sub_order_id]
          );
          if (!sub) throw new Error("Linked sub-order not found.");
          const maxRefund = Math.max(0, Number(sub.subtotal_usd_cents) - Number(sub.discount_usd_cents || 0));
          const refundAmount = patch.refundUsdCents !== void 0 ? Math.min(maxRefund, Math.max(0, Math.trunc(patch.refundUsdCents))) : Number(ret.refund_usd_cents || maxRefund);
          await tx.execute("UPDATE returns SET status = ?, refund_usd_cents = ? WHERE id = ?", [
            patch.status,
            refundAmount,
            returnId
          ]);
          const now = toSqlTimestamp();
          if (patch.status === "refunded" && refundAmount > 0) {
            const grossLed = await tx.queryOne(
              "SELECT availability FROM ledger_entries WHERE sub_order_id = ? AND entry_type = 'ORDER_GROSS' LIMIT 1",
              [sub.id]
            );
            const availability = grossLed?.availability === "available" ? "available" : "pending";
            await tx.execute(
              `INSERT INTO ledger_entries (id, seller_id, sub_order_id, order_number, entry_type, direction, amount_usd_cents, availability, note, created_at)
           VALUES (?, ?, ?, ?, 'ORDER_REFUND', 'debit', ?, ?, ?, ?)`,
              [
                `led-${crypto5.randomUUID()}`,
                sub.seller_id,
                sub.id,
                sub.order_number,
                refundAmount,
                availability,
                `Customer refund for return ${returnId} (${sub.order_number})`,
                now
              ]
            );
            await tx.execute("UPDATE orders SET payment_status = 'refunded' WHERE id = ?", [sub.order_id]);
          }
          if (!ret.user_id.startsWith("guest:")) {
            await this.createNotification(
              tx,
              ret.user_id,
              { en: `Return ${patch.status} (${sub.order_number})`, ar: `\u062D\u0627\u0644\u0629 \u0627\u0644\u0625\u0631\u062C\u0627\u0639: ${patch.status}` },
              {
                en: patch.status === "refunded" ? `Refund of $${(refundAmount / 100).toFixed(2)} processed for ${sub.order_number}.` : `Your return request on ${sub.order_number} is now ${patch.status}.`,
                ar: patch.status === "refunded" ? `\u062A\u0645\u062A \u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0633\u062A\u0631\u062F\u0627\u062F ${(refundAmount / 100).toFixed(2)} \u062F\u0648\u0644\u0627\u0631 \u0644\u0644\u0637\u0644\u0628 ${sub.order_number}.` : `\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0637\u0644\u0628 \u0627\u0644\u0625\u0631\u062C\u0627\u0639 \u0644\u0644\u0637\u0644\u0628 ${sub.order_number} \u0625\u0644\u0649 ${patch.status}.`
              }
            );
          }
          await this.createNotification(
            tx,
            sub.owner_user_id,
            { en: `Admin return update: ${patch.status}`, ar: `\u062A\u062D\u062F\u064A\u062B \u0625\u062F\u0627\u0631\u064A \u0644\u0644\u0625\u0631\u062C\u0627\u0639: ${patch.status}` },
            {
              en: `Return on ${sub.order_number} resolved as ${patch.status} ($${(refundAmount / 100).toFixed(2)}).`,
              ar: `\u062A\u0645 \u062D\u0633\u0645 \u0637\u0644\u0628 \u0627\u0644\u0625\u0631\u062C\u0627\u0639 \u0644\u0644\u0637\u0644\u0628 ${sub.order_number} (${patch.status}).`
            }
          );
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.resolve_return",
            entityType: "return",
            entityId: returnId,
            before: { status: ret.status, refundUsdCents: ret.refund_usd_cents },
            after: { status: patch.status, refundUsdCents: refundAmount },
            ipAddress
          });
          return tx.queryOne("SELECT * FROM returns WHERE id = ?", [returnId]);
        });
      }
      async adminResolveDispute(disputeId, actorUserId, patch, ipAddress) {
        return this.db.transaction(async (tx) => {
          const disp = await tx.queryOne(
            "SELECT * FROM disputes WHERE id = ?",
            [disputeId]
          );
          if (!disp) throw new Error("Dispute not found.");
          await tx.execute("UPDATE disputes SET status = ?, resolution_note = ? WHERE id = ?", [
            patch.status,
            patch.resolutionNote?.trim() || null,
            disputeId
          ]);
          const sub = await tx.queryOne(
            `SELECT o.order_number, sel.owner_user_id
         FROM sub_orders so
         INNER JOIN orders o ON o.id = so.order_id
         INNER JOIN sellers sel ON sel.id = so.seller_id
         WHERE so.id = ? LIMIT 1`,
            [disp.sub_order_id]
          );
          if (!disp.opened_by_user_id.startsWith("guest:")) {
            await this.createNotification(
              tx,
              disp.opened_by_user_id,
              { en: `Dispute updated (${sub?.order_number || disputeId})`, ar: `\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0646\u0632\u0627\u0639 (${sub?.order_number || disputeId})` },
              { en: `Status: ${patch.status}. ${patch.resolutionNote || ""}`.trim(), ar: `\u0627\u0644\u062D\u0627\u0644\u0629: ${patch.status}. ${patch.resolutionNote || ""}`.trim() }
            );
          }
          if (sub?.owner_user_id) {
            await this.createNotification(
              tx,
              sub.owner_user_id,
              { en: `Dispute updated (${sub.order_number})`, ar: `\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0646\u0632\u0627\u0639 (${sub.order_number})` },
              { en: `Status: ${patch.status}. ${patch.resolutionNote || ""}`.trim(), ar: `\u0627\u0644\u062D\u0627\u0644\u0629: ${patch.status}. ${patch.resolutionNote || ""}`.trim() }
            );
          }
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.resolve_dispute",
            entityType: "dispute",
            entityId: disputeId,
            before: { status: disp.status },
            after: patch,
            ipAddress
          });
          return tx.queryOne("SELECT * FROM disputes WHERE id = ?", [disputeId]);
        });
      }
      async adminModerateReview(reviewId, actorUserId, status, ipAddress) {
        return this.db.transaction(async (tx) => {
          const rev = await tx.queryOne(
            "SELECT id, product_id, seller_id, moderation_status FROM reviews WHERE id = ?",
            [reviewId]
          );
          if (!rev) throw new Error("Review not found.");
          await tx.execute("UPDATE reviews SET moderation_status = ? WHERE id = ?", [status, reviewId]);
          const pStats = await tx.queryOne(
            "SELECT AVG(rating) AS avg_r, COUNT(*) AS cnt FROM reviews WHERE product_id = ? AND moderation_status = 'approved'",
            [rev.product_id]
          );
          await tx.execute("UPDATE products SET rating_avg_x10 = ?, review_count = ? WHERE id = ?", [
            Math.round(Number(pStats?.avg_r || 0) * 10),
            Number(pStats?.cnt || 0),
            rev.product_id
          ]);
          const sStats = await tx.queryOne(
            "SELECT AVG(rating) AS avg_r, COUNT(*) AS cnt FROM reviews WHERE seller_id = ? AND moderation_status = 'approved'",
            [rev.seller_id]
          );
          await tx.execute("UPDATE stores SET rating_avg_x10 = ?, review_count = ? WHERE seller_id = ?", [
            Math.round(Number(sStats?.avg_r || 0) * 10),
            Number(sStats?.cnt || 0),
            rev.seller_id
          ]);
          await writeAuditLog(tx, {
            actorUserId,
            action: "admin.moderate_review",
            entityType: "review",
            entityId: reviewId,
            before: { moderationStatus: rev.moderation_status },
            after: { moderationStatus: status },
            ipAddress
          });
          return { id: reviewId, moderationStatus: status };
        });
      }
      async adminUpdateSupportTicket(ticketId, actorUserId, status, ipAddress) {
        const t = await this.db.queryOne(
          "SELECT id, user_id, subject, status FROM support_tickets WHERE id = ?",
          [ticketId]
        );
        if (!t) throw new Error("Support ticket not found.");
        await this.db.execute("UPDATE support_tickets SET status = ? WHERE id = ?", [status, ticketId]);
        if (t.user_id) {
          await this.createNotification(
            this.db,
            t.user_id,
            { en: `Support ticket ${status}`, ar: `\u062A\u062D\u062F\u064A\u062B \u062A\u0630\u0643\u0631\u0629 \u0627\u0644\u062F\u0639\u0645: ${status}` },
            { en: `${t.subject} is now marked ${status}.`, ar: `\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u0627\u0644\u062A\u0630\u0643\u0631\u0629 "${t.subject}" \u0625\u0644\u0649 ${status}.` }
          );
        }
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.update_support_ticket",
          entityType: "support_ticket",
          entityId: ticketId,
          before: { status: t.status },
          after: { status },
          ipAddress
        });
        return this.db.queryOne("SELECT * FROM support_tickets WHERE id = ?", [ticketId]);
      }
      async adminUpdateDeliveryZone(governorateCode, actorUserId, patch, ipAddress) {
        const existing = await this.db.queryOne("SELECT * FROM delivery_zones WHERE governorate_code = ?", [governorateCode]);
        if (!existing) throw new Error("Delivery zone not found.");
        const nextFee = patch.platformFeeUsdCents !== void 0 ? Math.max(0, Math.trunc(patch.platformFeeUsdCents)) : Number(existing.platform_fee_usd_cents);
        const nextEta = patch.etaDays !== void 0 ? patch.etaDays.trim() : existing.eta_days;
        await this.db.execute("UPDATE delivery_zones SET platform_fee_usd_cents = ?, eta_days = ? WHERE governorate_code = ?", [
          nextFee,
          nextEta,
          governorateCode
        ]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.update_delivery_zone",
          entityType: "delivery_zone",
          entityId: governorateCode,
          after: { platformFeeUsdCents: nextFee, etaDays: nextEta },
          ipAddress
        });
        return {
          governorateCode,
          name: parseJson(existing.name_json, { en: governorateCode, ar: governorateCode }),
          platformFeeUsdCents: nextFee,
          etaDays: nextEta
        };
      }
      async adminUpdateSubscriptionPlan(tier, actorUserId, patch, ipAddress) {
        const existing = await this.db.queryOne("SELECT * FROM subscription_plans WHERE tier = ?", [tier]);
        if (!existing) throw new Error("Subscription plan not found.");
        const nextFee = patch.monthlyFeeUsdCents !== void 0 ? Math.max(0, Math.trunc(patch.monthlyFeeUsdCents)) : Number(existing.monthly_fee_usd_cents);
        const nextLimit = patch.productLimit !== void 0 ? patch.productLimit : existing.product_limit;
        const nextDiscount = patch.commissionDiscountBps !== void 0 ? Math.max(0, Math.min(2e3, Math.trunc(patch.commissionDiscountBps))) : Number(existing.commission_discount_bps);
        await this.db.execute(
          "UPDATE subscription_plans SET monthly_fee_usd_cents = ?, product_limit = ?, commission_discount_bps = ? WHERE tier = ?",
          [nextFee, nextLimit, nextDiscount, tier]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.update_subscription_plan",
          entityType: "subscription_plan",
          entityId: tier,
          after: { monthlyFeeUsdCents: nextFee, productLimit: nextLimit, commissionDiscountBps: nextDiscount },
          ipAddress
        });
        return {
          tier,
          name: parseJson(existing.name_json, { en: tier, ar: tier }),
          monthlyFeeUsdCents: nextFee,
          productLimit: nextLimit === null ? null : Number(nextLimit),
          commissionDiscountBps: nextDiscount,
          features: parseJson(existing.features_json, [])
        };
      }
      async adminUpdateEmailTemplate(key, actorUserId, patch, ipAddress) {
        const kCol = this.keyCol();
        const existing = await this.db.queryOne(`SELECT ${kCol} FROM email_templates WHERE ${kCol} = ?`, [key]);
        if (!existing) throw new Error("Email template not found.");
        const now = toSqlTimestamp();
        await this.db.execute(
          `UPDATE email_templates SET subject_json = ?, body_json = ?, updated_at = ? WHERE ${kCol} = ?`,
          [JSON.stringify(patch.subject), JSON.stringify(patch.body), now, key]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.update_email_template",
          entityType: "email_template",
          entityId: key,
          after: patch,
          ipAddress
        });
        return { key, subject: patch.subject, body: patch.body, updatedAt: now };
      }
      async adminCreatePage(actorUserId, input, ipAddress) {
        const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
        if (cleanSlug.length < 2) throw new Error("Page slug must be at least 2 characters.");
        const dup = await this.db.queryOne("SELECT id FROM pages WHERE slug = ?", [cleanSlug]);
        if (dup) throw new Error(`Page slug "${cleanSlug}" already exists.`);
        const id = `page-${crypto5.randomUUID()}`;
        const now = toSqlTimestamp();
        const title = { en: input.titleEn.trim(), ar: input.titleAr.trim() };
        const body = { en: input.bodyEn, ar: input.bodyAr };
        const pub = input.published === false ? 0 : 1;
        await this.db.execute(
          "INSERT INTO pages (id, slug, title_json, body_json, published, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
          [id, cleanSlug, JSON.stringify(title), JSON.stringify(body), pub, now]
        );
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.create_page",
          entityType: "page",
          entityId: id,
          after: { slug: cleanSlug, published: Boolean(pub) },
          ipAddress
        });
        return { id, slug: cleanSlug, title, body, published: Boolean(pub), updatedAt: now };
      }
      async adminDeletePage(slug, actorUserId, ipAddress) {
        if (["terms", "privacy", "returns", "seller-agreement"].includes(slug)) {
          throw new Error("Core legal pages cannot be deleted.");
        }
        const existing = await this.db.queryOne("SELECT id FROM pages WHERE slug = ?", [slug]);
        if (!existing) throw new Error("Page not found.");
        await this.db.execute("DELETE FROM pages WHERE slug = ?", [slug]);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.delete_page",
          entityType: "page",
          entityId: existing.id,
          after: { slug },
          ipAddress
        });
      }
      async adminListMenus() {
        const rows = await this.db.query(
          "SELECT id, location, items_json FROM menus ORDER BY location ASC"
        );
        return rows.map((r) => ({
          id: r.id,
          location: r.location,
          items: parseJson(r.items_json, [])
        }));
      }
      async adminSaveMenu(location, actorUserId, items, ipAddress) {
        const existing = await this.db.queryOne("SELECT id FROM menus WHERE location = ? LIMIT 1", [location]);
        const id = existing?.id || `menu-${location}`;
        if (existing) {
          await this.db.execute("UPDATE menus SET items_json = ? WHERE id = ?", [JSON.stringify(items), id]);
        } else {
          await this.db.execute("INSERT INTO menus (id, location, items_json) VALUES (?, ?, ?)", [
            id,
            location,
            JSON.stringify(items)
          ]);
        }
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.save_menu",
          entityType: "menu",
          entityId: id,
          after: { location, itemCount: items.length },
          ipAddress
        });
        return { id, location, items };
      }
      async adminUpdateUserAccess(userId, actorUserId, patch, ipAddress) {
        return this.db.transaction(async (tx) => {
          const actor = await tx.queryOne("SELECT role_key FROM users WHERE id = ?", [actorUserId]);
          const target = await tx.queryOne(
            "SELECT id, role_key, is_blocked, email_verified_at, phone_verified_at FROM users WHERE id = ? AND deleted_at IS NULL",
            [userId]
          );
          if (!target) throw new Error("User not found.");
          if (target.role_key === "admin_super" && patch.isBlocked) {
            throw new Error("Cannot deactivate or block a Super Admin account.");
          }
          const now = toSqlTimestamp();
          if (patch.roleKey !== void 0 && patch.roleKey !== target.role_key) {
            if (target.role_key === "admin_super") {
              throw new Error("Super Admin role cannot be reassigned.");
            }
            if (actor?.role_key !== "admin_super") {
              throw new Error("Only Super Admin can change user roles.");
            }
            await tx.execute("UPDATE users SET role_key = ?, updated_at = ? WHERE id = ?", [patch.roleKey, now, userId]);
          }
          if (patch.isBlocked !== void 0) {
            await tx.execute("UPDATE users SET is_blocked = ?, updated_at = ? WHERE id = ?", [
              patch.isBlocked ? 1 : 0,
              now,
              userId
            ]);
            if (patch.isBlocked) {
              await tx.execute("DELETE FROM sessions WHERE user_id = ?", [userId]);
            }
          }
          if (patch.verifyEmail !== void 0) {
            await tx.execute("UPDATE users SET email_verified_at = ?, updated_at = ? WHERE id = ?", [
              patch.verifyEmail ? now : null,
              now,
              userId
            ]);
          }
          if (patch.verifyPhone !== void 0) {
            await tx.execute("UPDATE users SET phone_verified_at = ?, updated_at = ? WHERE id = ?", [
              patch.verifyPhone ? now : null,
              now,
              userId
            ]);
          }
          if (patch.permissions !== void 0) {
            await tx.execute("DELETE FROM user_permissions WHERE user_id = ?", [userId]);
            for (const perm of patch.permissions) {
              await tx.execute("INSERT INTO user_permissions (id, user_id, permission_key) VALUES (?, ?, ?)", [
                `up-${crypto5.randomUUID()}`,
                userId,
                perm
              ]);
            }
          }
          const cleanedReason = patch.reason ? patch.reason.trim().slice(0, 300) : void 0;
          await writeAuditLog(tx, {
            actorUserId,
            action: patch.isBlocked === true ? "admin.deactivate_user" : patch.isBlocked === false ? "admin.reactivate_user" : "admin.update_user_access",
            entityType: "user",
            entityId: userId,
            before: {
              roleKey: target.role_key,
              isBlocked: Boolean(target.is_blocked),
              emailVerified: Boolean(target.email_verified_at),
              phoneVerified: Boolean(target.phone_verified_at)
            },
            after: { ...patch, ...cleanedReason ? { reason: cleanedReason } : {} },
            ipAddress
          });
          const refreshed = await tx.queryOne("SELECT is_blocked, email_verified_at, phone_verified_at FROM users WHERE id = ?", [userId]);
          const emailVerifiedAt = refreshed?.email_verified_at ? String(refreshed.email_verified_at) : null;
          const phoneVerifiedAt = refreshed?.phone_verified_at ? String(refreshed.phone_verified_at) : null;
          return {
            ok: true,
            userId,
            isBlocked: Boolean(refreshed?.is_blocked),
            emailVerifiedAt,
            phoneVerifiedAt,
            isFullyVerified: Boolean(emailVerifiedAt && phoneVerifiedAt)
          };
        });
      }
      async getAdminUserActivity(userId) {
        const userRow = await this.db.queryOne(
          `SELECT id, name, email, phone, role_key, is_blocked, totp_enabled,
              email_verified_at, phone_verified_at, preferred_locale, preferred_currency,
              failed_login_attempts, locked_until, created_at, updated_at
       FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
          [userId]
        );
        if (!userRow) throw new Error("User not found.");
        const [
          permRows,
          sellerRow,
          orderAgg,
          recentOrderRows,
          recentReviewRows,
          reviewCntRow,
          recentTicketRows,
          ticketCntRow,
          sessionCntRow,
          auditRows
        ] = await Promise.all([
          this.db.query("SELECT permission_key FROM user_permissions WHERE user_id = ?", [userId]),
          this.db.queryOne(
            `SELECT sel.id, sel.status, sel.verified, st.slug, st.name_json
         FROM sellers sel INNER JOIN stores st ON st.seller_id = sel.id
         WHERE sel.owner_user_id = ? AND sel.deleted_at IS NULL LIMIT 1`,
            [userId]
          ),
          this.db.queryOne(
            "SELECT COUNT(*) AS cnt, COALESCE(SUM(grand_total_usd_cents), 0) AS total_spent FROM orders WHERE user_id = ?",
            [userId]
          ),
          this.db.query(
            "SELECT id, order_number, grand_total_usd_cents, payment_method, payment_status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 15",
            [userId]
          ),
          this.db.query(
            "SELECT id, product_id, rating, comment, moderation_status, created_at FROM reviews WHERE user_id = ? ORDER BY created_at DESC LIMIT 10",
            [userId]
          ),
          this.db.queryOne("SELECT COUNT(*) AS cnt FROM reviews WHERE user_id = ?", [userId]),
          this.db.query(
            "SELECT id, subject, status, created_at FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC LIMIT 10",
            [userId]
          ),
          this.db.queryOne("SELECT COUNT(*) AS cnt FROM support_tickets WHERE user_id = ?", [userId]),
          this.db.queryOne("SELECT COUNT(*) AS cnt FROM sessions WHERE user_id = ?", [userId]),
          this.db.query(
            `SELECT * FROM audit_log
         WHERE actor_user_id = ? OR (entity_type = 'user' AND entity_id = ?)
         ORDER BY created_at DESC LIMIT 80`,
            [userId, userId]
          )
        ]);
        const emailVerifiedAt = userRow.email_verified_at ? String(userRow.email_verified_at) : null;
        const phoneVerifiedAt = userRow.phone_verified_at ? String(userRow.phone_verified_at) : null;
        const auditEvents = auditRows.map((a) => ({
          id: String(a.id),
          actorUserId: a.actor_user_id ? String(a.actor_user_id) : null,
          action: String(a.action),
          entityType: String(a.entity_type),
          entityId: String(a.entity_id),
          beforeJson: a.before_json ? String(a.before_json) : null,
          afterJson: a.after_json ? String(a.after_json) : null,
          ipAddress: a.ip_address ? String(a.ip_address) : null,
          createdAt: String(a.created_at)
        }));
        return {
          user: {
            id: userRow.id,
            name: userRow.name,
            email: userRow.email,
            phone: userRow.phone,
            roleKey: userRow.role_key,
            isBlocked: Boolean(userRow.is_blocked),
            totpEnabled: Boolean(userRow.totp_enabled),
            emailVerifiedAt,
            phoneVerifiedAt,
            isFullyVerified: Boolean(emailVerifiedAt && phoneVerifiedAt),
            permissions: permRows.map((p) => p.permission_key),
            ordersCount: Number(orderAgg?.cnt ?? 0),
            activeSessionsCount: Number(sessionCntRow?.cnt ?? 0),
            sellerId: sellerRow?.id ?? null,
            sellerName: sellerRow ? parseJson(sellerRow.name_json, { en: sellerRow.slug, ar: sellerRow.slug }).en : null,
            lastActivityAt: auditEvents[0]?.createdAt ?? String(userRow.updated_at),
            createdAt: String(userRow.created_at),
            preferredLocale: userRow.preferred_locale === "ar" ? "ar" : "en",
            preferredCurrency: userRow.preferred_currency === "LBP" ? "LBP" : "USD",
            failedLoginAttempts: Number(userRow.failed_login_attempts ?? 0),
            lockedUntil: userRow.locked_until ? String(userRow.locked_until) : null,
            updatedAt: String(userRow.updated_at),
            seller: sellerRow ? {
              id: sellerRow.id,
              slug: sellerRow.slug,
              name: parseJson(sellerRow.name_json, { en: sellerRow.slug, ar: sellerRow.slug }),
              status: sellerRow.status,
              verified: Boolean(sellerRow.verified)
            } : null
          },
          stats: {
            ordersCount: Number(orderAgg?.cnt ?? 0),
            totalSpentUsdCents: Number(orderAgg?.total_spent ?? 0),
            reviewsCount: Number(reviewCntRow?.cnt ?? 0),
            ticketsCount: Number(ticketCntRow?.cnt ?? 0),
            activeSessionsCount: Number(sessionCntRow?.cnt ?? 0),
            auditEventsCount: auditEvents.length
          },
          recentOrders: recentOrderRows.map((o) => ({
            id: o.id,
            orderNumber: o.order_number,
            grandTotalUsdCents: Number(o.grand_total_usd_cents),
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status,
            createdAt: String(o.created_at)
          })),
          recentReviews: recentReviewRows.map((rv) => ({
            id: rv.id,
            productId: rv.product_id,
            rating: Number(rv.rating),
            comment: rv.comment,
            moderationStatus: rv.moderation_status,
            createdAt: String(rv.created_at)
          })),
          recentTickets: recentTicketRows.map((tk) => ({
            id: tk.id,
            subject: tk.subject,
            status: tk.status,
            createdAt: String(tk.created_at)
          })),
          auditEvents
        };
      }
      // --- Customer <-> Store Owner System Chat ---
      mapChatConversationRow(r) {
        return {
          id: String(r.id),
          sellerId: String(r.seller_id),
          sellerName: parseJson(r.seller_name_json, {
            en: String(r.seller_legal_name || "Store"),
            ar: String(r.seller_legal_name || "\u0627\u0644\u0645\u062A\u062C\u0631")
          }),
          sellerSlug: String(r.seller_slug || ""),
          customerUserId: String(r.customer_user_id),
          customerName: String(r.customer_name),
          productId: r.product_id ? String(r.product_id) : null,
          productTitle: r.product_title_json ? parseJson(r.product_title_json, null) : null,
          status: String(r.status || "open") === "closed" ? "closed" : "open",
          unreadForSeller: Number(r.unread_for_seller || 0),
          unreadForCustomer: Number(r.unread_for_customer || 0),
          lastMessagePreview: r.last_message_preview ? String(r.last_message_preview) : void 0,
          lastMessageAt: String(r.last_message_at),
          createdAt: String(r.created_at)
        };
      }
      assertChatParticipant(conv, user) {
        if (conv.customer_user_id === user.id) return;
        if (user.sellerId && conv.seller_id === user.sellerId) return;
        if (isAdminRole(user.roleKey)) return;
        throw new Error("Forbidden: you do not have access to this conversation.");
      }
      async listChatConversations(user, sellerFilterId) {
        const baseSelect = `
      SELECT c.*, st.name_json AS seller_name_json, st.slug AS seller_slug, sel.legal_name AS seller_legal_name,
             p.title_json AS product_title_json
      FROM chat_conversations c
      INNER JOIN sellers sel ON sel.id = c.seller_id
      INNER JOIN stores st ON st.seller_id = c.seller_id
      LEFT JOIN products p ON p.id = c.product_id
    `;
        let rows;
        if (isAdminRole(user.roleKey) && sellerFilterId) {
          rows = await this.db.query(
            `${baseSelect} WHERE c.seller_id = ? ORDER BY c.last_message_at DESC LIMIT 80`,
            [sellerFilterId]
          );
        } else if (user.sellerId && (!sellerFilterId || sellerFilterId === user.sellerId)) {
          rows = await this.db.query(
            `${baseSelect} WHERE c.seller_id = ? OR c.customer_user_id = ? ORDER BY c.last_message_at DESC LIMIT 80`,
            [user.sellerId, user.id]
          );
        } else {
          rows = await this.db.query(
            `${baseSelect} WHERE c.customer_user_id = ? ORDER BY c.last_message_at DESC LIMIT 80`,
            [user.id]
          );
        }
        return rows.map((r) => this.mapChatConversationRow(r));
      }
      async startOrSendChatConversation(user, input) {
        const cleanBody = input.body.trim();
        if (!cleanBody) throw new Error("Message text is required.");
        if (user.sellerId && user.sellerId === input.sellerId) {
          throw new Error("You cannot start a customer inquiry with your own storefront.");
        }
        const seller = await this.db.queryOne(
          "SELECT id FROM sellers WHERE id = ? AND status = 'approved' AND deleted_at IS NULL",
          [input.sellerId]
        );
        if (!seller) throw new Error("Storefront not found or unavailable.");
        const cleanProdId = input.productId?.trim() || null;
        if (cleanProdId) {
          const prod = await this.db.queryOne(
            "SELECT id FROM products WHERE id = ? AND seller_id = ? AND deleted_at IS NULL",
            [cleanProdId, input.sellerId]
          );
          if (!prod) throw new Error("Product does not belong to this storefront.");
        }
        const now = toSqlTimestamp();
        const preview = cleanBody.slice(0, 180);
        return this.db.transaction(async (tx) => {
          let existing = await tx.queryOne(
            cleanProdId ? "SELECT id FROM chat_conversations WHERE seller_id = ? AND customer_user_id = ? AND product_id = ? LIMIT 1" : "SELECT id FROM chat_conversations WHERE seller_id = ? AND customer_user_id = ? AND product_id IS NULL LIMIT 1",
            cleanProdId ? [input.sellerId, user.id, cleanProdId] : [input.sellerId, user.id]
          );
          let convId = existing?.id;
          if (!convId) {
            convId = `cht-${crypto5.randomUUID()}`;
            await tx.execute(
              `INSERT INTO chat_conversations
             (id, seller_id, customer_user_id, customer_name, product_id, status, unread_for_seller, unread_for_customer, last_message_preview, last_message_at, created_at)
           VALUES (?, ?, ?, ?, ?, 'open', 1, 0, ?, ?, ?)`,
              [convId, input.sellerId, user.id, user.name, cleanProdId, preview, now, now]
            );
          } else {
            await tx.execute(
              `UPDATE chat_conversations
           SET status = 'open', unread_for_seller = unread_for_seller + 1, last_message_preview = ?, last_message_at = ?
           WHERE id = ?`,
              [preview, now, convId]
            );
          }
          const msgId = `msg-${crypto5.randomUUID()}`;
          await tx.execute(
            `INSERT INTO chat_messages (id, conversation_id, sender_role, sender_user_id, body, read_at, created_at)
         VALUES (?, ?, 'customer', ?, ?, NULL, ?)`,
            [msgId, convId, user.id, cleanBody, now]
          );
          const convRow = await tx.queryOne(
            `SELECT c.*, st.name_json AS seller_name_json, st.slug AS seller_slug, sel.legal_name AS seller_legal_name,
                p.title_json AS product_title_json
         FROM chat_conversations c
         INNER JOIN sellers sel ON sel.id = c.seller_id
         INNER JOIN stores st ON st.seller_id = c.seller_id
         LEFT JOIN products p ON p.id = c.product_id
         WHERE c.id = ? LIMIT 1`,
            [convId]
          );
          return {
            conversation: this.mapChatConversationRow(convRow),
            message: {
              id: msgId,
              conversationId: convId,
              senderRole: "customer",
              senderUserId: user.id,
              body: cleanBody,
              readAt: null,
              createdAt: now
            }
          };
        });
      }
      async getChatConversationMessages(conversationId, user) {
        const convRow = await this.db.queryOne(
          `SELECT c.*, st.name_json AS seller_name_json, st.slug AS seller_slug, sel.legal_name AS seller_legal_name,
              p.title_json AS product_title_json
       FROM chat_conversations c
       INNER JOIN sellers sel ON sel.id = c.seller_id
       INNER JOIN stores st ON st.seller_id = c.seller_id
       LEFT JOIN products p ON p.id = c.product_id
       WHERE c.id = ? LIMIT 1`,
          [conversationId]
        );
        if (!convRow) throw new Error("Conversation not found.");
        const conv = this.mapChatConversationRow(convRow);
        this.assertChatParticipant({ customer_user_id: conv.customerUserId, seller_id: conv.sellerId }, user);
        const now = toSqlTimestamp();
        if (conv.customerUserId === user.id && conv.unreadForCustomer > 0) {
          await this.db.execute("UPDATE chat_conversations SET unread_for_customer = 0 WHERE id = ?", [conversationId]);
          await this.db.execute(
            "UPDATE chat_messages SET read_at = ? WHERE conversation_id = ? AND sender_role != 'customer' AND read_at IS NULL",
            [now, conversationId]
          );
          conv.unreadForCustomer = 0;
        } else if (user.sellerId && conv.sellerId === user.sellerId && conv.unreadForSeller > 0) {
          await this.db.execute("UPDATE chat_conversations SET unread_for_seller = 0 WHERE id = ?", [conversationId]);
          await this.db.execute(
            "UPDATE chat_messages SET read_at = ? WHERE conversation_id = ? AND sender_role = 'customer' AND read_at IS NULL",
            [now, conversationId]
          );
          conv.unreadForSeller = 0;
        }
        const msgRows = await this.db.query(
          "SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT 200",
          [conversationId]
        );
        const messages = msgRows.map((m) => ({
          id: String(m.id),
          conversationId: String(m.conversation_id),
          senderRole: String(m.sender_role),
          senderUserId: String(m.sender_user_id),
          body: String(m.body),
          readAt: m.read_at ? String(m.read_at) : null,
          createdAt: String(m.created_at)
        }));
        return { conversation: conv, messages };
      }
      async sendChatMessage(conversationId, user, body) {
        const cleanBody = body.trim();
        if (!cleanBody) throw new Error("Message text is required.");
        const conv = await this.db.queryOne(
          "SELECT id, seller_id, customer_user_id FROM chat_conversations WHERE id = ?",
          [conversationId]
        );
        if (!conv) throw new Error("Conversation not found.");
        this.assertChatParticipant(conv, user);
        const senderRole = user.sellerId && conv.seller_id === user.sellerId || isAdminRole(user.roleKey) && conv.customer_user_id !== user.id ? "seller" : "customer";
        const now = toSqlTimestamp();
        const preview = cleanBody.slice(0, 180);
        const msgId = `msg-${crypto5.randomUUID()}`;
        await this.db.transaction(async (tx) => {
          await tx.execute(
            `INSERT INTO chat_messages (id, conversation_id, sender_role, sender_user_id, body, read_at, created_at)
         VALUES (?, ?, ?, ?, ?, NULL, ?)`,
            [msgId, conversationId, senderRole, user.id, cleanBody, now]
          );
          if (senderRole === "customer") {
            await tx.execute(
              `UPDATE chat_conversations
           SET status = 'open', unread_for_seller = unread_for_seller + 1, last_message_preview = ?, last_message_at = ?
           WHERE id = ?`,
              [preview, now, conversationId]
            );
          } else {
            await tx.execute(
              `UPDATE chat_conversations
           SET status = 'open', unread_for_customer = unread_for_customer + 1, last_message_preview = ?, last_message_at = ?
           WHERE id = ?`,
              [preview, now, conversationId]
            );
          }
        });
        return {
          id: msgId,
          conversationId,
          senderRole,
          senderUserId: user.id,
          body: cleanBody,
          readAt: null,
          createdAt: now
        };
      }
      async updateChatConversationStatus(conversationId, user, status) {
        const conv = await this.db.queryOne(
          "SELECT id, seller_id, customer_user_id FROM chat_conversations WHERE id = ?",
          [conversationId]
        );
        if (!conv) throw new Error("Conversation not found.");
        this.assertChatParticipant(conv, user);
        await this.db.execute("UPDATE chat_conversations SET status = ? WHERE id = ?", [status, conversationId]);
      }
      async releaseHoldsNow(actorUserId, ipAddress) {
        const released = await releaseEligibleEscrowHolds(this.db);
        await writeAuditLog(this.db, {
          actorUserId,
          action: "admin.release_holds",
          entityType: "ledger",
          entityId: "escrow",
          after: { releasedCount: released },
          ipAddress
        });
        return released;
      }
      async logError(route, err) {
        try {
          const msg = err instanceof Error ? err.message : String(err);
          const stack = err instanceof Error ? err.stack || null : null;
          await this.db.execute(
            "INSERT INTO error_log (id, route, message, stack, created_at) VALUES (?, ?, ?, ?, ?)",
            [`err-${crypto5.randomUUID()}`, route.slice(0, 200), msg.slice(0, 1e3), stack?.slice(0, 4e3) || null, toSqlTimestamp()]
          );
        } catch {
        }
      }
    };
  }
});

// server.ts
import "dotenv/config";
import crypto7 from "node:crypto";
import fs3 from "node:fs";
import path3 from "node:path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { z } from "zod";

// server/db/client.ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";

// server/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  addresses: () => addresses,
  attributes: () => attributes,
  auditLog: () => auditLog,
  automationExecutions: () => automationExecutions,
  automationFlows: () => automationFlows,
  banners: () => banners,
  brands: () => brands,
  campaigns: () => campaigns,
  cartItems: () => cartItems,
  carts: () => carts,
  categories: () => categories,
  chatConversations: () => chatConversations,
  chatMessages: () => chatMessages,
  commissionsLog: () => commissionsLog,
  couponRedemptions: () => couponRedemptions,
  coupons: () => coupons,
  customerSegments: () => customerSegments,
  deliveryZones: () => deliveryZones,
  disputes: () => disputes,
  emailCampaigns: () => emailCampaigns,
  emailLog: () => emailLog,
  emailTemplates: () => emailTemplates,
  errorLog: () => errorLog,
  featuredPlacements: () => featuredPlacements,
  flashSaleItems: () => flashSaleItems,
  flashSales: () => flashSales,
  homePageSnapshots: () => homePageSnapshots,
  homeSectionTemplates: () => homeSectionTemplates,
  homeSectionVersions: () => homeSectionVersions,
  homeSections: () => homeSections,
  jobs: () => jobs,
  ledgerEntries: () => ledgerEntries,
  marketingEventsDedup: () => marketingEventsDedup,
  marketingPopups: () => marketingPopups,
  media: () => media,
  menus: () => menus,
  newsletterSubscribers: () => newsletterSubscribers,
  notificationPreferences: () => notificationPreferences,
  notifications: () => notifications,
  offers: () => offers,
  orderItems: () => orderItems,
  orders: () => orders,
  pages: () => pages,
  passwordResets: () => passwordResets,
  payments: () => payments,
  payouts: () => payouts,
  permissions: () => permissions,
  productVariants: () => productVariants,
  products: () => products,
  returnsTable: () => returnsTable,
  reviews: () => reviews,
  rolePermissions: () => rolePermissions,
  roles: () => roles,
  sellerDocuments: () => sellerDocuments,
  sellers: () => sellers,
  sessions: () => sessions,
  settings: () => settings,
  stockMovements: () => stockMovements,
  storeSettings: () => storeSettings,
  stores: () => stores,
  subOrders: () => subOrders,
  subscriptionPlans: () => subscriptionPlans,
  subscriptions: () => subscriptions,
  supportTickets: () => supportTickets,
  translations: () => translations,
  userPermissions: () => userPermissions,
  users: () => users,
  verificationCodes: () => verificationCodes,
  wishlists: () => wishlists
});
import {
  bigint,
  boolean,
  index,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/mysql-core";
var users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 190 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    roleKey: varchar("role_key", { length: 40 }).notNull().default("customer"),
    emailVerifiedAt: timestamp("email_verified_at"),
    phoneVerifiedAt: timestamp("phone_verified_at"),
    totpSecret: varchar("totp_secret", { length: 128 }),
    totpEnabled: boolean("totp_enabled").notNull().default(false),
    preferredLocale: varchar("preferred_locale", { length: 5 }).notNull().default("en"),
    preferredCurrency: varchar("preferred_currency", { length: 5 }).notNull().default("USD"),
    failedLoginAttempts: int("failed_login_attempts").notNull().default(0),
    lockedUntil: timestamp("locked_until"),
    isBlocked: boolean("is_blocked").notNull().default(false),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (t) => [uniqueIndex("uq_users_email").on(t.email), index("idx_users_role").on(t.roleKey)]
);
var roles = mysqlTable("roles", {
  key: varchar("key", { length: 40 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull()
});
var permissions = mysqlTable("permissions", {
  key: varchar("key", { length: 80 }).primaryKey(),
  description: varchar("description", { length: 255 }).notNull()
});
var rolePermissions = mysqlTable(
  "role_permissions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    roleKey: varchar("role_key", { length: 40 }).notNull(),
    permissionKey: varchar("permission_key", { length: 80 }).notNull()
  },
  (t) => [uniqueIndex("uq_role_perm").on(t.roleKey, t.permissionKey)]
);
var userPermissions = mysqlTable(
  "user_permissions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 }).notNull(),
    permissionKey: varchar("permission_key", { length: 80 }).notNull()
  },
  (t) => [uniqueIndex("uq_user_perm").on(t.userId, t.permissionKey)]
);
var sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 }).notNull(),
    tokenHash: varchar("token_hash", { length: 128 }).notNull(),
    csrfToken: varchar("csrf_token", { length: 128 }).notNull(),
    userAgent: varchar("user_agent", { length: 255 }),
    ipAddress: varchar("ip_address", { length: 64 }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => [uniqueIndex("uq_sessions_token_hash").on(t.tokenHash), index("idx_sessions_user").on(t.userId)]
);
var passwordResets = mysqlTable("password_resets", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull(),
  tokenHash: varchar("token_hash", { length: 128 }).notNull(),
  purpose: varchar("purpose", { length: 32 }).notNull().default("password_reset"),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var sellers = mysqlTable(
  "sellers",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    ownerUserId: varchar("owner_user_id", { length: 64 }).notNull(),
    businessType: varchar("business_type", { length: 32 }).notNull().default("individual"),
    legalName: varchar("legal_name", { length: 190 }).notNull(),
    commercialRegRef: varchar("commercial_reg_ref", { length: 120 }).notNull(),
    governorate: varchar("governorate", { length: 64 }).notNull(),
    district: varchar("district", { length: 64 }).notNull(),
    cityAddress: varchar("city_address", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull(),
    whatsappPhone: varchar("whatsapp_phone", { length: 40 }).notNull(),
    status: varchar("status", { length: 32 }).notNull().default("draft"),
    statusReason: text("status_reason"),
    verified: boolean("verified").notNull().default(false),
    customCommissionBps: int("custom_commission_bps"),
    payoutMethod: varchar("payout_method", { length: 24 }).notNull().default("whish"),
    payoutAccount: varchar("payout_account", { length: 190 }).notNull(),
    onboardingStep: int("onboarding_step").notNull().default(1),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (t) => [index("idx_sellers_status").on(t.status), index("idx_sellers_owner").on(t.ownerUserId)]
);
var stores = mysqlTable(
  "stores",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    sellerId: varchar("seller_id", { length: 64 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    nameJson: json("name_json").$type().notNull(),
    taglineJson: json("tagline_json").$type().notNull(),
    aboutJson: json("about_json").$type().notNull(),
    announcementJson: json("announcement_json").$type(),
    departmentSlug: varchar("department_slug", { length: 40 }).notNull(),
    themeId: varchar("theme_id", { length: 40 }).notNull().default("obsidian-ember"),
    logoMediaId: varchar("logo_media_id", { length: 64 }),
    bannerMediaId: varchar("banner_media_id", { length: 64 }),
    locationsJson: json("locations_json").$type(),
    ratingAvg: int("rating_avg_x10").notNull().default(0),
    reviewCount: int("review_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (t) => [uniqueIndex("uq_stores_slug").on(t.slug), uniqueIndex("uq_stores_seller").on(t.sellerId)]
);
var storeSettings = mysqlTable("store_settings", {
  storeId: varchar("store_id", { length: 64 }).primaryKey(),
  deliveryMode: varchar("delivery_mode", { length: 24 }).notNull().default("platform"),
  selfDeliveryFeesJson: json("self_delivery_fees_json").$type().notNull(),
  processingHours: int("processing_hours").notNull().default(24),
  vacationMode: boolean("vacation_mode").notNull().default(false),
  workingHoursJson: json("working_hours_json").$type(),
  returnPolicyJson: json("return_policy_json").$type(),
  socialLinksJson: json("social_links_json").$type(),
  seoTitle: varchar("seo_title", { length: 190 }),
  seoDescription: text("seo_description")
});
var sellerDocuments = mysqlTable("seller_documents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sellerId: varchar("seller_id", { length: 64 }).notNull(),
  docType: varchar("doc_type", { length: 40 }).notNull(),
  mediaId: varchar("media_id", { length: 64 }).notNull(),
  reviewStatus: varchar("review_status", { length: 32 }).notNull().default("pending"),
  reviewerNote: text("reviewer_note"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var categories = mysqlTable(
  "categories",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    parentId: varchar("parent_id", { length: 64 }),
    slug: varchar("slug", { length: 100 }).notNull(),
    department: varchar("department", { length: 40 }).notNull(),
    nameJson: json("name_json").$type().notNull(),
    commissionBps: int("commission_bps"),
    sortOrder: int("sort_order").notNull().default(0),
    active: boolean("active").notNull().default(true)
  },
  (t) => [uniqueIndex("uq_categories_slug").on(t.slug)]
);
var attributes = mysqlTable("attributes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  code: varchar("code", { length: 64 }).notNull(),
  nameJson: json("name_json").$type().notNull(),
  valuesJson: json("values_json").$type().notNull()
});
var brands = mysqlTable("brands", {
  id: varchar("id", { length: 64 }).primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull(),
  nameJson: json("name_json").$type().notNull(),
  active: boolean("active").notNull().default(true)
});
var products = mysqlTable(
  "products",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    sellerId: varchar("seller_id", { length: 64 }).notNull(),
    categoryId: varchar("category_id", { length: 64 }).notNull(),
    brandId: varchar("brand_id", { length: 64 }),
    department: varchar("department", { length: 40 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    titleJson: json("title_json").$type().notNull(),
    subtitleJson: json("subtitle_json").$type().notNull(),
    descriptionJson: json("description_json").$type().notNull(),
    specsJson: json("specs_json").$type().notNull(),
    basePriceUsdCents: int("base_price_usd_cents").notNull(),
    compareAtUsdCents: int("compare_at_usd_cents"),
    sellerCurrency: varchar("seller_currency", { length: 5 }).notNull().default("USD"),
    moderationStatus: varchar("moderation_status", { length: 32 }).notNull().default("pending"),
    published: boolean("published").notNull().default(false),
    featured: boolean("featured").notNull().default(false),
    model3dUrl: varchar("model_3d_url", { length: 255 }),
    ratingAvgX10: int("rating_avg_x10").notNull().default(0),
    reviewCount: int("review_count").notNull().default(0),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (t) => [
    uniqueIndex("uq_products_slug").on(t.slug),
    index("idx_products_seller").on(t.sellerId),
    index("idx_products_dept").on(t.department)
  ]
);
var productVariants = mysqlTable(
  "product_variants",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    productId: varchar("product_id", { length: 64 }).notNull(),
    sku: varchar("sku", { length: 80 }).notNull(),
    size: varchar("size", { length: 40 }),
    color: varchar("color", { length: 64 }).notNull(),
    colorHex: varchar("color_hex", { length: 16 }).notNull(),
    stock: int("stock").notNull().default(0),
    priceDeltaUsdCents: int("price_delta_usd_cents").notNull().default(0)
  },
  (t) => [index("idx_variants_product").on(t.productId)]
);
var media = mysqlTable("media", {
  id: varchar("id", { length: 64 }).primaryKey(),
  ownerUserId: varchar("owner_user_id", { length: 64 }).notNull(),
  entityType: varchar("entity_type", { length: 40 }).notNull(),
  entityId: varchar("entity_id", { length: 64 }),
  folder: varchar("folder", { length: 64 }).notNull().default("general"),
  storageDriver: varchar("storage_driver", { length: 24 }).notNull().default("local"),
  storageKey: varchar("storage_key", { length: 255 }).notNull(),
  publicUrl: varchar("public_url", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 80 }).notNull(),
  sizeBytes: int("size_bytes").notNull(),
  width: int("width"),
  height: int("height"),
  altJson: json("alt_json").$type(),
  focalX: int("focal_x").notNull().default(50),
  focalY: int("focal_y").notNull().default(50),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var stockMovements = mysqlTable("stock_movements", {
  id: varchar("id", { length: 64 }).primaryKey(),
  variantId: varchar("variant_id", { length: 64 }).notNull(),
  delta: int("delta").notNull(),
  reason: varchar("reason", { length: 64 }).notNull(),
  referenceId: varchar("reference_id", { length: 64 }),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var carts = mysqlTable("carts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 }),
  guestToken: varchar("guest_token", { length: 128 }),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var cartItems = mysqlTable("cart_items", {
  id: varchar("id", { length: 64 }).primaryKey(),
  cartId: varchar("cart_id", { length: 64 }).notNull(),
  productId: varchar("product_id", { length: 64 }).notNull(),
  variantId: varchar("variant_id", { length: 64 }).notNull(),
  quantity: int("quantity").notNull()
});
var orders = mysqlTable(
  "orders",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    orderNumber: varchar("order_number", { length: 40 }).notNull(),
    userId: varchar("user_id", { length: 64 }),
    customerName: varchar("customer_name", { length: 160 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 40 }).notNull(),
    governorate: varchar("governorate", { length: 64 }).notNull(),
    district: varchar("district", { length: 64 }).notNull(),
    town: varchar("town", { length: 120 }).notNull(),
    addressNotes: text("address_notes").notNull(),
    paymentMethod: varchar("payment_method", { length: 32 }).notNull(),
    paymentStatus: varchar("payment_status", { length: 32 }).notNull().default("pending"),
    couponCode: varchar("coupon_code", { length: 64 }),
    exchangeRateSnapshot: bigint("exchange_rate_snapshot", { mode: "number" }).notNull(),
    subtotalUsdCents: int("subtotal_usd_cents").notNull(),
    deliveryTotalUsdCents: int("delivery_total_usd_cents").notNull(),
    codFeeUsdCents: int("cod_fee_usd_cents").notNull().default(0),
    discountTotalUsdCents: int("discount_total_usd_cents").notNull().default(0),
    grandTotalUsdCents: int("grand_total_usd_cents").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => [uniqueIndex("uq_orders_number").on(t.orderNumber), index("idx_orders_user").on(t.userId)]
);
var subOrders = mysqlTable(
  "sub_orders",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    orderId: varchar("order_id", { length: 64 }).notNull(),
    sellerId: varchar("seller_id", { length: 64 }).notNull(),
    status: varchar("status", { length: 32 }).notNull().default("pending"),
    deliveryMode: varchar("delivery_mode", { length: 24 }).notNull(),
    deliveryFeeUsdCents: int("delivery_fee_usd_cents").notNull(),
    subtotalUsdCents: int("subtotal_usd_cents").notNull(),
    discountUsdCents: int("discount_usd_cents").notNull().default(0),
    commissionUsdCents: int("commission_usd_cents").notNull(),
    sellerNetUsdCents: int("seller_net_usd_cents").notNull(),
    codCollected: boolean("cod_collected").notNull().default(false),
    courierName: varchar("courier_name", { length: 120 }),
    trackingCode: varchar("tracking_code", { length: 120 }),
    deliveredAt: timestamp("delivered_at"),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (t) => [index("idx_sub_orders_order").on(t.orderId), index("idx_sub_orders_seller").on(t.sellerId)]
);
var orderItems = mysqlTable("order_items", {
  id: varchar("id", { length: 64 }).primaryKey(),
  subOrderId: varchar("sub_order_id", { length: 64 }).notNull(),
  productId: varchar("product_id", { length: 64 }).notNull(),
  variantId: varchar("variant_id", { length: 64 }).notNull(),
  titleSnapshotJson: json("title_snapshot_json").$type().notNull(),
  variantLabel: varchar("variant_label", { length: 120 }).notNull(),
  sku: varchar("sku", { length: 80 }).notNull(),
  quantity: int("quantity").notNull(),
  unitPriceUsdCents: int("unit_price_usd_cents").notNull(),
  lineTotalUsdCents: int("line_total_usd_cents").notNull(),
  commissionBpsSnapshot: int("commission_bps_snapshot").notNull(),
  commissionUsdCents: int("commission_usd_cents").notNull()
});
var payments = mysqlTable("payments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orderId: varchar("order_id", { length: 64 }).notNull(),
  method: varchar("method", { length: 32 }).notNull(),
  gatewayName: varchar("gateway_name", { length: 120 }).notNull(),
  reference: varchar("reference", { length: 160 }),
  amountUsdCents: int("amount_usd_cents").notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  verifiedByUserId: varchar("verified_by_user_id", { length: 64 }),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var ledgerEntries = mysqlTable(
  "ledger_entries",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    sellerId: varchar("seller_id", { length: 64 }).notNull(),
    subOrderId: varchar("sub_order_id", { length: 64 }),
    orderNumber: varchar("order_number", { length: 40 }),
    entryType: varchar("entry_type", { length: 40 }).notNull(),
    direction: varchar("direction", { length: 10 }).notNull(),
    amountUsdCents: int("amount_usd_cents").notNull(),
    availability: varchar("availability", { length: 24 }).notNull().default("pending"),
    note: text("note").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => [index("idx_ledger_seller").on(t.sellerId)]
);
var payouts = mysqlTable("payouts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sellerId: varchar("seller_id", { length: 64 }).notNull(),
  amountUsdCents: int("amount_usd_cents").notNull(),
  method: varchar("method", { length: 24 }).notNull(),
  accountDetails: varchar("account_details", { length: 190 }).notNull(),
  status: varchar("status", { length: 24 }).notNull().default("pending"),
  referenceCode: varchar("reference_code", { length: 120 }),
  settledByUserId: varchar("settled_by_user_id", { length: 64 }),
  settledAt: timestamp("settled_at"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var commissionsLog = mysqlTable("commissions_log", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orderItemId: varchar("order_item_id", { length: 64 }).notNull(),
  sellerId: varchar("seller_id", { length: 64 }).notNull(),
  appliedBps: int("applied_bps").notNull(),
  sourceRule: varchar("source_rule", { length: 40 }).notNull(),
  amountUsdCents: int("amount_usd_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var subscriptionPlans = mysqlTable("subscription_plans", {
  tier: varchar("tier", { length: 32 }).primaryKey(),
  nameJson: json("name_json").$type().notNull(),
  monthlyFeeUsdCents: int("monthly_fee_usd_cents").notNull(),
  productLimit: int("product_limit"),
  commissionDiscountBps: int("commission_discount_bps").notNull().default(0),
  featuresJson: json("features_json").$type().notNull()
});
var subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sellerId: varchar("seller_id", { length: 64 }).notNull(),
  planTier: varchar("plan_tier", { length: 32 }).notNull(),
  status: varchar("status", { length: 24 }).notNull().default("active"),
  nextDueAt: timestamp("next_due_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var coupons = mysqlTable(
  "coupons",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    code: varchar("code", { length: 64 }).notNull(),
    sellerId: varchar("seller_id", { length: 64 }),
    discountType: varchar("discount_type", { length: 24 }).notNull().default("percent"),
    discountValue: int("discount_value").notNull(),
    maxDiscountUsdCents: int("max_discount_usd_cents"),
    minOrderUsdCents: int("min_order_usd_cents").notNull().default(0),
    targetType: varchar("target_type", { length: 32 }).notNull().default("all"),
    targetId: varchar("target_id", { length: 64 }),
    campaignId: varchar("campaign_id", { length: 64 }),
    maxUses: int("max_uses"),
    perCustomerLimit: int("per_customer_limit").notNull().default(1),
    usedCount: int("used_count").notNull().default(0),
    firstOrderOnly: boolean("first_order_only").notNull().default(false),
    autoGeneratedBatch: varchar("auto_generated_batch", { length: 64 }),
    startsAt: timestamp("starts_at"),
    endsAt: timestamp("ends_at"),
    active: boolean("active").notNull().default(true)
  },
  (t) => [uniqueIndex("uq_coupons_code").on(t.code)]
);
var couponRedemptions = mysqlTable(
  "coupon_redemptions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    couponId: varchar("coupon_id", { length: 64 }).notNull(),
    userId: varchar("user_id", { length: 64 }),
    customerPhoneNorm: varchar("customer_phone_norm", { length: 40 }).notNull(),
    orderId: varchar("order_id", { length: 64 }).notNull(),
    discountUsdCents: int("discount_usd_cents").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => [index("idx_coupon_redemptions_lookup").on(t.couponId, t.userId, t.customerPhoneNorm)]
);
var offers = mysqlTable("offers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sellerId: varchar("seller_id", { length: 64 }),
  titleJson: json("title_json").$type().notNull(),
  offerType: varchar("offer_type", { length: 32 }).notNull(),
  discountValue: int("discount_value").notNull(),
  targetType: varchar("target_type", { length: 32 }).notNull(),
  targetId: varchar("target_id", { length: 64 }),
  stackingRule: varchar("stacking_rule", { length: 24 }).notNull().default("best_only"),
  fundingSource: varchar("funding_source", { length: 24 }).notNull().default("platform"),
  fundingPlatformBps: int("funding_platform_bps").notNull().default(1e4),
  campaignId: varchar("campaign_id", { length: 64 }),
  priority: int("priority").notNull().default(10),
  rulesJson: json("rules_json").$type(),
  approvalStatus: varchar("approval_status", { length: 24 }).notNull().default("pending"),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  active: boolean("active").notNull().default(true)
});
var flashSales = mysqlTable(
  "flash_sales",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    titleJson: json("title_json").$type().notNull(),
    bgToken: varchar("bg_token", { length: 32 }).notNull().default("ember"),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),
    status: varchar("status", { length: 24 }).notNull().default("scheduled"),
    autoRevert: boolean("auto_revert").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => [uniqueIndex("uq_flash_sales_slug").on(t.slug)]
);
var flashSaleItems = mysqlTable(
  "flash_sale_items",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    flashSaleId: varchar("flash_sale_id", { length: 64 }).notNull(),
    productId: varchar("product_id", { length: 64 }).notNull(),
    salePriceUsdCents: int("sale_price_usd_cents").notNull(),
    discountPercent: int("discount_percent").notNull(),
    stockCap: int("stock_cap").notNull().default(0),
    claimedCount: int("claimed_count").notNull().default(0)
  },
  (t) => [index("idx_flash_items_sale").on(t.flashSaleId)]
);
var campaigns = mysqlTable(
  "campaigns",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    titleJson: json("title_json").$type().notNull(),
    subtitleJson: json("subtitle_json").$type().notNull(),
    descriptionJson: json("description_json").$type().notNull(),
    heroImageUrl: varchar("hero_image_url", { length: 500 }),
    bgToken: varchar("bg_token", { length: 32 }).notNull().default("ember"),
    startsAt: timestamp("starts_at"),
    endsAt: timestamp("ends_at"),
    status: varchar("status", { length: 24 }).notNull().default("draft"),
    featuredOfferIdsJson: json("featured_offer_ids_json").$type().notNull(),
    featuredCouponCodesJson: json("featured_coupon_codes_json").$type().notNull(),
    featuredFlashSaleId: varchar("featured_flash_sale_id", { length: 64 }),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => [uniqueIndex("uq_campaigns_slug").on(t.slug)]
);
var banners = mysqlTable("banners", {
  id: varchar("id", { length: 64 }).primaryKey(),
  titleJson: json("title_json").$type().notNull(),
  bgToken: varchar("bg_token", { length: 32 }).notNull().default("graphite"),
  targetUrl: varchar("target_url", { length: 255 }).notNull(),
  pagesJson: json("pages_json").$type().notNull(),
  placement: varchar("placement", { length: 32 }).notNull().default("page_strip"),
  imageUrl: varchar("image_url", { length: 500 }),
  dismissible: boolean("dismissible").notNull().default(true),
  audience: varchar("audience", { length: 32 }).notNull().default("all"),
  deviceTarget: varchar("device_target", { length: 24 }).notNull().default("all"),
  categorySlug: varchar("category_slug", { length: 120 }),
  priority: int("priority").notNull().default(0),
  impressions: int("impressions").notNull().default(0),
  clicks: int("clicks").notNull().default(0),
  botFilteredCount: int("bot_filtered_count").notNull().default(0),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  active: boolean("active").notNull().default(true)
});
var marketingPopups = mysqlTable("marketing_popups", {
  id: varchar("id", { length: 64 }).primaryKey(),
  titleJson: json("title_json").$type().notNull(),
  bodyJson: json("body_json").$type().notNull(),
  ctaLabelJson: json("cta_label_json").$type().notNull(),
  targetUrl: varchar("target_url", { length: 255 }).notNull().default("/catalog"),
  imageUrl: varchar("image_url", { length: 500 }),
  bgToken: varchar("bg_token", { length: 32 }).notNull().default("ember"),
  popupType: varchar("popup_type", { length: 32 }).notNull().default("promo"),
  triggerType: varchar("trigger_type", { length: 32 }).notNull().default("delay_seconds"),
  triggerValue: int("trigger_value").notNull().default(5),
  frequencyCap: varchar("frequency_cap", { length: 32 }).notNull().default("once_per_day"),
  pagesJson: json("pages_json").$type().notNull(),
  audience: varchar("audience", { length: 32 }).notNull().default("all"),
  deviceTarget: varchar("device_target", { length: 24 }).notNull().default("all"),
  showNewsletterForm: boolean("show_newsletter_form").notNull().default(false),
  couponCode: varchar("coupon_code", { length: 64 }),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  active: boolean("active").notNull().default(true),
  impressions: int("impressions").notNull().default(0),
  conversions: int("conversions").notNull().default(0),
  dismissals: int("dismissals").notNull().default(0),
  botFilteredCount: int("bot_filtered_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var featuredPlacements = mysqlTable("featured_placements", {
  id: varchar("id", { length: 64 }).primaryKey(),
  slotKey: varchar("slot_key", { length: 64 }).notNull(),
  targetType: varchar("target_type", { length: 24 }).notNull(),
  targetId: varchar("target_id", { length: 64 }).notNull(),
  sellerId: varchar("seller_id", { length: 64 }).notNull(),
  badgeJson: json("badge_json").$type().notNull(),
  priority: int("priority").notNull().default(10),
  feeUsdCents: int("fee_usd_cents").notNull().default(0),
  ledgerCharged: boolean("ledger_charged").notNull().default(false),
  ledgerEntryId: varchar("ledger_entry_id", { length: 64 }),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  active: boolean("active").notNull().default(true),
  impressions: int("impressions").notNull().default(0),
  clicks: int("clicks").notNull().default(0),
  botFilteredCount: int("bot_filtered_count").notNull().default(0),
  createdByUserId: varchar("created_by_user_id", { length: 64 }),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var marketingEventsDedup = mysqlTable(
  "marketing_events_dedup",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    entityKind: varchar("entity_kind", { length: 24 }).notNull(),
    entityId: varchar("entity_id", { length: 64 }).notNull(),
    eventType: varchar("event_type", { length: 24 }).notNull(),
    visitorHash: varchar("visitor_hash", { length: 64 }).notNull(),
    bucketKey: varchar("bucket_key", { length: 32 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => [
    uniqueIndex("uq_mkt_event_dedup").on(t.entityKind, t.entityId, t.eventType, t.visitorHash, t.bucketKey)
  ]
);
var homeSections = mysqlTable("home_sections", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sectionType: varchar("section_type", { length: 40 }).notNull(),
  titleJson: json("title_json").$type().notNull(),
  contentJson: json("content_json").$type().notNull(),
  sortOrder: int("sort_order").notNull().default(0),
  status: varchar("status", { length: 24 }).notNull().default("draft"),
  visible: boolean("visible").notNull().default(true),
  audience: varchar("audience", { length: 32 }).notNull().default("all"),
  targetingJson: json("targeting_json").$type(),
  styleJson: json("style_json").$type(),
  schedulePriority: int("schedule_priority").notNull().default(0),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  version: int("version").notNull().default(1),
  updatedByUserId: varchar("updated_by_user_id", { length: 64 }),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var homeSectionVersions = mysqlTable("home_section_versions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sectionId: varchar("section_id", { length: 64 }).notNull(),
  version: int("version").notNull(),
  changeNote: varchar("change_note", { length: 255 }),
  snapshotJson: json("snapshot_json").$type().notNull(),
  editedByUserId: varchar("edited_by_user_id", { length: 64 }),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var homeSectionTemplates = mysqlTable("home_section_templates", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nameJson: json("name_json").$type().notNull(),
  descriptionJson: json("description_json").$type().notNull(),
  sectionType: varchar("section_type", { length: 40 }).notNull(),
  contentJson: json("content_json").$type().notNull(),
  styleJson: json("style_json").$type(),
  isSystem: boolean("is_system").notNull().default(false),
  createdByUserId: varchar("created_by_user_id", { length: 64 }),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var homePageSnapshots = mysqlTable("home_page_snapshots", {
  id: varchar("id", { length: 64 }).primaryKey(),
  version: int("version").notNull(),
  status: varchar("status", { length: 24 }).notNull().default("published"),
  changeNote: varchar("change_note", { length: 255 }),
  sectionsSnapshotJson: json("sections_snapshot_json").$type().notNull(),
  chromeSnapshotJson: json("chrome_snapshot_json").$type().notNull(),
  scheduledPublishAt: timestamp("scheduled_publish_at"),
  publishedAt: timestamp("published_at"),
  createdByUserId: varchar("created_by_user_id", { length: 64 }),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var newsletterSubscribers = mysqlTable(
  "newsletter_subscribers",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    email: varchar("email", { length: 190 }).notNull(),
    locale: varchar("locale", { length: 5 }).notNull().default("en"),
    source: varchar("source", { length: 64 }).notNull().default("home"),
    status: varchar("status", { length: 24 }).notNull().default("subscribed"),
    unsubscribeToken: varchar("unsubscribe_token", { length: 96 }).notNull(),
    consentedAt: timestamp("consented_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => [uniqueIndex("uq_newsletter_email").on(t.email)]
);
var pages = mysqlTable(
  "pages",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    titleJson: json("title_json").$type().notNull(),
    bodyJson: json("body_json").$type().notNull(),
    published: boolean("published").notNull().default(true),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (t) => [uniqueIndex("uq_pages_slug").on(t.slug)]
);
var menus = mysqlTable("menus", {
  id: varchar("id", { length: 64 }).primaryKey(),
  location: varchar("location", { length: 32 }).notNull(),
  itemsJson: json("items_json").$type().notNull()
});
var reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 64 }).primaryKey(),
  productId: varchar("product_id", { length: 64 }).notNull(),
  sellerId: varchar("seller_id", { length: 64 }).notNull(),
  userId: varchar("user_id", { length: 64 }).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment").notNull(),
  verifiedBuyer: boolean("verified_buyer").notNull().default(true),
  sellerReply: text("seller_reply"),
  moderationStatus: varchar("moderation_status", { length: 24 }).notNull().default("approved"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var wishlists = mysqlTable(
  "wishlists",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 }).notNull(),
    productId: varchar("product_id", { length: 64 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => [uniqueIndex("uq_wishlist_user_prod").on(t.userId, t.productId)]
);
var addresses = mysqlTable("addresses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull(),
  label: varchar("label", { length: 80 }).notNull(),
  governorate: varchar("governorate", { length: 64 }).notNull(),
  district: varchar("district", { length: 64 }).notNull(),
  town: varchar("town", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  notes: text("notes"),
  isDefault: boolean("is_default").notNull().default(false)
});
var notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull(),
  category: varchar("category", { length: 32 }).notNull().default("system"),
  titleJson: json("title_json").$type().notNull(),
  bodyJson: json("body_json").$type().notNull(),
  actionUrl: varchar("action_url", { length: 255 }),
  metadataJson: json("metadata_json").$type(),
  emailedAt: timestamp("emailed_at"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var notificationPreferences = mysqlTable("notification_preferences", {
  userId: varchar("user_id", { length: 64 }).primaryKey(),
  emailSummaryEnabled: boolean("email_summary_enabled").notNull().default(true),
  summaryFrequency: varchar("summary_frequency", { length: 16 }).notNull().default("daily"),
  orderUpdates: boolean("order_updates").notNull().default(true),
  priceDrops: boolean("price_drops").notNull().default(true),
  promotionalOffers: boolean("promotional_offers").notNull().default(true),
  lastSummarySentAt: timestamp("last_summary_sent_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var emailTemplates = mysqlTable("email_templates", {
  key: varchar("key", { length: 64 }).primaryKey(),
  subjectJson: json("subject_json").$type().notNull(),
  bodyJson: json("body_json").$type().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var emailLog = mysqlTable("email_log", {
  id: varchar("id", { length: 64 }).primaryKey(),
  recipientEmail: varchar("recipient_email", { length: 190 }).notNull(),
  templateKey: varchar("template_key", { length: 64 }).notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var supportTickets = mysqlTable("support_tickets", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 }),
  email: varchar("email", { length: 190 }).notNull(),
  subject: varchar("subject", { length: 190 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 24 }).notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var disputes = mysqlTable("disputes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  subOrderId: varchar("sub_order_id", { length: 64 }).notNull(),
  openedByUserId: varchar("opened_by_user_id", { length: 64 }).notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 24 }).notNull().default("open"),
  resolutionNote: text("resolution_note"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var returnsTable = mysqlTable("returns", {
  id: varchar("id", { length: 64 }).primaryKey(),
  subOrderId: varchar("sub_order_id", { length: 64 }).notNull(),
  userId: varchar("user_id", { length: 64 }).notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 24 }).notNull().default("requested"),
  refundUsdCents: int("refund_usd_cents").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var auditLog = mysqlTable("audit_log", {
  id: varchar("id", { length: 64 }).primaryKey(),
  actorUserId: varchar("actor_user_id", { length: 64 }),
  action: varchar("action", { length: 80 }).notNull(),
  entityType: varchar("entity_type", { length: 64 }).notNull(),
  entityId: varchar("entity_id", { length: 64 }).notNull(),
  beforeJson: json("before_json"),
  afterJson: json("after_json"),
  ipAddress: varchar("ip_address", { length: 64 }),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var settings = mysqlTable("settings", {
  key: varchar("key", { length: 80 }).primaryKey(),
  valueJson: json("value_json").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var translations = mysqlTable("translations", {
  key: varchar("key", { length: 120 }).primaryKey(),
  en: text("en").notNull(),
  ar: text("ar").notNull()
});
var deliveryZones = mysqlTable("delivery_zones", {
  governorateCode: varchar("governorate_code", { length: 64 }).primaryKey(),
  nameJson: json("name_json").$type().notNull(),
  platformFeeUsdCents: int("platform_fee_usd_cents").notNull(),
  etaDays: varchar("eta_days", { length: 32 }).notNull()
});
var jobs = mysqlTable("jobs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  jobType: varchar("job_type", { length: 64 }).notNull(),
  payloadJson: json("payload_json").notNull(),
  status: varchar("status", { length: 24 }).notNull().default("queued"),
  attempts: int("attempts").notNull().default(0),
  runAt: timestamp("run_at").notNull().defaultNow(),
  lastError: text("last_error"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var errorLog = mysqlTable("error_log", {
  id: varchar("id", { length: 64 }).primaryKey(),
  route: varchar("route", { length: 190 }).notNull(),
  message: text("message").notNull(),
  stack: text("stack"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var customerSegments = mysqlTable("customer_segments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nameJson: json("name_json").$type().notNull(),
  description: varchar("description", { length: 400 }).notNull().default(""),
  rulesJson: json("rules_json").$type().notNull(),
  cachedMemberCount: int("cached_member_count").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var emailCampaigns = mysqlTable("email_campaigns", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  subjectJson: json("subject_json").$type().notNull(),
  previewTextJson: json("preview_text_json").$type().notNull(),
  segmentId: varchar("segment_id", { length: 64 }),
  blocksJson: json("blocks_json").$type().notNull(),
  status: varchar("status", { length: 24 }).notNull().default("draft"),
  scheduledAt: timestamp("scheduled_at"),
  sentCount: int("sent_count").notNull().default(0),
  failedCount: int("failed_count").notNull().default(0),
  unsubscribedCount: int("unsubscribed_count").notNull().default(0),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var automationFlows = mysqlTable("automation_flows", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nameJson: json("name_json").$type().notNull(),
  triggerType: varchar("trigger_type", { length: 40 }).notNull(),
  delayHours: int("delay_hours").notNull().default(0),
  subjectJson: json("subject_json").$type().notNull(),
  blocksJson: json("blocks_json").$type().notNull(),
  attachCouponCode: varchar("attach_coupon_code", { length: 64 }),
  active: boolean("active").notNull().default(true),
  totalTriggered: int("total_triggered").notNull().default(0),
  totalSent: int("total_sent").notNull().default(0),
  lastRunAt: timestamp("last_run_at"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var automationExecutions = mysqlTable(
  "automation_executions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    flowId: varchar("flow_id", { length: 64 }).notNull(),
    dedupKey: varchar("dedup_key", { length: 160 }).notNull(),
    recipientEmail: varchar("recipient_email", { length: 190 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => [uniqueIndex("uq_automation_flow_dedup").on(t.flowId, t.dedupKey)]
);
var verificationCodes = mysqlTable(
  "verification_codes",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 }).notNull(),
    channel: varchar("channel", { length: 16 }).notNull(),
    // 'email' | 'phone'
    target: varchar("target", { length: 190 }).notNull(),
    purpose: varchar("purpose", { length: 32 }).notNull().default("verify_contact"),
    codeHash: varchar("code_hash", { length: 128 }).notNull(),
    attempts: int("attempts").notNull().default(0),
    expiresAt: timestamp("expires_at").notNull(),
    consumedAt: timestamp("consumed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => [index("idx_verif_user_channel").on(t.userId, t.channel)]
);
var chatConversations = mysqlTable(
  "chat_conversations",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    sellerId: varchar("seller_id", { length: 64 }).notNull(),
    customerUserId: varchar("customer_user_id", { length: 64 }).notNull(),
    customerName: varchar("customer_name", { length: 160 }).notNull(),
    productId: varchar("product_id", { length: 64 }),
    status: varchar("status", { length: 24 }).notNull().default("open"),
    unreadForSeller: int("unread_for_seller").notNull().default(0),
    unreadForCustomer: int("unread_for_customer").notNull().default(0),
    lastMessagePreview: varchar("last_message_preview", { length: 240 }),
    lastMessageAt: timestamp("last_message_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => [
    index("idx_chat_conv_seller").on(t.sellerId),
    index("idx_chat_conv_customer").on(t.customerUserId)
  ]
);
var chatMessages = mysqlTable(
  "chat_messages",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    conversationId: varchar("conversation_id", { length: 64 }).notNull(),
    senderRole: varchar("sender_role", { length: 24 }).notNull(),
    // 'customer' | 'seller' | 'admin'
    senderUserId: varchar("sender_user_id", { length: 64 }).notNull(),
    body: text("body").notNull(),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => [index("idx_chat_msg_conv").on(t.conversationId)]
);

// server/db/client.ts
function getPersistentStorageDir() {
  const configured = (process.env.STORAGE_DIR || "").trim();
  if (configured) return path.resolve(configured);
  return path.resolve(os.homedir(), ".nilelink-persistent");
}
function buildMysqlConnectionUri() {
  const direct = (process.env.DATABASE_URL || "").trim();
  if (direct && !direct.includes("u123456789_user:password@")) {
    return direct;
  }
  const host = (process.env.DB_HOST || "").trim();
  const user = (process.env.DB_USER || "").trim();
  const password = process.env.DB_PASSWORD || "";
  const database = (process.env.DB_NAME || "").trim();
  const port = (process.env.DB_PORT || "3306").trim();
  if (host && user && database) {
    const safeHost = host === "localhost" ? "127.0.0.1" : host;
    return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${safeHost}:${port}/${encodeURIComponent(database)}`;
  }
  return null;
}
var MysqlClient = class {
  constructor(uri) {
    this.uri = uri;
    this.driver = "mysql";
    this.pool = mysql.createPool({
      uri,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: false
    });
  }
  async init() {
    const orm = drizzle(this.pool, { schema: schema_exports, mode: "default" });
    const migrationsFolder = path.resolve(process.cwd(), "drizzle/migrations");
    if (fs.existsSync(migrationsFolder)) {
      await migrate(orm, { migrationsFolder });
    }
    await this.pool.execute(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        channel VARCHAR(16) NOT NULL,
        target VARCHAR(190) NOT NULL,
        purpose VARCHAR(32) NOT NULL DEFAULT 'verify_contact',
        code_hash VARCHAR(128) NOT NULL,
        attempts INT NOT NULL DEFAULT 0,
        expires_at TIMESTAMP NOT NULL,
        consumed_at TIMESTAMP NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_verif_user_channel (user_id, channel)
      )
    `);
    await this.pool.execute(`
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id VARCHAR(64) PRIMARY KEY,
        seller_id VARCHAR(64) NOT NULL,
        customer_user_id VARCHAR(64) NOT NULL,
        customer_name VARCHAR(160) NOT NULL,
        product_id VARCHAR(64) NULL,
        status VARCHAR(24) NOT NULL DEFAULT 'open',
        unread_for_seller INT NOT NULL DEFAULT 0,
        unread_for_customer INT NOT NULL DEFAULT 0,
        last_message_preview VARCHAR(240) NULL,
        last_message_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_chat_conv_seller (seller_id),
        INDEX idx_chat_conv_customer (customer_user_id)
      )
    `);
    await this.pool.execute(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR(64) PRIMARY KEY,
        conversation_id VARCHAR(64) NOT NULL,
        sender_role VARCHAR(24) NOT NULL,
        sender_user_id VARCHAR(64) NOT NULL,
        body TEXT NOT NULL,
        read_at TIMESTAMP NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_chat_msg_conv (conversation_id)
      )
    `);
    await this.pool.execute(`
      CREATE TABLE IF NOT EXISTS notification_preferences (
        user_id VARCHAR(64) PRIMARY KEY,
        email_summary_enabled BOOLEAN NOT NULL DEFAULT TRUE,
        summary_frequency VARCHAR(16) NOT NULL DEFAULT 'daily',
        order_updates BOOLEAN NOT NULL DEFAULT TRUE,
        price_drops BOOLEAN NOT NULL DEFAULT TRUE,
        promotional_offers BOOLEAN NOT NULL DEFAULT TRUE,
        last_summary_sent_at TIMESTAMP NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    const ensureMysqlCol = async (table, col, defSql) => {
      const [rows] = await this.pool.execute(
        `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [table, col]
      );
      const list = rows;
      if (!list[0] || Number(list[0].cnt) === 0) {
        await this.pool.execute(`ALTER TABLE ${table} ADD COLUMN ${col} ${defSql}`);
      }
    };
    await ensureMysqlCol("notifications", "category", "VARCHAR(32) NOT NULL DEFAULT 'system'");
    await ensureMysqlCol("notifications", "action_url", "VARCHAR(255) NULL");
    await ensureMysqlCol("notifications", "metadata_json", "JSON NULL");
    await ensureMysqlCol("notifications", "emailed_at", "TIMESTAMP NULL");
  }
  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }
  async queryOne(sql, params = []) {
    const rows = await this.query(sql, params);
    return rows[0] ?? null;
  }
  async execute(sql, params = []) {
    const [res] = await this.pool.execute(sql, params);
    const header = res;
    return { affectedRows: header.affectedRows ?? 0 };
  }
  async transaction(fn) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      const tx = {
        async query(sql, params = []) {
          const [rows] = await conn.execute(sql, params);
          return rows;
        },
        async queryOne(sql, params = []) {
          const [rows] = await conn.execute(sql, params);
          const list = rows;
          return list[0] ?? null;
        },
        async execute(sql, params = []) {
          const [res] = await conn.execute(sql, params);
          const header = res;
          return { affectedRows: header.affectedRows ?? 0 };
        }
      };
      const result = await fn(tx);
      await conn.commit();
      return result;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
  async close() {
    await this.pool.end();
  }
};
var SqlitePreviewClient = class {
  constructor() {
    this.driver = "sqlite-preview";
    this.sqliteDb = null;
    this.txLock = Promise.resolve();
  }
  async init() {
    const { DatabaseSync } = await import("node:sqlite");
    const dir = getPersistentStorageDir();
    fs.mkdirSync(dir, { recursive: true });
    const dbFile = path.join(dir, "nilelink-preview.sqlite");
    const sqlite = new DatabaseSync(dbFile);
    sqlite.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
    this.createSqliteTables(sqlite);
    this.sqliteDb = sqlite;
  }
  createSqliteTables(sqlite) {
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT NOT NULL,
        password_hash TEXT NOT NULL, role_key TEXT NOT NULL DEFAULT 'customer',
        email_verified_at TEXT, phone_verified_at TEXT, totp_secret TEXT, totp_enabled INTEGER NOT NULL DEFAULT 0,
        preferred_locale TEXT NOT NULL DEFAULT 'en', preferred_currency TEXT NOT NULL DEFAULT 'USD',
        failed_login_attempts INTEGER NOT NULL DEFAULT 0, locked_until TEXT,
        is_blocked INTEGER NOT NULL DEFAULT 0, deleted_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS roles (key TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS permissions (key TEXT PRIMARY KEY, description TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS role_permissions (id TEXT PRIMARY KEY, role_key TEXT NOT NULL, permission_key TEXT NOT NULL, UNIQUE(role_key, permission_key));
      CREATE TABLE IF NOT EXISTS user_permissions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, permission_key TEXT NOT NULL, UNIQUE(user_id, permission_key));
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY, user_id TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE, csrf_token TEXT NOT NULL,
        user_agent TEXT, ip_address TEXT, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS password_resets (
        id TEXT PRIMARY KEY, user_id TEXT NOT NULL, token_hash TEXT NOT NULL, purpose TEXT NOT NULL DEFAULT 'password_reset',
        expires_at TEXT NOT NULL, used_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS sellers (
        id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL, business_type TEXT NOT NULL DEFAULT 'individual',
        legal_name TEXT NOT NULL, commercial_reg_ref TEXT NOT NULL, governorate TEXT NOT NULL, district TEXT NOT NULL,
        city_address TEXT NOT NULL, phone TEXT NOT NULL, whatsapp_phone TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft', status_reason TEXT, verified INTEGER NOT NULL DEFAULT 0,
        custom_commission_bps INTEGER, payout_method TEXT NOT NULL DEFAULT 'whish', payout_account TEXT NOT NULL,
        onboarding_step INTEGER NOT NULL DEFAULT 1, deleted_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS stores (
        id TEXT PRIMARY KEY, seller_id TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE,
        name_json TEXT NOT NULL, tagline_json TEXT NOT NULL, about_json TEXT NOT NULL, announcement_json TEXT,
        department_slug TEXT NOT NULL, theme_id TEXT NOT NULL DEFAULT 'obsidian-ember',
        logo_media_id TEXT, banner_media_id TEXT, locations_json TEXT, rating_avg_x10 INTEGER NOT NULL DEFAULT 0, review_count INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS store_settings (
        store_id TEXT PRIMARY KEY, delivery_mode TEXT NOT NULL DEFAULT 'platform',
        self_delivery_fees_json TEXT NOT NULL, processing_hours INTEGER NOT NULL DEFAULT 24,
        vacation_mode INTEGER NOT NULL DEFAULT 0, working_hours_json TEXT, return_policy_json TEXT,
        social_links_json TEXT, seo_title TEXT, seo_description TEXT
      );
      CREATE TABLE IF NOT EXISTS seller_documents (
        id TEXT PRIMARY KEY, seller_id TEXT NOT NULL, doc_type TEXT NOT NULL, media_id TEXT NOT NULL,
        review_status TEXT NOT NULL DEFAULT 'pending', reviewer_note TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY, parent_id TEXT, slug TEXT NOT NULL UNIQUE, department TEXT NOT NULL,
        name_json TEXT NOT NULL, commission_bps INTEGER, sort_order INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS attributes (id TEXT PRIMARY KEY, code TEXT NOT NULL, name_json TEXT NOT NULL, values_json TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS brands (id TEXT PRIMARY KEY, slug TEXT NOT NULL, name_json TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1);
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY, seller_id TEXT NOT NULL, category_id TEXT NOT NULL, brand_id TEXT,
        department TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, title_json TEXT NOT NULL, subtitle_json TEXT NOT NULL,
        description_json TEXT NOT NULL, specs_json TEXT NOT NULL, base_price_usd_cents INTEGER NOT NULL,
        compare_at_usd_cents INTEGER, seller_currency TEXT NOT NULL DEFAULT 'USD',
        moderation_status TEXT NOT NULL DEFAULT 'pending', published INTEGER NOT NULL DEFAULT 0,
        featured INTEGER NOT NULL DEFAULT 0, model_3d_url TEXT, rating_avg_x10 INTEGER NOT NULL DEFAULT 0,
        review_count INTEGER NOT NULL DEFAULT 0, deleted_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS product_variants (
        id TEXT PRIMARY KEY, product_id TEXT NOT NULL, sku TEXT NOT NULL, size TEXT,
        color TEXT NOT NULL, color_hex TEXT NOT NULL, stock INTEGER NOT NULL DEFAULT 0, price_delta_usd_cents INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
        folder TEXT NOT NULL DEFAULT 'general',
        storage_driver TEXT NOT NULL DEFAULT 'local', storage_key TEXT NOT NULL, public_url TEXT NOT NULL,
        mime_type TEXT NOT NULL, size_bytes INTEGER NOT NULL, width INTEGER, height INTEGER,
        alt_json TEXT, focal_x INTEGER NOT NULL DEFAULT 50, focal_y INTEGER NOT NULL DEFAULT 50,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS stock_movements (
        id TEXT PRIMARY KEY, variant_id TEXT NOT NULL, delta INTEGER NOT NULL, reason TEXT NOT NULL,
        reference_id TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS carts (id TEXT PRIMARY KEY, user_id TEXT, guest_token TEXT, updated_at TEXT NOT NULL DEFAULT (datetime('now')));
      CREATE TABLE IF NOT EXISTS cart_items (id TEXT PRIMARY KEY, cart_id TEXT NOT NULL, product_id TEXT NOT NULL, variant_id TEXT NOT NULL, quantity INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY, order_number TEXT NOT NULL UNIQUE, user_id TEXT,
        customer_name TEXT NOT NULL, customer_phone TEXT NOT NULL, governorate TEXT NOT NULL,
        district TEXT NOT NULL, town TEXT NOT NULL, address_notes TEXT NOT NULL,
        payment_method TEXT NOT NULL, payment_status TEXT NOT NULL DEFAULT 'pending', coupon_code TEXT,
        exchange_rate_snapshot INTEGER NOT NULL, subtotal_usd_cents INTEGER NOT NULL,
        delivery_total_usd_cents INTEGER NOT NULL, cod_fee_usd_cents INTEGER NOT NULL DEFAULT 0,
        discount_total_usd_cents INTEGER NOT NULL DEFAULT 0, grand_total_usd_cents INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS sub_orders (
        id TEXT PRIMARY KEY, order_id TEXT NOT NULL, seller_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
        delivery_mode TEXT NOT NULL, delivery_fee_usd_cents INTEGER NOT NULL, subtotal_usd_cents INTEGER NOT NULL,
        discount_usd_cents INTEGER NOT NULL DEFAULT 0, commission_usd_cents INTEGER NOT NULL,
        seller_net_usd_cents INTEGER NOT NULL, cod_collected INTEGER NOT NULL DEFAULT 0,
        courier_name TEXT, tracking_code TEXT, delivered_at TEXT, updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY, sub_order_id TEXT NOT NULL, product_id TEXT NOT NULL, variant_id TEXT NOT NULL,
        title_snapshot_json TEXT NOT NULL, variant_label TEXT NOT NULL, sku TEXT NOT NULL,
        quantity INTEGER NOT NULL, unit_price_usd_cents INTEGER NOT NULL, line_total_usd_cents INTEGER NOT NULL,
        commission_bps_snapshot INTEGER NOT NULL, commission_usd_cents INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY, order_id TEXT NOT NULL, method TEXT NOT NULL, gateway_name TEXT NOT NULL,
        reference TEXT, amount_usd_cents INTEGER NOT NULL, status TEXT NOT NULL, verified_by_user_id TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS ledger_entries (
        id TEXT PRIMARY KEY, seller_id TEXT NOT NULL, sub_order_id TEXT, order_number TEXT,
        entry_type TEXT NOT NULL, direction TEXT NOT NULL, amount_usd_cents INTEGER NOT NULL,
        availability TEXT NOT NULL DEFAULT 'pending', note TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS payouts (
        id TEXT PRIMARY KEY, seller_id TEXT NOT NULL, amount_usd_cents INTEGER NOT NULL,
        method TEXT NOT NULL, account_details TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
        reference_code TEXT, settled_by_user_id TEXT, settled_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS commissions_log (
        id TEXT PRIMARY KEY, order_item_id TEXT NOT NULL, seller_id TEXT NOT NULL, applied_bps INTEGER NOT NULL,
        source_rule TEXT NOT NULL, amount_usd_cents INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS subscription_plans (
        tier TEXT PRIMARY KEY, name_json TEXT NOT NULL, monthly_fee_usd_cents INTEGER NOT NULL,
        product_limit INTEGER, commission_discount_bps INTEGER NOT NULL DEFAULT 0, features_json TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY, seller_id TEXT NOT NULL, plan_tier TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active',
        next_due_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS coupons (
        id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, seller_id TEXT, discount_type TEXT NOT NULL DEFAULT 'percent',
        discount_value INTEGER NOT NULL, max_discount_usd_cents INTEGER, min_order_usd_cents INTEGER NOT NULL DEFAULT 0,
        target_type TEXT NOT NULL DEFAULT 'all', target_id TEXT, campaign_id TEXT,
        max_uses INTEGER, per_customer_limit INTEGER NOT NULL DEFAULT 1, used_count INTEGER NOT NULL DEFAULT 0,
        first_order_only INTEGER NOT NULL DEFAULT 0, auto_generated_batch TEXT,
        starts_at TEXT, ends_at TEXT, active INTEGER NOT NULL DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS coupon_redemptions (
        id TEXT PRIMARY KEY, coupon_id TEXT NOT NULL, user_id TEXT, customer_phone_norm TEXT NOT NULL,
        order_id TEXT NOT NULL, discount_usd_cents INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS offers (
        id TEXT PRIMARY KEY, seller_id TEXT, title_json TEXT NOT NULL, offer_type TEXT NOT NULL,
        discount_value INTEGER NOT NULL, target_type TEXT NOT NULL, target_id TEXT,
        stacking_rule TEXT NOT NULL DEFAULT 'best_only', funding_source TEXT NOT NULL DEFAULT 'platform',
        funding_platform_bps INTEGER NOT NULL DEFAULT 10000, campaign_id TEXT,
        priority INTEGER NOT NULL DEFAULT 10, rules_json TEXT,
        approval_status TEXT NOT NULL DEFAULT 'pending', starts_at TEXT, ends_at TEXT, active INTEGER NOT NULL DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS flash_sales (
        id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title_json TEXT NOT NULL, bg_token TEXT NOT NULL DEFAULT 'ember',
        starts_at TEXT NOT NULL, ends_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'scheduled',
        auto_revert INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS flash_sale_items (
        id TEXT PRIMARY KEY, flash_sale_id TEXT NOT NULL, product_id TEXT NOT NULL,
        sale_price_usd_cents INTEGER NOT NULL, discount_percent INTEGER NOT NULL,
        stock_cap INTEGER NOT NULL DEFAULT 0, claimed_count INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title_json TEXT NOT NULL,
        subtitle_json TEXT NOT NULL, description_json TEXT NOT NULL, hero_image_url TEXT,
        bg_token TEXT NOT NULL DEFAULT 'ember', starts_at TEXT, ends_at TEXT,
        status TEXT NOT NULL DEFAULT 'draft', featured_offer_ids_json TEXT NOT NULL,
        featured_coupon_codes_json TEXT NOT NULL, featured_flash_sale_id TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS banners (
        id TEXT PRIMARY KEY, title_json TEXT NOT NULL, bg_token TEXT NOT NULL DEFAULT 'graphite',
        target_url TEXT NOT NULL, pages_json TEXT NOT NULL, placement TEXT NOT NULL DEFAULT 'page_strip',
        image_url TEXT, dismissible INTEGER NOT NULL DEFAULT 1, audience TEXT NOT NULL DEFAULT 'all',
        device_target TEXT NOT NULL DEFAULT 'all', category_slug TEXT,
        priority INTEGER NOT NULL DEFAULT 0, impressions INTEGER NOT NULL DEFAULT 0, clicks INTEGER NOT NULL DEFAULT 0,
        bot_filtered_count INTEGER NOT NULL DEFAULT 0, starts_at TEXT, ends_at TEXT, active INTEGER NOT NULL DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS marketing_popups (
        id TEXT PRIMARY KEY, title_json TEXT NOT NULL, body_json TEXT NOT NULL, cta_label_json TEXT NOT NULL,
        target_url TEXT NOT NULL DEFAULT '/catalog', image_url TEXT, bg_token TEXT NOT NULL DEFAULT 'ember',
        popup_type TEXT NOT NULL DEFAULT 'promo', trigger_type TEXT NOT NULL DEFAULT 'delay_seconds',
        trigger_value INTEGER NOT NULL DEFAULT 5, frequency_cap TEXT NOT NULL DEFAULT 'once_per_day',
        pages_json TEXT NOT NULL, audience TEXT NOT NULL DEFAULT 'all', device_target TEXT NOT NULL DEFAULT 'all',
        show_newsletter_form INTEGER NOT NULL DEFAULT 0, coupon_code TEXT, starts_at TEXT, ends_at TEXT,
        active INTEGER NOT NULL DEFAULT 1, impressions INTEGER NOT NULL DEFAULT 0, conversions INTEGER NOT NULL DEFAULT 0,
        dismissals INTEGER NOT NULL DEFAULT 0, bot_filtered_count INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS featured_placements (
        id TEXT PRIMARY KEY, slot_key TEXT NOT NULL, target_type TEXT NOT NULL, target_id TEXT NOT NULL,
        seller_id TEXT NOT NULL, badge_json TEXT NOT NULL, priority INTEGER NOT NULL DEFAULT 10,
        fee_usd_cents INTEGER NOT NULL DEFAULT 0, ledger_charged INTEGER NOT NULL DEFAULT 0,
        ledger_entry_id TEXT, starts_at TEXT, ends_at TEXT, active INTEGER NOT NULL DEFAULT 1,
        impressions INTEGER NOT NULL DEFAULT 0, clicks INTEGER NOT NULL DEFAULT 0,
        bot_filtered_count INTEGER NOT NULL DEFAULT 0, created_by_user_id TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS marketing_events_dedup (
        id TEXT PRIMARY KEY, entity_kind TEXT NOT NULL, entity_id TEXT NOT NULL, event_type TEXT NOT NULL,
        visitor_hash TEXT NOT NULL, bucket_key TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(entity_kind, entity_id, event_type, visitor_hash, bucket_key)
      );
      CREATE TABLE IF NOT EXISTS home_sections (
        id TEXT PRIMARY KEY, section_type TEXT NOT NULL, title_json TEXT NOT NULL, content_json TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'draft', visible INTEGER NOT NULL DEFAULT 1,
        audience TEXT NOT NULL DEFAULT 'all', targeting_json TEXT, style_json TEXT,
        schedule_priority INTEGER NOT NULL DEFAULT 0, starts_at TEXT, ends_at TEXT, version INTEGER NOT NULL DEFAULT 1,
        updated_by_user_id TEXT, updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS home_section_versions (
        id TEXT PRIMARY KEY, section_id TEXT NOT NULL, version INTEGER NOT NULL, change_note TEXT,
        snapshot_json TEXT NOT NULL, edited_by_user_id TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS home_section_templates (
        id TEXT PRIMARY KEY, name_json TEXT NOT NULL, description_json TEXT NOT NULL,
        section_type TEXT NOT NULL, content_json TEXT NOT NULL, style_json TEXT,
        is_system INTEGER NOT NULL DEFAULT 0, created_by_user_id TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS home_page_snapshots (
        id TEXT PRIMARY KEY, version INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'published',
        change_note TEXT, sections_snapshot_json TEXT NOT NULL, chrome_snapshot_json TEXT NOT NULL,
        scheduled_publish_at TEXT, published_at TEXT, created_by_user_id TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, locale TEXT NOT NULL DEFAULT 'en',
        source TEXT NOT NULL DEFAULT 'home', status TEXT NOT NULL DEFAULT 'subscribed',
        unsubscribe_token TEXT NOT NULL, consented_at TEXT NOT NULL DEFAULT (datetime('now')),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title_json TEXT NOT NULL, body_json TEXT NOT NULL,
        published INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS menus (id TEXT PRIMARY KEY, location TEXT NOT NULL, items_json TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY, product_id TEXT NOT NULL, seller_id TEXT NOT NULL, user_id TEXT NOT NULL,
        rating INTEGER NOT NULL, comment TEXT NOT NULL, verified_buyer INTEGER NOT NULL DEFAULT 1,
        seller_reply TEXT, moderation_status TEXT NOT NULL DEFAULT 'approved', created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS wishlists (
        id TEXT PRIMARY KEY, user_id TEXT NOT NULL, product_id TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(user_id, product_id)
      );
      CREATE TABLE IF NOT EXISTS addresses (
        id TEXT PRIMARY KEY, user_id TEXT NOT NULL, label TEXT NOT NULL, governorate TEXT NOT NULL,
        district TEXT NOT NULL, town TEXT NOT NULL, phone TEXT NOT NULL, notes TEXT, is_default INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title_json TEXT NOT NULL, body_json TEXT NOT NULL,
        read_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS email_templates (
        key TEXT PRIMARY KEY, subject_json TEXT NOT NULL, body_json TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS email_log (
        id TEXT PRIMARY KEY, recipient_email TEXT NOT NULL, template_key TEXT NOT NULL,
        status TEXT NOT NULL, error_message TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS support_tickets (
        id TEXT PRIMARY KEY, user_id TEXT, email TEXT NOT NULL, subject TEXT NOT NULL,
        message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS disputes (
        id TEXT PRIMARY KEY, sub_order_id TEXT NOT NULL, opened_by_user_id TEXT NOT NULL,
        reason TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', resolution_note TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS returns (
        id TEXT PRIMARY KEY, sub_order_id TEXT NOT NULL, user_id TEXT NOT NULL, reason TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'requested', refund_usd_cents INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS audit_log (
        id TEXT PRIMARY KEY, actor_user_id TEXT, action TEXT NOT NULL, entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL, before_json TEXT, after_json TEXT, ip_address TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY, value_json TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS translations (key TEXT PRIMARY KEY, en TEXT NOT NULL, ar TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS delivery_zones (
        governorate_code TEXT PRIMARY KEY, name_json TEXT NOT NULL, platform_fee_usd_cents INTEGER NOT NULL, eta_days TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY, job_type TEXT NOT NULL, payload_json TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'queued', attempts INTEGER NOT NULL DEFAULT 0,
        run_at TEXT NOT NULL DEFAULT (datetime('now')), last_error TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS error_log (
        id TEXT PRIMARY KEY, route TEXT NOT NULL, message TEXT NOT NULL, stack TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS customer_segments (
        id TEXT PRIMARY KEY, name_json TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
        rules_json TEXT NOT NULL, cached_member_count INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS email_campaigns (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, subject_json TEXT NOT NULL, preview_text_json TEXT NOT NULL,
        segment_id TEXT, blocks_json TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft',
        scheduled_at TEXT, sent_count INTEGER NOT NULL DEFAULT 0, failed_count INTEGER NOT NULL DEFAULT 0,
        unsubscribed_count INTEGER NOT NULL DEFAULT 0, sent_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS automation_flows (
        id TEXT PRIMARY KEY, name_json TEXT NOT NULL, trigger_type TEXT NOT NULL,
        delay_hours INTEGER NOT NULL DEFAULT 0, subject_json TEXT NOT NULL, blocks_json TEXT NOT NULL,
        attach_coupon_code TEXT, active INTEGER NOT NULL DEFAULT 1,
        total_triggered INTEGER NOT NULL DEFAULT 0, total_sent INTEGER NOT NULL DEFAULT 0,
        last_run_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS automation_executions (
        id TEXT PRIMARY KEY, flow_id TEXT NOT NULL, dedup_key TEXT NOT NULL,
        recipient_email TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(flow_id, dedup_key)
      );
      CREATE TABLE IF NOT EXISTS verification_codes (
        id TEXT PRIMARY KEY, user_id TEXT NOT NULL, channel TEXT NOT NULL,
        target TEXT NOT NULL, purpose TEXT NOT NULL DEFAULT 'verify_contact',
        code_hash TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0,
        expires_at TEXT NOT NULL, consumed_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_verif_user_channel ON verification_codes(user_id, channel);
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id TEXT PRIMARY KEY, seller_id TEXT NOT NULL, customer_user_id TEXT NOT NULL,
        customer_name TEXT NOT NULL, product_id TEXT, status TEXT NOT NULL DEFAULT 'open',
        unread_for_seller INTEGER NOT NULL DEFAULT 0, unread_for_customer INTEGER NOT NULL DEFAULT 0,
        last_message_preview TEXT, last_message_at TEXT NOT NULL DEFAULT (datetime('now')),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_chat_conv_seller ON chat_conversations(seller_id);
      CREATE INDEX IF NOT EXISTS idx_chat_conv_customer ON chat_conversations(customer_user_id);
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL, sender_role TEXT NOT NULL,
        sender_user_id TEXT NOT NULL, body TEXT NOT NULL, read_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_chat_msg_conv ON chat_messages(conversation_id);
      CREATE TABLE IF NOT EXISTS notification_preferences (
        user_id TEXT PRIMARY KEY,
        email_summary_enabled INTEGER NOT NULL DEFAULT 1,
        summary_frequency TEXT NOT NULL DEFAULT 'daily',
        order_updates INTEGER NOT NULL DEFAULT 1,
        price_drops INTEGER NOT NULL DEFAULT 1,
        promotional_offers INTEGER NOT NULL DEFAULT 1,
        last_summary_sent_at TEXT,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
    const ensureCol = (table, col, defSql) => {
      const cols = sqlite.prepare(`PRAGMA table_info(${table})`).all();
      if (!cols.some((c) => c.name === col)) {
        sqlite.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${defSql}`);
      }
    };
    ensureCol("media", "folder", "TEXT NOT NULL DEFAULT 'general'");
    ensureCol("media", "alt_json", "TEXT");
    ensureCol("media", "focal_x", "INTEGER NOT NULL DEFAULT 50");
    ensureCol("media", "focal_y", "INTEGER NOT NULL DEFAULT 50");
    ensureCol("home_sections", "visible", "INTEGER NOT NULL DEFAULT 1");
    ensureCol("home_sections", "targeting_json", "TEXT");
    ensureCol("home_sections", "style_json", "TEXT");
    ensureCol("home_sections", "schedule_priority", "INTEGER NOT NULL DEFAULT 0");
    ensureCol("home_sections", "updated_by_user_id", "TEXT");
    ensureCol("home_section_versions", "change_note", "TEXT");
    ensureCol("banners", "placement", "TEXT NOT NULL DEFAULT 'page_strip'");
    ensureCol("banners", "image_url", "TEXT");
    ensureCol("banners", "dismissible", "INTEGER NOT NULL DEFAULT 1");
    ensureCol("banners", "audience", "TEXT NOT NULL DEFAULT 'all'");
    ensureCol("banners", "device_target", "TEXT NOT NULL DEFAULT 'all'");
    ensureCol("banners", "category_slug", "TEXT");
    ensureCol("banners", "bot_filtered_count", "INTEGER NOT NULL DEFAULT 0");
    ensureCol("coupons", "max_discount_usd_cents", "INTEGER");
    ensureCol("coupons", "target_type", "TEXT NOT NULL DEFAULT 'all'");
    ensureCol("coupons", "target_id", "TEXT");
    ensureCol("coupons", "campaign_id", "TEXT");
    ensureCol("coupons", "first_order_only", "INTEGER NOT NULL DEFAULT 0");
    ensureCol("coupons", "auto_generated_batch", "TEXT");
    ensureCol("offers", "stacking_rule", "TEXT NOT NULL DEFAULT 'best_only'");
    ensureCol("offers", "funding_source", "TEXT NOT NULL DEFAULT 'platform'");
    ensureCol("offers", "funding_platform_bps", "INTEGER NOT NULL DEFAULT 10000");
    ensureCol("offers", "campaign_id", "TEXT");
    ensureCol("offers", "priority", "INTEGER NOT NULL DEFAULT 10");
    ensureCol("offers", "rules_json", "TEXT");
    ensureCol("stores", "locations_json", "TEXT");
    ensureCol("notifications", "category", "TEXT NOT NULL DEFAULT 'system'");
    ensureCol("notifications", "action_url", "TEXT");
    ensureCol("notifications", "metadata_json", "TEXT");
    ensureCol("notifications", "emailed_at", "TEXT");
  }
  getDb() {
    if (!this.sqliteDb) throw new Error("Database not initialized.");
    return this.sqliteDb;
  }
  normalizeParams(params) {
    return params.map((p) => {
      if (p === void 0 || p === null) return null;
      if (typeof p === "boolean") return p ? 1 : 0;
      if (p instanceof Date) return p.toISOString();
      if (typeof p === "object" && !(p instanceof Uint8Array)) return JSON.stringify(p);
      return p;
    });
  }
  async query(sql, params = []) {
    const stmt = this.getDb().prepare(sql);
    return stmt.all(...this.normalizeParams(params));
  }
  async queryOne(sql, params = []) {
    const stmt = this.getDb().prepare(sql);
    const row = stmt.get(...this.normalizeParams(params));
    return row ?? null;
  }
  async execute(sql, params = []) {
    const stmt = this.getDb().prepare(sql);
    const info = stmt.run(...this.normalizeParams(params));
    return { affectedRows: Number(info.changes ?? 0) };
  }
  async transaction(fn) {
    let release;
    const prev = this.txLock;
    this.txLock = new Promise((res) => {
      release = res;
    });
    await prev;
    const db = this.getDb();
    try {
      db.exec("BEGIN IMMEDIATE");
      const result = await fn(this);
      db.exec("COMMIT");
      return result;
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    } finally {
      release();
    }
  }
  async close() {
    this.sqliteDb?.close();
    this.sqliteDb = null;
  }
};
var activeDb = null;
async function getDb() {
  if (activeDb) return activeDb;
  const mysqlUri = buildMysqlConnectionUri();
  if (mysqlUri) {
    const client = new MysqlClient(mysqlUri);
    await client.init();
    activeDb = client;
    console.log("[DB] Connected to MySQL database via Drizzle/mysql2.");
    return client;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL (or DB_HOST/DB_USER/DB_NAME) is required in production for MySQL.");
  }
  const previewClient = new SqlitePreviewClient();
  await previewClient.init();
  activeDb = previewClient;
  console.log(
    `[DB] Preview mode: using SQLite at ${getPersistentStorageDir()} (configure DATABASE_URL=mysql://... for Hostinger MySQL).`
  );
  return previewClient;
}

// server/db/essentialSeed.ts
import crypto from "node:crypto";

// src/shared/lebanon.ts
var DEFAULT_DELIVERY_ZONES = [
  { governorateCode: "beirut", name: { en: "Beirut", ar: "\u0628\u064A\u0631\u0648\u062A" }, platformFeeUsdCents: 300, etaDays: "24h" },
  { governorateCode: "mount-lebanon", name: { en: "Mount Lebanon", ar: "\u062C\u0628\u0644 \u0644\u0628\u0646\u0627\u0646" }, platformFeeUsdCents: 400, etaDays: "1-2d" },
  { governorateCode: "north", name: { en: "North Lebanon", ar: "\u0644\u0628\u0646\u0627\u0646 \u0627\u0644\u0634\u0645\u0627\u0644\u064A" }, platformFeeUsdCents: 500, etaDays: "2-3d" },
  { governorateCode: "south", name: { en: "South Lebanon", ar: "\u0644\u0628\u0646\u0627\u0646 \u0627\u0644\u062C\u0646\u0648\u0628\u064A" }, platformFeeUsdCents: 500, etaDays: "2-3d" },
  { governorateCode: "bekaa", name: { en: "Bekaa", ar: "\u0627\u0644\u0628\u0642\u0627\u0639" }, platformFeeUsdCents: 550, etaDays: "2-3d" },
  { governorateCode: "nabatieh", name: { en: "Nabatieh", ar: "\u0627\u0644\u0646\u0628\u0637\u064A\u0629" }, platformFeeUsdCents: 550, etaDays: "2-3d" },
  { governorateCode: "akkar", name: { en: "Akkar", ar: "\u0639\u0643\u0627\u0631" }, platformFeeUsdCents: 650, etaDays: "3-4d" },
  { governorateCode: "baalbek-hermel", name: { en: "Baalbek-Hermel", ar: "\u0628\u0639\u0644\u0628\u0643-\u0627\u0644\u0647\u0631\u0645\u0644" }, platformFeeUsdCents: 650, etaDays: "3-4d" }
];

// server/db/essentialSeed.ts
init_homeSections();
var ESSENTIAL_ROLES = [
  { key: "customer", name: "Customer", description: "Shop, manage orders, addresses, wishlist, and verified reviews." },
  { key: "seller_owner", name: "Seller Owner", description: "Full control of merchant store, products, orders, and payouts." },
  { key: "seller_staff", name: "Seller Staff", description: "Delegated store operations based on assigned permissions." },
  { key: "admin_super", name: "Super Admin", description: "Unrestricted platform governance, finance, and staff management." },
  { key: "admin_staff", name: "Admin Staff", description: "Granular platform operations assigned by Super Admin." }
];
var ESSENTIAL_PERMISSIONS = [
  { key: "sellers.approve", description: "Approve, reject, or request changes on seller applications" },
  { key: "products.approve", description: "Moderate and feature marketplace products" },
  { key: "orders.manage", description: "Manage orders, sub-orders, courier assignments, and refunds" },
  { key: "payouts.release", description: "Release escrow holds and settle seller payout requests" },
  { key: "content.manage", description: "Edit home sections, offer banners, menus, and static pages" },
  { key: "home.edit", description: "Edit draft home sections, chrome, and templates" },
  { key: "home.publish", description: "Publish home page snapshots and rollback versions" },
  { key: "marketing.manage", description: "Create and edit banners, popups, featured placements, offers, coupons, and campaigns" },
  { key: "marketing.view", description: "View marketing analytics and campaign reports" },
  { key: "settings.manage", description: "Edit exchange rate, commissions, delivery zones, and SMTP/storage" },
  { key: "users.manage", description: "Create admin staff and assign granular permissions" },
  { key: "seller.catalog", description: "Create and edit store products and inventory" },
  { key: "seller.orders", description: "Fulfill seller sub-orders and collect COD" },
  { key: "seller.finance", description: "View ledger balances and request payouts" }
];
var ROLE_PERMISSION_MAP = [
  ["admin_super", "sellers.approve"],
  ["admin_super", "products.approve"],
  ["admin_super", "orders.manage"],
  ["admin_super", "payouts.release"],
  ["admin_super", "content.manage"],
  ["admin_super", "home.edit"],
  ["admin_super", "home.publish"],
  ["admin_super", "marketing.manage"],
  ["admin_super", "marketing.view"],
  ["admin_super", "settings.manage"],
  ["admin_super", "users.manage"],
  ["admin_staff", "sellers.approve"],
  ["admin_staff", "products.approve"],
  ["admin_staff", "orders.manage"],
  ["admin_staff", "content.manage"],
  ["admin_staff", "home.edit"],
  ["admin_staff", "marketing.manage"],
  ["admin_staff", "marketing.view"],
  ["seller_owner", "seller.catalog"],
  ["seller_owner", "seller.orders"],
  ["seller_owner", "seller.finance"],
  ["seller_staff", "seller.catalog"],
  ["seller_staff", "seller.orders"]
];
var ESSENTIAL_CATEGORIES = [
  { id: "cat-fashion", slug: "fashion", department: "fashion", name: { en: "Fashion", ar: "\u0627\u0644\u0623\u0632\u064A\u0627\u0621" }, commissionBps: 1200, sort: 1 },
  { id: "cat-electronics", slug: "electronics", department: "electronics", name: { en: "Electronics", ar: "\u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A" }, commissionBps: 800, sort: 2 },
  { id: "cat-mobiles", slug: "mobiles", department: "electronics", name: { en: "Mobiles & Accessories", ar: "\u0627\u0644\u0647\u0648\u0627\u062A\u0641 \u0648\u0645\u0644\u062D\u0642\u0627\u062A\u0647\u0627" }, commissionBps: 700, sort: 3 },
  { id: "cat-home", slug: "home-gadgets", department: "home-gadgets", name: { en: "Home Gadgets", ar: "\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0645\u0646\u0632\u0644" }, commissionBps: null, sort: 4 }
];
var ESSENTIAL_PLANS = [
  {
    tier: "free",
    name: { en: "Free", ar: "\u0645\u062C\u0627\u0646\u064A" },
    monthlyFeeUsdCents: 0,
    productLimit: 15,
    commissionDiscountBps: 0,
    features: [
      { en: "Up to 15 active products", ar: "\u062D\u062A\u0649 15 \u0645\u0646\u062A\u062C\u0627\u064B \u0646\u0634\u0637\u0627\u064B" },
      { en: "Platform courier delivery", ar: "\u062A\u0648\u0635\u064A\u0644 \u0639\u0628\u0631 \u0627\u0644\u0645\u0646\u0635\u0629" }
    ]
  },
  {
    tier: "basic",
    name: { en: "Basic", ar: "\u0623\u0633\u0627\u0633\u064A" },
    monthlyFeeUsdCents: 2900,
    productLimit: 100,
    commissionDiscountBps: 50,
    features: [
      { en: "Up to 100 active products", ar: "\u062D\u062A\u0649 100 \u0645\u0646\u062A\u062C \u0646\u0634\u0637" },
      { en: "Self-delivery zone rates", ar: "\u062A\u0633\u0639\u064A\u0631 \u062A\u0648\u0635\u064A\u0644 \u062E\u0627\u0635 \u0628\u0627\u0644\u0645\u062A\u062C\u0631" },
      { en: "Store coupons & offers", ar: "\u0642\u0633\u0627\u0626\u0645 \u0648\u0639\u0631\u0648\u0636 \u0627\u0644\u0645\u062A\u062C\u0631" }
    ]
  },
  {
    tier: "pro",
    name: { en: "Pro", ar: "\u0627\u062D\u062A\u0631\u0627\u0641\u064A" },
    monthlyFeeUsdCents: 7900,
    productLimit: null,
    commissionDiscountBps: 150,
    features: [
      { en: "Unlimited active products", ar: "\u0645\u0646\u062A\u062C\u0627\u062A \u063A\u064A\u0631 \u0645\u062D\u062F\u0648\u062F\u0629" },
      { en: "Bulk CSV import & export", ar: "\u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0648\u062A\u0635\u062F\u064A\u0631 CSV" },
      { en: "Priority support & payouts", ar: "\u0623\u0648\u0644\u0648\u064A\u0629 \u0627\u0644\u062F\u0639\u0645 \u0648\u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0623\u0631\u0628\u0627\u062D" }
    ]
  }
];
var ESSENTIAL_EMAIL_TEMPLATES = [
  {
    key: "welcome",
    subject: { en: "Welcome to NileLink Lebanon", ar: "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643 \u0644\u0628\u0646\u0627\u0646" },
    body: { en: "Hello {{name}}, your NileLink account is active.", ar: "\u0645\u0631\u062D\u0628\u0627\u064B {{name}}\u060C \u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u062D\u0633\u0627\u0628\u0643 \u0641\u064A \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643." }
  },
  {
    key: "verify_email",
    subject: { en: "Verify your NileLink email", ar: "\u062A\u0623\u0643\u064A\u062F \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0641\u064A \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643" },
    body: { en: "Use verification code {{code}} or link {{link}}.", ar: "\u0627\u0633\u062A\u062E\u062F\u0645 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 {{code}} \u0623\u0648 \u0627\u0644\u0631\u0627\u0628\u0637 {{link}}." }
  },
  {
    key: "order_placed",
    subject: { en: "Order {{orderNumber}} received", ar: "\u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 \u0637\u0644\u0628\u0643 {{orderNumber}}" },
    body: { en: "Your order {{orderNumber}} totaling {{total}} is confirmed.", ar: "\u062A\u0645 \u062A\u0623\u0643\u064A\u062F \u0637\u0644\u0628\u0643 {{orderNumber}} \u0628\u0642\u064A\u0645\u0629 {{total}}." }
  },
  {
    key: "seller_approved",
    subject: { en: "Your NileLink storefront is approved", ar: "\u062A\u0645\u062A \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0645\u062A\u062C\u0631\u0643 \u0641\u064A \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643" },
    body: { en: "Your store {{storeName}} is now live on NileLink.", ar: "\u0645\u062A\u062C\u0631\u0643 {{storeName}} \u0623\u0635\u0628\u062D \u0645\u062A\u0627\u062D\u0627\u064B \u0627\u0644\u0622\u0646 \u0639\u0644\u0649 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643." }
  },
  {
    key: "payout_paid",
    subject: { en: "Payout settled \u2014 {{amount}}", ar: "\u062A\u0645 \u062A\u062D\u0648\u064A\u0644 \u0623\u0631\u0628\u0627\u062D\u0643 \u2014 {{amount}}" },
    body: { en: "Transfer reference: {{reference}}.", ar: "\u0631\u0642\u0645 \u0645\u0631\u062C\u0639 \u0627\u0644\u062A\u062D\u0648\u064A\u0644: {{reference}}." }
  },
  {
    key: "password_reset",
    subject: { en: "Reset your NileLink password", ar: "\u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643" },
    body: {
      en: "Hello {{name}}, use password reset token {{token}} or open {{link}} within 60 minutes.",
      ar: "\u0645\u0631\u062D\u0628\u0627\u064B {{name}}\u060C \u0627\u0633\u062A\u062E\u062F\u0645 \u0631\u0645\u0632 \u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 {{token}} \u0623\u0648 \u0627\u0641\u062A\u062D \u0627\u0644\u0631\u0627\u0628\u0637 {{link}} \u062E\u0644\u0627\u0644 60 \u062F\u0642\u064A\u0642\u0629."
    }
  }
];
var ESSENTIAL_PAGES = [
  {
    id: "page-terms",
    slug: "terms",
    title: { en: "Terms & Conditions", ar: "\u0627\u0644\u0634\u0631\u0648\u0637 \u0648\u0627\u0644\u0623\u062D\u0643\u0627\u0645" },
    body: {
      en: [
        "1. Scope & Marketplace Role",
        "NileLink operates as a curated multi-vendor e-commerce marketplace connecting independent Lebanese merchants with buyers across all eight Lebanese governorates. Each product listing is offered and fulfilled directly by the identified merchant unless expressly marked as NileLink Central Dispatch.",
        "",
        "2. Account Registration & Security",
        "Buyers may browse publicly, save items to a local wishlist, or register an account for cross-device cart/wishlist sync, order tracking, and verified product reviews. You are responsible for safeguarding your password and optional Two-Factor Authentication (2FA) credentials.",
        "",
        "3. Dual USD / LBP Pricing & Checkout",
        "Prices are maintained in integer USD minor units and converted transparently to Lebanese Pounds (LBP) using the active platform exchange rate displayed in the header. At checkout, the applied USD/LBP snapshot rate, shipping fees per seller sub-order, and applicable coupons or offers are locked into your confirmed order receipt.",
        "",
        "4. Split-Seller Orders & Delivery SLAs",
        "When your shopping bag contains items from multiple independent merchants, NileLink splits checkout cleanly into separate sub-orders per merchant so delivery fees, dispatch tracking, and invoices remain transparent. Estimated delivery windows range between 1 and 5 business days depending on your governorate and district.",
        "",
        "5. Prohibited Conduct & Intellectual Property",
        "Counterfeit listings, unauthorized automated scraping, abuse of promotional coupons, and fraudulent payment references are strictly prohibited and may result in immediate account suspension. All trademarks, editorial photography, and platform interfaces remain the property of NileLink and its respective merchants.",
        "",
        "6. Governing Law",
        "These Terms & Conditions are governed by and construed in accordance with the applicable laws of the Republic of Lebanon."
      ].join("\n"),
      ar: [
        "1. \u0646\u0637\u0627\u0642 \u0627\u0644\u0645\u0646\u0635\u0629 \u0648\u062F\u0648\u0631 \u0627\u0644\u0648\u0633\u064A\u0637 \u0627\u0644\u062A\u062C\u0627\u0631\u064A",
        "\u062A\u0639\u0645\u0644 \u0645\u0646\u0635\u0629 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643 (NileLink) \u0643\u0633\u0648\u0642 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0644\u0628\u0646\u0627\u0646\u064A \u0645\u062A\u0639\u062F\u062F \u0627\u0644\u062A\u062C\u0627\u0631 \u064A\u0631\u0628\u0637 \u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0648\u0627\u0644\u0645\u0634\u0627\u063A\u0644 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629 \u0627\u0644\u0645\u0633\u062A\u0642\u0644\u0629 \u0628\u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0646 \u0641\u064A \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0627\u062A \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629 \u0627\u0644\u062B\u0645\u0627\u0646\u064A. \u064A\u064F\u0639\u0631\u0636 \u0643\u0644 \u0645\u0646\u062A\u062C \u0648\u064A\u064F\u062C\u0647\u0632 \u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0646 \u0642\u0628\u0644 \u0627\u0644\u062A\u0627\u062C\u0631 \u0627\u0644\u0645\u0648\u0636\u062D \u0627\u0633\u0645\u0647 \u0641\u064A \u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0645\u0646\u062A\u062C.",
        "",
        "2. \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0648\u0627\u0644\u0623\u0645\u0627\u0646",
        "\u064A\u0645\u0643\u0646 \u0644\u0644\u0632\u0648\u0627\u0631 \u062A\u0635\u0641\u062D \u0627\u0644\u0643\u062A\u0627\u0644\u0648\u062C \u0648\u062D\u0641\u0638 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0641\u064A \u0627\u0644\u0645\u0641\u0636\u0644\u0629 \u0645\u062D\u0644\u064A\u0627\u064B\u060C \u0623\u0648 \u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628 \u0644\u0645\u0632\u0627\u0645\u0646\u0629 \u0627\u0644\u0645\u0641\u0636\u0644\u0629 \u0648\u0627\u0644\u062D\u0642\u064A\u0628\u0629 \u0648\u062A\u062A\u0628\u0639 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0648\u0643\u062A\u0627\u0628\u0629 \u0627\u0644\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0627\u0644\u0645\u0648\u062B\u0642\u0629. \u064A\u062A\u062D\u0645\u0644 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0645\u0633\u0624\u0648\u0644\u064A\u0629 \u0627\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u0633\u0631\u064A\u0629 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0648\u0631\u0645\u0648\u0632 \u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629 \u0627\u0644\u062B\u0646\u0627\u0626\u064A\u0629 (2FA).",
        "",
        "3. \u0627\u0644\u062A\u0633\u0639\u064A\u0631 \u0627\u0644\u0645\u0632\u062F\u0648\u062C \u0628\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0648\u0627\u0644\u0644\u064A\u0631\u0629 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629",
        "\u062A\u064F\u062D\u062A\u0633\u0628 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0628\u062F\u0642\u0629 \u0628\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0627\u0644\u0623\u0645\u064A\u0631\u0643\u064A \u0648\u062A\u064F\u0639\u0631\u0636 \u0645\u0642\u0627\u0628\u0644\u0647\u0627 \u0628\u0627\u0644\u0644\u064A\u0631\u0629 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629 \u0648\u0641\u0642 \u0633\u0639\u0631 \u0627\u0644\u0635\u0631\u0641 \u0627\u0644\u0645\u0639\u062A\u0645\u062F \u0627\u0644\u0638\u0627\u0647\u0631 \u0641\u064A \u0623\u0639\u0644\u0649 \u0627\u0644\u0645\u0646\u0635\u0629. \u0639\u0646\u062F \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628\u060C \u064A\u062A\u0645 \u062A\u062B\u0628\u064A\u062A \u0633\u0639\u0631 \u0627\u0644\u0635\u0631\u0641 \u0648\u0631\u0633\u0648\u0645 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0648\u0627\u0644\u062E\u0635\u0648\u0645\u0627\u062A \u0641\u064A \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u0627\u0644\u0646\u0647\u0627\u0626\u064A\u0629 \u0644\u0644\u0637\u0644\u0628.",
        "",
        "4. \u062A\u0642\u0633\u064A\u0645 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u062D\u0633\u0628 \u0627\u0644\u0645\u062A\u062C\u0631 \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0644",
        "\u0639\u0646\u062F \u0627\u0644\u0634\u0631\u0627\u0621 \u0645\u0646 \u0623\u0643\u062B\u0631 \u0645\u0646 \u0645\u062A\u062C\u0631 \u0641\u064A \u0637\u0644\u0628 \u0648\u0627\u062D\u062F\u060C \u064A\u0646\u0642\u0633\u0645 \u0627\u0644\u0637\u0644\u0628 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0625\u0644\u0649 \u0637\u0644\u0628\u0627\u062A \u0641\u0631\u0639\u064A\u0629 \u0645\u0633\u062A\u0642\u0644\u0629 \u0644\u0643\u0644 \u0628\u0627\u0626\u0639 \u0644\u0636\u0645\u0627\u0646 \u0648\u0636\u0648\u062D \u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u062D\u0646 \u0648\u062A\u062A\u0628\u0639 \u0643\u0644 \u0634\u062D\u0646\u0629. \u062A\u062A\u0631\u0627\u0648\u062D \u0645\u062F\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0639\u0627\u062F\u0629 \u0628\u064A\u0646 \u064A\u0648\u0645 \u06485 \u0623\u064A\u0627\u0645 \u0639\u0645\u0644 \u062D\u0633\u0628 \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0629 \u0648\u0627\u0644\u0642\u0636\u0627\u0621.",
        "",
        "5. \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0645\u0633\u0645\u0648\u062D \u0648\u0627\u0644\u0645\u0644\u0643\u064A\u0629 \u0627\u0644\u0641\u0643\u0631\u064A\u0629",
        "\u064A\u064F\u062D\u0638\u0631 \u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0642\u0644\u062F\u0629 \u0623\u0648 \u0625\u0633\u0627\u0621\u0629 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0642\u0633\u0627\u0626\u0645 \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A\u0629 \u0623\u0648 \u062A\u0642\u062F\u064A\u0645 \u0645\u0631\u0627\u062C\u0639 \u062A\u062D\u0648\u064A\u0644 \u0648\u0647\u0645\u064A\u0629\u060C \u0648\u064A\u062D\u0642 \u0644\u0644\u0625\u062F\u0627\u0631\u0629 \u062A\u0639\u0644\u064A\u0642 \u0623\u064A \u062D\u0633\u0627\u0628 \u0645\u062E\u0627\u0644\u0641 \u0641\u0648\u0631\u0627\u064B. \u062C\u0645\u064A\u0639 \u0627\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0629 \u0648\u0627\u0644\u0635\u0648\u0631 \u0648\u0627\u0644\u0645\u062D\u062A\u0648\u0649 \u0645\u062D\u0641\u0648\u0638\u0629 \u0644\u0623\u0635\u062D\u0627\u0628\u0647\u0627 \u0648\u0644\u0645\u0646\u0635\u0629 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643.",
        "",
        "6. \u0627\u0644\u0642\u0627\u0646\u0648\u0646 \u0627\u0644\u0648\u0627\u062C\u0628 \u0627\u0644\u062A\u0637\u0628\u064A\u0642",
        "\u062A\u062E\u0636\u0639 \u0647\u0630\u0647 \u0627\u0644\u0634\u0631\u0648\u0637 \u0648\u0627\u0644\u0623\u062D\u0643\u0627\u0645 \u0648\u062A\u064F\u0641\u0633\u0631 \u0648\u0641\u0642\u0627\u064B \u0644\u0644\u0642\u0648\u0627\u0646\u064A\u0646 \u0648\u0627\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0645\u0631\u0639\u064A\u0629 \u0627\u0644\u0625\u062C\u0631\u0627\u0621 \u0641\u064A \u0627\u0644\u062C\u0645\u0647\u0648\u0631\u064A\u0629 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A\u0629."
      ].join("\n")
    }
  },
  {
    id: "page-privacy",
    slug: "privacy",
    title: { en: "Privacy Policy", ar: "\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629" },
    body: {
      en: [
        "1. Information We Collect",
        "We collect only the information required to operate marketplace orders and accounts reliably: full name, Lebanese mobile phone (+961), email address, delivery governorate/district/town and street notes, saved wishlist/cart items, and storefront branch coordinates published by registered merchants.",
        "",
        "2. How Your Data Is Used",
        "Your contact and address details are shared strictly with the specific merchant(s) and delivery couriers fulfilling your sub-order(s), as well as for transactional emails, order notifications, dispute resolution, and fraud prevention.",
        "",
        "3. Security, Cookies & Local Storage",
        "Authenticated sessions use HttpOnly secure cookies paired with CSRF verification tokens. Passwords are stored exclusively as cryptographic salted hashes. For unauthenticated visitors, cart and wishlist preferences are stored locally in your browser (localStorage) until you choose to sign in.",
        "",
        "4. Payment Information",
        "Cash on Delivery (COD) and manual Whish Money / OMT transfers record only order totals and transfer references. Online card payments are processed through configured external payment gateways; NileLink never stores raw card numbers or CVV codes.",
        "",
        "5. Marketing Communications & Opt-Out",
        "You receive promotional broadcasts only when you explicitly subscribe. Every promotional email includes a single-click unsubscribe link.",
        "",
        "6. Your Rights & Support",
        "You may update your profile preferences, remove saved addresses, sign out of all active sessions, or request account deletion at any time via Account Settings or our Support Center."
      ].join("\n"),
      ar: [
        "1. \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u064A \u0646\u062C\u0645\u0639\u0647\u0627",
        "\u0646\u062C\u0645\u0639 \u0641\u0642\u0637 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0636\u0631\u0648\u0631\u064A\u0629 \u0644\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0648\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A: \u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644\u060C \u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0627\u0644\u0644\u0628\u0646\u0627\u0646\u064A (+961)\u060C \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u060C \u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 (\u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0629\u060C \u0627\u0644\u0642\u0636\u0627\u0621\u060C \u0627\u0644\u0628\u0644\u062F\u0629\u060C \u0648\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0628\u0646\u0649)\u060C \u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0641\u0636\u0644\u0629 \u0648\u0627\u0644\u062D\u0642\u064A\u0628\u0629\u060C \u0648\u0625\u062D\u062F\u0627\u062B\u064A\u0627\u062A \u0627\u0644\u0641\u0631\u0648\u0639 \u0627\u0644\u062A\u064A \u064A\u0646\u0634\u0631\u0647\u0627 \u0623\u0635\u062D\u0627\u0628 \u0627\u0644\u0645\u062A\u0627\u062C\u0631.",
        "",
        "2. \u0643\u064A\u0641\u064A\u0629 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A",
        "\u062A\u064F\u0633\u062A\u062E\u062F\u0645 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0648\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u062D\u0635\u0631\u064A\u0627\u064B \u0644\u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0641\u0631\u0639\u064A\u0629 \u0645\u0639 \u0627\u0644\u062A\u0627\u062C\u0631 \u0648\u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644\u060C \u0648\u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631\u0627\u062A \u062D\u0627\u0644\u0629 \u0627\u0644\u0637\u0644\u0628\u060C \u0648\u0645\u0639\u0627\u0644\u062C\u0629 \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0625\u0631\u062C\u0627\u0639 \u0623\u0648 \u0627\u0644\u0646\u0632\u0627\u0639\u0627\u062A \u0648\u0645\u0646\u0639 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0644.",
        "",
        "3. \u0627\u0644\u062D\u0645\u0627\u064A\u0629 \u0648\u0645\u0644\u0641\u0627\u062A \u062A\u0639\u0631\u064A\u0641 \u0627\u0644\u0627\u0631\u062A\u0628\u0627\u0637 \u0648\u0627\u0644\u062A\u062E\u0632\u064A\u0646 \u0627\u0644\u0645\u062D\u0644\u064A",
        "\u062A\u064F\u062F\u0627\u0631 \u062C\u0644\u0633\u0627\u062A \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0639\u0628\u0631 \u0645\u0644\u0641\u0627\u062A \u062A\u0639\u0631\u064A\u0641 \u0627\u0631\u062A\u0628\u0627\u0637 \u0622\u0645\u0646\u0629 (HttpOnly) \u0645\u062D\u0645\u064A\u0629 \u0628\u0631\u0645\u0648\u0632 CSRF\u060C \u0648\u062A\u064F\u062D\u0641\u0638 \u0643\u0644\u0645\u0627\u062A \u0627\u0644\u0645\u0631\u0648\u0631 \u0628\u062A\u0634\u0641\u064A\u0631 \u0623\u062D\u0627\u062F\u064A \u0627\u0644\u0627\u062A\u062C\u0627\u0647. \u0628\u0627\u0644\u0646\u0633\u0628\u0629 \u0644\u0644\u0632\u0648\u0627\u0631 \u063A\u064A\u0631 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646\u060C \u062A\u064F\u062D\u0641\u0638 \u0627\u0644\u0645\u0641\u0636\u0644\u0629 \u0648\u062D\u0642\u064A\u0628\u0629 \u0627\u0644\u062A\u0633\u0648\u0642 \u0645\u062D\u0644\u064A\u0627\u064B \u0639\u0644\u0649 \u0645\u062A\u0635\u0641\u062D\u0643 \u0641\u0642\u0637 \u062D\u062A\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644.",
        "",
        "4. \u0633\u0631\u064A\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062F\u0641\u0639",
        "\u0639\u0646\u062F \u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0623\u0648 \u0627\u0644\u062A\u062D\u0648\u064A\u0644 \u0639\u0628\u0631 Whish / OMT \u064A\u064F\u0633\u062C\u0644 \u0645\u0631\u062C\u0639 \u0627\u0644\u062A\u062D\u0648\u064A\u0644 \u0641\u0642\u0637 \u0644\u0644\u062A\u062D\u0642\u0642. \u0623\u0645\u0627 \u0627\u0644\u0645\u062F\u0641\u0648\u0639\u0627\u062A \u0628\u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0641\u062A\u062A\u0645 \u0639\u0628\u0631 \u0645\u0632\u0648\u062F \u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0645\u0639\u062A\u0645\u062F \u062F\u0648\u0646 \u0623\u0646 \u062A\u062E\u0632\u0646 \u0627\u0644\u0645\u0646\u0635\u0629 \u0623\u0631\u0642\u0627\u0645 \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A \u0623\u0648 \u0631\u0645\u0648\u0632 \u0627\u0644\u0623\u0645\u0627\u0646.",
        "",
        "5. \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A\u0629 \u0648\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643",
        "\u0644\u0627 \u0646\u0631\u0633\u0644 \u0646\u0634\u0631\u0627\u062A \u062A\u0631\u0648\u064A\u062C\u064A\u0629 \u0625\u0644\u0627 \u0628\u0639\u062F \u0645\u0648\u0627\u0641\u0642\u062A\u0643 \u0648\u0627\u0634\u062A\u0631\u0627\u0643\u0643 \u0627\u0644\u0635\u0631\u064A\u062D\u060C \u0645\u0639 \u062A\u0648\u0641\u064A\u0631 \u0631\u0627\u0628\u0637 \u0644\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0627\u0644\u0641\u0648\u0631\u064A \u0641\u064A \u0643\u0644 \u0631\u0633\u0627\u0644\u0629.",
        "",
        "6. \u062D\u0642\u0648\u0642\u0643 \u0648\u0627\u0644\u062A\u0648\u0627\u0635\u0644",
        "\u064A\u0645\u0643\u0646\u0643 \u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A\u0643\u060C \u062D\u0630\u0641 \u0639\u0646\u0627\u0648\u064A\u0646\u0643\u060C \u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u062C\u0644\u0633\u0627\u062A \u0645\u0646 \u0643\u0644 \u0627\u0644\u0623\u062C\u0647\u0632\u0629\u060C \u0623\u0648 \u0637\u0644\u0628 \u062D\u0630\u0641 \u0627\u0644\u062D\u0633\u0627\u0628 \u0639\u0628\u0631 \u0635\u0641\u062D\u0629 \u062D\u0633\u0627\u0628\u064A \u0623\u0648 \u0645\u0631\u0643\u0632 \u0627\u0644\u062F\u0639\u0645."
      ].join("\n")
    }
  },
  {
    id: "page-returns",
    slug: "returns",
    title: { en: "Return & Refund Policy", ar: "\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u0625\u0631\u062C\u0627\u0639" },
    body: {
      en: [
        "1. Standard 14-Day Return Window",
        "Eligible items may be returned within 14 calendar days from confirmed delivery, provided they remain unused, unwashed, with original tags, seals, serial numbers, and packaging intact (unless the item arrived damaged or defective). Individual merchants may specify extended store return terms directly on their storefront page.",
        "",
        "2. Non-Returnable Items",
        "For hygiene, safety, and authenticity reasons, opened personal care products, custom-tailored items, perishable food items, and software/digital activation codes cannot be returned unless defective or misrepresented.",
        "",
        "3. How to Request a Return or Dispute",
        "Open Orders & Tracking using your order number (or sign in to your Account), select the relevant seller sub-order, and submit a Return Request stating the reason. If a merchant disagrees or fails to respond within 48 business hours, you may escalate directly to an Admin Dispute.",
        "",
        "4. Return Shipping Responsibility",
        "If the product is defective, damaged in transit, or differs materially from verified specifications, the merchant covers return pickup fees in full. For size exchanges or change-of-mind returns, standard governorate courier fees apply.",
        "",
        "5. Inspection & Refund Timing",
        "Once the returned item is inspected by the merchant, approved refunds are issued within 3 to 5 business days back to your original payment channel (Whish Money, OMT, Card reversal, or cash settlement)."
      ].join("\n"),
      ar: [
        "1. \u0645\u0647\u0644\u0629 \u0627\u0644\u0625\u0631\u062C\u0627\u0639 \u0627\u0644\u0642\u064A\u0627\u0633\u064A\u0629 (14 \u064A\u0648\u0645\u0627\u064B)",
        "\u064A\u062D\u0642 \u0644\u0644\u0645\u0634\u062A\u0631\u064A \u0637\u0644\u0628 \u0625\u0631\u062C\u0627\u0639 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0624\u0647\u0644\u0629 \u062E\u0644\u0627\u0644 14 \u064A\u0648\u0645\u0627\u064B \u0645\u0646 \u062A\u0627\u0631\u064A\u062E \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645\u060C \u0628\u0634\u0631\u0637 \u0628\u0642\u0627\u0621 \u0627\u0644\u0645\u0646\u062A\u062C \u0628\u062D\u0627\u0644\u062A\u0647 \u0627\u0644\u0623\u0635\u0644\u064A\u0629 \u063A\u064A\u0631 \u0645\u0633\u062A\u062E\u062F\u0645 \u0648\u0645\u0639 \u0643\u0627\u0645\u0644 \u0627\u0644\u062A\u063A\u0644\u064A\u0641 \u0648\u0627\u0644\u0645\u0644\u0635\u0642\u0627\u062A \u0648\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062A\u0633\u0644\u0633\u0644\u064A (\u0628\u0627\u0633\u062A\u062B\u0646\u0627\u0621 \u062D\u0627\u0644\u0627\u062A \u0627\u0644\u062A\u0644\u0641 \u0623\u0648 \u0627\u0644\u0639\u064A\u0628 \u0627\u0644\u0645\u0635\u0646\u0639\u064A). \u0643\u0645\u0627 \u0642\u062F \u064A\u062D\u062F\u062F \u0628\u0639\u0636 \u0627\u0644\u062A\u062C\u0627\u0631 \u0633\u064A\u0627\u0633\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629 \u0648\u0627\u0636\u062D\u0629 \u0641\u064A \u0635\u0641\u062D\u0629 \u0645\u062A\u062C\u0631\u0647\u0645.",
        "",
        "2. \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u062B\u0646\u0627\u0629 \u0645\u0646 \u0627\u0644\u0625\u0631\u062C\u0627\u0639",
        "\u062D\u0631\u0635\u0627\u064B \u0639\u0644\u0649 \u0627\u0644\u0633\u0644\u0627\u0645\u0629 \u0648\u0627\u0644\u0635\u062D\u0629 \u0627\u0644\u0639\u0627\u0645\u0629\u060C \u0644\u0627 \u064A\u0634\u0645\u0644 \u0627\u0644\u0625\u0631\u062C\u0627\u0639 (\u0625\u0644\u0627 \u0641\u064A \u062D\u0627\u0644 \u0648\u062C\u0648\u062F \u0639\u064A\u0628 \u0623\u0648 \u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u0645\u0648\u0627\u0635\u0641\u0627\u062A): \u0645\u0633\u062A\u0644\u0632\u0645\u0627\u062A \u0627\u0644\u0639\u0646\u0627\u064A\u0629 \u0627\u0644\u0634\u062E\u0635\u064A\u0629 \u0627\u0644\u0645\u0641\u062A\u0648\u062D\u0629\u060C \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0641\u0635\u0644\u0629 \u062D\u0633\u0628 \u0627\u0644\u0637\u0644\u0628\u060C \u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u062A\u0644\u0641 \u0627\u0644\u0633\u0631\u064A\u0639\u060C \u0648\u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A \u0623\u0648 \u0627\u0644\u062A\u0631\u0627\u062E\u064A\u0635 \u0627\u0644\u0631\u0642\u0645\u064A\u0629 \u0627\u0644\u0645\u0641\u0639\u0651\u0644\u0629.",
        "",
        "3. \u062E\u0637\u0648\u0627\u062A \u062A\u0642\u062F\u064A\u0645 \u0637\u0644\u0628 \u0627\u0644\u0625\u0631\u062C\u0627\u0639 \u0623\u0648 \u0627\u0644\u0646\u0632\u0627\u0639",
        '\u0627\u0646\u062A\u0642\u0644 \u0625\u0644\u0649 \u0635\u0641\u062D\u0629 "\u0637\u0644\u0628\u0627\u062A\u064A \u0648\u062A\u062A\u0628\u0639 \u0627\u0644\u0634\u062D\u0646" \u0623\u0648 "\u062D\u0633\u0627\u0628\u064A"\u060C \u0648\u0627\u062E\u062A\u0631 \u0627\u0644\u0637\u0644\u0628 \u0627\u0644\u0641\u0631\u0639\u064A \u0627\u0644\u062E\u0627\u0635 \u0628\u0627\u0644\u062A\u0627\u062C\u0631\u060C \u062B\u0645 \u0627\u0636\u063A\u0637 \u0639\u0644\u0649 "\u0637\u0644\u0628 \u0625\u0631\u062C\u0627\u0639" \u0645\u0639 \u062A\u0648\u0636\u064A\u062D \u0627\u0644\u0633\u0628\u0628. \u0641\u064A \u062D\u0627\u0644 \u0639\u062F\u0645 \u0627\u0633\u062A\u062C\u0627\u0628\u0629 \u0627\u0644\u062A\u0627\u062C\u0631 \u062E\u0644\u0627\u0644 48 \u0633\u0627\u0639\u0629 \u0639\u0645\u0644\u060C \u064A\u0645\u0643\u0646\u0643 \u0641\u062A\u062D \u0646\u0632\u0627\u0639 \u0644\u062A\u062A\u062F\u062E\u0644 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0646\u0635\u0629 \u0648\u062A\u0641\u0635\u0644 \u0641\u064A \u0627\u0644\u0637\u0644\u0628.',
        "",
        "4. \u062A\u0643\u0644\u0641\u0629 \u0634\u062D\u0646 \u0627\u0644\u0625\u0631\u062C\u0627\u0639",
        "\u064A\u062A\u062D\u0645\u0644 \u0627\u0644\u062A\u0627\u062C\u0631 \u0643\u0627\u0645\u0644 \u0631\u0633\u0648\u0645 \u0634\u062D\u0646 \u0627\u0644\u0625\u0631\u062C\u0627\u0639 \u0625\u0630\u0627 \u0648\u0635\u0644 \u0627\u0644\u0645\u0646\u062A\u062C \u062A\u0627\u0644\u0641\u0627\u064B \u0623\u0648 \u0645\u0639\u064A\u0628\u0627\u064B \u0623\u0648 \u0645\u062E\u0627\u0644\u0641\u0627\u064B \u0644\u0644\u0645\u0648\u0627\u0635\u0641\u0627\u062A \u0627\u0644\u0645\u0639\u0644\u0646\u0629. \u0623\u0645\u0627 \u0641\u064A \u062D\u0627\u0644\u0627\u062A \u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0645\u0642\u0627\u0633 \u0623\u0648 \u0627\u0644\u0639\u062F\u0648\u0644 \u0639\u0646 \u0627\u0644\u0634\u0631\u0627\u0621 \u0641\u062A\u064F\u0637\u0628\u0642 \u0631\u0633\u0648\u0645 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629 \u0644\u0644\u0645\u0646\u0637\u0642\u0629.",
        "",
        "5. \u0627\u0644\u0641\u062D\u0635 \u0648\u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0627\u0644\u0645\u0628\u0627\u0644\u063A",
        "\u0628\u0639\u062F \u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0648\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u062D\u0627\u0644\u062A\u0647\u060C \u064A\u064F\u0639\u0627\u062F \u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0639\u062A\u0645\u062F \u062E\u0644\u0627\u0644 3 \u0625\u0644\u0649 5 \u0623\u064A\u0627\u0645 \u0639\u0645\u0644 \u0639\u0628\u0631 \u0646\u0641\u0633 \u0648\u0633\u064A\u0644\u0629 \u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0623\u0635\u0644\u064A\u0629 (Whish Money \u0623\u0648 OMT \u0623\u0648 \u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0623\u0648 \u0627\u0644\u062A\u0633\u0648\u064A\u0629 \u0627\u0644\u0646\u0642\u062F\u064A\u0629)."
      ].join("\n")
    }
  },
  {
    id: "page-seller-agreement",
    slug: "seller-agreement",
    title: { en: "Seller Agreement", ar: "\u0627\u062A\u0641\u0627\u0642\u064A\u0629 \u0627\u0644\u0628\u0627\u0626\u0639" },
    body: {
      en: [
        "1. Merchant Verification & Onboarding (KYC)",
        "To operate a storefront on NileLink, sellers must provide accurate legal identity details, a valid Commercial Registration reference (CR / \u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629), verified Lebanese phone/WhatsApp contact details, and accurate payout account information (Whish Money, OMT, or Bank Transfer).",
        "",
        "2. Product Accuracy, Stock & Pricing Integrity",
        "Sellers commit to publishing authentic items only, accurate technical specifications, real stock counts per SKU/variant, and clear base pricing in USD (automatically synced to LBP daily). Repeated cancellations due to out-of-stock listings affect storefront trust ratings.",
        "",
        "3. Fulfillment SLAs & Physical Store Locations",
        "Merchants must pack and dispatch confirmed sub-orders within their declared processing SLA (default 24 hours). Sellers operating physical showrooms or pickup branches may publish verified Google Maps coordinates and operating hours from their Seller Dashboard.",
        "",
        "4. Platform Commission & Subscription Tiers",
        "Each completed sub-order carries an itemized commission calculated in order of precedence: custom merchant override (if configured), category rate, or platform default rate, minus any commission discount granted by the seller\u2019s active subscription tier.",
        "",
        "5. Escrow Hold Period & Payout Releases",
        "Net seller earnings are credited to pending balance upon order confirmation and become eligible for payout withdrawal after the configured escrow hold window following confirmed delivery (providing buffer for return checks and buyer protection). Payouts settle via Whish Money, OMT, or bank transfer with traceable reference codes.",
        "",
        "6. Vacation Mode & Store Suspension",
        "Sellers taking scheduled leave must enable Vacation Mode in Storefront Settings to notify buyers transparently. NileLink reserves the right to pause storefronts or withhold disputed funds where counterfeit goods, unfulfilled orders, or policy violations occur."
      ].join("\n"),
      ar: [
        "1. \u0627\u0644\u062A\u0648\u062B\u064A\u0642 \u0648\u0627\u0639\u062A\u0645\u0627\u062F \u0627\u0644\u062A\u0627\u062C\u0631 (KYC)",
        "\u064A\u0634\u062A\u0631\u0637 \u0644\u062A\u0641\u0639\u064A\u0644 \u0623\u064A \u0645\u062A\u062C\u0631 \u0639\u0644\u0649 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643 \u062A\u0642\u062F\u064A\u0645 \u0628\u064A\u0627\u0646\u0627\u062A \u0642\u0627\u0646\u0648\u0646\u064A\u0629 \u0635\u062D\u064A\u062D\u0629\u060C \u0648\u0631\u0642\u0645 \u0645\u0631\u062C\u0639 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u062A\u062C\u0627\u0631\u064A \u0623\u0648 \u0627\u0644\u0645\u0627\u0644\u064A\u060C \u0648\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0648\u0648\u0627\u062A\u0633\u0627\u0628 \u0644\u0628\u0646\u0627\u0646\u064A \u0645\u0648\u062B\u0642\u060C \u0648\u062D\u0633\u0627\u0628 \u062A\u062D\u0648\u064A\u0644 \u0623\u0631\u0628\u0627\u062D \u0635\u0627\u0644\u062D (Whish Money \u0623\u0648 OMT \u0623\u0648 \u062D\u0633\u0627\u0628 \u0645\u0635\u0631\u0641\u064A).",
        "",
        "2. \u062F\u0642\u0629 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0648\u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0648\u0627\u0644\u062A\u0633\u0639\u064A\u0631",
        "\u064A\u0644\u062A\u0632\u0645 \u0627\u0644\u0628\u0627\u0626\u0639 \u0628\u0639\u0631\u0636 \u0645\u0646\u062A\u062C\u0627\u062A \u0623\u0635\u0644\u064A\u0629 \u0645\u0637\u0627\u0628\u0642\u0629 \u0644\u0644\u0645\u0648\u0627\u0635\u0641\u0627\u062A \u0627\u0644\u0645\u0648\u062B\u0642\u0629 \u0645\u0639 \u062A\u062D\u062F\u064A\u062B \u0643\u0645\u064A\u0627\u062A \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0644\u0643\u0644 \u062E\u064A\u0627\u0631 (SKU) \u0648\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0628\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0628\u0648\u0636\u0648\u062D. \u064A\u0624\u062B\u0631 \u062A\u0643\u0631\u0627\u0631 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0628\u0633\u0628\u0628 \u0646\u0641\u0627\u062F \u0627\u0644\u0643\u0645\u064A\u0629 \u0639\u0644\u0649 \u062A\u0635\u0646\u064A\u0641 \u0627\u0644\u062B\u0642\u0629 \u0627\u0644\u062E\u0627\u0635 \u0628\u0627\u0644\u0645\u062A\u062C\u0631.",
        "",
        "3. \u0645\u0647\u0644\u0629 \u0627\u0644\u062A\u062C\u0647\u064A\u0632 \u0648\u0641\u0631\u0648\u0639 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0639\u0644\u0649 \u0627\u0644\u062E\u0631\u064A\u0637\u0629",
        "\u064A\u0644\u062A\u0632\u0645 \u0627\u0644\u0628\u0627\u0626\u0639 \u0628\u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0641\u0631\u0639\u064A\u0629 \u0627\u0644\u0645\u0624\u0643\u062F\u0629 \u0648\u062A\u0633\u0644\u064A\u0645\u0647\u0627 \u0644\u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u062E\u0644\u0627\u0644 \u0627\u0644\u0645\u0647\u0644\u0629 \u0627\u0644\u0645\u062D\u062F\u062F\u0629 \u0641\u064A \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 (\u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A 24 \u0633\u0627\u0639\u0629). \u0643\u0645\u0627 \u064A\u0645\u0643\u0646 \u0644\u0644\u062A\u062C\u0627\u0631 \u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u0627\u0642\u0639 \u0641\u0631\u0648\u0639\u0647\u0645 \u0627\u0644\u0641\u0639\u0644\u064A\u0629 \u0648\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0639\u0645\u0644 \u0639\u0644\u0649 \u0627\u0644\u062E\u0631\u064A\u0637\u0629 \u0644\u0631\u0641\u0639 \u0645\u0648\u062B\u0648\u0642\u064A\u0629 \u0627\u0644\u0645\u062A\u062C\u0631 \u0623\u0645\u0627\u0645 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0646.",
        "",
        "4. \u0627\u0644\u0639\u0645\u0648\u0644\u0627\u062A \u0648\u0628\u0627\u0642\u0627\u062A \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643",
        "\u062A\u064F\u062D\u062A\u0633\u0628 \u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u0645\u0646\u0635\u0629 \u0639\u0644\u0649 \u0643\u0644 \u0637\u0644\u0628 \u0641\u0631\u0639\u064A \u0645\u0643\u062A\u0645\u0644 \u0628\u0634\u0641\u0627\u0641\u064A\u0629 \u062A\u0627\u0645\u0629 (\u0648\u0641\u0642 \u0646\u0633\u0628\u0629 \u0627\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u062E\u0627\u0635\u0629 \u0623\u0648 \u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u0641\u0626\u0629 \u0623\u0648 \u0627\u0644\u0646\u0633\u0628\u0629 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629 \u0644\u0644\u0645\u0646\u0635\u0629\u060C \u0645\u062E\u0635\u0648\u0645\u0627\u064B \u0645\u0646\u0647\u0627 \u0646\u0633\u0628\u0629 \u0627\u0644\u062A\u062E\u0641\u064A\u0636 \u0627\u0644\u0645\u0634\u0645\u0648\u0644\u0629 \u0641\u064A \u0628\u0627\u0642\u0629 \u0627\u0634\u062A\u0631\u0627\u0643 \u0627\u0644\u062A\u0627\u062C\u0631).",
        "",
        "5. \u0641\u062A\u0631\u0629 \u0627\u0644\u062D\u062C\u0632 \u0627\u0644\u0645\u0627\u0644\u064A \u0648\u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0623\u0631\u0628\u0627\u062D",
        "\u062A\u064F\u0642\u064A\u062F \u0635\u0627\u0641\u064A \u0623\u0631\u0628\u0627\u062D \u0627\u0644\u062A\u0627\u062C\u0631 \u0641\u064A \u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u0645\u0639\u0644\u0642 \u062B\u0645 \u062A\u0646\u062A\u0642\u0644 \u0625\u0644\u0649 \u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u0642\u0627\u0628\u0644 \u0644\u0644\u0633\u062D\u0628 \u0628\u0639\u062F \u0627\u0646\u0642\u0636\u0627\u0621 \u0641\u062A\u0631\u0629 \u0627\u0644\u062D\u062C\u0632 \u0627\u0644\u0645\u062D\u062F\u062F\u0629 \u0645\u0646 \u062A\u0627\u0631\u064A\u062E \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0636\u0645\u0627\u0646 \u062D\u0642\u0648\u0642 \u0627\u0644\u0625\u0631\u062C\u0627\u0639. \u062A\u062A\u0645 \u0627\u0644\u062A\u0633\u0648\u064A\u0627\u062A \u0639\u0628\u0631 Whish Money \u0623\u0648 OMT \u0623\u0648 \u0627\u0644\u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0645\u0635\u0631\u0641\u064A \u0645\u0639 \u0631\u0642\u0645 \u0645\u0631\u062C\u0639 \u0645\u0648\u062B\u0642 \u0644\u0643\u0644 \u062F\u0641\u0639\u0629.",
        "",
        "6. \u0648\u0636\u0639 \u0627\u0644\u0625\u062C\u0627\u0632\u0629 \u0648\u062A\u0639\u0644\u064A\u0642 \u0627\u0644\u0645\u062A\u062C\u0631",
        '\u0639\u0646\u062F \u062A\u0648\u0642\u0641 \u0627\u0644\u062A\u0627\u062C\u0631 \u0645\u0624\u0642\u062A\u0627\u064B \u0639\u0646 \u0627\u0644\u062A\u062C\u0647\u064A\u0632\u060C \u064A\u062C\u0628 \u062A\u0641\u0639\u064A\u0644 "\u0648\u0636\u0639 \u0627\u0644\u0625\u062C\u0627\u0632\u0629" \u0645\u0646 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 \u0644\u0625\u0628\u0644\u0627\u063A \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0628\u0648\u0636\u0648\u062D. \u062A\u062D\u062A\u0641\u0638 \u0625\u062F\u0627\u0631\u0629 \u0646\u0627\u064A\u0644 \u0644\u064A\u0646\u0643 \u0628\u062D\u0642 \u062A\u0639\u0644\u064A\u0642 \u0623\u064A \u0645\u062A\u062C\u0631 \u0623\u0648 \u062A\u062C\u0645\u064A\u062F \u0627\u0644\u062A\u0633\u0648\u064A\u0627\u062A \u0627\u0644\u0645\u0631\u062A\u0628\u0637\u0629 \u0628\u0646\u0632\u0627\u0639\u0627\u062A \u0642\u0627\u0626\u0645\u0629 \u0641\u064A \u062D\u0627\u0644 \u0645\u062E\u0627\u0644\u0641\u0629 \u0627\u0644\u0633\u064A\u0627\u0633\u0627\u062A \u0623\u0648 \u0639\u0631\u0636 \u0633\u0644\u0639 \u0645\u0642\u0644\u062F\u0629.'
      ].join("\n")
    }
  }
];
async function migrateLegacyHomeSections(db) {
  const rows = await db.query("SELECT id, section_type, title_json, content_json, status, audience, targeting_json FROM home_sections");
  if (rows.length === 0) return;
  const migratedSections = [];
  let alreadyUpToDateCount = 0;
  for (const row of rows) {
    const rawContent = typeof row.content_json === "string" ? JSON.parse(row.content_json) : row.content_json || {};
    const rawTitle = typeof row.title_json === "string" ? JSON.parse(row.title_json) : row.title_json || {};
    const { toType, content, changed } = migrateLegacySectionPayload(row.section_type, rawContent);
    const targeting = normalizeTargeting(
      row.targeting_json ? typeof row.targeting_json === "string" ? JSON.parse(row.targeting_json) : row.targeting_json : null,
      row.audience
    );
    if (changed || !row.targeting_json) {
      await db.execute(
        "UPDATE home_sections SET section_type = ?, content_json = ?, targeting_json = ? WHERE id = ?",
        [toType, JSON.stringify(content), JSON.stringify(targeting), row.id]
      );
    }
    if (changed) {
      migratedSections.push({
        id: row.id,
        fromType: row.section_type,
        toType,
        titleEn: rawTitle.en || row.id,
        status: row.status
      });
    } else {
      alreadyUpToDateCount++;
    }
  }
  let migratedVersionsCount = 0;
  const versionRows = await db.query(
    "SELECT id, snapshot_json FROM home_section_versions"
  );
  for (const vr of versionRows) {
    const snap = typeof vr.snapshot_json === "string" ? JSON.parse(vr.snapshot_json) : vr.snapshot_json || {};
    const rawType = String(snap.sectionType || "");
    const rawContent = snap.content || {};
    const { toType, content, changed } = migrateLegacySectionPayload(rawType, rawContent);
    if (changed) {
      const nextSnap = { ...snap, sectionType: toType, content };
      await db.execute("UPDATE home_section_versions SET snapshot_json = ? WHERE id = ?", [
        JSON.stringify(nextSnap),
        vr.id
      ]);
      migratedVersionsCount++;
    }
  }
  if (migratedSections.length > 0 || migratedVersionsCount > 0) {
    const report = {
      ranAt: (/* @__PURE__ */ new Date()).toISOString(),
      migratedSections,
      migratedVersionsCount,
      alreadyUpToDateCount
    };
    const keyCol = db.driver === "mysql" ? "`key`" : "key";
    await db.execute(
      db.driver === "mysql" ? `INSERT INTO settings (${keyCol}, value_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json)` : `INSERT INTO settings (${keyCol}, value_json) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json`,
      ["home_migration_report", JSON.stringify(report)]
    );
    console.log(
      `[NILELINK HOME MIGRATION] Migrated ${migratedSections.length} home sections and ${migratedVersionsCount} version snapshots from 15->18 practical blocks.`
    );
  }
}
async function ensureDefaultHomeSections(db) {
  await migrateLegacyHomeSections(db);
  const countRow = await db.queryOne("SELECT COUNT(*) AS cnt FROM home_sections");
  const now = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
  if (!countRow || Number(countRow.cnt) === 0) {
    const starterTypes = ["hero", "trust_cells", "category_tiles", "product_grid", "featured_stores"];
    for (let i = 0; i < starterTypes.length; i++) {
      const preset = HOME_SECTION_PRESETS.find((p) => p.type === starterTypes[i]);
      if (!preset) continue;
      const id = `hs-${starterTypes[i]}`;
      const verId = `hsv-${crypto.randomUUID()}`;
      const targeting = normalizeTargeting(null, "all");
      const style = { surface: "graphite", padding: "standard" };
      const snapshot = {
        sectionType: preset.type,
        title: preset.defaultTitle,
        content: preset.defaultContent,
        status: "published",
        visible: true,
        audience: "all",
        targeting,
        style,
        startsAt: null,
        endsAt: null
      };
      await db.execute(
        `INSERT INTO home_sections (id, section_type, title_json, content_json, sort_order, status, visible, audience, targeting_json, style_json, schedule_priority, starts_at, ends_at, version, updated_at)
         VALUES (?, ?, ?, ?, ?, 'published', 1, 'all', ?, ?, 0, NULL, NULL, 1, ?)`,
        [
          id,
          preset.type,
          JSON.stringify(preset.defaultTitle),
          JSON.stringify(preset.defaultContent),
          (i + 1) * 10,
          JSON.stringify(targeting),
          JSON.stringify(style),
          now
        ]
      );
      await db.execute(
        `INSERT INTO home_section_versions (id, section_id, version, change_note, snapshot_json, edited_by_user_id, created_at)
         VALUES (?, ?, 1, 'Initial default section', ?, NULL, ?)`,
        [verId, id, JSON.stringify(snapshot), now]
      );
    }
  }
  const tplCount = await db.queryOne("SELECT COUNT(*) AS cnt FROM home_section_templates");
  if (!tplCount || Number(tplCount.cnt) === 0) {
    for (const tmpl of STARTER_TEMPLATES) {
      await db.execute(
        `INSERT INTO home_section_templates (id, name_json, description_json, section_type, content_json, style_json, is_system, created_by_user_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, NULL, ?)`,
        [
          tmpl.id,
          JSON.stringify(tmpl.name),
          JSON.stringify(tmpl.description),
          tmpl.sectionType,
          JSON.stringify(tmpl.content),
          JSON.stringify({ surface: "graphite", padding: "standard" }),
          now
        ]
      );
    }
  }
  const snapCount = await db.queryOne("SELECT COUNT(*) AS cnt FROM home_page_snapshots");
  if (!snapCount || Number(snapCount.cnt) === 0) {
    const allSecs = await db.query("SELECT * FROM home_sections ORDER BY sort_order ASC");
    await db.execute(
      `INSERT INTO home_page_snapshots (id, version, status, change_note, sections_snapshot_json, chrome_snapshot_json, published_at, created_by_user_id, created_at)
       VALUES (?, 1, 'published', 'Initial page snapshot', ?, ?, ?, NULL, ?)`,
      [
        `hps-${crypto.randomUUID()}`,
        JSON.stringify(allSecs),
        JSON.stringify(DEFAULT_SITE_CHROME),
        now,
        now
      ]
    );
  }
}
async function ensureEssentialSeed(db) {
  for (const r of ESSENTIAL_ROLES) {
    await db.execute(
      `INSERT INTO roles (\`key\`, name, description) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`.replace(
        "ON CONFLICT DO NOTHING",
        db.driver === "mysql" ? "ON DUPLICATE KEY UPDATE name = VALUES(name)" : "ON CONFLICT(key) DO NOTHING"
      ),
      [r.key, r.name, r.description]
    );
  }
  for (const p of ESSENTIAL_PERMISSIONS) {
    await db.execute(
      db.driver === "mysql" ? "INSERT INTO permissions (`key`, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE description = VALUES(description)" : "INSERT OR IGNORE INTO permissions (key, description) VALUES (?, ?)",
      [p.key, p.description]
    );
  }
  for (const [roleKey, permKey] of ROLE_PERMISSION_MAP) {
    const id = `rp-${roleKey}-${permKey}`;
    await db.execute(
      db.driver === "mysql" ? "INSERT IGNORE INTO role_permissions (id, role_key, permission_key) VALUES (?, ?, ?)" : "INSERT OR IGNORE INTO role_permissions (id, role_key, permission_key) VALUES (?, ?, ?)",
      [id, roleKey, permKey]
    );
  }
  for (const z2 of DEFAULT_DELIVERY_ZONES) {
    await db.execute(
      db.driver === "mysql" ? "INSERT IGNORE INTO delivery_zones (governorate_code, name_json, platform_fee_usd_cents, eta_days) VALUES (?, ?, ?, ?)" : "INSERT OR IGNORE INTO delivery_zones (governorate_code, name_json, platform_fee_usd_cents, eta_days) VALUES (?, ?, ?, ?)",
      [z2.governorateCode, JSON.stringify(z2.name), z2.platformFeeUsdCents, z2.etaDays]
    );
  }
  const catCount = await db.queryOne("SELECT COUNT(*) as cnt FROM categories");
  if (!catCount || Number(catCount.cnt) === 0) {
    for (const c of ESSENTIAL_CATEGORIES) {
      await db.execute(
        "INSERT INTO categories (id, parent_id, slug, department, name_json, commission_bps, sort_order, active) VALUES (?, NULL, ?, ?, ?, ?, ?, 1)",
        [c.id, c.slug, c.department, JSON.stringify(c.name), c.commissionBps, c.sort]
      );
    }
  }
  for (const pl of ESSENTIAL_PLANS) {
    await db.execute(
      db.driver === "mysql" ? "INSERT IGNORE INTO subscription_plans (tier, name_json, monthly_fee_usd_cents, product_limit, commission_discount_bps, features_json) VALUES (?, ?, ?, ?, ?, ?)" : "INSERT OR IGNORE INTO subscription_plans (tier, name_json, monthly_fee_usd_cents, product_limit, commission_discount_bps, features_json) VALUES (?, ?, ?, ?, ?, ?)",
      [pl.tier, JSON.stringify(pl.name), pl.monthlyFeeUsdCents, pl.productLimit, pl.commissionDiscountBps, JSON.stringify(pl.features)]
    );
  }
  for (const tpl of ESSENTIAL_EMAIL_TEMPLATES) {
    await db.execute(
      db.driver === "mysql" ? "INSERT IGNORE INTO email_templates (`key`, subject_json, body_json) VALUES (?, ?, ?)" : "INSERT OR IGNORE INTO email_templates (key, subject_json, body_json) VALUES (?, ?, ?)",
      [tpl.key, JSON.stringify(tpl.subject), JSON.stringify(tpl.body)]
    );
  }
  const nowIso = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
  for (const pg of ESSENTIAL_PAGES) {
    await db.execute(
      db.driver === "mysql" ? "INSERT IGNORE INTO pages (id, slug, title_json, body_json, published) VALUES (?, ?, ?, ?, 1)" : "INSERT OR IGNORE INTO pages (id, slug, title_json, body_json, published) VALUES (?, ?, ?, ?, 1)",
      [pg.id, pg.slug, JSON.stringify(pg.title), JSON.stringify(pg.body)]
    );
    const existing = await db.queryOne(
      "SELECT body_json FROM pages WHERE slug = ?",
      [pg.slug]
    );
    if (existing) {
      const parsedBody = typeof existing.body_json === "string" ? JSON.parse(existing.body_json) : existing.body_json;
      const isLegacyDraft = String(parsedBody?.en || "").startsWith("Draft ") || String(parsedBody?.ar || "").startsWith("\u0645\u0633\u0648\u062F\u0629 ");
      if (isLegacyDraft) {
        await db.execute(
          "UPDATE pages SET title_json = ?, body_json = ?, published = 1, updated_at = ? WHERE slug = ?",
          [JSON.stringify(pg.title), JSON.stringify(pg.body), nowIso, pg.slug]
        );
      }
    }
  }
  const menuCount = await db.queryOne("SELECT COUNT(*) as cnt FROM menus");
  if (!menuCount || Number(menuCount.cnt) === 0) {
    await db.execute("INSERT INTO menus (id, location, items_json) VALUES (?, ?, ?)", [
      "menu-header",
      "header",
      JSON.stringify(DEFAULT_SITE_CHROME.headerLinks.map((l) => ({ label: l.label, url: l.url })))
    ]);
    await db.execute("INSERT INTO menus (id, location, items_json) VALUES (?, ?, ?)", [
      "menu-footer",
      "footer",
      JSON.stringify(DEFAULT_SITE_CHROME.footerColumns.flatMap((c) => c.links))
    ]);
  }
  const defaultSettings = {
    platform: {
      siteName: "NileLink",
      exchangeRateLbpPerUsd: 89500,
      defaultCommissionBps: 1e3,
      codFeeUsdCents: 150,
      holdPeriodDays: 3,
      maintenanceMode: false,
      announcement: { en: "", ar: "" }
    },
    payments: {
      codEnabled: true,
      whishManualEnabled: true,
      whishInstructions: {
        en: "Configure your live Whish / OMT receiving number in Admin Console \u2192 Settings before enabling.",
        ar: "\u0642\u0645 \u0628\u062A\u0639\u064A\u064A\u0646 \u0631\u0642\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 Whish / OMT \u0641\u064A \u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u2192 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0642\u0628\u0644 \u0627\u0644\u062A\u0641\u0639\u064A\u0644."
      },
      whishAccountNumber: "",
      cardEnabled: false
    },
    site_chrome_draft: DEFAULT_SITE_CHROME,
    site_chrome_published: DEFAULT_SITE_CHROME,
    home_migration_report: {
      ranAt: (/* @__PURE__ */ new Date()).toISOString(),
      migratedSections: [],
      migratedVersionsCount: 0,
      alreadyUpToDateCount: 0
    }
  };
  for (const [key, val] of Object.entries(defaultSettings)) {
    await db.execute(
      db.driver === "mysql" ? "INSERT IGNORE INTO settings (`key`, value_json) VALUES (?, ?)" : "INSERT OR IGNORE INTO settings (key, value_json) VALUES (?, ?)",
      [key, JSON.stringify(val)]
    );
  }
  await ensureDefaultHomeSections(db);
  const adminRow = await db.queryOne(
    "SELECT COUNT(*) as cnt FROM users WHERE role_key = 'admin_super' AND deleted_at IS NULL"
  );
  if (!adminRow || Number(adminRow.cnt) === 0) {
    const existingToken = await db.queryOne(
      "SELECT value_json FROM settings WHERE " + (db.driver === "mysql" ? "`key`" : "key") + " = 'admin_setup_token_hash'"
    );
    if (!existingToken) {
      const rawToken = crypto.randomBytes(24).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      await db.execute(
        db.driver === "mysql" ? "INSERT INTO settings (`key`, value_json) VALUES (?, ?)" : "INSERT INTO settings (key, value_json) VALUES (?, ?)",
        ["admin_setup_token_hash", JSON.stringify({ hash: tokenHash, createdAt: (/* @__PURE__ */ new Date()).toISOString() })]
      );
      console.log("====================================================================");
      console.log("[NILELINK FIRST-RUN SETUP] No super admin exists yet.");
      console.log(`[NILELINK FIRST-RUN SETUP] One-time Admin Setup Token: ${rawToken}`);
      console.log("[NILELINK FIRST-RUN SETUP] Open /admin to complete initial setup.");
      console.log("====================================================================");
      return { firstRunSetupToken: rawToken };
    }
  }
  return { firstRunSetupToken: null };
}

// server.ts
init_marketplaceRepo();
init_paymentAdapters();
init_currencyRate();
init_email();
init_jobs();

// server/services/securityHeaders.ts
import helmet from "helmet";
function buildCspDirectives(isDev) {
  return {
    "default-src": ["'self'"],
    "script-src": isDev ? [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://maps.googleapis.com",
      "https://maps.gstatic.com"
    ] : ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://maps.gstatic.com"],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "media-src": ["'self'", "blob:", "data:"],
    "worker-src": ["'self'", "blob:"],
    "connect-src": isDev ? [
      "'self'",
      "ws:",
      "wss:",
      "https://maps.googleapis.com",
      "https://maps.gstatic.com",
      "https://places.googleapis.com",
      "https://routes.googleapis.com",
      "https://open.er-api.com",
      "https://cdn.jsdelivr.net"
    ] : [
      "'self'",
      "https://maps.googleapis.com",
      "https://maps.gstatic.com",
      "https://places.googleapis.com",
      "https://routes.googleapis.com",
      "https://open.er-api.com",
      "https://cdn.jsdelivr.net"
    ],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": [
      "'self'",
      "https://aistudio.google.com",
      "https://*.aistudio.google.com",
      "https://*.googleusercontent.com",
      "https://*.run.app"
    ],
    ...isDev ? { "upgrade-insecure-requests": null } : {}
  };
}
function applySecurityHeaders(app, isDev) {
  app.disable("x-powered-by");
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: buildCspDirectives(isDev)
      },
      hsts: {
        maxAge: 31536e3,
        includeSubDomains: true,
        preload: true
      },
      noSniff: true,
      // Frame embedding is governed strictly by CSP frame-ancestors so preview iframes work safely.
      frameguard: false,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self), payment=(self)");
    next();
  });
}

// server/services/sitemapGenerator.ts
init_marketplaceRepo();
function escapeXml(raw) {
  return String(raw).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function normalizeBaseUrl(raw) {
  const clean = (raw || process.env.APP_URL || "").trim().replace(/\/+$/, "");
  if (clean && /^https?:\/\//i.test(clean)) return clean;
  return "https://nilelink.lb";
}
function buildSitemapEntries(input) {
  const base = normalizeBaseUrl(input.baseUrl);
  const noindexSet = new Set(
    (input.seo?.overrides || []).filter((o) => o.robots?.startsWith("noindex")).map((o) => `${o.entityType}:${o.entityKey}`)
  );
  const seen = /* @__PURE__ */ new Set();
  const entries = [];
  const addPath = (relPath, opts) => {
    const normalizedPath = relPath.startsWith("/") ? relPath : `/${relPath}`;
    const loc = `${base}${normalizedPath}`;
    if (seen.has(loc)) return;
    seen.add(loc);
    entries.push({
      loc,
      lastmod: opts?.lastmod ? String(opts.lastmod).slice(0, 10) : void 0,
      changefreq: opts?.changefreq,
      priority: opts?.priority
    });
  };
  if (!noindexSet.has("page:home")) addPath("/", { changefreq: "daily", priority: "1.0" });
  if (!noindexSet.has("page:catalog")) addPath("/catalog", { changefreq: "daily", priority: "0.9" });
  if (!noindexSet.has("page:stores")) addPath("/stores", { changefreq: "daily", priority: "0.8" });
  if (!noindexSet.has("page:support")) addPath("/support", { changefreq: "monthly", priority: "0.6" });
  if (!noindexSet.has("page:legal")) {
    addPath("/legal?tab=terms", { changefreq: "monthly", priority: "0.4" });
    addPath("/legal?tab=privacy", { changefreq: "monthly", priority: "0.4" });
    addPath("/legal?tab=returns", { changefreq: "monthly", priority: "0.4" });
    addPath("/legal?tab=seller", { changefreq: "monthly", priority: "0.4" });
  }
  addPath("/styleguide", { changefreq: "monthly", priority: "0.3" });
  for (const c of input.campaigns) {
    if (!c.slug || noindexSet.has(`campaign:${c.slug}`)) continue;
    addPath(`/campaign/${encodeURIComponent(c.slug)}`, {
      lastmod: c.endsAt || c.startsAt || c.createdAt || void 0,
      changefreq: "daily",
      priority: "0.8"
    });
  }
  for (const s of input.sellers) {
    if (!s.slug || noindexSet.has(`store:${s.slug}`)) continue;
    addPath(`/store/${encodeURIComponent(s.slug)}`, {
      lastmod: s.createdAt || void 0,
      changefreq: "weekly",
      priority: "0.8"
    });
  }
  for (const p of input.products) {
    if (!p.slug || noindexSet.has(`product:${p.slug}`)) continue;
    addPath(`/product/${encodeURIComponent(p.slug)}`, {
      lastmod: p.createdAt || void 0,
      changefreq: "daily",
      priority: "0.9"
    });
  }
  return entries;
}
function generateSitemapXml(input) {
  const entries = buildSitemapEntries(input);
  const xmlBody = entries.map((e) => {
    const lm = e.lastmod ? `<lastmod>${escapeXml(e.lastmod)}</lastmod>` : "";
    const cf = e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : "";
    const pr = e.priority ? `<priority>${e.priority}</priority>` : "";
    return `  <url><loc>${escapeXml(e.loc)}</loc>${lm}${cf}${pr}</url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlBody}
</urlset>
`;
}

// server.ts
init_security();
init_sms();

// server/services/storage.ts
import crypto6 from "node:crypto";
import fs2 from "node:fs";
import path2 from "node:path";
import sharp from "sharp";
init_security();
var MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
function detectMagicType(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 255 && buf[1] === 216 && buf[2] === 255) return "image/jpeg";
  if (buf[0] === 137 && buf[1] === 80 && buf[2] === 78 && buf[3] === 71) return "image/png";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") {
    return "image/webp";
  }
  if (buf.subarray(0, 5).toString("ascii") === "%PDF-") return "application/pdf";
  return null;
}
var LocalDiskStorageAdapter = class {
  constructor() {
    this.driverName = "local";
  }
  getUploadsRoot() {
    const dir = path2.join(getPersistentStorageDir(), "uploads");
    fs2.mkdirSync(dir, { recursive: true });
    return dir;
  }
  isConfigured() {
    return true;
  }
  async saveValidatedFile(params) {
    if (params.buffer.length === 0 || params.buffer.length > MAX_UPLOAD_BYTES) {
      throw new Error("File must be between 1 byte and 5 MB.");
    }
    const detected = detectMagicType(params.buffer);
    if (!detected) {
      throw new Error("Unsupported file signature. Only JPEG, PNG, WebP images (and PDF for KYC) are accepted.");
    }
    if (detected === "application/pdf" && params.entityType !== "seller_document") {
      throw new Error("PDF uploads are permitted only for seller KYC documents.");
    }
    const root = this.getUploadsRoot();
    const safeSubdir = params.entityType.replace(/[^a-z_]/g, "");
    const targetDir = path2.join(root, safeSubdir);
    fs2.mkdirSync(targetDir, { recursive: true });
    const id = crypto6.randomUUID();
    if (detected === "application/pdf") {
      const storageKey2 = `${safeSubdir}/${id}.pdf`;
      const absPath2 = this.resolveLocalPath(storageKey2);
      if (!absPath2) throw new Error("Invalid storage path.");
      await fs2.promises.writeFile(absPath2, params.buffer);
      return {
        storageDriver: "local",
        storageKey: storageKey2,
        publicUrl: `/uploads/${storageKey2}`,
        mimeType: "application/pdf",
        sizeBytes: params.buffer.length,
        width: null,
        height: null
      };
    }
    const pipeline = sharp(params.buffer).rotate().resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true }).webp({ quality: 84 });
    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
    const storageKey = `${safeSubdir}/${id}.webp`;
    const absPath = this.resolveLocalPath(storageKey);
    if (!absPath) throw new Error("Invalid storage path.");
    await fs2.promises.writeFile(absPath, data);
    return {
      storageDriver: "local",
      storageKey,
      publicUrl: `/uploads/${storageKey}`,
      mimeType: "image/webp",
      sizeBytes: data.length,
      width: info.width,
      height: info.height
    };
  }
  resolveLocalPath(storageKey) {
    const clean = storageKey.replace(/^\/+/, "");
    if (clean.includes("..") || !/^[a-z_]+\/[a-f0-9-]+\.(webp|pdf)$/i.test(clean)) {
      return null;
    }
    const root = this.getUploadsRoot();
    const resolved = path2.resolve(root, clean);
    if (!resolved.startsWith(root + path2.sep)) return null;
    return resolved;
  }
};
var S3StorageAdapterStub = class {
  constructor() {
    this.driverName = "s3";
  }
  isConfigured() {
    return Boolean(
      process.env.S3_ENDPOINT && process.env.S3_BUCKET && process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY
    );
  }
  async saveValidatedFile() {
    throw new Error("Needs my input: configure S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY, and S3_SECRET_KEY.");
  }
  resolveLocalPath() {
    return null;
  }
};
var localAdapter = new LocalDiskStorageAdapter();
var s3Adapter = new S3StorageAdapterStub();
function getStorageAdapter() {
  if ((process.env.STORAGE_DRIVER || "").toLowerCase() === "s3" && s3Adapter.isConfigured()) {
    return s3Adapter;
  }
  return localAdapter;
}
function getStorageStatus() {
  return {
    activeDriver: getStorageAdapter().driverName,
    persistentDir: getPersistentStorageDir(),
    s3Configured: s3Adapter.isConfigured()
  };
}
async function saveUploadedMedia(db, input) {
  const stripped = input.base64Data.replace(/^data:[^;]+;base64,/, "").trim();
  const buffer = Buffer.from(stripped, "base64");
  const adapter = getStorageAdapter();
  const saved = await adapter.saveValidatedFile({
    buffer,
    originalMime: input.mimeType,
    entityType: input.entityType,
    entityId: input.entityId,
    ownerUserId: input.ownerUserId
  });
  const mediaId = `med-${crypto6.randomUUID()}`;
  const folder = (input.folder || input.entityType || "general").replace(/[^a-z0-9_-]/gi, "").slice(0, 60) || "general";
  const focalX = Math.max(0, Math.min(100, Math.round(input.focalX ?? 50)));
  const focalY = Math.max(0, Math.min(100, Math.round(input.focalY ?? 50)));
  await db.execute(
    `INSERT INTO media (id, owner_user_id, entity_type, entity_id, folder, storage_driver, storage_key, public_url, mime_type, size_bytes, width, height, alt_json, focal_x, focal_y, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      mediaId,
      input.ownerUserId,
      input.entityType,
      input.entityId || null,
      folder,
      saved.storageDriver,
      saved.storageKey,
      saved.publicUrl,
      saved.mimeType,
      saved.sizeBytes,
      saved.width,
      saved.height,
      input.alt ? JSON.stringify(input.alt) : null,
      focalX,
      focalY,
      toSqlTimestamp()
    ]
  );
  return { mediaId, ...saved };
}

// server.ts
init_homeSections();
var startedAtMs = Date.now();
var rateBucket = /* @__PURE__ */ new Map();
function pruneRateBucket(now) {
  if (rateBucket.size < 2e3) return;
  for (const [key, entry] of rateBucket.entries()) {
    if (entry.resetAt < now) {
      rateBucket.delete(key);
    }
  }
  if (rateBucket.size >= 5e3) {
    const excess = rateBucket.size - 4e3;
    let removed = 0;
    for (const key of rateBucket.keys()) {
      rateBucket.delete(key);
      if (++removed >= excess) break;
    }
  }
}
function isSafeNavOrRelativeUrl(raw, allowRelative = true) {
  const v = (raw || "").trim();
  if (!v || /[\u0000-\u001F\u007F]/.test(v)) return false;
  if (v.startsWith("//")) return false;
  if (allowRelative && v.startsWith("/")) return true;
  try {
    const parsed = new URL(v);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}
function escapeCsvCell(raw) {
  const s = String(raw ?? "");
  const trimmedStart = s.replace(/^[\s\uFEFF\xA0]+/, "");
  const formulaSafe = /^[=+\-@\t\r]/.test(trimmedStart) ? `'${s}` : s;
  if (/[",\n\r]/.test(formulaSafe)) {
    return `"${formulaSafe.replace(/"/g, '""')}"`;
  }
  return formulaSafe;
}
function rateLimit(maxRequests, windowMs) {
  return (req, res, next) => {
    const key = `${getClientIp(req)}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    pruneRateBucket(now);
    const record = rateBucket.get(key);
    if (!record || record.resetAt < now) {
      rateBucket.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (record.count >= maxRequests) {
      return res.status(429).json({ error: "Too many requests. Please wait a moment and try again." });
    }
    record.count++;
    return next();
  };
}
function validateBody(schema, body) {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    throw new Error(first ? `${first.path.join(".") || "input"}: ${first.message}` : "Invalid request payload.");
  }
  return parsed.data;
}
async function createApp() {
  const db = await getDb();
  await ensureEssentialSeed(db);
  const repo = new MarketplaceRepo(db);
  void processPendingJobs(db).then((summary) => {
    if (summary.publishedHomeSnapshots > 0) repo.invalidateHomeCache();
  }).catch(() => {
  });
  const jobTimer = setInterval(() => {
    void processPendingJobs(db).then((summary) => {
      if (summary.publishedHomeSnapshots > 0) repo.invalidateHomeCache();
    }).catch(() => {
    });
  }, 6e4);
  jobTimer.unref();
  const app = express();
  app.set("trust proxy", 1);
  applySecurityHeaders(app, process.env.NODE_ENV !== "production");
  const configuredOrigin = (process.env.APP_URL || "").trim().replace(/\/+$/, "");
  app.use((req, res, next) => {
    const hostHeader = String(req.headers.host || "").trim().toLowerCase();
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        const normalized = origin.trim().replace(/\/+$/, "");
        if (configuredOrigin && normalized === configuredOrigin) return callback(null, true);
        if (hostHeader) {
          try {
            const parsedOrigin = new URL(normalized);
            if (parsedOrigin.host.toLowerCase() === hostHeader) {
              return callback(null, true);
            }
          } catch {
            return callback(null, false);
          }
        }
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized)) return callback(null, true);
        if (/^https:\/\/[a-z0-9-]+\.(aistudio\.google\.com|run\.app|googleusercontent\.com)$/i.test(normalized)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true
    })(req, res, next);
  });
  app.use(cookieParser());
  app.use(express.json({ limit: "8mb" }));
  app.use((req, res, next) => {
    const reqId = crypto7.randomBytes(6).toString("hex");
    req.requestId = reqId;
    const t0 = Date.now();
    res.on("finish", () => {
      if (req.path.startsWith("/api")) {
        console.log(`[HTTP] ${reqId} ${req.method} ${req.path} -> ${res.statusCode} (${Date.now() - t0}ms)`);
      }
    });
    next();
  });
  app.get("/uploads/*", (req, res) => {
    const rel = String(req.params[0] || "");
    const absPath = getStorageAdapter().resolveLocalPath(rel);
    if (!absPath || !fs3.existsSync(absPath)) {
      return res.status(404).json({ error: "File not found." });
    }
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=604800");
    return res.sendFile(absPath);
  });
  app.use("/api", async (req, _res, next) => {
    try {
      const rawToken = String(req.cookies?.[SESSION_COOKIE_NAME] || "").trim();
      if (rawToken) {
        const user = await getSessionUser(db, rawToken);
        if (user) req.authUser = user;
      }
      next();
    } catch (err) {
      next(err);
    }
  });
  app.use("/api", (req, res, next) => {
    const method = req.method.toUpperCase();
    if (method === "GET" || method === "HEAD" || method === "OPTIONS") return next();
    if (req.path === "/cron/run") return next();
    if (req.authUser) {
      const csrfHeader = String(req.headers["x-csrf-token"] || "");
      if (!csrfHeader || !timingSafeStringMatch(csrfHeader, req.authUser.csrfToken)) {
        return res.status(403).json({ error: "Invalid or missing CSRF token." });
      }
    }
    return next();
  });
  function requireAuth(req, res, next) {
    if (!req.authUser) return res.status(401).json({ error: "Authentication required." });
    next();
  }
  function requireSeller(req, res, next) {
    if (!req.authUser || !isSellerRole(req.authUser.roleKey) && !isAdminRole(req.authUser.roleKey)) {
      return res.status(403).json({ error: "Seller authorization required." });
    }
    next();
  }
  function requireSellerPerm(...permissions2) {
    return (req, res, next) => {
      if (!req.authUser || !isSellerRole(req.authUser.roleKey) && !isAdminRole(req.authUser.roleKey)) {
        return res.status(403).json({ error: "Seller authorization required." });
      }
      if (isAdminRole(req.authUser.roleKey) || req.authUser.roleKey === "seller_owner") {
        return next();
      }
      if (permissions2.length > 0 && !permissions2.some((p) => hasPermission(req.authUser, p))) {
        return res.status(403).json({ error: `Missing seller permission: ${permissions2.join(" or ")}` });
      }
      next();
    };
  }
  function requireSellerOwnerOrAdmin(req, res, next) {
    if (!req.authUser || req.authUser.roleKey !== "seller_owner" && !isAdminRole(req.authUser.roleKey)) {
      return res.status(403).json({ error: "Store owner or admin authorization required." });
    }
    next();
  }
  function resolveTargetSellerId(req) {
    if (req.authUser && isAdminRole(req.authUser.roleKey)) {
      const fromReq = typeof req.query.sellerId === "string" && req.query.sellerId ? req.query.sellerId : typeof req.body?.sellerId === "string" && req.body.sellerId ? req.body.sellerId : req.authUser.sellerId || "";
      return fromReq;
    }
    return req.authUser?.sellerId || "";
  }
  function requireAdminPerm(...permissions2) {
    return (req, res, next) => {
      if (!req.authUser || !isAdminRole(req.authUser.roleKey)) {
        return res.status(403).json({ error: "Admin authorization required." });
      }
      if (permissions2.length > 0 && !permissions2.some((p) => hasPermission(req.authUser, p))) {
        return res.status(403).json({ error: `Missing permission: ${permissions2.join(" or ")}` });
      }
      next();
    };
  }
  app.get("/api/health", async (_req, res) => {
    let dbHealthy = false;
    try {
      await db.queryOne("SELECT 1 AS ok");
      dbHealthy = true;
    } catch {
      dbHealthy = false;
    }
    const storage = getStorageStatus();
    res.status(dbHealthy ? 200 : 503).json({
      status: dbHealthy ? "ok" : "degraded",
      service: "NileLink Marketplace",
      dbDriver: db.driver,
      dbHealthy,
      storageDriver: storage.activeDriver,
      s3Configured: storage.s3Configured,
      emailConfigured: emailAdapter.isConfigured(),
      smsConfigured: smsAdapter.isConfigured(),
      cardGatewayConfigured: isCardGatewayConfigured(),
      uptimeSeconds: Math.round((Date.now() - startedAtMs) / 1e3)
    });
  });
  const resolvePublicBaseUrl = (req, canonicalOverride) => {
    const chosen = (canonicalOverride || process.env.APP_URL || "").trim().replace(/\/+$/, "");
    if (chosen && /^https?:\/\//i.test(chosen)) return chosen;
    const proto = req.headers["x-forwarded-proto"] ? String(req.headers["x-forwarded-proto"]).split(",")[0].trim() : req.protocol;
    const host = req.get("host") || "localhost:3000";
    return `${proto}://${host}`;
  };
  app.get("/robots.txt", async (req, res, next) => {
    try {
      const seo = await repo.getSeoMetadata();
      const base = resolvePublicBaseUrl(req, seo.global.canonicalBaseUrl);
      const txt = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /api/",
        "Disallow: /admin",
        "Disallow: /checkout",
        "Disallow: /account",
        `Sitemap: ${base}/sitemap.xml`
      ].join("\n");
      res.type("text/plain").send(txt);
    } catch (err) {
      next(err);
    }
  });
  app.get("/sitemap.xml", async (req, res, next) => {
    try {
      const [products2, sellers2, campaigns2, seo] = await Promise.all([
        repo.getPublicProducts(),
        repo.getPublicSellers(),
        repo.getActiveCampaigns(),
        repo.getSeoMetadata()
      ]);
      const baseUrl = resolvePublicBaseUrl(req, seo.global.canonicalBaseUrl);
      const xml = generateSitemapXml({
        baseUrl,
        products: products2,
        sellers: sellers2,
        campaigns: campaigns2,
        seo
      });
      res.type("application/xml").send(xml);
    } catch (err) {
      next(err);
    }
  });
  app.get("/api/seo", async (_req, res, next) => {
    try {
      res.json({ seoMetadata: await repo.getSeoMetadata() });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/cron/run", async (req, res, next) => {
    try {
      const expected = (process.env.CRON_SECRET || "").trim();
      const provided = String(req.headers["x-cron-secret"] || "");
      const adminAllowed = req.authUser && req.authUser.roleKey === "admin_super";
      if (!adminAllowed && (!expected || !provided || !timingSafeStringMatch(expected, provided))) {
        return res.status(403).json({ error: "Invalid cron authorization." });
      }
      const summary = await processPendingJobs(db);
      if (summary.publishedHomeSnapshots > 0) repo.invalidateHomeCache();
      res.json(summary);
    } catch (err) {
      next(err);
    }
  });
  app.get("/api/bootstrap", async (req, res, next) => {
    try {
      const locale = req.query.locale === "ar" ? "ar" : "en";
      const isAdmin = Boolean(req.authUser && isAdminRole(req.authUser.roleKey));
      const wantsDrafts = req.query.includeDrafts === "true" || req.query.includeDrafts === "1";
      const includeDrafts = Boolean(wantsDrafts && isAdmin);
      const asOf = isAdmin && typeof req.query.asOf === "string" && req.query.asOf.trim() ? req.query.asOf.trim() : null;
      const audiencePreview = isAdmin && typeof req.query.audiencePreview === "string" && req.query.audiencePreview.trim() ? req.query.audiencePreview.trim() : null;
      const device = req.query.device === "mobile" ? "mobile" : "desktop";
      const isNewVisitor = req.query.newVisitor === "true" || req.query.newVisitor === "1";
      const data = await repo.getBootstrapData({
        isLoggedIn: Boolean(req.authUser),
        isNewVisitor,
        locale,
        includeDrafts,
        asOf,
        audiencePreview,
        device
      });
      const mapsApiKey = (process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || "").trim();
      res.json({ ...data, ...mapsApiKey ? { mapsApiKey } : {} });
    } catch (err) {
      next(err);
    }
  });
  app.get("/api/fx/rate", async (_req, res, next) => {
    try {
      const plat = await repo.getPlatformSettings();
      const stale = !plat.fxLastUpdatedAt || Date.now() - Date.parse(plat.fxLastUpdatedAt) >= 864e5;
      if (stale && plat.fxAutoSyncEnabled !== false) {
        await syncDailyLbpRate(db);
      }
      const latest = await repo.getPlatformSettings();
      res.json({
        exchangeRateLbpPerUsd: latest.exchangeRateLbpPerUsd,
        fxLastUpdatedAt: latest.fxLastUpdatedAt ?? null,
        fxSource: latest.fxSource ?? "manual",
        fxAutoSyncEnabled: latest.fxAutoSyncEnabled !== false
      });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/admin/fx/sync", requireAdminPerm("settings.manage"), async (req, res) => {
    try {
      const result = await syncDailyLbpRate(db, {
        force: true,
        actorUserId: req.authUser.id,
        ipAddress: getClientIp(req)
      });
      const settings2 = await repo.getPlatformSettings();
      res.json({ ...result, settings: settings2 });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/newsletter/subscribe", rateLimit(15, 6e4), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          email: z.string().email().max(180),
          locale: z.enum(["en", "ar"]).default("en"),
          source: z.string().max(60).default("home")
        }),
        req.body
      );
      const result = await repo.subscribeNewsletter(body.email, body.locale, body.source);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/newsletter/unsubscribe", rateLimit(30, 6e4), async (req, res) => {
    const token = String(req.query.token || "").trim();
    const ok = await repo.unsubscribeNewsletterByToken(token);
    res.status(ok ? 200 : 404).type("text/html; charset=utf-8").send(`<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>NileLink Newsletter Preferences</title></head>
  <body style="margin:0;padding:48px 16px;background:#17181B;color:#F3EFE8;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;border:1px solid #30343B;background:#222428;padding:28px;">
      <div style="font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#EA580C;">NILELINK LEBANON</div>
      <h1 style="margin:10px 0 8px;font-size:22px;">${ok ? "You have been unsubscribed" : "Invalid unsubscribe link"}</h1>
      <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#C7C4BC;">
        ${ok ? "Your email address has been removed from NileLink marketing broadcasts and automated promotional emails." : "This unsubscribe token could not be found or has expired."}
      </p>
      <a href="/" style="display:inline-block;padding:10px 18px;border:1px solid #EA580C;color:#EA580C;text-decoration:none;font-size:12px;font-weight:bold;text-transform:uppercase;">Return to NileLink</a>
    </div>
  </body>
</html>`);
  });
  app.post("/api/banners/:id/track", rateLimit(120, 6e4), async (req, res) => {
    try {
      const body = validateBody(z.object({ event: z.enum(["impression", "click"]) }), req.body);
      const result = await repo.trackBannerEvent(req.params.id, body.event, {
        ip: getClientIp(req),
        userAgent: String(req.headers["user-agent"] || ""),
        sessionHint: req.authUser?.id || String(req.headers["x-forwarded-for"] || "")
      });
      res.json({ ok: true, ...result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/popups/:id/track", rateLimit(120, 6e4), async (req, res) => {
    try {
      const body = validateBody(z.object({ event: z.enum(["impression", "conversion", "dismissal"]) }), req.body);
      const result = await repo.trackMarketingEvent({
        kind: "popup",
        id: req.params.id,
        event: body.event,
        ip: getClientIp(req),
        userAgent: String(req.headers["user-agent"] || ""),
        sessionHint: req.authUser?.id || String(req.headers["x-forwarded-for"] || "")
      });
      res.json({ ok: true, ...result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/featured-placements/:id/track", rateLimit(120, 6e4), async (req, res) => {
    try {
      const body = validateBody(z.object({ event: z.enum(["impression", "click"]) }), req.body);
      const result = await repo.trackMarketingEvent({
        kind: "featured",
        id: req.params.id,
        event: body.event,
        ip: getClientIp(req),
        userAgent: String(req.headers["user-agent"] || ""),
        sessionHint: req.authUser?.id || String(req.headers["x-forwarded-for"] || "")
      });
      res.json({ ok: true, ...result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/products", async (req, res, next) => {
    try {
      const result = await repo.searchPublicProducts({
        q: String(req.query.q || ""),
        department: String(req.query.department || ""),
        sellerId: String(req.query.sellerId || ""),
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : void 0,
        minRating: req.query.minRating ? Number(req.query.minRating) : void 0,
        inStockOnly: req.query.inStock === "true",
        dealsOnly: req.query.deals === "true",
        sort: String(req.query.sort || "featured")
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });
  app.get("/api/products/:slug", async (req, res, next) => {
    try {
      const detail = await repo.getProductDetail(req.params.slug);
      if (!detail) return res.status(404).json({ error: "Product not found." });
      res.json(detail);
    } catch (err) {
      next(err);
    }
  });
  app.get("/api/stores/:slug", async (req, res, next) => {
    try {
      const detail = await repo.getStorefrontDetail(req.params.slug);
      if (!detail) return res.status(404).json({ error: "Storefront not found." });
      res.json(detail);
    } catch (err) {
      next(err);
    }
  });
  app.get("/api/pages/:slug", async (req, res, next) => {
    try {
      const page = await repo.getPageBySlug(req.params.slug);
      if (!page) return res.status(404).json({ error: "Page not found." });
      res.json({ page });
    } catch (err) {
      next(err);
    }
  });
  app.get("/api/campaigns/:slug", async (req, res, next) => {
    try {
      const campaign = await repo.getPublicCampaignBySlug(req.params.slug);
      if (!campaign) return res.status(404).json({ error: "Campaign not found." });
      const [allOffers, activeFlashSales] = await Promise.all([
        repo.getActiveOffers(),
        repo.getActiveFlashSales()
      ]);
      const linkedOffers = allOffers.filter(
        (o) => o.campaignId === campaign.id || campaign.featuredOfferIds.includes(o.id)
      );
      const linkedFlashSale = campaign.featuredFlashSaleId ? activeFlashSales.find((f) => f.id === campaign.featuredFlashSaleId) || null : null;
      res.json({ campaign, offers: linkedOffers, flashSale: linkedFlashSale });
    } catch (err) {
      next(err);
    }
  });
  app.get("/api/auth/me", async (req, res, next) => {
    try {
      if (!req.authUser) return res.json({ user: null });
      const [cart, wishlist] = await Promise.all([
        repo.getUserCart(req.authUser.id),
        repo.getUserWishlist(req.authUser.id)
      ]);
      res.json({
        user: {
          id: req.authUser.id,
          name: req.authUser.name,
          email: req.authUser.email,
          phone: req.authUser.phone,
          roleKey: req.authUser.roleKey,
          sellerId: req.authUser.sellerId,
          totpEnabled: req.authUser.totpEnabled,
          emailVerifiedAt: req.authUser.emailVerifiedAt,
          phoneVerifiedAt: req.authUser.phoneVerifiedAt,
          isFullyVerified: req.authUser.isFullyVerified,
          preferredLocale: req.authUser.preferredLocale,
          preferredCurrency: req.authUser.preferredCurrency,
          permissions: req.authUser.permissions
        },
        cart,
        wishlist
      });
    } catch (err) {
      next(err);
    }
  });
  const RegisterSchema = z.object({
    name: z.string().min(2).max(140),
    email: z.string().email().max(180),
    phone: z.string().min(7).max(40),
    password: z.string().min(8).max(128),
    locale: z.enum(["en", "ar"]).optional()
  });
  app.post("/api/auth/register", rateLimit(15, 6e4), async (req, res) => {
    try {
      const body = validateBody(RegisterSchema, req.body);
      const user = await repo.registerCustomer({ ...body, ipAddress: getClientIp(req) });
      const ses = await createSession(db, user.id, req);
      setSessionCookies(req, res, ses.rawToken, ses.csrfToken);
      res.status(201).json({
        user: {
          ...user,
          totpEnabled: false,
          emailVerifiedAt: null,
          phoneVerifiedAt: null,
          isFullyVerified: false,
          preferredLocale: body.locale || "en",
          preferredCurrency: "USD",
          permissions: []
        }
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  const LoginSchema = z.object({
    identifier: z.string().min(3).max(190).optional(),
    email: z.string().min(3).max(190).optional(),
    password: z.string().min(1),
    totpCode: z.string().optional()
  }).refine((d) => Boolean((d.identifier || d.email || "").trim()), "Email or phone number is required.");
  app.post("/api/auth/login", rateLimit(20, 6e4), async (req, res) => {
    try {
      const body = validateBody(LoginSchema, req.body);
      const logged = await repo.loginUser({ ...body, ipAddress: getClientIp(req) });
      const ses = await rotateSession(db, req.authUser?.sessionId, logged.id, req);
      setSessionCookies(req, res, ses.rawToken, ses.csrfToken);
      const fullUser = await getSessionUser(db, ses.rawToken);
      res.json({ user: fullUser });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  });
  app.post("/api/auth/logout", async (req, res) => {
    if (req.authUser) {
      await revokeSession(db, req.authUser.sessionId);
    }
    clearSessionCookies(req, res);
    res.json({ ok: true });
  });
  app.post("/api/auth/logout-all", requireAuth, async (req, res) => {
    await revokeAllUserSessions(db, req.authUser.id);
    clearSessionCookies(req, res);
    res.json({ ok: true });
  });
  app.post("/api/auth/2fa/enroll", requireAuth, async (req, res) => {
    try {
      const result = await repo.startTotpEnrollment(req.authUser.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/auth/2fa/verify", requireAuth, async (req, res) => {
    try {
      const { code } = validateBody(z.object({ code: z.string().min(6).max(10) }), req.body);
      const result = await repo.confirmTotpEnrollment(req.authUser.id, code);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/auth/forgot-password", rateLimit(10, 6e4), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          identifier: z.string().min(3).max(190).optional(),
          email: z.string().min(3).max(190).optional(),
          channel: z.enum(["email", "sms"]).optional()
        }).refine((d) => Boolean((d.identifier || d.email || "").trim()), "Email or phone number is required."),
        req.body
      );
      const result = await repo.requestPasswordResetOtp(body, getClientIp(req));
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/auth/forgot-password/verify-otp", rateLimit(15, 6e4), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          identifier: z.string().min(3).max(190),
          code: z.string().min(4).max(12),
          channel: z.enum(["email", "sms"]).optional()
        }),
        req.body
      );
      const result = await repo.verifyPasswordResetOtp(body, getClientIp(req));
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/auth/reset-password", rateLimit(10, 6e4), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          token: z.string().min(16).max(160),
          newPassword: z.string().min(8).max(128)
        }),
        req.body
      );
      const result = await repo.confirmPasswordReset(body.token, body.newPassword, getClientIp(req));
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/auth/verification/send", requireAuth, rateLimit(10, 6e4), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          channel: z.enum(["email", "phone"]),
          target: z.string().max(190).optional()
        }),
        req.body
      );
      const result = await repo.requestAuthVerificationOtp(req.authUser.id, body, getClientIp(req));
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/auth/verification/confirm", requireAuth, rateLimit(15, 6e4), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          channel: z.enum(["email", "phone"]),
          code: z.string().min(4).max(12)
        }),
        req.body
      );
      const result = await repo.confirmAuthVerificationOtp(req.authUser.id, body, getClientIp(req));
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/auth/otp/request", rateLimit(10, 6e4), async (req, res) => {
    try {
      const body = validateBody(z.object({ identifier: z.string().min(3).max(190) }), req.body);
      const result = await repo.requestLoginOtp(body.identifier, getClientIp(req));
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/auth/otp/verify", rateLimit(15, 6e4), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          identifier: z.string().min(3).max(190),
          code: z.string().min(4).max(12),
          totpCode: z.string().optional()
        }),
        req.body
      );
      const logged = await repo.verifyLoginOtp(body, getClientIp(req));
      const ses = await rotateSession(db, req.authUser?.sessionId, logged.id, req);
      setSessionCookies(req, res, ses.rawToken, ses.csrfToken);
      const fullUser = await getSessionUser(db, ses.rawToken);
      res.json({ user: fullUser });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  });
  app.get("/api/chat/conversations", requireAuth, async (req, res, next) => {
    try {
      const sellerFilter = req.query.sellerId ? String(req.query.sellerId) : void 0;
      const conversations = await repo.listChatConversations(req.authUser, sellerFilter);
      res.json({ conversations });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/chat/conversations", requireAuth, rateLimit(30, 6e4), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          sellerId: z.string().min(1).max(64),
          productId: z.string().max(64).optional(),
          body: z.string().min(1).max(2e3)
        }),
        req.body
      );
      const result = await repo.startOrSendChatConversation(req.authUser, body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/chat/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      const data = await repo.getChatConversationMessages(req.params.id, req.authUser);
      res.json(data);
    } catch (err) {
      const msg = err.message;
      res.status(msg.startsWith("Forbidden") ? 403 : 404).json({ error: msg });
    }
  });
  app.post("/api/chat/conversations/:id/messages", requireAuth, rateLimit(40, 6e4), async (req, res) => {
    try {
      const { body } = validateBody(z.object({ body: z.string().min(1).max(2e3) }), req.body);
      const message = await repo.sendChatMessage(req.params.id, req.authUser, body);
      res.status(201).json({ message });
    } catch (err) {
      const msg = err.message;
      res.status(msg.startsWith("Forbidden") ? 403 : 400).json({ error: msg });
    }
  });
  app.patch("/api/chat/conversations/:id", requireAuth, async (req, res) => {
    try {
      const { status } = validateBody(z.object({ status: z.enum(["open", "closed"]) }), req.body);
      await repo.updateChatConversationStatus(req.params.id, req.authUser, status);
      res.json({ ok: true });
    } catch (err) {
      const msg = err.message;
      res.status(msg.startsWith("Forbidden") ? 403 : 400).json({ error: msg });
    }
  });
  app.get("/api/admin/auth-status", async (_req, res, next) => {
    try {
      res.json(await repo.getAdminSetupStatus());
    } catch (err) {
      next(err);
    }
  });
  const InitialAdminSetupSchema = z.object({
    setupToken: z.string().min(16),
    name: z.string().min(2).max(140),
    email: z.string().email(),
    phone: z.string().min(7).max(40),
    password: z.string().min(8).max(128)
  });
  app.post("/api/admin/initial-setup", rateLimit(10, 6e4), async (req, res) => {
    try {
      const body = validateBody(InitialAdminSetupSchema, req.body);
      const created = await repo.setupInitialAdmin({ ...body, ipAddress: getClientIp(req) });
      const ses = await createSession(db, created.userId, req);
      setSessionCookies(req, res, ses.rawToken, ses.csrfToken);
      const fullUser = await getSessionUser(db, ses.rawToken);
      res.status(201).json({
        user: fullUser,
        totpSecret: created.totpSecret,
        otpauthUri: created.otpauthUri
      });
    } catch (err) {
      res.status(409).json({ error: err.message });
    }
  });
  const UploadSchema = z.object({
    base64Data: z.string().min(10),
    mimeType: z.string().min(5).max(80),
    entityType: z.enum(["product_image", "store_logo", "store_banner", "seller_document", "editorial_image"]),
    entityId: z.string().optional(),
    docType: z.string().optional(),
    folder: z.string().max(60).optional(),
    alt: z.object({ en: z.string().max(240), ar: z.string().max(240) }).optional(),
    focalX: z.number().min(0).max(100).optional(),
    focalY: z.number().min(0).max(100).optional()
  });
  app.post("/api/uploads", requireAuth, rateLimit(30, 6e4), async (req, res) => {
    try {
      const body = validateBody(UploadSchema, req.body);
      const saved = await saveUploadedMedia(db, {
        base64Data: body.base64Data,
        mimeType: body.mimeType,
        entityType: body.entityType,
        entityId: body.entityId,
        ownerUserId: req.authUser.id,
        folder: body.folder,
        alt: body.alt ?? null,
        focalX: body.focalX,
        focalY: body.focalY
      });
      if (body.entityType === "seller_document" && req.authUser.sellerId) {
        await repo.attachSellerDocument(req.authUser.sellerId, body.docType || "commercial_registration", saved.mediaId);
      }
      res.status(201).json({ media: saved });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put("/api/account/cart", requireAuth, async (req, res, next) => {
    try {
      const body = validateBody(
        z.object({
          items: z.array(
            z.object({
              productId: z.string().min(1),
              variantId: z.string().min(1),
              quantity: z.number().int().min(1).max(99)
            })
          )
        }),
        req.body
      );
      await repo.saveUserCart(req.authUser.id, body.items);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });
  app.get("/api/account/wishlist", requireAuth, async (req, res, next) => {
    try {
      const wishlist = await repo.getUserWishlist(req.authUser.id);
      res.json({ wishlist });
    } catch (err) {
      next(err);
    }
  });
  app.put("/api/account/wishlist", requireAuth, async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          productIds: z.array(z.string().min(1).max(80)).max(200)
        }),
        req.body
      );
      const wishlist = await repo.syncUserWishlist(req.authUser.id, body.productIds);
      res.json({ wishlist });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/account/wishlist/toggle", requireAuth, async (req, res) => {
    try {
      const body = validateBody(z.object({ productId: z.string().min(1).max(80) }), req.body);
      const result = await repo.toggleUserWishlist(req.authUser.id, body.productId);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/account/wishlist/:productId", requireAuth, async (req, res) => {
    try {
      const wishlist = await repo.removeUserWishlistItem(req.authUser.id, req.params.productId);
      res.json({ wishlist });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/account/profile", requireAuth, async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          name: z.string().min(2).max(140).optional(),
          phone: z.string().min(7).max(40).optional(),
          preferredLocale: z.enum(["en", "ar"]).optional(),
          preferredCurrency: z.enum(["USD", "LBP"]).optional()
        }),
        req.body
      );
      const profile = await repo.updateAccountProfile(req.authUser.id, body);
      res.json({ profile });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/account/addresses", requireAuth, async (req, res, next) => {
    try {
      res.json({ addresses: await repo.getUserAddresses(req.authUser.id) });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/account/addresses", requireAuth, async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          label: z.string().min(2).max(80),
          governorate: z.string().min(2).max(60),
          district: z.string().min(2).max(60),
          town: z.string().min(1).max(100),
          phone: z.string().min(7).max(40),
          notes: z.string().max(400).optional(),
          isDefault: z.boolean().optional()
        }),
        req.body
      );
      const address = await repo.createUserAddress(req.authUser.id, body);
      res.status(201).json({ address });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/account/addresses/:id", requireAuth, async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          label: z.string().min(2).max(80).optional(),
          governorate: z.string().min(2).max(60).optional(),
          district: z.string().min(2).max(60).optional(),
          town: z.string().min(1).max(100).optional(),
          phone: z.string().min(7).max(40).optional(),
          notes: z.string().max(400).optional(),
          isDefault: z.boolean().optional()
        }),
        req.body
      );
      const address = await repo.updateUserAddress(req.authUser.id, req.params.id, body);
      res.json({ address });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/account/addresses/:id", requireAuth, async (req, res) => {
    try {
      await repo.deleteUserAddress(req.authUser.id, req.params.id);
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/account/notifications", requireAuth, async (req, res, next) => {
    try {
      const [notifications2, preferences] = await Promise.all([
        repo.getUserNotifications(req.authUser.id),
        repo.getNotificationPreferences(req.authUser.id)
      ]);
      const unreadCount = notifications2.filter((n) => !n.readAt).length;
      res.json({ notifications: notifications2, unreadCount, preferences });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/account/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      const result = await repo.markNotificationRead(req.authUser.id, req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/account/notifications/preferences", requireAuth, async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          emailSummaryEnabled: z.boolean().optional(),
          summaryFrequency: z.enum(["instant", "daily", "weekly", "off"]).optional(),
          orderUpdates: z.boolean().optional(),
          priceDrops: z.boolean().optional(),
          promotionalOffers: z.boolean().optional()
        }),
        req.body
      );
      const preferences = await repo.updateNotificationPreferences(req.authUser.id, body);
      res.json({ preferences });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/account/notifications/email-summary", requireAuth, rateLimit(5, 6e4), async (req, res) => {
    try {
      const summary = await sendNotificationSummaryForUser(db, req.authUser.id, { force: true });
      res.json({
        ok: summary.ok,
        sentCount: summary.sentCount,
        status: summary.status,
        error: summary.error || null,
        previewSubject: summary.previewSubject,
        lastSummarySentAt: summary.lastSummarySentAt
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/account/cases", requireAuth, async (req, res, next) => {
    try {
      res.json(await repo.getUserCases(req.authUser.id));
    } catch (err) {
      next(err);
    }
  });
  app.get("/api/support-tickets", requireAuth, async (req, res, next) => {
    try {
      res.json({ tickets: await repo.getUserSupportTickets(req.authUser.id) });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/support-tickets", rateLimit(15, 6e4), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          email: z.string().email().max(180).optional(),
          subject: z.string().min(3).max(200),
          message: z.string().min(10).max(4e3)
        }),
        req.body
      );
      const email = body.email || req.authUser?.email;
      if (!email) {
        return res.status(400).json({ error: "Email address is required." });
      }
      const ticket = await repo.createSupportTicket({
        userId: req.authUser?.id || null,
        email,
        subject: body.subject,
        message: body.message
      });
      res.status(201).json({ ticket });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/coupons/validate", async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          code: z.string().min(2),
          subtotalUsdCents: z.number().int().nonnegative(),
          sellerIds: z.array(z.string()),
          customerPhone: z.string().max(40).optional()
        }),
        req.body
      );
      const coupon = await repo.validateCoupon(body.code, body.subtotalUsdCents, body.sellerIds, {
        userId: req.authUser?.id || null,
        customerPhone: body.customerPhone || null
      });
      res.json({ coupon });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  const OrderCreateSchema = z.object({
    customerName: z.string().min(2).max(140),
    customerPhone: z.string().min(7).max(40),
    governorate: z.string().min(2).max(60),
    district: z.string().min(2).max(60),
    town: z.string().min(1).max(100),
    addressNotes: z.string().max(500).default(""),
    paymentMethod: z.enum(["cod", "whish_manual", "card"]),
    transferReference: z.string().optional(),
    couponCode: z.string().optional(),
    items: z.array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().min(1),
        quantity: z.number().int().min(1).max(99)
      })
    ).min(1)
  });
  app.post("/api/orders", rateLimit(15, 6e4), async (req, res) => {
    try {
      const body = validateBody(OrderCreateSchema, req.body);
      const order = await repo.createOrder(
        {
          userId: req.authUser?.id || null,
          ...body
        },
        getClientIp(req)
      );
      res.status(201).json({ order });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/orders/lookup", async (req, res, next) => {
    try {
      const orders2 = await repo.lookupOrders({
        user: req.authUser,
        orderNumber: String(req.query.orderNumber || ""),
        phone: String(req.query.phone || "")
      });
      const subOrderIds = orders2.flatMap((o) => o.subOrders.map((s) => s.id));
      const cases = await repo.getCasesForSubOrders(subOrderIds);
      res.json({ orders: orders2, ...cases });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/returns", rateLimit(15, 6e4), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          subOrderId: z.string().min(1),
          reason: z.string().min(5).max(1200),
          orderNumber: z.string().max(60).optional(),
          phone: z.string().max(40).optional()
        }),
        req.body
      );
      const ret = await repo.createReturnRequest({
        subOrderId: body.subOrderId,
        userId: req.authUser?.id || null,
        orderNumber: body.orderNumber,
        phone: body.phone,
        reason: body.reason
      });
      res.status(201).json({ returnRequest: ret });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/disputes", rateLimit(15, 6e4), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          subOrderId: z.string().min(1),
          reason: z.string().min(5).max(1500),
          orderNumber: z.string().max(60).optional(),
          phone: z.string().max(40).optional()
        }),
        req.body
      );
      const dispute = await repo.createDispute({
        subOrderId: body.subOrderId,
        userId: req.authUser?.id || null,
        orderNumber: body.orderNumber,
        phone: body.phone,
        reason: body.reason
      });
      res.status(201).json({ dispute });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/reviews", requireAuth, async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          productId: z.string().min(1),
          rating: z.number().int().min(1).max(5),
          comment: z.string().min(4).max(1e3)
        }),
        req.body
      );
      const review = await repo.addVerifiedReview({
        productId: body.productId,
        userId: req.authUser.id,
        rating: body.rating,
        comment: body.comment
      });
      res.status(201).json({ review });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  const SellerRegisterSchema = z.object({
    ownerName: z.string().min(2).max(140),
    email: z.string().email(),
    phone: z.string().min(7).max(40),
    password: z.string().min(8).max(128),
    storeNameEn: z.string().min(2).max(140),
    storeNameAr: z.string().optional(),
    department: z.enum(["fashion", "electronics", "home-gadgets"]),
    governorate: z.string().min(2),
    district: z.string().min(2),
    commercialRegRef: z.string().min(3).max(120),
    payoutMethod: z.enum(["whish", "omt", "bank"]),
    payoutAccount: z.string().min(4).max(180)
  });
  app.post("/api/sellers/register", rateLimit(10, 6e4), async (req, res) => {
    try {
      const body = validateBody(SellerRegisterSchema, req.body);
      const result = await repo.registerSeller({ ...body, ipAddress: getClientIp(req) });
      const ses = await createSession(db, result.user.id, req);
      setSessionCookies(req, res, ses.rawToken, ses.csrfToken);
      const fullUser = await getSessionUser(db, ses.rawToken);
      res.status(201).json({ user: fullUser, seller: result.seller });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/seller/workspace", requireSeller, async (req, res, next) => {
    try {
      const targetSellerId = isAdminRole(req.authUser.roleKey) && req.query.sellerId ? String(req.query.sellerId) : req.authUser.sellerId;
      if (!targetSellerId) return res.status(400).json({ error: "Seller ID required." });
      res.json(await repo.getSellerWorkspace(targetSellerId));
    } catch (err) {
      next(err);
    }
  });
  app.patch("/api/seller/profile", requireSeller, async (req, res) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      const body = validateBody(
        z.object({
          nameEn: z.string().min(2).max(160).optional(),
          nameAr: z.string().min(2).max(160).optional(),
          taglineEn: z.string().max(190).optional(),
          taglineAr: z.string().max(190).optional(),
          aboutEn: z.string().max(2e3).optional(),
          aboutAr: z.string().max(2e3).optional(),
          announcementEn: z.string().max(240).optional(),
          announcementAr: z.string().max(240).optional(),
          returnPolicyEn: z.string().max(1200).optional(),
          returnPolicyAr: z.string().max(1200).optional(),
          processingHours: z.number().int().min(1).max(360).optional(),
          vacationMode: z.boolean().optional(),
          workingHours: z.record(z.string().max(32), z.string().max(80)).optional(),
          seoTitle: z.string().max(160).optional(),
          seoDescription: z.string().max(320).optional(),
          storefrontTheme: z.enum(["obsidian-ember", "sand-atelier", "cyan-lab", "sage-studio"]).optional(),
          deliveryMode: z.enum(["platform", "self"]).optional(),
          selfDeliveryFeesUsdCents: z.record(z.string(), z.number().int().min(0).max(5e4)).optional(),
          payoutMethod: z.enum(["whish", "omt", "bank"]).optional(),
          payoutAccount: z.string().min(3).max(180).optional(),
          phone: z.string().min(6).max(40).optional(),
          whatsappPhone: z.string().min(6).max(40).optional(),
          communicationPrefs: z.object({
            whatsappEnabled: z.boolean(),
            whatsappGreeting: z.string().max(300).optional(),
            systemChatEnabled: z.boolean(),
            phoneCallsEnabled: z.boolean(),
            preferredChannel: z.enum(["whatsapp", "system_chat", "phone"])
          }).optional(),
          cityAddress: z.string().max(255).optional(),
          bannerMediaId: z.string().optional(),
          logoMediaId: z.string().optional(),
          locations: z.array(
            z.object({
              id: z.string().min(1).max(64),
              label: z.string().min(1).max(120),
              address: z.string().max(240),
              governorate: z.string().min(1).max(60),
              district: z.string().max(80),
              lat: z.number().min(-90).max(90),
              lng: z.number().min(-180).max(180),
              placeId: z.string().max(140).nullable().optional(),
              phone: z.string().max(40).nullable().optional(),
              hours: z.string().max(120).nullable().optional(),
              isPrimary: z.boolean().optional()
            })
          ).max(15).optional()
        }),
        req.body
      );
      if ((body.payoutMethod !== void 0 || body.payoutAccount !== void 0) && !isAdminRole(req.authUser.roleKey) && req.authUser.roleKey !== "seller_owner" && !hasPermission(req.authUser, "seller.finance")) {
        return res.status(403).json({ error: "Only store owner or finance staff can update payout settings." });
      }
      const seller = await repo.updateSellerProfile(sellerId, req.authUser.id, body, getClientIp(req));
      res.json({ seller });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  const ProductSpecSchema = z.object({
    key: z.object({ en: z.string().max(120), ar: z.string().max(120) }),
    value: z.object({ en: z.string().max(240), ar: z.string().max(240) })
  });
  const ProductVariantInputSchema = z.object({
    id: z.string().optional(),
    sku: z.string().min(2).max(80),
    size: z.string().max(40).optional(),
    color: z.string().min(1).max(60),
    colorHex: z.string().max(20).optional(),
    stock: z.number().int().min(0).max(1e5),
    priceDeltaUsdCents: z.number().int().min(-5e5).max(5e5).optional()
  });
  app.post("/api/seller/products", requireSellerPerm("seller.catalog"), async (req, res) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      const body = validateBody(
        z.object({
          titleEn: z.string().min(2).max(180),
          titleAr: z.string().optional(),
          subtitleEn: z.string().optional(),
          subtitleAr: z.string().optional(),
          descriptionEn: z.string().optional(),
          descriptionAr: z.string().optional(),
          basePriceUsdCents: z.number().int().positive(),
          compareAtUsdCents: z.number().int().positive().nullable().optional(),
          department: z.enum(["fashion", "electronics", "home-gadgets"]).optional(),
          categoryId: z.string().max(100).optional(),
          brandId: z.string().max(100).nullable().optional(),
          specs: z.array(ProductSpecSchema).optional(),
          model3dUrl: z.string().max(400).refine((v) => isSafeNavOrRelativeUrl(v), "Unsafe 3D model URL").nullable().optional(),
          sku: z.string().min(2).max(80),
          size: z.string().optional(),
          color: z.string().optional(),
          colorHex: z.string().optional(),
          stock: z.number().int().min(0).max(1e5),
          variants: z.array(ProductVariantInputSchema).optional(),
          mediaIds: z.array(z.string()).optional(),
          published: z.boolean().optional()
        }),
        req.body
      );
      const product = await repo.createSellerProduct(sellerId, req.authUser.id, body, getClientIp(req));
      res.status(201).json({ product });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/seller/products/:id", requireSellerPerm("seller.catalog"), async (req, res) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      const body = validateBody(
        z.object({
          titleEn: z.string().min(2).max(180).optional(),
          titleAr: z.string().max(180).optional(),
          subtitleEn: z.string().max(240).optional(),
          subtitleAr: z.string().max(240).optional(),
          descriptionEn: z.string().max(4e3).optional(),
          descriptionAr: z.string().max(4e3).optional(),
          basePriceUsdCents: z.number().int().positive().optional(),
          compareAtUsdCents: z.number().int().positive().nullable().optional(),
          department: z.enum(["fashion", "electronics", "home-gadgets"]).optional(),
          categoryId: z.string().max(100).optional(),
          brandId: z.string().max(100).nullable().optional(),
          specs: z.array(ProductSpecSchema).optional(),
          model3dUrl: z.string().max(400).refine((v) => isSafeNavOrRelativeUrl(v), "Unsafe 3D model URL").nullable().optional(),
          published: z.boolean().optional(),
          mediaIds: z.array(z.string()).optional(),
          variants: z.array(ProductVariantInputSchema.extend({ colorHex: z.string().max(20).default("#1C1D21") })).optional()
        }),
        req.body
      );
      const product = await repo.updateSellerProduct(sellerId, req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ product });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/seller/products/:id", requireSellerPerm("seller.catalog"), async (req, res) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      await repo.deleteSellerProduct(sellerId, req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/seller/products/:id/toggle", requireSellerPerm("seller.catalog"), async (req, res) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      const product = await repo.toggleProductPublished(sellerId, req.params.id, req.authUser.id, getClientIp(req));
      res.json({ product });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/seller/sub-orders/:id", requireSellerPerm("seller.orders"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          status: z.enum(["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"]).optional(),
          codCollected: z.boolean().optional(),
          courierName: z.string().optional(),
          trackingCode: z.string().optional()
        }),
        req.body
      );
      const subOrder = await repo.updateSubOrderStatus(req.params.id, req.authUser, body, getClientIp(req));
      res.json({ subOrder });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/seller/returns/:id", requireSellerPerm("seller.orders"), async (req, res) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      const body = validateBody(z.object({ status: z.enum(["approved", "rejected"]) }), req.body);
      const ret = await repo.sellerUpdateReturn(sellerId, req.authUser.id, req.params.id, body, getClientIp(req));
      res.json({ returnRequest: ret });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/seller/coupons", requireSellerPerm("seller.catalog", "seller.finance"), async (req, res) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      const body = validateBody(
        z.object({
          code: z.string().min(3).max(40),
          discountPercent: z.number().int().min(1).max(80),
          minOrderUsdCents: z.number().int().min(0).optional()
        }),
        req.body
      );
      const coupon = await repo.createCoupon(sellerId, req.authUser.id, body, getClientIp(req));
      res.status(201).json({ coupon });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/seller/payouts", requireSellerPerm("seller.finance"), async (req, res) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      const body = validateBody(z.object({ amountUsdCents: z.number().int().min(1e3) }), req.body);
      const payout = await repo.requestPayout(sellerId, req.authUser.id, body.amountUsdCents, getClientIp(req));
      res.status(201).json({ payout });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/seller/plan", requireSellerOwnerOrAdmin, async (req, res) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      const body = validateBody(z.object({ planTier: z.enum(["free", "basic", "pro"]) }), req.body);
      const result = await repo.switchSellerPlan(sellerId, req.authUser.id, body.planTier, getClientIp(req));
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/seller/staff", requireSellerOwnerOrAdmin, async (req, res, next) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      res.json({ staff: await repo.listSellerStaff(sellerId) });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/seller/staff", requireSellerOwnerOrAdmin, async (req, res) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      const body = validateBody(
        z.object({
          name: z.string().min(2).max(140),
          email: z.string().email().max(180),
          phone: z.string().min(7).max(40),
          password: z.string().min(8).max(128),
          permissions: z.array(z.enum(["seller.catalog", "seller.orders", "seller.finance"])).min(1)
        }),
        req.body
      );
      const member = await repo.createSellerStaff(sellerId, req.authUser.id, body, getClientIp(req));
      res.status(201).json({ member });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/seller/staff/:userId", requireSellerOwnerOrAdmin, async (req, res) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      await repo.removeSellerStaff(sellerId, req.params.userId, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/seller/reviews/:id/reply", requireSellerPerm("seller.orders", "seller.catalog"), async (req, res) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      const body = validateBody(z.object({ reply: z.string().min(2).max(1e3) }), req.body);
      const review = await repo.replyToReview(sellerId, req.params.id, body.reply);
      res.json({ review });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/seller/offers", requireSellerPerm("seller.catalog"), async (req, res) => {
    try {
      const sellerId = resolveTargetSellerId(req);
      if (!sellerId) return res.status(400).json({ error: "Seller ID required." });
      const body = validateBody(
        z.object({
          titleEn: z.string().min(2).max(140),
          titleAr: z.string().max(140).optional(),
          offerType: z.enum(["percent", "fixed_usd_cents", "flash_percent"]),
          discountValue: z.number().int().positive(),
          targetType: z.enum(["seller", "product"]),
          targetId: z.string().nullable().optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional()
        }),
        req.body
      );
      const offer = await repo.sellerProposeOffer(
        sellerId,
        req.authUser.id,
        {
          title: { en: body.titleEn.trim(), ar: (body.titleAr || body.titleEn).trim() },
          offerType: body.offerType,
          discountValue: body.discountValue,
          targetType: body.targetType,
          targetId: body.targetId ?? null,
          startsAt: body.startsAt ?? null,
          endsAt: body.endsAt ?? null
        },
        getClientIp(req)
      );
      res.status(201).json({ offer });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/admin/session", requireAdminPerm(), async (req, res) => {
    res.json({
      authorized: true,
      user: {
        id: req.authUser.id,
        name: req.authUser.name,
        email: req.authUser.email,
        roleKey: req.authUser.roleKey,
        permissions: req.authUser.permissions
      }
    });
  });
  app.get("/api/admin/overview", requireAdminPerm(), async (_req, res, next) => {
    try {
      res.json(await repo.getAdminOverview());
    } catch (err) {
      next(err);
    }
  });
  app.patch("/api/admin/sellers/:id", requireAdminPerm("sellers.approve"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          status: z.enum(["draft", "pending", "approved", "rejected", "suspended"]).optional(),
          verified: z.boolean().optional(),
          customCommissionBps: z.number().int().min(0).max(5e3).nullable().optional(),
          subscriptionTier: z.enum(["free", "basic", "pro"]).optional()
        }),
        req.body
      );
      const seller = await repo.adminUpdateSeller(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ seller });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/settings", requireAdminPerm("settings.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          platform: z.object({
            exchangeRateLbpPerUsd: z.number().int().min(1500).max(5e5).optional(),
            fxAutoSyncEnabled: z.boolean().optional(),
            fxSource: z.string().max(80).optional(),
            defaultCommissionBps: z.number().int().min(0).max(5e3).optional(),
            codFeeUsdCents: z.number().int().min(0).optional(),
            holdPeriodDays: z.number().int().min(0).max(30).optional(),
            announcement: z.object({ en: z.string().max(240), ar: z.string().max(240) }).optional()
          }).optional(),
          payments: z.object({
            codEnabled: z.boolean().optional(),
            whishManualEnabled: z.boolean().optional(),
            whishAccountNumber: z.string().max(80).optional(),
            whishInstructions: z.object({ en: z.string().max(400), ar: z.string().max(400) }).optional(),
            cardEnabled: z.boolean().optional()
          }).optional()
        }),
        req.body
      );
      const updated = await repo.adminUpdateSettings(req.authUser.id, body, getClientIp(req));
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/payouts/:id/settle", requireAdminPerm("payouts.release"), async (req, res) => {
    try {
      const body = validateBody(z.object({ referenceCode: z.string().min(3).max(100) }), req.body);
      const payout = await repo.adminSettlePayout(req.params.id, req.authUser.id, body.referenceCode, getClientIp(req));
      res.json({ payout });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/ledger/release-holds", requireAdminPerm("payouts.release"), async (req, res) => {
    const releasedCount = await repo.releaseHoldsNow(req.authUser.id, getClientIp(req));
    res.json({ releasedCount });
  });
  app.post("/api/admin/orders/:id/verify-payment", requireAdminPerm("orders.manage"), async (req, res) => {
    try {
      const body = validateBody(z.object({ status: z.enum(["paid", "failed"]) }), req.body);
      const order = await repo.adminVerifyOrderPayment(req.params.id, req.authUser.id, body.status, getClientIp(req));
      res.json({ order });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  const CouponDiscountTypeSchema = z.enum(["percent", "fixed_usd_cents", "free_shipping"]);
  app.post("/api/admin/coupons", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          code: z.string().min(3).max(40),
          discountType: CouponDiscountTypeSchema.default("percent"),
          discountValue: z.number().int().min(0).optional(),
          discountPercent: z.number().int().min(1).max(90).optional(),
          maxDiscountUsdCents: z.number().int().positive().nullable().optional(),
          minOrderUsdCents: z.number().int().min(0).optional(),
          targetType: z.enum(["all", "department", "category", "seller", "product"]).optional(),
          targetId: z.string().max(100).nullable().optional(),
          campaignId: z.string().max(100).nullable().optional(),
          maxUses: z.number().int().positive().nullable().optional(),
          perCustomerLimit: z.number().int().min(1).max(100).optional(),
          firstOrderOnly: z.boolean().optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          active: z.boolean().optional()
        }),
        req.body
      );
      const coupon = await repo.createCoupon(null, req.authUser.id, body, getClientIp(req));
      res.status(201).json({ coupon });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/coupons/bulk", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          prefix: z.string().min(2).max(20),
          count: z.number().int().min(1).max(200),
          discountType: CouponDiscountTypeSchema.default("percent"),
          discountValue: z.number().int().min(0),
          minOrderUsdCents: z.number().int().min(0).optional(),
          maxDiscountUsdCents: z.number().int().positive().nullable().optional(),
          perCustomerLimit: z.number().int().min(1).max(100).optional(),
          maxUsesPerCode: z.number().int().positive().nullable().optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          campaignId: z.string().max(100).nullable().optional()
        }),
        req.body
      );
      const result = await repo.adminGenerateBulkCoupons(req.authUser.id, body, getClientIp(req));
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/coupons/import-csv", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(z.object({ csvText: z.string().min(3).max(2e5) }), req.body);
      const result = await repo.adminImportCouponsCsv(req.authUser.id, body.csvText, getClientIp(req));
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/admin/coupons/export-csv", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (_req, res, next) => {
    try {
      const csv = await repo.adminExportCouponsCsv();
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="nilelink-coupons.csv"');
      res.send(csv);
    } catch (err) {
      next(err);
    }
  });
  app.patch("/api/admin/coupons/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          active: z.boolean().optional(),
          maxUses: z.number().int().positive().nullable().optional(),
          endsAt: z.string().nullable().optional()
        }),
        req.body
      );
      const coupon = await repo.adminUpdateCoupon(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ coupon });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/coupons/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      await repo.adminDeleteCoupon(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/pages", requireAdminPerm("content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          slug: z.string().min(2).max(80),
          titleEn: z.string().min(2).max(160),
          titleAr: z.string().min(1).max(160),
          bodyEn: z.string().min(2).max(2e4),
          bodyAr: z.string().min(1).max(2e4),
          published: z.boolean().optional()
        }),
        req.body
      );
      const page = await repo.adminCreatePage(req.authUser.id, body, getClientIp(req));
      res.status(201).json({ page });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/pages/:slug", requireAdminPerm("content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          titleEn: z.string().min(2).max(160).optional(),
          titleAr: z.string().min(2).max(160).optional(),
          bodyEn: z.string().min(2).max(2e4).optional(),
          bodyAr: z.string().min(2).max(2e4).optional(),
          published: z.boolean().optional()
        }),
        req.body
      );
      const page = await repo.adminUpdatePage(req.params.slug, req.authUser.id, body, getClientIp(req));
      res.json({ page });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/pages/:slug", requireAdminPerm("content.manage"), async (req, res) => {
    try {
      await repo.adminDeletePage(req.params.slug, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/products/:id", requireAdminPerm("products.approve"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          moderationStatus: z.enum(["pending", "approved", "rejected"]).optional(),
          published: z.boolean().optional(),
          featured: z.boolean().optional()
        }),
        req.body
      );
      const product = await repo.adminModerateProduct(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ product });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/categories", requireAdminPerm("settings.manage", "products.approve"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          slug: z.string().min(2).max(80),
          parentId: z.string().max(80).nullable().optional(),
          department: z.enum(["fashion", "electronics", "home-gadgets"]),
          name: z.object({ en: z.string().min(2).max(120), ar: z.string().min(1).max(120) }),
          commissionBps: z.number().int().min(0).max(5e3).nullable().optional(),
          sortOrder: z.number().int().optional()
        }),
        req.body
      );
      const category = await repo.adminCreateCategory(req.authUser.id, body, getClientIp(req));
      res.status(201).json({ category });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/categories/:id", requireAdminPerm("settings.manage", "products.approve"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          name: z.object({ en: z.string().min(2).max(120), ar: z.string().min(1).max(120) }).optional(),
          commissionBps: z.number().int().min(0).max(5e3).nullable().optional(),
          sortOrder: z.number().int().optional(),
          active: z.boolean().optional()
        }),
        req.body
      );
      const category = await repo.adminUpdateCategory(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ category });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/categories/:id", requireAdminPerm("settings.manage", "products.approve"), async (req, res) => {
    try {
      await repo.adminDeleteCategory(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/brands", requireAdminPerm("products.approve", "settings.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          slug: z.string().min(2).max(80),
          name: z.object({ en: z.string().min(2).max(120), ar: z.string().min(1).max(120) })
        }),
        req.body
      );
      const brand = await repo.adminCreateBrand(req.authUser.id, body, getClientIp(req));
      res.status(201).json({ brand });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/brands/:id", requireAdminPerm("products.approve", "settings.manage"), async (req, res) => {
    try {
      await repo.adminDeleteBrand(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/attributes", requireAdminPerm("products.approve", "settings.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          code: z.string().min(2).max(60),
          name: z.object({ en: z.string().min(2).max(120), ar: z.string().min(1).max(120) }),
          values: z.array(z.string().min(1).max(80)).min(1)
        }),
        req.body
      );
      const attribute = await repo.adminCreateAttribute(req.authUser.id, body, getClientIp(req));
      res.status(201).json({ attribute });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/attributes/:id", requireAdminPerm("products.approve", "settings.manage"), async (req, res) => {
    try {
      await repo.adminDeleteAttribute(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/seller-documents/:id", requireAdminPerm("sellers.approve"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          reviewStatus: z.enum(["approved", "rejected"]),
          reviewerNote: z.string().max(400).optional()
        }),
        req.body
      );
      const doc = await repo.adminReviewSellerDocument(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ document: doc });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/returns/:id", requireAdminPerm("orders.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          status: z.enum(["approved", "rejected", "refunded"]),
          refundUsdCents: z.number().int().min(0).optional()
        }),
        req.body
      );
      const ret = await repo.adminResolveReturn(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ returnRequest: ret });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/disputes/:id", requireAdminPerm("orders.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          status: z.enum(["open", "investigating", "resolved_buyer", "resolved_seller", "closed"]),
          resolutionNote: z.string().max(1200).optional()
        }),
        req.body
      );
      const dispute = await repo.adminResolveDispute(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ dispute });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/reviews/:id", requireAdminPerm("products.approve", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(z.object({ status: z.enum(["approved", "hidden", "rejected"]) }), req.body);
      const review = await repo.adminModerateReview(req.params.id, req.authUser.id, body.status, getClientIp(req));
      res.json({ review });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/support-tickets/:id", requireAdminPerm("orders.manage", "users.manage"), async (req, res) => {
    try {
      const body = validateBody(z.object({ status: z.enum(["open", "in_progress", "resolved", "closed"]) }), req.body);
      const ticket = await repo.adminUpdateSupportTicket(req.params.id, req.authUser.id, body.status, getClientIp(req));
      res.json({ ticket });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/delivery-zones/:code", requireAdminPerm("settings.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          platformFeeUsdCents: z.number().int().min(0).max(5e4).optional(),
          etaDays: z.string().min(1).max(60).optional()
        }),
        req.body
      );
      const zone = await repo.adminUpdateDeliveryZone(req.params.code, req.authUser.id, body, getClientIp(req));
      res.json({ deliveryZone: zone });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/subscription-plans/:tier", requireAdminPerm("settings.manage"), async (req, res) => {
    try {
      const tier = validateBody(z.enum(["free", "basic", "pro"]), req.params.tier);
      const body = validateBody(
        z.object({
          monthlyFeeUsdCents: z.number().int().min(0).max(5e5).optional(),
          productLimit: z.number().int().min(1).max(1e5).nullable().optional(),
          commissionDiscountBps: z.number().int().min(0).max(2e3).optional()
        }),
        req.body
      );
      const plan = await repo.adminUpdateSubscriptionPlan(tier, req.authUser.id, body, getClientIp(req));
      res.json({ plan });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put("/api/admin/email-templates/:key", requireAdminPerm("settings.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          subject: z.object({ en: z.string().min(2).max(240), ar: z.string().min(1).max(240) }),
          body: z.object({ en: z.string().min(2).max(8e3), ar: z.string().min(1).max(8e3) })
        }),
        req.body
      );
      const template = await repo.adminUpdateEmailTemplate(req.params.key, req.authUser.id, body, getClientIp(req));
      res.json({ template });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put("/api/admin/menus/:location", requireAdminPerm("content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          items: z.array(
            z.object({
              label: z.object({ en: z.string().min(1).max(80), ar: z.string().min(1).max(80) }),
              url: z.string().min(1).max(300)
            })
          )
        }),
        req.body
      );
      const menu = await repo.adminSaveMenu(req.params.location, req.authUser.id, body.items, getClientIp(req));
      res.json({ menu });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/admin/users/:id/activity", requireAdminPerm("users.manage"), async (req, res) => {
    try {
      const activity = await repo.getAdminUserActivity(req.params.id);
      res.json(activity);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  });
  app.patch("/api/admin/users/:id/access", requireAdminPerm("users.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          isBlocked: z.boolean().optional(),
          verifyEmail: z.boolean().optional(),
          verifyPhone: z.boolean().optional(),
          roleKey: z.enum(["customer", "seller_owner", "seller_staff", "admin_staff"]).optional(),
          permissions: z.array(z.string().min(1).max(80)).optional(),
          reason: z.string().max(300).optional()
        }),
        req.body
      );
      const result = await repo.adminUpdateUserAccess(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  const HomeSectionTypeSchema = z.enum(ALL_HOME_SECTION_TYPES);
  const HomeSectionStatusSchema = z.enum(["draft", "published", "archived"]);
  const HomeSectionAudienceSchema = z.enum([
    "all",
    "guest",
    "logged_in",
    "arabic",
    "english",
    "new_visitor",
    "returning"
  ]);
  const HomeSectionTargetingSchema = z.object({
    visitor: z.enum(["all", "guest", "logged_in", "new_visitor", "returning"]).optional(),
    device: z.enum(["all", "desktop", "mobile"]).optional(),
    locale: z.enum(["all", "en", "ar"]).optional(),
    governorate: z.string().max(80).optional()
  }).optional();
  const HomeSectionStyleSchema = z.object({
    surface: z.enum(["ink", "graphite"]).optional(),
    padding: z.enum(["compact", "standard", "spacious"]).optional()
  }).optional();
  app.get("/api/admin/home-builder/state", requireAdminPerm("home.edit", "content.manage"), async (_req, res, next) => {
    try {
      res.json(await repo.adminGetHomeBuilderState());
    } catch (err) {
      next(err);
    }
  });
  app.get("/api/admin/home-sections", requireAdminPerm("home.edit", "content.manage"), async (_req, res, next) => {
    try {
      res.json(await repo.adminListHomeSections());
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/admin/home-sections", requireAdminPerm("home.edit", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          sectionType: HomeSectionTypeSchema,
          title: z.object({ en: z.string().min(1).max(200), ar: z.string().min(1).max(200) }),
          content: z.record(z.string(), z.unknown()).default({}),
          status: HomeSectionStatusSchema.optional(),
          visible: z.boolean().optional(),
          audience: HomeSectionAudienceSchema.optional(),
          targeting: HomeSectionTargetingSchema,
          style: HomeSectionStyleSchema,
          schedulePriority: z.number().int().min(-1e3).max(1e3).optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          insertAtIndex: z.number().int().min(0).optional()
        }),
        req.body
      );
      const section = await repo.adminCreateHomeSection(
        req.authUser.id,
        {
          ...body,
          sectionType: body.sectionType
        },
        getClientIp(req)
      );
      res.status(201).json({ section });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/home-sections/reorder", requireAdminPerm("home.edit", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(z.object({ orderedIds: z.array(z.string().min(1)).min(1) }), req.body);
      const sections = await repo.adminReorderHomeSections(body.orderedIds, req.authUser.id, getClientIp(req));
      res.json({ sections });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/home-sections/:id", requireAdminPerm("home.edit", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          sectionType: HomeSectionTypeSchema.optional(),
          title: z.object({ en: z.string().min(1).max(200), ar: z.string().min(1).max(200) }).optional(),
          content: z.record(z.string(), z.unknown()).optional(),
          status: HomeSectionStatusSchema.optional(),
          visible: z.boolean().optional(),
          audience: HomeSectionAudienceSchema.optional(),
          targeting: HomeSectionTargetingSchema,
          style: HomeSectionStyleSchema,
          schedulePriority: z.number().int().min(-1e3).max(1e3).optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          sortOrder: z.number().int().optional(),
          changeNote: z.string().max(240).optional()
        }),
        req.body
      );
      const section = await repo.adminUpdateHomeSection(
        req.params.id,
        req.authUser.id,
        {
          ...body,
          sectionType: body.sectionType
        },
        getClientIp(req)
      );
      res.json({ section });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/home-sections/:id/duplicate", requireAdminPerm("home.edit", "content.manage"), async (req, res) => {
    try {
      const section = await repo.adminDuplicateHomeSection(req.params.id, req.authUser.id, getClientIp(req));
      res.status(201).json({ section });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/home-sections/:id/rollback", requireAdminPerm("home.edit", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(z.object({ versionId: z.string().min(1) }), req.body);
      const section = await repo.adminRollbackHomeSection(req.params.id, body.versionId, req.authUser.id, getClientIp(req));
      res.json({ section });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/home-sections/:id", requireAdminPerm("home.edit", "content.manage"), async (req, res) => {
    try {
      await repo.adminDeleteHomeSection(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/home-builder/publish", requireAdminPerm("home.publish", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          changeNote: z.string().max(240).optional(),
          scheduledPublishAt: z.string().nullable().optional()
        }),
        req.body || {}
      );
      const snapshot = await repo.adminPublishHomePage(req.authUser.id, body, getClientIp(req));
      res.status(201).json({ snapshot });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/home-builder/rollback-page", requireAdminPerm("home.publish", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(z.object({ snapshotId: z.string().min(1) }), req.body);
      const snapshot = await repo.adminRollbackHomePage(body.snapshotId, req.authUser.id, getClientIp(req));
      res.json({ snapshot });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put("/api/admin/home-builder/chrome", requireAdminPerm("home.edit", "content.manage"), async (req, res) => {
    try {
      const LocalizedSchema = z.object({ en: z.string(), ar: z.string() });
      const ChromeUrlSchema = z.string().min(1).max(300).refine((v) => isSafeNavOrRelativeUrl(v), "Unsafe navigation URL");
      const body = validateBody(
        z.object({
          chrome: z.object({
            brandLogoUrl: z.string().max(500).refine((v) => !v || isSafeNavOrRelativeUrl(v), "Unsafe logo URL").nullable().optional(),
            headerLinks: z.array(
              z.object({
                id: z.string().min(1),
                label: LocalizedSchema,
                url: ChromeUrlSchema,
                visible: z.boolean()
              })
            ),
            showMegaMenu: z.boolean(),
            megaMenuDepartments: z.array(
              z.object({
                slug: z.string().min(1),
                title: LocalizedSchema,
                tagline: LocalizedSchema,
                links: z.array(z.object({ label: LocalizedSchema, url: ChromeUrlSchema }))
              })
            ),
            footerColumns: z.array(
              z.object({
                id: z.string().min(1),
                title: LocalizedSchema,
                links: z.array(z.object({ label: LocalizedSchema, url: ChromeUrlSchema }))
              })
            ),
            footerNote: LocalizedSchema,
            paymentBadges: z.array(z.string().max(60)),
            homeSeo: z.object({
              title: LocalizedSchema,
              description: LocalizedSchema,
              ogImageUrl: z.string().max(500).refine((v) => !v || isSafeNavOrRelativeUrl(v), "Unsafe image URL")
            })
          }),
          publishNow: z.boolean().default(false)
        }),
        req.body
      );
      if (body.publishNow && !hasPermission(req.authUser, "home.publish") && !hasPermission(req.authUser, "content.manage")) {
        return res.status(403).json({ error: "Missing permission: home.publish" });
      }
      const saved = await repo.adminSaveSiteChrome(
        body.chrome,
        body.publishNow,
        req.authUser.id,
        getClientIp(req)
      );
      res.json({ chrome: saved });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  const SeoEntityTypeSchema = z.enum(["page", "product", "campaign", "store"]);
  const SeoRobotsSchema = z.enum(["index,follow", "noindex,follow", "index,nofollow", "noindex,nofollow"]);
  const SafeHttpOnlyUrlOptional = z.string().max(400).refine((v) => !v || isSafeNavOrRelativeUrl(v, false), "Must be a valid http(s) URL").optional();
  const SafeAnyAssetOrNavOptional = z.string().max(500).refine((v) => !v || isSafeNavOrRelativeUrl(v, true), "Unsafe URL").optional();
  app.get("/api/admin/seo", requireAdminPerm("content.manage", "home.edit", "settings.manage"), async (_req, res, next) => {
    try {
      res.json({ seoMetadata: await repo.getSeoMetadata() });
    } catch (err) {
      next(err);
    }
  });
  app.put("/api/admin/seo/global", requireAdminPerm("content.manage", "home.edit", "settings.manage"), async (req, res) => {
    try {
      const LocalizedOptional = z.object({ en: z.string().max(500), ar: z.string().max(500) }).optional();
      const body = validateBody(
        z.object({
          siteName: z.string().min(1).max(80).optional(),
          titleTemplate: z.string().min(2).max(120).optional(),
          canonicalBaseUrl: SafeHttpOnlyUrlOptional,
          defaultTitle: LocalizedOptional,
          defaultDescription: LocalizedOptional,
          defaultOgImageUrl: SafeAnyAssetOrNavOptional,
          twitterCardType: z.enum(["summary", "summary_large_image"]).optional(),
          twitterSiteHandle: z.string().max(60).optional(),
          organizationJsonLd: z.object({
            name: z.string().min(1).max(140),
            logoUrl: z.string().max(500).refine((v) => !v || isSafeNavOrRelativeUrl(v, true), "Unsafe logo URL"),
            contactPhone: z.string().max(60),
            contactEmail: z.string().max(120),
            sameAs: z.array(z.string().max(300).refine((v) => isSafeNavOrRelativeUrl(v, false), "Must be http(s) URL")).max(10)
          }).optional()
        }),
        req.body
      );
      const seoMetadata = await repo.adminSaveGlobalSeo(req.authUser.id, body, getClientIp(req));
      res.json({ seoMetadata });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.put("/api/admin/seo/override", requireAdminPerm("content.manage", "home.edit", "settings.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          entityType: SeoEntityTypeSchema,
          entityKey: z.string().min(1).max(160),
          metaTitle: z.object({ en: z.string().max(200), ar: z.string().max(200) }),
          metaDescription: z.object({ en: z.string().max(500), ar: z.string().max(500) }),
          canonicalUrl: SafeAnyAssetOrNavOptional,
          ogImageUrl: SafeAnyAssetOrNavOptional,
          robots: SeoRobotsSchema.default("index,follow"),
          structuredData: z.object({
            brand: z.string().max(120).optional(),
            sku: z.string().max(120).optional(),
            gtin: z.string().max(80).optional(),
            priceValidUntil: z.string().max(40).optional(),
            customJson: z.string().max(4e3).refine((raw) => {
              if (!raw || !raw.trim()) return true;
              try {
                const parsed = JSON.parse(raw);
                return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed);
              } catch {
                return false;
              }
            }, "customJson must be a valid JSON object").optional()
          }).optional()
        }),
        req.body
      );
      const seoMetadata = await repo.adminUpsertSeoOverride(req.authUser.id, body, getClientIp(req));
      res.json({ seoMetadata });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/seo/override", requireAdminPerm("content.manage", "home.edit", "settings.manage"), async (req, res) => {
    try {
      const source = req.body && Object.keys(req.body).length > 0 ? req.body : req.query;
      const body = validateBody(
        z.object({
          entityType: SeoEntityTypeSchema,
          entityKey: z.string().min(1).max(160)
        }),
        source
      );
      const seoMetadata = await repo.adminDeleteSeoOverride(
        req.authUser.id,
        body.entityType,
        body.entityKey,
        getClientIp(req)
      );
      res.json({ seoMetadata });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/admin/home-builder/templates", requireAdminPerm("home.edit", "content.manage"), async (_req, res, next) => {
    try {
      res.json({ templates: await repo.adminListSectionTemplates() });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/admin/home-builder/templates", requireAdminPerm("home.edit", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          name: z.object({ en: z.string().min(2).max(160), ar: z.string().min(1).max(160) }),
          description: z.object({ en: z.string().max(300), ar: z.string().max(300) }).optional(),
          sectionType: HomeSectionTypeSchema,
          content: z.record(z.string(), z.unknown()),
          style: HomeSectionStyleSchema
        }),
        req.body
      );
      const template = await repo.adminCreateSectionTemplate(
        req.authUser.id,
        {
          ...body,
          sectionType: body.sectionType
        },
        getClientIp(req)
      );
      res.status(201).json({ template });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/home-builder/templates/:id", requireAdminPerm("home.edit", "content.manage"), async (req, res) => {
    try {
      await repo.adminDeleteSectionTemplate(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/admin/media", requireAdminPerm("home.edit", "content.manage"), async (req, res, next) => {
    try {
      const folder = typeof req.query.folder === "string" ? req.query.folder : void 0;
      res.json({ media: await repo.adminListMediaLibrary(folder) });
    } catch (err) {
      next(err);
    }
  });
  app.patch("/api/admin/media/:id", requireAdminPerm("home.edit", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          folder: z.string().max(60).optional(),
          alt: z.object({ en: z.string().max(240), ar: z.string().max(240) }).optional(),
          focalX: z.number().min(0).max(100).optional(),
          focalY: z.number().min(0).max(100).optional()
        }),
        req.body
      );
      const asset = await repo.adminUpdateMediaAsset(req.params.id, body);
      res.json({ asset });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/media/:id", requireAdminPerm("home.edit", "content.manage"), async (req, res) => {
    try {
      await repo.adminDeleteMediaAsset(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  const BannerPagesSchema = z.array(z.enum(["home", "catalog", "checkout", "store"])).min(1);
  const BannerBgSchema = z.enum(["graphite", "ember", "cedar", "gold", "cyan", "sand"]);
  const BannerPlacementSchema = z.enum(["top_bar", "page_strip", "category_header", "inline_card", "floating_strip"]);
  const MarketingAudienceSchema = z.enum(["all", "guest", "logged_in", "arabic", "english"]);
  const DeviceTargetSchema = z.enum(["all", "desktop", "mobile"]);
  const SafeNavUrlSchema = z.string().min(1).max(400).refine((v) => isSafeNavOrRelativeUrl(v, true), "Unsafe navigation URL");
  app.get("/api/admin/banners", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (_req, res, next) => {
    try {
      res.json({ banners: await repo.adminListBanners() });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/admin/banners", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          title: z.object({ en: z.string().min(2).max(240), ar: z.string().min(1).max(240) }),
          ctaLabel: z.object({ en: z.string().max(80), ar: z.string().max(80) }).optional(),
          bgToken: BannerBgSchema.default("graphite"),
          targetUrl: SafeNavUrlSchema.default("/catalog"),
          pages: BannerPagesSchema.default(["home"]),
          placement: BannerPlacementSchema.default("page_strip"),
          imageUrl: z.string().max(500).nullable().optional(),
          dismissible: z.boolean().optional(),
          audience: MarketingAudienceSchema.default("all"),
          deviceTarget: DeviceTargetSchema.default("all"),
          categorySlug: z.string().max(120).nullable().optional(),
          priority: z.number().int().min(0).max(1e3).optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          active: z.boolean().optional()
        }),
        req.body
      );
      const banner = await repo.adminCreateBanner(req.authUser.id, body, getClientIp(req));
      res.status(201).json({ banner });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/banners/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          title: z.object({ en: z.string().min(2).max(240), ar: z.string().min(1).max(240) }).optional(),
          ctaLabel: z.object({ en: z.string().max(80), ar: z.string().max(80) }).optional(),
          bgToken: BannerBgSchema.optional(),
          targetUrl: SafeNavUrlSchema.optional(),
          pages: BannerPagesSchema.optional(),
          placement: BannerPlacementSchema.optional(),
          imageUrl: z.string().max(500).nullable().optional(),
          dismissible: z.boolean().optional(),
          audience: MarketingAudienceSchema.optional(),
          deviceTarget: DeviceTargetSchema.optional(),
          categorySlug: z.string().max(120).nullable().optional(),
          priority: z.number().int().min(0).max(1e3).optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          active: z.boolean().optional()
        }),
        req.body
      );
      const banner = await repo.adminUpdateBanner(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ banner });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/banners/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      await repo.adminDeleteBanner(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  const PopupTypeSchema = z.enum(["promo", "newsletter", "announcement", "exit_intent", "cart_reminder"]);
  const PopupTriggerSchema = z.enum(["delay_seconds", "scroll_percent", "exit_intent", "cart_abandon", "immediate"]);
  const PopupFrequencySchema = z.enum(["once_per_session", "once_per_day", "once_per_week", "once_ever"]);
  app.get("/api/admin/popups", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (_req, res, next) => {
    try {
      res.json({ popups: await repo.adminListPopups() });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/admin/popups", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          title: z.object({ en: z.string().min(2).max(200), ar: z.string().min(1).max(200) }),
          body: z.object({ en: z.string().min(2).max(600), ar: z.string().min(1).max(600) }),
          ctaLabel: z.object({ en: z.string().min(1).max(80), ar: z.string().min(1).max(80) }),
          targetUrl: SafeNavUrlSchema.default("/catalog"),
          imageUrl: z.string().max(500).nullable().optional(),
          bgToken: BannerBgSchema.default("ember"),
          popupType: PopupTypeSchema.default("promo"),
          triggerType: PopupTriggerSchema.default("delay_seconds"),
          triggerValue: z.number().int().min(0).max(300).default(5),
          frequencyCap: PopupFrequencySchema.default("once_per_day"),
          pages: BannerPagesSchema.default(["home"]),
          audience: MarketingAudienceSchema.default("all"),
          deviceTarget: DeviceTargetSchema.default("all"),
          showNewsletterForm: z.boolean().optional(),
          couponCode: z.string().max(64).nullable().optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          active: z.boolean().optional()
        }),
        req.body
      );
      const popup = await repo.adminCreatePopup(req.authUser.id, body, getClientIp(req));
      res.status(201).json({ popup });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/popups/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          title: z.object({ en: z.string().min(2).max(200), ar: z.string().min(1).max(200) }).optional(),
          body: z.object({ en: z.string().min(2).max(600), ar: z.string().min(1).max(600) }).optional(),
          ctaLabel: z.object({ en: z.string().min(1).max(80), ar: z.string().min(1).max(80) }).optional(),
          targetUrl: SafeNavUrlSchema.optional(),
          imageUrl: z.string().max(500).nullable().optional(),
          bgToken: BannerBgSchema.optional(),
          popupType: PopupTypeSchema.optional(),
          triggerType: PopupTriggerSchema.optional(),
          triggerValue: z.number().int().min(0).max(300).optional(),
          frequencyCap: PopupFrequencySchema.optional(),
          pages: BannerPagesSchema.optional(),
          audience: MarketingAudienceSchema.optional(),
          deviceTarget: DeviceTargetSchema.optional(),
          showNewsletterForm: z.boolean().optional(),
          couponCode: z.string().max(64).nullable().optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          active: z.boolean().optional()
        }),
        req.body
      );
      const popup = await repo.adminUpdatePopup(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ popup });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/popups/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      await repo.adminDeletePopup(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  const FeaturedSlotSchema = z.enum([
    "home_hero_spotlight",
    "home_trending_top",
    "catalog_top_sponsored",
    "category_top_spotlight",
    "search_promoted"
  ]);
  app.get("/api/admin/featured-placements", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (_req, res, next) => {
    try {
      res.json({ featuredPlacements: await repo.adminListFeaturedPlacements() });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/admin/featured-placements", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          slotKey: FeaturedSlotSchema,
          targetType: z.enum(["product", "store"]),
          targetId: z.string().min(1).max(64),
          badgeText: z.object({ en: z.string().min(1).max(60), ar: z.string().min(1).max(60) }).default({ en: "Featured", ar: "\u0645\u0645\u064A\u0632" }),
          priority: z.number().int().min(0).max(1e3).optional(),
          feeUsdCents: z.number().int().min(0).max(1e7).optional(),
          chargeLedgerFee: z.boolean().optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          active: z.boolean().optional()
        }),
        req.body
      );
      const placement = await repo.adminCreateFeaturedPlacement(req.authUser.id, body, getClientIp(req));
      res.status(201).json({ featuredPlacement: placement });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/featured-placements/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          slotKey: FeaturedSlotSchema.optional(),
          badgeText: z.object({ en: z.string().min(1).max(60), ar: z.string().min(1).max(60) }).optional(),
          priority: z.number().int().min(0).max(1e3).optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          active: z.boolean().optional(),
          chargeLedgerFeeNow: z.boolean().optional()
        }),
        req.body
      );
      const placement = await repo.adminUpdateFeaturedPlacement(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ featuredPlacement: placement });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/featured-placements/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      await repo.adminDeleteFeaturedPlacement(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  const OfferTypeSchema = z.enum([
    "percent",
    "fixed_usd_cents",
    "flash_percent",
    "bogo",
    "buy_x_get_y",
    "tiered_qty",
    "cart_threshold",
    "bundle_deal",
    "free_shipping",
    "first_order",
    "vip_exclusive"
  ]);
  const OfferTargetTypeSchema = z.enum(["all", "department", "category", "seller", "product"]);
  const OfferStackingRuleSchema = z.enum(["best_only", "stackable", "exclusive"]);
  const OfferFundingSourceSchema = z.enum(["platform", "seller", "shared"]);
  const OfferRulesSchema = z.object({
    buyQty: z.number().int().min(1).max(50).optional(),
    getQty: z.number().int().min(1).max(50).optional(),
    getDiscountPct: z.number().int().min(1).max(100).optional(),
    tiers: z.array(
      z.object({
        minQty: z.number().int().min(1).max(1e3),
        discountPercent: z.number().int().min(1).max(90)
      })
    ).optional(),
    minCartUsdCents: z.number().int().min(0).optional(),
    maxDiscountUsdCents: z.number().int().positive().nullable().optional(),
    bundleProductIds: z.array(z.string().min(1)).optional(),
    bundleDiscountPct: z.number().int().min(1).max(90).optional(),
    freeDeliveryCapUsdCents: z.number().int().positive().nullable().optional(),
    audience: MarketingAudienceSchema.optional(),
    flashStockCap: z.number().int().min(0).nullable().optional()
  }).optional();
  app.post("/api/admin/offers/check-conflicts", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          offerType: OfferTypeSchema,
          targetType: OfferTargetTypeSchema,
          targetId: z.string().nullable().optional(),
          stackingRule: OfferStackingRuleSchema.optional(),
          priority: z.number().int().min(-100).max(1e3).optional(),
          discountValue: z.number().int().min(0).optional(),
          campaignId: z.string().max(100).nullable().optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          excludeOfferId: z.string().optional()
        }),
        req.body
      );
      const conflicts = await repo.checkOfferConflicts({
        ...body,
        offerType: body.offerType
      });
      res.json({ conflicts });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/offers", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          title: z.object({ en: z.string().min(2).max(160), ar: z.string().min(1).max(160) }),
          offerType: OfferTypeSchema,
          discountValue: z.number().int().min(0),
          targetType: OfferTargetTypeSchema,
          targetId: z.string().nullable().optional(),
          stackingRule: OfferStackingRuleSchema.optional(),
          fundingSource: OfferFundingSourceSchema.optional(),
          fundingPlatformBps: z.number().int().min(0).max(1e4).optional(),
          campaignId: z.string().max(100).nullable().optional(),
          priority: z.number().int().min(-100).max(1e3).optional(),
          rules: OfferRulesSchema,
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          active: z.boolean().optional()
        }),
        req.body
      );
      const offer = await repo.adminCreateOffer(
        req.authUser.id,
        {
          ...body,
          offerType: body.offerType
        },
        getClientIp(req)
      );
      res.status(201).json({ offer });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/offers/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          approvalStatus: z.enum(["pending", "approved", "rejected"]).optional(),
          active: z.boolean().optional(),
          priority: z.number().int().min(-100).max(1e3).optional(),
          stackingRule: OfferStackingRuleSchema.optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional()
        }),
        req.body
      );
      const offer = await repo.adminUpdateOffer(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ offer });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/offers/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      await repo.adminDeleteOffer(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/admin/flash-sales", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (_req, res, next) => {
    try {
      res.json({ flashSales: await repo.adminListFlashSales() });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/admin/flash-sales", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          slug: z.string().max(120).optional(),
          title: z.object({ en: z.string().min(2).max(200), ar: z.string().min(1).max(200) }),
          bgToken: BannerBgSchema.default("ember"),
          startsAt: z.string().min(4),
          endsAt: z.string().min(4),
          autoRevert: z.boolean().default(true),
          items: z.array(
            z.object({
              productId: z.string().min(1),
              discountPercent: z.number().int().min(1).max(90),
              stockCap: z.number().int().min(0).max(1e5)
            })
          ).min(1)
        }),
        req.body
      );
      const flashSale = await repo.adminCreateFlashSale(req.authUser.id, body, getClientIp(req));
      res.status(201).json({ flashSale });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/flash-sales/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          status: z.enum(["scheduled", "active", "ended"]).optional(),
          startsAt: z.string().min(4).optional(),
          endsAt: z.string().min(4).optional()
        }),
        req.body
      );
      const flashSale = await repo.adminUpdateFlashSale(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ flashSale });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/flash-sales/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      await repo.adminDeleteFlashSale(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  const CampaignStatusSchema = z.enum(["draft", "scheduled", "active", "ended"]);
  const SafeOptionalAssetUrlSchema = z.string().max(500).refine((v) => !v || isSafeNavOrRelativeUrl(v, true), "Unsafe asset URL").nullable().optional();
  app.get("/api/admin/campaigns", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (_req, res, next) => {
    try {
      res.json({ campaigns: await repo.adminListCampaigns() });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/admin/campaigns", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          slug: z.string().min(2).max(120),
          title: z.object({ en: z.string().min(2).max(200), ar: z.string().min(1).max(200) }),
          subtitle: z.object({ en: z.string().max(300), ar: z.string().max(300) }).default({ en: "", ar: "" }),
          description: z.object({ en: z.string().max(2e3), ar: z.string().max(2e3) }).default({ en: "", ar: "" }),
          heroImageUrl: SafeOptionalAssetUrlSchema,
          bgToken: BannerBgSchema.default("ember"),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          status: CampaignStatusSchema.default("active"),
          featuredOfferIds: z.array(z.string()).default([]),
          featuredCouponCodes: z.array(z.string()).default([]),
          featuredFlashSaleId: z.string().nullable().optional()
        }),
        req.body
      );
      const campaign = await repo.adminCreateCampaign(req.authUser.id, body, getClientIp(req));
      res.status(201).json({ campaign });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/campaigns/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          title: z.object({ en: z.string().min(2).max(200), ar: z.string().min(1).max(200) }).optional(),
          subtitle: z.object({ en: z.string().max(300), ar: z.string().max(300) }).optional(),
          description: z.object({ en: z.string().max(2e3), ar: z.string().max(2e3) }).optional(),
          heroImageUrl: SafeOptionalAssetUrlSchema,
          bgToken: BannerBgSchema.optional(),
          startsAt: z.string().nullable().optional(),
          endsAt: z.string().nullable().optional(),
          status: CampaignStatusSchema.optional(),
          featuredOfferIds: z.array(z.string()).optional(),
          featuredCouponCodes: z.array(z.string()).optional(),
          featuredFlashSaleId: z.string().nullable().optional()
        }),
        req.body
      );
      const campaign = await repo.adminUpdateCampaign(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ campaign });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/campaigns/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      await repo.adminDeleteCampaign(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  const SegmentRuleSchema = z.object({
    audienceScope: z.enum(["all_contacts", "newsletter_subscribers", "registered_customers"]).default("all_contacts"),
    governorate: z.string().max(64).optional(),
    minOrderCount: z.number().int().min(0).optional(),
    maxOrderCount: z.number().int().min(0).optional(),
    minTotalSpentUsdCents: z.number().int().min(0).optional(),
    daysSinceLastOrder: z.number().int().min(0).optional(),
    locale: z.enum(["all", "en", "ar"]).optional()
  });
  const SafeEmailBlockUrlSchema = z.string().max(500).refine((v) => !v || !/^\s*(javascript|data|vbscript):/i.test(v), "Unsafe URL scheme").optional();
  const EmailBlockSchema = z.object({
    id: z.string().min(1).max(64),
    type: z.enum(["header", "hero_text", "product_spotlight", "coupon_box", "cta_button", "divider_footer"]),
    titleEn: z.string().max(500).optional(),
    titleAr: z.string().max(500).optional(),
    bodyEn: z.string().max(4e3).optional(),
    bodyAr: z.string().max(4e3).optional(),
    imageUrl: SafeEmailBlockUrlSchema,
    buttonLabelEn: z.string().max(120).optional(),
    buttonLabelAr: z.string().max(120).optional(),
    buttonUrl: SafeEmailBlockUrlSchema,
    couponCode: z.string().max(64).optional(),
    productIds: z.array(z.string().max(64)).max(24).optional()
  });
  app.get("/api/admin/segments", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (_req, res, next) => {
    try {
      res.json({ segments: await repo.adminListSegments() });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/admin/segments/preview", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (req, res) => {
    try {
      const rules = validateBody(SegmentRuleSchema, req.body);
      const preview = await repo.adminPreviewSegment(rules);
      res.json(preview);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/segments", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          name: z.object({ en: z.string().min(2).max(160), ar: z.string().min(1).max(160) }),
          description: z.string().max(400).default(""),
          rules: SegmentRuleSchema
        }),
        req.body
      );
      const segment = await repo.adminCreateSegment(req.authUser.id, body, getClientIp(req));
      res.status(201).json({ segment });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/segments/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      await repo.adminDeleteSegment(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/admin/newsletter/subscribers", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (_req, res, next) => {
    try {
      res.json({ subscribers: await repo.adminListNewsletterSubscribers() });
    } catch (err) {
      next(err);
    }
  });
  app.get("/api/admin/email-campaigns", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (_req, res, next) => {
    try {
      res.json({ emailCampaigns: await repo.adminListEmailCampaigns() });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/admin/email-campaigns/preview", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          locale: z.enum(["en", "ar"]).default("en"),
          subject: z.string().max(240).default("Preview"),
          previewText: z.string().max(240).optional(),
          blocks: z.array(EmailBlockSchema).default([]),
          attachCouponCode: z.string().max(64).nullable().optional()
        }),
        req.body
      );
      const productIds = Array.from(new Set(body.blocks.flatMap((b) => b.productIds || [])));
      const products2 = [];
      if (productIds.length > 0) {
        const placeholders = productIds.map(() => "?").join(", ");
        const rows = await db.query(
          `SELECT id, slug, title_json, base_price_usd_cents FROM products WHERE id IN (${placeholders})`,
          productIds
        );
        for (const r of rows) {
          const tj = typeof r.title_json === "string" ? JSON.parse(r.title_json) : r.title_json;
          products2.push({
            id: r.id,
            slug: r.slug,
            titleEn: String(tj?.en || "Product"),
            titleAr: String(tj?.ar || tj?.en || "\u0645\u0646\u062A\u062C"),
            priceUsdCents: Number(r.base_price_usd_cents || 0)
          });
        }
      }
      const rendered = renderEmailBlocks(body.blocks, {
        locale: body.locale,
        subject: body.subject,
        previewText: body.previewText,
        products: products2,
        attachCouponCode: body.attachCouponCode,
        unsubscribeUrl: "/api/newsletter/unsubscribe?token=preview",
        appUrl: process.env.APP_URL || `${req.protocol}://${req.get("host")}`
      });
      res.json(rendered);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/email-campaigns", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          name: z.string().min(2).max(160),
          subject: z.object({ en: z.string().min(1).max(220), ar: z.string().min(1).max(220) }),
          previewText: z.object({ en: z.string().max(240), ar: z.string().max(240) }).default({ en: "", ar: "" }),
          segmentId: z.string().max(64).nullable().optional(),
          blocks: z.array(EmailBlockSchema).min(1),
          scheduledAt: z.string().nullable().optional()
        }),
        req.body
      );
      const campaign = await repo.adminCreateEmailCampaign(req.authUser.id, body, getClientIp(req));
      res.status(201).json({ emailCampaign: campaign });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/email-campaigns/:id/send", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          sendNow: z.boolean().optional(),
          scheduledAt: z.string().nullable().optional()
        }),
        req.body
      );
      const result = await repo.adminSendOrScheduleEmailCampaign(req.params.id, req.authUser.id, body, getClientIp(req));
      let jobSummary = null;
      if (body.sendNow) {
        jobSummary = await processPendingJobs(db, Math.max(50, result.queuedCount + 10));
        const refreshed = (await repo.adminListEmailCampaigns()).find((c) => c.id === req.params.id);
        return res.json({ emailCampaign: refreshed || result.campaign, queuedCount: result.queuedCount, jobSummary });
      }
      res.json({ ...result, jobSummary });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.delete("/api/admin/email-campaigns/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      await repo.adminDeleteEmailCampaign(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/admin/automations", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (_req, res, next) => {
    try {
      res.json({ automationFlows: await repo.adminListAutomationFlows() });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/admin/automations", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          name: z.object({ en: z.string().min(2).max(160), ar: z.string().min(1).max(160) }),
          triggerType: z.enum(["welcome_subscriber", "abandoned_cart", "post_purchase", "winback_30d"]),
          delayHours: z.number().int().min(0).max(2400).default(0),
          subject: z.object({ en: z.string().min(1).max(220), ar: z.string().min(1).max(220) }),
          blocks: z.array(EmailBlockSchema).min(1),
          attachCouponCode: z.string().max(64).nullable().optional(),
          active: z.boolean().default(true)
        }),
        req.body
      );
      const flow = await repo.adminCreateAutomationFlow(req.authUser.id, body, getClientIp(req));
      res.status(201).json({ automationFlow: flow });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch("/api/admin/automations/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          name: z.object({ en: z.string().min(2).max(160), ar: z.string().min(1).max(160) }).optional(),
          delayHours: z.number().int().min(0).max(2400).optional(),
          subject: z.object({ en: z.string().min(1).max(220), ar: z.string().min(1).max(220) }).optional(),
          blocks: z.array(EmailBlockSchema).min(1).optional(),
          attachCouponCode: z.string().max(64).nullable().optional(),
          active: z.boolean().optional()
        }),
        req.body
      );
      const flow = await repo.adminUpdateAutomationFlow(req.params.id, req.authUser.id, body, getClientIp(req));
      res.json({ automationFlow: flow });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post("/api/admin/automations/run-now", requireAdminPerm("marketing.manage", "content.manage"), async (_req, res, next) => {
    try {
      const summary = await processPendingJobs(db, 100);
      res.json({ ok: true, summary });
    } catch (err) {
      next(err);
    }
  });
  app.delete("/api/admin/automations/:id", requireAdminPerm("marketing.manage", "content.manage"), async (req, res) => {
    try {
      await repo.adminDeleteAutomationFlow(req.params.id, req.authUser.id, getClientIp(req));
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/admin/marketing/seller-rules", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (_req, res, next) => {
    try {
      res.json({ rules: await repo.getSellerPromoRules() });
    } catch (err) {
      next(err);
    }
  });
  app.put("/api/admin/marketing/seller-rules", requireAdminPerm("marketing.manage", "settings.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          sellerOffersEnabled: z.boolean().optional(),
          requireAdminApproval: z.boolean().optional(),
          maxDiscountPercent: z.number().int().min(5).max(90).optional(),
          maxFixedDiscountUsdCents: z.number().int().min(500).max(5e5).optional(),
          maxActiveOffersPerSeller: z.number().int().min(1).max(50).optional(),
          allowFlashOffersBySellers: z.boolean().optional()
        }),
        req.body
      );
      const rules = await repo.adminUpdateSellerPromoRules(req.authUser.id, body, getClientIp(req));
      res.json({ rules });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/admin/marketing/analytics", requireAdminPerm("marketing.view", "marketing.manage", "content.manage"), async (_req, res, next) => {
    try {
      res.json({ analytics: await repo.getMarketingAnalytics() });
    } catch (err) {
      next(err);
    }
  });
  app.post("/api/admin/staff", requireAdminPerm("users.manage"), async (req, res) => {
    try {
      const body = validateBody(
        z.object({
          name: z.string().min(2).max(140),
          email: z.string().email(),
          phone: z.string().min(7).max(40),
          password: z.string().min(8).max(128),
          permissions: z.array(z.string()).min(1)
        }),
        req.body
      );
      const created = await repo.createAdminStaff({
        actorUserId: req.authUser.id,
        ...body,
        ipAddress: getClientIp(req)
      });
      res.status(201).json(created);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.get("/api/admin/reports/export", requireAdminPerm("orders.manage"), async (_req, res, next) => {
    try {
      const overview = await repo.getAdminOverview();
      const rows = [
        ["OrderNumber", "Date", "Governorate", "PaymentMethod", "PaymentStatus", "SubtotalUSD", "CommissionUSD", "DeliveryUSD"],
        ...overview.orders.map((o) => {
          const commission = o.subOrders.reduce((sum, s) => sum + s.commissionUsdCents, 0);
          return [
            o.orderNumber,
            o.createdAt,
            o.governorate,
            o.paymentMethod,
            o.paymentStatus,
            (o.subtotalUsdCents / 100).toFixed(2),
            (commission / 100).toFixed(2),
            (o.deliveryTotalUsdCents / 100).toFixed(2)
          ];
        })
      ];
      res.setHeader("Content-Disposition", 'attachment; filename="nilelink-gmv-export.csv"');
      res.type("text/csv; charset=utf-8").send(rows.map((r) => r.map(escapeCsvCell).join(",")).join("\n"));
    } catch (err) {
      next(err);
    }
  });
  app.use(async (err, req, res, _next) => {
    await repo.logError(req.path, err);
    const message = process.env.NODE_ENV === "production" ? "Internal server error." : err.message || "Server error";
    res.status(500).json({ error: message, requestId: req.requestId });
  });
  const port = Number(process.env.PORT || 3e3);
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path3.resolve(process.cwd(), "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path3.join(distDir, "index.html"));
    });
  }
  app.listen(port, "0.0.0.0", () => {
    console.log(`NileLink production server running on http://0.0.0.0:${port}`);
  });
}
createApp().catch((err) => {
  console.error("[FATAL] Failed to start NileLink server:", err);
  process.exit(1);
});
