/**
 * Prefetch de productos publicados para SSR
 * Obtiene TODOS los productos (hace paginación automática)
 */

import { QueryClient } from '@tanstack/react-query';
import { productoPublicadoService } from '../services/producto-publicado.service';
import { productosPublicadosKeys } from '../hooks/productosPublicadosKeys';
import type { ProductoPublicadoQueryParams } from '../types/producto-publicado.types';

interface PrefetchProductosPublicadosParams {
  params?: Omit<ProductoPublicadoQueryParams, 'page' | 'limit'>;
}

/**
 * Prefetch de TODOS los productos publicados para SSR
 * Hace múltiples requests automáticamente para obtener todos los productos
 */
export async function prefetchProductosPublicados(
  queryClient: QueryClient,
  options: PrefetchProductosPublicadosParams = {}
) {
  const { params = {} } = options;

  await queryClient.prefetchQuery({
    queryKey: [...productosPublicadosKeys.all, 'all', params],
    queryFn: () => productoPublicadoService.getAllPublicados(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
  });
}

