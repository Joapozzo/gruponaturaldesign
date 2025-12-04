'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import WhatsAppCommercialButton from './WhatsAppCommercialButton';
import PromoBanner from './PromoBanner';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInCheckout = pathname?.startsWith('/checkout');
  const isWholesalePage = pathname === '/mayorista';

  // Si estamos en checkout, no renderizar Navbar, Footer, etc.
  if (isInCheckout) {
    return <>{children}</>;
  }

  // Si estamos en página mayorista, mostrar PromoBanner y solo WhatsApp comercial
  if (isWholesalePage) {
    return (
      <>
        <PromoBanner />
        <Navbar />
        {children}
        <Footer />
        <WhatsAppCommercialButton />
      </>
    );
  }

  // Renderizar layout normal
  return (
    <>
      <PromoBanner />
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  );
}

