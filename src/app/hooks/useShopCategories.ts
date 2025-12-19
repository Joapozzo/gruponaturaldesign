'use client';

import { useMemo } from 'react';
import { useProductsV2 } from './useProductsV2';
import { GroupedProductV2 } from '../types/producto-v2';

// Función para extraer género del código o nombre del producto
const extractGender = (product: GroupedProductV2): string | null => {
    const nombre = (product.nombre || product.item || '').toLowerCase();
    const codigo = (product.codigo || '').toLowerCase();
    
    if (nombre.includes('dama') || codigo.includes('dama') || codigo.includes('d')) {
        return 'dama';
    }
    if (nombre.includes('hombre') || codigo.includes('hombre') || codigo.includes('h')) {
        return 'hombre';
    }
    if (nombre.includes('unisex') || codigo.includes('unisex') || codigo.includes('u')) {
        return 'unisex';
    }
    
    return null;
};

export interface ShopCategories {
    rubros: string[];
    subrubros: string[];
    generos: string[];
}

export function useShopCategories() {
    // Usar useProductsV2 - LA MISMA FUENTE QUE FilterModal
    // Esto asegura que siempre use la misma fuente de datos (CSV) que el resto de la app
    const { products, rubros, subrubros, isLoading, isFetched } = useProductsV2({});

    const categories = useMemo<ShopCategories>(() => {
        // Si está cargando y no se ha fetcheado, retornar vacío
        if (isLoading && !isFetched) {
            return { rubros: [], subrubros: [], generos: [] };
        }

        // Usar rubros y subrubros directamente de useProductsV2 (ya vienen normalizados)
        const rubrosList = rubros.map(r => r.nombreNormalizado).filter(Boolean);
        const subrubrosList = subrubros.map(s => s.nombre).filter(Boolean);

        // Extraer géneros de los productos
        const generosSet = new Set<string>();
        products.forEach(product => {
            const gender = extractGender(product);
            if (gender) {
                generosSet.add(gender.toUpperCase());
            }
        });

        return {
            rubros: rubrosList.length > 0 ? rubrosList : [],
            subrubros: subrubrosList.length > 0 ? subrubrosList : [],
            generos: Array.from(generosSet).sort(),
        };
    }, [products, rubros, subrubros, isLoading, isFetched]);

    // Debug en desarrollo
    if (process.env.NODE_ENV === 'development') {
        console.log('[useShopCategories]', {
            isLoading,
            isFetched,
            productsCount: products?.length || 0,
            rubrosCount: rubros?.length || 0,
            subrubrosCount: subrubros?.length || 0,
            categoriesCount: {
                rubros: categories.rubros.length,
                subrubros: categories.subrubros.length,
                generos: categories.generos.length,
            },
        });
    }

    return {
        categories,
        isLoading,
    };
}

