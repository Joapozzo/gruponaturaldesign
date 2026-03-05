import React, { Suspense } from 'react';
import { HydrationBoundary } from '@tanstack/react-query';
import { dehydrate } from '@tanstack/react-query';
import { createSSRQueryClient } from '@/app/utils/createSSRQueryClient';
import { prefetchProductosPublicados } from '@/app/utils/prefetchProductosPublicados';
import CatalogContent from '@/app/components/catalog/CatalogContent';
// import LoadingState from '@/app/components/catalog/LoadingState';
import {
  type ProductoPublicadoQueryParams,
  DEFAULT_PRODUCTOS_PUBLICADOS_PARAMS,
} from '@/app/types/producto-publicado.types';
import ProductsGridSkeleton from '@/app/components/skeleton/ProductsGridSkeleton';

interface ShopOnlinePageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    rubroId?: string;
    subrubroId?: string;
    genero?: string;
    destacado?: string;
    tieneStock?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function ShopOnlinePage({
  searchParams,
}: ShopOnlinePageProps) {
  const params = await searchParams;

  // Mismos defaults que CatalogContent (useProductosPublicadosAll) para que la query key coincida
  const queryParams: Omit<ProductoPublicadoQueryParams, 'page' | 'limit'> = {
    ...DEFAULT_PRODUCTOS_PUBLICADOS_PARAMS,
    searchTerm: params.search ?? DEFAULT_PRODUCTOS_PUBLICADOS_PARAMS.searchTerm,
    search: params.search ?? DEFAULT_PRODUCTOS_PUBLICADOS_PARAMS.search,
    rubroId: params.rubroId ? parseInt(params.rubroId, 10) : undefined,
    subrubroId: params.subrubroId
      ? parseInt(params.subrubroId, 10)
      : undefined,
    genero: params.genero || DEFAULT_PRODUCTOS_PUBLICADOS_PARAMS.genero,
    destacado:
      params.destacado === 'true'
        ? true
        : params.destacado === 'false'
          ? false
          : DEFAULT_PRODUCTOS_PUBLICADOS_PARAMS.destacado,
    tieneStock:
      params.tieneStock === 'true'
        ? true
        : params.tieneStock === 'false'
          ? false
          : DEFAULT_PRODUCTOS_PUBLICADOS_PARAMS.tieneStock,
    sortBy:
      params.sortBy &&
      ['destacado', 'nombre', 'precio', 'orden'].includes(params.sortBy)
        ? (params.sortBy as 'destacado' | 'nombre' | 'precio' | 'orden')
        : DEFAULT_PRODUCTOS_PUBLICADOS_PARAMS.sortBy,
    sortOrder:
      params.sortOrder && ['asc', 'desc'].includes(params.sortOrder)
        ? (params.sortOrder as 'asc' | 'desc')
        : DEFAULT_PRODUCTOS_PUBLICADOS_PARAMS.sortOrder,
  };

  // Crear QueryClient para SSR
  const queryClient = createSSRQueryClient();

  // Prefetch de productos publicados
  await prefetchProductosPublicados(queryClient, {
    params: queryParams,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductsGridSkeleton />}>
        <CatalogContent />
      </Suspense>
    </HydrationBoundary>
  );
}
