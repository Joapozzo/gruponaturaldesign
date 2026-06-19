/**
 * Hook para obtener TODOS los productos publicados (sin límite de paginación)
 * Hace múltiples requests automáticamente para obtener todos los productos
 * Útil cuando necesitas todos los productos para filtrar en cliente
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { productoPublicadoService } from '../services/producto-publicado.service';
import { productosPublicadosKeys } from './productosPublicadosKeys';
import type {
  ProductoPublicadoQueryParams,
  ProductoPublicado,
  PaginationInfo,
} from '../types/producto-publicado.types';

interface UseProductosPublicadosAllOptions
  extends Omit<ProductoPublicadoQueryParams, 'page' | 'limit'> {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

/**
 * Hook para obtener TODOS los productos publicados
 * Hace paginación automática internamente (múltiples requests)
 * 
 * @param options Parámetros de query (sin page/limit, se manejan internamente)
 * @returns Query con todos los productos, paginación y estados
 * 
 * @example
 * ```tsx
 * const { productos, isLoading } = useProductosPublicadosAll({
 *   destacado: true
 * });
 * ```
 */
export function useProductosPublicadosAll(
  options: UseProductosPublicadosAllOptions = {}
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
    queryKey: [...productosPublicadosKeys.all, 'all', params],
    queryFn: () => productoPublicadoService.getAllPublicados(params),
    enabled,
    staleTime,
    gcTime,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
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

