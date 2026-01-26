'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { canAddQuantity } from '@/app/services/stockService';
import { nombreToSlug, parseProductSpecs } from '@/app/utils/productHelpers';
import type { CartItemProps } from '@/app/types/producto-publicado.types';

type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface UseConfirmModalOptions {
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void | Promise<void>;
}

interface UseCartItemActionsProps {
  item: CartItemProps['item'];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  showModal: (options: UseConfirmModalOptions) => void;
}

export const useCartItemActions = ({
  item,
  onUpdateQuantity,
  onRemove,
  showModal,
}: UseCartItemActionsProps) => {
  const router = useRouter();
  const { product, quantity, especificaciones } = item;

  // Parsear especificaciones para obtener color y talle
  const { color, talle } = parseProductSpecs(especificaciones);

  // Construir URL del producto con query params
  const handleProductClick = () => {
    // Usar skuBaseSlug si está disponible, sino generar desde nombre
    const productSlug = product.skuBaseSlug || nombreToSlug(product.nombre);
    const params = new URLSearchParams();
    
    if (color) params.set('color', color.toLowerCase());
    if (talle) params.set('talle', talle);
    
    const queryString = params.toString();
    const url = queryString 
        ? `/producto/${productSlug}?${queryString}`
        : `/producto/${productSlug}`;
    
    router.push(url);
  };

  const handleIncrement = () => {
    // Validar stock disponible usando el servicio (lógica separada y delicada)
    if (!canAddQuantity(product.stock, quantity, 1)) {
      // No mostrar el número exacto de stock, solo un mensaje genérico
      return;
    }
    onUpdateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(product.id, quantity - 1);
    }
  };

  const handleRemove = () => {
    showModal({
      title: 'Eliminar Producto',
      message: `¿Eliminar ${product.nombre} del carrito?`,
      type: 'warning',
      confirmText: 'Sí, eliminar',
      cancelText: 'No, mantener',
      onConfirm: async () => {
        onRemove(product.id);
        toast.success(`${product.nombre} eliminado del carrito`, {
          duration: 3000,
        });
      }
    });
  };

  return {
    handleProductClick,
    handleIncrement,
    handleDecrement,
    handleRemove,
  };
};

