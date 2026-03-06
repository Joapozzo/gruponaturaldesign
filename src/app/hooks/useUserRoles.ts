'use client';

import { useAuth } from '@/contexts/AuthContext';

/**
 * Roles del usuario desde la sesión (Firebase + API). sessionState.role: 'ADMIN' | 'USER' etc.
 */
export const useUserRoles = (): string[] => {
  const { sessionState } = useAuth();
  if (!sessionState?.role) return [];
  const role = sessionState.role;
  if (typeof role === 'string') return [role];
  if (Array.isArray(role)) return role;
  return [];
};
