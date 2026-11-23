import React, { useState } from 'react';
import { ExternalLink, FileCheck2, MessageSquareWarning, PackageCheck, ShieldAlert, Truck, Users } from 'lucide-react';
import type {
  AdminUserSummary,
  DeliveryZone,
  OrderDispute,
  Product,
  ReturnRequest,
  Review,
  Seller,
  SellerDocumentReview,
  SupportTicket,
} from '../../shared/types.ts';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { toSafeHref } from '../../utils/url.ts';
import { EmptyState, PriceDisplay, StatusLabel } from '../HairlineUI.tsx';

export type { AdminUserSummary };

export function AdminCatalogModerationPanel({
  products,
  reviews,
  sellers = [],
  onReload,
}: {
  products: Product[];
  reviews: Review[];
  sellers?: Seller[];
  onReload: () => Promise<void>;
}) {
  const { apiFetch, showToast, refreshBootstrap } = useMarketplace();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [query, setQuery] = useState('');

  const getSellerName = (sellerId: string) =>
    sellers.find((s) => s.id === sellerId)?.name.en || sellerId;

  const filteredProducts = products.filter((p) => {
    const modStatus = p.moderationStatus || 'approved';
    const matchesStatus = filterStatus === 'all' || modStatus === filterStatus;
    const q = query.trim().toLowerCase();
    const sName = getSellerName(p.sellerId).toLowerCase();
    const matchesQ =
      !q ||
      p.title.en.toLowerCase().includes(q) ||
      sName.includes(q) ||
      p.department.toLowerCase().includes(q);
    return matchesStatus && matchesQ;
  });

  return (
    <div className="space-y-6">
      <div className="border border-[var(--line)] bg-[var(--graphite)] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-[var(--ember)]">
            <PackageCheck className="w-4 h-4" />
            <span>Catalog SKU Moderation &amp; Merchandising ({filteredProducts.length}/{products.length})</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, seller, dept..."
              className="bg-[var(--ink)] border border-[var(--line)] px-3 py-1.5 text-[var(--bone)]"
            />
            {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 border font-mono-tabular uppercase cursor-pointer ${
                  filterStatus === st
                    ? 'border-[var(--ember)] bg-[var(--ember)] text-[var(--ember-fg)]'
                    : 'border-[var(--line)] text-[var(--muted)]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState title="No matching products" description="Try another moderation status or search query." />
        ) : (
          <div className="divide-y divide-[var(--line)] border border-[var(--line)]">
            {filteredProducts.map((p) => {
              const modStatus = p.moderationStatus || 'approved';
              return (
                <div key={p.id} className="p-4 bg-[var(--ink)] flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[var(--bone)]">{p.title.en}</span>
                      <StatusLabel
                        status={modStatus}
                        tone={modStatus === 'approved' ? 'cedar' : modStatus === 'rejected' ? 'ember' : 'gold'}
                      />
                      {!p.published && <StatusLabel status="Unpublished" tone="gold" />}
                      {p.isFeatured && <StatusLabel status="Featured" tone="gold" />}
                    </div>
                    <p className="font-mono-tabular text-[var(--muted)]">
                      Seller: {getSellerName(p.sellerId)} · Dept: {p.department} · Slug: {p.slug}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <PriceDisplay usdCents={p.basePriceUsdCents} size="sm" />
                    <select
                      value={modStatus}
                      onChange={async (e) => {
                        await apiFetch(`/api/admin/products/${p.id}`, {
                          method: 'PATCH',
                          body: JSON.stringify({ moderationStatus: e.target.value }),
                        });
                        showToast(`Product status → ${e.target.value}`, 'success');
                        await onReload();
                        await refreshBootstrap();
                      }}
                      aria-label="Product moderation status"
                      className="bg-[var(--graphite)] border border-[var(--line)] px-2.5 py-1.5 text-[var(--bone)]"
                    >
                      <option value="pending">pending</option>
                      <option value="approved">approved</option>
                      <option value="rejected">rejected</option>
                    </select>
                    <button
                      type="button"
                      onClick={async () => {
                        await apiFetch(`/api/admin/products/${p.id}`, {
                          method: 'PATCH',
                          body: JSON.stringify({ published: !p.published }),
                        });
                        showToast(p.published ? 'Product unpublished' : 'Product published live', 'success');
                        await onReload();
                        await refreshBootstrap();
                      }}
                      className={`px-2.5 py-1.5 border cursor-pointer ${
                        p.published ? 'border-[var(--cedar)] text-[var(--cedar)]' : 'border-[var(--line)] text-[var(--muted)]'
                      }`}
                    >
                      {p.published ? 'Published' : 'Unpublished'}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await apiFetch(`/api/admin/products/${p.id}`, {
                          method: 'PATCH',
                          body: JSON.stringify({ featured: !p.isFeatured }),
                        });
                        showToast(p.isFeatured ? 'Removed Featured flag' : 'Marked as Featured', 'success');
                        await onReload();
                        await refreshBootstrap();
                      }}
                      className={`px-2.5 py-1.5 border cursor-pointer ${
                        p.isFeatured ? 'border-[var(--gold)] text-[var(--gold)]' : 'border-[var(--line)] text-[var(--muted)]'
                      }`}
                    >
                      {p.isFeatured ? 'Featured ★' : 'Feature'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reviews Moderation */}
      <div className="border border-[var(--line)] bg-[var(--graphite)] p-5 space-y-3">
        <h3 className="font-display text-lg font-bold text-[var(--bone)]">
          Buyer Reviews Moderation ({reviews.length})
        </h3>
        {reviews.length === 0 ? (
          <EmptyState title="No buyer reviews yet" description="Submitted product reviews will appear here for quality moderation." />
        ) : (
          <div className="divide-y divide-[var(--line)] border border-[var(--line)]">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 bg-[var(--ink)] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono-tabular">
                    <span className="text-[var(--gold)]">{r.rating} ★</span>
                    <span className="text-[var(--bone)] font-semibold">{r.authorName}</span>
                    {r.productTitle && <span className="text-[var(--muted)]">on {r.productTitle.en}</span>}
                    <StatusLabel
                      status={r.moderationStatus || 'approved'}
                      tone={r.moderationStatus === 'approved' ? 'cedar' : 'ember'}
                    />
                  </div>
                  <p className="text-[var(--muted)]">{r.comment}</p>
                </div>
                <select
                  value={r.moderationStatus || 'approved'}
                  onChange={async (e) => {
                    await apiFetch(`/api/admin/reviews/${r.id}`, {
                      method: 'PATCH',
                      body: JSON.stringify({ status: e.target.value }),
                    });
                    showToast(`Review set to ${e.target.value}`, 'success');
                    await onReload();
                  }}
                  aria-label="Review moderation status"
                  className="bg-[var(--graphite)] border border-[var(--line)] px-2.5 py-1.5 text-[var(--bone)]"
                >
                  <option value="approved">approved</option>
                  <option value="hidden">hidden</option>
                  <option value="rejected">rejected</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminKycDocumentsPanel({
  sellerDocuments,
  sellers,
  onReload,
}: {
  sellerDocuments: SellerDocumentReview[];
  sellers: Seller[];
  onReload: () => Promise<void>;
}) {
  const { apiFetch, showToast } = useMarketplace();
  const [notes, setNotes] = useState<Record<string, string>>({});

  return (
    <div className="border border-[var(--line)] bg-[var(--graphite)] p-5 space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-[var(--cyan)]">
        <FileCheck2 className="w-4 h-4" />
        <span>Seller KYC &amp; Commercial Registry Verification ({sellerDocuments.length})</span>
      </div>

      {sellerDocuments.length === 0 ? (
        <EmptyState
          title="No KYC documents uploaded yet"
          description="Sellers can upload Commercial Registration or ID proof in Seller Hub → KYC Verification."
        />
      ) : (
        <div className="divide-y divide-[var(--line)] border border-[var(--line)]">
          {sellerDocuments.map((doc) => {
            const seller = sellers.find((s) => s.id === doc.sellerId);
            const safeUrl = toSafeHref(doc.publicUrl, '');
            return (
              <div key={doc.id} className="p-4 bg-[var(--ink)] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono-tabular">
                    <span className="font-bold text-[var(--bone)]">{seller?.name.en || doc.sellerId}</span>
                    <span className="text-[var(--muted)]">{doc.docType}</span>
                    <StatusLabel
                      status={doc.reviewStatus}
                      tone={doc.reviewStatus === 'approved' ? 'cedar' : doc.reviewStatus === 'rejected' ? 'ember' : 'gold'}
                    />
                  </div>
                  {safeUrl && (
                    <a
                      href={safeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--cyan)] underline font-mono-tabular"
                    >
                      <span>View Submitted Document</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={notes[doc.id] ?? doc.reviewerNote ?? ''}
                    onChange={(e) => setNotes((n) => ({ ...n, [doc.id]: e.target.value }))}
                    placeholder="Reviewer note"
                    className="bg-[var(--graphite)] border border-[var(--line)] px-2.5 py-1.5 text-[var(--bone)]"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      await apiFetch(`/api/admin/seller-documents/${doc.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({ reviewStatus: 'approved', reviewerNote: notes[doc.id] ?? doc.reviewerNote ?? '' }),
                      });
                      showToast('KYC document approved', 'success');
                      await onReload();
                    }}
                    className="px-3 py-1.5 bg-[var(--cedar)] text-[#17181B] font-bold uppercase cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await apiFetch(`/api/admin/seller-documents/${doc.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({ reviewStatus: 'rejected', reviewerNote: notes[doc.id] ?? doc.reviewerNote ?? '' }),
                      });
                      showToast('KYC document rejected', 'info');
                      await onReload();
                    }}
                    className="px-3 py-1.5 border border-[var(--ember)] text-[var(--ember)] font-bold uppercase cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdminCasesPanel({
  returns,
  disputes,
  supportTickets,
  sellers,
  onReload,
}: {
  returns: ReturnRequest[];
  disputes: OrderDispute[];
  supportTickets: SupportTicket[];
  sellers: Seller[];
  onReload: () => Promise<void>;
}) {
  const { apiFetch, showToast } = useMarketplace();
  const [refundInputs, setRefundInputs] = useState<Record<string, string>>({});
  const [disputeNotes, setDisputeNotes] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      {/* Returns */}
      <div className="border border-[var(--line)] bg-[var(--graphite)] p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-[var(--ember)]">
          <MessageSquareWarning className="w-4 h-4" />
          <span>Return Requests ({returns.length})</span>
        </div>
        {returns.length === 0 ? (
          <EmptyState title="No return requests" description="Buyer return requests submitted on Orders will appear here." />
        ) : (
          <div className="divide-y divide-[var(--line)] border border-[var(--line)]">
            {returns.map((r) => {
              const seller = sellers.find((s) => s.id === r.sellerId);
              return (
                <div key={r.id} className="p-4 bg-[var(--ink)] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono-tabular">
                      <span className="font-bold text-[var(--bone)]">{r.orderNumber || r.subOrderId}</span>
                      {seller && <span className="text-[var(--muted)]">Seller: {seller.name.en}</span>}
                      <StatusLabel
                        status={r.status}
                        tone={r.status === 'refunded' || r.status === 'approved' ? 'cedar' : r.status === 'rejected' ? 'ember' : 'gold'}
                      />
                    </div>
                    <p className="text-[var(--muted)]">{r.reason}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.50"
                      placeholder={`Refund USD (${(r.refundUsdCents / 100).toFixed(2)})`}
                      value={refundInputs[r.id] ?? (r.refundUsdCents > 0 ? (r.refundUsdCents / 100).toFixed(2) : '')}
                      onChange={(e) => setRefundInputs((m) => ({ ...m, [r.id]: e.target.value }))}
                      className="w-32 bg-[var(--graphite)] border border-[var(--line)] px-2.5 py-1.5 font-mono-tabular text-[var(--bone)]"
                    />
                    {(['approved', 'rejected', 'refunded'] as const).map((nextStatus) => (
                      <button
                        key={nextStatus}
                        type="button"
                        onClick={async () => {
                          const rawUsd = refundInputs[r.id];
                          const refundUsdCents =
                            rawUsd && !Number.isNaN(parseFloat(rawUsd)) ? Math.round(parseFloat(rawUsd) * 100) : undefined;
                          await apiFetch(`/api/admin/returns/${r.id}`, {
                            method: 'PATCH',
                            body: JSON.stringify({ status: nextStatus, refundUsdCents }),
                          });
                          showToast(`Return marked ${nextStatus}`, 'success');
                          await onReload();
                        }}
                        className="px-2.5 py-1.5 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)] uppercase cursor-pointer"
                      >
                        {nextStatus}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Disputes */}
      <div className="border border-[var(--line)] bg-[var(--graphite)] p-5 space-y-3">
        <h3 className="font-display text-lg font-bold text-[var(--bone)]">Order Disputes ({disputes.length})</h3>
        {disputes.length === 0 ? (
          <EmptyState title="No active disputes" description="Disputes escalated on buyer sub-orders will appear here." />
        ) : (
          <div className="divide-y divide-[var(--line)] border border-[var(--line)]">
            {disputes.map((d) => (
              <div key={d.id} className="p-4 bg-[var(--ink)] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono-tabular">
                    <span className="font-bold text-[var(--bone)]">{d.orderNumber || d.subOrderId}</span>
                    <StatusLabel status={d.status} tone={d.status.startsWith('resolved') ? 'cedar' : 'gold'} />
                  </div>
                  <p className="text-[var(--muted)]">{d.reason}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={disputeNotes[d.id] ?? d.resolutionNote ?? ''}
                    onChange={(e) => setDisputeNotes((m) => ({ ...m, [d.id]: e.target.value }))}
                    placeholder="Resolution note"
                    className="bg-[var(--graphite)] border border-[var(--line)] px-2.5 py-1.5 text-[var(--bone)]"
                  />
                  <select
                    value={d.status}
                    onChange={async (e) => {
                      await apiFetch(`/api/admin/disputes/${d.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({
                          status: e.target.value,
                          resolutionNote: disputeNotes[d.id] ?? d.resolutionNote ?? '',
                        }),
                      });
                      showToast(`Dispute → ${e.target.value}`, 'success');
                      await onReload();
                    }}
                    aria-label="Dispute resolution status"
                    className="bg-[var(--graphite)] border border-[var(--line)] px-2.5 py-1.5 text-[var(--bone)]"
                  >
                    <option value="open">open</option>
                    <option value="investigating">investigating</option>
                    <option value="resolved_buyer">resolved_buyer</option>
                    <option value="resolved_seller">resolved_seller</option>
                    <option value="closed">closed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Support Tickets */}
      <div className="border border-[var(--line)] bg-[var(--graphite)] p-5 space-y-3">
        <h3 className="font-display text-lg font-bold text-[var(--bone)]">
          Support Tickets ({supportTickets.length})
        </h3>
        {supportTickets.length === 0 ? (
          <EmptyState title="No support tickets" description="Messages submitted on /support appear here for resolution." />
        ) : (
          <div className="divide-y divide-[var(--line)] border border-[var(--line)]">
            {supportTickets.map((t) => (
              <div key={t.id} className="p-4 bg-[var(--ink)] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono-tabular">
                    <span className="font-bold text-[var(--bone)]">{t.subject}</span>
                    <span className="text-[var(--muted)]">{t.email}</span>
                    <StatusLabel status={t.status} tone={t.status === 'resolved' ? 'cedar' : 'gold'} />
                  </div>
                  <p className="text-[var(--muted)]">{t.message}</p>
                </div>
                <select
                  value={t.status}
                  onChange={async (e) => {
                    await apiFetch(`/api/admin/support-tickets/${t.id}`, {
                      method: 'PATCH',
                      body: JSON.stringify({ status: e.target.value }),
                    });
                    showToast(`Ticket status → ${e.target.value}`, 'success');
                    await onReload();
                  }}
                  aria-label="Support ticket status"
                  className="bg-[var(--graphite)] border border-[var(--line)] px-2.5 py-1.5 text-[var(--bone)]"
                >
                  <option value="open">open</option>
                  <option value="in_progress">in_progress</option>
                  <option value="resolved">resolved</option>
                  <option value="closed">closed</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminDeliveryZonesEditor({
  zones,
  onReload,
}: {
  zones: DeliveryZone[];
  onReload: () => Promise<void>;
}) {
  const { apiFetch, showToast, refreshBootstrap } = useMarketplace();
  const [feeDrafts, setFeeDrafts] = useState<Record<string, string>>({});
  const [etaDrafts, setEtaDrafts] = useState<Record<string, string>>({});

  return (
    <div className="hairline-cell lg:col-span-6 p-6 space-y-4">
      <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-[var(--cedar)]">
        <Truck className="w-4 h-4" />
        <span>Platform Courier Zones (Lebanon)</span>
      </div>
      <div className="space-y-2 text-xs font-mono-tabular">
        {zones.map((z) => {
          const feeVal = feeDrafts[z.governorateCode] ?? (z.platformFeeUsdCents / 100).toFixed(2);
          const etaVal = etaDrafts[z.governorateCode] ?? z.etaDays;
          return (
            <div
              key={z.governorateCode}
              className="border border-[var(--line)] bg-[var(--ink)] p-3 flex flex-wrap items-center justify-between gap-2"
            >
              <span className="text-[var(--bone)] font-semibold min-w-28">{z.name.en}</span>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  value={feeVal}
                  onChange={(e) => setFeeDrafts((m) => ({ ...m, [z.governorateCode]: e.target.value }))}
                  aria-label={`${z.name.en} courier fee USD`}
                  className="w-20 bg-[var(--graphite)] border border-[var(--line)] px-2 py-1 text-[var(--bone)]"
                />
                <input
                  value={etaVal}
                  onChange={(e) => setEtaDrafts((m) => ({ ...m, [z.governorateCode]: e.target.value }))}
                  aria-label={`${z.name.en} ETA`}
                  className="w-24 bg-[var(--graphite)] border border-[var(--line)] px-2 py-1 text-[var(--bone)]"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const cents = Math.max(0, Math.round(parseFloat(feeVal || '0') * 100));
                    await apiFetch(`/api/admin/delivery-zones/${z.governorateCode}`, {
                      method: 'PATCH',
                      body: JSON.stringify({ platformFeeUsdCents: cents, etaDays: etaVal.trim() || z.etaDays }),
                    });
                    showToast(`Updated ${z.name.en} courier fee & ETA`, 'success');
                    await onReload();
                    await refreshBootstrap();
                  }}
                  className="px-2.5 py-1 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)] cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdminUserAccessPanel({
  users,
  currentUserId,
  isSuperAdmin = false,
  onReload,
}: {
  users: AdminUserSummary[];
  currentUserId: string;
  isSuperAdmin?: boolean;
  onReload: () => Promise<void>;
}) {
  const { apiFetch, showToast } = useMarketplace();
  const [search, setSearch] = useState('');
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      u.roleKey.toLowerCase().includes(q)
    );
  });

  const patchUserAccess = async (
    u: AdminUserSummary,
    payload: {
      isBlocked?: boolean;
      verifyEmail?: boolean;
      verifyPhone?: boolean;
      roleKey?: string;
    },
    successMsg: string
  ) => {
    setBusyUserId(u.id);
    try {
      await apiFetch(`/api/admin/users/${u.id}/access`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      showToast(successMsg, 'success');
      await onReload();
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <div className="border border-[var(--line)] bg-[var(--graphite)] p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-[var(--cyan)]">
          <Users className="w-4 h-4" />
          <span>Registered User Accounts, Verification &amp; Access Control ({filtered.length})</span>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name, email, phone, role..."
          className="bg-[var(--ink)] border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--bone)]"
        />
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-[var(--line)] border border-[var(--line)]">
        {filtered.map((u) => {
          const emailVerified = Boolean(u.emailVerifiedAt);
          const phoneVerified = Boolean(u.phoneVerifiedAt);
          const fullyVerified = Boolean(u.isFullyVerified ?? (emailVerified && phoneVerified));
          const isBusy = busyUserId === u.id;

          return (
            <div key={u.id} className="p-3 bg-[var(--ink)] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[var(--bone)]">{u.name}</span>
                  <span className="font-mono-tabular text-[var(--muted)]">{u.email}</span>
                  <StatusLabel status={u.roleKey} tone={u.roleKey.startsWith('admin') ? 'gold' : 'cedar'} />
                  {fullyVerified && <StatusLabel status="Fully Verified" tone="cedar" />}
                  {u.isBlocked && <StatusLabel status="Blocked" tone="ember" />}
                </div>
                <p className="text-[11px] font-mono-tabular text-[var(--muted)] flex flex-wrap items-center gap-2">
                  <span>{u.phone}</span>
                  <span>·</span>
                  <span className={emailVerified ? 'text-[var(--cedar)]' : 'text-[var(--gold)]'}>
                    Email: {emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span>·</span>
                  <span className={phoneVerified ? 'text-[var(--cedar)]' : 'text-[var(--gold)]'}>
                    Phone: {phoneVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span>·</span>
                  <span>2FA: {u.totpEnabled ? 'On' : 'Off'}</span>
                </p>
              </div>

              {u.id !== currentUserId && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() =>
                      void patchUserAccess(
                        u,
                        { verifyEmail: !emailVerified },
                        `${!emailVerified ? 'Verified' : 'Unverified'} email for ${u.email}`
                      )
                    }
                    className={`px-2.5 py-1.5 border font-mono-tabular uppercase cursor-pointer disabled:opacity-50 ${
                      emailVerified
                        ? 'border-[var(--cedar)] text-[var(--cedar)]'
                        : 'border-[var(--line)] text-[var(--bone)] hover:border-[var(--cedar)]'
                    }`}
                  >
                    {emailVerified ? 'Email ✓' : 'Verify Email'}
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() =>
                      void patchUserAccess(
                        u,
                        { verifyPhone: !phoneVerified },
                        `${!phoneVerified ? 'Verified' : 'Unverified'} phone for ${u.email}`
                      )
                    }
                    className={`px-2.5 py-1.5 border font-mono-tabular uppercase cursor-pointer disabled:opacity-50 ${
                      phoneVerified
                        ? 'border-[var(--cedar)] text-[var(--cedar)]'
                        : 'border-[var(--line)] text-[var(--bone)] hover:border-[var(--cedar)]'
                    }`}
                  >
                    {phoneVerified ? 'Phone ✓' : 'Verify Phone'}
                  </button>

                  {isSuperAdmin && u.roleKey !== 'admin_super' && (
                    <select
                      aria-label={`Role for ${u.email}`}
                      disabled={isBusy}
                      value={u.roleKey}
                      onChange={(e) =>
                        void patchUserAccess(
                          u,
                          { roleKey: e.target.value },
                          `Updated role for ${u.email} to ${e.target.value}`
                        )
                      }
                      className="bg-[var(--graphite)] border border-[var(--line)] px-2 py-1.5 font-mono-tabular text-[var(--bone)]"
                    >
                      <option value="customer">customer</option>
                      <option value="seller_owner">seller_owner</option>
                      <option value="seller_staff">seller_staff</option>
                      <option value="admin_staff">admin_staff</option>
                    </select>
                  )}

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() =>
                      void patchUserAccess(
                        u,
                        { isBlocked: !u.isBlocked },
                        u.isBlocked ? `Unblocked ${u.email}` : `Blocked ${u.email}`
                      )
                    }
                    className={`inline-flex items-center gap-1 px-3 py-1.5 border font-mono-tabular uppercase cursor-pointer disabled:opacity-50 ${
                      u.isBlocked
                        ? 'border-[var(--cedar)] text-[var(--cedar)]'
                        : 'border-[var(--ember)] text-[var(--ember)]'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{u.isBlocked ? 'Unblock' : 'Block Account'}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
