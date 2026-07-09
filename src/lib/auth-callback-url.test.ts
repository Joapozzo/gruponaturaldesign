import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  AUTH_CALLBACK_STORAGE_KEY,
  buildAuthLoginUrl,
  clearPersistedAuthCallback,
  persistAuthCallback,
  readPersistedAuthCallback,
  resolveAuthCallbackPath,
  withAuthCallback,
} from './auth-callback-url';

describe('auth-callback-url persistence', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('persistAuthCallback stores non-home paths', () => {
    persistAuthCallback('/checkout/pedido');
    expect(sessionStorage.getItem(AUTH_CALLBACK_STORAGE_KEY)).toBe('/checkout/pedido');
  });

  it('does not persist home as callback', () => {
    persistAuthCallback('/');
    expect(sessionStorage.getItem(AUTH_CALLBACK_STORAGE_KEY)).toBeNull();
  });

  it('resolveAuthCallbackPath prefers URL over storage', () => {
    persistAuthCallback('/checkout/datos');
    expect(resolveAuthCallbackPath('/checkout/pedido')).toBe('/checkout/pedido');
  });

  it('resolveAuthCallbackPath falls back to sessionStorage', () => {
    persistAuthCallback('/checkout/pedido');
    expect(resolveAuthCallbackPath(null)).toBe('/checkout/pedido');
  });

  it('withAuthCallback adds query param and persists', () => {
    expect(withAuthCallback('/auth/register', '/checkout/pedido')).toBe(
      '/auth/register?callbackUrl=%2Fcheckout%2Fpedido',
    );
    expect(readPersistedAuthCallback()).toBe('/checkout/pedido');
  });

  it('clearPersistedAuthCallback removes stored path', () => {
    persistAuthCallback('/checkout/pedido');
    clearPersistedAuthCallback();
    expect(readPersistedAuthCallback()).toBeNull();
  });

  it('buildAuthLoginUrl includes callback from current path', () => {
    vi.stubGlobal('window', {
      location: { pathname: '/checkout/pedido', search: '' },
    });
    expect(buildAuthLoginUrl({ reason: 'session_expired' })).toBe(
      '/auth/login?reason=session_expired&callbackUrl=%2Fcheckout%2Fpedido',
    );
    vi.unstubAllGlobals();
  });
});
