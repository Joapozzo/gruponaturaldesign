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
    // const router = useRouter();

    return (
        <div className="w-full pt-10 sm:pt-12 md:pt-14 relative">
            <div className="w-full px-4 lg:px-15">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-3 py-1.5 sm:py-2"
                >
                    {/* Flecha Volver arriba del breadcrumb */}
                    {/* <div className="flex justify-start">
                        <Button
                            variant="grayOutline"
                            size="sm"
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-1.5"
                        >
                            <ArrowLeft size={14} />
                            <span>Volver</span>
                        </Button>
                    </div> */}
                    {/* Breadcrumb */}
                    <nav className="flex items-center flex-wrap gap-x-1 text-xs sm:text-sm text-gray-600">
                        <Link href="/" className="hover:text-gray-900 transition-colors">
                            Inicio
                        </Link>
                        <span>/</span>
                        <Link href="/shoponline" className="hover:text-gray-900 transition-colors">
                            Shop Online
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium truncate max-w-[12rem] sm:max-w-xs">
                            {groupedProduct.skuBase || displayProduct.NOMBRE}
                        </span>
                    </nav>
                </motion.div>
            </div>
        </div>
    );
}

