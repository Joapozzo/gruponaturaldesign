'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/app/components/hooks/useCart';
import { useSyncAuthToCart } from '@/app/hooks/useSyncAuthToCart';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();
  useSyncAuthToCart();

  // Prevenir navegación fuera del checkout
  useEffect(() => {
    // Si el carrito está vacío, redirigir al catálogo
    if (itemCount === 0 && pathname === '/checkout') {
      router.push('/shoponline');
      return;
    }

    // Prevenir navegación con el botón de retroceso del navegador
    const handlePopState = (event: PopStateEvent) => {
      // Si estamos en checkout, prevenir el retroceso
      if (pathname?.startsWith('/checkout')) {
        // Reemplazar el estado actual para evitar que el usuario salga
        window.history.pushState(null, '', pathname);
        // Opcional: mostrar un mensaje o confirmación
        const confirmExit = window.confirm(
          '¿Estás seguro de que quieres salir del checkout? Tu pedido se guardará.'
        );
        if (confirmExit) {
          router.push('/shoponline');
        }
      }
    };

    // Agregar el estado inicial para prevenir retroceso
    window.history.pushState(null, '', pathname);

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, router, itemCount]);

  // Prevenir navegación con teclas (Ctrl+H, Alt+Left, etc.)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevenir atajos de navegación comunes
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === 'h' || event.key === 'H')
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <>{children}</>;
}

