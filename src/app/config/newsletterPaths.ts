/** Rutas exactas donde puede mostrarse el popup de newsletter */
const NEWSLETTER_EXACT_PATHS = new Set([
  '/',
  '/shoponline',
  '/perfil',
  '/mayorista',
  '/personalizados',
  '/politicas-cambio-devolucion',
]);

/** Prefijos permitidos (rutas dinámicas) */
const NEWSLETTER_PREFIX_PATHS = ['/producto/'] as const;

export function isNewsletterAllowedPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (NEWSLETTER_EXACT_PATHS.has(pathname)) return true;
  return NEWSLETTER_PREFIX_PATHS.some((prefix) => pathname.startsWith(prefix));
}
