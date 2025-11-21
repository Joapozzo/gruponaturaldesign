"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { GroupedProduct } from '@/app/types/producto';

interface RelatedProductsProps {
    relatedProducts: GroupedProduct[];
}

export default function RelatedProducts({ relatedProducts }: RelatedProductsProps) {
    const router = useRouter();

    if (relatedProducts.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-8 sm:mt-12 lg:mt-16"
        >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 text-center">
                Productos Relacionados
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                    <motion.div
                        key={relatedProduct.skuBase}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="group cursor-pointer"
                        onClick={() => {
                            const slug = relatedProduct.skuBaseSlug || relatedProduct.skuBase.toLowerCase().replace(/\s+/g, '-');
                            router.push(`/producto/${slug}`);
                        }}
                    >
                        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                            <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                                {(relatedProduct.displayProduct.imagen || (relatedProduct.displayProduct.imagenes && relatedProduct.displayProduct.imagenes.length > 0)) ? (
                                    <Image
                                        src={relatedProduct.displayProduct.imagen || relatedProduct.displayProduct.imagenes?.[0] || ''}
                                        alt={relatedProduct.displayProduct.Descripcion || relatedProduct.displayProduct.NOMBRE || 'Producto'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        width={300}
                                        height={300}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <Package className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="p-2 sm:p-3 lg:p-4">
                                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors text-xs sm:text-sm">
                                    {relatedProduct.displayProduct.NOMBRE || relatedProduct.skuBase || 'Sin nombre'}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                                    {relatedProduct.displayProduct.Rubro || 'Sin categoría'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

