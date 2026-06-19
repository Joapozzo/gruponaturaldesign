/**
 * Modo de mantenimiento (espejo de api/src/lib/maintenance-mode.ts).
 */
export const MaintenanceMode = {
  Off: 'off',
  Public: 'public',
  Admin: 'admin',
  All: 'all',
} as const;

export type MaintenanceMode =
  (typeof MaintenanceMode)[keyof typeof MaintenanceMode];

export const MAINTENANCE_MODE_VALUES: readonly MaintenanceMode[] = [
  MaintenanceMode.Off,
  MaintenanceMode.Public,
  MaintenanceMode.Admin,
  MaintenanceMode.All,
];

export function parseMaintenanceMode(
  raw: string | undefined
): MaintenanceMode {
  const v = (raw ?? MaintenanceMode.Off).toLowerCase().trim();
  if (MAINTENANCE_MODE_VALUES.includes(v as MaintenanceMode)) {
    return v as MaintenanceMode;
  }
  return MaintenanceMode.Off;
}

export function isPublicMaintenanceBlocked(mode: MaintenanceMode): boolean {
  return mode === MaintenanceMode.Public || mode === MaintenanceMode.All;
}

export function isAdminMaintenanceBlocked(mode: MaintenanceMode): boolean {
  return mode === MaintenanceMode.Admin || mode === MaintenanceMode.All;
}

export type MaintenanceUiScope = 'public' | 'admin';
