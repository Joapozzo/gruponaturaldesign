/**
 * Componente atomizado para las acciones del producto (carrito, cantidad, bordado)
 */

'use client';

import React from 'react';
import BordadoSwitch from './BordadoSwitch';
import type { VariantePublicada } from '@/app/types/producto-publicado.types';

interface ProductCardActionsProps {
  selectedVariant: VariantePublicada | null;
  cartQuantity: number;
  bordado: boolean;
  isAddingToCart: boolean;
  canActivateBordado: boolean;
  itemsNeeded: number;
  onAddToCart: () => void;
  onQuantityChange: (quantity: number) => void;
  onBordadoChange: (value: boolean) => void;
  showSelectors?: boolean;
  onCloseSelectors?: () => void;
  selectedColor: string | null;
  selectedTalle: string | null;
  availableColors: string[];
  availableTalles: string[];
  hasExplicitSelection?: boolean;
}

export const ProductCardActions: React.FC<ProductCardActionsProps> = ({
  selectedVariant,
  cartQuantity,
  bordado,
  isAddingToCart,
  canActivateBordado,
  onAddToCart,
  onQuantityChange,
  onBordadoChange,
  showSelectors = false,
  onCloseSelectors,
  selectedColor,
  selectedTalle,
  availableColors,
  availableTalles,
  hasExplicitSelection = false,
}) => {
  if (!selectedVariant) {
    return null;
  }

  // Determinar el texto del botón según el estado
  const getButtonText = () => {
    if (isAddingToCart) {
      return 'Agregando...';
    }
    
    if (!showSelectors) {
      return 'Agregar al carrito';
    }

    // Si hay múltiples colores y no se hizo selección explícita
    if (availableColors.length > 1 && !hasExplicitSelection) {
      return 'Seleccione un color';
    }

    // Si hay múltiples talles y no se hizo selección explícita (y ya se seleccionó color)
    if (availableTalles.length > 1 && hasExplicitSelection && selectedColor && !selectedTalle) {
      return 'Seleccione un talle';
    }

    // Si hay múltiples talles y no se hizo selección explícita
    if (availableTalles.length > 1 && !hasExplicitSelection) {
      return 'Seleccione un talle';
    }

    // Todo listo para confirmar
    return 'Confirmar';
  };

  // Determinar si el botón está deshabilitado
  const isButtonDisabled = () => {
    if (selectedVariant.stock === 0 || isAddingToCart) {
      return true;
    }

    if (showSelectors) {
      // Si hay múltiples colores y no se hizo selección explícita
      if (availableColors.length > 1 && !hasExplicitSelection) {
        return true;
      }
      // Si hay múltiples talles y no se hizo selección explícita
      if (availableTalles.length > 1 && !hasExplicitSelection) {
        return true;
      }
    }

    return false;
  };

  return (
    <>
      {/* Bordado switch (solo si hay 5+ items en carrito) */}
      {canActivateBordado && (
        <div className="mb-3">
          <BordadoSwitch
            value={bordado}
            onChange={onBordadoChange}
          />
        </div>
      )}

      {/* Controles de cantidad y agregar al carrito */}
      <div className="mt-2">
        {cartQuantity > 0 ? (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onQuantityChange(Math.max(0, cartQuantity - 1))}
              disabled={isAddingToCart}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
            >
              <span className="text-sm">−</span>
            </button>
            <span className="w-8 text-center font-medium">{cartQuantity}</span>
            <button
              onClick={() => onQuantityChange(Math.min(selectedVariant.stock, cartQuantity + 1))}
              disabled={isAddingToCart || cartQuantity >= selectedVariant.stock}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
            >
              <span className="text-sm">+</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {showSelectors && onCloseSelectors && (
              <button
                onClick={onCloseSelectors}
                className="w-full text-xs text-gray-500 hover:text-gray-700 mb-2 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={onAddToCart}
              disabled={isButtonDisabled()}
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {getButtonText()}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

