'use client';

import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { SidebarProvider, useSidebar } from '@/components/admin/SidebarContext';
import { SyncProvider, useSync } from '@/components/admin/SyncContext';
import { AdminGuard } from '@/app/components/admin/AdminGuard';
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

      {/* Overlay para deshabilitar UI durante sincronización */}
      {isSyncing && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-4 border border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
            <p className="text-base font-semibold text-gray-900">Sincronizando productos...</p>
            <p className="text-sm text-gray-600 text-center max-w-sm">
              Por favor espera mientras se sincronizan los productos desde SFactory.
              {/* <br />
              La interfaz estará deshabilitada durante este proceso. */}
            </p>
          </div>
        </div>
      )}
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
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </SidebarProvider>
      </SyncProvider>
    </AdminGuard>
  );
}
