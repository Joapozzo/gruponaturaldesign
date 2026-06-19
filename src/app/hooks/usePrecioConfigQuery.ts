'use client';

import { useQuery } from '@tanstack/react-query';
import { getPrecioConfig } from '@/app/services/empresaConfig.service';
import { configuracionKeys } from './configuracionQueryKeys';

const STALE_MS = 5 * 60 * 1000;
const GC_MS = 10 * 60 * 1000;

export function usePrecioConfigQuery() {
  return useQuery({
    queryKey: configuracionKeys.precios,
    queryFn: getPrecioConfig,
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}

export { STALE_MS as CONFIGURACION_STALE_MS, GC_MS as CONFIGURACION_GC_MS };
