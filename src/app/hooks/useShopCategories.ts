'use client';

import { useMemo, useState, useEffect } from 'react';
import { productsService } from '../services/productsService';
import { GroupedProduct } from '../types/producto';

// Función para extraer género del código o nombre del producto (mismo que en useGroupedCatalogFilters)
const extractGender = (product: GroupedProduct): string | null => {
    const nombre = (product.displayProduct.NOMBRE || product.displayProduct.Descripcion || '').toLowerCase();
    const codigo = (product.displayProduct.Codigo || '').toLowerCase();
    
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
    const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setIsLoading(true);
                
                // Intentar cargar desde localStorage
                const products = productsService.loadProductsFromLocalStorage();
                if (products && products.length > 0) {
                    const grouped = productsService.groupProductsByVariants(products);
                    setGroupedProducts(grouped);
                }
            } catch (error) {
                console.error('Error loading categories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []);

    const categories = useMemo<ShopCategories>(() => {
        if (isLoading || !groupedProducts || groupedProducts.length === 0) {
            return { rubros: [], subrubros: [], generos: [] };
        }

        const rubrosSet = new Set<string>();
        const subrubrosSet = new Set<string>();
        const generosSet = new Set<string>();

        // Función para normalizar rubro: PRODUCTO OFFICE → BASIC, PRODUCTO WORKWEAR → WORKWEAR
        const normalizeRubroForDisplay = (rubro: string): string => {
            if (!rubro) return '';
            const rubroUpper = rubro.toUpperCase().trim();
            
            // Si contiene "WORKWEAR", retornar "WORKWEAR"
            if (rubroUpper.includes('WORKWEAR')) {
                return 'WORKWEAR';
            }
            
            // Si contiene "OFFICE", retornar "BASIC"
            if (rubroUpper.includes('OFFICE')) {
                return 'BASIC';
            }
            
            // Si ya es "BASIC" o "WORKWEAR", retornarlo tal cual
            if (rubroUpper === 'BASIC' || rubroUpper === 'WORKWEAR') {
                return rubroUpper;
            }
            
            // Por defecto, retornar el rubro original
            return rubro.trim();
        };

        groupedProducts.forEach(product => {
            // Rubros - normalizar para mostrar
            if (product.displayProduct.Rubro) {
                const normalizedRubro = normalizeRubroForDisplay(product.displayProduct.Rubro);
                if (normalizedRubro) {
                    rubrosSet.add(normalizedRubro);
                }
            }

            // Subrubros
            if (product.displayProduct.Subrubro) {
                subrubrosSet.add(product.displayProduct.Subrubro.trim());
            }

            // Géneros
            const gender = extractGender(product);
            if (gender) {
                // Convertir a mayúsculas para mostrar en el menú
                generosSet.add(gender.toUpperCase());
            }
        });

        return {
            rubros: Array.from(rubrosSet).sort(),
            subrubros: Array.from(subrubrosSet).sort(),
            generos: Array.from(generosSet).sort(),
        };
    }, [groupedProducts, isLoading]);

    return {
        categories,
        isLoading,
    };
}

