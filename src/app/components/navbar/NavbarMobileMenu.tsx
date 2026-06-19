"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { MenuItem } from './types';
import { NavbarMenuItem } from './NavbarMenuItem';
import { ShopMobileSubmenu } from './ShopMobileSubmenu';

interface NavbarMobileMenuProps {
    isOpen: boolean;
    menuItems: MenuItem[];
    isLinkActive: (item: MenuItem) => boolean;
    onToggle: () => void;
    onNavigation: (item: MenuItem) => void;
    onSearchClick: () => void;
    onCategoryNavigation: (type: 'rubro' | 'subrubro' | 'genero', value: string) => void;
    isMobileShopSubmenuOpen: boolean;
    onMobileShopSubmenuToggle: () => void;
    onMobileShopSubmenuClose: () => void;
    categories: {
        rubros: string[];
        subrubros: string[];
        generos: string[];
    } | null;
    categoriesLoading: boolean;
}

/**
 * Componente Menú Mobile del Navbar
 * Responsabilidad: Renderizar el menú móvil desplegable con animaciones
 */
export const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
    isOpen,
    menuItems,
    isLinkActive,
    onToggle,
    onNavigation,
    onSearchClick,
    onCategoryNavigation,
    isMobileShopSubmenuOpen,
    onMobileShopSubmenuToggle,
    onMobileShopSubmenuClose,
    categories,
    categoriesLoading
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="lg:hidden bg-white border-t border-gray-200 max-h-[calc(100vh-60px)] overflow-y-auto"
                    style={{ backgroundColor: '#FFFFFF' }}
                >
                    <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-2.5">
                        {/* Botón de búsqueda en mobile */}
                        <motion.button
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0 }}
                            onClick={() => {
                                onSearchClick();
                                onToggle();
                            }}
                            className="w-full flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-medium tracking-wide transition-all duration-300 rounded-lg text-[#000000] hover:text-[#Ed3237] hover:bg-gray-50 border border-gray-200"
                            aria-label="Buscar productos"
                        >
                            <Search className="w-5 h-5 sm:w-5 sm:h-5" />
                            <span>BUSCAR PRODUCTOS</span>
                        </motion.button>

                        {menuItems.map((item, index) => {
                            if (item.id === 'shoponline') {
                                return (
                                    <div key={item.id}>
                                        <motion.button
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={onMobileShopSubmenuToggle}
                                            className={`w-full flex items-center justify-between px-3 sm:px-3 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-medium tracking-wide transition-all duration-300 rounded-lg ${
                                                isLinkActive(item)
                                                    ? 'text-[#Ed3237] bg-gray-50 font-semibold'
                                                    : 'text-[#000000] hover:text-[#Ed3237] hover:bg-gray-50'
                                            }`}
                                            aria-label={`Ir a ${item.label}`}
                                        >
                                            <span>{item.label}</span>
                                            <ChevronRight className={`w-4 h-4 sm:w-4 sm:h-4 transition-transform duration-300 ${isMobileShopSubmenuOpen ? 'rotate-90' : ''}`} />
                                        </motion.button>

                                        <ShopMobileSubmenu
                                            isOpen={isMobileShopSubmenuOpen}
                                            categories={categories}
                                            categoriesLoading={categoriesLoading}
                                            onCategoryClick={onCategoryNavigation}
                                            onClose={onMobileShopSubmenuClose}
                                            onMenuToggle={onToggle}
                                        />
                                    </div>
                                );
                            }

                            return (
                                <NavbarMenuItem
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    isActive={isLinkActive(item)}
                                    textClasses={{
                                        active: 'text-[#Ed3237] bg-gray-50 font-semibold',
                                        inactive: 'text-[#000000] hover:text-[#Ed3237] hover:bg-gray-50'
                                    }}
                                    onClick={onNavigation}
                                    isMobile
                                />
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

