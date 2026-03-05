'use client';

import { useSession } from 'next-auth/react';

/**
 * Roles del usuario desde la sesión Auth.js (session.user.role: 'ADMIN' | 'USER').
 */
export const useUserRoles = (): string[] => {
  const { data: session } = useSession();
  const user = session?.user as { role?: string | string[] } | undefined;
  if (!user) return [];
  const role = user.role;
  if (typeof role === 'string') return [role];
  if (Array.isArray(role)) return role;
  return [];
};
