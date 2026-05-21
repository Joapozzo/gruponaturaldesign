/** Query param used across login → verify-email → onboarding → destination */
export const AUTH_CALLBACK_PARAM = 'callbackUrl';

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

/** Adds ?callbackUrl= only when the destination is not the default home. */
export function withAuthCallback(pathname: string, rawCallback: string | null | undefined): string {
  const safe = getSafeCallbackPath(rawCallback);
  if (safe === '/') return pathname;
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
