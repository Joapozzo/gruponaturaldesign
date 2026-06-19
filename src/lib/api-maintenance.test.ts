import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isMaintenanceApiPayload,
  tryHandleMaintenanceResponse,
  getMaintenanceScopeFromPayload,
} from './api-maintenance';

describe('api-maintenance', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      location: { pathname: '/checkout', href: '' },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('detecta payload MAINTENANCE', () => {
    expect(isMaintenanceApiPayload({ code: 'MAINTENANCE', scope: 'public' })).toBe(true);
    expect(isMaintenanceApiPayload({ code: 'OTHER' })).toBe(false);
  });

  it('scope desde payload', () => {
    expect(getMaintenanceScopeFromPayload({ code: 'MAINTENANCE', scope: 'admin' })).toBe(
      'admin'
    );
    expect(getMaintenanceScopeFromPayload({ code: 'MAINTENANCE' })).toBe('public');
  });

  it('tryHandleMaintenanceResponse redirige en 503', () => {
    const win = window as Window & { location: { pathname: string; href: string } };
    const ok = tryHandleMaintenanceResponse(503, {
      code: 'MAINTENANCE',
      scope: 'public',
    });
    expect(ok).toBe(true);
    expect(win.location.href).toBe('/maintenance?scope=public');
  });

  it('no redirige si no es mantenimiento', () => {
    const win = window as Window & { location: { pathname: string; href: string } };
    win.location.href = '';
    expect(tryHandleMaintenanceResponse(503, { error: 'db' })).toBe(false);
    expect(win.location.href).toBe('');
  });
});
