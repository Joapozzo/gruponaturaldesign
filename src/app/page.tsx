import React, { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createSSRQueryClient } from './utils/createSSRQueryClient';
import { prefetchProductosDestacados } from './utils/prefetchProductosDestacados';
import Hero from './components/Hero';
import Categorias from './components/Categorias';
import ProductosDestacados from './components/ProductosDestacados';
import Nosotros from './components/Nosotros';
import Testimonios from './components/Testimonios';
import Faq from './components/Faq';
import Contacto from './components/Contacto';
import InstagramCTA from './components/InstagramCTA';
import DesignHero from './components/DesignHero';
import CallToAction from './components/CallToAction';
import ProductosDestacadosSkeleton from './components/skeleton/ProductSectionSkeleton';

/**
 * Página principal (Server Component)
 * Pre-fetch de datos para mejor performance y SEO
 */
export default async function HomePage() {
  // Crear QueryClient para SSR
  const queryClient = createSSRQueryClient();

  // Pre-fetch de productos destacados
  await prefetchProductosDestacados(queryClient, {
    limit: 20,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-white">
        <Hero />
        
        <Suspense fallback={<ProductosDestacadosSkeleton />}>
          <ProductosDestacados />
        </Suspense>
        
        <Categorias />
        <DesignHero />
        <CallToAction />
        <InstagramCTA />
        <Nosotros />
        <Testimonios />
        <Faq />
        <Contacto />
      </div>
    </HydrationBoundary>
  );
}

