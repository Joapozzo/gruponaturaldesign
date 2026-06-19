import Button from '@/components/ui/Button';
import { Trash2, Loader2 } from 'lucide-react';

interface BulkImageActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onClearSelection?: () => void;
  onSelectAll?: () => void;
  isBulkDeleting: boolean;
  totalCount: number;
}

/**
 * Barra de acciones bulk para imágenes de producto
 */
export function BulkImageActions({
  selectedCount,
  onBulkDelete,
  onClearSelection,
  onSelectAll,
  isBulkDeleting,
  totalCount,
}: BulkImageActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-600">
        {selectedCount} imagen{selectedCount !== 1 ? 'es' : ''} seleccionada{selectedCount !== 1 ? 's' : ''}
      </span>
      {onSelectAll && selectedCount < totalCount && (
        <Button variant="ghost" size="sm" onClick={onSelectAll}>
          Seleccionar todas
        </Button>
      )}
      {onClearSelection && (
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Quitar selección
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBulkDelete}
        disabled={isBulkDeleting}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        {isBulkDeleting ? (
          <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4 mr-2 inline" />
        )}
        Eliminar seleccionadas ({selectedCount})
      </Button>
    </div>
  );
}
