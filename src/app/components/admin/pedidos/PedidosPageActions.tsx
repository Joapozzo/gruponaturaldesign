'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, RefreshCw, Server, Warehouse, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import BaseModal from '@/app/components/modal/BaseModal';
import { CrearPedidoForm } from '@/app/components/admin/pedidos/CrearPedidoForm';
import { PedidosEstadosHelpModal } from '@/app/components/admin/pedidos/PedidosEstadosHelpModal';
import { pedidoService } from '@/app/services/pedido.service';
import { pedidosKeys } from '@/app/utils/pedidosKeys';

export function PedidosPageActions() {
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);
  const [syncingStock, setSyncingStock] = useState(false);
  const [showCrear, setShowCrear] = useState(false);
  const [showEstadosHelp, setShowEstadosHelp] = useState(false);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: pedidosKeys.all });
    await queryClient.invalidateQueries({ queryKey: ['pedidos-sfactory'] });
  };

  const syncActivos = async () => {
    setSyncing(true);
    try {
      await pedidoService.syncActivos();
      toast.success('Pedidos sincronizados desde SFactory');
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al sincronizar pedidos');
    } finally {
      setSyncing(false);
    }
  };

  const syncStock = async () => {
    setSyncingStock(true);
    try {
      await pedidoService.syncStock();
      toast.success('Stock actualizado desde SFactory');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al sincronizar stock');
    } finally {
      setSyncingStock(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={refresh}>
          <RefreshCw className="w-4 h-4 mr-2 inline" />
          Refrescar
        </Button>
        <Button variant="ghost" size="sm" onClick={syncActivos} disabled={syncing || syncingStock}>
          <Server className={`w-4 h-4 mr-2 inline ${syncing ? 'animate-pulse' : ''}`} />
          Sync pedidos
        </Button>
        <Button variant="ghost" size="sm" onClick={syncStock} disabled={syncing || syncingStock}>
          <Warehouse className={`w-4 h-4 mr-2 inline ${syncingStock ? 'animate-pulse' : ''}`} />
          Sync stock
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowEstadosHelp(true)}>
          <Info className="w-4 h-4 mr-2 inline" />
          Estados
        </Button>
        <Button variant="primary" size="sm" onClick={() => setShowCrear(true)}>
          <Plus className="w-4 h-4 mr-2 inline" />
          Nuevo Pedido
        </Button>
      </div>

      <BaseModal
        isOpen={showCrear}
        onClose={() => setShowCrear(false)}
        title="Crear Pedido en SFactory"
        size="xl"
      >
        <CrearPedidoForm
          onClose={() => setShowCrear(false)}
          onSuccess={async () => {
            await refresh();
            setShowCrear(false);
          }}
        />
      </BaseModal>

      <PedidosEstadosHelpModal isOpen={showEstadosHelp} onClose={() => setShowEstadosHelp(false)} />
    </>
  );
}
