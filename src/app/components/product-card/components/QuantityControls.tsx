'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

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
                    className={`flex items-center justify-center space-x-2 rounded-lg font-medium transition-all duration-300 ${
                        isMobile ? 'w-full px-2 py-1.5 text-xs' : 'w-full sm:w-auto px-4 py-2.5 text-sm'
                    } bg-black text-white hover:bg-gray-800`}
                    onClick={onIncrement}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span>Elegir</span>
                </motion.button>
            </div>
        );
    }

    // Si no está en el carrito, mostrar botón para agregar primera unidad
    if (currentQuantity === 0) {
        return (
            <div className="flex flex-col gap-1 w-full sm:w-auto">
                <motion.button
                    className={`flex items-center justify-center space-x-2 rounded-lg font-medium transition-all duration-300 ${
                        isMobile ? 'w-full px-2 py-1.5 text-xs' : 'w-full sm:w-auto px-4 py-2.5 text-sm'
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
            <div className={`flex items-center justify-center gap-1.5 rounded-lg border-2 ${
                maxReached ? 'border-gray-300' : 'border-black'
            } ${isMobile ? 'w-full' : 'w-full sm:w-auto'}`}>
                {/* Botón Decremento */}
                <motion.button
                    className={`flex items-center justify-center rounded-l-lg font-bold transition-all duration-300 ${
                        isMobile ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'
                    } ${
                        currentQuantity <= 1
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-red-600'
                    }`}
                    onClick={onDecrement}
                    disabled={currentQuantity <= 1}
                    whileHover={currentQuantity > 1 ? { scale: 1.1 } : {}}
                    whileTap={currentQuantity > 1 ? { scale: 0.9 } : {}}
                >
                    <Minus className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                </motion.button>

                {/* Cantidad */}
                <div className={`flex items-center justify-center font-bold ${
                    maxReached ? 'text-gray-500' : 'text-black'
                } ${isMobile ? 'px-3 py-1.5 text-xs min-w-[2rem]' : 'px-4 py-2 text-sm min-w-[3rem]'}`}>
                    {currentQuantity}
                </div>

                {/* Botón Incremento */}
                <motion.button
                    className={`flex items-center justify-center rounded-r-lg font-bold transition-all duration-300 ${
                        isMobile ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'
                    } ${
                        !canAddMore || maxReached
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-red-600'
                    }`}
                    onClick={onIncrement}
                    disabled={!canAddMore || maxReached}
                    whileHover={canAddMore && !maxReached ? { scale: 1.1 } : {}}
                    whileTap={canAddMore && !maxReached ? { scale: 0.9 } : {}}
                >
                    <Plus className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                </motion.button>
            </div>
        </div>
    );
}

