/** Alineado con `INTEGRATIONS_ENV` del API (default seguro: test). */
const PROD_ALIASES = new Set(['prod', 'production', 'live']);

export function isIntegrationsLiveClient(): boolean {
  const v = (process.env.NEXT_PUBLIC_INTEGRATIONS_ENV ?? 'test').trim().toLowerCase();
  return PROD_ALIASES.has(v);
}
