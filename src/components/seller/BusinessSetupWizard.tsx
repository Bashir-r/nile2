import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Sparkles,
  Store,
  Upload,
} from 'lucide-react';
import type {
  DeliveryMode,
  Locale,
  Seller,
  SellerCommunicationPrefs,
  StorefrontThemeId,
  StoreLocation,
} from '../../shared/types.ts';
import { APPROVED_STOREFRONT_THEMES } from '../../shared/themes.ts';
import {
  buildWhatsAppBusinessLink,
  DEFAULT_SELLER_COMMUNICATION_PREFS,
  evaluateBusinessSetupReadiness,
} from '../../shared/communication.ts';
import { StoreLocationManager } from '../maps/StoreLocationManager.tsx';
import { StatusLabel } from '../HairlineUI.tsx';

export interface BusinessSetupFormValues {
  nameEn: string;
  nameAr: string;
  taglineEn: string;
  taglineAr: string;
  aboutEn: string;
  aboutAr: string;
  storePhone: string;
  cityAddress: string;
  workingHoursSchedule: string;
  announcementEn: string;
  announcementAr: string;
  returnPolicyEn: string;
  returnPolicyAr: string;
  processingHours: string;
  vacationMode: boolean;
  whatsappPhone: string;
  communicationPrefs: SellerCommunicationPrefs;
  themeId: StorefrontThemeId;
  deliveryMode: DeliveryMode;
  storeLocations: StoreLocation[];
}

interface BusinessSetupWizardProps {
  seller: Seller;
  locale: Locale;
  uploadingMedia: boolean;
  values: BusinessSetupFormValues;
  onChange: (patch: Partial<BusinessSetupFormValues>) => void;
  onUploadMedia: (file: File, entityType: 'store_logo' | 'store_banner') => Promise<void>;
  onSaveSetup: () => Promise<void>;
  onOpenStorefront: () => void;
}

const WIZARD_STEPS = [
  {
    id: 0,
    key: 'identity',
    titleEn: '1. Brand Identity & Media',
    titleAr: '١. الهوية والوسائط',
    subtitleEn: 'Logo, custom cover banner, and bilingual store profile',
    subtitleAr: 'الشعار، الغلاف المخصص، واسم المتجر والنبذة',
  },
  {
    id: 1,
    key: 'communication',
    keyLabel: 'whatsapp',
    titleEn: '2. Communication & WhatsApp',
    titleAr: '٢. التواصل وواتساب للأعمال',
    subtitleEn: 'WhatsApp Business deep link, System Chat & store policies',
    subtitleAr: 'رابط واتساب للأعمال، محادثة النظام، وساعات العمل',
  },
  {
    id: 2,
    key: 'locations',
    titleEn: '3. Locations & Theme',
    titleAr: '٣. الفروع والمظهر والشحن',
    subtitleEn: 'Branch map pins, accessible palette & fulfillment fleet',
    subtitleAr: 'مواقع الفروع على الخريطة، المظهر، وطريقة التوصيل',
  },
  {
    id: 3,
    key: 'review',
    titleEn: '4. Review & Launch',
    titleAr: '٤. المراجعة والاعتماد',
    subtitleEn: 'Verify storefront readiness and publish updates live',
    subtitleAr: 'تأكد من اكتمال الإعدادات وانشر المتجر مباشرة',
  },
] as const;

