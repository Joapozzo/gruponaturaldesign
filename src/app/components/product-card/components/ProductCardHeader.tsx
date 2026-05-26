/**
 * Componente atomizado para el header del producto (nombre y precio)
 * Precios vienen de la API (tabla precios/productoPrecio); no se tacha ninguno.
 */

'use client';

import React from 'react';
import { formatPrice } from '@/app/utils/productHelpers';

interface ProductCardHeaderProps {
  nombre: string;
  precioLista: number | null;
  precioTransfer: number | null;
  precioSinImp: number | null;
  onClick?: () => void;
}

export const ProductCardHeader: React.FC<ProductCardHeaderProps> = ({
  nombre,
  precioLista,
  precioTransfer,
  precioSinImp,
  onClick,
}) => {
  return (
    <div className="mb-2">
      {/* Precios: lista y transfer sin tachado (ya calculados en API) */}
      <div className="mb-1">
        {precioLista != null && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              <span className="md:hidden">Precio</span>
              <span className="hidden md:inline">Precio lista:</span>
            </span>
            <span className="text-base font-semibold text-gray-900">
              {formatPrice(precioLista)}
            </span>
          </div>
        )}
        {precioTransfer != null && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              <span className="md:hidden">Transfer</span>
              <span className="hidden md:inline">Precio transfer:</span>
            </span>
            <span className="text-sm text-gray-600">
              {formatPrice(precioTransfer)}
            </span>
          </div>
        )}
      </div>

      {/* Precio sin impuestos */}
      {precioSinImp != null && (
        <div className="text-[10px] text-gray-400 mt-1">
          Precios sin impuestos nacionales: {formatPrice(precioSinImp)}
        </div>
      )}

      {/* Nombre */}
      <h3
        className="text-sm text-gray-800 mt-4 cursor-pointer hover:text-gray-900 transition-colors"
        onClick={onClick}
      >
        {nombre}
      </h3>
    </div>
  );
};

