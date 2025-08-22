"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useNavigation } from '../hooks/useNavigation';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const {
        getSectionClasses,
        isMenuOpen,
        toggleMenu
    } = useNavigation();

    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    // Detectar si estamos en la página principal
    const isHomePage = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { id: 'inicio', label: 'INICIO', href: '/#inicio' },
        { id: 'categorias', label: 'CATÁLOGO', href: '/catalogo' },
        { id: 'nosotros', label: 'NOSOTROS', href: '/#nosotros' },
        { id: 'testimonios', label: 'CLIENTES', href: '/#testimonios' },
        { id: 'contacto', label: 'CONTACTO', href: '/#contacto' }
    ];

    // Función para manejar navegación
    const handleNavigation = (item: typeof menuItems[0]) => {
        window.location.href = item.href;
    };

    // Determinar el estilo del navbar basado en la página
    const getNavbarStyle = () => {
        if (!isHomePage) {
            // En páginas que no son home, siempre fondo negro
            return {
                backgroundColor: 'rgba(0, 0, 0, 1)',
                backdropFilter: 'blur(10px)',
            };
        } else {
            // En home, comportamiento dinámico
            return {
                backgroundColor: isScrolled ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
                backdropFilter: isScrolled ? 'blur(10px)' : 'none',
            };
        }
    };

    // Determinar clases de texto basado en la página
    const getTextClasses = () => {
        if (!isHomePage) {
            // En páginas que no son home, siempre texto blanco
            return {
                default: 'text-white hover:text-gray-200',
                active: 'text-white border-b-2 border-white pb-1',
                inactive: 'text-white hover:text-gray-200'
            };
        } else {
            // En home, comportamiento dinámico
            return {
                default: isScrolled
                    ? 'text-[var(--gray-medium)] hover:text-[var(--red)]'
                    : 'text-white hover:text-gray-200',
                active: isScrolled
                    ? 'text-[var(--red)] border-b-2 border-[var(--red)] pb-1'
                    : 'text-white border-b-2 border-white pb-1',
                inactive: isScrolled
                    ? 'text-[var(--black)] hover:text-[var(--red)]'
                    : 'text-white hover:text-gray-200 hover:scale-105'
            };
        }
    };

    const textClasses = getTextClasses();

    return (
        <>
            {/* Navbar dinámico */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{
                    y: 0,
                    ...getNavbarStyle()
                }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className={`${!isHomePage || isScrolled ? 'border-gray-600 shadow-sm' : 'border-gray-100'} sticky top-0 w-full z-40 transition-all duration-400`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo dinámico */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center"
                        >
                            <motion.div
                                key={!isHomePage || isScrolled ? 'logo-1' : 'logo-2'}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Image
                                    src={!isHomePage && "/logos/logo-1.svg" || isHomePage && !isScrolled ? "/logos/logo-2.svg" : "/logos/logo-1.svg"}
                                    alt="NTDS Natural Design Logo"
                                    width={70}
                                    height={30}
                                    className="cursor-pointer"
                                    onClick={() => window.location.href = '/#inicio'}
                                    priority
                                />
                            </motion.div>
                        </motion.div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {menuItems.map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleNavigation(item)}
                                    className={`text-xs font-medium transition-all duration-300 tracking-wide ${isHomePage
                                        ? getSectionClasses(
                                            item.id,
                                            textClasses.active,
                                            textClasses.inactive
                                        )
                                        : (pathname === '/catalogo' && item.id === 'categorias')
                                            ? textClasses.active
                                            : textClasses.default
                                        }`}
                                    aria-label={`Ir a sección ${item.label}`}
                                >
                                    {item.label}
                                </motion.button>
                            ))}
                        </div>

                        {/* Actions */}
                        {/* <div className="hidden lg:flex items-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-5 h-5 transition-all duration-300 ${textClasses.default}`}
                                aria-label="Buscar productos"
                            >
                                <Search className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-5 h-5 transition-all duration-300 ${textClasses.default}`}
                                aria-label="Mi cuenta"
                            >
                                <User className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative transition-all duration-300 ${textClasses.default}`}
                                aria-label="Carrito de compras"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-[var(--red)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                >
                                    0
                                </motion.span>
                            </motion.button>
                        </div> */}

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleMenu}
                            className={`lg:hidden p-2 transition-all duration-300 ${textClasses.default}`}
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

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className={`lg:hidden ${!isHomePage ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-md border-t ${!isHomePage ? 'border-gray-600' : 'border-gray-100'}`}
                        >
                            <div className="px-4 py-6 space-y-4">
                                {menuItems.map((item, index) => (
                                    <motion.button
                                        key={item.id}
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleNavigation(item)}
                                        className={`block w-full text-left px-3 py-2 font-medium tracking-wide transition-all duration-300 rounded-lg ${!isHomePage
                                                ? (pathname === '/catalogo' && item.id === 'categorias')
                                                    ? 'text-white bg-gray-800/50 transform scale-105'
                                                    : 'text-white hover:text-gray-200 hover:bg-gray-800/50'
                                                : isHomePage
                                                    ? getSectionClasses(
                                                        item.id,
                                                        'text-[var(--red)] bg-gray-50 transform scale-105',
                                                        'text-[var(--black)] hover:text-[var(--red)] hover:bg-gray-50 hover:transform hover:scale-105'
                                                    )
                                                    : 'text-white hover:text-gray-200 hover:bg-gray-800/50'
                                            }`}
                                        aria-label={`Ir a sección ${item.label}`}
                                    >
                                        {item.label}
                                    </motion.button>
                                ))}

                                {/* Mobile Actions */}
                                {/* <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className={`border-t ${!isHomePage ? 'border-gray-600' : 'border-gray-100'} pt-4 flex justify-center space-x-6`}
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`flex flex-col items-center space-y-1 transition-colors ${!isHomePage
                                                ? 'text-white hover:text-gray-200'
                                                : 'text-[var(--gray-medium)] hover:text-[var(--red)]'
                                            }`}
                                        aria-label="Buscar productos"
                                    >
                                        <Search className="w-5 h-5" />
                                        <span className="text-xs">Buscar</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`flex flex-col items-center space-y-1 transition-colors ${!isHomePage
                                                ? 'text-white hover:text-gray-200'
                                                : 'text-[var(--gray-medium)] hover:text-[var(--red)]'
                                            }`}
                                        aria-label="Mi cuenta"
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="text-xs">Cuenta</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`flex flex-col items-center space-y-1 transition-colors relative ${!isHomePage
                                                ? 'text-white hover:text-gray-200'
                                                : 'text-[var(--gray-medium)] hover:text-[var(--red)]'
                                            }`}
                                        aria-label="Carrito de compras"
                                    >
                                        <div className="relative">
                                            <ShoppingBag className="w-5 h-5" />
                                            <span className="absolute -top-1 -right-1 bg-[var(--red)] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                0
                                            </span>
                                        </div>
                                        <span className="text-xs">Carrito</span>
                                    </motion.button>
                                </motion.div> */}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
};

export default Navbar;