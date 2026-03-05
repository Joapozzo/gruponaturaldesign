'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProfilePageLayout } from '@/app/components/profile/ProfilePageLayout';
import { ProfileUserCard } from '@/app/components/profile/ProfileUserCard';
import { ProfileOrdersSection } from '@/app/components/profile/ProfileOrdersSection';
import { MOCK_ORDERS } from '@/app/data/mockOrders';
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
      return;
    }
  }, [isLoading, sessionState, router]);

  if (isLoading) {
    return (
      <ProfilePageLayout title="Mi perfil">
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-gray-200 rounded-lg" />
          <div className="h-32 bg-gray-200 rounded-lg" />
        </div>
      </ProfilePageLayout>
    );
  }

  if (!sessionState) {
    return null;
  }

  const profileUser = sessionToProfileUser(sessionState);

  return (
    <ProfilePageLayout
      title="Mi perfil"
      subtitle="Datos de tu cuenta y historial de pedidos"
    >
      <div className="space-y-8">
        <ProfileUserCard user={profileUser} showRole={false} />
        {/* <ProfileOrdersSection
          orders={MOCK_ORDERS}
          title="Mis pedidos"
          emptyMessage="Aún no tenés pedidos."
        /> */}
      </div>
    </ProfilePageLayout>
  );
}
