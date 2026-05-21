'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getPrecioConfig } from '@/app/services/empresaConfig.service';
import { getDatosBancarios } from '@/app/services/empresaDatosBancarios.service';
import { configuracionKeys } from './configuracionQueryKeys';
import { CONFIGURACION_GC_MS, CONFIGURACION_STALE_MS } from './usePrecioConfigQuery';

export function usePrefetchConfiguracion() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const opts = { staleTime: CONFIGURACION_STALE_MS, gcTime: CONFIGURACION_GC_MS };
    void queryClient.prefetchQuery({
      queryKey: configuracionKeys.precios,
      queryFn: getPrecioConfig,
      ...opts,
    });
    void queryClient.prefetchQuery({
      queryKey: configuracionKeys.datosBancarios,
      queryFn: getDatosBancarios,
      ...opts,
    });
  }, [queryClient]);
}
