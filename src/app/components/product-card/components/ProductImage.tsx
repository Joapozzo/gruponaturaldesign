'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

import { normalizeImageUrl } from '@/app/utils/normalizeImageUrl';

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  width = 400,
  height = 400,
  className = '',
  priority = false,
  fill = false,
  sizes,
  objectFit = 'cover',
}) => {
  // Normalizar la URL antes de usarla
  const normalizedSrc = useMemo(() => normalizeImageUrl(src), [src]);
  
  const [imgSrc, setImgSrc] = useState(normalizedSrc);
  const [hasError, setHasError] = useState(false);

  // Actualizar imgSrc si normalizedSrc cambia
  React.useEffect(() => {
    setImgSrc(normalizedSrc);
    setHasError(false);
  }, [normalizedSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(null);
    }
  };

  const imageProps = fill
    ? {
        fill: true,
        sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
        style: { objectFit },
      }
    : {
        width,
        height,
        style: { objectFit },
      };

  // Si hay error o no hay src, mostrar icono
  if (hasError || !imgSrc) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 flex items-center justify-center ${className}`} style={fill ? {} : { width, height }}>
        <Package className="w-12 h-12 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        {...imageProps}
        priority={priority}
        onError={handleError}
        className="transition-opacity duration-300"
      />
    </div>
  );
};

