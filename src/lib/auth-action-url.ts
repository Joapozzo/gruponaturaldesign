import type { ActionCodeSettings } from 'firebase/auth';

/** URL de /auth/action para enlaces de verificación y reset (Firebase Auth). */
export function getAuthActionUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/action`;
  }
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (explicit) return `${explicit}/auth/action`;
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel}/auth/action`;
  return 'http://localhost:3002/auth/action';
}

export function getEmailActionCodeSettings(): ActionCodeSettings {
  return {
    url: getAuthActionUrl(),
    handleCodeInApp: true,
  };
}
