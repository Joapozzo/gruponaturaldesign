'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { formatPrice } from '@/app/utils/productHelpers';

interface ProductCardBadgesProps {
  destacado?: boolean;
  descuento?: number | null; // Porcentaje de descuento
  precio3Cuotas?: number | null;
}

export const ProductCardBadges: React.FC<ProductCardBadgesProps> = ({
  destacado = false,
  descuento = null,
  precio3Cuotas = null,
}) => {
  return (
    <>
      {/* Badge DESTACADO - Estrellita arriba a la derecha */}
      {destacado && (
        <div className="absolute top-2 right-2 z-10">
          <div className="rounded-full p-1.5 shadow-lg" style={{ backgroundColor: 'var(--red)' }}>
            <Star className="w-3 h-3" style={{ color: 'var(--white)', fill: 'var(--white)' }} />
          </div>
        </div>
      )}

      {/* Badges alineados con el nombre, sobre la imagen (al final de la imagen donde empieza el contenido) */}
      <div className="absolute bottom-2 left-2 z-10 flex flex-col gap-1">
        {/* Badge descuento transfer - para que se entienda que es precio transfer */}
        {descuento && descuento > 0 && (
          <div className="px-2 py-1 rounded-md text-xs font-bold shadow-lg" style={{ backgroundColor: 'var(--red)', color: 'var(--white)' }}>
            -{descuento}% transfer
          </div>
        )}

        {/* Badge 3 Cuotas - Alineado con el nombre, sobre la imagen */}
        {precio3Cuotas && (
          <div className="px-2 py-1 rounded-md text-xs font-semibold shadow-lg" style={{ backgroundColor: 'var(--gray-medium)', color: 'var(--white)' }}>
            3x {formatPrice(precio3Cuotas)}
          </div>
        )}
      </div>
    </>
  );
};

