/**
 * Hook para handlers del producto
 * Responsabilidad única: gestión de eventos y navegación
 */

import { useRouter } from 'next/navigation';
import type { ProductoPublicado } from '@/app/types/producto-publicado.types';

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

  // Stock por talle para el selector
  const variantStock = producto.variantes.reduce((acc, v) => {
    if (v.talle) acc[v.talle] = v.stock;
    return acc;
  }, {} as Record<string, number>);

  return {
    handleProductClick,
    handleVariantChange,
    variantStock,
  };
}

