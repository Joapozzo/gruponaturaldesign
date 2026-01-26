'use client';

import { useMemo } from 'react';
import { useCart } from './useCart';

/**
 * Hook para ordenar items del carrito por categoría
 * Agrupa productos del mismo tipo para mejor visualización
 */
export const useSortedCartItems = () => {
    const { items } = useCart();

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const categoriaA = a.product.categoria || 'Sin categoría';
            const categoriaB = b.product.categoria || 'Sin categoría';
            
            // Ordenar alfabéticamente por categoría
            return categoriaA.localeCompare(categoriaB, 'es', { sensitivity: 'base' });
        });
    }, [items]);

    return sortedItems;
};

