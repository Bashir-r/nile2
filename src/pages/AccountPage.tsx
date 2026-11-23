import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, Check, ExternalLink, KeyRound, LogOut, Mail, MailCheck, MapPin, MessageSquare, PhoneCall, Send, ShieldCheck, Trash2 } from 'lucide-react';
import type {
  ChatConversation,
  ChatMessage,
  Currency,
  CustomerAddress,
  EmailSummaryFrequency,
  Locale,
  NotificationCategory,
  OrderDispute,
  ReturnRequest,
  SupportTicket,
} from '../shared/types.ts';
import { LEBANON_GOVERNORATES } from '../shared/lebanon.ts';
import { useMarketplace } from '../context/MarketplaceContext.tsx';
import { EmptyState, PriceDisplay, ProductCard, SectionHeading, StampBadge, StatusLabel } from '../components/HairlineUI.tsx';
import { isAuthorizedAdminRole, resolveSafeRedirectPath } from '../components/guards/withAdminGuard.tsx';
import { useSeoMetadata } from '../utils/seo.ts';

type AccountTab = 'profile' | 'addresses' | 'notifications' | 'messages' | 'wishlist' | 'cases';
type AuthMode = 'login' | 'register' | 'reset';
type ResetStep = 'request' | 'verify' | 'password';

