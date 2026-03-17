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

    const imageProps = {
        src: "/logos/logo-1.svg",
        alt: "NTDS Natural Design Logo",
        width,
        height,
        className: "cursor-pointer object-contain",
        onClick: handleLogoClick,
        priority: true,
        style: { minWidth: width, minHeight: height } as React.CSSProperties,
    };

    if (isMobile) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex-1 flex justify-center items-center min-h-[22px] ${className}`}
            >
                <Image {...imageProps} />
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`hidden lg:flex items-center justify-center min-h-[52px] ${className}`}
        >
            <Image {...imageProps} />
        </motion.div>
    );
};

