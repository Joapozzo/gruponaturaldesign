import React, { Suspense } from 'react';
import { HydrationBoundary } from '@tanstack/react-query';
import { dehydrate } from '@tanstack/react-query';
import { createSSRQueryClient } from '@/app/utils/createSSRQueryClient';
import { prefetchProductosPublicados } from '@/app/utils/prefetchProductosPublicados';
import CatalogContent from '@/app/components/catalog/CatalogContent';
// import LoadingState from '@/app/components/catalog/LoadingState';
import type { ProductoPublicadoQueryParams } from '@/app/types/producto-publicado.types';
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

  // Parsear parámetros de URL para prefetch (sin page/limit, se obtienen todos)
  const queryParams: Omit<ProductoPublicadoQueryParams, 'page' | 'limit'> = {
    search: params.search || undefined,
    rubroId: params.rubroId ? parseInt(params.rubroId, 10) : undefined,
    subrubroId: params.subrubroId
      ? parseInt(params.subrubroId, 10)
      : undefined,
    genero: params.genero || undefined,
    destacado: params.destacado === 'true' ? true : undefined,
    tieneStock: params.tieneStock === 'true' ? true : undefined,
    sortBy:
      params.sortBy &&
      ['destacado', 'nombre', 'precio', 'orden'].includes(params.sortBy)
        ? (params.sortBy as 'destacado' | 'nombre' | 'precio' | 'orden')
        : undefined,
    sortOrder:
      params.sortOrder && ['asc', 'desc'].includes(params.sortOrder)
        ? (params.sortOrder as 'asc' | 'desc')
        : undefined,
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
