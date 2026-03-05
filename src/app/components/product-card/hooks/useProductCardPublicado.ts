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

export function useProductCardPublicado({
  producto,
  expandedSku,
  onExpandChange,
}: UseProductCardPublicadoProps): UseProductCardPublicadoReturn {
  // Estado para mostrar selectores (solo cuando se hace click en agregar)
  const [showSelectors, setShowSelectors] = useState(false);
  // Estado para rastrear si se hizo una selección explícita
  const [hasExplicitSelection, setHasExplicitSelection] = useState(false);
  
  // Si este producto está expandido
  const isExpanded = expandedSku === producto?.codigoAgrupacion;

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
  });

  const handlers = useProductCardHandlers({
    producto: producto || {} as ProductoPublicado,
    setSelectedColor: selection.setSelectedColor,
    setSelectedTalle: selection.setSelectedTalle,
  });

  // Resetear selección cuando se despliega (si hay múltiples opciones)
  useEffect(() => {
    if (showSelectors) {
      setHasExplicitSelection(false);
    } else {
      setHasExplicitSelection(false);
    }
  }, [showSelectors]);
  
  // Marcar como selección explícita cuando el usuario cambia color o talle
  useEffect(() => {
    if (showSelectors && (selection.selectedColor || selection.selectedTalle)) {
      setHasExplicitSelection(true);
    }
  }, [selection.selectedColor, selection.selectedTalle, showSelectors]);

  // Notificar al padre cuando showSelectors cambia (para detener slider)
  useEffect(() => {
    if (!producto) return;
    if (showSelectors && onExpandChange) {
      onExpandChange(producto.codigoAgrupacion);
    } else if (!showSelectors && isExpanded && onExpandChange) {
      onExpandChange(null);
    }
  }, [showSelectors, producto, isExpanded, onExpandChange]);

  // Colapsar este card cuando se expande otro (solo uno expandido a la vez)
  useEffect(() => {
    if (expandedSku != null && expandedSku !== producto?.codigoAgrupacion) {
      setShowSelectors(false);
    }
  }, [expandedSku, producto?.codigoAgrupacion]);

  // Handler para mostrar selectores
  const handleShowSelectors = () => {
    if (producto.variantes && producto.variantes.length > 1) {
      setShowSelectors(true);
    }
  };

  // Handler para agregar al carrito con despliegue de selectores
  const handleAddToCartClick = async () => {
    // Si hay múltiples variantes, mostrar selectores primero
    if (producto.variantes && producto.variantes.length > 1 && !showSelectors) {
      setShowSelectors(true);
      return;
    }
    // Si ya se seleccionó o hay una sola variante, agregar directamente
    await cart.handleAddToCart();
    // Cerrar selectores después de agregar
    setShowSelectors(false);
  };
  
  // Handler para cancelar que cierra con animación
  const handleCancel = () => {
    setShowSelectors(false);
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

