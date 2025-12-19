'use client';

import { useMemo } from 'react';
import { useProductsV2 } from './useProductsV2';
import { GroupedProductV2 } from '../types/producto-v2';

// Función para extraer género del código o nombre del producto
const extractGender = (product: GroupedProductV2): string | null => {
    const nombre = (product.skuBase || product.displayProduct?.item || product.displayProduct?.nombreBase || '').toLowerCase();
    const codigo = (product.displayProduct?.codigo || '').toLowerCase();
    
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

// Categorías hardcodeadas como fallback
const HARDCODED_CATEGORIES: ShopCategories = {
    rubros: ['WORKWEAR', 'BASIC'],
    subrubros: [
        'Buzo',
        'Camisa',
        'Chomba',
        'Pantalón',
        'Remera',
        'Campera',
        'Jean',
        'Cargo',
        'Chino',
        'Tejido',
        'Cardigan',
        'Sweater',
        'Pantalón Jean',
        'Pantalón Cargo',
        'Pantalón Chino'
    ],
    generos: ['DAMA', 'HOMBRE', 'UNISEX']
};

export function useShopCategories() {
    // Usar useProductsV2 - LA MISMA FUENTE QUE FilterModal
    // Esto asegura que siempre use la misma fuente de datos (CSV) que el resto de la app
    // IMPORTANTE: Llamar sin parámetros para usar la misma query key que otros componentes
    const { products, rubros, subrubros, isLoading, isFetched, isError, error } = useProductsV2();

    const categories = useMemo<ShopCategories>(() => {
        // Asegurar que rubros y subrubros sean arrays válidos
        const validRubros = Array.isArray(rubros) ? rubros : [];
        const validSubrubros = Array.isArray(subrubros) ? subrubros : [];
        const validProducts = Array.isArray(products) ? products : [];

        // Usar rubros y subrubros directamente de useProductsV2 (ya vienen normalizados)
        const rubrosList = validRubros
            .map(r => r?.nombreNormalizado)
            .filter(Boolean) as string[]; // Filtrar nulos/undefined y convertir a string[]
        
        const subrubrosList = validSubrubros
            .map(s => s?.nombre)
            .filter(Boolean) as string[]; // Filtrar nulos/undefined

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

        // Si hay datos cargados, usarlos; si no, usar hardcoded
        const result = {
            rubros: rubrosList.length > 0 ? rubrosList : HARDCODED_CATEGORIES.rubros,
            subrubros: subrubrosList.length > 0 ? subrubrosList : HARDCODED_CATEGORIES.subrubros,
            generos: generosSet.size > 0 ? Array.from(generosSet).sort() : HARDCODED_CATEGORIES.generos,
        };

        // Debug en desarrollo y producción (para diagnosticar el problema)
        console.log('[useShopCategories]', {
            isLoading,
            isFetched,
            isError,
            productsCount: validProducts.length,
            rubrosCount: validRubros.length,
            subrubrosCount: validSubrubros.length,
            usingHardcoded: {
                rubros: rubrosList.length === 0,
                subrubros: subrubrosList.length === 0,
                generos: generosSet.size === 0,
            },
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

