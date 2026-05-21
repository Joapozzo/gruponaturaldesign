'use client';

import { useAdminRealtime } from '@/app/hooks/useAdminRealtime';

export function AdminRealtimeProvider({ children }: { children: React.ReactNode }) {
  useAdminRealtime();
  return <>{children}</>;
}

