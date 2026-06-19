import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { useProductosSync } from './useProductosSync';
import { useStockSync } from './useStockSync';
import { productoService } from '@/app/services/producto.service';
import { productosKeys } from '@/app/utils/productosKeys';

interface UseProductosPageActionsParams {
  empresaId: number;
}

/**
 * Hook para manejar las acciones del header de la página de productos
 */
export function useProductosPageActions({ empresaId }: UseProductosPageActionsParams) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { sync, isSyncing, cooldownRemainingSeconds } = useProductosSync({
    onSuccess: () => {
      router.refresh();
    },
  });

  const { syncStock, isStockSyncing } = useStockSync({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleSync = useCallback(async () => {
    try {
      await sync();
    } catch {
      // Error ya mostrado en toast por useProductosSync
    }
  }, [sync]);

  const handleSyncStock = useCallback(async () => {
    try {
      await syncStock();
    } catch {
      // Error ya mostrado en toast por useStockSync
    }
  }, [syncStock]);

  const isSyncDisabled =
    isSyncing || isStockSyncing || cooldownRemainingSeconds > 0;
  const isStockDisabled = isSyncing || isStockSyncing || cooldownRemainingSeconds > 0;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: productosKeys.all });
      router.refresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, router]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const blob = await productoService.exportToCSV({ empresaId });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `productos-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar:', error);
    } finally {
      setIsExporting(false);
    }
  }, [empresaId]);

  const handleCreate = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-create-producto-modal'));
  }, []);

  return {
    handleSync,
    handleSyncStock,
    handleRefresh,
    handleExport,
    handleCreate,
    isSyncing,
    isStockSyncing,
    isSyncDisabled,
    isStockDisabled,
    cooldownRemainingSeconds,
    isRefreshing,
    isExporting,
  };
}

