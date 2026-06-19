'use client';

import { useAuth } from '@/contexts/AuthContext';

export const useUserSession = () => {
  const { firebaseUser, sessionState, isLoading } = useAuth();
  const user = firebaseUser && sessionState
    ? {
        email: sessionState.email ?? null,
        name: [sessionState.nombre, sessionState.apellido].filter(Boolean).join(' ') || sessionState.email || null,
        userId: sessionState.usuarioId,
        uid: sessionState.uid,
      }
    : null;

  return {
    user,
    isLoading,
    isAuthenticated: !!firebaseUser?.email,
    sessionState,
  };
};
