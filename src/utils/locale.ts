export const DEFAULT_LOCALE = 'ja';
export const SUPPORTED_LOCALES = ['ja', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  return !!value && (value === 'ja' || value === 'en');
}

export function normalizeLocale(value: string | null | undefined): SupportedLocale {
  if (isSupportedLocale(value)) {
    return value;
  }

  if (value === 'us') {
    return 'en';
  }

  return DEFAULT_LOCALE;
}

export function getLocaleFromPath(pathname: string): SupportedLocale | null {
  const [firstSegment] = pathname.split('/').filter(Boolean);
  return isSupportedLocale(firstSegment) ? firstSegment : null;
}

export function getLocaleFromQuery(search: string): SupportedLocale | null {
  const params = new URLSearchParams(search);
  const value = params.get('lang');
  return isSupportedLocale(value) ? value : null;
}

export function readStoredLocale(): SupportedLocale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const storedValue = window.localStorage.getItem('app-locale');
  return normalizeLocale(storedValue);
}

export function writeStoredLocale(locale: SupportedLocale): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem('app-locale', locale);
}

export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const [firstSegment] = segments;

  if (isSupportedLocale(firstSegment)) {
    segments.shift();
  }

  return segments.length > 0 ? `/${segments.join('/')}` : '/';
}

export function buildPathWithLocale(locale: SupportedLocale, pathname: string): string {
  const strippedPath = stripLocalePrefix(pathname);
  return strippedPath === '/' ? `/${locale}` : `/${locale}${strippedPath}`;
}