export function AccountPage() {
  const {
    locale,
    setLocale,
    setCurrency,
    t,
    route,
    navigate,
    authUser,
    refreshAuth,
    logout,
    logoutAllDevices,
    apiFetch,
    showToast,
    products,
    sellers,
    wishlist,
    notifications,
    notificationPrefs,
    unreadNotificationsCount,
    refreshNotifications,
    markNotificationRead,
    updateNotificationPreferences,
    sendNotificationEmailSummary,
  } = useMarketplace();

  useSeoMetadata({
    title: t.navAccount,
    description: 'Manage your NileLink customer profile, saved addresses, notifications, and cases.',
    robots: 'noindex,nofollow',
  });

  const initialTab = useMemo<AccountTab>(() => {
    const qs = new URLSearchParams(route.split('?')[1] || '');
    const qTab = qs.get('tab');
    if (
      qTab === 'addresses' ||
      qTab === 'notifications' ||
      qTab === 'messages' ||
      qTab === 'wishlist' ||
      qTab === 'cases'
    ) {
      return qTab;
    }
    return 'profile';
  }, [route]);

  const routeQuery = useMemo(() => new URLSearchParams(route.split('?')[1] || ''), [route]);

  const initialResetToken = routeQuery.get('resetToken') || '';
  const redirectTarget = useMemo(() => resolveSafeRedirectPath(routeQuery.get('redirect')), [routeQuery]);
  const roleHint = routeQuery.get('role') || '';
  const initialAuthMode = useMemo<AuthMode>(() => {
    if (initialResetToken) return 'reset';
    const qMode = routeQuery.get('mode');
    if (qMode === 'register' || qMode === 'reset' || qMode === 'login') return qMode;
    return 'login';
  }, [initialResetToken, routeQuery]);

  const [tab, setTab] = useState<AccountTab>(initialTab);
  const [authMode, setAuthMode] = useState<AuthMode>(initialAuthMode);

  // Guest Auth state (Password or 6-digit OTP)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginTotp, setLoginTotp] = useState('');
  const [useOtpLogin, setUseOtpLogin] = useState(false);
  const [otpLoginCode, setOtpLoginCode] = useState('');
  const [otpLoginSent, setOtpLoginSent] = useState(false);
  const [otpLoginDevCode, setOtpLoginDevCode] = useState<string | null>(null);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+961 ');
  const [regPassword, setRegPassword] = useState('');

  // 3-Step OTP Forgot Password State
  const [resetStep, setResetStep] = useState<ResetStep>(initialResetToken ? 'password' : 'request');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotChannel, setForgotChannel] = useState<'email' | 'sms'>('email');
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [devResetOtpCode, setDevResetOtpCode] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState(initialResetToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  // Profile, Verification & 2FA state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [prefLocale, setPrefLocale] = useState<Locale>(locale);
  const [prefCurrency, setPrefCurrency] = useState<Currency>('USD');
  const [savingProfile, setSavingProfile] = useState(false);
  const [totpEnrollData, setTotpEnrollData] = useState<{ secret: string; otpauthUri: string } | null>(null);
  const [totpVerifyCode, setTotpVerifyCode] = useState('');

  const [verifyEmailTarget, setVerifyEmailTarget] = useState('');
  const [verifyEmailCode, setVerifyEmailCode] = useState('');
  const [verifyEmailDevCode, setVerifyEmailDevCode] = useState<string | null>(null);
  const [verifyPhoneTarget, setVerifyPhoneTarget] = useState('');
  const [verifyPhoneCode, setVerifyPhoneCode] = useState('');
  const [verifyPhoneDevCode, setVerifyPhoneDevCode] = useState<string | null>(null);
  const [verifyBusy, setVerifyBusy] = useState<'email' | 'phone' | null>(null);

  // Addresses state
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [addrLabel, setAddrLabel] = useState('');
  const [addrGov, setAddrGov] = useState('beirut');
  const [addrDistrict, setAddrDistrict] = useState('achrafieh');
  const [addrTown, setAddrTown] = useState('Gemmayze');
  const [addrPhone, setAddrPhone] = useState('+961 ');
  const [addrNotes, setAddrNotes] = useState('');
  const [addrDefault, setAddrDefault] = useState(false);
  const [addrBusy, setAddrBusy] = useState(false);

  // Notifications, Messages & Cases state
  const [notifCategoryFilter, setNotifCategoryFilter] = useState<'all' | NotificationCategory>('all');
  const [summaryBusy, setSummaryBusy] = useState(false);
  const [summaryFeedback, setSummaryFeedback] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [convMessages, setConvMessages] = useState<ChatMessage[]>([]);
  const [chatDraft, setChatDraft] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const [casesData, setCasesData] = useState<{
    returns: ReturnRequest[];
    disputes: OrderDispute[];
    tickets: SupportTicket[];
  }>({ returns: [], disputes: [], tickets: [] });

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setAuthMode(initialAuthMode);
    if (initialResetToken) {
      setResetToken(initialResetToken);
      setResetStep('password');
    }
  }, [initialAuthMode, initialResetToken]);

  useEffect(() => {
    if (authUser) {
      setProfileName(authUser.name);
      setProfilePhone(authUser.phone);
      setVerifyEmailTarget(authUser.email);
      setVerifyPhoneTarget(authUser.phone);
      setPrefLocale(authUser.preferredLocale || locale);
      setPrefCurrency(authUser.preferredCurrency || 'USD');
      setAddrPhone(authUser.phone || '+961 ');
    }
  }, [authUser, locale]);

  const loadAccountData = useCallback(async () => {
    if (!authUser) return;
    try {
      const [addrRes, , casesRes, tktRes, chatRes] = await Promise.all([
        apiFetch<{ addresses: CustomerAddress[] }>('/api/account/addresses'),
        refreshNotifications(),
        apiFetch<{ returns: ReturnRequest[]; disputes: OrderDispute[] }>('/api/account/cases'),
        apiFetch<{ tickets: SupportTicket[] }>('/api/support-tickets'),
        apiFetch<{ conversations: ChatConversation[] }>('/api/chat/conversations'),
      ]);
      setAddresses(addrRes.addresses || []);
      setConversations(chatRes.conversations || []);
      setActiveConvId((prev) => prev || chatRes.conversations?.[0]?.id || null);
      setCasesData({
        returns: casesRes.returns || [],
        disputes: casesRes.disputes || [],
        tickets: tktRes.tickets || [],
      });
    } catch {
      // ignore transient
    }
  }, [authUser, apiFetch, refreshNotifications]);

  useEffect(() => {
    void loadAccountData();
  }, [loadAccountData]);

  const loadActiveChatMessages = useCallback(async () => {
    if (!authUser || !activeConvId) return;
    try {
      const res = await apiFetch<{ conversation: ChatConversation; messages: ChatMessage[] }>(
        `/api/chat/conversations/${encodeURIComponent(activeConvId)}/messages`
      );
      setConvMessages(res.messages || []);
    } catch {
      // ignore transient
    }
  }, [authUser, activeConvId, apiFetch]);

  useEffect(() => {
    if (tab !== 'messages' || !activeConvId) return;
    void loadActiveChatMessages();
    const timer = setInterval(() => {
      void loadActiveChatMessages();
    }, 6000);
    return () => clearInterval(timer);
  }, [tab, activeConvId, loadActiveChatMessages]);

  const selectedGov = useMemo(
    () => LEBANON_GOVERNORATES.find((g) => g.code === addrGov) || LEBANON_GOVERNORATES[0],
    [addrGov]
  );
  const selectedDist = useMemo(
    () => selectedGov.districts.find((d) => d.code === addrDistrict) || selectedGov.districts[0],
    [selectedGov, addrDistrict]
  );

  const wishlistProducts = useMemo(
    () => products.filter((p) => wishlist.includes(p.id)),
    [products, wishlist]
  );

  const totalUnreadMessages = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unreadForCustomer || 0), 0),
    [conversations]
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthBusy(true);
    try {
      await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          identifier: loginEmail.trim(),
          password: loginPassword,
          totpCode: loginTotp.trim() || undefined,
        }),
      });
      const signedInUser = await refreshAuth();
      showToast(locale === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully', 'success');
      if (redirectTarget) {
        if (redirectTarget.startsWith('/admin') && !isAuthorizedAdminRole(signedInUser?.roleKey)) {
          showToast(
            locale === 'ar'
              ? 'هذا الحساب لا يملك صلاحية الإدارة.'
              : 'This account does not have Administrator permissions.',
            'error'
          );
        } else {
          navigate(redirectTarget);
        }
      }
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleRequestLoginOtp = async () => {
    if (!loginEmail.trim()) {
      showToast(locale === 'ar' ? 'أدخل البريد الإلكتروني أو رقم الهاتف أولاً' : 'Enter your email or phone first', 'error');
      return;
    }
    setAuthBusy(true);
    try {
      const res = await apiFetch<{ sent: boolean; channel: 'email' | 'phone'; devOtpCode?: string }>(
        '/api/auth/otp/request',
        {
          method: 'POST',
          body: JSON.stringify({ identifier: loginEmail.trim() }),
        }
      );
      setOtpLoginSent(true);
      setOtpLoginDevCode(res.devOtpCode || null);
      showToast(
        locale === 'ar'
          ? 'تم إرسال رمز الدخول المكوّن من 6 أرقام'
          : '6-digit login code dispatched if the account exists',
        'info'
      );
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthBusy(true);
    try {
      await apiFetch('/api/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({
          identifier: loginEmail.trim(),
          code: otpLoginCode.trim(),
          totpCode: loginTotp.trim() || undefined,
        }),
      });
      setOtpLoginCode('');
      setOtpLoginSent(false);
      setOtpLoginDevCode(null);
      const signedInUser = await refreshAuth();
      showToast(locale === 'ar' ? 'تم تسجيل الدخول برمز التحقق' : 'Signed in via 6-digit OTP', 'success');
      if (redirectTarget) {
        if (redirectTarget.startsWith('/admin') && !isAuthorizedAdminRole(signedInUser?.roleKey)) {
          showToast(
            locale === 'ar'
              ? 'هذا الحساب لا يملك صلاحية الإدارة.'
              : 'This account does not have Administrator permissions.',
            'error'
          );
        } else {
          navigate(redirectTarget);
        }
      }
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSendContactVerification = async (channel: 'email' | 'phone') => {
    setVerifyBusy(channel);
    try {
      const target = channel === 'email' ? verifyEmailTarget.trim() : verifyPhoneTarget.trim();
      const res = await apiFetch<{ sent: boolean; channel: 'email' | 'phone'; target: string; devOtpCode?: string }>(
        '/api/auth/verification/send',
        {
          method: 'POST',
          body: JSON.stringify({ channel, target: target || undefined }),
        }
      );
      if (channel === 'email') {
        setVerifyEmailDevCode(res.devOtpCode || null);
      } else {
        setVerifyPhoneDevCode(res.devOtpCode || null);
      }
      showToast(
        locale === 'ar'
          ? `تم إرسال رمز التحقق إلى ${res.target}`
          : `6-digit verification code sent to ${res.target}`,
        'success'
      );
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setVerifyBusy(null);
    }
  };

  const handleConfirmContactVerification = async (channel: 'email' | 'phone') => {
    const code = (channel === 'email' ? verifyEmailCode : verifyPhoneCode).trim();
    if (!code) return;
    setVerifyBusy(channel);
    try {
      await apiFetch('/api/auth/verification/confirm', {
        method: 'POST',
        body: JSON.stringify({ channel, code }),
      });
      if (channel === 'email') {
        setVerifyEmailCode('');
        setVerifyEmailDevCode(null);
      } else {
        setVerifyPhoneCode('');
        setVerifyPhoneDevCode(null);
      }
      await refreshAuth();
      showToast(
        locale === 'ar'
          ? channel === 'email'
            ? 'تم توثيق البريد الإلكتروني بنجاح'
            : 'تم توثيق رقم الهاتف بنجاح'
          : `${channel === 'email' ? 'Email' : 'Phone'} verified successfully`,
        'success'
      );
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setVerifyBusy(null);
    }
  };

  const handleSendAccountChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConvId || !chatDraft.trim()) return;
    setChatBusy(true);
    try {
      const res = await apiFetch<{ message: ChatMessage }>(
        `/api/chat/conversations/${encodeURIComponent(activeConvId)}/messages`,
        {
          method: 'POST',
          body: JSON.stringify({ body: chatDraft.trim() }),
        }
      );
      setConvMessages((prev) => [...prev, res.message]);
      setChatDraft('');
      void loadAccountData();
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setChatBusy(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthBusy(true);
    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          password: regPassword,
          locale,
        }),
      });
      await refreshAuth();
      showToast(locale === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created', 'success');
      if (redirectTarget && !redirectTarget.startsWith('/admin')) {
        navigate(redirectTarget);
      }
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleRequestResetOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!forgotIdentifier.trim()) {
      showToast(
        locale === 'ar' ? 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف' : 'Please enter your email or phone number',
        'error'
      );
      return;
    }
    setAuthBusy(true);
    try {
      const res = await apiFetch<{
        ok: boolean;
        channel: 'email' | 'sms';
        deliveryConfigured: boolean;
        expiresInSeconds: number;
        devOtpCode?: string;
      }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({
          identifier: forgotIdentifier.trim(),
          channel: forgotChannel,
        }),
      });
      setDevResetOtpCode(res.devOtpCode || null);
      setForgotOtpCode('');
      setResetStep('verify');
      showToast(
        locale === 'ar'
          ? `إذا كان الحساب مسجلاً، تم إرسال رمز التحقق عبر ${res.channel === 'sms' ? 'SMS' : 'البريد الإلكتروني'}.`
          : `If an account matches, a 6-digit reset OTP was sent via ${res.channel === 'sms' ? 'SMS' : 'email'}.`,
        'info'
      );
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthBusy(true);
    try {
      const res = await apiFetch<{ ok: boolean; resetToken: string; expiresInSeconds: number }>(
        '/api/auth/forgot-password/verify-otp',
        {
          method: 'POST',
          body: JSON.stringify({
            identifier: forgotIdentifier.trim(),
            code: forgotOtpCode.trim(),
            channel: forgotChannel,
          }),
        }
      );
      setResetToken(res.resetToken);
      setDevResetOtpCode(null);
      setResetStep('password');
      showToast(
        locale === 'ar' ? 'تم التحقق من الرمز. اختر كلمة مرور جديدة.' : 'OTP verified. Choose a new password.',
        'success'
      );
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast(
        locale === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Password confirmation does not match.',
        'error'
      );
      return;
    }
    setAuthBusy(true);
    try {
      await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token: resetToken.trim(), newPassword }),
      });
      setAuthMode('login');
      setResetStep('request');
      setResetToken('');
      setForgotOtpCode('');
      setNewPassword('');
      setConfirmNewPassword('');
      setDevResetOtpCode(null);
      showToast(
        locale === 'ar'
          ? 'تم تحديث كلمة المرور بنجاح وتسجيل الخروج من الجلسات القديمة.'
          : 'Password updated securely. All prior sessions were signed out.',
        'success'
      );
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await apiFetch('/api/account/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: profileName.trim(),
          phone: profilePhone.trim(),
          preferredLocale: prefLocale,
          preferredCurrency: prefCurrency,
        }),
      });
      setLocale(prefLocale);
      setCurrency(prefCurrency);
      await refreshAuth();
      showToast(locale === 'ar' ? 'تم حفظ الملف الشخصي' : 'Profile updated', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleStart2fa = async () => {
    try {
      const res = await apiFetch<{ secret: string; otpauthUri: string }>('/api/auth/2fa/enroll', { method: 'POST' });
      setTotpEnrollData(res);
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  };

  const handleVerify2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/api/auth/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({ code: totpVerifyCode.trim() }),
      });
      setTotpEnrollData(null);
      setTotpVerifyCode('');
      await refreshAuth();
      showToast(locale === 'ar' ? 'تم تفعيل المصادقة الثنائية' : 'Two-factor authentication enabled', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddrBusy(true);
    try {
      await apiFetch('/api/account/addresses', {
        method: 'POST',
        body: JSON.stringify({
          label: addrLabel.trim(),
          governorate: addrGov,
          district: addrDistrict,
          town: addrTown,
          phone: addrPhone.trim(),
          notes: addrNotes.trim(),
          isDefault: addrDefault,
        }),
      });
      setAddrLabel('');
      setAddrNotes('');
      setAddrDefault(false);
      await loadAccountData();
      showToast(locale === 'ar' ? 'تم حفظ العنوان' : 'Address saved', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setAddrBusy(false);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await apiFetch(`/api/account/addresses/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ isDefault: true }),
      });
      await loadAccountData();
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await apiFetch(`/api/account/addresses/${encodeURIComponent(id)}`, { method: 'DELETE' });
      await loadAccountData();
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  };

  const handleMarkNotificationRead = async (idOrAll: string) => {
    await markNotificationRead(idOrAll);
  };

  const handleSendEmailSummaryNow = async () => {
    setSummaryBusy(true);
    setSummaryFeedback(null);
    const res = await sendNotificationEmailSummary();
    if (res) {
      if (res.sentCount === 0) {
        setSummaryFeedback(locale === 'ar' ? 'لا توجد تحديثات جديدة لإرسالها.' : 'No notifications to include in digest.');
      } else {
        setSummaryFeedback(
          locale === 'ar'
            ? `${res.previewSubject || 'تم تجهيز الملخص البريدي'} (${res.sentCount})`
            : `${res.previewSubject || 'Summary processed'} (${res.sentCount} items · status: ${res.status})`
        );
      }
    }
    setSummaryBusy(false);
  };

  if (!authUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-10 space-y-6">
        <SectionHeading
          title={t.navAccount}
          subtitle={
            locale === 'ar'
              ? 'سجل الدخول لإدارة عناوينك في لبنان وإشعارات الطلبات والمفضلة.'
              : 'Sign in to manage Lebanese delivery addresses, notifications, wishlist, and order cases.'
          }
        />

        <div className="border border-[var(--line)] bg-[var(--graphite)]">
          <div className="grid grid-cols-3 border-b border-[var(--line)] text-xs font-mono-tabular uppercase">
            {(
              [
                ['login', t.signIn],
                ['register', t.register],
                ['reset', t.resetPassword],
              ] as const
            ).map(([m, lbl]) => (
              <button
                key={m}
                type="button"
                onClick={() => setAuthMode(m)}
                className={`py-3 px-2 border-e last:border-e-0 border-[var(--line)] cursor-pointer ${
                  authMode === m
                    ? 'bg-[var(--ember)] text-[var(--ember-fg)] font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--bone)]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          {roleHint === 'admin' && (
            <div className="border-b border-[var(--line)] bg-[var(--ink)] px-6 py-3 flex items-center gap-2 text-xs text-[var(--cyan)]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                {locale === 'ar'
                  ? 'تسجيل دخول الإدارة محمي: أدخل بريد الإدارة وكلمة المرور ورمز 2FA للمتابعة إلى لوحة التحكم.'
                  : 'Admin Console Sign-In: sign in with an Administrator account and 6-digit 2FA code to continue to /admin.'}
              </span>
            </div>
          )}

          {authMode === 'login' && (
            <form onSubmit={useOtpLogin ? handleVerifyLoginOtp : handleLogin} className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--line)]">
                <span className="text-xs font-mono-tabular uppercase text-[var(--muted)]">
                  {useOtpLogin
                    ? locale === 'ar'
                      ? 'الدخول برمز التحقق (OTP)'
                      : 'Sign in via 6-digit OTP'
                    : locale === 'ar'
                      ? 'البريد الإلكتروني أو الهاتف + كلمة المرور'
                      : 'Email or Phone (+961) + Password'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setUseOtpLogin((v) => !v);
                    setOtpLoginSent(false);
                    setOtpLoginDevCode(null);
                  }}
                  className="text-xs font-mono-tabular uppercase text-[var(--ember)] hover:underline cursor-pointer"
                >
                  {useOtpLogin
                    ? locale === 'ar'
                      ? 'استخدم كلمة المرور'
                      : 'Use Password Instead'
                    : locale === 'ar'
                      ? 'دخول برمز OTP (6 أرقام)'
                      : 'Sign in with 6-digit OTP'}
                </button>
              </div>

              <label className="block space-y-1.5 text-xs">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">
                  {locale === 'ar' ? 'البريد الإلكتروني أو رقم الهاتف (+961)' : 'Email or Phone (+961)'}
                </span>
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@beirut.lb or +96170123456"
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2.5 text-sm text-[var(--bone)]"
                />
              </label>

              {!useOtpLogin ? (
                <label className="block space-y-1.5 text-xs">
                  <span className="font-mono-tabular uppercase text-[var(--muted)]">Password</span>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2.5 text-sm text-[var(--bone)]"
                  />
                </label>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={authBusy}
                      onClick={() => void handleRequestLoginOtp()}
                      className="px-4 py-2 border border-[var(--cedar)] text-xs font-semibold uppercase text-[var(--cedar)] cursor-pointer disabled:opacity-50"
                    >
                      {otpLoginSent
                        ? locale === 'ar'
                          ? 'إعادة إرسال الرمز'
                          : 'Resend 6-Digit Code'
                        : locale === 'ar'
                          ? 'إرسال رمز OTP'
                          : 'Send 6-Digit OTP'}
                    </button>
                  </div>
                  {otpLoginDevCode && (
                    <div className="border border-[var(--gold)] bg-[var(--ink)] p-2.5 text-xs font-mono-tabular">
                      <span className="text-[var(--gold)] uppercase">Dev OTP Preview: </span>
                      <strong className="text-[var(--bone)]">{otpLoginDevCode}</strong>
                    </div>
                  )}
                  <label className="block space-y-1.5 text-xs">
                    <span className="font-mono-tabular uppercase text-[var(--muted)]">
                      {locale === 'ar' ? 'رمز OTP المكوّن من 6 أرقام' : '6-Digit Verification Code'}
                    </span>
                    <input
                      type="text"
                      required
                      value={otpLoginCode}
                      onChange={(e) => setOtpLoginCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2.5 text-sm font-mono-tabular text-[var(--bone)]"
                    />
                  </label>
                </div>
              )}

              <label className="block space-y-1.5 text-xs">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">
                  2FA Code ({locale === 'ar' ? 'اختياري' : 'if enabled'})
                </span>
                <input
                  type="text"
                  value={loginTotp}
                  onChange={(e) => setLoginTotp(e.target.value)}
                  placeholder="6-digit code"
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2.5 text-sm font-mono-tabular text-[var(--bone)]"
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  disabled={authBusy}
                  className="px-6 py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
                >
                  {authBusy ? '...' : useOtpLogin ? (locale === 'ar' ? 'تحقق وسجل الدخول' : 'Verify & Sign In') : t.signIn}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('reset')}
                  className="editorial-link text-xs text-[var(--muted)] cursor-pointer"
                >
                  {t.forgotPassword}
                </button>
              </div>
            </form>
          )}

          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-1.5 text-xs">
                  <span className="font-mono-tabular uppercase text-[var(--muted)]">{t.fullName}</span>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2.5 text-sm text-[var(--bone)]"
                  />
                </label>
                <label className="block space-y-1.5 text-xs">
                  <span className="font-mono-tabular uppercase text-[var(--muted)]">{t.phone}</span>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2.5 text-sm font-mono-tabular text-[var(--bone)]"
                  />
                </label>
              </div>
              <label className="block space-y-1.5 text-xs">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">Email</span>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2.5 text-sm text-[var(--bone)]"
                />
              </label>
              <label className="block space-y-1.5 text-xs">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">
                  Password (8+ chars, letters & numbers)
                </span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2.5 text-sm text-[var(--bone)]"
                />
              </label>
              <button
                type="submit"
                disabled={authBusy}
                className="px-6 py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
              >
                {authBusy ? '...' : t.register}
              </button>
            </form>
          )}

          {authMode === 'reset' && (
            <div className="p-6 space-y-5">
              {/* 3-Step Hairline Stepper */}
              <div className="grid grid-cols-3 border border-[var(--line)] bg-[var(--ink)] text-[11px] font-mono-tabular uppercase">
                {(
                  [
                    ['request', locale === 'ar' ? '١ · طلب الرمز' : '1 · Request OTP'],
                    ['verify', locale === 'ar' ? '٢ · التحقق' : '2 · Verify OTP'],
                    ['password', locale === 'ar' ? '٣ · كلمة المرور' : '3 · New Password'],
                  ] as const
                ).map(([stepKey, stepLabel]) => (
                  <div
                    key={stepKey}
                    className={`py-2 px-3 border-e last:border-e-0 border-[var(--line)] text-center ${
                      resetStep === stepKey
                        ? 'bg-[var(--ember)] text-[var(--ember-fg)] font-bold'
                        : 'text-[var(--muted)]'
                    }`}
                  >
                    {stepLabel}
                  </div>
                ))}
              </div>

              {resetStep === 'request' && (
                <form onSubmit={handleRequestResetOtp} className="space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <span className="font-mono-tabular uppercase text-[var(--muted)]">
                      {locale === 'ar' ? 'قناة استلام رمز التحقق (OTP)' : 'OTP Delivery Channel'}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setForgotChannel('email')}
                        className={`py-2.5 px-3 border text-xs font-semibold uppercase cursor-pointer flex items-center justify-center gap-2 ${
                          forgotChannel === 'email'
                            ? 'border-[var(--ember)] bg-[var(--ink)] text-[var(--ember)]'
                            : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--bone)]'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email OTP'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setForgotChannel('sms')}
                        className={`py-2.5 px-3 border text-xs font-semibold uppercase cursor-pointer flex items-center justify-center gap-2 ${
                          forgotChannel === 'sms'
                            ? 'border-[var(--ember)] bg-[var(--ink)] text-[var(--ember)]'
                            : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--bone)]'
                        }`}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{locale === 'ar' ? 'رسالة SMS' : 'SMS OTP'}</span>
                      </button>
                    </div>
                  </div>

                  <label className="block space-y-1.5 text-xs">
                    <span className="font-mono-tabular uppercase text-[var(--muted)]">
                      {forgotChannel === 'sms'
                        ? locale === 'ar'
                          ? 'رقم الهاتف اللبناني (+961) أو البريد المرتبط'
                          : 'Phone Number (+961...) or Account Email'
                        : locale === 'ar'
                          ? 'البريد الإلكتروني أو رقم الهاتف'
                          : 'Account Email or Phone (+961...)'}
                    </span>
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder={forgotChannel === 'sms' ? '+96170123456' : 'you@beirut.lb'}
                      className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2.5 text-sm font-mono-tabular text-[var(--bone)]"
                    />
                  </label>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={authBusy}
                      className="px-6 py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
                    >
                      {authBusy
                        ? '...'
                        : locale === 'ar'
                          ? 'إرسال رمز التحقق (6 أرقام)'
                          : 'Send 6-Digit Reset OTP'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetStep('password')}
                      className="text-xs font-mono-tabular text-[var(--muted)] hover:text-[var(--bone)] cursor-pointer"
                    >
                      {locale === 'ar' ? 'لديّ رمز إعادة تعيين بالفعل' : 'Have a reset token?'}
                    </button>
                  </div>
                </form>
              )}

              {resetStep === 'verify' && (
                <form onSubmit={handleVerifyResetOtp} className="space-y-4">
                  <div className="border border-[var(--line)] bg-[var(--ink)] px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[var(--muted)]">
                      {locale === 'ar' ? 'الحساب:' : 'Account:'}{' '}
                      <strong className="font-mono-tabular text-[var(--bone)]">{forgotIdentifier}</strong> ·{' '}
                      <span className="uppercase">{forgotChannel}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setResetStep('request')}
                      className="text-[var(--ember)] hover:underline cursor-pointer"
                    >
                      {locale === 'ar' ? 'تغيير' : 'Change'}
                    </button>
                  </div>

                  {devResetOtpCode && (
                    <div className="border border-[var(--gold)] bg-[var(--ink)] p-3 text-xs font-mono-tabular flex items-center justify-between gap-2">
                      <div>
                        <p className="uppercase text-[var(--gold)]">
                          {forgotChannel === 'sms'
                            ? 'Dev SMS OTP Preview (Gateway unconfigured)'
                            : 'Dev Email OTP Preview (SMTP unconfigured)'}
                        </p>
                        <p className="text-base font-bold text-[var(--bone)] tracking-widest mt-0.5">
                          {devResetOtpCode}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForgotOtpCode(devResetOtpCode)}
                        className="border border-[var(--gold)] px-2.5 py-1 text-[11px] uppercase text-[var(--gold)] cursor-pointer"
                      >
                        {locale === 'ar' ? 'تعبئة' : 'Fill Code'}
                      </button>
                    </div>
                  )}

                  <label className="block space-y-1.5 text-xs">
                    <span className="font-mono-tabular uppercase text-[var(--muted)]">
                      {locale === 'ar' ? 'أدخل رمز التحقق المكوّن من 6 أرقام' : 'Enter 6-Digit Verification OTP'}
                    </span>
                    <input
                      type="text"
                      required
                      maxLength={8}
                      value={forgotOtpCode}
                      onChange={(e) => setForgotOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2.5 text-base font-mono-tabular tracking-widest text-[var(--bone)]"
                    />
                  </label>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="submit"
                      disabled={authBusy}
                      className="px-6 py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
                    >
                      {authBusy ? '...' : locale === 'ar' ? 'تحقق من الرمز' : 'Verify OTP Code'}
                    </button>
                    <button
                      type="button"
                      disabled={authBusy}
                      onClick={() => void handleRequestResetOtp()}
                      className="px-4 py-2 border border-[var(--line)] text-xs uppercase text-[var(--muted)] hover:text-[var(--bone)] cursor-pointer disabled:opacity-50"
                    >
                      {locale === 'ar' ? 'إعادة إرسال الرمز' : 'Resend Code'}
                    </button>
                  </div>
                </form>
              )}

              {resetStep === 'password' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {!resetToken && (
                    <label className="block space-y-1 text-xs">
                      <span className="font-mono-tabular uppercase text-[var(--muted)]">Reset Token</span>
                      <input
                        type="text"
                        required
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm font-mono-tabular text-[var(--bone)]"
                      />
                    </label>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block space-y-1 text-xs">
                      <span className="font-mono-tabular uppercase text-[var(--muted)]">
                        {locale === 'ar' ? 'كلمة المرور الجديدة (8+ أحرف وأرقام)' : 'New Password (8+ chars, letters & numbers)'}
                      </span>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2.5 text-sm text-[var(--bone)]"
                      />
                    </label>
                    <label className="block space-y-1 text-xs">
                      <span className="font-mono-tabular uppercase text-[var(--muted)]">
                        {locale === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm New Password'}
                      </span>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2.5 text-sm text-[var(--bone)]"
                      />
                    </label>
                  </div>

                  <p className="text-[11px] font-mono-tabular text-[var(--muted)]">
                    {newPassword.length >= 8 && /[a-zA-Z]/.test(newPassword) && /\d/.test(newPassword)
                      ? locale === 'ar'
                        ? '✓ كلمة المرور تستوفي شروط الأمان'
                        : '✓ Password meets complexity rules'
                      : locale === 'ar'
                        ? 'استخدم 8 أحرف على الأقل تتضمن حروفاً وأرقاماً.'
                        : 'Minimum 8 characters including letters and numbers.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="submit"
                      disabled={authBusy}
                      className="px-6 py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
                    >
                      {authBusy ? '...' : t.resetPassword}
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetStep('request')}
                      className="text-xs text-[var(--muted)] hover:text-[var(--bone)] cursor-pointer"
                    >
                      {locale === 'ar' ? 'البدء برمز OTP جديد' : 'Start with new OTP'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="border border-[var(--line)] bg-[var(--graphite)] p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
          <span>{locale === 'ar' ? 'تريد فتح متجر أو تتبع طلبك كضيف؟' : 'Looking for merchant onboarding or guest order tracking?'}</span>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate('/orders')} className="editorial-link text-[var(--bone)] cursor-pointer">
              {t.myOrders}
            </button>
            <button type="button" onClick={() => navigate('/seller')} className="editorial-link text-[var(--ember)] cursor-pointer">
              {t.navSell}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
        <div>
          <p className="text-xs font-mono-tabular uppercase text-[var(--muted)]">
            {authUser.roleKey.replace('_', ' ')} · {authUser.email} · {authUser.phone}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h1 className="font-display text-3xl font-bold text-[var(--bone)]">{authUser.name}</h1>
            <StampBadge
              label={
                authUser.isFullyVerified
                  ? locale === 'ar'
                    ? 'حساب موثق ✓'
                    : 'Verified User ✓'
                  : locale === 'ar'
                    ? 'بانتظار التوثيق'
                    : 'Verification Pending'
              }
              tone={authUser.isFullyVerified ? 'cedar' : 'gold'}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(authUser.roleKey === 'seller_owner' || authUser.roleKey === 'seller_staff') && (
            <button
              type="button"
              onClick={() => navigate('/seller')}
              className="px-4 py-2 border border-[var(--ember)] text-xs font-semibold text-[var(--ember)] cursor-pointer"
            >
              {t.navSell}
            </button>
          )}
          {(authUser.roleKey === 'admin_super' || authUser.roleKey === 'admin_staff') && (
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-4 py-2 border border-[var(--cyan)] text-xs font-semibold text-[var(--cyan)] cursor-pointer"
            >
              {t.adminPanel}
            </button>
          )}
          <button
            type="button"
            onClick={() => void logout()}
            className="px-4 py-2 border border-[var(--line)] text-xs font-semibold text-[var(--bone)] inline-flex items-center gap-1.5 hover:border-[var(--ember)] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* Hairline Tabs */}
      <div className="flex flex-wrap border border-[var(--line)] bg-[var(--graphite)] text-xs font-mono-tabular uppercase">
        {(
          [
            ['profile', t.profileSettings],
            ['addresses', `${t.savedAddresses} (${addresses.length})`],
            ['notifications', `${t.notifications}${unreadNotificationsCount > 0 ? ` · ${unreadNotificationsCount}` : ''}`],
            ['messages', `${locale === 'ar' ? 'المحادثات' : 'Messages'}${totalUnreadMessages > 0 ? ` · ${totalUnreadMessages}` : ''}`],
            ['wishlist', `${t.wishlist} (${wishlistProducts.length})`],
            ['cases', locale === 'ar' ? 'الطلبات والدعم' : 'Cases & Support'],
          ] as const
        ).map(([k, lbl]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`px-4 py-3 border-e border-b sm:border-b-0 border-[var(--line)] cursor-pointer ${
              tab === k
                ? 'bg-[var(--ember)] text-[var(--ember-fg)] font-bold'
                : 'text-[var(--muted)] hover:text-[var(--bone)]'
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* Tab 1: Profile & Security */}
      {tab === 'profile' && (
        <div className="hairline-grid grid-cols-1 lg:grid-cols-12">
          <form onSubmit={handleSaveProfile} className="hairline-cell lg:col-span-7 p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-[var(--bone)]">{t.profileSettings}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1 text-xs">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">{t.fullName}</span>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
                />
              </label>
              <label className="block space-y-1 text-xs">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">{t.phone}</span>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm font-mono-tabular text-[var(--bone)]"
                />
              </label>
              <label className="block space-y-1 text-xs">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">
                  {locale === 'ar' ? 'اللغة المفضلة' : 'Preferred Language'}
                </span>
                <select
                  value={prefLocale}
                  onChange={(e) => setPrefLocale(e.target.value === 'ar' ? 'ar' : 'en')}
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
                >
                  <option value="en">English (LTR)</option>
                  <option value="ar">العربية (RTL)</option>
                </select>
              </label>
              <label className="block space-y-1 text-xs">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">
                  {locale === 'ar' ? 'العملة المفضلة' : 'Preferred Currency'}
                </span>
                <select
                  value={prefCurrency}
                  onChange={(e) => setPrefCurrency(e.target.value === 'LBP' ? 'LBP' : 'USD')}
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm font-mono-tabular text-[var(--bone)]"
                >
                  <option value="USD">USD ($)</option>
                  <option value="LBP">LBP (ل.ل)</option>
                </select>
              </label>
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase cursor-pointer"
            >
              {savingProfile ? '...' : locale === 'ar' ? 'حفظ التغييرات' : 'Save Preferences'}
            </button>
          </form>

          <div className="hairline-cell lg:col-span-5 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--cedar)]" />
                <h2 className="font-display text-xl font-bold text-[var(--bone)]">{t.twoFactorAuth}</h2>
              </div>
              <StatusLabel
                status={authUser.totpEnabled ? 'enabled' : 'off'}
                tone={authUser.totpEnabled ? 'cedar' : 'gold'}
              />
            </div>

            {!authUser.totpEnabled && !totpEnrollData && (
              <button
                type="button"
                onClick={handleStart2fa}
                className="px-4 py-2 border border-[var(--line)] text-xs font-semibold text-[var(--bone)] hover:border-[var(--ember)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{locale === 'ar' ? 'إعداد تطبيق المصادقة' : 'Enroll TOTP Authenticator'}</span>
              </button>
            )}

            {totpEnrollData && (
              <form onSubmit={handleVerify2fa} className="space-y-3 border border-[var(--line)] bg-[var(--ink)] p-4 text-xs">
                <p className="font-mono-tabular text-[var(--gold)] uppercase">Authenticator Secret</p>
                <p className="font-mono-tabular break-all text-[var(--bone)]">{totpEnrollData.secret}</p>
                <p className="text-[11px] font-mono-tabular break-all text-[var(--muted)]">{totpEnrollData.otpauthUri}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={totpVerifyCode}
                    onChange={(e) => setTotpVerifyCode(e.target.value)}
                    placeholder="123456"
                    className="flex-1 bg-[var(--graphite)] border border-[var(--line)] px-3 py-2 font-mono-tabular text-[var(--bone)]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--cedar)] text-white font-bold uppercase cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              </form>
            )}

            <div className="pt-4 border-t border-[var(--line)] space-y-2">
              <p className="text-xs font-mono-tabular uppercase text-[var(--muted)]">
                {locale === 'ar' ? 'الأمان والجلسات' : 'Active Sessions'}
              </p>
              <button
                type="button"
                onClick={() => void logoutAllDevices()}
                className="px-4 py-2 border border-[var(--ember)] text-xs font-semibold text-[var(--ember)] cursor-pointer"
              >
                {t.logoutAllDevices}
              </button>
            </div>
          </div>

          <div className="hairline-cell lg:col-span-12 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--bone)]">
                  {locale === 'ar' ? 'مركز توثيق البريد الإلكتروني والهاتف' : 'Email & Phone OTP Verification Center'}
                </h2>
                <p className="text-xs text-[var(--muted)]">
                  {locale === 'ar'
                    ? 'قم بتوثيق كل من البريد الإلكتروني ورقم الهاتف اللبناني للحصول على شارة الحساب الموثق.'
                    : 'Verify both your email and Lebanese phone number with 6-digit OTP codes to unlock Verified User status.'}
                </p>
              </div>
              <StatusLabel
                status={authUser.isFullyVerified ? 'Verified User' : 'Incomplete'}
                tone={authUser.isFullyVerified ? 'cedar' : 'gold'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-[var(--line)] bg-[var(--ink)] p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono-tabular uppercase text-[var(--bone)]">
                    <MailCheck className="w-4 h-4 text-[var(--cedar)]" />
                    {locale === 'ar' ? 'توثيق البريد الإلكتروني' : 'Email Verification'}
                  </span>
                  <StatusLabel
                    status={authUser.emailVerifiedAt ? 'verified' : 'unverified'}
                    tone={authUser.emailVerifiedAt ? 'cedar' : 'gold'}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={verifyEmailTarget}
                    onChange={(e) => setVerifyEmailTarget(e.target.value)}
                    className="flex-1 bg-[var(--graphite)] border border-[var(--line)] px-3 py-2 text-[var(--bone)]"
                  />
                  <button
                    type="button"
                    disabled={verifyBusy === 'email'}
                    onClick={() => void handleSendContactVerification('email')}
                    className="px-3 py-2 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)] font-mono-tabular uppercase cursor-pointer"
                  >
                    {locale === 'ar' ? 'إرسال OTP' : 'Send OTP'}
                  </button>
                </div>
                {verifyEmailDevCode && (
                  <p className="border border-[var(--gold)] px-2.5 py-1.5 font-mono-tabular text-[var(--gold)]">
                    Dev Email OTP: <strong className="text-[var(--bone)]">{verifyEmailDevCode}</strong>
                  </p>
                )}
                <div className="flex gap-2">
                  <input
                    value={verifyEmailCode}
                    onChange={(e) => setVerifyEmailCode(e.target.value)}
                    placeholder={locale === 'ar' ? 'أدخل رمز 6 أرقام' : 'Enter 6-digit code'}
                    className="flex-1 bg-[var(--graphite)] border border-[var(--line)] px-3 py-2 font-mono-tabular text-[var(--bone)]"
                  />
                  <button
                    type="button"
                    disabled={verifyBusy === 'email' || !verifyEmailCode.trim()}
                    onClick={() => void handleConfirmContactVerification('email')}
                    className="px-4 py-2 bg-[var(--cedar)] text-white font-bold uppercase cursor-pointer disabled:opacity-50"
                  >
                    {locale === 'ar' ? 'تأكيد' : 'Confirm'}
                  </button>
                </div>
              </div>

              <div className="border border-[var(--line)] bg-[var(--ink)] p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono-tabular uppercase text-[var(--bone)]">
                    <PhoneCall className="w-4 h-4 text-[var(--cedar)]" />
                    {locale === 'ar' ? 'توثيق رقم الهاتف' : 'Phone SMS Verification'}
                  </span>
                  <StatusLabel
                    status={authUser.phoneVerifiedAt ? 'verified' : 'unverified'}
                    tone={authUser.phoneVerifiedAt ? 'cedar' : 'gold'}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={verifyPhoneTarget}
                    onChange={(e) => setVerifyPhoneTarget(e.target.value)}
                    className="flex-1 bg-[var(--graphite)] border border-[var(--line)] px-3 py-2 font-mono-tabular text-[var(--bone)]"
                  />
                  <button
                    type="button"
                    disabled={verifyBusy === 'phone'}
                    onClick={() => void handleSendContactVerification('phone')}
                    className="px-3 py-2 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--ember)] font-mono-tabular uppercase cursor-pointer"
                  >
                    {locale === 'ar' ? 'إرسال OTP' : 'Send OTP'}
                  </button>
                </div>
                {verifyPhoneDevCode && (
                  <p className="border border-[var(--gold)] px-2.5 py-1.5 font-mono-tabular text-[var(--gold)]">
                    Dev Phone OTP: <strong className="text-[var(--bone)]">{verifyPhoneDevCode}</strong>
                  </p>
                )}
                <div className="flex gap-2">
                  <input
                    value={verifyPhoneCode}
                    onChange={(e) => setVerifyPhoneCode(e.target.value)}
                    placeholder={locale === 'ar' ? 'أدخل رمز 6 أرقام' : 'Enter 6-digit code'}
                    className="flex-1 bg-[var(--graphite)] border border-[var(--line)] px-3 py-2 font-mono-tabular text-[var(--bone)]"
                  />
                  <button
                    type="button"
                    disabled={verifyBusy === 'phone' || !verifyPhoneCode.trim()}
                    onClick={() => void handleConfirmContactVerification('phone')}
                    className="px-4 py-2 bg-[var(--cedar)] text-white font-bold uppercase cursor-pointer disabled:opacity-50"
                  >
                    {locale === 'ar' ? 'تأكيد' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {tab === 'addresses' && (
        <div className="hairline-grid grid-cols-1 lg:grid-cols-12">
          <div className="hairline-cell lg:col-span-7 p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-[var(--bone)]">{t.savedAddresses}</h2>
            {addresses.length === 0 ? (
              <EmptyState
                title={locale === 'ar' ? 'لا توجد عناوين محفوظة' : 'No saved addresses yet'}
                description={locale === 'ar' ? 'أضف عنوانك في لبنان لإتمام الشراء بسرعة.' : 'Add a Lebanese delivery address for one-click checkout.'}
              />
            ) : (
              <div className="divide-y divide-[var(--line)] border border-[var(--line)]">
                {addresses.map((adr) => (
                  <div key={adr.id} className="p-4 flex flex-wrap items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[var(--ember)]" />
                        <span className="font-semibold text-sm text-[var(--bone)]">{adr.label}</span>
                        {adr.isDefault && <StatusLabel status="default" tone="cedar" />}
                      </div>
                      <p className="text-[var(--muted)]">
                        {adr.governorate} · {adr.district} · {adr.town}
                      </p>
                      <p className="font-mono-tabular text-[var(--muted)]">{adr.phone}</p>
                      {adr.notes && <p className="text-[var(--bone)]">{adr.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      {!adr.isDefault && (
                        <button
                          type="button"
                          onClick={() => void handleSetDefaultAddress(adr.id)}
                          className="px-2.5 py-1.5 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--cedar)] cursor-pointer"
                        >
                          {locale === 'ar' ? 'تعيين كافتراضي' : 'Set Default'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => void handleDeleteAddress(adr.id)}
                        aria-label="Delete address"
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

          <form onSubmit={handleCreateAddress} className="hairline-cell lg:col-span-5 p-6 space-y-3">
            <h3 className="font-display text-lg font-bold text-[var(--bone)]">
              {locale === 'ar' ? 'إضافة عنوان جديد' : 'Add Lebanese Address'}
            </h3>
            <label className="block space-y-1 text-xs">
              <span className="font-mono-tabular uppercase text-[var(--muted)]">
                {locale === 'ar' ? 'تسمية العنوان' : 'Label (Home / Office)'}
              </span>
              <input
                type="text"
                required
                value={addrLabel}
                onChange={(e) => setAddrLabel(e.target.value)}
                placeholder="Gemmayze Studio"
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="block space-y-1 text-xs">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">{t.governorate}</span>
                <select
                  value={addrGov}
                  onChange={(e) => {
                    const g = LEBANON_GOVERNORATES.find((item) => item.code === e.target.value);
                    setAddrGov(e.target.value);
                    if (g?.districts[0]) {
                      setAddrDistrict(g.districts[0].code);
                      setAddrTown(g.districts[0].towns[0]?.en || '');
                    }
                  }}
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-xs text-[var(--bone)]"
                >
                  {LEBANON_GOVERNORATES.map((g) => (
                    <option key={g.code} value={g.code}>
                      {g.name[locale]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1 text-xs">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">{t.district}</span>
                <select
                  value={addrDistrict}
                  onChange={(e) => {
                    const d = selectedGov.districts.find((item) => item.code === e.target.value);
                    setAddrDistrict(e.target.value);
                    if (d?.towns[0]) setAddrTown(d.towns[0].en);
                  }}
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-xs text-[var(--bone)]"
                >
                  {selectedGov.districts.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name[locale]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1 text-xs">
                <span className="font-mono-tabular uppercase text-[var(--muted)]">{t.town}</span>
                <select
                  value={addrTown}
                  onChange={(e) => setAddrTown(e.target.value)}
                  className="w-full bg-[var(--ink)] border border-[var(--line)] px-2.5 py-2 text-xs text-[var(--bone)]"
                >
                  {selectedDist.towns.map((tw) => (
                    <option key={tw.en} value={tw.en}>
                      {tw[locale]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block space-y-1 text-xs">
              <span className="font-mono-tabular uppercase text-[var(--muted)]">{t.phone}</span>
              <input
                type="tel"
                required
                value={addrPhone}
                onChange={(e) => setAddrPhone(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm font-mono-tabular text-[var(--bone)]"
              />
            </label>
            <label className="block space-y-1 text-xs">
              <span className="font-mono-tabular uppercase text-[var(--muted)]">{t.addressNotes}</span>
              <input
                type="text"
                value={addrNotes}
                onChange={(e) => setAddrNotes(e.target.value)}
                className="w-full bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-sm text-[var(--bone)]"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--bone)] cursor-pointer">
              <input type="checkbox" checked={addrDefault} onChange={(e) => setAddrDefault(e.target.checked)} />
              <span>{locale === 'ar' ? 'تعيين كعنوان افتراضي' : 'Set as default delivery address'}</span>
            </label>
            <button
              type="submit"
              disabled={addrBusy}
              className="px-5 py-2.5 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase cursor-pointer"
            >
              {addrBusy ? '...' : locale === 'ar' ? 'حفظ العنوان' : 'Save Address'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Notifications & Email Summaries */}
      {tab === 'notifications' && (
        <div className="space-y-6">
          {/* Email Summary & Topic Preferences */}
          <div className="border border-[var(--line)] bg-[var(--graphite)] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="font-display text-lg font-bold text-[var(--bone)] inline-flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--ember)]" />
                  <span>{locale === 'ar' ? 'تفضيلات الإشعارات وملخصات البريد' : 'Notification & Email Summary Settings'}</span>
                </h2>
                <p className="text-xs text-[var(--muted)]">
                  {locale === 'ar'
                    ? 'اختر نوع التنبيهات وجدولة رسائل الملخص البريدي لتحديثات الطلبات وانخفاض الأسعار والعروض.'
                    : 'Control in-app bell alerts and email summaries for order updates, wishlisted price drops, and offers.'}
                </p>
              </div>
              <button
                type="button"
                disabled={summaryBusy}
                onClick={() => void handleSendEmailSummaryNow()}
                className="px-3.5 py-2 border border-[var(--ember)] bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer disabled:opacity-50"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{summaryBusy ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...') : t.bellSendSummary}</span>
              </button>
            </div>

            {summaryFeedback && (
              <div className="border border-[var(--line)] bg-[var(--ink)] px-3 py-2 text-xs text-[var(--bone)] font-mono-tabular">
                {summaryFeedback}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--line)] text-xs">
              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-[var(--muted)]">
                  {locale === 'ar' ? 'تكرار الملخص البريدي' : 'Email Summary Frequency'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      ['instant', locale === 'ar' ? 'فوري' : 'Instant'],
                      ['daily', locale === 'ar' ? 'يومي' : 'Daily Digest'],
                      ['weekly', locale === 'ar' ? 'أسبوعي' : 'Weekly Digest'],
                      ['off', locale === 'ar' ? 'إيقاف البريد' : 'Off'],
                    ] as Array<[EmailSummaryFrequency, string]>
                  ).map(([freqKey, freqLabel]) => {
                    const selected =
                      freqKey === 'off'
                        ? !notificationPrefs.emailSummaryEnabled || notificationPrefs.summaryFrequency === 'off'
                        : notificationPrefs.emailSummaryEnabled && notificationPrefs.summaryFrequency === freqKey;
                    return (
                      <button
                        key={freqKey}
                        type="button"
                        onClick={() =>
                          void updateNotificationPreferences(
                            freqKey === 'off'
                              ? { emailSummaryEnabled: false, summaryFrequency: 'off' }
                              : { emailSummaryEnabled: true, summaryFrequency: freqKey }
                          )
                        }
                        className={`px-3 py-1.5 border cursor-pointer ${
                          selected
                            ? 'border-[var(--ember)] bg-[var(--ember)] text-[var(--ember-fg)] font-semibold'
                            : 'border-[var(--line)] bg-[var(--ink)] text-[var(--bone)] hover:border-[var(--ember)]'
                        }`}
                      >
                        {freqLabel}
                      </button>
                    );
                  })}
                </div>
                {notificationPrefs.lastSummarySentAt && (
                  <p className="text-[11px] font-mono-tabular text-[var(--muted)]">
                    {locale === 'ar' ? 'آخر ملخص أُرسل:' : 'Last summary sent:'} {notificationPrefs.lastSummarySentAt}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <span className="block text-[11px] uppercase tracking-wider text-[var(--muted)]">
                  {locale === 'ar' ? 'أنواع التنبيهات المفعّلة' : 'Alert Categories'}
                </span>
                <div className="flex flex-wrap gap-3">
                  {(
                    [
                      ['orderUpdates', locale === 'ar' ? 'تحديثات الطلبات' : 'Order Updates', notificationPrefs.orderUpdates],
                      ['priceDrops', locale === 'ar' ? 'انخفاض أسعار المفضلة' : 'Wishlist Price Drops', notificationPrefs.priceDrops],
                      ['promotionalOffers', locale === 'ar' ? 'العروض الترويجية' : 'Promotional Offers', notificationPrefs.promotionalOffers],
                    ] as const
                  ).map(([field, label, checked]) => (
                    <label key={field} className="inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--ink)] px-3 py-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => void updateNotificationPreferences({ [field]: e.target.checked })}
                        className="accent-[var(--ember)]"
                      />
                      <span className="text-[var(--bone)]">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Centralized Notification Feed */}
          <div className="border border-[var(--line)] bg-[var(--graphite)] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[var(--ember)]" />
                <h2 className="font-display text-xl font-bold text-[var(--bone)]">{t.notifications}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    ['all', t.bellAll],
                    ['order', t.bellOrders],
                    ['price_drop', t.bellPriceDrops],
                    ['promo', t.bellOffers],
                  ] as const
                ).map(([catKey, label]) => (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setNotifCategoryFilter(catKey)}
                    className={`px-2.5 py-1 border text-xs cursor-pointer ${
                      notifCategoryFilter === catKey
                        ? 'border-[var(--ember)] bg-[var(--ember)] text-[var(--ember-fg)] font-semibold'
                        : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--bone)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
                {unreadNotificationsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => void handleMarkNotificationRead('all')}
                    className="px-3 py-1 border border-[var(--line)] text-xs font-semibold text-[var(--bone)] inline-flex items-center gap-1.5 hover:border-[var(--cedar)] cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.bellMarkAllRead}</span>
                  </button>
                )}
              </div>
            </div>

            {notifications.filter((n) => notifCategoryFilter === 'all' || (n.category || 'system') === notifCategoryFilter).length === 0 ? (
              <EmptyState
                title={locale === 'ar' ? 'لا توجد إشعارات' : 'Inbox clear'}
                description={
                  locale === 'ar'
                    ? 'ستظهر هنا تحديثات الطلبات وانخفاض أسعار المنتجات في المفضلة والعروض الجديدة.'
                    : 'Order milestones, wishlist price drops, and active promotional offers appear here.'
                }
              />
            ) : (
              <div className="divide-y divide-[var(--line)] border border-[var(--line)]">
                {notifications
                  .filter((n) => notifCategoryFilter === 'all' || (n.category || 'system') === notifCategoryFilter)
                  .map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 flex flex-wrap items-start justify-between gap-4 text-xs ${
                        n.readAt ? 'bg-[var(--ink)] opacity-80' : 'bg-[var(--graphite)]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {!n.readAt && <span className="w-2 h-2 bg-[var(--ember)] inline-block" aria-hidden="true" />}
                          <span className="font-mono-tabular text-[10px] uppercase border border-[var(--line)] px-1.5 py-0.5 text-[var(--muted)]">
                            {n.category === 'order'
                              ? t.bellOrders
                              : n.category === 'price_drop'
                                ? t.bellPriceDrops
                                : n.category === 'promo'
                                  ? t.bellOffers
                                  : locale === 'ar'
                                    ? 'النظام'
                                    : 'System'}
                          </span>
                          <p className="font-semibold text-sm text-[var(--bone)]">{n.title[locale] || n.title.en}</p>
                        </div>
                        <p className="text-[var(--muted)]">{n.body[locale] || n.body.en}</p>
                        <p className="font-mono-tabular text-[11px] text-[var(--muted)]">
                          {n.createdAt}
                          {n.emailedAt ? ` · ${locale === 'ar' ? 'أُرسل بالبريد' : 'Emailed'}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {n.actionUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              if (!n.readAt) void handleMarkNotificationRead(n.id);
                              navigate(n.actionUrl!);
                            }}
                            className="px-3 py-1 border border-[var(--line)] text-[var(--ember)] hover:border-[var(--ember)] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>{locale === 'ar' ? 'فتح' : 'View'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                        {!n.readAt && (
                          <button
                            type="button"
                            onClick={() => void handleMarkNotificationRead(n.id)}
                            className="px-3 py-1 border border-[var(--line)] text-[var(--bone)] hover:border-[var(--cedar)] cursor-pointer"
                          >
                            {locale === 'ar' ? 'مقروء' : 'Mark Read'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3.5: Direct Store System Chat */}
      {tab === 'messages' && (
        <div className="hairline-grid grid-cols-1 lg:grid-cols-12">
          <div className="hairline-cell lg:col-span-4 border-e border-[var(--line)] divide-y divide-[var(--line)] max-h-[520px] overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title={locale === 'ar' ? 'لا توجد محادثات بعد' : 'No store conversations yet'}
                  description={
                    locale === 'ar'
                      ? 'تواصل مباشرة مع أي متجر عبر زر المحادثة داخل صفحة المنتج أو المتجر.'
                      : 'Start a direct conversation from any store page or product listing.'
                  }
                  actionLabel={t.navCatalog}
                  onAction={() => navigate('/catalog')}
                />
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full p-4 text-start space-y-1 cursor-pointer transition-colors ${
                    activeConvId === conv.id ? 'bg-[var(--ink)] border-s-2 border-s-[var(--ember)]' : 'hover:bg-[var(--ink)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-[var(--bone)] truncate">
                      {conv.sellerName?.[locale] || conv.sellerName?.en || conv.sellerId}
                    </span>
                    {conv.unreadForCustomer > 0 && (
                      <span className="px-1.5 py-0.5 bg-[var(--ember)] text-[var(--ember-fg)] text-[10px] font-mono-tabular font-bold">
                        {conv.unreadForCustomer}
                      </span>
                    )}
                  </div>
                  {conv.productTitle && (
                    <p className="text-[11px] font-mono-tabular text-[var(--cyan)] truncate">
                      {conv.productTitle[locale] || conv.productTitle.en}
                    </p>
                  )}
                  <p className="text-xs text-[var(--muted)] truncate">{conv.lastMessagePreview || '—'}</p>
                </button>
              ))
            )}
          </div>

          <div className="hairline-cell lg:col-span-8 flex flex-col min-h-[420px]">
            {!activeConvId ? (
              <div className="p-8 flex-1 flex items-center justify-center text-xs text-[var(--muted)]">
                {locale === 'ar' ? 'اختر محادثة لعرض الرسائل.' : 'Select a store conversation to view messages.'}
              </div>
            ) : (
              <>
                {(() => {
                  const activeConv = conversations.find((c) => c.id === activeConvId);
                  return (
                    <div className="px-5 py-3 border-b border-[var(--line)] bg-[var(--graphite)] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <MessageSquare className="w-4 h-4 text-[var(--ember)]" />
                        <span className="font-bold text-[var(--bone)]">
                          {activeConv?.sellerName?.[locale] || activeConv?.sellerName?.en}
                        </span>
                      </div>
                      {activeConv?.sellerSlug && (
                        <button
                          type="button"
                          onClick={() => navigate(`/store/${activeConv.sellerSlug}`)}
                          className="text-xs font-mono-tabular text-[var(--cyan)] hover:underline cursor-pointer"
                        >
                          {t.viewStore}
                        </button>
                      )}
                    </div>
                  );
                })()}

                <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[var(--ink)] max-h-[380px]">
                  {convMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[82%] p-3 border text-xs space-y-1 ${
                        m.senderRole === 'customer'
                          ? 'ms-auto bg-[var(--graphite)] border-[var(--ember)]'
                          : 'me-auto bg-[var(--graphite)] border-[var(--line)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] font-mono-tabular text-[var(--muted)]">
                        <span>{m.senderName || (m.senderRole === 'customer' ? authUser.name : 'Store')}</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-sm text-[var(--bone)] whitespace-pre-wrap">{m.body}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendAccountChat} className="p-4 border-t border-[var(--line)] bg-[var(--graphite)] flex gap-2">
                  <input
                    value={chatDraft}
                    onChange={(e) => setChatDraft(e.target.value)}
                    placeholder={locale === 'ar' ? 'اكتب رسالتك للمتجر...' : 'Write a message to the store...'}
                    className="flex-1 bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-xs text-[var(--bone)]"
                  />
                  <button
                    type="submit"
                    disabled={chatBusy || !chatDraft.trim()}
                    className="px-4 py-2 bg-[var(--ember)] text-[var(--ember-fg)] text-xs font-bold uppercase inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{locale === 'ar' ? 'إرسال' : 'Send'}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Wishlist */}
      {tab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistProducts.length === 0 ? (
            <EmptyState
              title={locale === 'ar' ? 'قائمة المفضلة فارغة' : 'Wishlist is empty'}
              description={locale === 'ar' ? 'احفظ المنتجات من الكتالوج للعودة إليها لاحقاً.' : 'Save products from the catalog to compare them later.'}
              actionLabel={t.navCatalog}
              onAction={() => navigate('/catalog')}
            />
          ) : (
            <div className="hairline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {wishlistProducts.map((p) => (
                <ProductCard key={p.id} product={p} seller={sellers.find((s) => s.id === p.sellerId)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Returns, Disputes & Support Tickets */}
      {tab === 'cases' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-[var(--bone)]">
              {locale === 'ar' ? 'الإرجاعات والنزاعات وتذاكر الدعم' : 'Returns, Disputes & Support Tickets'}
            </h2>
            <div className="flex gap-3 text-xs">
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="px-4 py-2 border border-[var(--line)] text-[var(--bone)] cursor-pointer"
              >
                {t.myOrders}
              </button>
              <button
                type="button"
                onClick={() => navigate('/support')}
                className="px-4 py-2 bg-[var(--ember)] text-[var(--ember-fg)] font-bold uppercase cursor-pointer"
              >
                {t.navSupport}
              </button>
            </div>
          </div>

          <div className="hairline-grid grid-cols-1 lg:grid-cols-3">
            <div className="hairline-cell p-5 space-y-3">
              <p className="text-xs font-mono-tabular uppercase text-[var(--muted)]">
                Returns ({casesData.returns.length})
              </p>
              {casesData.returns.length === 0 ? (
                <p className="text-xs text-[var(--muted)]">No return requests.</p>
              ) : (
                <div className="space-y-2">
                  {casesData.returns.map((r) => (
                    <div key={r.id} className="border border-[var(--line)] bg-[var(--ink)] p-3 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="font-mono-tabular text-[var(--bone)]">{r.orderNumber || r.subOrderId}</span>
                        <StatusLabel status={r.status} tone={r.status === 'refunded' ? 'cedar' : 'gold'} />
                      </div>
                      <p className="text-[var(--muted)]">{r.reason}</p>
                      <PriceDisplay usdCents={r.refundUsdCents} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hairline-cell p-5 space-y-3">
              <p className="text-xs font-mono-tabular uppercase text-[var(--muted)]">
                Disputes ({casesData.disputes.length})
              </p>
              {casesData.disputes.length === 0 ? (
                <p className="text-xs text-[var(--muted)]">No order disputes.</p>
              ) : (
                <div className="space-y-2">
                  {casesData.disputes.map((d) => (
                    <div key={d.id} className="border border-[var(--line)] bg-[var(--ink)] p-3 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="font-mono-tabular text-[var(--bone)]">{d.orderNumber || d.subOrderId}</span>
                        <StatusLabel status={d.status.replace('_', ' ')} tone={d.status.startsWith('resolved') ? 'cedar' : 'ember'} />
                      </div>
                      <p className="text-[var(--muted)]">{d.reason}</p>
                      {d.resolutionNote && <p className="text-[var(--cedar)]">{d.resolutionNote}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hairline-cell p-5 space-y-3">
              <p className="text-xs font-mono-tabular uppercase text-[var(--muted)]">
                Support Tickets ({casesData.tickets.length})
              </p>
              {casesData.tickets.length === 0 ? (
                <p className="text-xs text-[var(--muted)]">No support tickets submitted.</p>
              ) : (
                <div className="space-y-2">
                  {casesData.tickets.map((tkt) => (
                    <div key={tkt.id} className="border border-[var(--line)] bg-[var(--ink)] p-3 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="font-semibold text-[var(--bone)]">{tkt.subject}</span>
                        <StatusLabel status={tkt.status.replace('_', ' ')} tone={tkt.status === 'resolved' ? 'cedar' : 'gold'} />
                      </div>
                      <p className="text-[var(--muted)]">{tkt.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
