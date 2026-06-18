'use client';

import { useMemo } from 'react';
import { buildPrecioPublico, type PrecioPublico } from '@/app/types/precio.types';
import { usePrecioConfigPublic } from '@/app/hooks/usePrecioConfigPublic';

export interface UsePrecioPublicoInput {
  precioLista?: number | null;
  precioTransfer?: number | null;
  precioSinImp?: number | null;
  precioSImp?: number | null;
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
      buildPrecioPublico({
        precioLista: input.precioLista,
        precioTransfer: input.precioTransfer,
        precioSinImp: input.precioSinImp,
        precioSImp: input.precioSImp,
      }),
    [input.precioLista, input.precioTransfer, input.precioSinImp, input.precioSImp]
  );

  return { precio, descuentoTransferPct };
}
