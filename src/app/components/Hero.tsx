import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';
import Image from 'next/image';

const Hero = () => {

    const {
        scrollToSection,
    } = useNavigation();

    return (
        <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden -mt-22">
            <div className="absolute inset-0">
                <Image
                    src="/imgs/14.png"
                    alt="Hero NTDS"
                    className="w-full h-full object-cover"
                    width={20000}
                    height={2000}
                />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto pt-20">
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
                    style={{ fontFamily: 'Franklin Gothic Heavy, Arial Black, sans-serif' }}
                >
                    UNIFORMES DE DISEÑO
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-2xl md:text-3xl mb-8 font-light tracking-wide"
                >
                    Más de 25 años vistiendo empresas con calidad y estilo
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center"
                >
                    <button
                        onClick={() => scrollToSection('categorias')}
                        className="bg-[var(--red)] hover:bg-[var(--red-dark)] text-white px-12 py-4 text-lg font-semibold tracking-wide transition-all transform hover:scale-105"
                    >
                        VER CATÁLOGO
                    </button>
                    <button
                        onClick={() => scrollToSection('contacto')}
                        className="border-2 border-white text-white hover:bg-white hover:text-[var(--black)] px-12 py-4 text-lg font-semibold tracking-wide transition-all"
                    >
                        SOLICITAR COTIZACIÓN
                    </button>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <ChevronDown className="text-white animate-bounce" size={40} />
            </motion.div>
        </section>
    )
}

export default Hero;