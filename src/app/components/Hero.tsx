import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Button from './ui/Button';
import { useNavigation } from '../hooks/useNavigation';

const Hero = () => {
    const [heroImage, setHeroImage] = useState('/imgs/hero.jpg');
    const { scrollToSection } = useNavigation();

    useEffect(() => {
        const updateImage = () => {
            if (window.innerWidth < 640) {
                setHeroImage('/imgs/hero.jpg');
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
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={heroImage}
            alt="Hero NTDS"
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
            className="text-3xl md:text-5xl font-light mb-6 2xl:text-7xl"
          >
            <span className="font-bold">Vesti</span> a tu equipo con<br />Grupo Natural Design
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-8"
          >
            <Button
              variant="lightWhiteOutline"
              onClick={() => scrollToSection("categorias")}
              size="md"
              className="font-light tracking-wide"
            >
              Comenza ya
            </Button>
          </motion.div>
        </div>

        {/* Links en la parte inferior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-8 left-0 right-0 w-full px-4 md:px-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-5xl mx-auto">
            <motion.a
              href="/shoponline"
              className="text-white hover:text-gray-300 transition-colors duration-300 text-sm md:text-base font-light tracking-wide cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              SHOP ONLINE
            </motion.a>
            <motion.a
              href="/shoponline"
              className="text-white hover:text-gray-300 transition-colors duration-300 text-sm md:text-base font-light tracking-wide cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              NEW COLLECTION
            </motion.a>
            <motion.a
              href="/shoponline"
              className="text-white hover:text-gray-300 transition-colors duration-300 text-sm md:text-base font-light tracking-wide cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              ESSENTIALS FOR WORK
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-32 md:bottom-36 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="text-white animate-bounce" size={40} />
        </motion.div>
      </section>
    );
}

export default Hero;