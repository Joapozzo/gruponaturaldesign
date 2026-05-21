export const CHECKOUT_ROUTES = {
  pedido: '/checkout/pedido',
  datos: '/checkout/datos',
  envio: '/checkout/envio',
  pago: '/checkout/pago',
} as const;

/** Pasos del funnel donde aplica cupón y datos de checkout (no incluye resultado/instrucciones). */
export const CHECKOUT_STEP_PATHS: readonly string[] = [
  CHECKOUT_ROUTES.pedido,
  CHECKOUT_ROUTES.datos,
  CHECKOUT_ROUTES.envio,
  CHECKOUT_ROUTES.pago,
];

export function isCheckoutStepPath(pathname: string | null): boolean {
  return pathname != null && CHECKOUT_STEP_PATHS.includes(pathname);
}
