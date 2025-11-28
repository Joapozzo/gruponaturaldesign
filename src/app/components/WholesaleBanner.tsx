"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface WholesaleBannerProps {
    fullScreen?: boolean;
}

export default function WholesaleBanner({ fullScreen = false }: WholesaleBannerProps) {
    if (fullScreen) {
        // Versión full screen para página de mayoristas - Estilo como Hero.tsx
        return (
            <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src="/imgs/hero.jpg"
                        alt="Compra por mayor"
                        fill
                        priority
                        quality={90}
                        sizes="100vw"
                        className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto pt-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-3xl md:text-5xl font-semibold mb-4 2xl:text-7xl"
                    >
                        ¿Tu pedido supera las 20 prendas?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-xl md:text-xl mb-4 font-light tracking-wide 2xl:text-2xl"
                    >
                        ¡Excelente! Por la cantidad, tu compra ingresa automáticamente en nuestro formato Mayorista, con descuentos especiales, opciones de personalización (bordado/estampa) y formas de pago preferenciales.
                    </motion.p>
                </div>
            </section>
        );
    }

    // Versión compacta para Navbar (sin imagen de fondo)
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-gradient-to-r from-[#Ed3237] to-red-700 text-white"
        >
            {/* Contenido compacto */}
            <div className="py-2 sm:py-3 px-3 sm:px-4 lg:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                <h3 className="font-bold text-xs sm:text-sm lg:text-base leading-tight">
                                    ¿Tu pedido supera las 20 prendas?
                                </h3>
                            </div>
                            <p className="text-[10px] sm:text-xs lg:text-sm text-white/95 leading-relaxed line-clamp-2 sm:line-clamp-none">
                                ¡Excelente! Por la cantidad, tu compra ingresa automáticamente en nuestro formato Mayorista, con descuentos especiales, opciones de personalización (bordado/estampa) y formas de pago preferenciales.
                            </p>
                        </div>
                        <Link
                            href="/quiero-comprar-por-mayor"
                            className="flex items-center gap-1.5 bg-white text-[#Ed3237] px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap text-[10px] sm:text-xs lg:text-sm shadow-md flex-shrink-0"
                        >
                            <span>Saber más</span>
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

