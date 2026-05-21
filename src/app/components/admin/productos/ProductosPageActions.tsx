'use client';

import Button from '@/components/ui/Button';
import { useProductosPageActions } from '@/app/hooks/useProductosPageActions';
import { Package, Plus, RefreshCw, RotateCw } from 'lucide-react';

interface ProductosPageActionsProps {
  empresaId: number;
}

/**
 * Componente de acciones del header de la página de productos
 * Delega la lógica al hook useProductosPageActions
 */
export function ProductosPageActions({ empresaId }: ProductosPageActionsProps) {
  const {
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
  } = useProductosPageActions({ empresaId });

  const syncButtonLabel =
    isSyncing
      ? 'Sincronizando…'
      : cooldownRemainingSeconds > 0
        ? `Disponible en ${cooldownRemainingSeconds}s`
        : 'Sincronizar';

  const stockButtonLabel = isStockSyncing ? 'Stock…' : 'Sync stock';

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSync}
        disabled={isSyncDisabled}
      >
        <RotateCw className={`w-4 h-4 mr-2 inline ${isSyncing ? 'animate-spin' : ''}`} />
        {syncButtonLabel}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSyncStock}
        disabled={isStockDisabled}
        title="Actualiza stock (y precio si aplica) desde el depósito ecommerce en S-Factory"
      >
        <Package className={`w-4 h-4 mr-2 inline ${isStockSyncing ? 'animate-pulse' : ''}`} />
        {stockButtonLabel}
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
      {/* <Button
        variant="ghost"
        size="sm"
        onClick={handleExport}
        disabled={isExporting}
      >
        <Download className="w-4 h-4 mr-2 inline" />
        Exportar
      </Button> */}
      <Button
        variant="primary"
        size="sm"
        onClick={handleCreate}
      >
        <Plus className="w-4 h-4 mr-2 inline" />
        Crear producto
      </Button>
    </div>
  );
}

