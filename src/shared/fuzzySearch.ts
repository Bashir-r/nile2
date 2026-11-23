import type { Category, FlashSale, Locale, Offer, Product, Seller } from './types.ts';
import { resolveUnitOfferPrice } from './offers.ts';

export type SearchScope = 'all' | 'products' | 'stores' | 'categories';

export interface ProductSearchHit {
  kind: 'product';
  id: string;
  score: number;
  product: Product;
  seller?: Seller;
  category?: Category;
  effectiveUsdCents: number;
  savingsUsdCents: number;
  hasDiscount: boolean;
  url: string;
}

export interface StoreSearchHit {
  kind: 'store';
  id: string;
  score: number;
  seller: Seller;
  productCount: number;
  url: string;
}

export interface CategorySearchHit {
  kind: 'category';
  id: string;
  score: number;
  category: Category;
  productCount: number;
  url: string;
}

export type UnifiedSearchHit = ProductSearchHit | StoreSearchHit | CategorySearchHit;

export interface FuzzySearchResult {
  normalizedQuery: string;
  products: ProductSearchHit[];
  stores: StoreSearchHit[];
  categories: CategorySearchHit[];
  orderedHits: UnifiedSearchHit[];
  totalCount: number;
}

const ARABIC_DIACRITICS_RE = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const ARABIC_TATWEEL_RE = /\u0640/g;

/**
 * Normalizes both English and Arabic text for fuzzy matching:
 * - Strips Arabic diacritics (tashkeel) and tatweel
 * - Normalizes hamza variants (أ/إ/آ/ٱ -> ا), ى -> ي, ة -> ه, ؤ -> و, ئ -> ي
 * - Converts Arabic-Indic digits (٠-٩, ۰-۹) to ASCII 0-9
 * - Collapses punctuation and whitespace
 */
