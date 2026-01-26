/**
 * Grid de productos usando ProductCardPublicado
 * Componente atomizado para renderizar productos publicados
 */

'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import type { ProductoPublicado } from '@/app/types/producto-publicado.types';
import ProductCardPublicado from '../ProductCardPublicado';

interface ProductsGridPublicadosProps {
  products: ProductoPublicado[];
  expandedSku?: string | null;
  onExpandChange?: (sku: string | null) => void;
}

/**
 * Grid de productos publicados
 * Renderiza productos usando ProductCardPublicado
 */
const ProductsGridPublicados: React.FC<ProductsGridPublicadosProps> = ({
  products,
  expandedSku,
  onExpandChange,
}) => {
  // Memoizar el handler de expansión
  const handleExpandChange = useCallback(
    (sku: string | null) => {
      onExpandChange?.(sku);
    },
    [onExpandChange]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-4 items-start"
    >
      {products.map((producto, index) => (
        <ProductCardPublicado
          key={producto.id}
          producto={producto}
          index={index}
          expandedSku={expandedSku}
          onExpandChange={handleExpandChange}
        />
      ))}
    </motion.div>
  );
};

// Optimizar con React.memo
export default React.memo(ProductsGridPublicados, (prevProps, nextProps) => {
  // Si expandedSku cambió, re-renderizar
  if (prevProps.expandedSku !== nextProps.expandedSku) return false;

  // Si la cantidad de productos cambió, re-renderizar
  if (prevProps.products.length !== nextProps.products.length) return false;

  // Comparar IDs de productos para detectar cambios
  const prevIds = prevProps.products.map((p) => p.id).join(',');
  const nextIds = nextProps.products.map((p) => p.id).join(',');

  return prevIds === nextIds;
});

