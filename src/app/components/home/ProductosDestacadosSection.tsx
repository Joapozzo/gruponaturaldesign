import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createSSRQueryClient } from '@/app/utils/createSSRQueryClient';
import { prefetchProductosDestacados } from '@/app/utils/prefetchProductosDestacados';
import ProductosDestacados from '@/app/components/ProductosDestacados';

const DESTACADOS_LIMIT = 20;

/**
 * Server Component async: prefetch de destacados en streaming (Suspense).
 * Si el API tarda más del timeout, la home igual renderiza y el cliente completa la carga.
 */
export default async function ProductosDestacadosSection() {
  const queryClient = createSSRQueryClient();

  await prefetchProductosDestacados(queryClient, {
    limit: DESTACADOS_LIMIT,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductosDestacados />
    </HydrationBoundary>
  );
}
