'use client';

import React from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface SimpleProductCardImageProps {
  src: string;
  alt: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasMultipleImages?: boolean;
}

export default function SimpleProductCardImage({
  src,
  alt,
  onNext,
  onPrev,
  hasMultipleImages = false,
}: SimpleProductCardImageProps) {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Resetear error cuando cambia la imagen
  React.useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const placeholderImage = '/imgs/producto-placeholder.png';
  const imageSrc = hasError || !src || src.trim() === '' || src.includes('producto-placeholder') 
    ? placeholderImage 
    : src;

  return (
    <div className="relative overflow-hidden bg-gray-100 cursor-pointer flex-shrink-0 aspect-[3/4] min-h-[320px]">
      {hasError || imageSrc === placeholderImage ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <Package className="w-24 h-24 text-gray-400" />
        </div>
      ) : (
        <>
          <Image
            src={imageSrc}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            quality={85}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </>
      )}

      {/* Navegación de imágenes (si hay múltiples) */}
      {hasMultipleImages && !hasError && imageSrc !== placeholderImage && (
        <>
          {onPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all z-10"
              aria-label="Imagen anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          {onNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all z-10"
              aria-label="Imagen siguiente"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
}

