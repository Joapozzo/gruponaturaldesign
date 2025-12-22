"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Image as ImageIcon, Ruler, FileText, X } from 'lucide-react';
import { ProductWithImage } from '@/app/types/producto';
import Image from 'next/image';
import { getProductBordadosImage } from '@/app/data/bordadosMappings';

interface ProductResourcesProps {
    product: ProductWithImage;
}

export default function ProductResources({ product }: ProductResourcesProps) {
    const [isBordadosModalOpen, setIsBordadosModalOpen] = useState(false);
    const [isTallesModalOpen, setIsTallesModalOpen] = useState(false);

    // Obtener imagen de bordados correspondiente al producto
    const bordadosImageUrl = getProductBordadosImage(product);

    if (!product.fotosDriveUrl && !product.tablaTallesUrl && !product.tablaTallesImage && !product.indicacionesBordadosUrl) {
        return null;
    }

    return (
        <>
            <div className="space-y-1.5 sm:space-y-2">
                <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                    {product.fotosDriveUrl && (
                        <motion.a
                            href={product.fotosDriveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                                        Ver Fotos del Producto
                                    </p>
                                    <p className="text-xs text-gray-600 hidden sm:block">
                                        Galería completa en Drive
                                    </p>
                                </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-[#Ed3237] transition-colors flex-shrink-0" />
                        </motion.a>
                    )}

                    {/* Tabla de Talles - Priorizar imagen local sobre link externo */}
                    {(product.tablaTallesImage || product.tablaTallesUrl) && (
                        product.tablaTallesImage ? (
                            // Si hay imagen local, mostrarla en modal
                            <motion.button
                                onClick={() => setIsTallesModalOpen(true)}
                                className="flex items-center justify-between p-2.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 group mt-4 w-full text-left"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                                            Tabla de Talles
                                        </p>
                                        <p className="text-xs text-gray-600 hidden sm:block">
                                            Guía de medidas y talles
                                        </p>
                                    </div>
                                </div>
                                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-[#Ed3237] transition-colors flex-shrink-0" />
                            </motion.button>
                        ) : (
                            // Si solo hay URL externa, abrir en nueva pestaña
                            <motion.a
                                href={product.tablaTallesUrl!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 group mt-4"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                                            Tabla de Talles
                                        </p>
                                        <p className="text-xs text-gray-600 hidden sm:block">
                                            Guía de medidas y talles
                                        </p>
                                    </div>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-[#Ed3237] transition-colors flex-shrink-0" />
                            </motion.a>
                        )
                    )}

                    {product.indicacionesBordadosUrl && (
                        <motion.button
                            onClick={() => setIsBordadosModalOpen(true)}
                            className="flex items-center justify-between p-2.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 group mb-4 w-full text-left"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                                        Indicaciones para bordados
                                    </p>
                                    <p className="text-xs text-gray-600 hidden sm:block">
                                        Guía de personalización
                                    </p>
                                    <p className="text-xs text-red-500">
                                        <span className="font-bold text-red-500">¡Atención!</span> Los bordados tienen costo adicional.
                                    </p>
                                </div>
                            </div>
                            <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-[#Ed3237] transition-colors flex-shrink-0" />
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Modal para mostrar la imagen de tabla de talles */}
            <AnimatePresence>
                {isTallesModalOpen && product.tablaTallesImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsTallesModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative w-full h-full max-w-7xl flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Image
                                    src={product.tablaTallesImage}
                                    alt="Tabla de Talles"
                                    className="w-auto h-auto max-w-full max-h-[calc(100vh-2rem)] object-contain rounded-lg"
                                    width={1200}
                                    height={1600}
                                    unoptimized={true}
                                />
                            </div>

                            {/* Botón cerrar */}
                            <button
                                onClick={() => setIsTallesModalOpen(false)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal para mostrar la imagen de indicaciones de bordados */}
            <AnimatePresence>
                {isBordadosModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsBordadosModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative w-full h-full max-w-7xl flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Image
                                    src={bordadosImageUrl}
                                    alt="Indicaciones para bordados"
                                    className="w-auto h-auto max-w-full max-h-[calc(100vh-2rem)] object-contain rounded-lg"
                                    width={1200}
                                    height={1200}
                                    unoptimized={true}
                                />
                            </div>

                            {/* Botón cerrar */}
                            <button
                                onClick={() => setIsBordadosModalOpen(false)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

