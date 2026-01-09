'use client';

import React from 'react';
import { useSync } from '@/components/admin/SyncContext';

interface ClientesPageWrapperProps {
  children: React.ReactNode;
}

export function ClientesPageWrapper({ children }: ClientesPageWrapperProps) {
  const { isSyncing } = useSync();

  return (
    <div className="relative">
      {isSyncing && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="text-sm font-medium text-gray-700">Sincronizando clientes...</p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

