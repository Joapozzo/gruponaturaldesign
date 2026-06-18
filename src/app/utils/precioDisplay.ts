import { formatPrice } from '@/app/utils/productHelpers';
import type { InstallmentQuote } from '@/app/types/precio.types';

export function formatCuotasLine(quote: InstallmentQuote): string {
  const monto = formatPrice(quote.montoCuota);
  const n = quote.cuotas;
  if (n === 1) return `hacelo en 1 cuota de ${monto}`;
  return `hacelo en ${n} cuotas de ${monto}`;
}

export function formatCuotasLineShort(quote: InstallmentQuote): string {
  const monto = formatPrice(quote.montoCuota);
  const n = quote.cuotas;
  if (n === 1) return `1 cuota de ${monto}`;
  return `${n} cuotas de ${monto}`;
}

export function formatFinancingLegalFooter(quote: InstallmentQuote): string | null {
  const parts: string[] = [];
  if (quote.estimado || quote.provider === 'static') {
    parts.push('Cuota estimada (sin incluir intereses de tu tarjeta)');
  }
  if (quote.totalFinanciado != null) {
    parts.push(`Total financiado: ${formatPrice(quote.totalFinanciado)}`);
  }
  if (quote.cft) parts.push(`CFT ${quote.cft}`);
  if (quote.tea) parts.push(`TEA ${quote.tea}`);
  return parts.length > 0 ? parts.join(' - ') : null;
}

export function formatCuotasEstimadoHint(quote: InstallmentQuote): string | null {
  if (!quote.estimado && quote.provider !== 'static') return null;
  return 'Cuota estimada';
}

export function buildPromoCuotasLabel(
  cuotasFinanciado: number,
  _sinInteres?: boolean
): string {
  const n = cuotasFinanciado;
  return n === 1 ? 'HASTA 1 CUOTA' : `HASTA ${n} CUOTAS`;
}

export function buildPaymentBenefitsDescription(
  cuotasFinanciado: number,
  descuentoTransferPct: number,
  _sinInteres?: boolean
): string {
  return `Hasta ${cuotasFinanciado} cuotas - ${descuentoTransferPct}% off con transferencia`;
}
