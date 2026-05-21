'use client';

import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { SidebarProvider, useSidebar } from '@/components/admin/SidebarContext';
import { SyncProvider, useSync } from '@/components/admin/SyncContext';
import { AdminGuard } from '@/app/components/admin/AdminGuard';
import { AdminRealtimeProvider } from '@/app/components/admin/AdminRealtimeProvider';
import { SyncOverlay } from '@/app/components/admin/SyncOverlay';
import { cn } from '@/lib/utils';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const { isSyncing } = useSync();

  return (
    <div className="min-h-screen bg-neutral-50 relative">
      <Sidebar />
      <Header />

      <main
        className={cn(
          "pt-16 transition-all duration-300",
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <div className="p-4 lg:p-8">{children}</div>
      </main>

      <SyncOverlay
        isOpen={isSyncing}
        title="Sincronizando productos..."
        message="Por favor espera mientras se sincronizan los productos desde SFactory."
      />
    </div>
  );
}

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <SyncProvider>
        <SidebarProvider>
          <AdminRealtimeProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
          </AdminRealtimeProvider>
        </SidebarProvider>
      </SyncProvider>
    </AdminGuard>
  );
}
