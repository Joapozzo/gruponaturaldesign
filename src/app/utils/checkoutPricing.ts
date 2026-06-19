import type { CartItem, CartProduct, MpCheckoutModo } from '@/app/types/cart';

/** Precio de productos en checkout: lista (MP financiado) o transfer (efectivo/transferencia / MP transfer). */
export type CheckoutPriceMode = 'lista' | 'transfer';

export function resolveCheckoutPriceMode(
  metodo: string,
  mpModo?: MpCheckoutModo
): CheckoutPriceMode {
  if (metodo === 'mercado_pago') {
    return mpModo === 'transfer' ? 'transfer' : 'lista';
  }
  return 'transfer';
}

/** @deprecated Usar resolveCheckoutPriceMode(metodo, mpModo). */
export function paymentMethodToPriceMode(metodo: string): CheckoutPriceMode {
  return metodo === 'mercado_pago' ? 'lista' : 'transfer';
}

export function resolveCheckoutUnitPrice(
  product: Pick<CartProduct, 'precioLista' | 'precio' | 'precioTransfer'>,
  mode: CheckoutPriceMode
): number {
  const lista = product.precioLista ?? product.precio ?? 0;
  if (mode === 'transfer') {
    const transfer = product.precioTransfer;
    if (transfer != null && transfer > 0) return transfer;
    return lista;
  }
  return lista;
}

export function resolveCartLineSubtotal(item: CartItem, mode: CheckoutPriceMode): number {
  if (mode === 'transfer' && item.subtotalTransfer != null && item.subtotalTransfer >= 0) {
    return item.subtotalTransfer;
  }
  if (mode === 'lista') {
    return item.subtotal;
  }
  return item.quantity * resolveCheckoutUnitPrice(item.product, mode);
}

export function resolveCartProductsTotal(items: CartItem[], mode: CheckoutPriceMode): number {
  return items.reduce((acc, line) => acc + resolveCartLineSubtotal(line, mode), 0);
}
