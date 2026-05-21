import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { syncService } from '@/app/services/sync.service';
import { productosKeys } from '@/app/utils/productosKeys';
import { useSync } from '@/components/admin/SyncContext';

/** Segundos de cooldown en el botón tras un sync exitoso (evitar doble clic / sync seguidos) */
const SYNC_COOLDOWN_SECONDS = 90;

interface UseProductosSyncParams {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

/**
 * Hook para sincronizar productos desde API externa
 * Usa SyncContext para deshabilitar toda la UI durante la sincronización.
 * Tras éxito, aplica cooldown en el botón para limitar llamadas costosas.
 */
export function useProductosSync({ onSuccess, onError }: UseProductosSyncParams = {}) {
  const queryClient = useQueryClient();
  const { setIsSyncing } = useSync();
  const cooldownUntilRef = useRef(0);
  const [cooldownRemainingSeconds, setCooldownRemainingSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((cooldownUntilRef.current - Date.now()) / 1000));
      setCooldownRemainingSeconds(remaining);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      setIsSyncing(true);
      try {
        return await syncService.syncProductos();
      } finally {
        setIsSyncing(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productosKeys.all });
      cooldownUntilRef.current = Date.now() + SYNC_COOLDOWN_SECONDS * 1000;
      setCooldownRemainingSeconds(SYNC_COOLDOWN_SECONDS);

      const anyData = data as Record<string, unknown> | undefined;
      const base =
        typeof anyData?.message === 'string'
          ? anyData.message
          : 'Sincronización de productos completada';
      const stats =
        anyData?.procesados != null
          ? ` · ${String(anyData.exitosos ?? '?')} exitosos / ${String(anyData.procesados)} procesados`
          : '';
      const stockExtra =
        anyData?.stockPrecios != null && typeof anyData.stockPrecios === 'object'
          ? ' · Stock depósito actualizado'
          : '';
      const msg = `${base}${stats}${stockExtra}`;
      toast.success(msg, { duration: 7000 });
      onSuccess?.(msg);
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof Error
          ? error.message
          : error && typeof error === 'object' && 'message' in error
            ? String((error as { message: unknown }).message)
            : 'Error al sincronizar productos';
      toast.error(msg, { duration: 8000 });
      onError?.(msg);
    },
  });

  return {
    sync: mutation.mutateAsync,
    isSyncing: mutation.isPending,
    cooldownRemainingSeconds,
  };
}

