    import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from './ui/Button';
import Link from 'next/link';

const HeroPersonalizados = () => {
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
                    className="absolute inset-0 w-full h-full bg-top bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/imgs/personalizados-hero.png')" }}
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
                            <span className="text-white font-medium">Uniformes personalizados</span>
                        </nav>

                        {/* Título y Descripción */}
                        <div className="flex flex-col gap-3">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-display leading-tight">
                                Uniformes personalizados
                            </h1>
                            <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl">
                                Tu marca, nuestro diseño. Más de 500 empresas confían en nosotros.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default HeroPersonalizados;