export function normalizeSearchText(raw: string): string {
  if (!raw) return '';
  let text = String(raw)
    .toLowerCase()
    .normalize('NFKC')
    .replace(ARABIC_DIACRITICS_RE, '')
    .replace(ARABIC_TATWEEL_RE, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي');

  text = text
    .replace(/[\u0660-\u0669]/g, (ch) => String(ch.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (ch) => String(ch.charCodeAt(0) - 0x06f0));

  return text
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function damerauLevenshteinBounded(a: string, b: string, maxDistance = 2): number {
  const lenA = a.length;
  const lenB = b.length;
  if (Math.abs(lenA - lenB) > maxDistance) return maxDistance + 1;
  if (a === b) return 0;
  if (lenA === 0) return lenB;
  if (lenB === 0) return lenA;

  const dp: number[][] = Array.from({ length: lenA + 1 }, () => new Array<number>(lenB + 1).fill(0));
  for (let i = 0; i <= lenA; i++) dp[i][0] = i;
  for (let j = 0; j <= lenB; j++) dp[0][j] = j;

  for (let i = 1; i <= lenA; i++) {
    let rowMin = maxDistance + 1;
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let val = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        val = Math.min(val, dp[i - 2][j - 2] + 1);
      }
      dp[i][j] = val;
      if (val < rowMin) rowMin = val;
    }
    if (rowMin > maxDistance && i < lenA - 1 && lenB - i > maxDistance) {
      // keep scanning safely since transposition could span next row; quick check only
    }
  }
  return dp[lenA][lenB];
}

function isOrderedSubsequence(needle: string, haystack: string): boolean {
  if (needle.length < 3 || needle.length > haystack.length) return false;
  let ni = 0;
  for (let hi = 0; hi < haystack.length && ni < needle.length; hi++) {
    if (haystack[hi] === needle[ni]) ni++;
  }
  return ni === needle.length;
}

function scoreTokenAgainstField(token: string, normalizedField: string, fieldWords: string[]): number {
  if (!token || !normalizedField) return 0;
  if (normalizedField === token) return 120;

  let best = 0;
  for (const word of fieldWords) {
    if (word === token) {
      best = Math.max(best, 100);
      break;
    }
    if (word.startsWith(token)) {
      best = Math.max(best, 84);
      continue;
    }
    if (token.length >= 2 && word.includes(token)) {
      best = Math.max(best, 72);
      continue;
    }
    const maxAllowed = token.length >= 6 ? 2 : token.length >= 3 ? 1 : 0;
    if (maxAllowed > 0) {
      const dist = damerauLevenshteinBounded(token, word, maxAllowed);
      if (dist <= maxAllowed) {
        const fuzzyPoints = dist === 1 ? 58 : 42;
        best = Math.max(best, fuzzyPoints);
      }
    }
  }

  if (best === 0 && normalizedField.includes(token)) {
    best = 68;
  }
  if (best === 0 && token.length >= 3 && isOrderedSubsequence(token, normalizedField)) {
    best = 32;
  }
  return best;
}

export interface WeightedTextField {
  text: string;
  weight: number;
}

export function fuzzyScoreFields(rawQuery: string, fields: WeightedTextField[]): number {
  const normalizedQuery = normalizeSearchText(rawQuery);
  if (!normalizedQuery) return 0;

  const prepared = fields
    .map((f) => {
      const norm = normalizeSearchText(f.text);
      return {
        norm,
        words: norm ? norm.split(' ').filter(Boolean) : [],
        weight: f.weight,
      };
    })
    .filter((f) => f.norm.length > 0);

  if (prepared.length === 0) return 0;

  // Whole-phrase bonus against any field
  let phraseBonus = 0;
  for (const field of prepared) {
    if (field.norm === normalizedQuery) {
      phraseBonus = Math.max(phraseBonus, 140 * field.weight);
    } else if (field.norm.startsWith(normalizedQuery)) {
      phraseBonus = Math.max(phraseBonus, 105 * field.weight);
    } else if (field.norm.includes(normalizedQuery)) {
      phraseBonus = Math.max(phraseBonus, 85 * field.weight);
    }
  }

  const queryTokens = normalizedQuery.split(' ').filter(Boolean);
  if (queryTokens.length === 0) return phraseBonus;

  let matchedTokenCount = 0;
  let totalTokenScore = 0;

  for (const token of queryTokens) {
    let bestForToken = 0;
    for (const field of prepared) {
      const s = scoreTokenAgainstField(token, field.norm, field.words) * field.weight;
      if (s > bestForToken) bestForToken = s;
    }
    if (bestForToken > 0) {
      matchedTokenCount++;
      totalTokenScore += bestForToken;
    }
  }

  if (matchedTokenCount === 0) return 0;

  // For multi-word queries, require all tokens (or >=2/3 when 3+ tokens) unless phrase already matched closely
  if (queryTokens.length > 1) {
    const coverage = matchedTokenCount / queryTokens.length;
    if (coverage < 0.65 && phraseBonus === 0) {
      return 0;
    }
    const coverageMultiplier = coverage === 1 ? 1.15 : coverage * 0.75;
    return Math.round((totalTokenScore / queryTokens.length) * coverageMultiplier + phraseBonus * 0.45);
  }

  return Math.round(totalTokenScore + phraseBonus * 0.35);
}

export function searchMarketplaceEntities(params: {
  query: string;
  products: Product[];
  sellers: Seller[];
  categories: Category[];
  offers?: Offer[];
  flashSales?: FlashSale[];
  locale: Locale;
  scope?: SearchScope;
  limitPerGroup?: number;
  nowMs?: number;
}): FuzzySearchResult {
  const {
    query,
    products,
    sellers,
    categories,
    offers = [],
    flashSales = [],
    locale,
    scope = 'all',
    limitPerGroup = 6,
    nowMs = Date.now(),
  } = params;

  const normalizedQuery = normalizeSearchText(query);
  const sellerMap = new Map(sellers.map((s) => [s.id, s]));
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const storeCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  for (const p of products) {
    if (!p.published) continue;
    storeCounts.set(p.sellerId, (storeCounts.get(p.sellerId) || 0) + 1);
    categoryCounts.set(p.categoryId, (categoryCounts.get(p.categoryId) || 0) + 1);
  }

  const productHits: ProductSearchHit[] = [];
  if (scope === 'all' || scope === 'products') {
    for (const p of products) {
      if (!p.published) continue;
      const seller = sellerMap.get(p.sellerId);
      const category = categoryMap.get(p.categoryId);
      const priced = resolveUnitOfferPrice(p.basePriceUsdCents, p, offers, nowMs, flashSales);
      const hasDiscount = priced.savingsUsdCents > 0;

      let score = 0;
      if (!normalizedQuery) {
        score = Math.round(
          (p.rating || 0) * 18 +
            Math.min(p.reviewCount || 0, 50) * 0.4 +
            (hasDiscount ? 22 : 0) +
            (seller?.verified ? 8 : 0)
        );
      } else {
        const specsText = (p.specs || [])
          .map((sp) => `${sp.key.en} ${sp.key.ar} ${sp.value.en} ${sp.value.ar}`)
          .join(' ');
        const variantsText = (p.variants || []).map((v) => `${v.color} ${v.size || ''} ${v.sku}`).join(' ');
        const tagsText = (p.tags || []).join(' ');
        const fields: WeightedTextField[] = [
          { text: locale === 'ar' ? p.title.ar : p.title.en, weight: 1.35 },
          { text: locale === 'ar' ? p.title.en : p.title.ar, weight: 1.25 },
          { text: p.subtitle.en, weight: 0.9 },
          { text: p.subtitle.ar, weight: 0.9 },
          { text: category?.name.en || '', weight: 0.85 },
          { text: category?.name.ar || '', weight: 0.85 },
          { text: seller?.name.en || '', weight: 0.75 },
          { text: seller?.name.ar || '', weight: 0.75 },
          { text: specsText, weight: 0.7 },
          { text: variantsText, weight: 0.65 },
          { text: tagsText, weight: 0.65 },
          { text: p.department, weight: 0.6 },
        ];
        score = fuzzyScoreFields(normalizedQuery, fields);
        if (score > 0 && hasDiscount) score += 4;
      }

      if (score > 0) {
        productHits.push({
          kind: 'product',
          id: p.id,
          score,
          product: p,
          seller,
          category,
          effectiveUsdCents: priced.effectiveUsdCents,
          savingsUsdCents: priced.savingsUsdCents,
          hasDiscount,
          url: `/product/${p.slug}`,
        });
      }
    }
    productHits.sort((a, b) => b.score - a.score || b.product.rating - a.product.rating);
  }

  const storeHits: StoreSearchHit[] = [];
  if (scope === 'all' || scope === 'stores') {
    for (const s of sellers) {
      if (s.status && s.status !== 'approved') continue;
      let score = 0;
      if (!normalizedQuery) {
        score = Math.round((s.verified ? 30 : 10) + (s.rating || 0) * 12 + (storeCounts.get(s.id) || 0));
      } else {
        const fields: WeightedTextField[] = [
          { text: locale === 'ar' ? s.name.ar : s.name.en, weight: 1.4 },
          { text: locale === 'ar' ? s.name.en : s.name.ar, weight: 1.3 },
          { text: s.governorate, weight: 0.9 },
          { text: s.district, weight: 0.85 },
          { text: s.tagline.en, weight: 0.75 },
          { text: s.tagline.ar, weight: 0.75 },
          { text: s.about.en, weight: 0.65 },
          { text: s.about.ar, weight: 0.65 },
        ];
        score = fuzzyScoreFields(normalizedQuery, fields);
        if (score > 0 && s.verified) score += 5;
      }
      if (score > 0) {
        storeHits.push({
          kind: 'store',
          id: s.id,
          score,
          seller: s,
          productCount: storeCounts.get(s.id) || 0,
          url: `/store/${s.slug}`,
        });
      }
    }
    storeHits.sort((a, b) => b.score - a.score || b.productCount - a.productCount);
  }

  const categoryHits: CategorySearchHit[] = [];
  if (scope === 'all' || scope === 'categories') {
    for (const c of categories) {
      let score = 0;
      if (!normalizedQuery) {
        score = 20 + (categoryCounts.get(c.id) || 0);
      } else {
        const fields: WeightedTextField[] = [
          { text: locale === 'ar' ? c.name.ar : c.name.en, weight: 1.4 },
          { text: locale === 'ar' ? c.name.en : c.name.ar, weight: 1.3 },
          { text: c.department, weight: 0.75 },
          { text: c.slug, weight: 0.8 },
        ];
        score = fuzzyScoreFields(normalizedQuery, fields);
      }
      if (score > 0) {
        categoryHits.push({
          kind: 'category',
          id: c.id,
          score,
          category: c,
          productCount: categoryCounts.get(c.id) || 0,
          url: `/catalog?category=${encodeURIComponent(c.department)}`,
        });
      }
    }
    categoryHits.sort((a, b) => b.score - a.score || b.productCount - a.productCount);
  }

  const maxItems = scope === 'all' ? limitPerGroup : limitPerGroup * 2;
  const slicedProducts = productHits.slice(0, maxItems);
  const slicedStores = storeHits.slice(0, scope === 'all' ? Math.min(4, limitPerGroup) : maxItems);
  const slicedCategories = categoryHits.slice(0, scope === 'all' ? Math.min(4, limitPerGroup) : maxItems);

  const orderedHits: UnifiedSearchHit[] = [...slicedProducts, ...slicedStores, ...slicedCategories];

  return {
    normalizedQuery,
    products: slicedProducts,
    stores: slicedStores,
    categories: slicedCategories,
    orderedHits,
    totalCount: productHits.length + storeHits.length + categoryHits.length,
  };
}
