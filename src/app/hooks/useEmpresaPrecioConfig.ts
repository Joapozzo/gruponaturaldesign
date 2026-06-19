'use client';

import { useQuery } from '@tanstack/react-query';
import { getPrecioConfig, type PrecioConfig } from '@/app/services/empresaConfig.service';
import { configuracionKeys } from './configuracionQueryKeys';
import { CONFIGURACION_GC_MS, CONFIGURACION_STALE_MS } from './usePrecioConfigQuery';

/** @deprecated Usar `configuracionKeys.precios` — alias para compatibilidad. */
export const empresaPrecioConfigKeys = {
  all: configuracionKeys.precios,
};

export function useEmpresaPrecioConfig() {
  return useQuery({
    queryKey: configuracionKeys.precios,
    queryFn: getPrecioConfig,
    staleTime: CONFIGURACION_STALE_MS,
    gcTime: CONFIGURACION_GC_MS,
  });
}

export function calcularPreciosDerivados(
  precioLista: number | null,
  config?: PrecioConfig | null
) {
  if (precioLista == null || precioLista <= 0) {
    return {
      precioTransfer: null,
      precioSinImp: null,
      cuotas: config?.cuotasFinanciado ?? 3,
    };
  }

  const descuento = config?.descuentoTransferencia ?? 0.15;
  const iva = config?.iva ?? 0.21;
  const cuotas = config?.cuotasFinanciado ?? 3;

  const precioTransfer = Number((precioLista * (1 - descuento)).toFixed(2));
  const precioSinImp = Number((precioTransfer / (1 + iva)).toFixed(2));

  return {
    precioTransfer,
    precioSinImp,
    cuotas,
  };
}
