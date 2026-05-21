'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { isCheckoutStepPath } from '@/app/components/checkout/checkoutRoutes';
import { clearCheckoutSession } from '@/app/stores/cartStore';

/**
 * Al salir del funnel checkout (pedido → pago), limpia cupón y datos de checkout.
 * Los productos del carrito se mantienen.
 */
export function useCheckoutSessionLifecycle() {
  const pathname = usePathname();
  const wasInCheckoutStepsRef = useRef(false);

  useEffect(() => {
    const inSteps = isCheckoutStepPath(pathname);

    if (wasInCheckoutStepsRef.current && !inSteps) {
      clearCheckoutSession();
    }

    wasInCheckoutStepsRef.current = inSteps;
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (wasInCheckoutStepsRef.current) {
        clearCheckoutSession();
      }
    };
  }, []);
}
