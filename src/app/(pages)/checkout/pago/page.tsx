'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/components/hooks/useCart';
import { useCartPersistHydrated } from '@/app/hooks/useCartPersistHydrated';
import CheckoutStep4 from '@/app/components/checkout/CheckoutStep4';
import { CHECKOUT_ROUTES } from '@/app/components/checkout/checkoutRoutes';
import {
  isCheckoutDataCompleteForPayment,
  isCustomerStepCompleteForCheckout,
} from '@/app/components/checkout/checkoutStep2.validation';

export default function CheckoutPagoPage() {
  const router = useRouter();
  const { customerData, shippingData } = useCart();
  const hydrated = useCartPersistHydrated();

  useEffect(() => {
    if (!hydrated) return;
    if (!isCustomerStepCompleteForCheckout(customerData)) {
      router.replace(CHECKOUT_ROUTES.datos);
      return;
    }
    if (!isCheckoutDataCompleteForPayment(customerData, shippingData)) {
      router.replace(CHECKOUT_ROUTES.envio);
    }
  }, [hydrated, customerData, shippingData, router]);

  if (!hydrated) {
    return null;
  }

  if (!isCustomerStepCompleteForCheckout(customerData)) {
    return null;
  }

  if (!isCheckoutDataCompleteForPayment(customerData, shippingData)) {
    return null;
  }

  return <CheckoutStep4 onBack={() => router.push(CHECKOUT_ROUTES.envio)} />;
}
