/**
 * Hook para manejo de selección de color, talle y variante
 * Responsabilidad única: gestión del estado de selección
 */

import { useState, useMemo } from 'react';
import type { ProductoPublicado, VariantePublicada } from '@/app/types/producto-publicado.types';
import {
  findBestVariantePublicada,
  getDefaultVariantSelection,
} from '@/app/utils/variantePublicada.utils';

interface UseProductCardSelectionProps {
  producto: ProductoPublicado;
}

interface UseProductCardSelectionReturn {
  selectedColor: string | null;
  selectedTalle: string | null;
  selectedVariant: VariantePublicada | null;
  availableColors: string[];
  availableTalles: string[];
  setSelectedColor: (color: string) => void;
  setSelectedTalle: (talle: string) => void;
}

export function useProductCardSelection({
  producto,
}: UseProductCardSelectionProps): UseProductCardSelectionReturn {
  const initialSelection = useMemo(
    () => getDefaultVariantSelection(producto),
    [producto],
  );

  const [selectedColor, setSelectedColorState] = useState<string | null>(
    initialSelection.color,
  );

  const [selectedTalle, setSelectedTalleState] = useState<string | null>(
    initialSelection.talle,
  );

  // Colores disponibles
  const availableColors = producto.colores || [];

  // Talles disponibles: usar producto.talles (único) para evitar keys duplicadas por variantes repetidas
  const availableTalles = useMemo(() => {
    const raw = producto.talles || [];
    return [...new Set(raw)];
  }, [producto.talles]);

  const selectedVariant = useMemo(() => {
    if (!producto.variantes || producto.variantes.length === 0) {
      return null;
    }
    return findBestVariantePublicada(
      producto.variantes,
      selectedColor,
      selectedTalle,
    );
  }, [producto.variantes, selectedColor, selectedTalle]);

  // Handler para cambiar color (el talle se mantiene; la variante se resuelve por color+talle)
  const setSelectedColor = (color: string) => {
    setSelectedColorState(color);
  };

  // Handler para cambiar talle
  const setSelectedTalle = (talle: string) => {
    setSelectedTalleState(talle);
  };

  return {
    selectedColor,
    selectedTalle,
    selectedVariant,
    availableColors,
    availableTalles,
    setSelectedColor,
    setSelectedTalle,
  };
}

