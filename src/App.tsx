import React, { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext.tsx';
import { Header } from './components/Header.tsx';
import { MiniCartDrawer } from './components/MiniCartDrawer.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { CatalogPage } from './pages/CatalogPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { StorefrontPage } from './pages/StorefrontPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrdersPage } from './pages/OrdersPage.tsx';
import { SellerDashboardPage } from './pages/SellerDashboardPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { StyleguidePage } from './pages/StyleguidePage.tsx';
import { LegalPage } from './pages/LegalPage.tsx';
import { CampaignPage } from './pages/CampaignPage.tsx';
import { AccountPage } from './pages/AccountPage.tsx';
import { SupportPage } from './pages/SupportPage.tsx';
import { MarketingOverlayManager } from './components/MarketingOverlayManager.tsx';
import { EmptyState } from './components/HairlineUI.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { useSeoMetadata } from './utils/seo.ts';

function ToastBanner() {
  const { toast } = useMarketplace();
  if (!toast) return null;
  const borderColor =
    toast.type === 'error'
      ? 'var(--ember)'
      : toast.type === 'success'
        ? 'var(--cedar)'
        : 'var(--line)';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 md:bottom-6 end-4 md:end-8 z-50 border bg-[var(--graphite)] px-4 py-3 text-xs font-medium text-[var(--bone)] max-w-sm"
      style={{ borderColor }}
    >
      {toast.text}
    </div>
  );
}

function NotFoundView() {
  const { locale, navigate } = useMarketplace();
  useSeoMetadata({
    title: locale === 'ar' ? 'الصفحة غير موجودة (404)' : 'Page Not Found (404)',
    description: 'The requested page does not exist on NileLink.',
    robots: 'noindex,nofollow',
  });
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-14">
      <EmptyState
        title={locale === 'ar' ? '404 · الصفحة غير موجودة' : '404 · Page Not Found'}
        description={
          locale === 'ar'
            ? 'الرابط الذي فتحته غير متوفر أو تم نقله.'
            : 'The requested path does not exist or may have moved.'
        }
        actionLabel={locale === 'ar' ? 'العودة إلى الرئيسية' : 'Return Home'}
        onAction={() => navigate('/')}
      />
    </div>
  );
}

function RouterView() {
  const { route } = useMarketplace();
  const pathname = route.split('?')[0] || '/';

  if (pathname === '/' || pathname === '') return <HomePage />;
  if (pathname === '/catalog') return <CatalogPage />;
  if (pathname === '/stores') return <CatalogPage initialView="stores-map" />;
  if (pathname.startsWith('/product/')) {
    const slug = pathname.replace('/product/', '');
    return <ProductDetailPage slug={slug} />;
  }
  if (pathname.startsWith('/store/')) {
    const slug = pathname.replace('/store/', '');
    return <StorefrontPage slug={slug} />;
  }
  if (pathname === '/checkout') return <CheckoutPage />;
  if (pathname === '/orders') return <OrdersPage />;
  if (pathname === '/seller') return <SellerDashboardPage />;
  if (pathname === '/admin') return <AdminDashboardPage />;
  if (pathname === '/styleguide') return <StyleguidePage />;
  if (pathname.startsWith('/campaign/')) {
    const slug = pathname.replace('/campaign/', '');
    return <CampaignPage slug={slug} />;
  }
  if (pathname === '/legal') return <LegalPage />;
  if (pathname === '/account') return <AccountPage />;
  if (pathname === '/support') return <SupportPage />;

  return <NotFoundView />;
}

function AppShell({ quotaExceeded }: { quotaExceeded: boolean }) {
  const { route, locale, navigate } = useMarketplace();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--ink)] text-[var(--bone)]">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <Header />
      <main id="main-content" className="flex-1">
        <ErrorBoundary resetKey={route} locale={locale} onNavigateHome={() => navigate('/')}>
          <RouterView />
        </ErrorBoundary>
      </main>
      <Footer />
      <MiniCartDrawer />
      <MobileBottomNav />
      <MarketingOverlayManager />
      <ToastBanner />
    </div>
  );
}

export default function App() {
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const onQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <MarketplaceProvider>
        <AppShell quotaExceeded={mapsQuotaExceeded} />
      </MarketplaceProvider>
    </MotionConfig>
  );
}
