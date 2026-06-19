
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

// Data URL placeholder para no hacer request a /imgs/producto-placeholder.png (evitar 404)
const PLACEHOLDER_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+U2luIGltYWdlbjwvdGV4dD48L3N2Zz4=';

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
  // Normalizar la URL antes de usarla; si es placeholder, usar data URL para evitar 404
  const normalizedSrc = useMemo(() => {
    const url = normalizeImageUrl(src);
    if (url && (url.includes('producto-placeholder') || url === '/imgs/producto-placeholder.png')) {
      return PLACEHOLDER_DATA_URL;
    }
    return url;
  }, [src]);
  
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

  const isDataUrl = typeof imgSrc === 'string' && imgSrc.startsWith('data:');
  const isRemoteUrl =
    typeof imgSrc === 'string' &&
    (imgSrc.startsWith('http://') || imgSrc.startsWith('https://'));

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        {...imageProps}
        priority={priority}
        unoptimized={isDataUrl || isRemoteUrl}
        onError={handleError}
        className="transition-opacity duration-300"
      />
    </div>
  );
};

