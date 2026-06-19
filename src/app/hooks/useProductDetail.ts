'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { GroupedProduct } from '@/app/types/producto';
import { productoDetailService, type ProductoDetailResponse } from '../services/producto-detail.service';
import { adaptProductoPadreToGroupedProduct } from '../utils/adaptProductoDetail';
import { getEmpresaId } from '../utils/getEmpresaId';
import { productDetailKeys } from '../utils/productDetailKeys';
import { findRelatedProductsForOutfit } from './useProductDetail.helpers';

const STALE_TIME_MS = 1000 * 60 * 5;   // 5 minutos
const GC_TIME_MS = 1000 * 60 * 30;     // 30 minutos

interface UseProductDetailOptions {
  initialData?: ProductoDetailResponse;
}

export function useProductDetail(options: UseProductDetailOptions = {}) {
  const params = useParams();
  const slug = decodeURIComponent((params.slug as string) || '');

  const query = useQuery({
    queryKey: productDetailKeys.detailBySlug(slug),
    queryFn: () =>
      productoDetailService.getBySlug({
        slug,
        empresaId: getEmpresaId(),
        includeVariantes: true,
      }),
    initialData: options.initialData,
    initialDataUpdatedAt: options.initialData ? Date.now() : undefined,
    enabled: !!slug,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const groupedProduct = useMemo<GroupedProduct | null>(() => {
    if (!query.data?.producto) return null;
    return adaptProductoPadreToGroupedProduct(query.data.producto);
  }, [query.data?.producto]);

  const relatedProducts = useMemo<GroupedProduct[]>(() => {
    if (!query.data?.relatedProducts?.length) return [];
    return query.data.relatedProducts.map(adaptProductoPadreToGroupedProduct);
  }, [query.data?.relatedProducts]);

  return {
    groupedProduct,
    relatedProducts,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error ? query.error : query.error ? new Error(String(query.error)) : null,
    refetch: query.refetch,
  };
}

export { findRelatedProductsForOutfit, OUTFIT_RELATIONS } from './useProductDetail.helpers';
