import { test, expect } from '@playwright/test';
import { mockBackendApi } from './helpers/apiMocks';
import { setCustomerSession } from './helpers/auth';

test.describe('Protección de rutas', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendApi(page);
  });

  test('checkout sin sesión redirige a login', async ({ page }) => {
    await page.goto('/checkout/pedido');
    await expect(page).toHaveURL(/\/auth\/login/);
    expect(page.url()).toContain('callbackUrl');
  });

  test('checkout con sesión de cliente carga paso pedido', async ({ page, context }) => {
    await setCustomerSession(context);
    await page.goto('/checkout/pedido');
    await expect(page).toHaveURL(/\/checkout\/pedido/);
    await expect(page.locator('body')).toContainText(/carrito|pedido|producto/i);
  });

  test('admin sin sesión redirige a login', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
