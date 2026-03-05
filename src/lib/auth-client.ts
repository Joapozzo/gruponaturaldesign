/**
 * Solo para uso en el cliente (componentes, apiClient).
 * El AuthProvider registra window.__getFirebaseToken; esta función lo usa.
 */
export async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const g = (window as unknown as { __getFirebaseToken?: () => Promise<string | null> });
  if (g.__getFirebaseToken) return g.__getFirebaseToken();
  return null;
}
