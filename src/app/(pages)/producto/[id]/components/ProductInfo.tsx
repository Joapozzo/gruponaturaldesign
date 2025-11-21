"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ProductWithImage } from '@/app/types/producto';
import { formatPrice } from '../helpers/productHelpers';

interface ProductInfoProps {
    productName: string;
    displayProduct: ProductWithImage;
    price: number | null | undefined;
}

export default function ProductInfo({ productName, displayProduct, price }: ProductInfoProps) {
    const formattedPrice = formatPrice(price);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
        >
            {/* Título y precio */}
            <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium text-gray-900 mb-2 sm:mb-3 font-display leading-tight">
                    {productName}
                </h1>
                <div className="flex items-baseline space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        {formattedPrice}
                    </span>
                </div>
                {/* Descripción completa del producto desde displayProduct */}
                {displayProduct.Descripcion && (
                    <div className="mb-4 sm:mb-6">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 sm:mb-3">
                            Descripción
                        </h3>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                            {displayProduct.Descripcion}
                        </p>
                    </div>
                )}
                {/* Material */}
                {displayProduct.Material && (
                    <div className="mb-4 sm:mb-6">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide mb-1.5 sm:mb-2">
                            Material
                        </h3>
                        <p className="text-gray-700 text-sm sm:text-base">
                            {displayProduct.Material}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

