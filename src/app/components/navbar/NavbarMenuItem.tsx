"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { MenuItem } from './types';

interface NavbarMenuItemProps {
    item: MenuItem;
    index: number;
    isActive: boolean;
    textClasses: {
        active: string;
        inactive: string;
    };
    onClick: (item: MenuItem) => void;
    isMobile?: boolean;
}

/**
 * Componente de Item de Menú del Navbar
 * Responsabilidad: Renderizar un item individual del menú
 */
export const NavbarMenuItem: React.FC<NavbarMenuItemProps> = ({
    item,
    index,
    isActive,
    textClasses,
    onClick,
    isMobile = false
}) => {
    if (isMobile) {
        return (
            <motion.button
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onClick(item)}
                className={`block w-full text-left px-3 sm:px-3 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-medium tracking-wide transition-all duration-300 rounded-lg ${
                    isActive
                        ? 'text-[#Ed3237] bg-gray-50 font-semibold'
                        : 'text-[#000000] hover:text-[#Ed3237] hover:bg-gray-50'
                }`}
                aria-label={`Ir a sección ${item.label}`}
            >
                {item.label}
            </motion.button>
        );
    }

    return (
        <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onClick(item)}
            className={`text-xs font-medium transition-all duration-300 tracking-wide ${
                isActive ? textClasses.active : textClasses.inactive
            }`}
            aria-label={`Ir a sección ${item.label}`}
        >
            {item.label}
        </motion.button>
    );
};

