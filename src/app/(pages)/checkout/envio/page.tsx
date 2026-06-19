'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/components/hooks/useCart';
import { useCartPersistHydrated } from '@/app/hooks/useCartPersistHydrated';
import CheckoutStep3Shipping from '@/app/components/checkout/CheckoutStep3Shipping';
import { CHECKOUT_ROUTES } from '@/app/components/checkout/checkoutRoutes';
import { isCustomerStepCompleteForCheckout } from '@/app/components/checkout/checkoutStep2.validation';

export default function CheckoutEnvioPage() {
  const router = useRouter();
  const { customerData } = useCart();
  const hydrated = useCartPersistHydrated();

  useEffect(() => {
    if (!hydrated) return;
    if (!isCustomerStepCompleteForCheckout(customerData)) {
      router.replace(CHECKOUT_ROUTES.datos);
    }
  }, [hydrated, customerData, router]);

  if (!hydrated) {
    return null;
  }

  if (!isCustomerStepCompleteForCheckout(customerData)) {
    return null;
  }

  return (
    <CheckoutStep3Shipping
      onNext={() => router.push(CHECKOUT_ROUTES.pago)}
      onBack={() => router.push(CHECKOUT_ROUTES.datos)}
    />
  );
}
