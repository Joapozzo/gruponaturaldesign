import { describe, it, expect } from 'vitest';
import {
  parseMaintenanceMode,
  MaintenanceMode,
  isPublicMaintenanceBlocked,
  isAdminMaintenanceBlocked,
} from './maintenance-mode';

describe('maintenance-mode (client)', () => {
  it('valores válidos', () => {
    expect(parseMaintenanceMode('off')).toBe(MaintenanceMode.Off);
    expect(parseMaintenanceMode('public')).toBe(MaintenanceMode.Public);
    expect(parseMaintenanceMode('ADMIN')).toBe(MaintenanceMode.Admin);
    expect(parseMaintenanceMode('all')).toBe(MaintenanceMode.All);
  });

  it('inválido → off', () => {
    expect(parseMaintenanceMode(undefined)).toBe(MaintenanceMode.Off);
    expect(parseMaintenanceMode('nope')).toBe(MaintenanceMode.Off);
  });

  it('flags de bloqueo', () => {
    expect(isPublicMaintenanceBlocked(MaintenanceMode.Public)).toBe(true);
    expect(isPublicMaintenanceBlocked(MaintenanceMode.Admin)).toBe(false);
    expect(isAdminMaintenanceBlocked(MaintenanceMode.Admin)).toBe(true);
    expect(isAdminMaintenanceBlocked(MaintenanceMode.All)).toBe(true);
  });
});
