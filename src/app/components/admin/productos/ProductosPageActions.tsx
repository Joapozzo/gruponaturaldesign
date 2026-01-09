'use client';

import Button from '@/components/ui/Button';
import { useProductosPageActions } from '@/app/hooks/useProductosPageActions';
import { Download, Plus, RefreshCw, RotateCw } from 'lucide-react';

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
    handleRefresh,
    handleExport,
    handleCreate,
    isSyncing,
    isRefreshing,
    isExporting,
  } = useProductosPageActions({ empresaId });

  return (
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
        variant="ghost"
        size="sm"
        onClick={handleExport}
        disabled={isExporting}
      >
        <Download className="w-4 h-4 mr-2 inline" />
        Exportar
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={handleCreate}
      >
        <Plus className="w-4 h-4 mr-2 inline" />
        Crear Producto
      </Button>
    </div>
  );
}

