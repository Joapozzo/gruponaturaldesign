'use client';

import { useState, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export interface UseApiMutationOptions<TBody, TResponse> {
  url: string;
  method?: 'POST' | 'GET' | 'PATCH';
  onSuccess?: (data: TResponse) => void;
  onError?: (message: string) => void;
}

export interface UseApiMutationResult<TBody, TResponse> {
  mutate: (body: TBody) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  data: TResponse | null;
  reset: () => void;
}

export function useApiMutation<TBody extends object, TResponse = unknown>({
  url,
  method = 'POST',
  onSuccess,
  onError,
}: UseApiMutationOptions<TBody, TResponse>): UseApiMutationResult<TBody, TResponse> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TResponse | null>(null);

  const mutate = useCallback(
    async (body: TBody) => {
      setIsLoading(true);
      setError(null);
      try {
        const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
        const res = await fetch(fullUrl, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: method !== 'GET' ? JSON.stringify(body) : undefined,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = (json as { error?: string }).error ?? res.statusText ?? 'Error en la solicitud';
          setError(msg);
          onError?.(msg);
          return;
        }
        setData(json as TResponse);
        onSuccess?.(json as TResponse);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Error de conexión';
        setError(msg);
        onError?.(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [url, method, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setError(null);
    setData(null);
  }, []);

  return { mutate, isLoading, error, data, reset };
}
