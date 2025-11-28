"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';
import Section from '@/app/components/Section';
import Button from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WholesaleBanner from '@/app/components/WholesaleBanner';

export default function QuieroComprarPorMayorPage() {
    const router = useRouter();

    const beneficios = [
        'Precios especiales según cantidad',
        'Opciones de pago flexibles',
        'Atención personalizada',
        'Producción programada y logística a medida',
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Banner Full Screen */}
            <div className="relative">
                <WholesaleBanner fullScreen={true} />
                {/* Botón volver flotante */}
                <motion.button
                    onClick={() => router.back()}
                    className="absolute top-6 left-4 sm:left-6 z-20 flex items-center gap-2 bg-white/90 hover:bg-white text-[#Ed3237] px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg backdrop-blur-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm sm:text-base">Volver</span>
                </motion.button>
            </div>

            {/* Contenido principal */}
            <Section
                id="wholesale-content"
                className="py-8 sm:py-12 lg:py-16"
                contentClassName="max-w-4xl mx-auto"
            >
                <div className="space-y-6 sm:space-y-8">
                    {/* Información principal */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gray-50 p-6 sm:p-8 rounded-lg border border-gray-200"
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <ShoppingCart className="w-6 h-6 text-[#Ed3237] flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                                    Cómo funciona
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    👉 Armá tu carrito normalmente (seleccioná prendas, colores y talles).
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    Una vez confirmado, un asesor especializado recibirá el detalle y se pondrá en contacto para ofrecerte la cotización mayorista personalizada antes de cerrar tu pedido.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Beneficios */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200"
                    >
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                            ✔ Beneficios para compras mayoristas:
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                            {beneficios.map((beneficio, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-[#Ed3237] flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 text-sm sm:text-base">{beneficio}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Mensaje final */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-[#Ed3237]/10 p-6 sm:p-8 rounded-lg border-2 border-[#Ed3237]/20"
                    >
                        <p className="text-center text-gray-800 font-semibold text-base sm:text-lg">
                            Seguí tu compra con normalidad. Nosotros hacemos el resto.
                        </p>
                    </motion.div>

                    {/* Botones de acción */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                    >
                        <Button
                            variant="black"
                            size="lg"
                            onClick={() => router.push('/shoponline')}
                            className="inline-flex items-center justify-center space-x-2"
                        >
                            <span>Ver Catálogo</span>
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="blackOutline"
                            size="lg"
                            onClick={() => router.push('/checkout')}
                            className="inline-flex items-center justify-center space-x-2 border-2 border-black"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span>Ir al Carrito</span>
                        </Button>
                    </motion.div>
                </div>
            </Section>
        </div>
    );
}

