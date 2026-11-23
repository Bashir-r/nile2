import type { Seller, SellerCommunicationPrefs, StoreLocation } from './types.ts';

export const DEFAULT_SELLER_COMMUNICATION_PREFS: SellerCommunicationPrefs = {
  whatsappEnabled: true,
  whatsappGreeting: '',
  systemChatEnabled: true,
  phoneCallsEnabled: true,
  preferredChannel: 'whatsapp',
};

/**
 * Strips non-digit characters for wa.me deep-link construction.
 * Returns empty string if fewer than 6 digits are present.
 */
export function sanitizeWhatsAppDigits(rawPhone: string | null | undefined): string {
  const digits = String(rawPhone || '').replace(/[^\d]/g, '').replace(/^00/, '');
  if (digits.length < 6) return '';
  return digits;
}

/**
 * Builds a clean, safe WhatsApp Business wa.me link with optional pre-filled greeting.
 */
export function buildWhatsAppBusinessLink(options: {
  phone?: string | null;
  storeName?: string;
  greeting?: string;
  productTitle?: string;
}): string {
  const digits = sanitizeWhatsAppDigits(options.phone);
  if (!digits) return '';
  const customGreeting = (options.greeting || '').trim();
  const fallbackMessage = options.productTitle
    ? `Hello ${options.storeName || 'Store'}, I am interested in "${options.productTitle}" on NileLink.`
    : `Hello ${options.storeName || 'Store'}, I am contacting you via your NileLink storefront.`;
  const message = customGreeting || fallbackMessage;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export interface BusinessSetupChecklistItem {
  key: 'identity' | 'logo' | 'banner' | 'communication' | 'locations' | 'fulfillment';
  stepIndex: number;
  labelEn: string;
  labelAr: string;
  complete: boolean;
}

export function evaluateBusinessSetupReadiness(input: {
  seller?: Partial<Seller> | null;
  nameEn?: string;
  nameAr?: string;
  taglineEn?: string;
  aboutEn?: string;
  whatsappPhone?: string;
  locations?: StoreLocation[];
  returnPolicyEn?: string;
}): {
  items: BusinessSetupChecklistItem[];
  completedCount: number;
  totalCount: number;
  percent: number;
} {
  const seller = input.seller || {};
  const nameEn = (input.nameEn ?? seller.name?.en ?? '').trim();
  const nameAr = (input.nameAr ?? seller.name?.ar ?? '').trim();
  const taglineEn = (input.taglineEn ?? seller.tagline?.en ?? '').trim();
  const aboutEn = (input.aboutEn ?? seller.about?.en ?? '').trim();
  const whatsappPhone = (input.whatsappPhone ?? seller.whatsappPhone ?? '').trim();
  const locations = input.locations ?? seller.locations ?? [];
  const returnPolicyEn = (input.returnPolicyEn ?? seller.returnPolicy?.en ?? '').trim();

  const hasCustomBanner = Boolean(
    seller.bannerImage && !seller.bannerImage.includes('hero_beirut_editorial_1795297173320')
  );

  const items: BusinessSetupChecklistItem[] = [
    {
      key: 'identity',
      stepIndex: 0,
      labelEn: 'Bilingual brand name, tagline & story',
      labelAr: 'اسم المتجر بالعربية والإنجليزية والنبذة التعريفية',
      complete: nameEn.length >= 2 && nameAr.length >= 2 && (taglineEn.length >= 3 || aboutEn.length >= 8),
    },
    {
      key: 'logo',
      stepIndex: 0,
      labelEn: 'Square store logo uploaded',
      labelAr: 'رفع شعار المتجر المربع',
      complete: Boolean(seller.logoImage),
    },
    {
      key: 'banner',
      stepIndex: 0,
      labelEn: 'Custom storefront cover banner set',
      labelAr: 'تعيين بانر الغلاف المخصص',
      complete: hasCustomBanner,
    },
    {
      key: 'communication',
      stepIndex: 1,
      labelEn: 'WhatsApp Business link & communication channels configured',
      labelAr: 'ضبط رابط واتساب للأعمال وتفضيلات التواصل',
      complete: sanitizeWhatsAppDigits(whatsappPhone).length >= 6,
    },
    {
      key: 'locations',
      stepIndex: 2,
      labelEn: 'At least 1 storefront/pickup branch location pinned',
      labelAr: 'تثبيت موقع فرع أو نقطة استلام واحدة على الأقل',
      complete: locations.length > 0,
    },
    {
      key: 'fulfillment',
      stepIndex: 2,
      labelEn: 'Return policy & fulfillment preferences set',
      labelAr: 'تحديد سياسة الإرجاع وإعدادات التوصيل',
      complete: returnPolicyEn.length >= 4 || Boolean(seller.returnPolicy?.ar),
    },
  ];

  const completedCount = items.filter((item) => item.complete).length;
  const totalCount = items.length;
  const percent = Math.round((completedCount / totalCount) * 100);
  return { items, completedCount, totalCount, percent };
}
