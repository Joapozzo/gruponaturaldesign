import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { GroupedProduct } from '@/app/types/producto';
import { productoDetailService, type ProductoDetailResponse } from '../services/producto-detail.service';
import { adaptProductoPadreToGroupedProduct } from '../utils/adaptProductoDetail';
import { getEmpresaId } from '../utils/getEmpresaId';
import { findRelatedProductsForOutfit } from './useProductDetail.helpers';

interface UseProductDetailOptions {
  initialData?: ProductoDetailResponse;
}

export function useProductDetail(options: UseProductDetailOptions = {}) {
  const params = useParams();
  const slug = decodeURIComponent((params.slug as string) || '');
  
  const [groupedProduct, setGroupedProduct] = useState<GroupedProduct | null>(() => {
    // Inicializar con initialData si está disponible
    if (options.initialData?.producto) {
      return adaptProductoPadreToGroupedProduct(options.initialData.producto);
    }
    return null;
  });
  
  const [relatedProducts, setRelatedProducts] = useState<GroupedProduct[]>(() => {
    // Inicializar productos relacionados desde initialData
    if (options.initialData?.relatedProducts) {
      return options.initialData.relatedProducts.map(adaptProductoPadreToGroupedProduct);
    }
    return [];
  });
  
  const [isLoading, setIsLoading] = useState(!options.initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Si ya tenemos initialData, no hacer fetch
    if (options.initialData) {
      return;
    }

    // Si no hay slug, no hacer nada
    if (!slug) {
      setIsLoading(false);
      return;
    }

    // Fetch en cliente si no hay initialData
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const empresaId = getEmpresaId();
        const data = await productoDetailService.getBySlug({
          slug,
          empresaId,
          includeVariantes: true,
        });
        
        setGroupedProduct(adaptProductoPadreToGroupedProduct(data.producto));
        setRelatedProducts(
          data.relatedProducts.map(adaptProductoPadreToGroupedProduct)
        );
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error al cargar producto'));
        setGroupedProduct(null);
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug, options.initialData]);

  return {
    groupedProduct,
    relatedProducts,
    isLoading,
    error,
  };
}

// Re-exportar helpers para compatibilidad
export { findRelatedProductsForOutfit, OUTFIT_RELATIONS } from './useProductDetail.helpers';
