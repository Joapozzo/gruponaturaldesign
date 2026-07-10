import type { CheckoutPriceMode } from '@/app/utils/checkoutPricing';

/**
 * Valor declarado para cotización de envío: mismo criterio que el servidor al confirmar
 * (`sum(precioUnitario)` según modo lista o transfer, precios finales con IVA).
 */
export function resolveShippingDeclaredValueSubtotal(
  priceMode: CheckoutPriceMode,
  totalLista: number,
  totalTransfer: number
): number {
  if (priceMode === 'transfer') {
    return totalTransfer > 0 ? totalTransfer : totalLista;
  }
  return totalLista;
}
