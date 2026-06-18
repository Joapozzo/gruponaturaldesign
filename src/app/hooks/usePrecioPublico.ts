'use client';

import { useMemo } from 'react';
import {
  buildPrecioPublicoFromLegacy,
  type PrecioPublico,
} from '@/app/types/precio.types';
import { usePrecioConfigPublic } from '@/app/hooks/usePrecioConfigPublic';

export interface UsePrecioPublicoInput {
  precioLista?: number | null;
  precioTransfer?: number | null;
  precioSinImp?: number | null;
  precio3Cuotas?: number | null;
  precio3cuotas?: number | null;
  precioSImp?: number | null;
  cuotas?: PrecioPublico['cuotas'];
}

export function usePrecioPublico(input: UsePrecioPublicoInput): {
  precio: PrecioPublico;
  descuentoTransferPct: number;
} {
  const { data: precioConfig } = usePrecioConfigPublic();
  const descuentoTransferPct = Math.round(
    (precioConfig?.descuentoTransferencia ?? 0.15) * 100
  );

  const precio = useMemo(
    () =>
      buildPrecioPublicoFromLegacy({
        precioLista: input.precioLista,
        precioTransfer: input.precioTransfer,
        precioSinImp: input.precioSinImp,
        precio3Cuotas: input.precio3Cuotas,
        precio3cuotas: input.precio3cuotas,
        precioSImp: input.precioSImp,
        cuotas: input.cuotas,
        cuotasFinanciado: precioConfig?.cuotasFinanciado,
      }),
    [
      input.precioLista,
      input.precioTransfer,
      input.precioSinImp,
      input.precio3Cuotas,
      input.precio3cuotas,
      input.precioSImp,
      input.cuotas,
      precioConfig?.cuotasFinanciado,
    ]
  );

  return { precio, descuentoTransferPct };
}
