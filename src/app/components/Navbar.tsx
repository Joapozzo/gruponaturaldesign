"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import Image from 'next/image';
import { useNavigation } from '../hooks/useNavigation';
import { usePathname } from 'next/navigation';
import CartDrawer from './CartDrawer';
import { useCart } from './hooks/useCart';

const Navbar = () => {
    const {
        isMenuOpen,
        toggleMenu
    } = useNavigation();
    const { itemCount } = useCart();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { id: 'inicio', label: 'INICIO', href: '/#inicio', paths: ['/', '/#inicio'] },
        { id: 'personalizados', label: 'UNIFORMES PERSONALIZADOS', href: '/personalizados', paths: ['/personalizados'] },
        { id: 'catalogo', label: 'CATÁLOGO', href: '/catalogo', paths: ['/catalogo', '/producto'] },
        { id: 'nosotros', label: 'NOSOTROS', href: '/#nosotros', paths: ['/#nosotros'] },
        { id: 'clientes', label: 'CLIENTES', href: '/#testimonios', paths: ['/#testimonios'] },
        { id: 'contacto', label: 'CONTACTO', href: '/#contacto', paths: ['/#contacto'] }
    ];

    // Función para manejar navegación
    const handleNavigation = (item: typeof menuItems[0]) => {
        window.location.href = item.href;
    };

    // Función para detectar si un link está activo - SIMPLE Y UNIFORME - SIEMPRE IGUAL
    const isLinkActive = (item: typeof menuItems[0]): boolean => {
        const currentPath = pathname || '';
        
        // Home
        if (currentPath === '/' && item.id === 'inicio') return true;
        
        // Catálogo (incluye páginas de producto)
        if (item.id === 'catalogo') {
            return currentPath === '/catalogo' || currentPath.startsWith('/producto/');
        }
        
        // Personalizados
        if (currentPath === '/personalizados' && item.id === 'personalizados') return true;
        
        return false;
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
                className="bg-white sticky top-0 w-full z-50 border-b border-gray-200 shadow-sm"
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
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`transition-all duration-300 ${textClasses.inactive}`}
                                aria-label="Mi cuenta"
                            >
                                <User className="w-6 h-6" />
                            </motion.button>
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
                    <div className="hidden lg:flex items-center justify-center space-x-8 py-3 border-t border-gray-100">
                        {menuItems.map((item, index) => (
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
                        ))}
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
                            className="lg:hidden bg-white border-t border-gray-200"
                            style={{ backgroundColor: '#FFFFFF' }}
                        >
                            <div className="px-4 py-6 space-y-4">
                                {menuItems.map((item, index) => (
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
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </motion.nav>
        </>
    );
};

export default Navbar;