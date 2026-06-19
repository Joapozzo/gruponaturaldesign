'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProductCardSkeletonProps {
  index?: number;
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ index = 0 }) => {
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
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Header - Nombre y precio */}
        <div className="mb-2">
          <div className="mb-1">
            <div className="h-4 w-full bg-gray-300 rounded animate-pulse mb-1" />
            <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse" />
          </div>
          <div className="h-5 w-20 bg-gray-300 rounded animate-pulse mt-1" />
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