export function BusinessSetupWizard({
  seller,
  locale,
  uploadingMedia,
  values,
  onChange,
  onUploadMedia,
  onSaveSetup,
  onOpenStorefront,
}: BusinessSetupWizardProps) {
  const [step, setStep] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const isAr = locale === 'ar';

  const commPrefs: SellerCommunicationPrefs = {
    ...DEFAULT_SELLER_COMMUNICATION_PREFS,
    ...(values.communicationPrefs || {}),
  };

  const readiness = useMemo(
    () =>
      evaluateBusinessSetupReadiness({
        seller,
        nameEn: values.nameEn,
        nameAr: values.nameAr,
        taglineEn: values.taglineEn,
        aboutEn: values.aboutEn,
        whatsappPhone: values.whatsappPhone,
        locations: values.storeLocations,
        returnPolicyEn: values.returnPolicyEn,
      }),
    [seller, values]
  );

  const whatsappPreviewUrl = useMemo(
    () =>
      buildWhatsAppBusinessLink({
        phone: values.whatsappPhone,
        storeName: values.nameEn || seller.name.en,
        greeting: commPrefs.whatsappGreeting,
      }),
    [values.whatsappPhone, values.nameEn, seller.name.en, commPrefs.whatsappGreeting]
  );

  const activeTheme =
    APPROVED_STOREFRONT_THEMES[values.themeId] || APPROVED_STOREFRONT_THEMES['obsidian-ember'];

  const handleCommChange = (patch: Partial<SellerCommunicationPrefs>) => {
    onChange({
      communicationPrefs: {
        ...commPrefs,
        ...patch,
      },
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveSetup();
    } finally {
      setSaving(false);
    }
  };

  const handleCopyWhatsApp = async () => {
    if (!whatsappPreviewUrl || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(whatsappPreviewUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore clipboard denial
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Readiness Progress Bar */}
      <div className="border border-[var(--line)] bg-[var(--graphite)] p-5 md:p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-[var(--ember)]">
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'معالج إعداد المتجر الاحترافي' : 'Guided Merchant Business Setup'}</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--bone)]">
              {isAr ? 'تخصيص الهوية، الغلاف، وقنوات التواصل' : 'Configure Brand Media, WhatsApp Links & Store Presence'}
            </h2>
            <p className="text-xs text-[var(--muted)]">
              {isAr
                ? 'أكمل الخطوات الأربع لتجهيز واجهة متجرك للظهور بأعلى جودة للعملاء في كل لبنان.'
                : 'Complete each step to publish your store logo, cover banner, WhatsApp Business link, and branch map pins.'}
            </p>
          </div>

          <div className="min-w-[210px] space-y-2 border border-[var(--line)] bg-[var(--ink)] p-3.5">
            <div className="flex items-center justify-between text-xs font-mono-tabular">
              <span className="text-[var(--muted)] uppercase">{isAr ? 'جاهزية المتجر' : 'Setup Readiness'}</span>
              <span className="font-bold text-[var(--bone)]">
                {readiness.completedCount}/{readiness.totalCount} · {readiness.percent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[var(--graphite)] overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${readiness.percent}%`,
                  backgroundColor: readiness.percent === 100 ? 'var(--cedar)' : 'var(--ember)',
                }}
              />
            </div>
          </div>
        </div>

        {/* 4-Step Interactive Wizard Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[var(--line)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)]">
          {WIZARD_STEPS.map((s) => {
            const isCurrent = step === s.id;
            const isDone =
              (s.id === 0 &&
                readiness.items.find((i) => i.key === 'identity')?.complete &&
                readiness.items.find((i) => i.key === 'logo')?.complete) ||
              (s.id === 1 && readiness.items.find((i) => i.key === 'communication')?.complete) ||
              (s.id === 2 && readiness.items.find((i) => i.key === 'locations')?.complete) ||
              (s.id === 3 && readiness.percent === 100);

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={`p-3.5 text-start transition-colors cursor-pointer ${
                  isCurrent ? 'bg-[var(--ink)]' : 'bg-[var(--graphite)] hover:bg-[var(--ink)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-mono-tabular font-bold uppercase ${
                      isCurrent ? 'text-[var(--ember)]' : isDone ? 'text-[var(--cedar)]' : 'text-[var(--bone)]'
                    }`}
                  >
                    {isAr ? s.titleAr : s.titleEn}
                  </span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--cedar)] shrink-0" />}
                </div>
                <p className="mt-1 text-[11px] text-[var(--muted)] line-clamp-1">
                  {isAr ? s.subtitleAr : s.subtitleEn}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 1: Brand Identity, Logo & Custom Cover Banner */}
      {step === 0 && (
        <div className="hairline-grid grid-cols-1 lg:grid-cols-12">
          <div className="hairline-cell lg:col-span-7 p-6 space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-[var(--muted)]">
              <Store className="w-4 h-4 text-[var(--ember)]" />
              <span>{isAr ? 'البيانات الأساسية والشعار والغلاف' : 'Brand Identity, Store Logo & Cover Banner'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label className="block space-y-1">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">Store Name (EN)</span>
                <input
                  value={values.nameEn}
                  onChange={(e) => onChange({ nameEn: e.target.value })}
                  placeholder="Cedars Atelier Beirut"
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">اسم المتجر (AR)</span>
                <input
                  dir="rtl"
                  value={values.nameAr}
                  onChange={(e) => onChange({ nameAr: e.target.value })}
                  placeholder="أتيليه الأرز بيروت"
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">Tagline (EN)</span>
                <input
                  value={values.taglineEn}
                  onChange={(e) => onChange({ taglineEn: e.target.value })}
                  placeholder="Small-batch craftsmanship shipped nationwide"
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">الشعار التعريفي (AR)</span>
                <input
                  dir="rtl"
                  value={values.taglineAr}
                  onChange={(e) => onChange({ taglineAr: e.target.value })}
                  placeholder="حرفية متقنة وتوصيل لجميع المحافظات"
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">About Store (EN)</span>
                <textarea
                  rows={3}
                  value={values.aboutEn}
                  onChange={(e) => onChange({ aboutEn: e.target.value })}
                  placeholder="Tell shoppers what makes your store unique..."
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">نبذة عن المتجر (AR)</span>
                <textarea
                  dir="rtl"
                  rows={3}
                  value={values.aboutAr}
                  onChange={(e) => onChange({ aboutAr: e.target.value })}
                  placeholder="اشرح للعملاء ما يميز منتجاتك وخدماتك..."
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
                />
              </label>
            </div>

            {/* Logo & Custom Banner Upload Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[var(--line)]">
              <div className="border border-[var(--line)] bg-[var(--ink)] p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono-tabular">
                  <span className="uppercase text-[var(--muted)]">
                    {isAr ? 'شعار المتجر (مربع)' : 'Store Logo (1:1 Square)'}
                  </span>
                  <StatusLabel status={seller.logoImage ? 'Uploaded' : 'Required'} tone={seller.logoImage ? 'cedar' : 'gold'} />
                </div>
                <div className="flex items-center gap-3">
                  {seller.logoImage ? (
                    <img
                      src={seller.logoImage}
                      alt={`${values.nameEn || seller.name.en} logo`}
                      className="w-16 h-16 object-cover border border-[var(--line)] bg-[var(--graphite)] shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 border border-dashed border-[var(--line)] flex items-center justify-center text-[11px] font-mono-tabular text-[var(--muted)] shrink-0">
                      1:1
                    </div>
                  )}
                  <div className="space-y-2 min-w-0">
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 border border-[var(--line)] bg-[var(--graphite)] text-xs text-[var(--bone)] hover:border-[var(--ember)] whitespace-nowrap cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingMedia ? 'Uploading...' : isAr ? 'رفع الشعار' : 'Upload Logo'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void onUploadMedia(f, 'store_logo');
                        }}
                      />
                    </label>
                    <p className="text-[11px] text-[var(--muted)]">PNG, JPG, or WEBP · 512x512px recommended</p>
                  </div>
                </div>
              </div>

              <div className="border border-[var(--line)] bg-[var(--ink)] p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono-tabular">
                  <span className="uppercase text-[var(--muted)]">
                    {isAr ? 'بانر الغلاف المخصص' : 'Custom Cover Banner'}
                  </span>
                  <StatusLabel
                    status={
                      seller.bannerImage && !seller.bannerImage.includes('hero_beirut_editorial')
                        ? 'Custom'
                        : 'Default'
                    }
                    tone={
                      seller.bannerImage && !seller.bannerImage.includes('hero_beirut_editorial')
                        ? 'cedar'
                        : 'gold'
                    }
                  />
                </div>
                <div className="flex items-center gap-3">
                  {seller.bannerImage ? (
                    <img
                      src={seller.bannerImage}
                      alt={`${values.nameEn || seller.name.en} banner`}
                      className="w-24 h-16 object-cover border border-[var(--line)] bg-[var(--graphite)] shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-16 border border-dashed border-[var(--line)] flex items-center justify-center text-[11px] font-mono-tabular text-[var(--muted)] shrink-0">
                      16:9
                    </div>
                  )}
                  <div className="space-y-2 min-w-0">
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 border border-[var(--line)] bg-[var(--graphite)] text-xs text-[var(--bone)] hover:border-[var(--ember)] whitespace-nowrap cursor-pointer">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{uploadingMedia ? 'Uploading...' : isAr ? 'رفع الغلاف' : 'Upload Banner'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void onUploadMedia(f, 'store_banner');
                        }}
                      />
                    </label>
                    <p className="text-[11px] text-[var(--muted)]">1600x600px wide cover for your storefront hero</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Storefront Card Preview */}
          <div className="hairline-cell lg:col-span-5 p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-tabular uppercase text-[var(--muted)]">
              <span>{isAr ? 'معاينة واجهة المتجر المباشرة' : 'Live Storefront Header Preview'}</span>
              <span>{activeTheme.name[locale]}</span>
            </div>

            <div className="border border-[var(--line)] bg-[var(--ink)] overflow-hidden">
              <div className="h-36 bg-[var(--graphite)] relative overflow-hidden border-b border-[var(--line)]">
                {seller.bannerImage ? (
                  <img
                    src={seller.bannerImage}
                    alt="Storefront cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute bottom-3 start-3 end-3 flex items-end gap-3">
                  {seller.logoImage ? (
                    <img
                      src={seller.logoImage}
                      alt="Store logo preview"
                      className="w-12 h-12 object-cover border border-[var(--line)] bg-[var(--ink)] shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 border border-[var(--line)] bg-[var(--graphite)] flex items-center justify-center text-xs font-bold text-[var(--bone)] shrink-0">
                      {(values.nameEn || seller.name.en || 'NL').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold text-white truncate">
                      {isAr ? values.nameAr || values.nameEn : values.nameEn || seller.name.en}
                    </p>
                    <p className="text-xs text-white/80 truncate">
                      {isAr ? values.taglineAr || values.taglineEn : values.taglineEn || seller.tagline.en}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2 text-xs">
                <div className="flex flex-wrap items-center gap-2 font-mono-tabular text-[var(--muted)]">
                  <span>{seller.governorate}</span>
                  <span>·</span>
                  <span>{values.storeLocations.length} branch pin(s)</span>
                  <span>·</span>
                  <span style={{ color: activeTheme.accentHexDark }}>
                    {commPrefs.preferredChannel === 'whatsapp'
                      ? 'WhatsApp First'
                      : commPrefs.preferredChannel === 'system_chat'
                        ? 'System Chat First'
                        : 'Phone First'}
                  </span>
                </div>
                <p className="text-[var(--muted)] line-clamp-3">
                  {isAr ? values.aboutAr || values.aboutEn : values.aboutEn || seller.about.en || 'No store bio added yet.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Communication Preferences & WhatsApp Business Links */}
      {step === 1 && (
        <div className="hairline-grid grid-cols-1 lg:grid-cols-12">
          <div className="hairline-cell lg:col-span-7 p-6 space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-[var(--cedar)]">
              <MessageCircle className="w-4 h-4" />
              <span>{isAr ? 'إعدادات واتساب للأعمال وقنوات التواصل' : 'WhatsApp Business Link & Customer Communication'}</span>
            </div>

            {/* Preferred Contact Channel Selector */}
            <div className="space-y-2">
              <p className="text-xs font-mono-tabular uppercase text-[var(--muted)]">
                {isAr ? 'القناة المفضلة لتواصل العملاء' : 'Primary Buyer Contact Channel'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'whatsapp' as const,
                    labelEn: 'WhatsApp Business',
                    labelAr: 'واتساب للأعمال',
                    icon: MessageCircle,
                  },
                  {
                    id: 'system_chat' as const,
                    labelEn: 'NileLink System Chat',
                    labelAr: 'محادثة النظام',
                    icon: MessageSquare,
                  },
                  {
                    id: 'phone' as const,
                    labelEn: 'Direct Phone Call',
                    labelAr: 'اتصال هاتفي',
                    icon: Phone,
                  },
                ].map((ch) => {
                  const Icon = ch.icon;
                  const active = commPrefs.preferredChannel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleCommChange({ preferredChannel: ch.id })}
                      className={`p-3 border text-start text-xs flex items-center gap-2 cursor-pointer ${
                        active
                          ? 'border-[var(--ember)] bg-[var(--ink)] text-[var(--bone)]'
                          : 'border-[var(--line)] bg-[var(--ink)] text-[var(--muted)] hover:border-[var(--bone)]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[var(--ember)]' : ''}`} />
                      <span className="font-semibold whitespace-nowrap">{isAr ? ch.labelAr : ch.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Channel Enable Toggles + Phone Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label className="block space-y-1">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">WhatsApp Business Number</span>
                <input
                  value={values.whatsappPhone}
                  onChange={(e) => onChange({ whatsappPhone: e.target.value })}
                  placeholder="+961 70 123 456"
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 font-mono-tabular text-sm text-[var(--bone)]"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">Direct Store Phone</span>
                <input
                  value={values.storePhone}
                  onChange={(e) => onChange({ storePhone: e.target.value })}
                  placeholder="+961 1 234 567"
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 font-mono-tabular text-sm text-[var(--bone)]"
                />
              </label>

              <label className="block space-y-1 sm:col-span-2">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">
                  Pre-Filled WhatsApp Greeting Message
                </span>
                <textarea
                  rows={2}
                  value={commPrefs.whatsappGreeting || ''}
                  onChange={(e) => handleCommChange({ whatsappGreeting: e.target.value })}
                  placeholder={`Hello ${values.nameEn || seller.name.en}, I am browsing your NileLink storefront and would like help with an order.`}
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
                />
              </label>

              <label className="flex items-center justify-between border border-[var(--line)] bg-[var(--ink)] px-3 py-2.5 cursor-pointer">
                <span className="text-[var(--bone)] font-semibold">Show WhatsApp Business Button</span>
                <input
                  type="checkbox"
                  checked={commPrefs.whatsappEnabled}
                  onChange={(e) => handleCommChange({ whatsappEnabled: e.target.checked })}
                  className="accent-[var(--cedar)]"
                />
              </label>

              <label className="flex items-center justify-between border border-[var(--line)] bg-[var(--ink)] px-3 py-2.5 cursor-pointer">
                <span className="text-[var(--bone)] font-semibold">Enable NileLink System Chat</span>
                <input
                  type="checkbox"
                  checked={commPrefs.systemChatEnabled}
                  onChange={(e) => handleCommChange({ systemChatEnabled: e.target.checked })}
                  className="accent-[var(--ember)]"
                />
              </label>

              <label className="flex items-center justify-between border border-[var(--line)] bg-[var(--ink)] px-3 py-2.5 cursor-pointer">
                <span className="text-[var(--bone)] font-semibold">Allow Direct Phone Calls</span>
                <input
                  type="checkbox"
                  checked={commPrefs.phoneCallsEnabled}
                  onChange={(e) => handleCommChange({ phoneCallsEnabled: e.target.checked })}
                  className="accent-[var(--cyan)]"
                />
              </label>

              <label className="flex items-center justify-between border border-[var(--line)] bg-[var(--ink)] px-3 py-2.5 cursor-pointer">
                <span className="text-[var(--gold)] font-semibold">Vacation Mode Notice</span>
                <input
                  type="checkbox"
                  checked={values.vacationMode}
                  onChange={(e) => onChange({ vacationMode: e.target.checked })}
                  className="accent-[var(--gold)]"
                />
              </label>
            </div>

            {/* Operational Hours, Announcement, Prep SLA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[var(--line)] text-xs">
              <label className="block space-y-1">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">Working Hours</span>
                <input
                  value={values.workingHoursSchedule}
                  onChange={(e) => onChange({ workingHoursSchedule: e.target.value })}
                  placeholder="Mon–Sat 09:00–19:00"
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 font-mono-tabular text-sm text-[var(--bone)]"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">Prep SLA (Hours)</span>
                <input
                  type="number"
                  min={1}
                  max={360}
                  value={values.processingHours}
                  onChange={(e) => onChange({ processingHours: e.target.value })}
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 font-mono-tabular text-sm text-[var(--bone)]"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">Store Announcement (EN)</span>
                <input
                  value={values.announcementEn}
                  onChange={(e) => onChange({ announcementEn: e.target.value })}
                  placeholder="Same-day Beirut courier dispatch before 2 PM"
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">إعلان المتجر (AR)</span>
                <input
                  dir="rtl"
                  value={values.announcementAr}
                  onChange={(e) => onChange({ announcementAr: e.target.value })}
                  placeholder="توصيل في نفس اليوم داخل بيروت"
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
                />
              </label>
            </div>
          </div>

          {/* Live WhatsApp Business Link Tester */}
          <div className="hairline-cell lg:col-span-5 p-6 space-y-4">
            <p className="text-xs font-mono-tabular uppercase text-[var(--muted)]">
              {isAr ? 'معاينة رابط واتساب للأعمال' : 'Generated WhatsApp Business Link'}
            </p>
            <div className="border border-[var(--line)] bg-[var(--ink)] p-4 space-y-3">
              {whatsappPreviewUrl ? (
                <>
                  <p className="text-xs font-mono-tabular text-[var(--cedar)] break-all">{whatsappPreviewUrl}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void handleCopyWhatsApp()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-[var(--line)] bg-[var(--graphite)] text-xs text-[var(--bone)] hover:border-[var(--ember)] whitespace-nowrap cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-[var(--cedar)]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                    </button>
                    <a
                      href={whatsappPreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-[var(--cedar)] text-xs font-semibold text-[var(--cedar)] whitespace-nowrap"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test WhatsApp Link</span>
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-xs text-[var(--gold)]">
                  Enter a valid WhatsApp Business phone number (including country code, e.g. +96170123456) to generate
                  your live buyer deep link.
                </p>
              )}
            </div>

            <div className="border border-[var(--line)] bg-[var(--ink)] p-4 space-y-2 text-xs">
              <p className="font-mono-tabular uppercase text-[var(--muted)]">Channel Visibility Summary</p>
              <div className="flex items-center justify-between">
                <span className="text-[var(--bone)]">WhatsApp Business Link</span>
                <StatusLabel status={commPrefs.whatsappEnabled && whatsappPreviewUrl ? 'Active' : 'Hidden'} tone={commPrefs.whatsappEnabled && whatsappPreviewUrl ? 'cedar' : 'gold'} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--bone)]">NileLink System Chat</span>
                <StatusLabel status={commPrefs.systemChatEnabled ? 'Active' : 'Muted'} tone={commPrefs.systemChatEnabled ? 'cedar' : 'gold'} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--bone)]">Direct Phone Line</span>
                <StatusLabel status={commPrefs.phoneCallsEnabled ? 'Active' : 'Hidden'} tone={commPrefs.phoneCallsEnabled ? 'cedar' : 'gold'} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Store Locations, Theme & Fulfillment */}
      {step === 2 && (
        <div className="border border-[var(--line)] bg-[var(--graphite)] p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <label className="block space-y-1">
              <span className="font-mono-tabular uppercase text-[var(--muted)]">Primary Street / City Address</span>
              <input
                value={values.cityAddress}
                onChange={(e) => onChange({ cityAddress: e.target.value })}
                placeholder="Hamra Main Street, Beirut"
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
              />
            </label>
            <div className="space-y-1">
              <span className="font-mono-tabular uppercase text-[var(--muted)] block">Fulfillment Mode</span>
              <div className="flex gap-2">
                {(['platform', 'self'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onChange({ deliveryMode: mode })}
                    className={`flex-1 px-3 py-2 text-xs border whitespace-nowrap cursor-pointer ${
                      values.deliveryMode === mode
                        ? 'border-[var(--cedar)] bg-[var(--ink)] text-[var(--cedar)] font-semibold'
                        : 'border-[var(--line)] bg-[var(--ink)] text-[var(--muted)]'
                    }`}
                  >
                    {mode === 'platform' ? 'Platform Courier' : 'Self-Delivery Fleet'}
                  </button>
                ))}
              </div>
            </div>
            <label className="block space-y-1">
              <span className="font-mono-tabular uppercase text-[var(--muted)]">Return Policy (EN)</span>
              <input
                value={values.returnPolicyEn}
                onChange={(e) => onChange({ returnPolicyEn: e.target.value })}
                placeholder="7-day exchange in original packaging"
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-mono-tabular uppercase text-[var(--muted)]">سياسة الإرجاع (AR)</span>
              <input
                dir="rtl"
                value={values.returnPolicyAr}
                onChange={(e) => onChange({ returnPolicyAr: e.target.value })}
                placeholder="استبدال خلال 7 أيام بالحالة الأصلية"
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
              />
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-mono-tabular uppercase text-[var(--muted)]">
              Approved Accessible Storefront Theme (WCAG Verified)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.values(APPROVED_STOREFRONT_THEMES).map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onChange({ themeId: th.id })}
                  className={`p-3 border text-start text-xs cursor-pointer ${
                    values.themeId === th.id
                      ? 'border-[var(--ember)] bg-[var(--ink)] text-[var(--bone)]'
                      : 'border-[var(--line)] bg-[var(--ink)] text-[var(--muted)]'
                  }`}
                >
                  <span className="block w-5 h-1.5 mb-2" style={{ backgroundColor: th.accentHexDark }} />
                  {th.name[locale]}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--line)]">
            <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-[var(--muted)] mb-3">
              <MapPin className="w-4 h-4 text-[var(--ember)]" />
              <span>{isAr ? 'مواقع الفروع ونقاط الاستلام' : 'Storefront Branches & Pickup Map Pins'}</span>
            </div>
            <StoreLocationManager
              locations={values.storeLocations}
              defaultGovernorate={seller.governorate}
              defaultDistrict={seller.district}
              defaultPhone={values.whatsappPhone || seller.whatsappPhone}
              onChange={(locs) => onChange({ storeLocations: locs })}
            />
          </div>
        </div>
      )}

      {/* Step 4: Review & Launch */}
      {step === 3 && (
        <div className="hairline-grid grid-cols-1 lg:grid-cols-12">
          <div className="hairline-cell lg:col-span-7 p-6 space-y-4">
            <h3 className="font-display text-xl font-bold text-[var(--bone)]">
              {isAr ? 'قائمة التحقق قبل النشر' : 'Storefront Launch Checklist'}
            </h3>
            <div className="divide-y divide-[var(--line)] border border-[var(--line)]">
              {readiness.items.map((item) => (
                <div
                  key={item.key}
                  className="p-3.5 bg-[var(--ink)] flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        item.complete ? 'text-[var(--cedar)]' : 'text-[var(--muted)]'
                      }`}
                    />
                    <span className={item.complete ? 'text-[var(--bone)]' : 'text-[var(--muted)]'}>
                      {isAr ? item.labelAr : item.labelEn}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(item.stepIndex)}
                    className="px-2.5 py-1 border border-[var(--line)] text-[11px] font-mono-tabular uppercase text-[var(--bone)] hover:border-[var(--ember)] whitespace-nowrap cursor-pointer"
                  >
                    {item.complete ? (isAr ? 'تعديل' : 'Edit') : isAr ? 'إكمال' : 'Fix Now'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="hairline-cell lg:col-span-5 p-6 space-y-4">
            <h3 className="font-display text-xl font-bold text-[var(--bone)]">
              {isAr ? 'ملخص الإعدادات' : 'Configuration Summary'}
            </h3>
            <div className="space-y-2.5 text-xs font-mono-tabular border border-[var(--line)] bg-[var(--ink)] p-4">
              <div className="flex justify-between gap-2">
                <span className="text-[var(--muted)]">Storefront URL</span>
                <span className="text-[var(--bone)]">/store/{seller.slug}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[var(--muted)]">Preferred Contact</span>
                <span className="text-[var(--ember)] uppercase">{commPrefs.preferredChannel.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[var(--muted)]">WhatsApp Number</span>
                <span className="text-[var(--bone)]">{values.whatsappPhone || 'Not set'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[var(--muted)]">Fulfillment</span>
                <span className="text-[var(--bone)] uppercase">{values.deliveryMode}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[var(--muted)]">Branch Locations</span>
                <span className="text-[var(--bone)]">{values.storeLocations.length} pinned</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => void handleSave()}
                className="w-full py-3 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-60"
              >
                {saving
                  ? 'Saving Business Setup...'
                  : isAr
                    ? 'حفظ واعتماد إعدادات المتجر'
                    : 'Complete & Save Business Setup'}
              </button>
              <button
                type="button"
                onClick={onOpenStorefront}
                className="w-full py-2.5 border border-[var(--line)] text-xs font-semibold text-[var(--bone)] hover:border-[var(--ember)] cursor-pointer"
              >
                {isAr ? 'معاينة المتجر المباشر' : 'Open Public Storefront'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Footer Controls */}
      <div className="border border-[var(--line)] bg-[var(--graphite)] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--line)] text-xs font-semibold text-[var(--bone)] hover:border-[var(--bone)] disabled:opacity-40 whitespace-nowrap cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isAr ? 'السابق' : 'Previous Step'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="px-4 py-2 border border-[var(--cedar)] text-xs font-semibold text-[var(--cedar)] hover:bg-[var(--ink)] disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            {saving ? 'Saving...' : isAr ? 'حفظ التقدم' : 'Save Progress'}
          </button>

          {step < WIZARD_STEPS.length - 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(WIZARD_STEPS.length - 1, s + 1))}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase whitespace-nowrap cursor-pointer"
            >
              <span>{isAr ? 'الخطوة التالية' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
