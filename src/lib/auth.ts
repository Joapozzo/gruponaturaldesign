import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { AUTH_COOKIE_NAME } from '@/lib/auth-config';

/**
 * Solo para Server Components y Route Handlers.
 * No importar desde código que se ejecute en el cliente (ej. apiClient).
 */

interface CookiePayload {
  uid?: string;
  role?: string;
  email?: string;
  usuarioId?: number;
  needsOnboarding?: boolean;
  needsEmailVerification?: boolean;
}

async function getPayloadFromCookie(): Promise<CookiePayload | null> {
  const secret = process.env.AUTH_COOKIE_SECRET || process.env.JWT_SECRET;
  if (!secret) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as CookiePayload;
  } catch {
    return null;
  }
}

/**
 * Roles del usuario actual (desde cookie JWT).
 */
export async function getRoles(): Promise<string[]> {
  const payload = await getPayloadFromCookie();
  const role = payload?.role;
  if (typeof role === 'string') return [role];
  return [];
}

/**
 * Sesión actual en servidor (desde cookie JWT).
 */
export async function getCurrentSession() {
  const payload = await getPayloadFromCookie();
  if (!payload?.uid) return null;
  return {
    userId: payload.usuarioId ?? null,
    uid: payload.uid,
    email: payload.email ?? null,
    name: payload.email ?? null,
    role: payload.role ?? null,
    empresaId: null,
  };
}
