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
        <div className="space-y-2 sm:space-y-2.5 mt-3 sm:max-w-[200px] lg:max-w-[180px] lg:space-y-2">
            <Button
                onClick={onAddToCart}
                disabled={disabled || isAdding}
                variant={isAdding ? 'brandRed' : isInCart ? 'slate' : 'black'}
                size="lg"
                fullWidth
                className="sm:!px-4 sm:!py-2 sm:!text-xs lg:!px-3.5 lg:!py-1.5 lg:!text-xs"
            >
                <ShoppingCart className="w-[14px] h-[14px] sm:w-3 sm:h-3 shrink-0" />
                <span>
                    {isAdding
                        ? 'AGREGADO AL CARRITO!'
                        : isInCart
                            ? 'VER CARRITO'
                            : 'AGREGAR AL CARRITO'
                    }
                </span>
            </Button>

            <Button
                onClick={() => router.push('/mayorista')}
                variant="brandRedOutline"
                size="lg"
                fullWidth
                className="sm:!px-4 sm:!py-2 sm:!text-xs lg:!px-3.5 lg:!py-1.5 lg:!text-xs"
            >
                <Users className="w-[14px] h-[14px] sm:w-3 sm:h-3 shrink-0" />
                <span>QUIERO COMPRAR POR MAYOR</span>
            </Button>
        </div>
    );
}

