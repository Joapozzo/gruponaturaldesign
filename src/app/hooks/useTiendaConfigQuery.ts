'use client';

import { useQuery } from '@tanstack/react-query';
import { getTiendaConfigAdmin } from '@/app/services/tiendaConfig.service';
import { configuracionKeys } from './configuracionQueryKeys';
import { CONFIGURACION_GC_MS, CONFIGURACION_STALE_MS } from './usePrecioConfigQuery';

export function useTiendaConfigQuery() {
  return useQuery({
    queryKey: configuracionKeys.tiendaConfig,
    queryFn: getTiendaConfigAdmin,
    staleTime: CONFIGURACION_STALE_MS,
    gcTime: CONFIGURACION_GC_MS,
  });
}
