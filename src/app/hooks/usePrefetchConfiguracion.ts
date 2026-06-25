'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getPrecioConfig } from '@/app/services/empresaConfig.service';
import { getDatosBancarios } from '@/app/services/empresaDatosBancarios.service';
import { getEnvioConfig } from '@/app/services/envioConfig.service';
import { getTiendaConfigAdmin } from '@/app/services/tiendaConfig.service';
import { getIntegrationsStatus } from '@/app/services/integrations.service';
import { configuracionKeys } from './configuracionQueryKeys';
import { CONFIGURACION_GC_MS, CONFIGURACION_STALE_MS } from './usePrecioConfigQuery';
import { INTEGRACIONES_GC_MS, INTEGRACIONES_STALE_MS } from './useIntegrationsStatusQuery';

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
    void queryClient.prefetchQuery({
      queryKey: configuracionKeys.envio,
      queryFn: getEnvioConfig,
      ...opts,
    });
    void queryClient.prefetchQuery({
      queryKey: configuracionKeys.tiendaConfig,
      queryFn: getTiendaConfigAdmin,
      ...opts,
    });
    void queryClient.prefetchQuery({
      queryKey: configuracionKeys.integraciones,
      queryFn: getIntegrationsStatus,
      staleTime: INTEGRACIONES_STALE_MS,
      gcTime: INTEGRACIONES_GC_MS,
    });
  }, [queryClient]);
}
