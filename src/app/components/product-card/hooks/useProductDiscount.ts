/**
 * Hook para calcular descuentos y badges del producto
 * Responsabilidad: cálculos relacionados con precios y descuentos
 */

interface UseProductDiscountProps {
  precioLista: number | null;
  precioTransfer: number | null;
}

interface UseProductDiscountReturn {
  descuento: number | null;
  tieneDescuento: boolean;
}

export function useProductDiscount({
  precioLista,
  precioTransfer,
}: UseProductDiscountProps): UseProductDiscountReturn {
  const tieneDescuento = Boolean(
    precioLista &&
    precioTransfer &&
    precioTransfer < precioLista
  );

  const descuento = tieneDescuento && precioLista && precioTransfer
    ? Math.round(((precioLista - precioTransfer) / precioLista) * 100)
    : null;

  return {
    descuento,
    tieneDescuento,
  };
}

