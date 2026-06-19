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
  if (availableColors.length <= 1 && availableTalles.length <= 1) {
    return null;
  }

  return (
    <div className="overflow-visible">
      {availableColors.length > 1 && (
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

      {availableTalles.length > 1 && (
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

