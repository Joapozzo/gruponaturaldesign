import { test, expect } from '@playwright/test';
import { mockBackendApi } from './helpers/apiMocks';
import { setCustomerSession } from './helpers/auth';

test.describe('Checkout datos', () => {
  test.beforeEach(async ({ page, context }) => {
    await mockBackendApi(page);
    await setCustomerSession(context);
  });

  test('muestra sección de información personal', async ({ page }) => {
    await page.goto('/checkout/datos');
    await expect(page.getByText('INFORMACIÓN PERSONAL')).toBeVisible();
    await expect(page.getByPlaceholder('Nombre')).toBeVisible();
    await expect(page.getByPlaceholder('mail@ejemplo.com').first()).toBeVisible();
  });

  test('nombre vacío muestra error al salir del campo', async ({ page }) => {
    await page.goto('/checkout/datos');
    const nombre = page.getByPlaceholder('Nombre');
    await nombre.fill('');
    await nombre.blur();
    await expect(page.getByText('Requerido').first()).toBeVisible();
  });
});
