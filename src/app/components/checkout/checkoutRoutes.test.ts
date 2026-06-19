import { describe, it, expect } from 'vitest';
import { CHECKOUT_ROUTES, isCheckoutStepPath } from './checkoutRoutes';

describe('checkoutRoutes', () => {
  it('expone rutas del funnel', () => {
    expect(CHECKOUT_ROUTES.pedido).toBe('/checkout/pedido');
    expect(CHECKOUT_ROUTES.pago).toBe('/checkout/pago');
  });

  it('isCheckoutStepPath reconoce pasos del funnel', () => {
    expect(isCheckoutStepPath('/checkout/datos')).toBe(true);
    expect(isCheckoutStepPath('/checkout/pago-resultado')).toBe(false);
    expect(isCheckoutStepPath(null)).toBe(false);
  });
});
