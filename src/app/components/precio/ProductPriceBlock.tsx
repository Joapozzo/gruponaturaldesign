'use client';

import React from 'react';
import { formatPrice } from '@/app/utils/productHelpers';
import { buildHastaCuotasConMpLabel } from '@/app/utils/precioDisplay';
import { usePrecioConfigPublic } from '@/app/hooks/usePrecioConfigPublic';
import type { PrecioPublico } from '@/app/types/precio.types';
import { cn } from '@/lib/utils';

export type ProductPriceBlockVariant = 'card' | 'detail' | 'compact';

export interface ProductPriceBlockProps {
  precio: PrecioPublico;
  descuentoTransferPct?: number;
  variant?: ProductPriceBlockVariant;
  showSinImp?: boolean;
  className?: string;
}

export function ProductPriceBlock({
  precio,
  descuentoTransferPct = 15,
  variant = 'detail',
  showSinImp = true,
  className,
}: ProductPriceBlockProps) {
  const isCard = variant === 'card';
  const isCompact = variant === 'compact';
  const isDetail = variant === 'detail';
  const { data: precioConfig } = usePrecioConfigPublic();
  const cuotasFinanciado = precioConfig?.cuotasFinanciado ?? 3;

  const listaSize = isCompact
    ? 'text-sm font-bold'
    : isCard
      ? 'text-base font-semibold'
      : 'text-2xl sm:text-3xl font-bold';

  const transferSize = isCompact
    ? 'text-sm font-bold'
    : isCard
      ? 'text-sm font-bold'
      : 'text-xl sm:text-2xl font-bold';

  const sinImpSize = isCompact ? 'text-[9px]' : isCard ? 'text-[9px]' : 'text-[10px]';

  const formattedLista =
    precio.precioLista != null ? formatPrice(precio.precioLista) : null;
  const formattedTransfer =
    precio.precioTransfer != null ? formatPrice(precio.precioTransfer) : null;

  return (
    <div className={cn('flex flex-col', isCard ? 'gap-0.5' : 'gap-1 sm:gap-1.5', className)}>
      {formattedLista && (
        <span className={cn('tabular-nums text-neutral-900', listaSize)}>
          {formattedLista}
        </span>
      )}

      {formattedTransfer && (
        <div className={cn('flex flex-col min-w-0', isCard ? 'gap-0' : 'gap-0.5')}>
          <span className={cn('tabular-nums text-[var(--red)]', transferSize)}>
            {formattedTransfer}
          </span>
          {!isCompact && (
            <span className="text-[10px] sm:text-xs text-neutral-500 leading-snug">
              Ahorrá un {descuentoTransferPct}% con transferencia
            </span>
          )}
        </div>
      )}

      {isDetail && (
        <p className="text-sm text-neutral-600 leading-snug">
          {buildHastaCuotasConMpLabel(cuotasFinanciado)}
        </p>
      )}

      {showSinImp && precio.precioSinImp != null && (
        <p className={cn('leading-snug text-neutral-400', sinImpSize)}>
          Sin impuestos nacionales: {formatPrice(precio.precioSinImp)}.
        </p>
      )}
    </div>
  );
}
