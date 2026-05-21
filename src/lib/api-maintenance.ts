import { maintenancePageUrl, type MaintenanceUiScope } from './maintenance-routes';

export const MAINTENANCE_API_CODE = 'MAINTENANCE';

export function isMaintenanceApiPayload(
  data: unknown
): data is { code: string; scope?: MaintenanceUiScope; message?: string } {
  return (
    !!data &&
    typeof data === 'object' &&
    'code' in data &&
    (data as { code: string }).code === MAINTENANCE_API_CODE
  );
}

export function getMaintenanceScopeFromPayload(
  data: unknown
): MaintenanceUiScope {
  if (isMaintenanceApiPayload(data) && data.scope === 'admin') {
    return 'admin';
  }
  return 'public';
}

/** Redirige en el navegador a la página de mantenimiento (idempotente). */
export function redirectToMaintenancePage(scope: MaintenanceUiScope = 'public'): void {
  if (typeof window === 'undefined') {
    return;
  }
  const target = maintenancePageUrl(scope);
  if (window.location.pathname.startsWith('/maintenance')) {
    return;
  }
  window.location.href = target;
}

/**
 * Si la respuesta es 503 por mantenimiento, redirige y devuelve true.
 * Usar en fetch directos (AuthContext, services, etc.).
 */
export function tryHandleMaintenanceResponse(
  status: number,
  data: unknown
): boolean {
  if (status === 503 && isMaintenanceApiPayload(data)) {
    redirectToMaintenancePage(getMaintenanceScopeFromPayload(data));
    return true;
  }
  return false;
}
