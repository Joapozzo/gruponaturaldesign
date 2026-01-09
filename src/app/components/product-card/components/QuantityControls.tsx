'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import QuantityControlsUI from '@/app/components/ui/QuantityControls';

interface QuantityControlsProps {
    productId: number;
    currentQuantity: number;
    isAdding: boolean;
    isExactVariantInCart: boolean;
    hasColorSizeData: boolean;
    isExpanded: boolean;
    selectedColor: string | null;
    selectedSize: string | null;
    totalVariants: number;
    isMobile: boolean;
    onIncrement: (e: React.MouseEvent) => void;
    onDecrement: (e: React.MouseEvent) => void;
    canAddMore: boolean;
    maxReached: boolean;
}

export default function QuantityControls({
    productId,
    currentQuantity,
    isAdding,
    isExactVariantInCart,
    hasColorSizeData,
    isExpanded,
    selectedColor,
    selectedSize,
    totalVariants,
    isMobile,
    onIncrement,
    onDecrement,
    canAddMore,
    maxReached,
}: QuantityControlsProps) {
    const isDisabled = isExpanded && hasColorSizeData && (!selectedColor || !selectedSize);
    const needsSelection = (hasColorSizeData && (!selectedColor || !selectedSize)) || (totalVariants > 1 && !isExpanded);

    // Si necesita selección, mostrar botón para expandir
    if (needsSelection) {
        return (
            <div className="flex flex-col gap-1 w-full sm:w-auto">
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
                    className={`flex items-center justify-center space-x-1 rounded font-medium transition-all duration-300 ${
                        isMobile ? 'w-full px-4 py-2.5 text-sm' : 'w-full sm:w-auto px-3 py-1.5 text-xs'
                    } bg-black text-white hover:bg-gray-800`}
                    onClick={onIncrement}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span>Agregar</span>
                </motion.button>
            </div>
        );
    }

    // Si no está en el carrito, mostrar botón para agregar primera unidad
    if (currentQuantity === 0) {
        return (
            <div className="flex flex-col gap-1 w-full sm:w-auto">
                <motion.button
                    className={`flex items-center justify-center space-x-1 rounded font-medium transition-all duration-300 ${
                        isMobile ? 'w-full px-4 py-2.5 text-sm' : 'w-full sm:w-auto px-3 py-1.5 text-xs'
                    } ${isAdding ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
                    onClick={onIncrement}
                    disabled={isAdding}
                    whileHover={!isAdding ? { scale: 1.05 } : {}}
                    whileTap={!isAdding ? { scale: 0.95 } : {}}
                    animate={isAdding ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    <span>{isAdding ? 'Agregado!' : 'Agregar'}</span>
                </motion.button>
            </div>
        );
    }

    // Si está en el carrito, mostrar controles de cantidad
    return (
        <div className="flex flex-col gap-1 w-full sm:w-auto">
            {maxReached && (
                <span className={`text-red-600 font-medium ${isMobile ? 'text-xs' : 'text-xs'}`}>
                    Límite alcanzado
                </span>
            )}
            <div className={`flex justify-center ${isMobile ? 'w-full' : 'w-full sm:w-auto'}`}>
                <QuantityControlsUI
                    quantity={currentQuantity}
                    onIncrement={(e) => onIncrement(e || ({} as React.MouseEvent))}
                    onDecrement={(e) => onDecrement(e || ({} as React.MouseEvent))}
                    canAddMore={canAddMore}
                    maxReached={maxReached}
                />
            </div>
        </div>
    );
}

