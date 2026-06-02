/**
 * Hook para manejo del carrito de compras
 * Responsabilidad única: gestión de agregar y actualizar cantidad
 */

import { useState } from 'react';
import { useCart } from '@/app/components/hooks/useCart';
import { canAddQuantity } from '@/app/services/stockService';
import { useConfirmModal } from '@/app/components/hooks/useModal';
import type { UseConfirmModalOptions } from '@/app/components/hooks/useModal';
import type { VariantePublicada } from '@/app/types/producto-publicado.types';
import { resolveCartProductImage } from '@/app/utils/productHelpers';

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
  isAddingToCart: boolean;
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
  const { addToCart, updateQuantity, getProductQuantity } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const {
    isOpen: isWholesaleModalOpen,
    loading: isWholesaleModalLoading,
    modalOptions: wholesaleModalOptions,
    showModal: openWholesaleModal,
    closeModal: closeWholesaleModal,
  } = useConfirmModal();

  // ID del producto en el carrito
  const productId = selectedVariant ? createProductId(selectedVariant.codigo) : 0;

  // Cantidad en el carrito
  const cartQuantity = selectedVariant ? getProductQuantity(productId) : 0;

  const resolveImagen = () =>
    resolveCartProductImage(selectedVariant?.imagen, imagenPrincipal);

  const addVariantToCart = () => {
    if (!selectedVariant || !selectedVariant.codigo) {
      console.warn('[useProductCardCart] No se puede agregar al carrito: variante inválida');
      return;
    }

    const cantidad = 1;
    const productId = createProductId(selectedVariant.codigo);
    const precioListaValue = precioLista ?? selectedVariant.precio ?? 0;

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
      precio: precioListaValue,
      precioLista: precioListaValue,
      precioTransfer: precioTransfer || null,
      precioSinImp: precioSinImp || null,
      imagen: resolveImagen(),
      stock: selectedVariant.stock,
      skuBaseSlug: undefined,
    }, cantidad, especificaciones, false);

    setIsAddingToCart(true);
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  // Handler para agregar al carrito
  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.codigo) {
      console.warn('[useProductCardCart] No se puede agregar al carrito: variante inválida');
      return;
    }

    if (selectedVariant.stock < 1) {
      return;
    }

    const precioUmbral = 50000;
    if (precioLista && precioLista > precioUmbral) {
      openWholesaleModal({
        title: 'Confirmar agregado al carrito',
        message: `¿Estás seguro de agregar este producto ($${precioLista.toLocaleString()}) al carrito?`,
        confirmText: 'Agregar',
        cancelText: 'Cancelar',
        onConfirm: addVariantToCart,
      });
    } else {
      addVariantToCart();
    }
  };

  // Handler para cambiar cantidad
  const handleQuantityChange = (newQuantity: number) => {
    if (!selectedVariant) return;

    if (newQuantity <= 0) {
      updateQuantity(productId, 0);
    } else if (canAddQuantity(selectedVariant.stock, cartQuantity, newQuantity)) {
      updateQuantity(productId, newQuantity);
    }
  };

  return {
    cartQuantity,
    isAddingToCart,
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
