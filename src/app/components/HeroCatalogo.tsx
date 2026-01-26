'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Grid3X3 } from 'lucide-react';
import Button from './ui/Button';
import Link from 'next/link';

interface HeroCatalogoProps {
    productCount?: number;
    isLoading?: boolean;
}

const HeroCatalogo = ({ productCount = 0, isLoading = false }: HeroCatalogoProps) => {
    return (
        <section
            id="catalog-header"
            className="relative overflow-hidden flex items-center w-full"
            style={{ 
                height: '70vh',
                minHeight: '600px'
            }}
        >
            {/* Imagen de fondo */}
            <div className="absolute inset-0 w-full h-full">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-top bg-no-repeat"
                    style={{ backgroundImage: "url('/imgs/Hero-3.jpg')" }}
                />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <div className="py-12 relative z-10 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-start gap-6"
                    >
                        {/* Botón Volver */}
                        <Button
                            variant="lightWhiteOutline"
                            size="sm"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center space-x-2"
                        >
                            <ArrowLeft size={16} />
                            <span>Volver</span>
                        </Button>

                        {/* Breadcrumb */}
                        <nav className="flex items-center space-x-2 text-sm text-gray-300">
                            <Link href="/" className="hover:text-white transition-colors">
                                Inicio
                            </Link>
                            <span>/</span>
                            <span className="text-white font-medium">Shop Online</span>
                        </nav>

                        {/* Título y Descripción */}
                        <div className="flex flex-col gap-3">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-display leading-tight">
                                Shop Online
                            </h1>
                            <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl">
                                Descubrí toda nuestra colección de uniformes y prendas profesionales
                            </p>
                            
                            {/* Contador de productos */}
                            <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-300 mt-2">
                                <Grid3X3 size={18} />
                                <span>
                                    {isLoading
                                        ? 'Cargando...'
                                        : `${productCount} productos disponibles`
                                    }
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroCatalogo;

