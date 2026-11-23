import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import type { ChatConversation, ChatMessage, Product, Seller } from '../shared/types.ts';
import { useMarketplace } from '../context/MarketplaceContext.tsx';

export function StoreChatModal({
  open,
  onClose,
  seller,
  product,
}: {
  open: boolean;
  onClose: () => void;
  seller: Seller;
  product?: Product;
}) {
  const { authUser, apiFetch, locale, navigate, showToast } = useMarketplace();
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !authUser) return;
    let active = true;

    async function loadOrFindThread(silent = false) {
      if (!silent) setLoading(true);
      try {
        const listRes = await apiFetch<{ conversations: ChatConversation[] }>('/api/chat/conversations');
        if (!active) return;
        const match = (listRes.conversations || []).find(
          (c) =>
            c.sellerId === seller.id &&
            (product ? c.productId === product.id : !c.productId)
        ) || (listRes.conversations || []).find((c) => c.sellerId === seller.id);

        if (match) {
          const msgRes = await apiFetch<{ conversation: ChatConversation; messages: ChatMessage[] }>(
            `/api/chat/conversations/${encodeURIComponent(match.id)}/messages`
          );
          if (!active) return;
          setConversation(msgRes.conversation);
          setMessages(msgRes.messages || []);
        } else {
          setConversation(null);
          setMessages([]);
        }
      } catch (err) {
        if (!silent) showToast((err as Error).message, 'error');
      } finally {
        if (active && !silent) setLoading(false);
      }
    }

    void loadOrFindThread(false);
    const timer = window.setInterval(() => {
      void loadOrFindThread(true);
    }, 4500);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [open, authUser?.id, seller.id, product?.id, apiFetch, showToast]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!open) return null;

  const isOwnStore = Boolean(authUser?.sellerId && authUser.sellerId === seller.id);
  const whatsappClean = seller.whatsappPhone.replace(/[^\d]/g, '');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    setSending(true);
    try {
      if (!conversation) {
        const res = await apiFetch<{ conversation: ChatConversation; message: ChatMessage }>('/api/chat/conversations', {
          method: 'POST',
          body: JSON.stringify({
            sellerId: seller.id,
            productId: product?.id,
            body: draft.trim(),
          }),
        });
        setConversation(res.conversation);
        setMessages([res.message]);
      } else {
        const res = await apiFetch<{ message: ChatMessage }>(
          `/api/chat/conversations/${encodeURIComponent(conversation.id)}/messages`,
          {
            method: 'POST',
            body: JSON.stringify({ body: draft.trim() }),
          }
        );
        setMessages((prev) => [...prev, res.message]);
      }
      setDraft('');
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={locale === 'ar' ? `محادثة مع ${seller.name.ar}` : `Chat with ${seller.name.en}`}
    >
      <div className="w-full max-w-lg border border-[var(--line)] bg-[var(--ink)] flex flex-col max-h-[82vh]">
        <div className="p-4 border-b border-[var(--line)] bg-[var(--graphite)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {seller.logoImage ? (
              <img
                src={seller.logoImage}
                alt={seller.name[locale]}
                referrerPolicy="no-referrer"
                className="w-9 h-9 object-cover border border-[var(--line)] shrink-0"
              />
            ) : (
              <div className="w-9 h-9 border border-[var(--line)] bg-[var(--ink)] flex items-center justify-center text-xs font-bold shrink-0">
                <MessageSquare className="w-4 h-4 text-[var(--ember)]" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--bone)] truncate">{seller.name[locale]}</p>
              <p className="text-[11px] font-mono-tabular text-[var(--muted)] truncate">
                {product
                  ? locale === 'ar'
                    ? `بخصوص: ${product.title.ar}`
                    : `Re: ${product.title.en}`
                  : locale === 'ar'
                    ? 'محادثة مباشرة داخل النظام'
                    : 'Direct System Chat'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {whatsappClean && (
              <a
                href={`https://wa.me/${whatsappClean}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-[11px] font-mono-tabular border border-[var(--line)] text-[var(--cedar)] hover:border-[var(--cedar)]"
              >
                WhatsApp
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="p-1.5 border border-[var(--line)] text-[var(--muted)] hover:text-[var(--bone)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[260px]">
          {!authUser ? (
            <div className="border border-[var(--line)] bg-[var(--graphite)] p-5 text-center space-y-3">
              <p className="text-sm font-medium text-[var(--bone)]">
                {locale === 'ar'
                  ? 'سجّل الدخول للتحدث مباشرة مع التاجر وحفظ سجل الرسائل'
                  : 'Sign in to message this store inside NileLink'}
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/account');
                }}
                className="px-4 py-2 text-xs font-semibold bg-[var(--ember)] text-[var(--ember-fg)] cursor-pointer"
              >
                {locale === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In or Create Account'}
              </button>
            </div>
          ) : isOwnStore ? (
            <div className="border border-[var(--line)] bg-[var(--graphite)] p-4 text-xs text-[var(--muted)]">
              {locale === 'ar'
                ? 'أنت صاحب هذا المتجر. يمكنك الرد على رسائل العملاء من لوحة البائع → الرسائل.'
                : 'This is your storefront. Reply to customer inquiries from Seller Hub → Messages.'}
            </div>
          ) : loading ? (
            <p className="text-xs text-[var(--muted)] font-mono-tabular">
              {locale === 'ar' ? 'جارٍ تحميل المحادثة...' : 'Loading conversation...'}
            </p>
          ) : messages.length === 0 ? (
            <div className="border border-[var(--line)] bg-[var(--graphite)] p-4 text-xs text-[var(--muted)]">
              {locale === 'ar'
                ? `ابدأ محادثة مع ${seller.name.ar} للاستفسار عن المقاسات أو التوافر أو التوصيل.`
                : `Start a direct system chat with ${seller.name.en} about sizing, stock, or delivery.`}
            </div>
          ) : (
            messages.map((m) => {
              const isCustomer = m.senderRole === 'customer';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 text-xs border ${
                      isCustomer
                        ? 'border-[var(--ember)] bg-[var(--ember)]/15 text-[var(--bone)]'
                        : 'border-[var(--line)] bg-[var(--graphite)] text-[var(--bone)]'
                    }`}
                  >
                    <p className="whitespace-pre-line break-words">{m.body}</p>
                    <p className="mt-1 text-[10px] font-mono-tabular text-[var(--muted)]">
                      {isCustomer
                        ? locale === 'ar'
                          ? 'أنت'
                          : 'You'
                        : seller.name[locale]}{' '}
                      · {new Date(m.createdAt.replace(' ', 'T') + (m.createdAt.includes('Z') ? '' : 'Z')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={listEndRef} />
        </div>

        {authUser && !isOwnStore && (
          <form onSubmit={handleSend} className="p-3 border-t border-[var(--line)] bg-[var(--graphite)] flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={locale === 'ar' ? 'اكتب رسالتك لصاحب المتجر...' : 'Write your message to the store owner...'}
              maxLength={2000}
              className="flex-1 bg-[var(--ink)] border border-[var(--line)] px-3 py-2 text-xs text-[var(--bone)] focus:outline-none focus:border-[var(--ember)]"
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              className="px-4 py-2 text-xs font-semibold bg-[var(--ember)] text-[var(--ember-fg)] inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{locale === 'ar' ? 'إرسال' : 'Send'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
