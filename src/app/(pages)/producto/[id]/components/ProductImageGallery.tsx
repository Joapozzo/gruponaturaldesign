"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import DriveImageGallery from '@/app/components/DriveImageGallery';
import { ProductWithImage } from '@/app/types/producto';

interface ProductImageGalleryProps {
    product: ProductWithImage;
    productName: string;
    images: string[];
    currentImageIndex: number;
    onImageChange: (index: number) => void;
    onNext: () => void;
    onPrev: () => void;
    onOpenModal: () => void;
}

export default function ProductImageGallery({
    product,
    productName,
    images,
    currentImageIndex,
    onImageChange,
    onNext,
    onPrev,
    onOpenModal,
}: ProductImageGalleryProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
        >
            {/* Mostrar imágenes desde Drive si hay URL */}
            {product.fotosDriveUrl ? (
                <DriveImageGallery
                    driveFolderUrl={product.fotosDriveUrl}
                    productName={productName}
                />
            ) : (
                /* Fallback: mostrar galería local con miniaturas */
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    {/* Imagen principal */}
                    <div className="relative group">
                        <div
                            className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                            onClick={onOpenModal}
                        >
                            {images.length > 0 && images[currentImageIndex] ? (
                                <>
                                    <Image
                                        src={images[currentImageIndex]}
                                        alt={`${productName} - Imagen ${currentImageIndex + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        width={600}
                                        height={600}
                                    />
                                    {/* Botón para expandir */}
                                    {images.length > 1 && (
                                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition-all duration-300">
                                            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </div>
                                    )}
                                    {/* Navegación con flechas si hay más de una imagen */}
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onPrev();
                                                }}
                                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                aria-label="Imagen anterior"
                                            >
                                                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onNext();
                                                }}
                                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                aria-label="Siguiente imagen"
                                            >
                                                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <Package className="w-20 h-20 text-gray-400" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Miniaturas de imágenes */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2">
                            {images.map((img, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => onImageChange(index)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                        currentImageIndex === index
                                            ? 'border-black ring-2 ring-black ring-offset-2'
                                            : 'border-gray-200 hover:border-gray-400'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={`Ver imagen ${index + 1}`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${productName} - Miniatura ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        width={120}
                                        height={120}
                                    />
                                    {/* Overlay cuando está seleccionada */}
                                    {currentImageIndex === index && (
                                        <div className="absolute inset-0 bg-black/20" />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}

