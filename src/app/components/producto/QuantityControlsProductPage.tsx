'use client';

import React from 'react';
import { ShoppingCart, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import QuantityControlsUI from '@/app/components/ui/QuantityControls';
import Button from '@/components/ui/Button';
import NewsletterOutOfStockForm from '@/app/components/newsletter/NewsletterOutOfStockForm';

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
    outOfStock?: boolean; // Sin stock: deshabilitar agregar y mostrar mensaje
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
    outOfStock = false,
}: QuantityControlsProductPageProps) {
    const router = useRouter();

    // Si no está en el carrito, mostrar botón para agregar primera unidad (mismo Button que ui/Button, más grandes)
    if (currentQuantity === 0) {
        const cannotAdd = disabled || isAdding || !canAddMore || maxReached || outOfStock;
        if (outOfStock) {
            return (
                <div className="mt-1 sm:px-0">
                    <NewsletterOutOfStockForm />
                    <div className="mt-3">
                        <Button
                            onClick={() => router.push('/mayorista')}
                            variant="brandRedOutline"
                            size="xl"
                            fullWidth
                        >
                            <Users className="w-5 h-5" />
                            <span className="hidden sm:inline">QUIERO COMPRAR POR MAYOR</span>
                            <span className="sm:hidden">POR MAYOR</span>
                        </Button>
                    </div>
                </div>
            );
        }
        return (
            <div className="mt-1 sm:px-0">
                {outOfStock && (
                    <div className="w-full px-2 py-1.5 bg-gray-100 border border-gray-300 rounded text-center mb-2">
                        <p className="text-gray-700 font-semibold text-[10px] sm:text-xs">
                            Sin stock disponible
                        </p>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={onIncrement}
                        disabled={cannotAdd}
                        variant={isAdding ? 'brandRed' : cannotAdd ? 'gray' : 'black'}
                        size="xl"
                        fullWidth
                        className="flex-1"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>
                            {isAdding
                                ? 'AGREGADO!'
                                : outOfStock
                                    ? 'SIN STOCK'
                                    : maxReached
                                        ? 'LÍMITE ALCANZADO'
                                        : 'AGREGAR AL CARRITO'
                            }
                        </span>
                    </Button>

                    <Button
                        onClick={() => router.push('/mayorista')}
                        variant="brandRedOutline"
                        size="xl"
                        fullWidth
                        className="flex-1"
                    >
                        <Users className="w-5 h-5" />
                        <span className="hidden sm:inline">QUIERO COMPRAR POR MAYOR</span>
                        <span className="sm:hidden">POR MAYOR</span>
                    </Button>
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
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex justify-center bg-gray-50 border border-gray-200 rounded-lg p-2 shadow-sm">
                    <QuantityControlsUI
                        quantity={currentQuantity}
                        onIncrement={onIncrement}
                        onDecrement={onDecrement}
                        canAddMore={canAddMore}
                        maxReached={maxReached}
                        disabled={disabled}
                    />
                </div>

                <Button
                    onClick={() => router.push('/mayorista')}
                    variant="brandRedOutline"
                    size="xl"
                    className="sm:min-w-[180px]"
                >
                    <Users className="w-5 h-5" />
                    <span className="hidden sm:inline">QUIERO COMPRAR POR MAYOR</span>
                    <span className="sm:hidden">POR MAYOR</span>
                </Button>
            </div>
        </div>
    );
}

