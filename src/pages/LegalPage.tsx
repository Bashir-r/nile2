import React, { useEffect, useState } from 'react';
import type { PageContent } from '../shared/types.ts';
import { useMarketplace } from '../context/MarketplaceContext.tsx';
import { EmptyState, SectionHeading } from '../components/HairlineUI.tsx';
import { useSeoMetadata } from '../utils/seo.ts';

const LEGAL_SLUGS = [
  { slug: 'terms', tab: 'terms' },
  { slug: 'privacy', tab: 'privacy' },
  { slug: 'returns', tab: 'returns' },
  { slug: 'seller-agreement', tab: 'seller' },
];

export function LegalPage() {
  const { route, navigate, locale, t } = useMarketplace();
  const params = new URLSearchParams(route.split('?')[1] || '');
  const activeTab = params.get('tab') || 'terms';
  const activeSlug = activeTab === 'seller' ? 'seller-agreement' : activeTab;

  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/pages/${encodeURIComponent(activeSlug)}`);
        if (!res.ok) {
          if (active) setPage(null);
          return;
        }
        const data = await res.json();
        if (active) setPage(data.page || null);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [activeSlug]);

  const tabLabels: Record<string, string> = {
    terms: t.legalTerms,
    privacy: t.legalPrivacy,
    returns: t.legalReturns,
    seller: t.legalSellerAgreement,
  };

  useSeoMetadata(
    {
      entityType: 'page',
      entityKey: 'legal',
      title: page?.title[locale] || tabLabels[activeTab] || t.legalTerms,
      description:
        locale === 'ar'
          ? 'الشروط والأحكام وسياسة الخصوصية والإرجاع واتفاقية التاجر في نايل لينك.'
          : 'Marketplace terms of service, privacy policy, return rules, and seller agreement for NileLink Lebanon.',
      canonicalPath: `/legal?tab=${encodeURIComponent(activeTab)}`,
    },
    [activeTab, page?.title?.en]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-6">
      <SectionHeading title={page?.title[locale] || tabLabels[activeTab] || t.legalTerms} />
      <div className="flex flex-wrap gap-2">
        {LEGAL_SLUGS.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => navigate(`/legal?tab=${item.tab}`)}
            className={`px-3.5 py-1.5 text-xs border cursor-pointer ${
              activeSlug === item.slug
                ? 'border-[var(--ember)] bg-[var(--ember)] text-[var(--ember-fg)] font-semibold'
                : 'border-[var(--line)] text-[var(--bone)]'
            }`}
          >
            {tabLabels[item.tab]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-40 border border-[var(--line)] bg-[var(--graphite)] animate-pulse" />
      ) : !page ? (
        <EmptyState
          title={locale === 'ar' ? 'الصفحة غير متاحة حالياً' : 'Document not published yet'}
          description={
            locale === 'ar'
              ? 'يمكن للمسؤول نشر هذه الصفحة من لوحة الإدارة.'
              : 'Administrators can publish or edit this legal page in Admin Console → Pages.'
          }
        />
      ) : (
        <article className="border border-[var(--line)] bg-[var(--graphite)] p-6 md:p-8 space-y-5">
          {page.updatedAt && (
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--line)] text-xs font-mono-tabular text-[var(--muted)]">
              <span>{locale === 'ar' ? 'الوثيقة الرسمية لمنصة نايل لينك' : 'Official NileLink Marketplace Policy'}</span>
              <span>
                {locale === 'ar' ? 'آخر تحديث:' : 'Last updated:'} {new Date(page.updatedAt).toLocaleDateString(locale === 'ar' ? 'ar-LB' : 'en-US')}
              </span>
            </div>
          )}
          <div className="space-y-4 text-sm text-[var(--muted)] leading-relaxed">
            {(page.body[locale] || page.body.en)
              .split(/\n{2,}/)
              .map((block, idx) => {
                const trimmed = block.trim();
                const isHeading = /^(\d+|[١-٩])+[.)]/.test(trimmed) && trimmed.length < 140;
                return isHeading ? (
                  <h2 key={idx} className="text-base font-display font-bold text-[var(--bone)] pt-2">
                    {trimmed}
                  </h2>
                ) : (
                  <p key={idx} className="whitespace-pre-line text-[var(--bone)]/90">
                    {trimmed}
                  </p>
                );
              })}
          </div>
        </article>
      )}
    </div>
  );
}
