"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, Search, ChevronDown, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useNavigation } from '../hooks/useNavigation';
import { usePathname, useRouter } from 'next/navigation';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';
import { useCart } from './hooks/useCart';
import { useShopCategories } from '../hooks/useShopCategories';
import WholesaleBanner from './WholesaleBanner';

const Navbar = () => {
    const {
        isMenuOpen,
        toggleMenu
    } = useNavigation();
    const { itemCount, isWholesale } = useCart();
    const { categories, isLoading: categoriesLoading } = useShopCategories();
    const router = useRouter();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isShopSubmenuOpen, setIsShopSubmenuOpen] = useState(false);
    const [isMobileShopSubmenuOpen, setIsMobileShopSubmenuOpen] = useState(false);
    const pathname = usePathname();
    const shopMenuRef = useRef<HTMLDivElement>(null);
    
    // Verificar si estamos en checkout para ocultar/deshabilitar el carrito
    const isInCheckout = pathname?.startsWith('/checkout');

    const menuItems = [
        { id: 'inicio', label: 'INICIO', href: '/#inicio', paths: ['/', '/#inicio'] },
        { id: 'personalizados', label: 'UNIFORMES PERSONALIZADOS', href: '/personalizados', paths: ['/personalizados'] },
        { id: 'shoponline', label: 'SHOP ONLINE', href: '/shoponline', paths: ['/shoponline', '/producto'] },
        { id: 'nosotros', label: 'NOSOTROS', href: '/#nosotros', paths: ['/#nosotros'] },
        { id: 'clientes', label: 'CLIENTES', href: '/#testimonios', paths: ['/#testimonios'] },
        { id: 'contacto', label: 'CONTACTO', href: '/#contacto', paths: ['/#contacto'] }
    ];

    // Función para manejar navegación
    const handleNavigation = (item: typeof menuItems[0]) => {
        window.location.href = item.href;
    };

    // Cerrar submenú al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shopMenuRef.current && !shopMenuRef.current.contains(event.target as Node)) {
                setIsShopSubmenuOpen(false);
            }
        };

        if (isShopSubmenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isShopSubmenuOpen]);

    // Función para detectar si un link está activo - SIMPLE Y UNIFORME - SIEMPRE IGUAL
    const isLinkActive = (item: typeof menuItems[0]): boolean => {
        const currentPath = pathname || '';
        
        // Home
        if (currentPath === '/' && item.id === 'inicio') return true;
        
        // Shop Online (incluye páginas de producto)
        if (item.id === 'shoponline') {
            return currentPath === '/shoponline' || currentPath.startsWith('/producto/');
        }
        
        // Personalizados
        if (currentPath === '/personalizados' && item.id === 'personalizados') return true;
        
        return false;
    };

    // Función para normalizar rubro antes de navegar
    const normalizeRubroForNavigation = (rubro: string): string => {
        if (!rubro) return '';
        const rubroUpper = rubro.toUpperCase().trim();
        
        // Si contiene "WORKWEAR", retornar "WORKWEAR"
        if (rubroUpper.includes('WORKWEAR')) {
            return 'WORKWEAR';
        }
        
        // Si contiene "OFFICE", retornar "BASIC"
        if (rubroUpper.includes('OFFICE')) {
            return 'BASIC';
        }
        
        // Si ya es "BASIC" o "WORKWEAR", retornarlo tal cual
        if (rubroUpper === 'BASIC' || rubroUpper === 'WORKWEAR') {
            return rubroUpper;
        }
        
        // Por defecto, retornar el rubro original
        return rubro.trim();
    };

    // Función para navegar con filtro
    const handleCategoryNavigation = (type: 'rubro' | 'subrubro' | 'genero', value: string) => {
        const params = new URLSearchParams();
        
        if (type === 'rubro') {
            // Normalizar el rubro antes de agregarlo a la URL
            const normalizedRubro = normalizeRubroForNavigation(value);
            params.set('rubro', normalizedRubro);
        } else if (type === 'subrubro') {
            params.set('subrubro', value);
        } else if (type === 'genero') {
            params.set('genero', value.toLowerCase());
        }
        
        router.push(`/shoponline?${params.toString()}`);
        setIsShopSubmenuOpen(false);
        setIsMobileShopSubmenuOpen(false);
        if (isMenuOpen) toggleMenu();
    };

    // Clases de texto UNIFORMES para todas las páginas - SIEMPRE IGUALES
    // Usar valores hexadecimales directos para asegurar que siempre se vean igual
    const textClasses = {
        active: 'text-[#Ed3237] border-b-2 border-[#Ed3237] pb-1 font-semibold',
        inactive: 'text-[#000000] hover:text-[#Ed3237]'
    };

    return (
        <>
            {/* Navbar blanco con dos filas - SIEMPRE fondo blanco sólido */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="bg-white sticky top-[40px] w-full z-50 border-b border-gray-200 shadow-sm relative"
                style={{ backgroundColor: '#FFFFFF' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Primera fila: Buscador - Logo - User/Carrito */}
                    <div className="relative flex justify-between items-center h-16 lg:h-20">
                        {/* Buscador a la izquierda (Desktop) */}
                        <div className="hidden lg:flex items-center flex-1">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsSearchOpen(true)}
                                className={`transition-all duration-300 ${textClasses.inactive}`}
                                aria-label="Buscar productos"
                            >
                                <Search className="w-6 h-6" />
                            </motion.button>
                        </div>

                        {/* Logo centrado */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute left-1/2 transform -translate-x-1/2 z-10"
                        >
                            <Image
                                src="/logos/logo-1.svg"
                                alt="NTDS Natural Design Logo"
                                width={70}
                                height={30}
                                className="cursor-pointer"
                                onClick={() => window.location.href = '/#inicio'}
                                priority
                            />
                        </motion.div>

                        {/* Actions a la derecha (Desktop) */}
                        <div className="hidden lg:flex items-center space-x-4 flex-1 justify-end">
                            <button
                                disabled
                                className="text-gray-400 opacity-50 cursor-not-allowed pointer-events-none"
                                aria-label="Mi cuenta (no disponible)"
                            >
                                <User className="w-6 h-6" />
                            </button>
                            {!isInCheckout && (
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsCartOpen(true)}
                                    className={`relative transition-all duration-300 ${textClasses.inactive}`}
                                    aria-label="Carrito de compras"
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                    {itemCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 bg-[#Ed3237] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                                        >
                                            {itemCount}
                                        </motion.span>
                                    )}
                                </motion.button>
                            )}
                        </div>

                        {/* Mobile: Logo centrado con acciones a la derecha */}
                        <div className='flex items-center justify-between w-full lg:hidden'>
                            <div className="flex-1"></div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex justify-center"
                            >
                                <Image
                                    src="/logos/logo-1.svg"
                                    alt="NTDS Natural Design Logo"
                                    width={70}
                                    height={30}
                                    className="cursor-pointer"
                                    onClick={() => window.location.href = '/#inicio'}
                                    priority
                                />
                            </motion.div>
                            <div className='flex items-center space-x-3 flex-1 justify-end'>
                                {!isInCheckout && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsCartOpen(true)}
                                        className={`relative transition-all duration-300 ${textClasses.inactive}`}
                                        aria-label="Carrito de compras"
                                    >
                                        <ShoppingCart className="w-6 h-6" />
                                        {itemCount > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-2 -right-2 bg-[#Ed3237] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                                            >
                                                {itemCount}
                                            </motion.span>
                                        )}
                                    </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleMenu}
                                    className={`p-2 transition-all duration-300 ${textClasses.inactive}`}
                                    aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                                    aria-expanded={isMenuOpen}
                                >
                                    <motion.div
                                        animate={{ rotate: isMenuOpen ? 90 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                    </motion.div>
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Segunda fila: Links de navegación (Desktop) */}
                    <div className="hidden lg:block border-t border-gray-100">
                        <div className="flex items-center justify-center space-x-8 py-3">
                            {menuItems.map((item, index) => {
                                if (item.id === 'shoponline') {
                                    return (
                                        <div
                                            key={item.id}
                                            ref={shopMenuRef}
                                            className="relative"
                                            onMouseEnter={() => setIsShopSubmenuOpen(true)}
                                            onMouseLeave={() => setIsShopSubmenuOpen(false)}
                                        >
                                            <motion.button
                                                initial={{ y: -20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                onClick={() => handleNavigation(item)}
                                                className={`text-xs font-medium transition-all duration-300 tracking-wide flex items-center gap-1 ${
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
                                    <motion.button
                                        key={item.id}
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleNavigation(item)}
                                        className={`text-xs font-medium transition-all duration-300 tracking-wide ${
                                            isLinkActive(item) ? textClasses.active : textClasses.inactive
                                        }`}
                                        aria-label={`Ir a sección ${item.label}`}
                                    >
                                        {item.label}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Submenú Horizontal Desktop - Extensión del navbar */}
                        <AnimatePresence>
                            {isShopSubmenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
                                    style={{ top: '100%' }}
                                    onMouseEnter={() => setIsShopSubmenuOpen(true)}
                                    onMouseLeave={() => setIsShopSubmenuOpen(false)}
                                >
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                        {categoriesLoading ? (
                                            <div className="text-center py-4 text-gray-500 text-sm">Cargando categorías...</div>
                                        ) : categories && (categories.rubros.length > 0 || categories.subrubros.length > 0 || categories.generos.length > 0) ? (
                                            <>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Géneros */}
                                                {categories?.generos && categories.generos.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">GÉNERO</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {categories.generos.map((genero) => (
                                                            <button
                                                                key={genero}
                                                                onClick={() => handleCategoryNavigation('genero', genero.toLowerCase())}
                                                                className="px-3 py-1.5 text-xs text-gray-700 hover:text-[#Ed3237] hover:bg-gray-50 rounded transition-all duration-200 whitespace-nowrap"
                                                            >
                                                                {genero}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Rubros */}
                                            {categories?.rubros && categories.rubros.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">RUBROS</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {categories.rubros.map((rubro) => (
                                                            <button
                                                                key={rubro}
                                                                onClick={() => handleCategoryNavigation('rubro', rubro)}
                                                                className="px-3 py-1.5 text-xs text-gray-700 hover:text-[#Ed3237] hover:bg-gray-50 rounded transition-all duration-200 whitespace-nowrap"
                                                            >
                                                                {rubro}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Subrubros */}
                                            {categories?.subrubros && categories.subrubros.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">CATEGORÍAS</h3>
                                                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                                        {categories.subrubros.map((subrubro) => (
                                                            <button
                                                                key={subrubro}
                                                                onClick={() => handleCategoryNavigation('subrubro', subrubro)}
                                                                className="px-3 py-1.5 text-xs text-gray-700 hover:text-[#Ed3237] hover:bg-gray-50 rounded transition-all duration-200 whitespace-nowrap"
                                                            >
                                                                {subrubro}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            </div>

                                            {/* Ver todo */}
                                            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                                                <button
                                                    onClick={() => {
                                                        router.push('/shoponline');
                                                        setIsShopSubmenuOpen(false);
                                                    }}
                                                    className="px-6 py-2 text-xs font-semibold text-[#Ed3237] hover:bg-[#Ed3237] hover:text-white rounded transition-all duration-200"
                                                >
                                                    VER TODO
                                                </button>
                                            </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500 text-sm">
                                                No hay categorías disponibles
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="lg:hidden bg-white border-t border-gray-200 max-h-[calc(100vh-80px)] overflow-y-auto"
                            style={{ backgroundColor: '#FFFFFF' }}
                        >
                            <div className="px-4 py-6 space-y-2">
                                {/* Botón de búsqueda en mobile */}
                                <motion.button
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0 }}
                                    onClick={() => {
                                        setIsSearchOpen(true);
                                        toggleMenu();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 font-medium tracking-wide transition-all duration-300 rounded-lg text-[#000000] hover:text-[#Ed3237] hover:bg-gray-50 border border-gray-200"
                                    aria-label="Buscar productos"
                                >
                                    <Search className="w-5 h-5" />
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
                                                    onClick={() => setIsMobileShopSubmenuOpen(!isMobileShopSubmenuOpen)}
                                                    className={`w-full flex items-center justify-between px-3 py-2 font-medium tracking-wide transition-all duration-300 rounded-lg ${
                                                        isLinkActive(item)
                                                            ? 'text-[#Ed3237] bg-gray-50 font-semibold'
                                                            : 'text-[#000000] hover:text-[#Ed3237] hover:bg-gray-50'
                                                    }`}
                                                    aria-label={`Ir a ${item.label}`}
                                                >
                                                    <span>{item.label}</span>
                                                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isMobileShopSubmenuOpen ? 'rotate-90' : ''}`} />
                                                </motion.button>

                                                {/* Submenú Mobile - Horizontal con scroll */}
                                                <AnimatePresence>
                                                    {isMobileShopSubmenuOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pl-6 pr-3 py-3 bg-gray-50 rounded-lg mt-1">
                                                                {categoriesLoading ? (
                                                                    <div className="text-center py-4 text-gray-500 text-sm">Cargando categorías...</div>
                                                                ) : (
                                                                    <>
                                                                {/* Géneros */}
                                                                {categories?.generos && categories.generos.length > 0 && (
                                                                    <div className="mb-4">
                                                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">GÉNERO</h3>
                                                                        <div className="overflow-x-auto -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                                                            <div className="flex gap-2 pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
                                                                                {categories.generos.map((genero) => (
                                                                                    <button
                                                                                        key={genero}
                                                                                        onClick={() => handleCategoryNavigation('genero', genero.toLowerCase())}
                                                                                        className="flex-shrink-0 px-4 py-2 text-xs text-gray-700 hover:text-[#Ed3237] hover:bg-white rounded transition-all duration-200 whitespace-nowrap border border-gray-200"
                                                                                    >
                                                                                        {genero}
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Rubros */}
                                                                {categories?.rubros && categories.rubros.length > 0 && (
                                                                    <div className="mb-4 border-t border-gray-200 pt-4">
                                                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">RUBROS</h3>
                                                                        <div className="overflow-x-auto -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                                                            <div className="flex gap-2 pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
                                                                                {categories.rubros.map((rubro) => (
                                                                                    <button
                                                                                        key={rubro}
                                                                                        onClick={() => handleCategoryNavigation('rubro', rubro)}
                                                                                        className="flex-shrink-0 px-4 py-2 text-xs text-gray-700 hover:text-[#Ed3237] hover:bg-white rounded transition-all duration-200 whitespace-nowrap border border-gray-200"
                                                                                    >
                                                                                        {rubro}
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Subrubros */}
                                                                {categories?.subrubros && categories.subrubros.length > 0 && (
                                                                    <div className="mb-4 border-t border-gray-200 pt-4">
                                                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CATEGORÍAS</h3>
                                                                        <div className="overflow-x-auto -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                                                            <div className="flex gap-2 pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
                                                                                {categories.subrubros.map((subrubro) => (
                                                                                    <button
                                                                                        key={subrubro}
                                                                                        onClick={() => handleCategoryNavigation('subrubro', subrubro)}
                                                                                        className="flex-shrink-0 px-4 py-2 text-xs text-gray-700 hover:text-[#Ed3237] hover:bg-white rounded transition-all duration-200 whitespace-nowrap border border-gray-200"
                                                                                    >
                                                                                        {subrubro}
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Ver todo */}
                                                                <div className="border-t border-gray-200 pt-4">
                                                                    <button
                                                                        onClick={() => {
                                                                            router.push('/shoponline');
                                                                            setIsMobileShopSubmenuOpen(false);
                                                                            if (isMenuOpen) toggleMenu();
                                                                        }}
                                                                        className="w-full text-center px-3 py-2 text-xs font-semibold text-[#Ed3237] hover:bg-[#Ed3237] hover:text-white rounded transition-all duration-200"
                                                                    >
                                                                        VER TODO
                                                                    </button>
                                                                </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    }

                                    return (
                                        <motion.button
                                            key={item.id}
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => handleNavigation(item)}
                                            className={`block w-full text-left px-3 py-2 font-medium tracking-wide transition-all duration-300 rounded-lg ${
                                                isLinkActive(item)
                                                    ? 'text-[#Ed3237] bg-gray-50 font-semibold'
                                                    : 'text-[#000000] hover:text-[#Ed3237] hover:bg-gray-50'
                                            }`}
                                            aria-label={`Ir a sección ${item.label}`}
                                        >
                                            {item.label}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {!isInCheckout && (
                    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                )}
                <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            </motion.nav>

            {/* Banner Mayorista - Solo si supera 20 unidades y no está en checkout */}
            {isWholesale() && pathname !== '/checkout' && (
                <div className="w-full shadow-md">
                    <WholesaleBanner />
                </div>
            )}
        </>
    );
};

export default Navbar;