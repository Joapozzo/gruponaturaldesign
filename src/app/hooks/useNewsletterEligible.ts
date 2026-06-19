'use client';

import { usePathname } from 'next/navigation';
import { isNewsletterAllowedPath } from '@/app/config/newsletterPaths';
import { useUserRoles } from '@/app/hooks/useUserRoles';

/** Newsletter solo en páginas de tienda y sin rol ADMIN. */
export function useNewsletterEligible(): boolean {
  const pathname = usePathname();
  const roles = useUserRoles();
  if (!isNewsletterAllowedPath(pathname)) return false;
  if (roles.includes('ADMIN')) return false;
  return true;
}
