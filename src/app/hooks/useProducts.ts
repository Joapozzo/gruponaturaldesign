import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '../services/productsService';
import { ProductFilters } from '../types/producto';
import { queryKeys } from '../lib/queryKeys';
import { useMemo } from 'react';

/**
 * Hook principal para manejar productos
 */
export const useProducts = (filters?: ProductFilters) => {
    const queryClient = useQueryClient();

    // Query para obtener todos los productos
    const {
        data: allProducts = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: queryKeys.products.lists(),
        queryFn: async () => {
            // Primero intenta cargar desde la API (Google Sheets)
            const apiProducts = await productsService.loadProductsFromAPI();
            if (apiProducts && apiProducts.length > 0) {
                // Guardar en localStorage como backup
                productsService.saveProductsToLocalStorage(apiProducts);
                return apiProducts;
            }
            
            // Si falla la API, intenta cargar desde localStorage
            const cached = productsService.loadProductsFromLocalStorage();
            if (cached) return cached;
            
            return [];
        },
        staleTime: 1000 * 60 * 5, // 5 minutos (se actualiza automáticamente desde Google Sheets)
        refetchOnWindowFocus: true, // Refrescar cuando vuelves a la pestaña
    });

    // Productos filtrados (memoizado para performance)
    const filteredProducts = useMemo(() => {
        if (!filters) return allProducts;
        return productsService.filterProducts(allProducts, filters);
    }, [allProducts, filters]);

    // Mutation para cargar productos desde archivo
    const uploadProductsMutation = useMutation({
        mutationFn: async (file: File) => {
            const products = await productsService.parseProductsFile(file);
            return products;
        },
        onSuccess: (products) => {
            // Guardar en cache y localStorage
            queryClient.setQueryData(queryKeys.products.lists(), products);
            productsService.saveProductsToLocalStorage(products);
        },
    });

    // Mutation para limpiar productos
    const clearProductsMutation = useMutation({
        mutationFn: async () => {
            productsService.clearProductsCache();
        },
        onSuccess: () => {
            queryClient.setQueryData(queryKeys.products.lists(), []);
        },
    });

    return {
        // Data
        products: filteredProducts,
        allProducts,
        totalProducts: allProducts.length,
        filteredCount: filteredProducts.length,

        // States
        isLoading,
        isError,
        error,

        // Actions
        uploadProducts: uploadProductsMutation.mutate,
        isUploading: uploadProductsMutation.isPending,
        uploadError: uploadProductsMutation.error,
        clearProducts: clearProductsMutation.mutate,
        refetch,
    };
};

/**
 * Hook para obtener un producto específico por código
 */
export const useProduct = (code: string) => {
    const { allProducts } = useProducts();

    const product = useMemo(() => {
        return productsService.findProductByCode(allProducts, code);
    }, [allProducts, code]);

    return {
        product,
        isLoading: false,
        isError: !product,
    };
};

/**
 * Hook para obtener rubros únicos
 */
export const useProductRubros = () => {
    const { allProducts } = useProducts();

    const rubros = useMemo(() => {
        return productsService.getUniqueRubros(allProducts);
    }, [allProducts]);

    return { rubros, isLoading: false };
};

/**
 * Hook para obtener subrubros únicos
 */
export const useProductSubrubros = () => {
    const { allProducts } = useProducts();

    const subrubros = useMemo(() => {
        return productsService.getUniqueSubrubros(allProducts);
    }, [allProducts]);

    return { subrubros, isLoading: false };
};