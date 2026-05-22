'use client';

import { useCallback, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import type { ApiError } from '@/lib/types/api.types';

export const NEWSLETTER_ALREADY_SUBSCRIBED_MESSAGE =
  'Ya estás suscripto a nuestro newsletter.';

type SubscribeState = 'idle' | 'loading' | 'success' | 'error' | 'already_subscribed';

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (e && typeof e === 'object' && 'message' in e) {
    return String((e as { message?: unknown }).message);
  }
  return 'Error al suscribirse.';
}

function isAlreadySubscribedError(e: unknown): boolean {
  if (!e || typeof e !== 'object') return false;
  const err = e as ApiError & { alreadySubscribed?: boolean };
  if (err.alreadySubscribed === true) return true;
  if (err.status === 409) {
    const msg = (err.message ?? '').toLowerCase();
    return msg.includes('ya estás suscripto') || msg.includes('ya estas suscripto');
  }
  return false;
}

export function useNewsletterSubscribe() {
  const [state, setState] = useState<SubscribeState>('idle');
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Ingresá un email válido.');
      setState('error');
      setTimeout(() => setState('idle'), 3000);
      return;
    }

    setState('loading');
    setError(null);

    try {
      const res = await apiClient.post<{ email?: string }>(
        '/newsletter/subscribe',
        { email },
        { skipAuth: true }
      );
      if (res.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('newsletter_subscribed', 'true');
        }
        setState('success');
        setTimeout(() => setState('idle'), 3000);
      } else {
        setError(res.message || res.error || 'Error al suscribirse.');
        setState('error');
        setTimeout(() => setState('idle'), 3000);
      }
    } catch (e) {
      if (isAlreadySubscribedError(e)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('newsletter_subscribed', 'true');
        }
        setError(getErrorMessage(e) || NEWSLETTER_ALREADY_SUBSCRIBED_MESSAGE);
        setState('already_subscribed');
        setTimeout(() => setState('idle'), 4000);
        return;
      }
      setError(getErrorMessage(e));
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  }, []);

  return { subscribe, state, error };
}
