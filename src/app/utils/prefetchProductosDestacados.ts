import { QueryClient } from '@tanstack/react-query';
import { productoPublicadoService } from '@/app/services/producto-publicado.service';
import { productosDestacadosKeys } from '@/app/hooks/productosPublicadosKeys';
import type { ProductoPublicadoQueryParams } from '@/app/types/producto-publicado.types';

interface PrefetchProductosDestacadosParams {
  page?: number;
  limit?: number;
  tieneStock?: boolean;
}

/**
 * Prefetch de productos destacados para SSR
 */
export async function prefetchProductosDestacados(
  queryClient: QueryClient,
  params?: PrefetchProductosDestacadosParams
) {
  const queryParams: Omit<ProductoPublicadoQueryParams, 'destacado'> = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 20,
    tieneStock: params?.tieneStock,
  };

  const queryKey = productosDestacadosKeys.list(queryParams);

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => productoPublicadoService.getDestacados(queryParams),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
  });
}

