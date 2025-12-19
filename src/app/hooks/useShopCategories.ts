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
    // IMPORTANTE: Llamar sin parámetros para usar la misma query key que otros componentes
    const { products, rubros, subrubros, isLoading, isFetched, isError, error } = useProductsV2();

    const categories = useMemo<ShopCategories>(() => {
        // Si hay error, retornar vacío pero loguear
        if (isError) {
            console.error('[useShopCategories] Error al cargar productos:', error);
            return { rubros: [], subrubros: [], generos: [] };
        }

        // Si está cargando y no se ha fetcheado, retornar vacío
        if (isLoading && !isFetched) {
            return { rubros: [], subrubros: [], generos: [] };
        }

        // Asegurar que rubros y subrubros sean arrays válidos
        const validRubros = Array.isArray(rubros) ? rubros : [];
        const validSubrubros = Array.isArray(subrubros) ? subrubros : [];
        const validProducts = Array.isArray(products) ? products : [];

        // Si no hay datos y ya se fetcheó, retornar vacío (evitar procesar datos vacíos)
        if (isFetched && validRubros.length === 0 && validSubrubros.length === 0 && validProducts.length === 0) {
            console.warn('[useShopCategories] Datos fetcheados pero vacíos - verificar que /api/products-v2 esté funcionando');
            return { rubros: [], subrubros: [], generos: [] };
        }

        // Usar rubros y subrubros directamente de useProductsV2 (ya vienen normalizados)
        const rubrosList = validRubros
            .map(r => r?.nombreNormalizado)
            .filter((nombre): nombre is string => Boolean(nombre));
        
        const subrubrosList = validSubrubros
            .map(s => s?.nombre)
            .filter((nombre): nombre is string => Boolean(nombre));

        // Extraer géneros de los productos
        const generosSet = new Set<string>();
        validProducts.forEach(product => {
            if (product) {
                const gender = extractGender(product);
                if (gender) {
                    generosSet.add(gender.toUpperCase());
                }
            }
        });

        const result = {
            rubros: rubrosList.length > 0 ? rubrosList : [],
            subrubros: subrubrosList.length > 0 ? subrubrosList : [],
            generos: Array.from(generosSet).sort(),
        };

        // Debug en desarrollo y producción (para diagnosticar el problema)
        console.log('[useShopCategories]', {
            isLoading,
            isFetched,
            isError,
            productsCount: validProducts.length,
            rubrosCount: validRubros.length,
            subrubrosCount: validSubrubros.length,
            categoriesCount: {
                rubros: result.rubros.length,
                subrubros: result.subrubros.length,
                generos: result.generos.length,
            },
            rubrosList: result.rubros,
            subrubrosList: result.subrubros.slice(0, 5), // Primeros 5 para no saturar
        });

        return result;
    }, [products, rubros, subrubros, isLoading, isFetched, isError, error]);

    return {
        categories,
        isLoading,
    };
}

