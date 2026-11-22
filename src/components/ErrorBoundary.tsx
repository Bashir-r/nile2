import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import type { Locale } from '../shared/types.ts';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  resetKey?: string;
  locale?: Locale;
  onNavigateHome?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected application error',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[NileLink ErrorBoundary]', error.message, info.componentStack ? '(component stack captured)' : '');
  }

  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>): void {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, errorMessage: '' });
    }
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  private handleHome = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
    if (this.props.onNavigateHome) {
      this.props.onNavigateHome();
    } else if (typeof window !== 'undefined') {
      window.location.assign('/');
    }
  };

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isAr = this.props.locale === 'ar';
    const showDevDetails = import.meta.env.DEV && this.state.errorMessage;

    return (
      <div
        role="alert"
        className="max-w-[780px] mx-auto px-4 md:px-8 py-14"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="border border-[var(--line)] bg-[var(--graphite)] p-6 md:p-8 space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 border border-[var(--ember)] bg-[var(--ink)] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-[var(--ember)]" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--ember)]">
                {isAr ? 'استعادة الواجهة' : 'View Recovery'}
              </p>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--bone)]">
                {isAr ? 'حدث خطأ غير متوقع أثناء عرض هذه الصفحة' : 'Something went wrong rendering this view'}
              </h1>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {isAr
                  ? 'لا تقلق، سلة التسوق وحسابك محفوظان بأمان. يمكنك إعادة المحاولة أو العودة إلى الصفحة الرئيسية.'
                  : 'Your cart and session remain safely preserved. Try reloading this section or return to the marketplace home.'}
              </p>
            </div>
          </div>

          {showDevDetails && (
            <div className="border border-[var(--line)] bg-[var(--ink)] px-3.5 py-2.5 text-xs font-mono-tabular text-[var(--gold)] break-words">
              {this.state.errorMessage}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={this.handleRetry}
              className="px-5 py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer hover:opacity-90"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isAr ? 'إعادة المحاولة' : 'Try Again'}</span>
            </button>
            <button
              type="button"
              onClick={this.handleHome}
              className="px-5 py-2.5 border border-[var(--line)] bg-[var(--ink)] text-xs font-semibold uppercase tracking-wider text-[var(--bone)] hover:border-[var(--bone)] inline-flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isAr ? 'العودة إلى الرئيسية' : 'Return Home'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
