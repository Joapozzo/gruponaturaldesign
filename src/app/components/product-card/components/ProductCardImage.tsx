/**
 * Componente atomizado para la imagen del producto
 */

'use client';

import React from 'react';
import SimpleProductCardImage from './SimpleProductCardImage';
import { ProductWithImage } from '@/app/types/producto';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

interface ProductCardImageProps {
  // Props para ProductCardGrouped
  product?: ProductWithImage;
  mainImage?: string;
  hasValidImage?: boolean;
  isHovered?: boolean;
  isMobile?: boolean;
  onImageError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onImageLoad?: () => void;
  onClick?: () => void;
  onQuickView?: (e: React.MouseEvent) => void;
  stockMessage?: string;
  // Props originales (para compatibilidad)
  src?: string;
  alt?: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasMultipleImages?: boolean;
}

export const ProductCardImage: React.FC<ProductCardImageProps> = ({
  product,
  mainImage,
  hasValidImage = true,
  isHovered = false,
  isMobile = false,
  onImageError,
  onImageLoad,
  onClick,
  onQuickView,
  stockMessage,
  // Props originales
  src,
  alt,
  onNext,
  onPrev,
  hasMultipleImages = false,
}) => {
  // Determinar qué props usar
  const imageSrc = mainImage || src || '';
  const imageAlt = alt || product?.Descripcion || product?.NOMBRE || product?.Codigo || 'Producto';
  const hasMultiple = hasMultipleImages || (product?.imagenes && product.imagenes.length > 1);

  return (
    <div 
      className="relative cursor-pointer" 
      onClick={onClick}
    >
      <SimpleProductCardImage
        src={imageSrc}
        alt={imageAlt}
        onNext={hasMultiple ? onNext : undefined}
        onPrev={hasMultiple ? onPrev : undefined}
        hasMultipleImages={hasMultiple}
      />
      
      {/* Botón de vista rápida - Solo si se proporciona */}
      {onQuickView && !isMobile && (
        <motion.div
          className="absolute top-5 right-3 w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center z-10"
          style={{ overflow: 'visible' }}
          animate={{
            scale: isHovered ? 1.05 : 1,
            backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.2)',
            rotate: isHovered ? 10 : 0,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={onQuickView}
        >
          <Eye className="w-4 h-4 text-white" />
        </motion.div>
      )}

      {/* Mensaje de stock - Solo si se proporciona */}
      {stockMessage && (
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
          {stockMessage}
        </div>
      )}
    </div>
  );
};
