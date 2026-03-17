"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';
import { NavbarLogo } from './NavbarLogo';
import { NavbarActions } from './NavbarActions';

interface NavbarTopRowProps {
    itemCount: number;
    isInCheckout: boolean;
    textClasses: {
        active: string;
        inactive: string;
    };
    onSearchClick: () => void;
    onCartClick: () => void;
    isMenuOpen?: boolean;
    onMenuToggle?: () => void;
}

/**
 * Componente Primera Fila del Navbar
 * Responsabilidad: Renderizar buscador, logo y acciones (user/cart/menu)
 */
export const NavbarTopRow: React.FC<NavbarTopRowProps> = ({
    itemCount,
    isInCheckout,
    textClasses,
    onSearchClick,
    onCartClick,
    isMenuOpen = false,
    onMenuToggle
}) => {
    return (
        <div className="relative flex justify-between items-center h-11 sm:h-14 lg:h-16">
            {/* Buscador a la izquierda (Desktop) */}
            <div className="hidden lg:flex items-center flex-1">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSearchClick}
                    className={`transition-all duration-300 ${textClasses.inactive}`}
                    aria-label="Buscar productos"
                >
                    <Search className="w-6 h-6" />
                </motion.button>
            </div>

            {/* Logo centrado - Solo Desktop (flex-1 para reservar espacio y centrar) */}
            <div className="hidden lg:flex flex-1 justify-center items-center relative min-h-[30px]">
                <NavbarLogo width={70} height={52} />
            </div>

            {/* Actions a la derecha (Desktop) */}
            <NavbarActions
                itemCount={itemCount}
                isInCheckout={isInCheckout}
                textClasses={textClasses}
                onCartClick={onCartClick}
            />

            {/* Mobile: Menú izq, logo centro, cart+login derecha */}
            <div className="flex items-center w-full lg:hidden">
                <div className="flex-1 flex justify-start">
                    {onMenuToggle && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onMenuToggle}
                            className={`p-2 sm:p-2.5 transition-all duration-300 ${textClasses.inactive}`}
                            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                            aria-expanded={isMenuOpen}
                        >
                            <motion.div
                                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.div>
                        </motion.button>
                    )}
                </div>
                <div className="flex-shrink-0 flex justify-center">
                    <NavbarLogo width={52} height={22} isMobile />
                </div>
                <div className="flex-1 flex justify-end items-center">
                    <NavbarActions
                        itemCount={itemCount}
                        isInCheckout={isInCheckout}
                        textClasses={textClasses}
                        onCartClick={onCartClick}
                        isMobile
                    />
                </div>
            </div>
        </div>
    );
};

