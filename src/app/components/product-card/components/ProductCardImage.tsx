'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Eye, Package } from 'lucide-react';
import { ProductWithImage } from '@/app/types/producto';

interface ProductCardImageProps {
    product: ProductWithImage;
    mainImage: string;
    hasValidImage: boolean;
    isHovered: boolean;
    isMobile: boolean;
    onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    onImageLoad: () => void;
    onClick: () => void;
    onQuickView: (e: React.MouseEvent) => void;
}

export default function ProductCardImage({
    product,
    mainImage,
    hasValidImage,
    isHovered,
    isMobile,
    onImageError,
    onImageLoad,
    onClick,
    onQuickView,
}: ProductCardImageProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-t-lg bg-gray-100 cursor-pointer flex-shrink-0 ${
                isMobile ? 'h-[240px]' : 'h-[450px]'
            }`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            aria-label={`Ver detalles de ${product.Descripcion || product.NOMBRE || 'producto'}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            {/* Siempre renderizar una imagen, incluso si es placeholder */}
            <motion.div
                className="relative w-full h-full"
                animate={
                    !isMobile
                        ? {
                              scale: isHovered ? 1.08 : 1,
                              filter: isHovered ? 'brightness(0.85)' : 'brightness(1)',
                          }
                        : {}
                }
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {!hasValidImage || mainImage.includes('producto-placeholder') || mainImage.includes('.png') ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Package className={`text-gray-400 ${isMobile ? 'w-16 h-16' : 'w-24 h-24'}`} />
                    </div>
                ) : (
                    <Image
                        src={mainImage}
                        alt={product.Descripcion || product.NOMBRE || 'Producto'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        quality={85}
                        onError={(e) => {
                            // Manejar error silenciosamente y mostrar Package icon
                            onImageError(e);
                        }}
                        onLoad={onImageLoad}
                        unoptimized={false}
                    />
                )}
            </motion.div>

            {/* Overlay gradient */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                animate={!isMobile ? { opacity: isHovered ? 1 : 0 } : { opacity: 0 }}
                transition={{ duration: 0.4 }}
            />

            {/* Botón de vista rápida */}
            <motion.div
                className={`absolute bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center ${
                    isMobile ? 'top-1 right-1 w-6 h-6' : 'top-5 right-3 w-10 h-10'
                }`}
                style={{ overflow: 'visible' }}
                animate={
                    !isMobile
                        ? {
                              scale: isHovered ? 1.05 : 1,
                              backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                              rotate: isHovered ? 10 : 0,
                          }
                        : {}
                }
                transition={{ duration: 0.4, ease: 'easeOut' }}
                onClick={onQuickView}
                role="button"
                tabIndex={0}
                aria-label="Vista rápida del producto"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onQuickView(e as any);
                    }
                }}
            >
                <Eye className={isMobile ? 'w-4 h-4 text-white' : 'w-5 h-5 text-white'} aria-hidden="true" />
            </motion.div>

            {/* Información overlay en hover - Solo desktop */}
            {!isMobile && (
                <motion.div
                    className="absolute bottom-3 left-3 right-3 text-white"
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : 15,
                    }}
                    transition={{ duration: 0.4, delay: isHovered ? 0.1 : 0 }}
                >
                    <div className="flex items-center justify-between">
                        <motion.span
                            className="text-xs font-semibold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg"
                            animate={{
                                scale: isHovered ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {(() => {
                                let rubro = product.Rubro || 'Sin categoría';
                                // Quitar "PRODUCTO" del inicio
                                if (rubro.toUpperCase().startsWith('PRODUCTO ')) {
                                    rubro = rubro.substring(9); // Quitar "PRODUCTO "
                                }
                                // Normalizar: OFFICE → BASIC
                                if (rubro.toUpperCase().includes('OFFICE')) {
                                    return 'BASIC';
                                }
                                return rubro;
                            })()}
                        </motion.span>
                        <motion.div
                            className="flex items-center space-x-1 text-xs font-semibold"
                            animate={{
                                x: isHovered ? 5 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <span>VER</span>
                            <ArrowRight size={12} />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

