/**
 * Totales de pedido ecommerce (espejo de `api/src/utils/pedido-totals.util.ts`).
 *
 * `total` en BD es bruto (subtotal + envío). El monto cobrado es `total − descuento`.
 * No sumar `descuento` + `cuponDescuentoTotal` (mismo valor en checkout).
 */

export type PedidoTotalsFields = {
  total: string | number | null | undefined;
  descuento?: string | number | null;
  cuponDescuentoTotal?: string | number | null;
};

function toNum(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function computePedidoDescuentoTotal(pedido: PedidoTotalsFields): number {
  const d = toNum(pedido.descuento);
  if (d > 0) return Number(d.toFixed(2));
  const cupon = toNum(pedido.cuponDescuentoTotal);
  return cupon > 0 ? Number(cupon.toFixed(2)) : 0;
}

export function computePedidoTotalNeto(pedido: PedidoTotalsFields): number {
  const gross = toNum(pedido.total);
  const descuento = computePedidoDescuentoTotal(pedido);
  const net = Number((gross - descuento).toFixed(2));
  return net >= 0 ? net : gross;
}
