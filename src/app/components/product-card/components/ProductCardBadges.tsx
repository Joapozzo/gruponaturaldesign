'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface ProductCardBadgesProps {
  destacado?: boolean;
  descuento?: number | null;
  /** overlay: cards. stack: columna bajo otro control (ej. botón expandir en galería). */
  layout?: 'overlay' | 'stack';
}

const badgeBase =
  'bg-black text-white font-bold uppercase tracking-wide shadow-md pointer-events-none';

const badgeRect = `${badgeBase} px-2.5 py-1 text-[10px] sm:text-xs rounded-none`;

export const ProductCardBadges: React.FC<ProductCardBadgesProps> = ({
  destacado = false,
  descuento = null,
  layout = 'overlay',
}) => {
  const showOff = descuento != null && descuento > 0;

  if (!destacado && !showOff) {
    return null;
  }

  const destacadoBadge = destacado ? (
    <div
      className={`flex items-center gap-1 ${badgeRect} font-semibold`}
      aria-label="Producto destacado"
    >
      <Star className="w-3 h-3 shrink-0 fill-white text-white" aria-hidden />
      <span>Destacado</span>
    </div>
  ) : null;

  const offBadge = showOff ? (
    <div className={badgeRect} aria-label={`${descuento}% de descuento`}>
      -{descuento}% OFF
    </div>
  ) : null;

  if (layout === 'stack') {
    return (
      <div className="flex flex-col items-end gap-1">
        {destacadoBadge}
        {offBadge}
      </div>
    );
  }

  return (
    <>
      {/* Mobile: todas abajo a la izquierda, apiladas */}
      <div className="absolute bottom-2 left-2 z-10 flex flex-col items-start gap-1 md:hidden">
        {destacadoBadge}
        {offBadge}
      </div>
      {/* Desktop: destacado arriba derecha, OFF abajo izquierda */}
      {destacadoBadge && (
        <div className="absolute top-2 right-2 z-10 hidden md:block">{destacadoBadge}</div>
      )}
      {offBadge && (
        <div className="absolute bottom-2 left-2 z-10 hidden md:block">{offBadge}</div>
      )}
    </>
  );
};
