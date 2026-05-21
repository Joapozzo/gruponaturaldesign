/**
 * Hook para manejo del carrito de compras
 * Responsabilidad única: gestión de agregar, actualizar cantidad y bordado
 */

import { useState } from 'react';
import { useCart } from '@/app/components/hooks/useCart';
import { canAddQuantity } from '@/app/services/stockService';
import { useConfirmModal } from '@/app/components/hooks/useModal';
import type { UseConfirmModalOptions } from '@/app/components/hooks/useModal';
import type { VariantePublicada } from '@/app/types/producto-publicado.types';

interface UseProductCardCartProps {
  selectedVariant: VariantePublicada | null;
  productoNombre: string;
  imagenPrincipal: string | null;
  precioLista: number | null;
  precioTransfer: number | null;
  precioSinImp: number | null;
  categoria: string | null;
  createProductId: (codigo: string) => number;
}

interface UseProductCardCartReturn {
  cartQuantity: number;
  bordado: boolean;
  isAddingToCart: boolean;
  canActivateBordado: boolean;
  itemsNeeded: number;
  setBordado: (value: boolean) => void;
  handleAddToCart: () => Promise<void>;
  handleQuantityChange: (newQuantity: number) => void;
  wholesaleModal: {
    isOpen: boolean;
    loading: boolean;
    options: UseConfirmModalOptions;
    openModal: (options: UseConfirmModalOptions) => void;
    closeModal: () => void;
  };
}

export function useProductCardCart({
  selectedVariant,
  productoNombre,
  imagenPrincipal,
  precioLista,
  precioTransfer,
  precioSinImp,
  categoria,
  createProductId,
}: UseProductCardCartProps): UseProductCardCartReturn {
  const { addToCart, updateQuantity, getProductQuantity, updateBordado, itemCount } = useCart();
  const [bordado, setBordadoState] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const {
    isOpen: isWholesaleModalOpen,
    loading: isWholesaleModalLoading,
    modalOptions: wholesaleModalOptions,
    showModal: openWholesaleModal,
    closeModal: closeWholesaleModal,
  } = useConfirmModal();

  // Validar si se puede activar bordado (mínimo 5 prendas)
  const canActivateBordado = itemCount >= 5;
  const itemsNeeded = Math.max(0, 5 - itemCount);

  // ID del producto en el carrito
  const productId = selectedVariant ? createProductId(selectedVariant.codigo) : 0;

  // Cantidad en el carrito
  const cartQuantity = selectedVariant ? getProductQuantity(productId) : 0;

  // Handler para agregar al carrito
  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.codigo) {
      console.warn('[useProductCardCart] No se puede agregar al carrito: variante inválida');
      return;
    }

    const cantidad = 1;

    // Validar stock
    if (selectedVariant.stock < cantidad) {
      return;
    }

    // Si el precio es mayor a cierto umbral, mostrar modal de confirmación
    const precioUmbral = 50000;
    if (precioLista && precioLista > precioUmbral) {
      openWholesaleModal({
        title: 'Confirmar agregado al carrito',
        message: `¿Estás seguro de agregar este producto ($${precioLista.toLocaleString()}) al carrito?`,
        confirmText: 'Agregar',
        cancelText: 'Cancelar',
        onConfirm: () => {
          const productId = createProductId(selectedVariant.codigo);
          // Usar precioLista del producto, sino precio de la variante, sino 0
          const precioListaValue = precioLista ?? selectedVariant.precio ?? 0;
          
          // Crear especificaciones
          const especificaciones = [
            selectedVariant.color && `Color: ${selectedVariant.color}`,
            selectedVariant.talle && `Talle: ${selectedVariant.talle}`,
            `Código: ${selectedVariant.codigo}`,
          ].filter(Boolean).join(' | ');
          
          addToCart({
            id: productId,
            productoWebId: selectedVariant.id,
            productoPadreId: selectedVariant.productoPadreId,
            sfactoryItemId: selectedVariant.sfactoryId,
            codigo: selectedVariant.codigo,
            nombre: productoNombre || '',
            descripcion: productoNombre || '',
            categoria: categoria || 'Sin categoría',
            precio: precioListaValue, // Mantener compatibilidad
            precioLista: precioListaValue,
            precioTransfer: precioTransfer || null,
            precioSinImp: precioSinImp || null,
            imagen: selectedVariant.imagen || imagenPrincipal || '',
            stock: selectedVariant.stock,
            skuBaseSlug: undefined, // Se puede agregar si es necesario
          }, cantidad, especificaciones, bordado);
          setIsAddingToCart(true);
          setTimeout(() => setIsAddingToCart(false), 1000);
        },
      });
    } else {
      const productId = createProductId(selectedVariant.codigo);
      // Usar precioLista del producto, sino precio de la variante, sino 0
      const precioListaValue = precioLista ?? selectedVariant.precio ?? 0;
      
      // Crear especificaciones
      const especificaciones = [
        selectedVariant.color && `Color: ${selectedVariant.color}`,
        selectedVariant.talle && `Talle: ${selectedVariant.talle}`,
        `Código: ${selectedVariant.codigo}`,
      ].filter(Boolean).join(' | ');
      
      addToCart({
        id: productId,
        productoWebId: selectedVariant.id,
        productoPadreId: selectedVariant.productoPadreId,
        sfactoryItemId: selectedVariant.sfactoryId,
        codigo: selectedVariant.codigo,
        nombre: productoNombre || '',
        descripcion: productoNombre || '',
        categoria: categoria || 'Sin categoría',
        precio: precioListaValue, // Mantener compatibilidad
        precioLista: precioListaValue,
        precioTransfer: precioTransfer || null,
        precioSinImp: precioSinImp || null,
        imagen: selectedVariant.imagen || imagenPrincipal || '',
        stock: selectedVariant.stock,
        skuBaseSlug: undefined, // Se puede agregar si es necesario
      }, cantidad, especificaciones, bordado);
      setIsAddingToCart(true);
      setTimeout(() => setIsAddingToCart(false), 1000);
    }
  };

  // Handler para cambiar cantidad
  const handleQuantityChange = (newQuantity: number) => {
    if (!selectedVariant) return;

    if (newQuantity <= 0) {
      updateQuantity(productId, 0);
    } else {
      // Validar stock
      if (canAddQuantity(selectedVariant.stock, cartQuantity, newQuantity)) {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  // Handler para cambiar bordado
  const setBordado = (value: boolean) => {
    setBordadoState(value);
    if (selectedVariant) {
      updateBordado(productId, value);
    }
  };

  return {
    cartQuantity,
    bordado,
    isAddingToCart,
    canActivateBordado,
    itemsNeeded,
    setBordado,
    handleAddToCart,
    handleQuantityChange,
    wholesaleModal: {
      isOpen: isWholesaleModalOpen,
      loading: isWholesaleModalLoading,
      options: wholesaleModalOptions,
      openModal: openWholesaleModal,
      closeModal: closeWholesaleModal,
    },
  };
}

