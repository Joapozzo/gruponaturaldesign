import Button from '@/components/ui/Button';
import { Eye, EyeOff, Star, StarOff, Loader2 } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onBulkPublicar: () => void;
  onBulkDespublicar: () => void;
  onBulkDestacar: () => void;
  onBulkQuitarDestacado: () => void;
  isBulkPublicando: boolean;
  isBulkDespublicando: boolean;
  isBulkDestacando: boolean;
  isBulkQuitandoDestacado: boolean;
}

/**
 * Componente de acciones bulk para productos
 */
export function BulkActions({
  selectedCount,
  onBulkPublicar,
  onBulkDespublicar,
  onBulkDestacar,
  onBulkQuitarDestacado,
  isBulkPublicando,
  isBulkDespublicando,
  isBulkDestacando,
  isBulkQuitandoDestacado,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBulkPublicar}
        disabled={isBulkPublicando}
      >
        {isBulkPublicando ? (
          <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
        ) : (
          <Eye className="w-4 h-4 mr-2 inline" />
        )}
        Publicar ({selectedCount})
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onBulkDespublicar}
        disabled={isBulkDespublicando}
      >
        {isBulkDespublicando ? (
          <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
        ) : (
          <EyeOff className="w-4 h-4 mr-2 inline" />
        )}
        Despublicar ({selectedCount})
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onBulkDestacar}
        disabled={isBulkDestacando}
      >
        {isBulkDestacando ? (
          <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
        ) : (
          <Star className="w-4 h-4 mr-2 inline" />
        )}
        Destacar ({selectedCount})
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onBulkQuitarDestacado}
        disabled={isBulkQuitandoDestacado}
      >
        {isBulkQuitandoDestacado ? (
          <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
        ) : (
          <StarOff className="w-4 h-4 mr-2 inline" />
        )}
        Quitar Destacado ({selectedCount})
      </Button>
    </div>
  );
}

