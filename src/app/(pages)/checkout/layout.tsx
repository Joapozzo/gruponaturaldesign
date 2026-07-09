'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/app/components/hooks/useCart';
import { useSyncAuthToCart } from '@/app/hooks/useSyncAuthToCart';
import CheckoutShell from '@/app/components/checkout/CheckoutShell';
import {
  CHECKOUT_ROUTES,
  isCheckoutStepPath,
} from '@/app/components/checkout/checkoutRoutes';
import { useCartStore } from '@/app/stores/cartStore';
import { useCheckoutSessionLifecycle } from '@/app/hooks/useCheckoutSessionLifecycle';

/** Pasos que exigen ítems en carrito (en /pago el carrito puede vaciarse al confirmar el pedido). */
const CHECKOUT_ROUTES_REQUIRE_CART: readonly string[] = [
  CHECKOUT_ROUTES.pedido,
  CHECKOUT_ROUTES.datos,
  CHECKOUT_ROUTES.envio,
];

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { items, itemCount } = useCart();
  const { isLoading: authLoading } = useAuth();
  const [cartHydrated, setCartHydrated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return useCartStore.persist?.hasHydrated() ?? false;
  });
  useSyncAuthToCart();
  useCheckoutSessionLifecycle();

  useEffect(() => {
    if (!useCartStore.persist) return;
    setCartHydrated(useCartStore.persist.hasHydrated());
    return useCartStore.persist.onFinishHydration(() => setCartHydrated(true));
  }, []);

  useEffect(() => {
    if (!cartHydrated || authLoading) return;
    const hasItems = items.length > 0 || itemCount > 0;
    if (
      !hasItems &&
      pathname != null &&
      CHECKOUT_ROUTES_REQUIRE_CART.includes(pathname)
    ) {
      router.replace('/shoponline');
    }
  }, [pathname, router, items.length, itemCount, cartHydrated, authLoading]);

  if (isCheckoutStepPath(pathname)) {
    return <CheckoutShell>{children}</CheckoutShell>;
  }

  return <>{children}</>;
}
