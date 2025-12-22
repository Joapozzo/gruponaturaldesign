'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import QuantityControlsUI from '@/app/components/ui/QuantityControls';

interface QuantityControlsProductPageProps {
    currentQuantity: number;
    isAdding: boolean;
    isInCart: boolean;
    canAddMore: boolean;
    maxReached: boolean;
    maxReachedStock?: boolean; // Límite de stock alcanzado
    onIncrement: () => void;
    onDecrement: () => void;
    disabled?: boolean;
}

export default function QuantityControlsProductPage({
    currentQuantity,
    isAdding,
    isInCart,
    canAddMore,
    maxReached,
    maxReachedStock = false,
    onIncrement,
    onDecrement,
    disabled = false,
}: QuantityControlsProductPageProps) {
    const router = useRouter();

    // Si no está en el carrito, mostrar botón para agregar primera unidad
    if (currentQuantity === 0) {
        return (
            <div className="mt-2">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <motion.button
                        onClick={onIncrement}
                        disabled={disabled || isAdding || !canAddMore || maxReached}
                        className={`
                            flex-1 flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg
                            font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300
                            ${isAdding
                                ? 'bg-green-600 text-white'
                                : !canAddMore || maxReached
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800'
                            }
                        `}
                        whileHover={!disabled && !isAdding && canAddMore && !maxReached ? { scale: 1.02 } : {}}
                        whileTap={!disabled && !isAdding && canAddMore && !maxReached ? { scale: 0.98 } : {}}
                        animate={isAdding ? { scale: [1, 1.05, 1] } : {}}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>
                            {isAdding
                                ? 'AGREGADO AL CARRITO!'
                                : maxReached
                                    ? 'LÍMITE ALCANZADO'
                                    : 'AGREGAR AL CARRITO'
                            }
                        </span>
                    </motion.button>

                    {/* Botón Quiero comprar por mayor */}
                    <motion.button
                        onClick={() => router.push('/mayorista')}
                        className="flex-1 flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 bg-white border-2 border-[#Ed3237] text-[#Ed3237] hover:bg-[#Ed3237] hover:text-white"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Users className="w-5 h-5" />
                        <span>QUIERO COMPRAR POR MAYOR</span>
                    </motion.button>
                </div>
            </div>
        );
    }

    // Si está en el carrito, mostrar controles de cantidad
    return (
        <div className="space-y-2 sm:space-y-3 mt-2">
            {/* Mensaje de límite de 20 artículos (mayorista) */}
            {maxReached && (
                <div className="w-full px-4 py-3 bg-red-50 border-2 border-red-300 rounded-lg shadow-sm">
                    <p className="text-red-700 font-semibold text-sm sm:text-base text-center">
                        Límite alcanzado: máximo 20 artículos totales
                    </p>
                </div>
            )}
            
            {/* Mensaje de límite de stock */}
            {maxReachedStock && !maxReached && (
                <div className="w-full px-4 py-3 bg-orange-50 border-2 border-orange-300 rounded-lg shadow-sm">
                    <p className="text-orange-700 font-semibold text-sm sm:text-base text-center">
                        Stock disponible alcanzado
                    </p>
                </div>
            )}
            
            {/* Controles de cantidad y botón mayorista en fila */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {/* Controles de cantidad - Agrandado y con mejor contraste */}
                <div className="flex-1 flex justify-center bg-gray-50 border-2 border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                    <QuantityControlsUI
                        quantity={currentQuantity}
                        onIncrement={onIncrement}
                        onDecrement={onDecrement}
                        canAddMore={canAddMore}
                        maxReached={maxReached}
                        disabled={disabled}
                    />
                </div>

                {/* Botón Quiero comprar por mayor */}
                <motion.button
                    onClick={() => router.push('/mayorista')}
                    className="flex-1 sm:flex-initial sm:min-w-[200px] flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 bg-white border-2 border-[#Ed3237] text-[#Ed3237] hover:bg-[#Ed3237] hover:text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Users className="w-5 h-5" />
                    <span className="hidden sm:inline">QUIERO COMPRAR POR MAYOR</span>
                    <span className="sm:hidden">POR MAYOR</span>
                </motion.button>
            </div>
        </div>
    );
}

