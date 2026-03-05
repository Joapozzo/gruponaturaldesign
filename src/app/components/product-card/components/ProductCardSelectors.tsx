'use client';

import React from 'react';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import type { VariantePublicada } from '@/app/types/producto-publicado.types';

interface ProductCardSelectorsProps {
  availableColors: string[];
  availableTalles: string[];
  selectedColor: string | null;
  selectedTalle: string | null;
  variants: VariantePublicada[];
  variantStock: Record<string, number>;
  onColorChange: (color: string) => void;
  onTalleChange: (talle: string) => void;
  onVariantChange: (codigo: string) => void;
}

export const ProductCardSelectors: React.FC<ProductCardSelectorsProps> = ({
  availableColors,
  availableTalles,
  selectedColor,
  selectedTalle,
  variants,
  onColorChange,
  onTalleChange,
}) => {
  if (variants.length <= 1) {
    return null;
  }

  return (
    <div className="overflow-visible">
      {/* Selector de color - Mostrar siempre si hay colores (incluso si es 1) */}
      {availableColors.length > 0 && (
        <ColorSelector
          colors={availableColors}
          variants={variants}
          selectedColor={selectedColor}
          isMobile={false}
          onColorSelect={(color, e) => {
            e?.stopPropagation();
            onColorChange(color);
          }}
        />
      )}

      {/* Selector de talle - Mostrar siempre si hay talles (incluso si es 1) */}
      {availableTalles.length > 0 && (
        <SizeSelector
          sizes={availableTalles}
          selectedSize={selectedTalle}
          isMobile={false}
          onSizeSelect={(size, e) => {
            e?.stopPropagation();
            onTalleChange(size);
          }}
        />
      )}
    </div>
  );
};

