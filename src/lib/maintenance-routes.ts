import {
  parseMaintenanceMode,
  MaintenanceMode,
  type MaintenanceUiScope,
  isPublicMaintenanceBlocked,
  isAdminMaintenanceBlocked,
} from './maintenance-mode';

export type { MaintenanceUiScope };

function normalizePathname(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
}

/** Rutas que siempre pasan (página de mantenimiento y assets vía matcher). */
export function isMaintenanceExemptPath(pathname: string): boolean {
  return (
    pathname === '/maintenance' ||
    pathname.startsWith('/maintenance/')
  );
}

export function isAdminFrontendPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

/**
 * Si la ruta del front debe mostrarse en mantenimiento.
 * null = no bloquear.
 */
export function getMaintenanceBlockScope(
  pathname: string,
  rawMode?: string
): MaintenanceUiScope | null {
  const mode = parseMaintenanceMode(rawMode ?? process.env.MAINTENANCE_MODE);
  if (mode === 'off' || isMaintenanceExemptPath(pathname)) {
    return null;
  }

  const isAdmin = isAdminFrontendPath(pathname);

  if (isPublicMaintenanceBlocked(mode) && !isAdmin) {
    return 'public';
  }
  if (isAdminMaintenanceBlocked(mode) && isAdmin) {
    return 'admin';
  }
  return null;
}

/** Route Handlers de Next (/app/api/*): bloquear cuando la tienda está cerrada. */
const CLIENT_API_BLOCKED_UNDER_PUBLIC: readonly string[] = [
  '/api/contact',
  '/api/send-order-email',
  '/api/auth/session',
  '/api/auth/logout',
  '/api/user/roles',
  '/api/product-images',
];

export function shouldBlockClientApiRoute(
  pathname: string,
  rawMode?: string
): MaintenanceUiScope | null {
  const mode = parseMaintenanceMode(rawMode ?? process.env.MAINTENANCE_MODE);
  const normalized = normalizePathname(pathname);

  if (!normalized.startsWith('/api/')) {
    return null;
  }

  if (mode === MaintenanceMode.All) {
    return 'public';
  }

  if (!isPublicMaintenanceBlocked(mode)) {
    return null;
  }

  if (CLIENT_API_BLOCKED_UNDER_PUBLIC.includes(normalized)) {
    return 'public';
  }
  if (normalized.startsWith('/api/auth/')) {
    return 'public';
  }
  return null;
}

export function maintenancePageUrl(scope: MaintenanceUiScope): string {
  return `/maintenance?scope=${scope}`;
}
