"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface NavbarActionsProps {
    itemCount: number;
    isInCheckout: boolean;
    textClasses: {
        active: string;
        inactive: string;
    };
    onCartClick: () => void;
    isMobile?: boolean;
}

/**
 * Componente de Acciones del Navbar (User/Cart)
 * Responsabilidad: Renderizar botones de usuario y carrito
 */
export const NavbarActions: React.FC<NavbarActionsProps> = ({
    itemCount,
    isInCheckout,
    textClasses,
    onCartClick,
    isMobile = false
}) => {
    if (isMobile) {
        return (
            <div className='flex items-center space-x-2 sm:space-x-4 flex-1 justify-end'>
                <UserMenu isMobile />
                {!isInCheckout && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onCartClick}
                        className={`relative transition-all duration-300 ${textClasses.inactive}`}
                        aria-label="Carrito de compras"
                    >
                        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                        {itemCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-[#Ed3237] text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold"
                            >
                                {itemCount}
                            </motion.span>
                        )}
                    </motion.button>
                )}
            </div>
        );
    }

    return (
        <div className="hidden lg:flex items-center space-x-4 flex-1 justify-end">
            <UserMenu />
            {!isInCheckout && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCartClick}
                    className={`relative transition-all duration-300 ${textClasses.inactive}`}
                    aria-label="Carrito de compras"
                >
                    <ShoppingCart className="w-6 h-6" />
                    {itemCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1.5 -right-1.5 bg-[#Ed3237] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                        >
                            {itemCount}
                        </motion.span>
                    )}
                </motion.button>
            )}
        </div>
    );
};

