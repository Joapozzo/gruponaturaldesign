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
  const isInAdmin = pathname?.startsWith('/admin');
  const isAuth = pathname?.startsWith('/auth');
  const isWholesalePage = pathname === '/mayorista';

  if (isAuth) {
    return <>{children}</>;
  }

  // Si estamos en checkout o admin, no renderizar Navbar, Footer, etc.
  if (isInCheckout || isInAdmin) {
    return (
      <>
        {children}
      </>
    );
  }

  // Si estamos en página mayorista, mostrar PromoBanner y solo WhatsApp comercial
  if (isWholesalePage) {
    return (
      <div className="flex min-h-screen flex-col">
        <PromoBanner />
        <Navbar />
        <main className="flex-1 pt-[78px] sm:pt-[90px] lg:pt-[142px]" role="main">
          {children}
        </main>
        <Footer />
        <WhatsAppCommercialButton />
      </div>
    );
  }

  // Renderizar layout normal: flex para que el footer nunca tape el contenido
  return (
    <div className="flex min-h-screen flex-col">
      <PromoBanner />
      <Navbar />
      <main className="flex-1 pt-[78px] sm:pt-[90px] lg:pt-[142px]" role="main">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

