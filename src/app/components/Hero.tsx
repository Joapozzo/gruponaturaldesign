'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

const HERO_SLIDES = ['/imgs/hero-1.jpg', '/imgs/hero-2.jpg', '/imgs/hero-3.jpg'];
const HERO_SLIDES_MOBILE = ['/imgs/hero-mobile-1.jpg', '/imgs/hero-mobile-2.jpg', '/imgs/hero-mobile-3.jpg'];
const AUTO_PLAY_MS = 5000;

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, AUTO_PLAY_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="inicio"
      className="relative w-full flex flex-col overflow-hidden"
    >
      {/* Mobile: carrusel vertical (9/16), imágenes completas como HeroMayorista */}
      <div className="relative w-full aspect-[9/16] md:hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={HERO_SLIDES_MOBILE[index]}
              alt={`Hero ${index + 1}`}
              fill
              priority={index === 0}
              quality={90}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="text-white animate-bounce" size={24} />
        </motion.div>
      </div>

      {/* Desktop: carrusel 2:1 */}
      <div className="relative w-full aspect-[2/1] hidden md:block">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={HERO_SLIDES[index]}
              alt={`Hero ${index + 1}`}
              fill
              priority={index === 0}
              quality={90}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="text-white animate-bounce" size={24} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
