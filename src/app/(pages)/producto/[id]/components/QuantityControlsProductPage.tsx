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
            <div className="mt-1 px-1 sm:px-0">
                <div className="flex flex-col sm:flex-row gap-1.5">
                    <motion.button
                        onClick={onIncrement}
                        disabled={disabled || isAdding || !canAddMore || maxReached}
                        className={`
                            flex-1 flex items-center justify-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg
                            font-medium text-[10px] sm:text-xs transition-all duration-300
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
                        <ShoppingCart className="w-3 h-3" />
                        <span>
                            {isAdding
                                ? 'AGREGADO!'
                                : maxReached
                                    ? 'LÍMITE ALCANZADO'
                                    : 'AGREGAR AL CARRITO'
                            }
                        </span>
                    </motion.button>

                    {/* Botón Quiero comprar por mayor */}
                    <motion.button
                        onClick={() => router.push('/mayorista')}
                        className="flex-1 flex items-center justify-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium text-[10px] sm:text-xs transition-all duration-300 bg-white border border-[#Ed3237] text-[#Ed3237] hover:bg-[#Ed3237] hover:text-white"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Users className="w-3 h-3" />
                        <span className="hidden sm:inline">QUIERO COMPRAR POR MAYOR</span>
                        <span className="sm:hidden">POR MAYOR</span>
                    </motion.button>
                </div>
            </div>
        );
    }

    // Si está en el carrito, mostrar controles de cantidad
    return (
        <div className="space-y-1.5 mt-1 px-1 sm:px-0">
            {/* Mensaje de límite de 20 artículos (mayorista) */}
            {maxReached && (
                <div className="w-full px-2 py-1.5 bg-red-50 border border-red-300 rounded text-center">
                    <p className="text-red-700 font-semibold text-[10px] sm:text-xs">
                        Límite alcanzado: máximo 20 artículos totales
                    </p>
                </div>
            )}
            
            {/* Mensaje de límite de stock */}
            {maxReachedStock && !maxReached && (
                <div className="w-full px-2 py-1.5 bg-orange-50 border border-orange-300 rounded text-center">
                    <p className="text-orange-700 font-semibold text-[10px] sm:text-xs">
                        Stock disponible alcanzado
                    </p>
                </div>
            )}
            
            {/* Controles de cantidad y botón mayorista en fila */}
            <div className="flex flex-col sm:flex-row gap-1.5">
                {/* Controles de cantidad - Achicado */}
                <div className="flex-1 flex justify-center bg-gray-50 border border-gray-200 rounded p-1.5 shadow-sm">
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
                    className="flex-1 sm:flex-initial sm:min-w-[120px] flex items-center justify-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium text-[10px] sm:text-xs transition-all duration-300 bg-white border border-[#Ed3237] text-[#Ed3237] hover:bg-[#Ed3237] hover:text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Users className="w-3 h-3" />
                    <span className="hidden sm:inline">QUIERO COMPRAR POR MAYOR</span>
                    <span className="sm:hidden">POR MAYOR</span>
                </motion.button>
            </div>
        </div>
    );
}

