"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { MenuItem } from './types';
import { NavbarMenuItem } from './NavbarMenuItem';
import { ShopDesktopSubmenu } from './ShopDesktopSubmenu';

interface NavbarDesktopMenuProps {
    menuItems: MenuItem[];
    isLinkActive: (item: MenuItem) => boolean;
    textClasses: {
        active: string;
        inactive: string;
    };
    onNavigation: (item: MenuItem) => void;
    onCategoryNavigation: (type: 'rubro' | 'subrubro' | 'genero', value: string) => void;
    shopMenuRef: React.RefObject<HTMLDivElement | null>;
    isShopSubmenuOpen: boolean;
    onShopSubmenuOpen: () => void;
    onShopSubmenuClose: () => void;
    categories: {
        rubros: string[];
        subrubros: string[];
        generos: string[];
    } | null;
    categoriesLoading: boolean;
}

/**
 * Componente Menú Desktop del Navbar
 * Responsabilidad: Renderizar los links de navegación y submenú de shop para desktop
 */
export const NavbarDesktopMenu: React.FC<NavbarDesktopMenuProps> = ({
    menuItems,
    isLinkActive,
    textClasses,
    onNavigation,
    onCategoryNavigation,
    shopMenuRef,
    isShopSubmenuOpen,
    onShopSubmenuOpen,
    onShopSubmenuClose,
    categories,
    categoriesLoading
}) => {
    return (
        <div className="hidden lg:block border-t border-gray-100 relative">
            <div className="flex items-center justify-center space-x-5 py-3">
                {menuItems.map((item, index) => {
                    if (item.id === 'shoponline') {
                        return (
                            <div
                                key={item.id}
                                ref={shopMenuRef}
                                className="relative"
                                onMouseEnter={onShopSubmenuOpen}
                                onMouseLeave={onShopSubmenuClose}
                            >
                                <motion.button
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => onNavigation(item)}
                                    className={`text-xs font-medium transition-all duration-300 tracking-wide flex items-center gap-1.5 ${
                                        isLinkActive(item) ? textClasses.active : textClasses.inactive
                                    }`}
                                    aria-label={`Ir a ${item.label}`}
                                >
                                    {item.label}
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isShopSubmenuOpen ? 'rotate-180' : ''}`} />
                                </motion.button>
                            </div>
                        );
                    }

                    return (
                        <NavbarMenuItem
                            key={item.id}
                            item={item}
                            index={index}
                            isActive={isLinkActive(item)}
                            textClasses={textClasses}
                            onClick={onNavigation}
                        />
                    );
                })}
            </div>
            
            {/* Submenú posicionado desde el contenedor del menú completo - Full width */}
            <div
                className="absolute left-1/2 -translate-x-1/2 w-screen"
                onMouseEnter={onShopSubmenuOpen}
                onMouseLeave={onShopSubmenuClose}
            >
                <ShopDesktopSubmenu
                    isOpen={isShopSubmenuOpen}
                    categories={categories}
                    categoriesLoading={categoriesLoading}
                    onCategoryClick={onCategoryNavigation}
                    onClose={onShopSubmenuClose}
                />
            </div>
        </div>
    );
};

