'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/app/hooks/useUserRoles';
import { AuthLoadingScreen } from '@/app/components/AuthLoadingScreen';

const ADMIN_LOGIN_CALLBACK = '/admin/dashboard';

/**
 * Protege el panel admin en el cliente: solo muestra children si hay usuario
 * Firebase autenticado Y rol ADMIN (mismo criterio que el API con Bearer).
 * Si la cookie JWT y Firebase están desincronizados, re-sincroniza o limpia sesión
 * en lugar de entrar en bucle con el middleware.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { firebaseUser, isLoading, refreshSessionState, logout } = useAuth();
  const roles = useUserRoles();
  const isAdmin = roles.includes('ADMIN');
  const redirectingRef = useRef(false);

  const hasAccess = !isLoading && Boolean(firebaseUser) && isAdmin;

  useEffect(() => {
    if (isLoading || hasAccess || redirectingRef.current) return;

    let cancelled = false;

    async function resolveAccess() {
      if (firebaseUser) {
        const { state } = await refreshSessionState();
        if (cancelled) return;
        if (state?.role === 'ADMIN') return;

        redirectingRef.current = true;
        window.location.href = '/auth/error?error=AccessDenied';
        return;
      }

      redirectingRef.current = true;
      try {
        await logout();
      } catch {
        // Continuar al login aunque falle el logout remoto
      }
      if (cancelled) return;
      window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(ADMIN_LOGIN_CALLBACK)}`;
    }

    void resolveAccess();

    return () => {
      cancelled = true;
    };
  }, [isLoading, hasAccess, firebaseUser, refreshSessionState, logout]);

  if (isLoading) {
    return <AuthLoadingScreen message="Verificando acceso..." />;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return <AuthLoadingScreen message="Redirigiendo..." />;
}
