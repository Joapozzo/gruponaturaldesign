"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Home, ShoppingBag, ArrowLeft, LucideIcon } from 'lucide-react';
import Button from './ui/Button';
import Link from 'next/link';

interface ErrorPageTemplateProps {
    code: string;
    title: string;
    description: string;
    icon: LucideIcon;
    showBackButton?: boolean;
    children?: React.ReactNode;
}

export default function ErrorPageTemplate({
    code,
    title,
    description,
    icon: Icon,
    showBackButton = true,
    children,
}: ErrorPageTemplateProps) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-10">
            <div className="max-w-4xl w-full text-center">
                {/* Código grande */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-8"
                >
                    <h1 className="text-9xl sm:text-[10rem] lg:text-[10rem] font-bold text-black leading-none">
                        {code.split('').map((char, index) => (
                            <span
                                key={index}
                                className={char === '0' ? 'text-[#Ed3237]' : ''}
                            >
                                {char}
                            </span>
                        ))}
                    </h1>
                </motion.div>

                {/* Mensaje principal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">
                        {title}
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        {description}
                    </p>
                </motion.div>

                {/* Botones de acción */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                >
                    <Button
                        variant="black"
                        size="lg"
                        onClick={() => router.push('/')}
                        className="inline-flex items-center space-x-2 w-full sm:w-auto"
                    >
                        <Home className="w-5 h-5" />
                        <span>Ir al Inicio</span>
                    </Button>

                    <Button
                        variant="blackOutline"
                        size="lg"
                        onClick={() => router.push('/shoponline')}
                        className="inline-flex items-center space-x-2 w-full sm:w-auto"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        <span>Ver Catálogo</span>
                    </Button>

                    {showBackButton && (
                        <Button
                            variant="blackOutline"
                            size="lg"
                            onClick={() => router.back()}
                            className="inline-flex items-center space-x-2 w-full sm:w-auto"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Volver Atrás</span>
                        </Button>
                    )}
                </motion.div>

                {/* Enlaces rápidos */}
                {/* <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="border-t border-gray-200 pt-8"
                >
                    <p className="text-sm text-gray-500 mb-4">Enlaces útiles:</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link
                            href="/shoponline"
                            className="text-[#Ed3237] hover:text-[#A80006] transition-colors font-medium"
                        >
                            Shop Online
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link
                            href="/personalizados"
                            className="text-[#Ed3237] hover:text-[#A80006] transition-colors font-medium"
                        >
                            Proyectos Personalizados
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link
                            href="/mayorista"
                            className="text-[#Ed3237] hover:text-[#A80006] transition-colors font-medium"
                        >
                            Compra Mayorista
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link
                            href="/#contacto"
                            className="text-[#Ed3237] hover:text-[#A80006] transition-colors font-medium"
                        >
                            Contacto
                        </Link>
                    </div>
                </motion.div> */}

                {/* Contenido personalizado adicional */}
                {children && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mb-8"
                    >
                        {children}
                    </motion.div>
                )}

                {/* Ilustración decorativa */}
                {/* <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-16 flex justify-center"
                >
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                        <div className="absolute inset-0 bg-gray-100 rounded-full opacity-20"></div>
                        <div className="absolute inset-4 bg-gray-200 rounded-full opacity-30"></div>
                        <div className="absolute inset-8 bg-gray-300 rounded-full opacity-40 flex items-center justify-center">
                            <Icon className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" />
                        </div>
                    </div>
                </motion.div> */}
            </div>
        </div>
    );
}

