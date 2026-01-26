"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface NavbarLogoProps {
    width: number;
    height: number;
    className?: string;
    isMobile?: boolean;
}

/**
 * Componente Logo del Navbar
 * Responsabilidad: Renderizar el logo con animación
 */
export const NavbarLogo: React.FC<NavbarLogoProps> = ({
    width,
    height,
    className = '',
    isMobile = false
}) => {
    const handleLogoClick = () => {
        window.location.href = '/#inicio';
    };

    if (isMobile) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex-1 flex justify-center ${className}`}
            >
                <Image
                    src="/logos/logo-1.svg"
                    alt="NTDS Natural Design Logo"
                    width={width}
                    height={height}
                    className="cursor-pointer"
                    onClick={handleLogoClick}
                    priority
                />
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`hidden lg:block absolute left-1/2 transform -translate-x-1/2 z-10 ${className}`}
        >
            <Image
                src="/logos/logo-1.svg"
                alt="NTDS Natural Design Logo"
                width={width}
                height={height}
                className="cursor-pointer"
                onClick={handleLogoClick}
                priority
            />
        </motion.div>
    );
};

