'use client';

import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { SidebarProvider, useSidebar } from '@/components/admin/SidebarContext';
import { SyncProvider } from '@/components/admin/SyncContext';
import { cn } from '@/lib/utils';

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <Header />
      {/* Main Content */}
      <main 
        className={cn(
          "pt-16 transition-all duration-300",
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SyncProvider>
      <SidebarProvider>
        <AdminLayoutContent>
          {children}
        </AdminLayoutContent>
      </SidebarProvider>
    </SyncProvider>
  );
}
