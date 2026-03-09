import { useState, useCallback, useMemo } from 'react';

/**
 * Hook reutilizable para manejar selección bulk en tablas
 */
export function useBulkSelection<T extends { id: number }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === items.length && items.length > 0) {
      setSelectedIds(new Set());
    } else {
      const allIds = new Set(items.map((item) => item.id));
      setSelectedIds(allIds);
    }
  }, [selectedIds.size, items]);

  /** Selecciona todas las filas (sin alternar). */
  const selectAll = useCallback(() => {
    if (items.length === 0) return;
    setSelectedIds(new Set(items.map((item) => item.id)));
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectedCount = useMemo(() => selectedIds.size, [selectedIds.size]);

  return {
    selectedIds,
    selectedCount,
    toggleSelect,
    toggleSelectAll,
    selectAll,
    clearSelection,
  };
}

