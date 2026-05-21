'use client';

import { useCallback, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

type SubscribeState = 'idle' | 'loading' | 'success' | 'error';

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (e && typeof e === 'object' && 'message' in e) {
    return String((e as { message?: unknown }).message);
  }
  return 'Error al suscribirse.';
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
      const res = await apiClient.post('/newsletter/subscribe', { email }, { skipAuth: true });
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
      const msg = getErrorMessage(e);
      if (msg.toLowerCase().includes('409') || msg.toLowerCase().includes('ya')) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('newsletter_subscribed', 'true');
        }
        setState('success');
        setTimeout(() => setState('idle'), 3000);
      } else {
        setError(msg);
        setState('error');
        setTimeout(() => setState('idle'), 3000);
      }
    }
  }, []);

  return { subscribe, state, error };
}
