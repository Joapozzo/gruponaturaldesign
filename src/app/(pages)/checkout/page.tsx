import { redirect } from 'next/navigation';
import { CHECKOUT_ROUTES } from '@/app/components/checkout/checkoutRoutes';

export default function CheckoutIndexPage() {
  redirect(CHECKOUT_ROUTES.pedido);
}
