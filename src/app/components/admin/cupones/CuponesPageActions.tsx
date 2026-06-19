'use client';

import Button from '@/components/ui/Button';
import { Plus, Info, RefreshCw } from 'lucide-react';

interface CuponesPageActionsProps {
  handleRefresh: () => void;
  isRefreshing: boolean;
  onHelpClick: () => void;
  onCreateClick: () => void;
}

export function CuponesPageActions({ handleRefresh, isRefreshing, onHelpClick, onCreateClick }: CuponesPageActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
        <RefreshCw className={`w-4 h-4 mr-2 inline ${isRefreshing ? 'animate-spin' : ''}`} />
        Refrescar
      </Button>
      <Button variant="ghost" size="sm" onClick={onHelpClick}>
        <Info className="w-4 h-4 mr-1" /> Ayuda
      </Button>
      <Button leftIcon={<Plus className="w-4 h-4" />} onClick={onCreateClick}>
        Nuevo Cupón
      </Button>
    </div>
  );
}