"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/app/components/ui/Button';
import Section from '@/app/components/Section';
import { GroupedProduct, ProductWithImage } from '@/app/types/producto';

interface ProductHeaderProps {
    groupedProduct: GroupedProduct;
    displayProduct: ProductWithImage;
}

export default function ProductHeader({ groupedProduct, displayProduct }: ProductHeaderProps) {
    const router = useRouter();

    return (
        <Section
            id="product-header"
            className="bg-gray-50"
            contentClassName="max-w-7xl mx-auto"
            noPadding
        >
            <div className="py-3 sm:py-4 lg:py-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
                >
                    <div className="mb-4 lg:mb-0">
                        {/* Breadcrumb */}
                        <nav className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
                            <Link href="/" className="hover:text-gray-900 transition-colors">
                                Inicio
                            </Link>
                            <span>/</span>
                            <Link href="/catalogo" className="hover:text-gray-900 transition-colors">
                                Shop Online
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium truncate max-w-xs">
                                {groupedProduct.skuBase || displayProduct.NOMBRE}
                            </span>
                        </nav>

                        {/* Badge de categoría */}
                        {/* <div className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800 mb-1 sm:mb-2">
                            {displayProduct.Rubro || 'Sin categoría'}
                        </div> */}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="grayOutline"
                            size="sm"
                            onClick={() => router.back()}
                            className="inline-flex items-center space-x-2"
                        >
                            <ArrowLeft size={16} />
                            <span>Volver</span>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}

