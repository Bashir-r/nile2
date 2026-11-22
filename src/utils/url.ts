export function isSafeNavUrl(raw: string | null | undefined, allowRelative = true): boolean {
  const v = (raw || '').trim();
  if (!v || /[\u0000-\u001F\u007F]/.test(v)) return false;
  if (v.startsWith('//')) return false;
  if (allowRelative && v.startsWith('/')) return true;
  try {
    const parsed = new URL(v);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function toSafeHref(raw: string | null | undefined, fallback = '/catalog'): string {
  const v = (raw || '').trim();
  return isSafeNavUrl(v, true) ? v : fallback;
}

export function isSafeAssetUrl(raw: string | null | undefined): boolean {
  const v = (raw || '').trim();
  if (!v) return false;
  return isSafeNavUrl(v, true);
}

export function safeNavigateOrOpen(
  rawTarget: string | null | undefined,
  navigate: (to: string) => void,
  fallback = '/catalog'
): void {
  const target = toSafeHref(rawTarget, fallback);
  if (target.startsWith('http://') || target.startsWith('https://')) {
    try {
      const parsed = new URL(target);
      if (typeof window !== 'undefined' && parsed.origin === window.location.origin) {
        navigate(`${parsed.pathname}${parsed.search}${parsed.hash}`);
        return;
      }
    } catch {
      navigate(fallback);
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.assign(target);
    }
    return;
  }
  navigate(target);
}
