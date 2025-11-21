"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Image as ImageIcon, Ruler, FileText } from 'lucide-react';
import { ProductWithImage } from '@/app/types/producto';

interface ProductResourcesProps {
    product: ProductWithImage;
}

export default function ProductResources({ product }: ProductResourcesProps) {
    if (!product.fotosDriveUrl && !product.tablaTallesUrl && !product.indicacionesBordadosUrl) {
        return null;
    }

    return (
        <div className="space-y-2 sm:space-y-3">
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
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

                {product.tablaTallesUrl && (
                    <motion.a
                        href={product.tablaTallesUrl}
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
                )}

                {product.indicacionesBordadosUrl && (
                    <motion.a
                        href={product.indicacionesBordadosUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 group mb-4"
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
                            </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-[#Ed3237] transition-colors flex-shrink-0" />
                    </motion.a>
                )}
            </div>
        </div>
    );
}

