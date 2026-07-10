import React, { Suspense } from 'react';
import Hero from './components/Hero';
import Categorias from './components/Categorias';
import FeaturesCards from './components/FeaturesCards';
import Nosotros from './components/Nosotros';
import Testimonios from './components/Testimonios';
import Faq from './components/Faq';
import ComoTrabajamos from './components/ComoTrabajamos';
import Contacto from './components/Contacto';
import InstagramCTA from './components/InstagramCTA';
import DesignHero from './components/DesignHero';
import CallToAction from './components/CallToAction';
import ProductosDestacadosSkeleton from './components/skeleton/ProductSectionSkeleton';
import ProductosDestacadosSection from './components/home/ProductosDestacadosSection';

/** ISR: cachear HTML de la home y revalidar en background. */
export const revalidate = 120;

/**
 * Página principal (Server Component)
 * Hero y secciones estáticas al instante; destacados en streaming vía Suspense.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />

      <Suspense fallback={<ProductosDestacadosSkeleton />}>
        <ProductosDestacadosSection />
      </Suspense>

      {/* Categorías + DesignHero (100vh c/u), mismo gap */}
      <div className="w-full flex flex-col gap-2">
        <Categorias />
        <FeaturesCards />
        <div className="w-full px-4 lg:px-15 shrink-0">
          <DesignHero />
        </div>
      </div>
      {/* Secciones separadas con gap; ComoTrabajamos + Contacto juntos con pt-20 opcional */}
      <div className="flex flex-col gap-16 lg:gap-20">
        <CallToAction />
        <Nosotros />
        <Testimonios />
        <Faq />
        <div className="flex flex-col pt-0">
          <ComoTrabajamos />
          <InstagramCTA />
          <Contacto />
        </div>
      </div>
    </div>
  );
}
