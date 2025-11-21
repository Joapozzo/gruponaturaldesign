"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package } from 'lucide-react';
import Image from 'next/image';

interface ProductImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    currentImageIndex: number;
    productName: string;
}

export default function ProductImageModal({
    isOpen,
    onClose,
    images,
    currentImageIndex,
    productName,
}: ProductImageModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="relative max-w-4xl max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {images.length > 0 && images[currentImageIndex] ? (
                            <Image
                                src={images[currentImageIndex]}
                                alt={`${productName} - Imagen expandida`}
                                className="max-w-full max-h-full object-contain rounded-lg"
                                width={800}
                                height={800}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                <Package className="w-24 h-24 text-gray-400" />
                            </div>
                        )}

                        {/* Botón cerrar */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

