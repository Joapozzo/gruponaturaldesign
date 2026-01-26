'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProductCardSkeletonProps {
  index?: number;
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ index = 0 }) => {
  // Opcionalmente mostrar badge destacado en algunos skeletons (para variedad visual)
  const showBadge = index === 0 || index === 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Imagen del producto - aspect-square */}
      <div className="relative aspect-square cursor-pointer overflow-hidden rounded-t-lg">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        
        {/* Badge destacado skeleton (opcional, para variedad visual) */}
        {showBadge && (
          <div className="absolute top-2 right-2 z-10">
            <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse" />
          </div>
        )}
        
        {/* Badges inferiores skeleton (pueden aparecer opcionalmente) */}
        {index === 1 && (
          <div className="absolute bottom-2 left-2 z-10 flex flex-col gap-1">
            <div className="h-5 w-16 bg-gray-300 rounded animate-pulse" />
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Header - Precios y nombre */}
        <div className="mb-2">
          {/* Precio lista skeleton */}
          <div className="mb-1 flex items-center gap-2">
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
          </div>
          
          {/* Nombre skeleton - 2 líneas posibles */}
          <div className="mb-1">
            <div className="h-4 w-full bg-gray-300 rounded animate-pulse mb-1" />
            <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse" />
          </div>
          
          {/* Precio sin impuestos skeleton */}
          <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse mt-1" />
        </div>

        {/* Cantidad de colores skeleton */}
        <div className="mb-2">
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Acciones skeleton - Botón de agregar */}
        <div className="mt-2">
          <div className="w-full h-10 bg-gray-300 rounded-lg animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCardSkeleton;

