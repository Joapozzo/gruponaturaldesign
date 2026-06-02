/**
 * Hook para handlers del producto
 * Responsabilidad única: gestión de eventos y navegación
 */

import { useRouter } from 'next/navigation';
import type { ProductoPublicado } from '@/app/types/producto-publicado.types';
import { buildVariantStockMap } from '@/app/utils/variantePublicada.utils';

interface UseProductCardHandlersProps {
  producto: ProductoPublicado;
  setSelectedColor: (color: string) => void;
  setSelectedTalle: (talle: string) => void;
}

interface UseProductCardHandlersReturn {
  handleProductClick: () => void;
  handleVariantChange: (codigo: string) => void;
  variantStock: Record<string, number>;
}

export function useProductCardHandlers({
  producto,
  setSelectedColor,
  setSelectedTalle,
}: UseProductCardHandlersProps): UseProductCardHandlersReturn {
  const router = useRouter();

  const handleProductClick = () => {
    if (producto.slug) {
      router.push(`/producto/${producto.slug}`);
    }
  };

  const handleVariantChange = (codigo: string) => {
    if (!producto.variantes || producto.variantes.length === 0) {
      return;
    }
    const variant = producto.variantes.find((v) => v.codigo === codigo);
    if (variant) {
      if (variant.color) setSelectedColor(variant.color);
      if (variant.talle) setSelectedTalle(variant.talle);
    }
  };

  const variantStock = buildVariantStockMap(producto.variantes);

  return {
    handleProductClick,
    handleVariantChange,
    variantStock,
  };
}

