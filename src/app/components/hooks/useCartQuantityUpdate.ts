'use client';

import { useRouter } from 'next/navigation';
import { useCart } from './useCart';
import { useConfirmModal } from './useModal';
import { useSales } from '../../contexts/SalesContext';

interface UseCartQuantityUpdateOptions {
  minQuantity?: number;
  maxQuantity?: number;
  validateWholesaleLimit?: boolean;
  onWholesaleRedirect?: () => void;
}

export const useCartQuantityUpdate = (options: UseCartQuantityUpdateOptions = {}) => {
  const {
    minQuantity,
    maxQuantity,
    validateWholesaleLimit = true,
    onWholesaleRedirect,
  } = options;

  const router = useRouter();
  const { items, updateQuantity: originalUpdateQuantity, canAddToCart } = useCart();
  const { showModal } = useConfirmModal();
  const { config } = useSales();

  // Usar valores del contexto si no se especifican
  const minQty = minQuantity ?? config.MIN_QUANTITY;
  const maxQty = maxQuantity ?? config.MAX_QUANTITY;

  const updateQuantity = (productId: number, newQuantity: number) => {
    // Validar cantidad mínima
    if (newQuantity < minQty) {
      originalUpdateQuantity(productId, minQty);
      return;
    }

    // Validar cantidad máxima
    if (maxQty !== undefined && newQuantity > maxQty) {
      originalUpdateQuantity(productId, maxQty);
      return;
    }

    // Calcular la diferencia de cantidad
    const existingItem = items.find(item => item.product.id === productId);
    const currentQuantity = existingItem?.quantity || 0;
    const quantityDifference = newQuantity - currentQuantity;

    // Validar límite de mayorista si está habilitado
    if (validateWholesaleLimit && quantityDifference > 0) {
      const validation = canAddToCart(productId, quantityDifference);
      if (!validation.canAdd) {
        showModal({
          title: 'Límite minorista alcanzado',
          message: `Has alcanzado el límite de compra minorista (${config.WHOLESALE_MIN_ITEMS} artículos). ¿Deseas continuar con tu compra en nuestro sistema mayorista?`,
          type: 'warning',
          confirmText: 'Sí, ir a mayorista',
          cancelText: 'No, cancelar',
          onConfirm: async () => {
            if (onWholesaleRedirect) {
              onWholesaleRedirect();
            } else {
              router.push(config.WHOLESALE_ROUTE);
            }
          }
        });
        return;
      }
    }

    originalUpdateQuantity(productId, newQuantity);
  };

  return { updateQuantity };
};

