import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RelatedProduct {
  skuBaseSlug?: string;
}

/**
 * Hook para hacer prefetch de productos relacionados
 * Prefetch los primeros 4 productos relacionados cuando estén disponibles
 */
export function useRelatedProductsPrefetch(relatedProducts: RelatedProduct[] | null | undefined) {
  const router = useRouter();

  useEffect(() => {
    if (relatedProducts && relatedProducts.length > 0) {
      relatedProducts.slice(0, 4).forEach((product) => {
        if (product.skuBaseSlug) {
          router.prefetch(`/producto/${product.skuBaseSlug}`);
        }
      });
    }
  }, [relatedProducts, router]);
}

