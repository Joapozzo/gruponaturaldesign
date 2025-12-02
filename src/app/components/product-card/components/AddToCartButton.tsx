'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
    isAdding: boolean;
    isExactVariantInCart: boolean;
    isInCartGeneric: boolean;
    hasColorSizeData: boolean;
    isExpanded: boolean;
    selectedColor: string | null;
    selectedSize: string | null;
    totalVariants: number;
    isMobile: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export default function AddToCartButton({
    isAdding,
    isExactVariantInCart,
    isInCartGeneric,
    hasColorSizeData,
    isExpanded,
    selectedColor,
    selectedSize,
    totalVariants,
    isMobile,
    onClick,
}: AddToCartButtonProps) {
    const isDisabled = isExpanded && hasColorSizeData && (!selectedColor || !selectedSize);
    const needsSelection = (hasColorSizeData && (!selectedColor || !selectedSize)) || (totalVariants > 1 && !isExpanded);

    const getButtonText = () => {
        if (isAdding) return 'Agregado!';
        if (isExactVariantInCart) return 'Sumar';
        if (isInCartGeneric) return 'En carrito';
        if (hasColorSizeData && isExpanded && (!selectedColor || !selectedSize)) return 'Selecciona opciones';
        if (needsSelection) return 'Elegir';
        return 'Agregar';
    };

    const getButtonClass = () => {
        if (isAdding) return 'bg-green-600 text-white';
        if (isExactVariantInCart) return 'bg-red-600 text-white hover:bg-red-700';
        if (isInCartGeneric) return 'bg-gray-800 text-white';
        if (isDisabled) return 'bg-gray-400 text-white cursor-not-allowed opacity-60';
        return 'bg-black text-white hover:bg-gray-800';
    };

    return (
        <div className="flex flex-col gap-1 w-full sm:w-auto">
            {/* Mensaje de error cuando falta seleccionar */}
            {isExpanded && hasColorSizeData && (!selectedColor || !selectedSize) && (
                <span className={`text-red-600 font-medium ${isMobile ? 'text-xs' : 'text-xs'}`}>
                    {!selectedColor && !selectedSize
                        ? 'Selecciona color y talle'
                        : !selectedColor
                          ? 'Selecciona un color'
                          : 'Selecciona un talle'}
                </span>
            )}

            <motion.button
                className={`flex items-center justify-center space-x-2 rounded-lg font-medium transition-all duration-300 ${
                    isMobile ? 'w-full px-2 py-1.5 text-xs' : 'w-full sm:w-auto px-4 py-2.5 text-sm'
                } ${getButtonClass()}`}
                onClick={onClick}
                disabled={isDisabled}
                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                animate={isAdding ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
            >
                <ShoppingCart className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                <span>{getButtonText()}</span>
            </motion.button>
        </div>
    );
}

