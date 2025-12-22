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
    hideTitle?: boolean;
}

export default function ProductInfo({ productName, displayProduct, selectedVariant, price, hideTitle = false }: ProductInfoProps) {
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
            className="space-y-2 sm:space-y-3"
        >
            {/* Título y precio */}
            <div className="w-full">
                {!hideTitle && (
                    <h1 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-1 font-display leading-tight">
                        {productName}
                    </h1>
                )}
                <div className="flex flex-col items-start space-y-0.5 mb-3">
                    {/* Precio lista - más grande */}
                    <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
                        {formattedPrice}
                    </span>
                    {/* Transfer y cuotas - más pequeños, lado a lado */}
                    {(formattedTransfer || formatted3Cuotas) && (
                        <div className="flex flex-row gap-2 mt-0.5">
                            {formattedTransfer && (
                                <span className="text-[10px] sm:text-xs text-gray-600">
                                    Transfer: {formattedTransfer}
                                </span>
                            )}
                            {formatted3Cuotas && (
                                <span className="text-[10px] sm:text-xs text-gray-600">
                                    3 cuotas: {formatted3Cuotas}
                                </span>
                            )}
                        </div>
                    )}
                    {/* Precio sin impuestos - más pequeño, abajo */}
                    {formattedSImp && (
                        <span className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                            Sin impuestos: {formattedSImp}
                        </span>
                    )}
                    {/* Mensaje de stock bajo (sin mostrar número exacto) */}
                    {stockMessage && (
                        <span className={`text-[10px] sm:text-xs font-semibold mt-0.5 ${
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
                    <div className="mb-2">
                        <h3 className="text-[10px] sm:text-xs font-bold text-gray-900 uppercase tracking-wide mb-0.5">
                            Descripción
                        </h3>
                        <p className="text-gray-700 text-[10px] sm:text-xs leading-relaxed">
                            {description}
                        </p>
                    </div>
                )}
                {/* Textiles */}
                {textiles && (
                    <div className="mb-1.5">
                        <h3 className="text-[10px] sm:text-xs font-bold text-gray-900 uppercase tracking-wide mb-0.5">
                            Textiles
                        </h3>
                        <p className="text-gray-700 text-[10px] sm:text-xs leading-relaxed">
                            {textiles}
                        </p>
                    </div>
                )}
                {/* Material (fallback si no hay textiles) */}
                {!textiles && displayProduct.Material && (
                    <div className="mb-1.5">
                        <h3 className="text-[10px] sm:text-xs font-bold text-gray-900 uppercase tracking-wide mb-0.5">
                            Material
                        </h3>
                        <p className="text-gray-700 text-[10px] sm:text-xs">
                            {displayProduct.Material}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

