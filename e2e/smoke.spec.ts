import { test, expect } from '@playwright/test';
import { mockBackendApi } from './helpers/apiMocks';

test.describe('Smoke público', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendApi(page);
  });

  test('home responde OK', async ({ page }) => {
    const res = await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    expect(res?.status()).toBeLessThan(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('login muestra formulario', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByPlaceholder('tu@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('********')).toBeVisible();
  });

  test('shoponline responde con catálogo', async ({ page }) => {
    await page.goto('/shoponline');
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/shoponline/);
  });
});
