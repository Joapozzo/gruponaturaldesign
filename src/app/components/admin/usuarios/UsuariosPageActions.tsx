'use client';

import { Plus, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUsuarioModal } from './useUsuarioModal';
import { useUsuariosPageActions } from '@/app/hooks/useUsuariosPageActions';

export function UsuariosPageActions() {
  const { openCreate } = useUsuarioModal();
  const { handleRefresh, isRefreshing } = useUsuariosPageActions();

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
        <RefreshCw className={`w-4 h-4 mr-2 inline ${isRefreshing ? 'animate-spin' : ''}`} />
        Refrescar
      </Button>
      <Button onClick={openCreate}>
        <Plus className="w-4 h-4 mr-2" />
        Crear usuario
      </Button>
    </div>
  );
}