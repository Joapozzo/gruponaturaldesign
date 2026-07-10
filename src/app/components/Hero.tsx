'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

const DEFAULT_DESKTOP_SLIDES = [
  '/imgs/hero/hero-desktop.jpg',
  '/imgs/hero/hero2-desktop.jpg',
];
const DEFAULT_MOBILE_SLIDES = [
  '/imgs/hero/hero-mobile.jpg',
  '/imgs/hero/hero2-mobile.jpg',
];
const AUTO_PLAY_MS = 5000;

export type HeroProps = {
  id?: string;
  desktopSlides?: string[];
  mobileSlides?: string[];
  alt?: string;
  /** Por defecto: true si hay más de un slide en desktop */
  carousel?: boolean;
  showScrollHint?: boolean;
  children?: React.ReactNode;
};

type HeroPanelProps = {
  slides: string[];
  aspectClass: string;
  visibilityClass: string;
  index: number;
  carousel: boolean;
  alt: string;
  showScrollHint: boolean;
  /** Solo una imagen LCP en toda la home (primer slide mobile). */
  lcpPriority: boolean;
};

function HeroSlideImage({
  src,
  alt,
  priority,
  loading,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      loading={priority ? undefined : loading ?? 'lazy'}
      quality={priority ? 80 : 70}
      sizes="100vw"
      className="object-cover object-center"
    />
  );
}

function HeroPanel({
  slides,
  aspectClass,
  visibilityClass,
  index,
  carousel,
  alt,
  showScrollHint,
  lcpPriority,
}: HeroPanelProps) {
  return (
    <div className={`relative w-full ${aspectClass} ${visibilityClass}`}>
      {carousel ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HeroSlideImage
              src={slides[index]}
              alt={`${alt} ${index + 1}`}
              priority={lcpPriority && index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="absolute inset-0 w-full h-full">
          <HeroSlideImage
            src={slides[0]}
            alt={alt}
            priority={lcpPriority}
            loading="eager"
          />
        </div>
      )}
      {showScrollHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="text-white animate-bounce" size={24} />
        </motion.div>
      )}
    </div>
  );
}

const Hero = ({
  id = 'inicio',
  desktopSlides = DEFAULT_DESKTOP_SLIDES,
  mobileSlides = DEFAULT_MOBILE_SLIDES,
  alt = 'Hero',
  carousel = desktopSlides.length > 1,
  showScrollHint = carousel,
  children,
}: HeroProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!carousel) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % desktopSlides.length);
    }, AUTO_PLAY_MS);
    return () => clearInterval(t);
  }, [carousel, desktopSlides.length]);

  return (
    <section
      id={id}
      className="relative w-full flex flex-col overflow-hidden"
    >
      <HeroPanel
        slides={mobileSlides}
        aspectClass="aspect-[9/16]"
        visibilityClass="md:hidden"
        index={index}
        carousel={carousel}
        alt={alt}
        showScrollHint={showScrollHint}
        lcpPriority
      />
      <HeroPanel
        slides={desktopSlides}
        aspectClass="aspect-[2/1]"
        visibilityClass="hidden md:block"
        index={index}
        carousel={carousel}
        alt={alt}
        showScrollHint={showScrollHint}
        lcpPriority={false}
      />
      {children}
    </section>
  );
};

export default Hero;
