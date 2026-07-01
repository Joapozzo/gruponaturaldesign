'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTiendaConfigPublic } from '@/app/services/tiendaConfig.service';
import { DEFAULT_TIENDA_CONFIG_PUBLIC } from '@/app/utils/checkoutPaymentCopy';

const TIENDA_CONFIG_PUBLIC_KEY = ['tiendaConfigPublic'] as const;
const STALE_MS = 5 * 60 * 1000;

export function useTiendaConfig() {
  const query = useQuery({
    queryKey: TIENDA_CONFIG_PUBLIC_KEY,
    queryFn: fetchTiendaConfigPublic,
    staleTime: STALE_MS,
    gcTime: STALE_MS * 2,
  });

  return useMemo(
    () => ({
      ...DEFAULT_TIENDA_CONFIG_PUBLIC,
      ...query.data,
      isLoading: query.isLoading,
    }),
    [query.data, query.isLoading]
  );
}
