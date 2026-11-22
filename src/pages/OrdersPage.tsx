import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, MessageCircle, RotateCcw, Search, Truck } from 'lucide-react';
import type { Order, OrderDispute, ReturnRequest } from '../shared/types.ts';
import { useMarketplace } from '../context/MarketplaceContext.tsx';
import { EmptyState, PriceDisplay, SectionHeading, StatusLabel } from '../components/HairlineUI.tsx';
import { useSeoMetadata } from '../utils/seo.ts';

export function OrdersPage() {
  const { locale, t, apiFetch, navigate, authUser, showToast } = useMarketplace();
  const [orders, setOrders] = useState<Order[]>([]);
  const [returnsList, setReturnsList] = useState<ReturnRequest[]>([]);
  const [disputesList, setDisputesList] = useState<OrderDispute[]>([]);
  const [lookupNumber, setLookupNumber] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const [caseMode, setCaseMode] = useState<{ subOrderId: string; type: 'return' | 'dispute'; orderNumber: string } | null>(
    null
  );
  const [caseReason, setCaseReason] = useState('');
  const [submittingCase, setSubmittingCase] = useState(false);

  useSeoMetadata({
    title: t.myOrders,
    description:
      locale === 'ar'
        ? 'تتبع الشحنات المقسمة حسب البائع وطلبات الإرجاع والنزاعات.'
        : 'Track live split-seller shipments, return requests, and dispute cases on NileLink.',
    canonicalPath: '/orders',
    robots: 'noindex,follow',
  });

  const loadOrders = useCallback(
    async (num = '', phone = '') => {
      if (!authUser && (!num.trim() || !phone.trim())) {
        setOrders([]);
        setReturnsList([]);
        setDisputesList([]);
        return;
      }
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (num.trim()) qs.set('orderNumber', num.trim());
        if (phone.trim()) qs.set('phone', phone.trim());
        const suffix = qs.toString() ? `?${qs.toString()}` : '';
        const data = await apiFetch<{
          orders: Order[];
          returns?: ReturnRequest[];
          disputes?: OrderDispute[];
        }>(`/api/orders/lookup${suffix}`);
        setOrders(data.orders || []);
        setReturnsList(data.returns || []);
        setDisputesList(data.disputes || []);
      } catch (err) {
        showToast((err as Error).message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [authUser, apiFetch, showToast]
  );

  useEffect(() => {
    if (authUser) void loadOrders();
  }, [authUser, loadOrders]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    void loadOrders(lookupNumber, lookupPhone);
  };

  const handleSubmitCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseMode) return;
    if (caseReason.trim().length < 5) {
      showToast(
        locale === 'ar' ? 'يرجى كتابة سبب واضح (5 أحرف على الأقل)' : 'Please describe the reason (at least 5 characters).',
        'error'
      );
      return;
    }
    setSubmittingCase(true);
    try {
      const payload: Record<string, string> = {
        subOrderId: caseMode.subOrderId,
        reason: caseReason.trim(),
      };
      if (!authUser) {
        payload.orderNumber = caseMode.orderNumber;
        payload.phone = lookupPhone.trim();
      }
      if (caseMode.type === 'return') {
        const res = await apiFetch<{ returnRequest: ReturnRequest }>('/api/returns', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setReturnsList((prev) => [res.returnRequest, ...prev]);
        showToast(locale === 'ar' ? 'تم إرسال طلب الإرجاع' : 'Return request submitted', 'success');
      } else {
        const res = await apiFetch<{ dispute: OrderDispute }>('/api/disputes', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setDisputesList((prev) => [res.dispute, ...prev]);
        showToast(locale === 'ar' ? 'تم فتح النزاع بنجاح' : 'Dispute opened and logged', 'success');
      }
      setCaseMode(null);
      setCaseReason('');
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSubmittingCase(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 space-y-6">
      <SectionHeading
        title={t.myOrders}
        subtitle={
          locale === 'ar'
            ? 'تتبع حالة كل طلب فرعي لكل بائع، وقدّم طلبات الإرجاع أو النزاعات مباشرة.'
            : 'Track live fulfillment status across each seller sub-order and manage returns or disputes.'
        }
      />

      <form onSubmit={handleLookup} className="flex flex-wrap max-w-2xl border border-[var(--line)] bg-[var(--graphite)]">
        <input
          type="text"
          value={lookupNumber}
          onChange={(e) => setLookupNumber(e.target.value)}
          placeholder={locale === 'ar' ? 'رقم الطلب (مثال: NL-2026-...)' : 'Order number (e.g. NL-2026-...)'}
          aria-label="Order number lookup"
          className="flex-1 min-w-[180px] bg-transparent px-3 py-2.5 text-sm font-mono-tabular text-[var(--bone)]"
        />
        {!authUser && (
          <input
            type="tel"
            required
            value={lookupPhone}
            onChange={(e) => setLookupPhone(e.target.value)}
            placeholder={locale === 'ar' ? 'رقم الهاتف المسجل' : 'Checkout phone number'}
            aria-label="Checkout phone verification"
            className="flex-1 min-w-[180px] bg-transparent border-s border-[var(--line)] px-3 py-2.5 text-sm font-mono-tabular text-[var(--bone)]"
          />
        )}
        <button
          type="submit"
          className="px-4 py-2.5 border-s border-[var(--line)] text-xs font-semibold text-[var(--bone)] inline-flex items-center gap-1.5 hover:bg-[var(--ember)] hover:text-[var(--ember-fg)] cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>{locale === 'ar' ? 'تتبع' : 'Track'}</span>
        </button>
      </form>

      {loading ? (
        <div className="hairline-cell h-48 animate-pulse border border-[var(--line)]" />
      ) : orders.length === 0 ? (
        <EmptyState
          title={locale === 'ar' ? 'لا توجد طلبات معروضة' : 'No orders to display'}
          description={
            authUser
              ? locale === 'ar'
                ? 'لم تقم بأي طلبات بعد.'
                : 'You have not placed any orders yet.'
              : locale === 'ar'
                ? 'أدخل رقم الطلب ورقم الهاتف المستخدم عند الشراء لعرض تفاصيل الشحن.'
                : 'Enter both your order number and checkout phone number to verify and view live shipment status.'
          }
          actionLabel={t.navCatalog}
          onAction={() => navigate('/catalog')}
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-[var(--line)] bg-[var(--graphite)]">
              <div className="p-5 border-b border-[var(--line)] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-mono-tabular text-lg font-bold text-[var(--bone)]">{order.orderNumber}</h2>
                    <StatusLabel
                      status={order.paymentStatus.replace('_', ' ')}
                      tone={order.paymentStatus === 'paid' ? 'cedar' : 'gold'}
                    />
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {order.customerName} · {order.governorate} / {order.district} / {order.town} ·{' '}
                    {order.paymentMethod.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <PriceDisplay usdCents={order.grandTotalUsdCents} size="md" />
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`NileLink Order ${order.orderNumber}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-[var(--line)] text-[var(--cedar)] hover:border-[var(--cedar)]"
                    aria-label="Share order via WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="divide-y divide-[var(--line)]">
                {order.subOrders.map((sub) => {
                  const subReturns = returnsList.filter((r) => r.subOrderId === sub.id);
                  const subDisputes = disputesList.filter((d) => d.subOrderId === sub.id);
                  const hasOpenReturn = subReturns.some((r) =>
                    ['requested', 'approved', 'refunded'].includes(r.status)
                  );
                  const isEditingThis = caseMode?.subOrderId === sub.id;

                  return (
                    <div key={sub.id} className="p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 text-sm">
                          <Truck className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
                          <span className="font-semibold text-[var(--bone)]">{sub.sellerName[locale]}</span>
                          <span className="font-mono-tabular text-xs text-[var(--muted)]">({sub.id})</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusLabel
                            status={sub.status}
                            tone={sub.status === 'delivered' ? 'cedar' : sub.status === 'cancelled' ? 'ember' : 'gold'}
                          />
                          {!hasOpenReturn && sub.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => {
                                setCaseMode({ subOrderId: sub.id, type: 'return', orderNumber: order.orderNumber });
                                setCaseReason('');
                              }}
                              className="px-2.5 py-1 border border-[var(--line)] text-[11px] font-mono-tabular text-[var(--bone)] hover:border-[var(--gold)] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{locale === 'ar' ? 'طلب إرجاع' : 'Request Return'}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setCaseMode({ subOrderId: sub.id, type: 'dispute', orderNumber: order.orderNumber });
                              setCaseReason('');
                            }}
                            className="px-2.5 py-1 border border-[var(--line)] text-[11px] font-mono-tabular text-[var(--muted)] hover:border-[var(--ember)] hover:text-[var(--ember)] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>{locale === 'ar' ? 'فتح نزاع' : 'Open Dispute'}</span>
                          </button>
                        </div>
                      </div>

                      {sub.trackingCode && (
                        <p className="text-xs font-mono-tabular text-[var(--muted)]">
                          Courier: {sub.courierName} · Tracking: {sub.trackingCode}
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {sub.items.map((item) => (
                          <div
                            key={item.id}
                            className="border border-[var(--line)] bg-[var(--ink)] p-3 flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-semibold text-[var(--bone)]">{item.titleSnapshot[locale]}</p>
                              <p className="text-[var(--muted)]">
                                {item.variantLabel} · Qty {item.quantity}
                              </p>
                            </div>
                            <PriceDisplay usdCents={item.lineTotalUsdCents} size="sm" />
                          </div>
                        ))}
                      </div>

                      {(subReturns.length > 0 || subDisputes.length > 0) && (
                        <div className="space-y-2 pt-2">
                          {subReturns.map((ret) => (
                            <div
                              key={ret.id}
                              className="border border-[var(--gold)] bg-[var(--ink)] px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2"
                            >
                              <span className="text-[var(--bone)]">
                                <strong className="font-mono-tabular uppercase text-[var(--gold)]">Return</strong> · {ret.reason}
                              </span>
                              <div className="flex items-center gap-3">
                                <PriceDisplay usdCents={ret.refundUsdCents} size="sm" />
                                <StatusLabel status={ret.status} tone={ret.status === 'refunded' ? 'cedar' : 'gold'} />
                              </div>
                            </div>
                          ))}
                          {subDisputes.map((dsp) => (
                            <div
                              key={dsp.id}
                              className="border border-[var(--ember)] bg-[var(--ink)] px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <p className="text-[var(--bone)]">
                                  <strong className="font-mono-tabular uppercase text-[var(--ember)]">Dispute</strong> · {dsp.reason}
                                </p>
                                {dsp.resolutionNote && (
                                  <p className="text-[11px] text-[var(--muted)] mt-0.5">{dsp.resolutionNote}</p>
                                )}
                              </div>
                              <StatusLabel status={dsp.status} tone={dsp.status.startsWith('resolved') ? 'cedar' : 'ember'} />
                            </div>
                          ))}
                        </div>
                      )}

                      {isEditingThis && (
                        <form
                          onSubmit={handleSubmitCase}
                          className="border border-[var(--ember)] bg-[var(--ink)] p-4 space-y-3 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-mono-tabular uppercase font-semibold text-[var(--ember)]">
                              {caseMode.type === 'return'
                                ? locale === 'ar'
                                  ? 'نموذج طلب الإرجاع'
                                  : 'Submit Return Request'
                                : locale === 'ar'
                                  ? 'نموذج فتح نزاع'
                                  : 'Open Buyer Dispute'}
                            </p>
                            <button
                              type="button"
                              onClick={() => setCaseMode(null)}
                              className="text-[var(--muted)] hover:text-[var(--bone)] cursor-pointer"
                            >
                              {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            required
                            value={caseReason}
                            onChange={(e) => setCaseReason(e.target.value)}
                            placeholder={
                              caseMode.type === 'return'
                                ? locale === 'ar'
                                  ? 'اشرح سبب الإرجاع وحالة المنتج...'
                                  : 'Describe item condition and reason for return...'
                                : locale === 'ar'
                                  ? 'اشرح المشكلة مع الشحنة أو البائع...'
                                  : 'Describe delivery issue or seller dispute details...'
                            }
                            className="w-full bg-[var(--graphite)] border border-[var(--line)] p-2.5 text-[var(--bone)]"
                          />
                          <button
                            type="submit"
                            disabled={submittingCase}
                            className="px-4 py-2 bg-[var(--ember)] text-[var(--ember-fg)] font-bold uppercase cursor-pointer disabled:opacity-50"
                          >
                            {submittingCase
                              ? '...'
                              : caseMode.type === 'return'
                                ? locale === 'ar'
                                  ? 'إرسال طلب الإرجاع'
                                  : 'Confirm Return Request'
                                : locale === 'ar'
                                  ? 'تأكيد فتح النزاع'
                                  : 'Submit Dispute'}
                          </button>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

