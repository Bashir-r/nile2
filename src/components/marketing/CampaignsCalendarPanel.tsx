import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  GripVertical,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type {
  BannerBgToken,
  Campaign,
  CampaignStatus,
  Coupon,
  FlashSale,
  Offer,
  OfferBanner,
} from '../../shared/types.ts';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { EmptyState, StatusLabel } from '../HairlineUI.tsx';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

function toDatetimeLocalValue(iso?: string | null): string {
  if (!iso) return '';
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return '';
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type CalendarEventKind = 'Campaign' | 'Flash Sale' | 'Offer' | 'Banner';

interface CalendarScheduleEvent {
  id: string;
  kind: CalendarEventKind;
  label: string;
  startsAt?: string | null;
  endsAt?: string | null;
  color: string;
  statusLabel: string;
  slug?: string;
}

export function CampaignsCalendarPanel({
  campaigns,
  offers,
  coupons,
  flashSales,
  banners,
  onReload,
}: {
  campaigns: Campaign[];
  offers: Offer[];
  coupons: Coupon[];
  flashSales: FlashSale[];
  banners: OfferBanner[];
  onReload: () => Promise<void>;
}) {
  const { apiFetch, showToast, navigate, refreshBootstrap } = useMarketplace();
  const [viewMode, setViewMode] = useState<'campaigns' | 'calendar'>('campaigns');

  // Calendar interactive state
  const [calendarCursor, setCalendarCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [kindFilter, setKindFilter] = useState<Record<CalendarEventKind, boolean>>({
    Campaign: true,
    'Flash Sale': true,
    Offer: true,
    Banner: true,
  });
  const [draggingEvent, setDraggingEvent] = useState<CalendarScheduleEvent | null>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editStartLocal, setEditStartLocal] = useState('');
  const [editEndLocal, setEditEndLocal] = useState('');
  const [savingSchedule, setSavingSchedule] = useState(false);

  const [slug, setSlug] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');
  const [subtitleAr, setSubtitleAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [bgToken, setBgToken] = useState<BannerBgToken>('ember');
  const [status, setStatus] = useState<CampaignStatus>('active');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [featuredOfferIds, setFeaturedOfferIds] = useState<string[]>([]);
  const [featuredCouponCodes, setFeaturedCouponCodes] = useState<string[]>([]);
  const [featuredFlashSaleId, setFeaturedFlashSaleId] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUploadHero = async (file: File) => {
    setUploading(true);
    try {
      const base64Data = await readFileAsDataUrl(file);
      const res = await apiFetch<{ media: { publicUrl: string } }>('/api/uploads', {
        method: 'POST',
        body: JSON.stringify({
          base64Data,
          mimeType: file.type,
          entityType: 'marketing_campaign',
          folder: 'campaigns',
          alt: { en: titleEn || 'Campaign Hero', ar: titleAr || 'صورة الحملة' },
        }),
      });
      setHeroImageUrl(res.media.publicUrl);
      showToast('Campaign hero image uploaded', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanSlug =
        slug.trim() ||
        titleEn
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') ||
        `campaign-${Date.now()}`;

      await apiFetch('/api/admin/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          slug: cleanSlug,
          title: { en: titleEn.trim(), ar: (titleAr || titleEn).trim() },
          subtitle: { en: subtitleEn.trim(), ar: (subtitleAr || subtitleEn).trim() },
          description: { en: descEn.trim(), ar: (descAr || descEn).trim() },
          heroImageUrl: heroImageUrl.trim() || null,
          bgToken,
          status,
          startsAt: startsAt ? new Date(startsAt).toISOString() : null,
          endsAt: endsAt ? new Date(endsAt).toISOString() : null,
          featuredOfferIds,
          featuredCouponCodes,
          featuredFlashSaleId: featuredFlashSaleId || null,
        }),
      });
      setSlug('');
      setTitleEn('');
      setTitleAr('');
      setSubtitleEn('');
      setSubtitleAr('');
      setDescEn('');
      setDescAr('');
      setHeroImageUrl('');
      setFeaturedOfferIds([]);
      setFeaturedCouponCodes([]);
      setFeaturedFlashSaleId('');
      showToast(`Campaign /campaign/${cleanSlug} created`, 'success');
      await onReload();
      await refreshBootstrap();
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  };

  const allCalendarEvents = useMemo<CalendarScheduleEvent[]>(() => {
    return [
      ...campaigns.map((c) => ({
        id: c.id,
        kind: 'Campaign' as const,
        label: c.title.en,
        startsAt: c.startsAt,
        endsAt: c.endsAt,
        color: 'var(--ember)',
        statusLabel: c.status,
        slug: c.slug,
      })),
      ...flashSales.map((f) => ({
        id: f.id,
        kind: 'Flash Sale' as const,
        label: f.title.en,
        startsAt: f.startsAt,
        endsAt: f.endsAt,
        color: 'var(--gold)',
        statusLabel: f.status,
      })),
      ...offers.map((o) => ({
        id: o.id,
        kind: 'Offer' as const,
        label: o.title.en,
        startsAt: o.startsAt,
        endsAt: o.endsAt,
        color: 'var(--cedar)',
        statusLabel: o.active ? o.approvalStatus : 'paused',
      })),
      ...banners.map((b) => ({
        id: b.id,
        kind: 'Banner' as const,
        label: b.title.en,
        startsAt: b.startsAt,
        endsAt: b.endsAt,
        color: 'var(--cyan)',
        statusLabel: b.active ? 'active' : 'paused',
      })),
    ];
  }, [campaigns, flashSales, offers, banners]);

  const calendarDays = useMemo(() => {
    const year = calendarCursor.getFullYear();
    const month = calendarCursor.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthLabel = calendarCursor.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const filteredEvents = allCalendarEvents.filter((ev) => kindFilter[ev.kind]);

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStart = new Date(year, month, d, 0, 0, 0).getTime();
      const dayEnd = new Date(year, month, d, 23, 59, 59).getTime();
      const activeToday = filteredEvents.filter((ev) => {
        const s = ev.startsAt ? Date.parse(ev.startsAt) : -Infinity;
        const e = ev.endsAt ? Date.parse(ev.endsAt) : Infinity;
        return s <= dayEnd && e >= dayStart;
      });
      days.push({
        day: d,
        isToday: isCurrentMonth && today.getDate() === d,
        activeToday,
      });
    }
    return { year, month, firstWeekday, monthLabel, days };
  }, [calendarCursor, allCalendarEvents, kindFilter]);

  const selectedEvent = useMemo(
    () => allCalendarEvents.find((ev) => ev.id === selectedEventId) || null,
    [allCalendarEvents, selectedEventId]
  );

  const openInspector = (ev: CalendarScheduleEvent) => {
    setSelectedEventId(ev.id);
    setEditStartLocal(toDatetimeLocalValue(ev.startsAt));
    setEditEndLocal(toDatetimeLocalValue(ev.endsAt));
  };

  const persistEventDates = async (
    ev: CalendarScheduleEvent,
    nextStartsIso: string | null,
    nextEndsIso: string | null
  ) => {
    if (nextStartsIso && nextEndsIso && Date.parse(nextEndsIso) <= Date.parse(nextStartsIso)) {
      showToast('End time must be after start time.', 'error');
      return;
    }
    setSavingSchedule(true);
    try {
      const endpoint =
        ev.kind === 'Campaign'
          ? `/api/admin/campaigns/${ev.id}`
          : ev.kind === 'Flash Sale'
            ? `/api/admin/flash-sales/${ev.id}`
            : ev.kind === 'Offer'
              ? `/api/admin/offers/${ev.id}`
              : `/api/admin/banners/${ev.id}`;

      const payload: Record<string, string | null> = {};
      if (ev.kind === 'Flash Sale') {
        payload.startsAt = nextStartsIso || new Date().toISOString();
        payload.endsAt = nextEndsIso || new Date(Date.now() + 86_400_000).toISOString();
      } else {
        payload.startsAt = nextStartsIso;
        payload.endsAt = nextEndsIso;
      }

      await apiFetch(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      showToast(`Rescheduled ${ev.kind}: ${ev.label}`, 'success');
      await onReload();
      await refreshBootstrap();
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleDropOnDay = async (targetDay: number) => {
    setDragOverDay(null);
    if (!draggingEvent) return;
    const ev = draggingEvent;
    setDraggingEvent(null);

    const targetStart = new Date(calendarDays.year, calendarDays.month, targetDay, 9, 0, 0, 0);
    const oldStartMs = ev.startsAt ? Date.parse(ev.startsAt) : NaN;
    const oldEndMs = ev.endsAt ? Date.parse(ev.endsAt) : NaN;
    const durationMs =
      Number.isFinite(oldStartMs) && Number.isFinite(oldEndMs) && oldEndMs > oldStartMs
        ? oldEndMs - oldStartMs
        : 3 * 86_400_000;

    const nextStartsIso = targetStart.toISOString();
    const nextEndsIso = new Date(targetStart.getTime() + durationMs).toISOString();
    await persistEventDates(ev, nextStartsIso, nextEndsIso);
    if (selectedEventId === ev.id) {
      setEditStartLocal(toDatetimeLocalValue(nextStartsIso));
      setEditEndLocal(toDatetimeLocalValue(nextEndsIso));
    }
  };

  const overlappingDaysCount = useMemo(
    () => calendarDays.days.filter((d) => d.activeToday.length >= 2).length,
    [calendarDays]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-[var(--line)] bg-[var(--graphite)] px-4 py-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('campaigns')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 border font-semibold cursor-pointer ${
              viewMode === 'campaigns'
                ? 'border-[var(--ember)] bg-[var(--ember)] text-[var(--ember-fg)]'
                : 'border-[var(--line)] text-[var(--bone)]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Campaign Landing Pages ({campaigns.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 border font-semibold cursor-pointer ${
              viewMode === 'calendar'
                ? 'border-[var(--ember)] bg-[var(--ember)] text-[var(--ember-fg)]'
                : 'border-[var(--line)] text-[var(--bone)]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" /> Interactive Campaign Calendar
          </button>
        </div>
        <span className="font-mono-tabular text-[var(--muted)]">
          Public URL: <code className="text-[var(--bone)]">/campaign/&lt;slug&gt;</code>
        </span>
      </div>

      {viewMode === 'calendar' ? (
        <div className="border border-[var(--line)] bg-[var(--graphite)] p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-xl font-bold text-[var(--bone)]">
                {calendarDays.monthLabel}
              </h3>
              <div className="inline-flex items-center border border-[var(--line)] bg-[var(--ink)] text-xs font-mono-tabular">
                <button
                  type="button"
                  onClick={() =>
                    setCalendarCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))
                  }
                  aria-label="Previous month"
                  className="p-2 text-[var(--bone)] hover:text-[var(--ember)] cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    setCalendarCursor(new Date(now.getFullYear(), now.getMonth(), 1));
                  }}
                  className="px-3 py-1.5 border-x border-[var(--line)] text-[var(--bone)] hover:text-[var(--ember)] cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCalendarCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))
                  }
                  aria-label="Next month"
                  className="p-2 text-[var(--bone)] hover:text-[var(--ember)] cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {overlappingDaysCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[var(--gold)] bg-[var(--ink)] text-[11px] font-mono-tabular text-[var(--gold)]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {overlappingDaysCount} day(s) with overlapping promos
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] font-mono-tabular">
              {(
                [
                  { kind: 'Campaign' as const, color: 'var(--ember)' },
                  { kind: 'Flash Sale' as const, color: 'var(--gold)' },
                  { kind: 'Offer' as const, color: 'var(--cedar)' },
                  { kind: 'Banner' as const, color: 'var(--cyan)' },
                ]
              ).map((item) => (
                <button
                  key={item.kind}
                  type="button"
                  onClick={() => setKindFilter((f) => ({ ...f, [item.kind]: !f[item.kind] }))}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 border cursor-pointer ${
                    kindFilter[item.kind]
                      ? 'border-[var(--line)] bg-[var(--ink)] text-[var(--bone)]'
                      : 'border-[var(--line)] bg-transparent text-[var(--muted)] opacity-50'
                  }`}
                >
                  <span className="w-2 h-2 inline-block shrink-0" style={{ backgroundColor: item.color }} />
                  <span>{item.kind}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] font-mono-tabular text-[var(--muted)]">
            Drag and drop any campaign, flash sale, offer, or banner onto a target day to shift its schedule, or click an item to edit exact start/end timestamps.
          </p>

          {/* Unscheduled / Active Queue Draggable Tray */}
          {allCalendarEvents.filter((ev) => kindFilter[ev.kind] && (!ev.startsAt || !ev.endsAt)).length > 0 && (
            <div className="border border-[var(--line)] bg-[var(--ink)] p-3 space-y-2">
              <p className="text-[11px] font-mono-tabular uppercase text-[var(--muted)]">
                Unbounded / Continuous Promos (Drag onto any day to lock a timed window)
              </p>
              <div className="flex flex-wrap gap-2">
                {allCalendarEvents
                  .filter((ev) => kindFilter[ev.kind] && (!ev.startsAt || !ev.endsAt))
                  .map((ev) => (
                    <button
                      key={`unbounded-${ev.id}`}
                      type="button"
                      draggable
                      onDragStart={() => setDraggingEvent(ev)}
                      onDragEnd={() => {
                        setDraggingEvent(null);
                        setDragOverDay(null);
                      }}
                      onClick={() => openInspector(ev)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--line)] bg-[var(--graphite)] text-[11px] text-[var(--bone)] hover:border-[var(--ember)] cursor-grab"
                    >
                      <GripVertical className="w-3 h-3 text-[var(--muted)]" />
                      <span className="w-2 h-2 shrink-0" style={{ backgroundColor: ev.color }} />
                      <span>{ev.label}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
            <div className={selectedEvent ? 'xl:col-span-8' : 'xl:col-span-12'}>
              <div className="hidden md:grid grid-cols-7 border-t border-s border-[var(--line)] bg-[var(--graphite)] text-[11px] font-mono-tabular text-[var(--muted)] uppercase">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dow) => (
                  <div key={dow} className="px-2 py-1.5 border-e border-[var(--line)]">
                    {dow}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 border-t border-s border-[var(--line)]">
                {Array.from({ length: calendarDays.firstWeekday }).map((_, padIdx) => (
                  <div
                    key={`pad-${padIdx}`}
                    className="hidden md:block min-h-[115px] border-e border-b border-[var(--line)] bg-[var(--graphite)]/40"
                  />
                ))}
                {calendarDays.days.map((d) => {
                  const isDropTarget = dragOverDay === d.day;
                  return (
                    <div
                      key={d.day}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverDay !== d.day) setDragOverDay(d.day);
                      }}
                      onDragLeave={() => {
                        if (dragOverDay === d.day) setDragOverDay(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        void handleDropOnDay(d.day);
                      }}
                      className={`min-h-[115px] border-e border-b p-2 space-y-1 transition-colors ${
                        isDropTarget
                          ? 'border-[var(--ember)] bg-[var(--graphite)]'
                          : d.isToday
                            ? 'border-[var(--line)] bg-[var(--ink)] ring-1 ring-inset ring-[var(--ember)]'
                            : 'border-[var(--line)] bg-[var(--ink)]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono-tabular text-[var(--muted)]">
                        <span className={d.isToday ? 'text-[var(--ember)] font-bold' : ''}>Day {d.day}</span>
                        {d.activeToday.length > 0 && (
                          <span
                            className={`px-1 border text-[10px] ${
                              d.activeToday.length >= 2
                                ? 'border-[var(--gold)] text-[var(--gold)]'
                                : 'border-[var(--line)] text-[var(--muted)]'
                            }`}
                            title={d.activeToday.length >= 2 ? 'Overlapping promotions on this day' : undefined}
                          >
                            {d.activeToday.length}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {d.activeToday.slice(0, 4).map((ev) => (
                          <button
                            key={`${d.day}-${ev.id}`}
                            type="button"
                            draggable
                            onDragStart={() => setDraggingEvent(ev)}
                            onDragEnd={() => {
                              setDraggingEvent(null);
                              setDragOverDay(null);
                            }}
                            onClick={() => openInspector(ev)}
                            className={`w-full px-1.5 py-1 border text-[10px] flex items-center gap-1 text-start truncate cursor-grab ${
                              selectedEventId === ev.id
                                ? 'border-[var(--ember)] bg-[var(--ink)] text-[var(--bone)]'
                                : 'border-[var(--line)] bg-[var(--graphite)] text-[var(--bone)] hover:border-[var(--muted)]'
                            }`}
                            title={`${ev.kind}: ${ev.label} (Drag to reschedule or click to edit)`}
                          >
                            <span
                              className="w-1.5 h-1.5 shrink-0"
                              style={{ backgroundColor: ev.color }}
                              aria-hidden="true"
                            />
                            <span className="truncate flex-1">{ev.label}</span>
                          </button>
                        ))}
                        {d.activeToday.length > 4 && (
                          <button
                            type="button"
                            onClick={() => openInspector(d.activeToday[4])}
                            className="text-[10px] font-mono-tabular text-[var(--gold)] hover:underline cursor-pointer"
                          >
                            +{d.activeToday.length - 4} overlapping
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedEvent && (
              <div className="xl:col-span-4 border border-[var(--line)] bg-[var(--ink)] p-4 space-y-3 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 font-mono-tabular text-[11px]">
                      <span className="w-2 h-2" style={{ backgroundColor: selectedEvent.color }} />
                      <span className="uppercase text-[var(--ember)]">{selectedEvent.kind}</span>
                      <span className="text-[var(--muted)]">· {selectedEvent.statusLabel}</span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-[var(--bone)] mt-1">
                      {selectedEvent.label}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedEventId(null)}
                    aria-label="Close schedule inspector"
                    className="p-1 text-[var(--muted)] hover:text-[var(--bone)] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  <label className="block space-y-1">
                    <span className="font-mono-tabular uppercase text-[11px] text-[var(--muted)]">
                      Start Timestamp
                    </span>
                    <input
                      type="datetime-local"
                      value={editStartLocal}
                      onChange={(e) => setEditStartLocal(e.target.value)}
                      className="w-full bg-[var(--graphite)] border border-[var(--line)] px-2.5 py-2 font-mono-tabular text-[var(--bone)]"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="font-mono-tabular uppercase text-[11px] text-[var(--muted)]">
                      End Timestamp
                    </span>
                    <input
                      type="datetime-local"
                      value={editEndLocal}
                      onChange={(e) => setEditEndLocal(e.target.value)}
                      className="w-full bg-[var(--graphite)] border border-[var(--line)] px-2.5 py-2 font-mono-tabular text-[var(--bone)]"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={savingSchedule}
                    onClick={() => {
                      const sMs = editStartLocal ? Date.parse(editStartLocal) : Date.now();
                      const eMs = editEndLocal ? Date.parse(editEndLocal) : sMs + 3 * 86_400_000;
                      const nextS = new Date(sMs - 86_400_000);
                      const nextE = new Date(eMs - 86_400_000);
                      setEditStartLocal(toDatetimeLocalValue(nextS.toISOString()));
                      setEditEndLocal(toDatetimeLocalValue(nextE.toISOString()));
                      void persistEventDates(selectedEvent, nextS.toISOString(), nextE.toISOString());
                    }}
                    className="px-2.5 py-1.5 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)] cursor-pointer"
                  >
                    Shift -1 Day
                  </button>
                  <button
                    type="button"
                    disabled={savingSchedule}
                    onClick={() => {
                      const sMs = editStartLocal ? Date.parse(editStartLocal) : Date.now();
                      const eMs = editEndLocal ? Date.parse(editEndLocal) : sMs + 3 * 86_400_000;
                      const nextS = new Date(sMs + 86_400_000);
                      const nextE = new Date(eMs + 86_400_000);
                      setEditStartLocal(toDatetimeLocalValue(nextS.toISOString()));
                      setEditEndLocal(toDatetimeLocalValue(nextE.toISOString()));
                      void persistEventDates(selectedEvent, nextS.toISOString(), nextE.toISOString());
                    }}
                    className="px-2.5 py-1.5 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)] cursor-pointer"
                  >
                    Shift +1 Day
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[var(--line)]">
                  <button
                    type="button"
                    disabled={savingSchedule}
                    onClick={() =>
                      void persistEventDates(
                        selectedEvent,
                        editStartLocal ? new Date(editStartLocal).toISOString() : null,
                        editEndLocal ? new Date(editEndLocal).toISOString() : null
                      )
                    }
                    className="flex-1 py-2 bg-[var(--ember)] text-[var(--ember-fg)] font-bold uppercase inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{savingSchedule ? 'Saving...' : 'Save Timing'}</span>
                  </button>
                  {selectedEvent.slug && (
                    <button
                      type="button"
                      onClick={() => navigate(`/campaign/${selectedEvent.slug}`)}
                      className="px-3 py-2 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)] cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hairline-grid grid-cols-1 lg:grid-cols-12">
          <form onSubmit={handleCreateCampaign} className="hairline-cell lg:col-span-5 p-6 space-y-3 text-xs">
            <h3 className="font-display text-xl font-bold text-[var(--bone)]">Create Campaign Landing Page</h3>
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="URL Slug (e.g. beirut-summer-edit)"
              className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 font-mono-tabular text-[var(--bone)]"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Campaign Title (EN)"
                className="bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-[var(--bone)]"
              />
              <input
                required
                dir="rtl"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="عنوان الحملة (AR)"
                className="bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-[var(--bone)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={subtitleEn}
                onChange={(e) => setSubtitleEn(e.target.value)}
                placeholder="Subtitle (EN)"
                className="bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-[var(--bone)]"
              />
              <input
                dir="rtl"
                value={subtitleAr}
                onChange={(e) => setSubtitleAr(e.target.value)}
                placeholder="العنوان الفرعي (AR)"
                className="bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-[var(--bone)]"
              />
            </div>
            <textarea
              rows={2}
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              placeholder="Description (EN)"
              className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-[var(--bone)]"
            />
            <textarea
              rows={2}
              dir="rtl"
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
              placeholder="وصف الحملة (AR)"
              className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-[var(--bone)]"
            />

            <div className="flex items-center gap-2">
              <input
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="Hero Image URL (or upload)"
                className="flex-1 bg-[var(--ink)] border border-[var(--line)] px-3 py-2 font-mono-tabular text-[var(--bone)]"
              />
              <label className="inline-flex items-center gap-1 px-3 py-2 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)] cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? '...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleUploadHero(file);
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={bgToken}
                onChange={(e) => setBgToken(e.target.value as BannerBgToken)}
                className="bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-[var(--bone)]"
              >
                <option value="ember">Ember Border</option>
                <option value="gold">Gold Border</option>
                <option value="cedar">Cedar Border</option>
                <option value="cyan">Cyan Border</option>
                <option value="sand">Sand Border</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CampaignStatus)}
                className="bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-[var(--bone)]"
              >
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
                <option value="ended">Ended</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                aria-label="Campaign start"
                className="bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 font-mono-tabular text-[var(--bone)]"
              />
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                aria-label="Campaign end"
                className="bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 font-mono-tabular text-[var(--bone)]"
              />
            </div>

            {flashSales.length > 0 && (
              <select
                value={featuredFlashSaleId}
                onChange={(e) => setFeaturedFlashSaleId(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-[var(--bone)]"
              >
                <option value="">Attach Flash Sale (optional)</option>
                {flashSales.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title.en}
                  </option>
                ))}
              </select>
            )}

            {coupons.length > 0 && (
              <div className="border border-[var(--line)] bg-[var(--ink)] p-2.5 space-y-1 max-h-28 overflow-y-auto">
                <p className="font-mono-tabular uppercase text-[var(--muted)]">Feature Coupon Codes</p>
                <div className="flex flex-wrap gap-2">
                  {coupons.map((cp) => {
                    const checked = featuredCouponCodes.includes(cp.code);
                    return (
                      <label key={cp.id} className="inline-flex items-center gap-1 text-[var(--bone)] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            setFeaturedCouponCodes((prev) =>
                              e.target.checked ? [...prev, cp.code] : prev.filter((x) => x !== cp.code)
                            )
                          }
                        />
                        <span className="font-mono-tabular">{cp.code}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {offers.length > 0 && (
              <div className="border border-[var(--line)] bg-[var(--ink)] p-2.5 space-y-1 max-h-28 overflow-y-auto">
                <p className="font-mono-tabular uppercase text-[var(--muted)]">Feature Offers</p>
                {offers.map((off) => {
                  const checked = featuredOfferIds.includes(off.id);
                  return (
                    <label key={off.id} className="flex items-center gap-2 text-[var(--bone)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setFeaturedOfferIds((prev) =>
                            e.target.checked ? [...prev, off.id] : prev.filter((x) => x !== off.id)
                          )
                        }
                      />
                      <span className="truncate">{off.title.en}</span>
                    </label>
                  );
                })}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] font-bold uppercase cursor-pointer"
            >
              Publish Campaign Page
            </button>
          </form>

          <div className="hairline-cell lg:col-span-7 p-6 space-y-4">
            <h3 className="font-display text-xl font-bold text-[var(--bone)]">Campaigns ({campaigns.length})</h3>
            {campaigns.length === 0 ? (
              <EmptyState
                title="No campaigns created yet"
                description="Build seasonal landing pages (/campaign/:slug) combining offers, flash sales, and copyable coupons."
              />
            ) : (
              <div className="divide-y divide-[var(--line)] border border-[var(--line)]">
                {campaigns.map((cmp) => (
                  <div key={cmp.id} className="p-4 flex flex-wrap items-center justify-between gap-3 bg-[var(--ink)] text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono-tabular">
                        <StatusLabel
                          status={cmp.status}
                          tone={cmp.status === 'active' ? 'cedar' : cmp.status === 'scheduled' ? 'gold' : 'muted'}
                        />
                        <span className="text-[var(--cyan)]">/campaign/{cmp.slug}</span>
                      </div>
                      <p className="font-display text-lg font-bold text-[var(--bone)]">{cmp.title.en}</p>
                      <p className="text-[11px] font-mono-tabular text-[var(--muted)]">
                        {cmp.featuredOfferIds.length} offer(s) · {cmp.featuredCouponCodes.length} coupon(s)
                        {cmp.featuredFlashSaleId ? ' · 1 flash sale' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/campaign/${cmp.slug}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)] cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await apiFetch(`/api/admin/campaigns/${cmp.id}`, {
                            method: 'PATCH',
                            body: JSON.stringify({ status: cmp.status === 'active' ? 'ended' : 'active' }),
                          });
                          await onReload();
                          await refreshBootstrap();
                        }}
                        className="px-2.5 py-1.5 border border-[var(--line)] text-[var(--bone)] cursor-pointer"
                      >
                        {cmp.status === 'active' ? 'End' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await apiFetch(`/api/admin/campaigns/${cmp.id}`, { method: 'DELETE' });
                          showToast('Campaign deleted', 'info');
                          await onReload();
                          await refreshBootstrap();
                        }}
                        aria-label="Delete campaign"
                        className="p-1.5 border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ember)] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
