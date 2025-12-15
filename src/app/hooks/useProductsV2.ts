'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productsV2Service } from '../services/productsV2Service';
import { 
    GroupedProductV2, 
    ProductV2Filters, 
    ProductV2,
    RubroV2,
    SubrubroV2,
    ProductsV2Response
} from '../types/producto-v2';

interface UseProductsV2Options extends ProductV2Filters {
    enabled?: boolean;
}

/**
 * Hook principal para obtener productos agrupados V2
 */
export function useProductsV2(options: UseProductsV2Options = {}) {
    const { enabled = true, ...filters } = options;
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['products-v2', 'grouped', filters],
        queryFn: async (): Promise<ProductsV2Response> => {
            try {
                console.log('[useProductsV2] Iniciando carga de productos...');
                
                // Cargar productos desde CSV
                const products = await productsV2Service.loadProductsFromCSV();
                console.log('[useProductsV2] Productos cargados:', products.length);

                if (products.length === 0) {
                    console.warn('[useProductsV2] No se encontraron productos');
                    return {
                        products: [],
                        total: 0,
                        rubros: [],
                        subrubros: [],
                    };
                }

                // Agrupar productos
                const grouped = productsV2Service.groupProductsByVariants(products);
                console.log('[useProductsV2] Productos agrupados:', grouped.length);

                // Extraer rubros y subrubros
                const { rubros, subrubros } = productsV2Service.extractRubrosAndSubrubros(products);
                console.log('[useProductsV2] Rubros:', rubros.length, 'Subrubros:', subrubros.length);

                // Aplicar filtros si existen
                const hasFilters = Object.keys(filters).length > 0;
                const filteredGrouped = hasFilters
                    ? productsV2Service.filterGroupedProducts(grouped, filters)
                    : grouped;

                console.log('[useProductsV2] Productos después de filtros:', filteredGrouped.length);

                return {
                    products: filteredGrouped,
                    total: filteredGrouped.length,
                    rubros,
                    subrubros,
                };
            } catch (error) {
                console.error('[useProductsV2] Error al cargar productos:', error);
                throw error;
            }
        },
        enabled,
        staleTime: 1000 * 60 * 10, // 10 minutos de cache
        gcTime: 1000 * 60 * 30, // 30 minutos en garbage collection
        retry: 2, // Reintentar 2 veces en caso de error
    });

    return {
        products: query.data?.products || [],
        rubros: query.data?.rubros || [],
        subrubros: query.data?.subrubros || [],
        total: query.data?.total || 0,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isFetched: query.isFetched,
    };
}

/**
 * Hook para buscar un grupo específico de producto V2
 * 
 * @example
 * ```tsx
 * const { group, isLoading } = useProductGroupV2('buzo-standard-unisex');
 * ```
 */
export function useProductGroupV2(identifier: string | null) {
    const query = useQuery({
        queryKey: ['products-v2', 'group', identifier],
        queryFn: async (): Promise<GroupedProductV2 | null> => {
            if (!identifier) return null;

            // Cargar productos desde CSV
            const products = await productsV2Service.loadProductsFromCSV();

            // Agrupar productos
            const grouped = productsV2Service.groupProductsByVariants(products);

            // Buscar el grupo específico
            const found = productsV2Service.findGroupedProduct(grouped, identifier);

            return found || null;
        },
        enabled: !!identifier,
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 30, // 30 minutos
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
 * Hook para obtener solo los productos sin agrupar
 */
export function useProductsV2Raw(options: { enabled?: boolean } = {}) {
    const { enabled = true } = options;

    const query = useQuery({
        queryKey: ['products-v2', 'raw'],
        queryFn: async (): Promise<ProductV2[]> => {
            return await productsV2Service.loadProductsFromCSV();
        },
        enabled,
        staleTime: 1000 * 60 * 10, // 10 minutos
        gcTime: 1000 * 60 * 30, // 30 minutos
    });

    return {
        products: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

/**
 * Hook para obtener rubros y subrubros
 */
export function useRubrosV2(options: { enabled?: boolean } = {}) {
    const { enabled = true } = options;

    const query = useQuery({
        queryKey: ['products-v2', 'rubros'],
        queryFn: async (): Promise<{ rubros: RubroV2[]; subrubros: SubrubroV2[] }> => {
            const products = await productsV2Service.loadProductsFromCSV();
            return productsV2Service.extractRubrosAndSubrubros(products);
        },
        enabled,
        staleTime: 1000 * 60 * 30, // 30 minutos (rubros cambian poco)
        gcTime: 1000 * 60 * 60, // 1 hora
    });

    return {
        rubros: query.data?.rubros || [],
        subrubros: query.data?.subrubros || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

/**
 * Hook para obtener estadísticas de productos V2
 */
export function useProductsV2Stats() {
    const query = useQuery({
        queryKey: ['products-v2', 'stats'],
        queryFn: async () => {
            const products = await productsV2Service.loadProductsFromCSV();
            const grouped = productsV2Service.groupProductsByVariants(products);

            const variantCounts = grouped.map(g => g.totalVariants);
            const totalVariants = variantCounts.reduce((sum, count) => sum + count, 0);
            const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
            const totalValue = products.reduce((sum, p) => sum + (p.precioLista * p.stock), 0);
            const avgPrice = products.length > 0
                ? products.reduce((sum, p) => sum + p.precioLista, 0) / products.length
                : 0;

            return {
                totalProducts: products.length,
                totalGroups: grouped.length,
                totalStock,
                totalValue,
                averageVariantsPerGroup: grouped.length > 0
                    ? totalVariants / grouped.length
                    : 0,
                maxVariants: Math.max(...variantCounts, 0),
                minVariants: Math.min(...variantCounts, 0),
                averagePrice: avgPrice,
            };
        },
        staleTime: 1000 * 60 * 10, // 10 minutos
        gcTime: 1000 * 60 * 30, // 30 minutos
    });

    return {
        stats: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
    };
}

