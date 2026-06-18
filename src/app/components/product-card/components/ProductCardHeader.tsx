/**
 * Componente atomizado para el header del producto (nombre y precio)
 */

'use client';

import React from 'react';
import { ProductPriceBlock } from '@/app/components/precio/ProductPriceBlock';
import { usePrecioPublico } from '@/app/hooks/usePrecioPublico';
import type { InstallmentQuote } from '@/app/types/precio.types';

interface ProductCardHeaderProps {
  nombre: string;
  precioLista: number | null;
  precioTransfer?: number | null;
  precioSinImp?: number | null;
  precio3Cuotas?: number | null;
  cuotas?: InstallmentQuote | null;
  onClick?: () => void;
}

export const ProductCardHeader: React.FC<ProductCardHeaderProps> = ({
  nombre,
  precioLista,
  precioTransfer,
  precioSinImp,
  precio3Cuotas,
  cuotas,
  onClick,
}) => {
  const { precio, descuentoTransferPct } = usePrecioPublico({
    precioLista,
    precioTransfer,
    precioSinImp,
    precio3Cuotas,
    cuotas,
  });

  return (
    <div className="mb-2 min-h-[7rem]">
      <h3
        className="text-sm text-gray-800 cursor-pointer hover:text-gray-900 transition-colors line-clamp-2 min-h-[2.5rem]"
        onClick={onClick}
      >
        {nombre}
      </h3>

      <div className="mt-1">
        {precio.precioLista != null ? (
          <ProductPriceBlock
            precio={precio}
            descuentoTransferPct={descuentoTransferPct}
            variant="card"
          />
        ) : (
          <span className="text-base font-semibold text-gray-900">&nbsp;</span>
        )}
      </div>
    </div>
  );
};
