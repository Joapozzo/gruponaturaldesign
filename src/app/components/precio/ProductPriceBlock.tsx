'use client';

import React from 'react';
import { formatPrice } from '@/app/utils/productHelpers';
import {
  formatCuotasLine,
  formatFinancingLegalFooter,
  formatCuotasEstimadoHint,
} from '@/app/utils/precioDisplay';
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

  const cuotasSize = isCompact ? 'text-[10px]' : isCard ? 'text-[10px]' : 'text-sm';
  const sinImpSize = isCompact ? 'text-[9px]' : isCard ? 'text-[9px]' : 'text-[10px]';

  const formattedLista =
    precio.precioLista != null ? formatPrice(precio.precioLista) : null;
  const formattedTransfer =
    precio.precioTransfer != null ? formatPrice(precio.precioTransfer) : null;
  const legalFooter = precio.cuotas ? formatFinancingLegalFooter(precio.cuotas) : null;
  const estimadoHint = precio.cuotas ? formatCuotasEstimadoHint(precio.cuotas) : null;

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

      {precio.cuotas && (
        <p className={cn('text-neutral-600 leading-snug', cuotasSize)}>
          {isCompact ? (
            <>
              {precio.cuotas.cuotas}{' '}
              {precio.cuotas.cuotas === 1 ? 'cuota' : 'cuotas'} de{' '}
              {formatPrice(precio.cuotas.montoCuota)}
              {estimadoHint ? (
                <span className="text-neutral-400"> · {estimadoHint}</span>
              ) : null}
            </>
          ) : (
            <>
              o {formatCuotasLine(precio.cuotas)}
              {estimadoHint ? (
                <span className="text-neutral-400"> ({estimadoHint.toLowerCase()})</span>
              ) : null}
            </>
          )}
        </p>
      )}

      {legalFooter && (variant === 'detail' || variant === 'card') && (
        <p className="text-[9px] sm:text-[10px] text-neutral-400 leading-snug">{legalFooter}</p>
      )}

      {showSinImp && precio.precioSinImp != null && (
        <p className={cn('leading-snug text-neutral-400', sinImpSize)}>
          Sin impuestos nacionales: {formatPrice(precio.precioSinImp)}.
        </p>
      )}
    </div>
  );
}
