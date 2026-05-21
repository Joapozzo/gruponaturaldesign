'use client';

import { useRouter } from 'next/navigation';
import CheckoutStep2 from '@/app/components/checkout/CheckoutStep2';
import { CHECKOUT_ROUTES } from '@/app/components/checkout/checkoutRoutes';

export default function CheckoutDatosPage() {
  const router = useRouter();

  return (
    <CheckoutStep2
      onNext={() => router.push(CHECKOUT_ROUTES.envio)}
      onBack={() => router.push(CHECKOUT_ROUTES.pedido)}
    />
  );
}
