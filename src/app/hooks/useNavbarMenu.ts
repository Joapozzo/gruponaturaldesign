import { useState, useRef } from 'react';
import { useClickOutside } from './useClickOutside';

/**
 * Hook para manejar los estados de los menús del Navbar
 */
export const useNavbarMenu = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isShopSubmenuOpen, setIsShopSubmenuOpen] = useState(false);
    const [isMobileShopSubmenuOpen, setIsMobileShopSubmenuOpen] = useState(false);
    const shopMenuRef = useRef<HTMLDivElement>(null);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => setIsSearchOpen(false);

    const openShopSubmenu = () => setIsShopSubmenuOpen(true);
    const closeShopSubmenu = () => setIsShopSubmenuOpen(false);
    const toggleShopSubmenu = () => setIsShopSubmenuOpen(prev => !prev);

    const openMobileShopSubmenu = () => setIsMobileShopSubmenuOpen(true);
    const closeMobileShopSubmenu = () => setIsMobileShopSubmenuOpen(false);
    const toggleMobileShopSubmenu = () => setIsMobileShopSubmenuOpen(prev => !prev);

    // Cerrar submenú al hacer click fuera
    useClickOutside(shopMenuRef, () => setIsShopSubmenuOpen(false), isShopSubmenuOpen);

    return {
        // Estados
        isCartOpen,
        isSearchOpen,
        isShopSubmenuOpen,
        isMobileShopSubmenuOpen,
        shopMenuRef,

        // Acciones Cart
        openCart,
        closeCart,

        // Acciones Search
        openSearch,
        closeSearch,

        // Acciones Shop Submenu
        openShopSubmenu,
        closeShopSubmenu,
        toggleShopSubmenu,

        // Acciones Mobile Shop Submenu
        openMobileShopSubmenu,
        closeMobileShopSubmenu,
        toggleMobileShopSubmenu,
    };
};

