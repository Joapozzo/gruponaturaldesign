'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/app/hooks/useUserRoles';
import { AuthLoadingScreen } from '@/app/components/AuthLoadingScreen';

/**
 * Protege el panel admin en el cliente: solo muestra children si hay usuario
 * Firebase autenticado Y rol ADMIN (mismo criterio que el API con Bearer).
 * Si no hay auth o token/sesión inválida, redirige a error de acceso.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { firebaseUser, isLoading } = useAuth();
  const roles = useUserRoles();
  const isAdmin = roles.includes('ADMIN');

  useEffect(() => {
    if (isLoading) return;
    if (!firebaseUser || !isAdmin) {
      router.replace('/auth/error?error=AccessDenied');
    }
  }, [isLoading, firebaseUser, isAdmin, router]);

  if (isLoading) {
    return <AuthLoadingScreen message="Verificando acceso..." />;
  }

  if (!firebaseUser || !isAdmin) {
    return <AuthLoadingScreen message="Redirigiendo..." />;
  }

  return <>{children}</>;
}
