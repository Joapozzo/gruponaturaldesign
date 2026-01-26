'use client';

import React, { useMemo } from 'react';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import VariantSelector from './VariantSelector';
import type { VariantePublicada } from '@/app/types/producto-publicado.types';
import type { ProductVariant } from '@/app/types/producto';

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
  onVariantChange,
}) => {
  // Mapear VariantePublicada a ProductVariant para VariantSelector
  const mappedVariants: ProductVariant[] = useMemo(() => {
    return variants.map((v, index) => ({
      codigo: v.codigo,
      variantNumber: index + 1,
      color: v.color || undefined,
      talle: v.talle || undefined,
      stock: v.stock,
      // Crear un objeto mínimo para producto (no se usa en VariantSelector pero es requerido)
      producto: {
        Codigo: v.codigo,
        Descripcion: '',
      } as ProductVariant['producto'],
    }));
  }, [variants]);

  // Encontrar la variante seleccionada
  const selectedVariantData = useMemo(() => {
    return variants.find(
      (v) => v.color === selectedColor && v.talle === selectedTalle
    );
  }, [variants, selectedColor, selectedTalle]);

  // Crear el objeto selectedVariant para VariantSelector
  const selectedVariant: ProductVariant = useMemo(() => {
    if (selectedVariantData) {
      return {
        codigo: selectedVariantData.codigo,
        variantNumber: variants.findIndex((v) => v.codigo === selectedVariantData.codigo) + 1,
        color: selectedVariantData.color || undefined,
        talle: selectedVariantData.talle || undefined,
        stock: selectedVariantData.stock,
        producto: {
          Codigo: selectedVariantData.codigo,
          Descripcion: '',
        } as ProductVariant['producto'],
      };
    }
    return mappedVariants[0] || {
      codigo: '',
      variantNumber: 1,
      producto: { Codigo: '', Descripcion: '' } as ProductVariant['producto'],
    };
  }, [selectedVariantData, variants, mappedVariants]);

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

      {/* Selector de variante (fallback) */}
      {variants.length > 1 && (
        <VariantSelector
          variants={mappedVariants}
          selectedVariant={selectedVariant}
          isExpanded={true}
          onVariantSelect={(variant, e) => {
            e?.stopPropagation();
            onVariantChange(variant.codigo);
          }}
          onToggleExpand={(e) => {
            e?.stopPropagation();
            // No hacer nada, siempre expandido
          }}
        />
      )}
    </div>
  );
};

