'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { useClientesPageActions } from '@/app/hooks/useClientesPageActions';
import { ClienteFormModal } from './ClienteFormModal';
import { Plus, RefreshCw, RotateCw } from 'lucide-react';

interface ClientesPageActionsProps {}

export function ClientesPageActions({}: ClientesPageActionsProps) {
  const {
    handleSync,
    handleRefresh,
    handleCreate,
    isSyncing,
    isRefreshing,
    isCreateModalOpen,
    handleCloseCreateModal,
    handleCreateSuccess,
  } = useClientesPageActions({});

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSync}
          disabled={isSyncing}
        >
          <RotateCw className={`w-4 h-4 mr-2 inline ${isSyncing ? 'animate-spin' : ''}`} />
          Sincronizar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 inline ${isRefreshing ? 'animate-spin' : ''}`} />
          Refrescar
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleCreate}
        >
          <Plus className="w-4 h-4 mr-2 inline" />
          Nuevo Cliente
        </Button>
      </div>

      <ClienteFormModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}

