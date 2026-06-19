import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { clienteService } from '@/app/services/cliente.service';
import { useQueryClient } from '@tanstack/react-query';
import { clientesKeys } from '@/app/utils/clientesKeys';

interface UseClientesSyncParams {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Hook para sincronizar clientes con SFactory
 */
export function useClientesSync({ onSuccess, onError }: UseClientesSyncParams = {}) {
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();

  const sync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await clienteService.sync();

      await queryClient.invalidateQueries({ queryKey: clientesKeys.all });

      const msg = `Clientes: ${result.exitosos} sincronizados · ${result.omitidos} omitidos · ${result.fallidos} fallidos`;
      toast.success(msg, { duration: 6000 });

      onSuccess?.();
      
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al sincronizar clientes';
      onError?.(errorMessage);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [queryClient, onSuccess, onError]);

  return {
    sync,
    isSyncing,
  };
}

