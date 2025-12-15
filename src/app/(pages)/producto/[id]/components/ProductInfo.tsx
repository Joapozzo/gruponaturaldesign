"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ProductWithImage, ProductVariant } from '@/app/types/producto';
import { formatPrice, formatPriceWithoutIVA } from '../helpers/productHelpers';
import { getStockMessage } from '@/app/services/stockService';

interface ProductInfoProps {
    productName: string;
    displayProduct: ProductWithImage;
    selectedVariant: ProductVariant;
    price: number | null | undefined;
}

export default function ProductInfo({ productName, displayProduct, selectedVariant, price }: ProductInfoProps) {
    const formattedPrice = formatPrice(price);
    const priceWithoutIVA = formatPriceWithoutIVA(price);
    
    // Usar la descripción de la variante seleccionada (cambia con color/talle)
    const description = selectedVariant?.producto?.Descripcion || displayProduct.Descripcion;
    
    // Obtener mensaje de stock (sin mostrar número exacto)
    const stock = selectedVariant?.stock;
    const stockMessage = getStockMessage(stock);

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
                <div className="flex flex-col items-start space-y-1 mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        {formattedPrice}
                    </span>
                    {priceWithoutIVA && (
                        <span className="text-xs sm:text-sm text-gray-500">
                            {priceWithoutIVA}
                        </span>
                    )}
                    {/* Mensaje de stock bajo (sin mostrar número exacto) */}
                    {stockMessage && (
                        <span className={`text-xs sm:text-sm font-semibold mt-1 ${
                            stockMessage === 'ÚLTIMAS UNIDADES' 
                                ? 'text-orange-600' 
                                : 'text-red-600'
                        }`}>
                            {stockMessage}
                        </span>
                    )}
                </div>
                {/* Descripción completa del producto desde la variante seleccionada */}
                {description && (
                    <div className="mb-4 sm:mb-6">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 sm:mb-3">
                            Descripción
                        </h3>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                            {description}
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

