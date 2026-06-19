'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCart } from '@/app/components/hooks/useCart';
import { useCartPersistHydrated } from '@/app/hooks/useCartPersistHydrated';
import CheckoutStep4 from '@/app/components/checkout/CheckoutStep4';
import {
  CHECKOUT_INCOMPLETO_QUERY,
  CHECKOUT_ROUTES,
} from '@/app/components/checkout/checkoutRoutes';
import {
  isCheckoutDataCompleteForPayment,
  isCustomerStepCompleteForCheckout,
} from '@/app/components/checkout/checkoutStep2.validation';

function CheckoutPagoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customerData, shippingData } = useCart();
  const hydrated = useCartPersistHydrated();

  useEffect(() => {
    if (searchParams.get(CHECKOUT_INCOMPLETO_QUERY) !== '1') return;
    toast('Checkout sin completar. No se realizó ningún cargo.');
    router.replace(CHECKOUT_ROUTES.pago);
  }, [searchParams, router]);

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

export default function CheckoutPagoPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutPagoContent />
    </Suspense>
  );
}
