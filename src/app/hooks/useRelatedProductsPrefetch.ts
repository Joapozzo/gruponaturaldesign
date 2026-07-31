import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RelatedProduct {
  slug?: string | null;
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
        if (product.slug) {
          router.prefetch(`/producto/${product.slug}`);
        }
      });
    }
  }, [relatedProducts, router]);
}

