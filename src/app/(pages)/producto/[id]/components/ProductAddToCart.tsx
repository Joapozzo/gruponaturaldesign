"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
        <div className="space-y-3 sm:space-y-4">
            <motion.button
                onClick={onAddToCart}
                disabled={disabled || isAdding}
                className={`
                    w-full flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg
                    font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300
                    ${isAdding
                        ? 'bg-[#Ed3237] text-white'
                        : isInCart
                            ? 'bg-gray-800 text-white'
                            : 'bg-black text-white hover:bg-gray-800'
                    }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={isAdding ? { scale: [1, 1.05, 1] } : {}}
            >
                <ShoppingCart className="w-5 h-5" />
                <span>
                    {isAdding
                        ? 'AGREGADO AL CARRITO!'
                        : isInCart
                            ? 'YA EN CARRITO'
                            : 'AGREGAR AL CARRITO'
                    }
                </span>
            </motion.button>

            {/* Botón Quiero comprar por mayor */}
            <motion.button
                onClick={() => router.push('/mayorista')}
                className="w-full flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 bg-white border-2 border-[#Ed3237] text-[#Ed3237] hover:bg-[#Ed3237] hover:text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Users className="w-5 h-5" />
                <span>QUIERO COMPRAR POR MAYOR</span>
            </motion.button>
        </div>
    );
}

