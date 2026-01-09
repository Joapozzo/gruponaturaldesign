import React, { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import PageHeader from '@/components/admin/PageHeader';
import { ProductosTableClient } from '@/app/components/admin/productos/ProductosTableClient';
import { ProductosPageActions } from '@/app/components/admin/productos/ProductosPageActions';
import { AdminTableSkeleton } from '@/app/components/admin/AdminTableSkeleton';
import { getEmpresaId } from '@/app/utils/getEmpresaId';
import { parseTableSearchParams } from '@/app/utils/parseTableSearchParams';
import { createSSRQueryClient } from '@/app/utils/createSSRQueryClient';
import { prefetchProductosTable } from '@/app/utils/prefetchProductosTable';
import type { ProductosFilters } from '@/app/filters/hooks/useProductosFilters';

interface AdminProductosPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    rubroId?: string;
    subrubroId?: string;
    sexo?: string;
    color?: string;
    talle?: string;
    stockMin?: string;
    stockMax?: string;
    orderBy?: string;
    orderDirection?: string;
  }>;
}

/**
 * Página de administración de productos (Server Component)
 * Solo resuelve datos, prefetch y renderiza estructura
 */
export default async function AdminProductosPage({ searchParams }: AdminProductosPageProps) {
  const empresaId = getEmpresaId();
  const params = await searchParams;
  const { page, limit, search } = parseTableSearchParams(params);

  // Parsear filtros de URL para prefetch
  const filters: Partial<ProductosFilters> = {};
  const rubroId = params.rubroId;
  if (rubroId) filters.rubroId = parseInt(rubroId, 10);
  const subrubroId = params.subrubroId;
  if (subrubroId) filters.subrubroId = parseInt(subrubroId, 10);
  if (params.sexo) filters.sexo = params.sexo;
  if (params.color) filters.color = params.color;
  if (params.talle) filters.talle = params.talle;
  const stockMin = params.stockMin;
  if (stockMin) filters.stockMin = parseInt(stockMin, 10);
  const stockMax = params.stockMax;
  if (stockMax) filters.stockMax = parseInt(stockMax, 10);
  if (params.orderBy && (params.orderBy === 'name' || params.orderBy === 'price')) {
    filters.orderBy = params.orderBy;
  }
  if (params.orderDirection && (params.orderDirection === 'asc' || params.orderDirection === 'desc')) {
    filters.orderDirection = params.orderDirection;
  }

  // Crear QueryClient para SSR
  const queryClient = createSSRQueryClient();

  // Prefetch de datos
  await prefetchProductosTable(queryClient, {
    empresaId,
    page,
    limit,
    search,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageHeader
        title="Productos"
        description="Gestiona tus productos y sus variantes"
        action={<ProductosPageActions empresaId={empresaId} />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Productos' },
        ]}
      />

      <Suspense fallback={<AdminTableSkeleton />}>
        <ProductosTableClient empresaId={empresaId} />
      </Suspense>
    </HydrationBoundary>
  );
}
