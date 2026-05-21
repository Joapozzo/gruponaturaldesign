import { describe, it, expect } from 'vitest';
import {
  getMaintenanceBlockScope,
  shouldBlockClientApiRoute,
  isMaintenanceExemptPath,
  maintenancePageUrl,
} from './maintenance-routes';

describe('maintenance-routes', () => {
  it('exempt solo /maintenance', () => {
    expect(isMaintenanceExemptPath('/maintenance')).toBe(true);
    expect(isMaintenanceExemptPath('/shoponline')).toBe(false);
  });

  it('public bloquea tienda y no admin', () => {
    expect(getMaintenanceBlockScope('/', 'public')).toBe('public');
    expect(getMaintenanceBlockScope('/checkout', 'public')).toBe('public');
    expect(getMaintenanceBlockScope('/auth/login', 'public')).toBe('public');
    expect(getMaintenanceBlockScope('/admin/dashboard', 'public')).toBe(null);
  });

  it('admin bloquea panel', () => {
    expect(getMaintenanceBlockScope('/admin', 'admin')).toBe('admin');
    expect(getMaintenanceBlockScope('/admin/pedidos', 'admin')).toBe('admin');
    expect(getMaintenanceBlockScope('/', 'admin')).toBe(null);
  });

  it('all bloquea tienda y admin en front', () => {
    expect(getMaintenanceBlockScope('/', 'all')).toBe('public');
    expect(getMaintenanceBlockScope('/admin', 'all')).toBe('admin');
  });

  it('off no bloquea', () => {
    expect(getMaintenanceBlockScope('/checkout', 'off')).toBe(null);
    expect(getMaintenanceBlockScope('/admin', 'off')).toBe(null);
  });

  it('client API bajo public', () => {
    expect(shouldBlockClientApiRoute('/api/contact', 'public')).toBe('public');
    expect(shouldBlockClientApiRoute('/api/contact', 'admin')).toBe(null);
    expect(shouldBlockClientApiRoute('/api/auth/session', 'public')).toBe('public');
  });

  it('client API bajo all bloquea cualquier /api', () => {
    expect(shouldBlockClientApiRoute('/api/contact', 'all')).toBe('public');
    expect(shouldBlockClientApiRoute('/api/auth/session', 'all')).toBe('public');
  });

  it('maintenancePageUrl', () => {
    expect(maintenancePageUrl('admin')).toBe('/maintenance?scope=admin');
  });
});
