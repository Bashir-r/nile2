import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Store,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import type { AdminUserActivityPayload, AdminUserSummary } from '../../shared/types.ts';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { EmptyState, PriceDisplay, StatusLabel } from '../HairlineUI.tsx';

interface AdminUserManagementProps {
  users: AdminUserSummary[];
  currentUserId: string;
  isSuperAdmin?: boolean;
  onReload: () => Promise<void>;
}

type RoleFilter = 'all' | 'customer' | 'seller_owner' | 'seller_staff' | 'admin_staff' | 'admin_super';
type StatusFilter = 'all' | 'active' | 'deactivated';
type VerificationFilter = 'all' | 'verified' | 'pending' | 'email_unverified' | 'phone_unverified';
type ActivityTab = 'all' | 'audit' | 'orders' | 'feedback';

function summarizeJsonDiff(raw?: string | null): string {
  if (!raw) return '';
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const entries = Object.entries(parsed).slice(0, 4);
    return entries
      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
      .join(' · ');
  } catch {
    return String(raw).slice(0, 120);
  }
}

export function AdminUserManagement({
  users,
  currentUserId,
  isSuperAdmin = false,
  onReload,
}: AdminUserManagementProps) {
  const { apiFetch, showToast } = useMarketplace();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [verificationFilter, setVerificationFilter] = useState<VerificationFilter>('all');

  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [deactivateTargetId, setDeactivateTargetId] = useState<string | null>(null);
  const [deactivateReason, setDeactivateReason] = useState('');

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<AdminUserActivityPayload | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activityTab, setActivityTab] = useState<ActivityTab>('all');

  const counts = useMemo(() => {
    const total = users.length;
    const verified = users.filter((u) => Boolean(u.emailVerifiedAt && u.phoneVerifiedAt)).length;
    const pending = total - verified;
    const deactivated = users.filter((u) => u.isBlocked).length;
    return { total, verified, pending, deactivated };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (q) {
        const matchesQuery =
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q) ||
          (u.sellerName || '').toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      if (roleFilter !== 'all' && u.roleKey !== roleFilter) return false;
      if (statusFilter === 'active' && u.isBlocked) return false;
      if (statusFilter === 'deactivated' && !u.isBlocked) return false;

      const emailVerified = Boolean(u.emailVerifiedAt);
      const phoneVerified = Boolean(u.phoneVerifiedAt);
      const fullyVerified = emailVerified && phoneVerified;

      if (verificationFilter === 'verified' && !fullyVerified) return false;
      if (verificationFilter === 'pending' && fullyVerified) return false;
      if (verificationFilter === 'email_unverified' && emailVerified) return false;
      if (verificationFilter === 'phone_unverified' && phoneVerified) return false;

      return true;
    });
  }, [users, search, roleFilter, statusFilter, verificationFilter]);

  const loadUserActivity = useCallback(
    async (userId: string) => {
      setSelectedUserId(userId);
      setLoadingActivity(true);
      try {
        const res = await apiFetch<AdminUserActivityPayload>(
          `/api/admin/users/${encodeURIComponent(userId)}/activity`
        );
        setActivityData(res);
      } catch (err) {
        showToast((err as Error).message, 'error');
      } finally {
        setLoadingActivity(false);
      }
    },
    [apiFetch, showToast]
  );

  useEffect(() => {
    if (!selectedUserId && users.length > 0) {
      void loadUserActivity(users[0].id);
    }
  }, [users, selectedUserId, loadUserActivity]);

  const patchUserAccess = async (
    u: AdminUserSummary,
    payload: {
      isBlocked?: boolean;
      verifyEmail?: boolean;
      verifyPhone?: boolean;
      roleKey?: string;
      reason?: string;
    },
    successMsg: string
  ) => {
    setBusyUserId(u.id);
    try {
      await apiFetch(`/api/admin/users/${encodeURIComponent(u.id)}/access`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      showToast(successMsg, 'success');
      setDeactivateTargetId(null);
      setDeactivateReason('');
      await onReload();
      if (selectedUserId === u.id) {
        await loadUserActivity(u.id);
      }
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Summary Strip */}
      <div className="hairline-grid grid-cols-2 lg:grid-cols-4">
        <div className="hairline-cell p-5">
          <p className="text-xs font-mono-tabular uppercase text-[var(--muted)]">Total Registered Users</p>
          <p className="mt-2 font-mono-tabular text-2xl font-bold text-[var(--bone)]">{counts.total}</p>
        </div>
        <div className="hairline-cell p-5">
          <p className="text-xs font-mono-tabular uppercase text-[var(--muted)]">Fully Verified</p>
          <p className="mt-2 font-mono-tabular text-2xl font-bold text-[var(--cedar)]">{counts.verified}</p>
        </div>
        <div className="hairline-cell p-5">
          <p className="text-xs font-mono-tabular uppercase text-[var(--muted)]">Pending Verification</p>
          <p className="mt-2 font-mono-tabular text-2xl font-bold text-[var(--gold)]">{counts.pending}</p>
        </div>
        <div className="hairline-cell p-5">
          <p className="text-xs font-mono-tabular uppercase text-[var(--muted)]">Deactivated Accounts</p>
          <p className="mt-2 font-mono-tabular text-2xl font-bold text-[var(--ember)]">{counts.deactivated}</p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="border border-[var(--line)] bg-[var(--graphite)] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, +961 phone, store, or user ID..."
              aria-label="Search users"
              className="w-full bg-[var(--ink)] border border-[var(--line)] ps-8 pe-3 py-2 text-xs text-[var(--bone)]"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            aria-label="Filter by role"
            className="bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-xs font-mono-tabular text-[var(--bone)]"
          >
            <option value="all">Role: All</option>
            <option value="customer">Customer</option>
            <option value="seller_owner">Seller Owner</option>
            <option value="seller_staff">Seller Staff</option>
            <option value="admin_staff">Admin Staff</option>
            <option value="admin_super">Super Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            aria-label="Filter by account status"
            className="bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-xs font-mono-tabular text-[var(--bone)]"
          >
            <option value="all">Status: All</option>
            <option value="active">Active Only</option>
            <option value="deactivated">Deactivated Only</option>
          </select>

          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value as VerificationFilter)}
            aria-label="Filter by verification state"
            className="bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-xs font-mono-tabular text-[var(--bone)]"
          >
            <option value="all">Verification: All</option>
            <option value="verified">Fully Verified</option>
            <option value="pending">Pending Any Verification</option>
            <option value="email_unverified">Email Unverified</option>
            <option value="phone_unverified">Phone Unverified</option>
          </select>
        </div>

        <span className="text-xs font-mono-tabular text-[var(--muted)] whitespace-nowrap">
          Showing {filteredUsers.length} of {users.length}
        </span>
      </div>

      {/* Main Split Console: Accounts Directory + Detailed User Activity Log */}
      <div className="hairline-grid grid-cols-1 lg:grid-cols-12 items-start">
        {/* Accounts List */}
        <div className="hairline-cell lg:col-span-7 divide-y divide-[var(--line)] max-h-[760px] overflow-y-auto">
          <div className="p-4 bg-[var(--graphite)] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-[var(--cyan)]">
              <Users className="w-4 h-4" />
              <span>User Accounts &amp; Verification Console</span>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No matching accounts"
                description="Adjust your search query or role, status, and verification filters."
              />
            </div>
          ) : (
            filteredUsers.map((u) => {
              const emailVerified = Boolean(u.emailVerifiedAt);
              const phoneVerified = Boolean(u.phoneVerifiedAt);
              const fullyVerified = Boolean(u.isFullyVerified ?? (emailVerified && phoneVerified));
              const isBusy = busyUserId === u.id;
              const isSelected = selectedUserId === u.id;
              const isDeactivating = deactivateTargetId === u.id;
              const isSelf = u.id === currentUserId;

              return (
                <div
                  key={u.id}
                  className={`p-4 space-y-3 transition-colors ${
                    isSelected ? 'bg-[var(--ink)]' : 'bg-[var(--graphite)] hover:bg-[var(--ink)]'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void loadUserActivity(u.id)}
                          className="font-semibold text-sm text-[var(--bone)] hover:text-[var(--ember)] text-start cursor-pointer"
                        >
                          {u.name}
                        </button>
                        <StatusLabel
                          status={u.roleKey}
                          tone={u.roleKey.startsWith('admin') ? 'gold' : 'cedar'}
                        />
                        {fullyVerified && <StatusLabel status="Verified" tone="cedar" />}
                        {u.isBlocked && <StatusLabel status="Deactivated" tone="ember" />}
                      </div>

                      <p className="text-xs font-mono-tabular text-[var(--muted)] flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>{u.email}</span>
                        <span>·</span>
                        <span>{u.phone}</span>
                        {u.sellerName && (
                          <>
                            <span>·</span>
                            <span className="text-[var(--bone)] inline-flex items-center gap-1">
                              <Store className="w-3 h-3 text-[var(--ember)]" />
                              {u.sellerName}
                            </span>
                          </>
                        )}
                      </p>

                      <p className="text-[11px] font-mono-tabular text-[var(--muted)] flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className={emailVerified ? 'text-[var(--cedar)]' : 'text-[var(--gold)]'}>
                          Email: {emailVerified ? 'Verified' : 'Unverified'}
                        </span>
                        <span>·</span>
                        <span className={phoneVerified ? 'text-[var(--cedar)]' : 'text-[var(--gold)]'}>
                          Phone: {phoneVerified ? 'Verified' : 'Unverified'}
                        </span>
                        <span>·</span>
                        <span>2FA: {u.totpEnabled ? 'On' : 'Off'}</span>
                        <span>·</span>
                        <span>Orders: {u.ordersCount ?? 0}</span>
                        <span>·</span>
                        <span>Sessions: {u.activeSessionsCount ?? 0}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void loadUserActivity(u.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono-tabular uppercase whitespace-nowrap shrink-0 cursor-pointer ${
                        isSelected
                          ? 'border-[var(--ember)] bg-[var(--ember)] text-[var(--ember-fg)]'
                          : 'border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)]'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Activity Log</span>
                    </button>
                  </div>

                  {/* Account Governance Controls */}
                  {!isSelf && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--line)] text-xs">
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
                        className={`px-2.5 py-1 border font-mono-tabular uppercase whitespace-nowrap cursor-pointer disabled:opacity-50 ${
                          emailVerified
                            ? 'border-[var(--cedar)] text-[var(--cedar)]'
                            : 'border-[var(--line)] text-[var(--bone)] hover:border-[var(--cedar)]'
                        }`}
                      >
                        {emailVerified ? 'Email Verified' : 'Verify Email'}
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
                        className={`px-2.5 py-1 border font-mono-tabular uppercase whitespace-nowrap cursor-pointer disabled:opacity-50 ${
                          phoneVerified
                            ? 'border-[var(--cedar)] text-[var(--cedar)]'
                            : 'border-[var(--line)] text-[var(--bone)] hover:border-[var(--cedar)]'
                        }`}
                      >
                        {phoneVerified ? 'Phone Verified' : 'Verify Phone'}
                      </button>

                      {!fullyVerified && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() =>
                            void patchUserAccess(
                              u,
                              { verifyEmail: true, verifyPhone: true },
                              `Fully verified account ${u.email}`
                            )
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 border border-[var(--cedar)] text-[var(--cedar)] font-mono-tabular uppercase whitespace-nowrap cursor-pointer disabled:opacity-50"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Verify Both</span>
                        </button>
                      )}

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
                          className="bg-[var(--ink)] border border-[var(--line)] px-2 py-1 font-mono-tabular text-[var(--bone)]"
                        >
                          <option value="customer">customer</option>
                          <option value="seller_owner">seller_owner</option>
                          <option value="seller_staff">seller_staff</option>
                          <option value="admin_staff">admin_staff</option>
                        </select>
                      )}

                      {u.roleKey !== 'admin_super' &&
                        (u.isBlocked ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              void patchUserAccess(
                                u,
                                { isBlocked: false, reason: 'Reactivated by administrator' },
                                `Reactivated ${u.email}`
                              )
                            }
                            className="inline-flex items-center gap-1 px-3 py-1 border border-[var(--cedar)] text-[var(--cedar)] font-mono-tabular uppercase whitespace-nowrap cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Reactivate</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => {
                              setDeactivateTargetId(isDeactivating ? null : u.id);
                              setDeactivateReason('');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 border border-[var(--ember)] text-[var(--ember)] font-mono-tabular uppercase whitespace-nowrap cursor-pointer disabled:opacity-50"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Deactivate</span>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Inline Deactivation Reason Confirmation */}
                  {isDeactivating && !u.isBlocked && (
                    <div className="p-3 border border-[var(--ember)] bg-[var(--ink)] space-y-2 text-xs">
                      <p className="font-mono-tabular uppercase text-[var(--ember)]">
                        Confirm Deactivation · Revokes all active sessions immediately
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <input
                          value={deactivateReason}
                          onChange={(e) => setDeactivateReason(e.target.value)}
                          placeholder="Reason for deactivation (recorded in audit_log)..."
                          className="flex-1 min-w-[200px] bg-[var(--graphite)] border border-[var(--line)] px-2.5 py-1.5 text-[var(--bone)]"
                        />
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() =>
                            void patchUserAccess(
                              u,
                              {
                                isBlocked: true,
                                reason: deactivateReason.trim() || 'Deactivated by admin',
                              },
                              `Deactivated ${u.email} and revoked active sessions`
                            )
                          }
                          className="px-3 py-1.5 bg-[var(--ember)] text-[var(--ember-fg)] font-bold uppercase whitespace-nowrap cursor-pointer disabled:opacity-50"
                        >
                          Confirm Deactivate
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeactivateTargetId(null)}
                          className="px-3 py-1.5 border border-[var(--line)] text-[var(--muted)] whitespace-nowrap cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed User Activity Log */}
        <div className="hairline-cell lg:col-span-5 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
            <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-[var(--ember)]">
              <Clock className="w-4 h-4" />
              <span>Detailed User Activity Log</span>
            </div>
            {selectedUserId && (
              <button
                type="button"
                disabled={loadingActivity}
                onClick={() => void loadUserActivity(selectedUserId)}
                className="inline-flex items-center gap-1 px-2.5 py-1 border border-[var(--line)] text-[11px] font-mono-tabular text-[var(--bone)] hover:border-[var(--ember)] cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loadingActivity ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            )}
          </div>

          {!selectedUserId || (!activityData && loadingActivity) ? (
            <div className="py-12 text-center text-xs font-mono-tabular text-[var(--muted)]">
              {loadingActivity ? 'Loading account activity trail...' : 'Select an account to inspect activity.'}
            </div>
          ) : activityData ? (
            <div className="space-y-4">
              {/* User Account Snapshot */}
              <div className="border border-[var(--line)] bg-[var(--ink)] p-4 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-lg font-bold text-[var(--bone)]">
                    {activityData.user.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <StatusLabel
                      status={activityData.user.isBlocked ? 'Deactivated' : 'Active'}
                      tone={activityData.user.isBlocked ? 'ember' : 'cedar'}
                    />
                    {activityData.user.isFullyVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono-tabular text-[var(--cedar)]">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                </div>

                <p className="font-mono-tabular text-[var(--muted)]">
                  ID: {activityData.user.id} · Locale: {activityData.user.preferredLocale.toUpperCase()} · Currency:{' '}
                  {activityData.user.preferredCurrency}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--line)] font-mono-tabular">
                  <div>
                    <span className="text-[var(--muted)] block">Email Verified</span>
                    <span className="text-[var(--bone)]">
                      {activityData.user.emailVerifiedAt || 'Not verified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)] block">Phone Verified</span>
                    <span className="text-[var(--bone)]">
                      {activityData.user.phoneVerifiedAt || 'Not verified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)] block">Failed Logins / Active Sessions</span>
                    <span className="text-[var(--bone)]">
                      {activityData.user.failedLoginAttempts} fails · {activityData.stats.activeSessionsCount} sessions
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)] block">Lifetime Order Spend</span>
                    <PriceDisplay usdCents={activityData.stats.totalSpentUsdCents} size="sm" />
                  </div>
                </div>

                {activityData.user.seller && (
                  <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between">
                    <span className="text-[var(--muted)]">Merchant Storefront</span>
                    <span className="font-mono-tabular text-[var(--bone)]">
                      {activityData.user.seller.name.en} ({activityData.user.seller.status})
                    </span>
                  </div>
                )}
              </div>

              {/* Activity Category Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all' as const, label: `All (${activityData.auditEvents.length + activityData.recentOrders.length})` },
                  { id: 'audit' as const, label: `Audit (${activityData.auditEvents.length})` },
                  { id: 'orders' as const, label: `Orders (${activityData.stats.ordersCount})` },
                  {
                    id: 'feedback' as const,
                    label: `Reviews & Tickets (${activityData.stats.reviewsCount + activityData.stats.ticketsCount})`,
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActivityTab(t.id)}
                    className={`px-2.5 py-1 text-[11px] font-mono-tabular uppercase border whitespace-nowrap cursor-pointer ${
                      activityTab === t.id
                        ? 'border-[var(--ember)] bg-[var(--ember)] text-[var(--ember-fg)]'
                        : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--bone)]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Chronological Log Stream */}
              <div className="max-h-[460px] overflow-y-auto divide-y divide-[var(--line)] border border-[var(--line)] bg-[var(--ink)] text-xs font-mono-tabular">
                {(activityTab === 'all' || activityTab === 'audit') &&
                  activityData.auditEvents.map((ev) => {
                    const diffSummary = summarizeJsonDiff(ev.afterJson);
                    return (
                      <div key={ev.id} className="p-3 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-[var(--bone)]">
                            {ev.action} · {ev.entityType}:{ev.entityId.slice(0, 12)}
                          </span>
                          <span className="text-[11px] text-[var(--muted)]">{ev.createdAt}</span>
                        </div>
                        {diffSummary && <p className="text-[11px] text-[var(--muted)] break-all">{diffSummary}</p>}
                        {ev.ipAddress && (
                          <p className="text-[10px] text-[var(--cyan)]">IP: {ev.ipAddress}</p>
                        )}
                      </div>
                    );
                  })}

                {(activityTab === 'all' || activityTab === 'orders') &&
                  activityData.recentOrders.map((ord) => (
                    <div key={ord.id} className="p-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-[var(--bone)]">
                          Order {ord.orderNumber} · {ord.paymentMethod.toUpperCase()}
                        </p>
                        <p className="text-[11px] text-[var(--muted)]">
                          Status: {ord.paymentStatus} · {ord.createdAt}
                        </p>
                      </div>
                      <PriceDisplay usdCents={ord.grandTotalUsdCents} size="sm" />
                    </div>
                  ))}

                {(activityTab === 'all' || activityTab === 'feedback') && (
                  <>
                    {activityData.recentReviews.map((rv) => (
                      <div key={rv.id} className="p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--gold)]">Review ★ {rv.rating}/5 ({rv.moderationStatus})</span>
                          <span className="text-[11px] text-[var(--muted)]">{rv.createdAt}</span>
                        </div>
                        <p className="text-[11px] text-[var(--bone)] font-sans">{rv.comment}</p>
                      </div>
                    ))}
                    {activityData.recentTickets.map((tk) => (
                      <div key={tk.id} className="p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--cyan)] inline-flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Ticket · {tk.status}
                          </span>
                          <span className="text-[11px] text-[var(--muted)]">{tk.createdAt}</span>
                        </div>
                        <p className="text-[11px] text-[var(--bone)] font-sans">{tk.subject}</p>
                      </div>
                    ))}
                  </>
                )}

                {activityData.auditEvents.length === 0 &&
                  activityData.recentOrders.length === 0 &&
                  activityData.recentReviews.length === 0 &&
                  activityData.recentTickets.length === 0 && (
                    <div className="p-6 text-center text-[var(--muted)]">
                      No recorded activity events for this account yet.
                    </div>
                  )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
