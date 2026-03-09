/**
 * Hook principal para ProductCardPublicado
 * Encapsula toda la lógica de estado, efectos y handlers del componente
 * Responsabilidad: gestión de estado y lógica del card de producto publicado
 */

import { useState, useEffect } from 'react';
import type { ProductoPublicado } from '@/app/types/producto-publicado.types';
import { useProductCardSelection } from './useProductCardSelection';
import { useProductCardCart } from './useProductCardCart';
import { useProductCardImages } from './useProductCardImages';
import { useProductCardHandlers } from './useProductCardHandlers';
import { useProductCardConfig } from './useProductCardConfig';

interface UseProductCardPublicadoProps {
  producto: ProductoPublicado;
  expandedSku?: string | null;
  onExpandChange?: (sku: string | null) => void;
  /** Índice del card en la lista; si se pasa, la expansión es por posición (evita que dos cards del mismo producto se expandan juntas) */
  cardIndex?: number;
}

interface UseProductCardPublicadoReturn {
  // Estados
  showSelectors: boolean;
  hasExplicitSelection: boolean;
  isExpanded: boolean;
  
  // Handlers
  handleAddToCartClick: () => Promise<void>;
  handleCancel: () => void;
  handleShowSelectors: () => void;
  
  // Selección
  selection: ReturnType<typeof useProductCardSelection>;
  
  // Carrito
  cart: ReturnType<typeof useProductCardCart>;
  
  // Imágenes
  images: ReturnType<typeof useProductCardImages>;
  
  // Handlers del producto
  handlers: ReturnType<typeof useProductCardHandlers>;
  
  // Validaciones
  isValid: boolean;
}

const getExpansionKey = (codigo: string | undefined, cardIndex: number | undefined) =>
  cardIndex !== undefined && codigo != null ? `${codigo}-${cardIndex}` : codigo ?? null;

export function useProductCardPublicado({
  producto,
  expandedSku,
  onExpandChange,
  cardIndex,
}: UseProductCardPublicadoProps): UseProductCardPublicadoReturn {
  // Estado local solo cuando no hay control del padre (uso aislado del card)
  const [localShowSelectors, setLocalShowSelectors] = useState(false);
  // Clave de expansión: por posición (codigo-index) si hay cardIndex, sino solo codigoAgrupacion
  const expansionKey = getExpansionKey(producto?.codigoAgrupacion ?? undefined, cardIndex);
  const showSelectors = onExpandChange
    ? expandedSku === expansionKey
    : localShowSelectors;
  const isExpanded = showSelectors;

  // Estado para rastrear si se hizo una selección explícita
  const [hasExplicitSelection, setHasExplicitSelection] = useState(false);

  // Hooks especializados
  const selection = useProductCardSelection({ producto: producto || {} as ProductoPublicado });
  const config = useProductCardConfig();

  const cart = useProductCardCart({
    selectedVariant: selection.selectedVariant,
    productoNombre: producto?.nombre || '',
    imagenPrincipal: producto?.imagenPrincipal || null,
    precioLista: producto?.precioLista || null,
    precioTransfer: producto?.precioTransfer || null,
    precioSinImp: producto?.precioSinImp || null,
    categoria: producto?.rubro?.nombre || producto?.subrubro?.nombre || null,
    createProductId: config.createProductId,
  });

  const images = useProductCardImages({
    selectedVariant: selection.selectedVariant,
    imagenPrincipal: producto?.imagenPrincipal || null,
    variantes: producto?.variantes ?? [],
  });

  const handlers = useProductCardHandlers({
    producto: producto || {} as ProductoPublicado,
    setSelectedColor: selection.setSelectedColor,
    setSelectedTalle: selection.setSelectedTalle,
  });

  // Marcar como selección explícita cuando el usuario cambia color o talle (solo cuando está expandido)
  useEffect(() => {
    if (showSelectors && (selection.selectedColor || selection.selectedTalle)) {
      setHasExplicitSelection(true);
    }
  }, [selection.selectedColor, selection.selectedTalle, showSelectors]);

  // Al colapsar, resetear selección explícita
  useEffect(() => {
    if (!showSelectors) setHasExplicitSelection(false);
  }, [showSelectors]);

  // Handler para mostrar selectores: notificar al padre con clave única (solo uno expandido a la vez)
  const handleShowSelectors = () => {
    if (producto.variantes && producto.variantes.length > 1) {
      if (onExpandChange) onExpandChange(expansionKey ?? producto.codigoAgrupacion ?? null);
      else setLocalShowSelectors(true);
    }
  };

  // Handler para agregar al carrito con despliegue de selectores
  const handleAddToCartClick = async () => {
    if (producto.variantes && producto.variantes.length > 1 && !showSelectors) {
      if (onExpandChange) onExpandChange(expansionKey ?? producto.codigoAgrupacion ?? null);
      else setLocalShowSelectors(true);
      return;
    }
    await cart.handleAddToCart();
    if (onExpandChange) onExpandChange(null);
    else setLocalShowSelectors(false);
  };

  // Handler para cancelar: colapsar este producto
  const handleCancel = () => {
    if (onExpandChange) onExpandChange(null);
    else setLocalShowSelectors(false);
  };

  // Validaciones
  const isValid = Boolean(
    producto &&
    producto.variantes &&
    Array.isArray(producto.variantes) &&
    producto.variantes.length > 0
  );

  return {
    showSelectors,
    hasExplicitSelection,
    isExpanded,
    handleAddToCartClick,
    handleCancel,
    handleShowSelectors,
    selection,
    cart,
    images,
    handlers,
    isValid,
  };
}

