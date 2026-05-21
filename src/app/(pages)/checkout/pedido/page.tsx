'use client';

import { useRouter } from 'next/navigation';
import CheckoutStep1 from '@/app/components/checkout/CheckoutStep1';
import { SALES_CONFIG } from '@/app/config/sales.config';
import { CHECKOUT_ROUTES } from '@/app/components/checkout/checkoutRoutes';

export default function CheckoutPedidoPage() {
  const router = useRouter();

  return (
    <CheckoutStep1
      onNext={() => router.push(CHECKOUT_ROUTES.datos)}
      onBack={() => router.push(SALES_CONFIG.SHOP_ROUTE)}
    />
  );
}
