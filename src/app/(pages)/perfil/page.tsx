'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProfilePageLayout } from '@/app/components/profile/ProfilePageLayout';
import { ProfileUserCard } from '@/app/components/profile/ProfileUserCard';
import { ProfileOrdersList } from '@/app/components/profile/orders/ProfileOrdersList';
import { ProfilePageSkeleton } from '@/app/components/profile/skeletons/ProfilePageSkeleton';
import type { ProfileUser } from '@/app/types/profile.types';
import type { SessionUserState } from '@/types/auth.types';

function sessionToProfileUser(session: SessionUserState): ProfileUser {
  return {
    uid: session.uid,
    email: session.email,
    nombre: session.nombre,
    apellido: session.apellido,
    role: session.role,
    usuarioId: session.usuarioId,
  };
}

export default function PerfilPage() {
  const router = useRouter();
  const { sessionState, isLoading, refreshSessionState } = useAuth();

  useEffect(() => {
    refreshSessionState();
  }, [refreshSessionState]);

  useEffect(() => {
    if (isLoading) return;
    if (!sessionState) {
      router.replace('/auth/login?callbackUrl=/perfil');
    }
  }, [isLoading, sessionState, router]);

  if (isLoading) {
    return (
      <ProfilePageLayout title="Mi perfil">
        <ProfilePageSkeleton />
      </ProfilePageLayout>
    );
  }

  if (!sessionState) {
    return null;
  }

  const profileUser = sessionToProfileUser(sessionState);

  return (
    <ProfilePageLayout title="Mi perfil" hideHeader>
      <header className="mb-6 lg:hidden">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
          Mi perfil
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Datos de tu cuenta y historial de pedidos
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 lg:items-start">
        <div className="lg:col-span-4">
          <ProfileUserCard user={profileUser} heading="Mi perfil" showRole={false} />
        </div>
        <div className="lg:col-span-8 min-w-0">
          <ProfileOrdersList enabled asPanel />
        </div>
      </div>
    </ProfilePageLayout>
  );
}
