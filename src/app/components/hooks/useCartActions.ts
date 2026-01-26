'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCart } from './useCart';
import { useConfirmModal } from './useModal';
import { useSales } from '../../contexts/SalesContext';

interface UseCartActionsOptions {
  onClose?: () => void;
}

export const useCartActions = (options: UseCartActionsOptions = {}) => {
  const { onClose } = options;
  const router = useRouter();
  const pathname = usePathname();
  const isInCheckout = pathname?.startsWith('/checkout');
  const { clearCart } = useCart();
  const { showModal } = useConfirmModal();
  const { config, isWholesaleLimitReached } = useSales();

  const handleGoToCart = () => {
    // Si tiene 20+ artículos, impedir checkout minorista
    if (isWholesaleLimitReached) {
      return;
    }
    onClose?.();
    if (!isInCheckout) {
      router.push(config.CHECKOUT_ROUTE);
    }
  };

  const handleClearCart = () => {
    showModal({
      title: 'Vaciar Carrito',
      message: '¿Estás seguro de eliminar todos los productos del carrito?',
      type: 'warning',
      confirmText: 'Sí, vaciar',
      cancelText: 'No, mantener',
      onConfirm: async () => {
        clearCart();
      }
    });
  };

  const handleGoToWholesale = () => {
    onClose?.();
    router.push(config.WHOLESALE_ROUTE);
  };

  return {
    handleGoToCart,
    handleClearCart,
    handleGoToWholesale,
    isInCheckout,
    isWholesaleLimitReached,
  };
};

