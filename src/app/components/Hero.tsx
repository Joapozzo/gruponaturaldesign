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

    const [heroImage, setHeroImage] = useState('/imgs/hero.jpg');
    const { openWhatsApp } = useWhatsApp({ defaultMessage: mensajeCotizacion });

    useEffect(() => {
        const updateImage = () => {
            if (window.innerWidth < 640) {
                setHeroImage('/imgs/nosotros.jpg');
            } else {
                setHeroImage('/imgs/hero.jpg');
            }
        };

        updateImage();
        window.addEventListener('resize', updateImage);
        return () => window.removeEventListener('resize', updateImage);
    }, []);


    return (
      <section
        id="inicio"
        className="relative h-screen flex items-center justify-center overflow-hidden -mt-22"
      >
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Hero NTDS"
            className="w-full h-full object-cover object-top"
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
            className="text-3xl md:text-5xl font-bold mb-4 leading-tight 2xl:text-8xl"
            style={{
              fontFamily: "Franklin Gothic Heavy, Arial Black, sans-serif",
            }}
          >
            UNIFORMES DE DISEÑO
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-xl mb-4 font-light tracking-wide 2xl:text-3xl"
          >
            Más de 25 años vistiendo empresas con calidad y compromiso.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              variant="black"
              onClick={() => scrollToSection("categorias")}
              size="md"
              className="tracking-wide"
            >
              VER CATÁLOGO
            </Button>
            <Button
              variant="lightWhiteOutline"
              onClick={() => openWhatsApp()}
              size="md"
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
    );
}

export default Hero;