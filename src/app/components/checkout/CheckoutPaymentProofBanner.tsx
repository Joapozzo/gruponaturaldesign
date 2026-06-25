'use client';

import { useTiendaConfig } from '@/app/hooks/useTiendaConfig';
import {
  buildEfectivoProofMessage,
  buildPaymentProofMessage,
  type PaymentCopyVariant,
} from '@/app/utils/checkoutPaymentCopy';

interface CheckoutPaymentProofBannerProps {
  formaPago: 'transferencia' | 'efectivo';
  className?: string;
  /** Post-pedido: evita repetir plazo genérico si ya se muestra la fecha límite. */
  variant?: PaymentCopyVariant;
  externalOrderId?: string;
}

export function CheckoutPaymentProofBanner({
  formaPago,
  className = '',
  variant = 'checkout',
  externalOrderId,
}: CheckoutPaymentProofBannerProps) {
  const tienda = useTiendaConfig();
  const copyOpts = { ...tienda, variant, externalOrderId };
  const message =
    formaPago === 'transferencia'
      ? buildPaymentProofMessage(copyOpts)
      : buildEfectivoProofMessage(copyOpts);

  return (
    <div
      className={`rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 ${className}`}
    >
      <p className="font-semibold uppercase tracking-wide text-xs mb-1">Próximo paso</p>
      <p>{message}</p>
    </div>
  );
}
