'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productsService } from '../services/productsService';
import { GroupedProduct, ProductFilters, ProductWithImage } from '../types/producto';
import { queryKeys } from '../lib/queryKeys';

interface UseGroupedProductsOptions extends ProductFilters {
    enabled?: boolean;
}

export function useGroupedProducts(options: UseGroupedProductsOptions = {}) {
    const { enabled = true, ...filters } = options;
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['products', 'grouped', filters],
        queryFn: async (): Promise<GroupedProduct[]> => {
            // PRIORIDAD 1: Intentar cargar desde la API (Google Sheets)
            const apiGrouped = await productsService.loadGroupedProductsFromAPI();
            if (apiGrouped && apiGrouped.length > 0) {
                // Aplicar filtros si existen
                const hasFilters = Object.keys(filters).length > 0;
                if (hasFilters) {
                    return productsService.filterGroupedProducts(apiGrouped, filters);
                }
                return apiGrouped;
            }

            // Fallback: Intentar obtener productos del cache principal
            const cachedProducts = queryClient.getQueryData<ProductWithImage[]>(queryKeys.products.lists());

            // Si no hay en cache, cargar desde localStorage
            const products = cachedProducts || productsService.loadProductsFromLocalStorage() || [];

            if (products.length === 0) {
                return [];
            }

            // Agrupar productos por variantes
            const grouped = productsService.groupProductsByVariants(products);

            // Aplicar filtros si existen
            const hasFilters = Object.keys(filters).length > 0;
            if (hasFilters) {
                const filtered = productsService.filterGroupedProducts(grouped, filters);
                return filtered;
            }

            return grouped;
        },
        enabled,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    return {
        groupedProducts: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        totalGroups: query.data?.length || 0,
        refetch: query.refetch,
        isFetched: query.isFetched,
    };
}

/**
 * Hook para buscar un grupo específico de producto
 *
 * @example
 * ```tsx
 * const { group, isLoading } = useProductGroup('L-OF-BU-RCON');
 * ```
 */
export function useProductGroup(skuBaseOrCode: string | null) {
    const query = useQuery({
        queryKey: ['product', 'group', skuBaseOrCode],
        queryFn: async (): Promise<GroupedProduct | null> => {
            if (!skuBaseOrCode) return null;

            // Cargar todos los productos
            const products = productsService.loadProductsFromLocalStorage();

            if (!products || products.length === 0) {
                return null;
            }

            // Agrupar productos
            const grouped = productsService.groupProductsByVariants(products);

            // Buscar el grupo específico
            const found = productsService.findGroupedProduct(grouped, skuBaseOrCode);

            return found || null;
        },
        enabled: !!skuBaseOrCode,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    return {
        group: query.data || null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

/**
 * Hook para obtener estadísticas de productos agrupados
 */
export function useGroupedProductsStats() {
    const query = useQuery({
        queryKey: ['products', 'grouped', 'stats'],
        queryFn: async () => {
            const products = productsService.loadProductsFromLocalStorage();

            if (!products || products.length === 0) {
                return {
                    totalProducts: 0,
                    totalGroups: 0,
                    averageVariantsPerGroup: 0,
                    maxVariants: 0,
                    minVariants: 0,
                };
            }

            const grouped = productsService.groupProductsByVariants(products);

            const variantCounts = grouped.map(g => g.totalVariants);
            const totalVariants = variantCounts.reduce((sum, count) => sum + count, 0);

            return {
                totalProducts: products.length,
                totalGroups: grouped.length,
                averageVariantsPerGroup: grouped.length > 0
                    ? totalVariants / grouped.length
                    : 0,
                maxVariants: Math.max(...variantCounts, 0),
                minVariants: Math.min(...variantCounts, 0),
            };
        },
        staleTime: 1000 * 60 * 10, // 10 minutos
    });

    return {
        stats: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
    };
}
