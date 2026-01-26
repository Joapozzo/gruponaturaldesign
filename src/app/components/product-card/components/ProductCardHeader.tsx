/**
 * Componente atomizado para el header del producto (nombre y precio)
 */

'use client';

import React from 'react';

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
  // Calcular descuento si hay precioTransfer menor
  const tieneDescuento = precioTransfer && precioLista && precioTransfer < precioLista;
  const descuento = tieneDescuento && precioLista
    ? Math.round(((precioLista - precioTransfer) / precioLista) * 100)
    : null;

  return (
    <div className="mb-2">
      {/* Precios arriba del nombre: precioLista - precioTransfer */}
      <div className="mb-1">
        {precioLista && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Precio lista:</span>
            <span className="text-base font-semibold text-gray-900">
              ${precioLista.toLocaleString()}
            </span>
          </div>
        )}
        {precioTransfer && precioTransfer !== precioLista && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Precio transfer:</span>
            <span className={`text-sm ${tieneDescuento ? 'text-gray-500 line-through' : 'text-gray-600'}`}>
              ${precioTransfer.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Precio sin impuestos (abajo del nombre, gris chiquitito) */}
      {precioSinImp && (
        <div className="text-[10px] text-gray-400 mt-1">
          Precios sin impuestos nacionales: ${Math.round(precioSinImp).toLocaleString()}
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

