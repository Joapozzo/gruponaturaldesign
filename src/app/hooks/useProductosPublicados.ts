/**
 * Hook para productos publicados (ecommerce)
 * Con cache optimizado y invalidaciones
 */

'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productoPublicadoService } from '../services/producto-publicado.service';
import {
  productosPublicadosKeys,
  productosDestacadosKeys,
} from './productosPublicadosKeys';
import type {
  ProductoPublicadoQueryParams,
  ProductoPublicado,
  PaginationInfo,
} from '../types/producto-publicado.types';

// ============================================
// Hook Principal
// ============================================

interface UseProductosPublicadosOptions extends ProductoPublicadoQueryParams {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

/**
 * Hook para obtener productos publicados
 * 
 * @param options Parámetros de query y opciones de React Query
 * @returns Query con productos publicados, paginación y estados
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useProductosPublicados({
 *   page: 1,
 *   limit: 20,
 *   destacado: true
 * });
 * ```
 */
export function useProductosPublicados(
  options: UseProductosPublicadosOptions = {}
) {
  const {
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minutos por defecto
    gcTime = 1000 * 60 * 30, // 30 minutos en garbage collection
    ...params
  } = options;

  const query = useQuery<
    { productos: ProductoPublicado[]; pagination: PaginationInfo },
    Error
  >({
    queryKey: productosPublicadosKeys.list(params),
    queryFn: () => productoPublicadoService.getPublicados(params),
    enabled,
    staleTime, // Tiempo antes de considerar datos stale
    gcTime, // Tiempo antes de remover de cache
    refetchOnMount: false, // No refetch si hay datos en cache
    refetchOnWindowFocus: false, // No refetch al cambiar de ventana
    refetchOnReconnect: false, // No refetch al reconectar
    retry: 2, // Reintentar 2 veces en caso de error
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  return {
    productos: query.data?.productos || [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

// ============================================
// Utils para invalidar cache
// ============================================

/**
 * Hook para invalidar cache de productos publicados
 * Útil después de mutations que afectan productos publicados
 */
export function useInvalidateProductosPublicados() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ 
      queryKey: productosPublicadosKeys.all 
    });
  };

  const invalidateList = (params?: ProductoPublicadoQueryParams) => {
    queryClient.invalidateQueries({ 
      queryKey: productosPublicadosKeys.list(params) 
    });
  };

  const removeAll = () => {
    queryClient.removeQueries({ 
      queryKey: productosPublicadosKeys.all 
    });
  };

  const refetchAll = () => {
    queryClient.refetchQueries({ 
      queryKey: productosPublicadosKeys.all 
    });
  };

  return {
    invalidateAll,
    invalidateList,
    removeAll,
    refetchAll,
  };
}

// ============================================
// Hook para Productos Destacados
// ============================================

/**
 * Hook para obtener productos destacados publicados
 * Usa el endpoint dedicado /api/productos/destacados
 * 
 * @param options Parámetros de query y opciones de React Query (destacado se fuerza a true)
 * @returns Query con productos destacados, paginación y estados
 * 
 * @example
 * ```tsx
 * const { productos, isLoading } = useProductosDestacados({
 *   page: 1,
 *   limit: 10
 * });
 * ```
 */
export function useProductosDestacados(
  options: Omit<UseProductosPublicadosOptions, 'destacado'> = {}
) {
  const {
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minutos por defecto
    gcTime = 1000 * 60 * 30, // 30 minutos en garbage collection
    ...params
  } = options;

  const query = useQuery<
    { productos: ProductoPublicado[]; pagination: PaginationInfo },
    Error
  >({
    queryKey: productosDestacadosKeys.list(params),
    queryFn: () => productoPublicadoService.getDestacados(params),
    enabled,
    staleTime,
    gcTime,
    refetchOnMount: false, // No refetch automático para evitar loops
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      // No reintentar si es error de conexión (servidor no disponible)
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status?: number };
        // Si es error de conexión (status 0) o 5xx, reintentar máximo 1 vez
        if (apiError.status === 0 || (apiError.status && apiError.status >= 500)) {
          return failureCount < 1;
        }
      }
      // Para otros errores, reintentar máximo 2 veces
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    productos: query.data?.productos || [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}


