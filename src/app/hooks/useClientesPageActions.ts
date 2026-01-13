import React from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { useClientesSync } from './useClientesSync';
import { clientesKeys } from '@/app/utils/clientesKeys';
import { useSync } from '@/components/admin/SyncContext';
import { useClienteFormModal } from './useClienteFormModal';

interface UseClientesPageActionsParams {}

/**
 * Hook para manejar las acciones del header de la página de clientes
 */
export function useClientesPageActions({}: UseClientesPageActionsParams) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { setIsSyncing: setGlobalSyncing } = useSync();

  const { sync, isSyncing } = useClientesSync({
    onSuccess: () => {
      router.refresh();
    },
  });

  // Hook reutilizable para el modal de creación
  const clienteModal = useClienteFormModal({
    onSuccess: () => {
      // El hook ya maneja el refresh automáticamente
    },
  });

  // Sincronizar el estado local con el contexto global
  useEffect(() => {
    setGlobalSyncing(isSyncing);
  }, [isSyncing, setGlobalSyncing]);

  const handleSync = useCallback(() => {
    sync();
  }, [sync]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: clientesKeys.all });
      router.refresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, router]);

  return {
    handleSync,
    handleRefresh,
    handleCreate: clienteModal.openModal,
    isSyncing,
    isRefreshing,
    isCreateModalOpen: clienteModal.isOpen,
    handleCloseCreateModal: clienteModal.closeModal,
    handleCreateSuccess: clienteModal.handleSuccess,
  };
}

