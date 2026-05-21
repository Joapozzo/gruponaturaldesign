"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../../hooks/useNavigation';
import { usePathname } from 'next/navigation';
import CartDrawer from '../CartDrawer';
import SearchModal from '../SearchModal';
import { useCart } from '../hooks/useCart';
import { useShopCategories } from '../../hooks/useShopCategories';
import WholesaleBanner from '../WholesaleBanner';
import { useNavbarMenu } from '../../hooks/useNavbarMenu';
import { useNavbarNavigation } from '../../hooks/useNavbarNavigation';
import { NavbarTopRow } from './NavbarTopRow';
import { NavbarDesktopMenu } from './NavbarDesktopMenu';
import { NavbarMobileMenu } from './NavbarMobileMenu';
import { MenuItem } from './types';

/**
 * Componente Container Principal del Navbar
 * Responsabilidad: Orquestar hooks, estados y renderizar estructura principal
 */
export const Navbar: React.FC = () => {
    const { isMenuOpen, toggleMenu } = useNavigation();
    const { itemCount, isWholesale } = useCart();
    const { categories, isLoading: categoriesLoading } = useShopCategories();
    const pathname = usePathname();

    // Hooks de menú
    const {
        isCartOpen,
        isSearchOpen,
        isShopSubmenuOpen,
        isMobileShopSubmenuOpen,
        shopMenuRef,
        openCart,
        closeCart,
        openSearch,
        closeSearch,
        openShopSubmenu,
        closeShopSubmenu,
        toggleMobileShopSubmenu,
        closeMobileShopSubmenu,
    } = useNavbarMenu();

    // Hooks de navegación
    const {
        isLinkActive,
        handleNavigation,
        handleCategoryNavigation: handleCategoryNav,
    } = useNavbarNavigation();

    // Verificar si estamos en checkout para ocultar/deshabilitar el carrito
    const isInCheckout = pathname?.startsWith('/checkout');

    const menuItems: MenuItem[] = [
        { id: 'inicio', label: 'INICIO', href: '/#inicio', paths: ['/', '/#inicio'] },
        { id: 'personalizados', label: 'UNIFORMES PERSONALIZADOS', href: '/personalizados', paths: ['/personalizados'] },
        { id: 'shoponline', label: 'SHOP ONLINE', href: '/shoponline', paths: ['/shoponline', '/producto'] },
        { id: 'nosotros', label: 'NOSOTROS', href: '/#nosotros', paths: ['/#nosotros'] },
        { id: 'clientes', label: 'CLIENTES', href: '/#testimonios', paths: ['/#testimonios'] },
        { id: 'contacto', label: 'CONTACTO', href: '/#contacto', paths: ['/#contacto'] }
    ];

    // Wrapper para handleCategoryNavigation con cierre de menús
    const handleCategoryNavigation = (type: 'rubro' | 'subrubro' | 'genero', value: string) => {
        handleCategoryNav(type, value, () => {
            closeShopSubmenu();
            closeMobileShopSubmenu();
            if (isMenuOpen) toggleMenu();
        });
    };

    // Clases de texto UNIFORMES para todas las páginas - SIEMPRE IGUALES
    const textClasses = {
        active: 'text-[#Ed3237] font-semibold',
        inactive: 'text-[#000000] hover:text-[#Ed3237]'
    };

    return (
        <>
            {/* Navbar blanco con dos filas - SIEMPRE fondo blanco sólido */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="bg-white fixed top-[32px] left-0 right-0 w-full z-50 border-b border-gray-200 shadow-sm"
                style={{ backgroundColor: '#FFFFFF' }}
            >
                <div className="w-full px-4 lg:px-15">
                    {/* Primera fila: Buscador - Logo - User/Carrito */}
                    <NavbarTopRow
                        itemCount={itemCount}
                        isInCheckout={isInCheckout}
                        textClasses={textClasses}
                        onSearchClick={openSearch}
                        onCartClick={openCart}
                        isMenuOpen={isMenuOpen}
                        onMenuToggle={toggleMenu}
                    />

                    {/* Segunda fila: Links de navegación (Desktop) */}
                    <NavbarDesktopMenu
                        menuItems={menuItems}
                        isLinkActive={isLinkActive}
                        textClasses={textClasses}
                        onNavigation={handleNavigation}
                        onCategoryNavigation={handleCategoryNavigation}
                        shopMenuRef={shopMenuRef}
                        isShopSubmenuOpen={isShopSubmenuOpen}
                        onShopSubmenuOpen={openShopSubmenu}
                        onShopSubmenuClose={closeShopSubmenu}
                        categories={categories}
                        categoriesLoading={categoriesLoading}
                    />
                </div>

                {/* Mobile Menu */}
                <NavbarMobileMenu
                    isOpen={isMenuOpen}
                    menuItems={menuItems}
                    isLinkActive={isLinkActive}
                    onToggle={toggleMenu}
                    onNavigation={handleNavigation}
                    onSearchClick={openSearch}
                    onCategoryNavigation={handleCategoryNavigation}
                    isMobileShopSubmenuOpen={isMobileShopSubmenuOpen}
                    onMobileShopSubmenuToggle={toggleMobileShopSubmenu}
                    onMobileShopSubmenuClose={closeMobileShopSubmenu}
                    categories={categories}
                    categoriesLoading={categoriesLoading}
                />
            </motion.nav>

            {!isInCheckout && (
                <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
            )}
            <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />

            {/* Banner Mayorista - Solo si supera 20 unidades y no está en checkout */}
            {isWholesale() && !pathname?.startsWith('/checkout') && (
                <div className="w-full shadow-md">
                    <WholesaleBanner />
                </div>
            )}
        </>
    );
};

