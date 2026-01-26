import { useState, useEffect } from 'react';
import { useCart } from '@/app/components/hooks/useCart';

interface UseBordadoOptions {
  cartItem?: { bordado?: boolean } | null;
  handleBordadoChange: (value: boolean) => void;
}

/**
 * Hook reutilizable para manejar la lógica de bordado
 * Requiere mínimo 5 prendas en el carrito para activarse
 */
export function useBordado({ cartItem, handleBordadoChange }: UseBordadoOptions) {
  const { itemCount } = useCart();
  
  // Estado para bordado (por defecto false)
  const [bordado, setBordado] = useState(false);
  
  // Validar si se puede activar bordado (mínimo 5 prendas)
  const canActivateBordado = itemCount >= 5;
  const itemsNeeded = Math.max(0, 5 - itemCount);
  
  // Sincronizar estado de bordado con el carrito
  useEffect(() => {
    if (cartItem) {
      setBordado(cartItem.bordado || false);
    } else {
      setBordado(false);
    }
  }, [cartItem]);

  // Desactivar bordado automáticamente si el carrito baja de 5 prendas
  useEffect(() => {
    if (itemCount < 5 && bordado) {
      setBordado(false);
      if (cartItem) {
        handleBordadoChange(false);
      }
    }
  }, [itemCount, cartItem, bordado, handleBordadoChange]);

  const handleBordadoToggle = (value: boolean) => {
    if (canActivateBordado) {
      setBordado(value);
      handleBordadoChange(value);
    }
  };

  return {
    bordado,
    setBordado,
    canActivateBordado,
    itemsNeeded,
    itemCount,
    handleBordadoToggle,
  };
}

