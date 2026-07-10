'use client';

import { useTiendaConfig } from '@/app/hooks/useTiendaConfig';
import { buildMpExpiryMessage } from '@/app/utils/checkoutPaymentCopy';

interface CheckoutExpiryNoticeProps {
  className?: string;
}

export function CheckoutExpiryNotice({ className = '' }: CheckoutExpiryNoticeProps) {
  const tienda = useTiendaConfig();
  const message = buildMpExpiryMessage(tienda.mpExpiresHours);

  return (
    <div
      className={`rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 ${className}`}
    >
      <p className="font-semibold uppercase tracking-wide text-xs mb-1">Plazo de pago</p>
      <p>{message}</p>
    </div>
  );
}
