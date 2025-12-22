"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/app/components/ui/Button';
import { GroupedProduct, ProductWithImage } from '@/app/types/producto';

interface ProductHeaderProps {
    groupedProduct: GroupedProduct;
    displayProduct: ProductWithImage;
}

export default function ProductHeader({ groupedProduct, displayProduct }: ProductHeaderProps) {
    const router = useRouter();

    return (
        <div className="w-full pt-4 relative">
            <div className="w-full max-w-[1600px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-1.5 sm:py-1.5"
                >
                    <div className="mb-2 lg:mb-0">
                        {/* Breadcrumb */}
                        <nav className="flex items-center space-x-1 text-[10px] sm:text-xs text-gray-600 mb-1">
                            <Link href="/" className="hover:text-gray-900 transition-colors">
                                Inicio
                            </Link>
                            <span>/</span>
                            <Link href="/shoponline" className="hover:text-gray-900 transition-colors">
                                Shop Online
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium truncate max-w-xs">
                                {groupedProduct.skuBase || displayProduct.NOMBRE}
                            </span>
                        </nav>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="grayOutline"
                            size="sm"
                            onClick={() => router.back()}
                            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs"
                        >
                            <ArrowLeft size={14} />
                            <span>Volver</span>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

