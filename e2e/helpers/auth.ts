import { SignJWT } from 'jose';
import type { BrowserContext } from '@playwright/test';
import { AUTH_COOKIE_NAME } from '../../src/lib/auth-config';

export const E2E_AUTH_SECRET = process.env.AUTH_COOKIE_SECRET || 'e2e-test-secret';

export async function signE2eSessionJwt(role: 'CUSTOMER' | 'ADMIN' = 'CUSTOMER'): Promise<string> {
  return new SignJWT({
    uid: 'e2e-user-1',
    needsOnboarding: false,
    needsEmailVerification: false,
    role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
    email: 'e2e@gmail.com',
    usuarioId: 1,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .setIssuedAt()
    .sign(new TextEncoder().encode(E2E_AUTH_SECRET));
}

export async function setCustomerSession(context: BrowserContext) {
  const token = await signE2eSessionJwt('CUSTOMER');
  await context.addCookies([
    {
      name: AUTH_COOKIE_NAME,
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
}

export async function setAdminSession(context: BrowserContext) {
  const token = await signE2eSessionJwt('ADMIN');
  await context.addCookies([
    {
      name: AUTH_COOKIE_NAME,
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
}
