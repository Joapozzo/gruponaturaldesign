import type { SessionUserState } from '@/types/auth.types';

/** Query param used across login → verify-email → onboarding → destination */
export const AUTH_CALLBACK_PARAM = 'callbackUrl';

export const AUTH_CALLBACK_STORAGE_KEY = 'auth_callback_url';

/**
 * Same-origin relative path only (blocks open redirects).
 */
export function getSafeCallbackPath(raw: string | null | undefined, fallback = '/'): string {
  if (raw == null || typeof raw !== 'string') return fallback;
  const s = raw.trim();
  if (!s) return fallback;
  if (s.length > 2048) return fallback;
  if (!s.startsWith('/') || s.startsWith('//')) return fallback;
  if (/[\r\n\0]/.test(s)) return fallback;
  if (s.includes('\\')) return fallback;
  if (s.includes('://')) return fallback;
  const pathPart = s.split('?')[0];
  if (pathPart.includes('//')) return fallback;
  return s;
}

export function persistAuthCallback(raw: string | null | undefined): void {
  if (typeof window === 'undefined') return;
  const safe = getSafeCallbackPath(raw, '');
  if (safe && safe !== '/') {
    sessionStorage.setItem(AUTH_CALLBACK_STORAGE_KEY, safe);
  }
}

export function readPersistedAuthCallback(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(AUTH_CALLBACK_STORAGE_KEY);
  if (!raw) return null;
  const safe = getSafeCallbackPath(raw, '');
  return safe && safe !== '/' ? safe : null;
}

export function clearPersistedAuthCallback(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(AUTH_CALLBACK_STORAGE_KEY);
}

/** Query param → sessionStorage → fallback (default `/`). Persists non-home paths. */
export function resolveAuthCallbackPath(
  rawFromUrl: string | null | undefined,
  fallback = '/',
): string {
  if (rawFromUrl != null && rawFromUrl !== '') {
    const fromUrl = getSafeCallbackPath(rawFromUrl, '');
    if (fromUrl && fromUrl !== '/') {
      persistAuthCallback(fromUrl);
      return fromUrl;
    }
  }
  const persisted = readPersistedAuthCallback();
  if (persisted) return persisted;
  return getSafeCallbackPath(null, fallback);
}

/** Adds ?callbackUrl= only when the destination is not the default home. */
export function withAuthCallback(pathname: string, rawCallback: string | null | undefined): string {
  const safe = getSafeCallbackPath(rawCallback);
  if (safe === '/') return pathname;
  persistAuthCallback(safe);
  const u = new URL(pathname, 'http://local');
  u.searchParams.set(AUTH_CALLBACK_PARAM, safe);
  return u.pathname + u.search;
}

/** After auth is complete: admins default to dashboard when no specific path was requested. */
export function resolvePostLoginDestination(
  role: string | undefined | null,
  callbackUrl: string,
): string {
  const safe = getSafeCallbackPath(callbackUrl);
  if (role === 'ADMIN' && (safe === '/' || !safe.trim())) {
    return '/admin/dashboard';
  }
  return safe || '/';
}

/** Hard navigation through verify → onboarding → final destination (preserves callback). */
export function redirectAfterAuth(state: SessionUserState, callbackUrl: string): void {
  if (state.needsEmailVerification) {
    window.location.href = withAuthCallback('/auth/verify-email', callbackUrl);
    return;
  }
  if (state.needsOnboarding) {
    window.location.href = withAuthCallback('/auth/onboarding', callbackUrl);
    return;
  }
  clearPersistedAuthCallback();
  window.location.href = resolvePostLoginDestination(state.role, callbackUrl);
}

/** Login URL for 401 / session expiry; preserves current path or stored callback. */
export function buildAuthLoginUrl(options?: { reason?: string }): string {
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
  const callbackUrl = resolveAuthCallbackPath(null, getSafeCallbackPath(pathname));
  persistAuthCallback(callbackUrl);

  const u = new URL('/auth/login', 'http://local');
  if (options?.reason) {
    u.searchParams.set('reason', options.reason);
  }
  if (callbackUrl !== '/') {
    u.searchParams.set(AUTH_CALLBACK_PARAM, callbackUrl);
  }
  return u.pathname + u.search;
}
