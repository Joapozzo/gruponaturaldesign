/**
 * Componente atomizado para el header del producto (nombre y precio)
 */

'use client';

import React from 'react';
import { formatPrice } from '@/app/utils/productHelpers';

interface ProductCardHeaderProps {
  nombre: string;
  precioLista: number | null;
  onClick?: () => void;
}

export const ProductCardHeader: React.FC<ProductCardHeaderProps> = ({
  nombre,
  precioLista,
  onClick,
}) => {
  return (
    <div className="mb-2 min-h-[4.25rem]">
      <h3
        className="text-sm text-gray-800 cursor-pointer hover:text-gray-900 transition-colors line-clamp-2 min-h-[2.5rem]"
        onClick={onClick}
      >
        {nombre}
      </h3>

      <p className="text-base font-semibold text-gray-900 mt-1 min-h-[1.5rem]">
        {precioLista != null ? formatPrice(precioLista) : '\u00A0'}
      </p>
    </div>
  );
};
