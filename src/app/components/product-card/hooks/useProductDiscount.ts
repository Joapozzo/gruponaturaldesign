/**
 * Hook para calcular descuentos y badges del producto
 * Responsabilidad: cálculos relacionados con precios y descuentos
 */

interface UseProductDiscountProps {
  precioLista: number | null;
  precioTransfer: number | null;
  precio3Cuotas: number | null;
}

interface UseProductDiscountReturn {
  descuento: number | null;
  tieneDescuento: boolean;
  precio3Cuotas: number | null;
}

export function useProductDiscount({
  precioLista,
  precioTransfer,
  precio3Cuotas,
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
    precio3Cuotas: precio3Cuotas || null,
  };
}

