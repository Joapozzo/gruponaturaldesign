import { defineConfig, devices } from '@playwright/test';

const PORT = 3002;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 60_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      ...process.env,
      AUTH_COOKIE_SECRET: process.env.AUTH_COOKIE_SECRET || 'e2e-test-secret',
      JWT_SECRET: process.env.JWT_SECRET || 'e2e-test-secret',
      NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN: 'true',
    },
  },
});
