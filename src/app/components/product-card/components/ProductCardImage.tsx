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
    stockMessage?: string | null;
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
    stockMessage,
}: ProductCardImageProps) {
    return (
        <div
            className={`relative overflow-hidden bg-gray-100 cursor-pointer flex-shrink-0 ${
                isMobile ? 'h-[220px]' : 'h-[280px]'
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

            {/* Mensaje de stock - sobre la imagen arriba */}
            {stockMessage && (
                <div className="absolute top-2 left-2 z-10">
                    <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${
                        stockMessage === 'ÚLTIMAS UNIDADES' 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-red-500 text-white'
                    }`}>
                        {stockMessage}
                    </span>
                </div>
            )}

            {/* Botón de vista rápida */}
            <motion.div
                className={`absolute bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center ${
                    isMobile ? 'top-1 right-1 w-5 h-5' : 'top-2 right-2 w-7 h-7'
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
                <Eye className={isMobile ? 'w-3 h-3 text-white' : 'w-4 h-4 text-white'} aria-hidden="true" />
            </motion.div>

            {/* Información overlay en hover - Solo desktop */}
            {!isMobile && (
                <motion.div
                    className="absolute bottom-2 left-2 right-2 text-white"
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : 10,
                    }}
                    transition={{ duration: 0.4, delay: isHovered ? 0.1 : 0 }}
                >
                    <div className="flex items-center justify-between">
                        <motion.span
                            className="text-[9px] font-semibold bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-lg"
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
                            className="flex items-center space-x-0.5 text-[9px] font-semibold"
                            animate={{
                                x: isHovered ? 3 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <span>VER</span>
                            <ArrowRight size={10} />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

