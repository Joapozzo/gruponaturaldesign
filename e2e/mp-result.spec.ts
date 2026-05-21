import { test, expect } from '@playwright/test';
import { mockBackendApi } from './helpers/apiMocks';
import { setCustomerSession } from './helpers/auth';
const CHECKOUT_MP_SNAPSHOT_KEY = 'checkout_mp_snapshot';

test.describe('Resultado Mercado Pago', () => {
  test.beforeEach(async ({ page, context }) => {
    await mockBackendApi(page);
    await setCustomerSession(context);
  });

  test('muestra pago aprobado con query de retorno MP', async ({ page }) => {
    await page.addInitScript(
      ({ key, snapshot }) => {
        sessionStorage.setItem(
          key,
          JSON.stringify({ ...snapshot, savedAt: Date.now() })
        );
      },
      {
        key: CHECKOUT_MP_SNAPSHOT_KEY,
        snapshot: {
          pedidoId: 99,
          totalLabel: '$ 500',
          itemCount: 2,
          clienteEmail: 'e2e@gmail.com',
        },
      }
    );

    await page.goto(
      '/checkout/pago-resultado?status=approved&payment_id=pay-e2e-1&external_reference=pedido_99'
    );

    await expect(page.getByRole('heading', { name: 'Pago aprobado' })).toBeVisible();
    await expect(page.getByText('pay-e2e-1')).toBeVisible();
    await expect(page.getByText('pedido_99')).toBeVisible();
    await expect(page.getByText(/Productos:/)).toBeVisible();
  });

  test('muestra estado pendiente con referencia offline', async ({ page }) => {
    await page.goto('/checkout/pago-resultado?mp_return=pending');
    await expect(page.getByText('Aguardando pago')).toBeVisible();
  });
});
