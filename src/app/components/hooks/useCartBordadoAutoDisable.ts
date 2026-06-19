'use client';

import { useEffect } from 'react';
import { useCart } from './useCart';
import { useSales } from '../../contexts/SalesContext';

/**
 * Hook para desactivar bordado automáticamente si el carrito baja del mínimo de prendas
 */
export const useCartBordadoAutoDisable = (): void => {
    const { items, itemCount, updateBordado } = useCart();
    const { config } = useSales();

    useEffect(() => {
        if (itemCount < config.BORDADO_MIN_ITEMS && items.length > 0) {
            // Buscar todos los items con bordado activado y desactivarlos
            const itemsWithBordado = items.filter((item) => item.bordado === true);
            if (itemsWithBordado.length > 0) {
                itemsWithBordado.forEach((item) => {
                    updateBordado(item.product.id, false);
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemCount, config.BORDADO_MIN_ITEMS]); // Solo escuchar itemCount para evitar loops infinitos
};

