/**
 * Hook para manejo de selección de color, talle y variante
 * Responsabilidad única: gestión del estado de selección
 */

import { useState, useMemo } from 'react';
import type { ProductoPublicado, VariantePublicada } from '@/app/types/producto-publicado.types';

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
  // Estado inicial: primer color y talle disponibles
  const [selectedColor, setSelectedColorState] = useState<string | null>(
    producto.colores && producto.colores.length > 0 ? producto.colores[0] : null
  );
  
  const [selectedTalle, setSelectedTalleState] = useState<string | null>(
    producto.talles && producto.talles.length > 0 ? producto.talles[0] : null
  );

  // Colores disponibles
  const availableColors = producto.colores || [];

  // Talles disponibles para el color seleccionado
  const availableTalles = useMemo(() => {
    if (!producto.variantes || producto.variantes.length === 0) {
      return producto.talles || [];
    }
    if (selectedColor) {
      return producto.variantes
        .filter((v) => v.color === selectedColor)
        .map((v) => v.talle)
        .filter((t): t is string => !!t);
    }
    return producto.talles || [];
  }, [producto.variantes, producto.talles, selectedColor]);

  // Variante seleccionada
  const selectedVariant = useMemo(() => {
    if (!producto.variantes || producto.variantes.length === 0) {
      return null;
    }
    return producto.variantes.find(
      (v) => v.color === selectedColor && v.talle === selectedTalle
    ) || producto.variantes[0] || null;
  }, [producto.variantes, selectedColor, selectedTalle]);

  // Handler para cambiar color
  const setSelectedColor = (color: string) => {
    setSelectedColorState(color);
    
    // Mantener talle si está disponible para el nuevo color
    if (!producto.variantes || producto.variantes.length === 0) {
      return;
    }
    
    const tallesDisponibles = producto.variantes
      .filter((v) => v.color === color)
      .map((v) => v.talle)
      .filter((t): t is string => !!t);
    
    if (selectedTalle && tallesDisponibles.includes(selectedTalle)) {
      // Talle sigue disponible, mantenerlo
    } else if (tallesDisponibles.length > 0) {
      // Seleccionar primer talle disponible
      setSelectedTalleState(tallesDisponibles[0]);
    }
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

