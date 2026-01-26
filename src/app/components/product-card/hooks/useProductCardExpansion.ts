/**
 * Hook para manejo de expansión/colapso del producto
 * Responsabilidad única: gestión del estado de expansión
 */

interface UseProductCardExpansionProps {
  codigoAgrupacion: string;
  expandedSku: string | null;
  onExpandChange?: (sku: string | null) => void;
  canExpand: boolean;
  compact?: boolean;
}

interface UseProductCardExpansionReturn {
  isExpanded: boolean;
  handleToggleExpand: () => void;
}

export function useProductCardExpansion({
  codigoAgrupacion,
  expandedSku,
  onExpandChange,
  canExpand,
  compact = false,
}: UseProductCardExpansionProps): UseProductCardExpansionReturn {
  const isExpanded = expandedSku === codigoAgrupacion;

  const handleToggleExpand = () => {
    if (!canExpand || compact) return;
    const newSku = isExpanded ? null : codigoAgrupacion;
    onExpandChange?.(newSku);
  };

  return {
    isExpanded,
    handleToggleExpand,
  };
}

