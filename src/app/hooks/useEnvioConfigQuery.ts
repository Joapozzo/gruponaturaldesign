'use client';

import { useQuery } from '@tanstack/react-query';
import { getEnvioConfig } from '@/app/services/envioConfig.service';
import { configuracionKeys } from './configuracionQueryKeys';
import { CONFIGURACION_GC_MS, CONFIGURACION_STALE_MS } from './usePrecioConfigQuery';

export function useEnvioConfigQuery() {
  return useQuery({
    queryKey: configuracionKeys.envio,
    queryFn: getEnvioConfig,
    staleTime: CONFIGURACION_STALE_MS,
    gcTime: CONFIGURACION_GC_MS,
  });
}
