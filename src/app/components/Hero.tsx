import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';
import Image from 'next/image';
import Button from './ui/Button';
import { useWhatsApp } from './hooks/useWhatsApp';

const Hero = () => {
    const mensajeCotizacion =
        "¡Hola! Me interesa solicitar una cotización de un proyecto.";
    const {
        scrollToSection,
    } = useNavigation();

    const [heroImage, setHeroImage] = useState('/imgs/Hero-2.jpg');
    const { openWhatsApp } = useWhatsApp({ defaultMessage: mensajeCotizacion });

    useEffect(() => {
        const updateImage = () => {
            if (window.innerWidth < 640) {
                setHeroImage('/imgs/nosotros.jpg'); // imagen para mobile
            } else {
                setHeroImage('/imgs/Hero-2.jpg'); // imagen para desktop
            }
        };

        updateImage();
        window.addEventListener('resize', updateImage);
        return () => window.removeEventListener('resize', updateImage);
    }, []);


    return (
        <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden -mt-22">
            <div className="absolute inset-0">
                <Image
                    src={heroImage}
                    alt="Hero NTDS"
                    className="w-full h-full object-cover"
                    width={20000}
                    height={2000}
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto pt-20">
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
                    style={{ fontFamily: 'Franklin Gothic Heavy, Arial Black, sans-serif' }}
                >
                    UNIFORMES DE DISEÑO
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-2xl md:text-2xl mb-8 font-light tracking-wide"
                >
                    Mas de 25 años vistiendo empresas con calidad y compromiso.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center"
                >
                    <Button
                        variant="black"
                        size="lg"
                        onClick={() => scrollToSection('categorias')}
                        className="tracking-wide"
                    >
                        VER CATÁLOGO
                    </Button>
                    <Button
                        variant="lightWhiteOutline"
                        size="lg"
                        onClick={() => openWhatsApp()}
                        className="tracking-wide"
                    >
                        SOLICITAR COTIZACIÓN
                    </Button>
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