"use client";
import React from 'react';
import { ShoppingCart, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';

interface ProductAddToCartProps {
    onAddToCart: () => void;
    isAdding: boolean;
    isInCart: boolean;
    disabled?: boolean;
}

export default function ProductAddToCart({
    onAddToCart,
    isAdding,
    isInCart,
    disabled = false,
}: ProductAddToCartProps) {
    const router = useRouter();

    return (
        <div className="space-y-3 sm:space-y-4 mt-4">
            <Button
                onClick={onAddToCart}
                disabled={disabled || isAdding}
                variant={isAdding ? 'brandRed' : isInCart ? 'slate' : 'black'}
                size="xl"
                fullWidth
                className="space-x-2 sm:space-x-3"
            >
                <ShoppingCart className="w-5 h-5" />
                <span>
                    {isAdding
                        ? 'AGREGADO AL CARRITO!'
                        : isInCart
                            ? 'VER CARRITO'
                            : 'AGREGAR AL CARRITO'
                    }
                </span>
            </Button>

            {/* Botón Quiero comprar por mayor */}
            <Button
                onClick={() => router.push('/mayorista')}
                variant="brandRedOutline"
                size="xl"
                fullWidth
                className="space-x-2 sm:space-x-3"
            >
                <Users className="w-5 h-5" />
                <span>QUIERO COMPRAR POR MAYOR</span>
            </Button>
        </div>
    );
}

