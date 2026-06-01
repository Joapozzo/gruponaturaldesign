"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ProductImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    currentImageIndex: number;
    productName: string;
    onNext?: () => void;
    onPrev?: () => void;
}

export default function ProductImageModal({
    isOpen,
    onClose,
    images,
    currentImageIndex,
    productName,
    onNext,
    onPrev,
}: ProductImageModalProps) {
    const [imageError, setImageError] = useState(false);

    // Resetear error cuando cambia la imagen
    React.useEffect(() => {
        setImageError(false);
    }, [currentImageIndex, isOpen]);

    // Navegar a la imagen anterior
    const handlePrev = useCallback(() => {
        if (onPrev) {
            onPrev();
        }
    }, [onPrev]);

    // Navegar a la imagen siguiente
    const handleNext = useCallback(() => {
        if (onNext) {
            onNext();
        }
    }, [onNext]);

    // Manejar teclado para navegación
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowLeft' && onPrev) {
                handlePrev();
            } else if (e.key === 'ArrowRight' && onNext) {
                handleNext();
            } else if (e.key === 'Escape') {
                onClose();
            }
        },
        [isOpen, onPrev, onNext, handlePrev, handleNext, onClose]
    );

    // Agregar listener de teclado
    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    const hasMultipleImages = images.length > 1;
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="relative w-full h-full max-w-7xl flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative inline-flex max-w-full max-h-[calc(100vh-2rem)]">
                            {images.length > 0 && images[currentImageIndex] && !imageError ? (
                                <Image
                                    src={images[currentImageIndex]}
                                    alt={`${productName} - Imagen expandida`}
                                    className="w-auto h-auto max-w-full max-h-[calc(100vh-2rem)] object-contain rounded-lg"
                                    width={1200}
                                    height={1200}
                                    unoptimized={true}
                                    onError={() => {
                                        setImageError(true);
                                    }}
                                />
                            ) : (
                                <div className="w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center bg-gray-200 rounded-lg">
                                    <Package className="w-24 h-24 text-gray-400" />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute top-2 right-2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors z-20"
                                aria-label="Cerrar"
                            >
                                <X size={20} />
                            </button>

                            {hasMultipleImages && (
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs z-20 pointer-events-none">
                                    {currentImageIndex + 1} de {images.length}
                                </div>
                            )}
                        </div>

                        {/* Botón anterior */}
                        {hasMultipleImages && onPrev && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrev();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors z-10"
                                aria-label="Imagen anterior"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}

                        {/* Botón siguiente */}
                        {hasMultipleImages && onNext && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors z-10"
                                aria-label="Imagen siguiente"
                            >
                                <ChevronRight size={24} />
                            </button>
                        )}

                        {/* Áreas táctiles para navegación en móvil - izquierda y derecha */}
                        {hasMultipleImages && (
                            <>
                                {onPrev && (
                                    <div
                                        className="absolute left-0 top-0 bottom-0 w-1/4 cursor-pointer md:hidden z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePrev();
                                        }}
                                        aria-label="Imagen anterior"
                                    />
                                )}
                                {onNext && (
                                    <div
                                        className="absolute right-0 top-0 bottom-0 w-1/4 cursor-pointer md:hidden z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNext();
                                        }}
                                        aria-label="Imagen siguiente"
                                    />
                                )}
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

