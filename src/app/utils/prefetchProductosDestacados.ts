import { QueryClient } from '@tanstack/react-query';
import { productoPublicadoService } from '@/app/services/producto-publicado.service';
import { productosDestacadosKeys } from '@/app/hooks/productosPublicadosKeys';
import type { ProductoPublicadoQueryParams } from '@/app/types/producto-publicado.types';
import { prefetchWithTimeout } from './prefetchWithTimeout';

interface PrefetchProductosDestacadosParams {
  page?: number;
  limit?: number;
  tieneStock?: boolean;
  timeoutMs?: number;
}

/**
 * Prefetch de productos destacados para SSR (con timeout opcional).
 * @returns true si el prefetch terminó a tiempo; false si hubo timeout.
 */
export async function prefetchProductosDestacados(
  queryClient: QueryClient,
  params?: PrefetchProductosDestacadosParams
): Promise<boolean> {
  const { timeoutMs, ...queryOptions } = params ?? {};
  const queryParams: Omit<ProductoPublicadoQueryParams, 'destacado'> = {
    page: queryOptions.page ?? 1,
    limit: queryOptions.limit ?? 20,
    tieneStock: queryOptions.tieneStock,
  };

  const queryKey = productosDestacadosKeys.list(queryParams);

  return prefetchWithTimeout(async () => {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn: () => productoPublicadoService.getDestacados(queryParams),
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos
    });
  }, timeoutMs);
}

