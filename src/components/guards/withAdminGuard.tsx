import React, { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import type { UserRole } from '../../shared/types.ts';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';

export function isAuthorizedAdminRole(roleKey?: UserRole | string | null): boolean {
  return roleKey === 'admin_super' || roleKey === 'admin_staff';
}

export function resolveSafeRedirectPath(raw?: string | null): string | null {
  const candidate = (raw || '').trim();
  if (!candidate || /[\u0000-\u001F\u007F]/.test(candidate)) return null;
  if (!candidate.startsWith('/') || candidate.startsWith('//')) return null;
  return candidate;
}

export function withAdminGuard<P extends object>(WrappedComponent: React.ComponentType<P>) {
  function AdminGuardedComponent(props: P) {
    const { authUser, authChecked, locale, navigate, showToast } = useMarketplace();
    const [guardState, setGuardState] = useState<'checking' | 'authorized' | 'first_run_setup' | 'unauthorized'>('checking');

    useEffect(() => {
      if (!authChecked) {
        setGuardState('checking');
        return;
      }

      let cancelled = false;

      async function verifyAdminAccess() {
        if (authUser && isAuthorizedAdminRole(authUser.roleKey)) {
          try {
            const res = await fetch('/api/admin/session', { credentials: 'include' });
            if (cancelled) return;
            if (res.ok) {
              const data = (await res.json()) as { authorized?: boolean };
              if (data.authorized) {
                setGuardState('authorized');
                return;
              }
            }
          } catch {
            if (cancelled) return;
          }
          setGuardState('unauthorized');
          showToast(
            locale === 'ar'
              ? 'انتهت جلسة الإدارة أو الصلاحية غير كافية. يرجى تسجيل الدخول.'
              : 'Admin session verification failed. Please sign in again.',
            'error'
          );
          navigate('/account?mode=login&role=admin&redirect=%2Fadmin');
          return;
        }

        if (!authUser) {
          try {
            const statusRes = await fetch('/api/admin/auth-status', { credentials: 'include' });
            if (cancelled) return;
            if (statusRes.ok) {
              const status = (await statusRes.json()) as { hasSuperAdmin?: boolean };
              if (status.hasSuperAdmin === false) {
                setGuardState('first_run_setup');
                return;
              }
            }
          } catch {
            // Fall through to login redirect
          }
          if (cancelled) return;
          setGuardState('unauthorized');
          showToast(
            locale === 'ar'
              ? 'يرجى تسجيل الدخول بحساب الإدارة للمتابعة.'
              : 'Admin authentication required. Redirecting to login.',
            'info'
          );
          navigate('/account?mode=login&role=admin&redirect=%2Fadmin');
          return;
        }

        setGuardState('unauthorized');
        showToast(
          locale === 'ar'
            ? 'غير مصرح: يتطلب الدخول إلى لوحة الإدارة صلاحيات مسؤول.'
            : 'Unauthorized: Administrator privileges are required.',
          'error'
        );
        navigate('/account');
      }

      void verifyAdminAccess();
      return () => {
        cancelled = true;
      };
    }, [authChecked, authUser, locale, navigate, showToast]);

    if (guardState === 'authorized' || guardState === 'first_run_setup') {
      return <WrappedComponent {...props} />;
    }

    return (
      <div className="max-w-lg mx-auto px-4 md:px-8 py-16">
        <div className="border border-[var(--line)] bg-[var(--graphite)] p-8 space-y-3" aria-busy="true" aria-live="polite">
          <div className="flex items-center gap-2 text-[var(--ember)] text-xs font-mono-tabular uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>
              {guardState === 'checking'
                ? locale === 'ar'
                  ? 'جارٍ التحقق من صلاحيات الإدارة...'
                  : 'Verifying Admin Session...'
                : locale === 'ar'
                  ? 'إعادة التوجيه إلى تسجيل الدخول...'
                  : 'Redirecting to Sign In...'}
            </span>
          </div>
          <p className="text-xs text-[var(--muted)]">
            {locale === 'ar'
              ? 'تحقق أمني مباشر من الجلسة ودور المسؤول قبل عرض وحدة التحكم.'
              : 'Enforcing server-backed role verification before mounting the Admin Console.'}
          </p>
        </div>
      </div>
    );
  }

  AdminGuardedComponent.displayName = `withAdminGuard(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return AdminGuardedComponent;
}
