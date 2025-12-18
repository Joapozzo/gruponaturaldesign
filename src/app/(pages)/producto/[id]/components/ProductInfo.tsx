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
    
    // Obtener precios adicionales
    const precioTransfer = selectedVariant?.producto?.precioTransfer || displayProduct.precioTransfer;
    const precio3cuotas = selectedVariant?.producto?.precio3cuotas || displayProduct.precio3cuotas;
    const precioSImp = selectedVariant?.producto?.precioSImp || displayProduct.precioSImp;
    
    const formattedTransfer = precioTransfer
        ? `$${precioTransfer.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
        : null;
    
    const formatted3Cuotas = precio3cuotas
        ? `$${precio3cuotas.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
        : null;
    
    const formattedSImp = precioSImp
        ? `$${precioSImp.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
        : null;
    
    // Usar la descripción completa del producto (descripcionCompleta)
    const description = selectedVariant?.producto?.descripcionCompleta || displayProduct.descripcionCompleta;
    
    // Obtener textiles del producto
    const textiles = selectedVariant?.producto?.textiles || displayProduct.textiles;
    
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
                    {/* Precio lista - más grande */}
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        {formattedPrice}
                    </span>
                    {/* Transfer y cuotas - más pequeños, lado a lado */}
                    {(formattedTransfer || formatted3Cuotas) && (
                        <div className="flex flex-row gap-3 mt-1">
                            {formattedTransfer && (
                                <span className="text-sm text-gray-600">
                                    Transfer: {formattedTransfer}
                                </span>
                            )}
                            {formatted3Cuotas && (
                                <span className="text-sm text-gray-600">
                                    3 cuotas: {formatted3Cuotas}
                                </span>
                            )}
                        </div>
                    )}
                    {/* Precio sin impuestos - más pequeño, abajo */}
                    {formattedSImp && (
                        <span className="text-xs sm:text-sm text-gray-500 mt-1">
                            Sin impuestos: {formattedSImp}
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
                {/* Descripción completa del producto */}
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
                {/* Textiles */}
                {textiles && (
                    <div className="mb-4 sm:mb-6">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 sm:mb-3">
                            Textiles
                        </h3>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                            {textiles}
                        </p>
                    </div>
                )}
                {/* Material (fallback si no hay textiles) */}
                {!textiles && displayProduct.Material && (
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

