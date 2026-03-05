"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from './ui/Button';
import Link from 'next/link';

const HeroMayorista = () => {
    return (
        <section
            id="wholesale-hero"
            className="relative overflow-hidden flex items-center w-full"
            style={{
                height: '70vh',
                minHeight: '600px'
            }}
        >
            {/* Imagen de fondo — otro fondo respecto a personalizados */}
            <div className="absolute inset-0 w-full h-full">
                <div
                    className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover"
                    style={{ backgroundImage: "url('/imgs/hero.jpg')" }}
                />
                <div className="absolute inset-0 bg-black/55" />
            </div>

            <div className="py-12 relative z-10 w-full">
                <div className="w-full px-4 lg:px-15">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-start gap-6"
                    >
                        {/* Botón Volver — mismo estilo que personalizados, despegado de bordes vía contenedor */}
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
                            <span className="text-white font-medium">Mayorista</span>
                        </nav>

                        {/* Título y Descripción — texto mayorista */}
                        <div className="flex flex-col gap-3">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-display tracking-tight">
                                ¿Tu pedido supera las 20 prendas?
                            </h1>
                            <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl">
                                Por la cantidad, tu compra ingresa en formato Mayorista: descuentos especiales, personalización (bordado/estampa) y formas de pago preferenciales.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroMayorista;
