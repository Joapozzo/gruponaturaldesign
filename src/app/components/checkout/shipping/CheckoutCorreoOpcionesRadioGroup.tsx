'use client';

import type { CheckoutCorreoOpcionQuote } from '@/app/services/checkoutShipping.service';
import {
  defaultCorreoServiceCode,
  type ShippingQuoteOptionId,
} from '@/app/components/checkout/shipping/shippingQuote.utils';
import { formatPrice } from '@/app/utils/productHelpers';

interface CheckoutCorreoOpcionesRadioGroupProps {
  optionId: ShippingQuoteOptionId;
  correoOpts: CheckoutCorreoOpcionQuote[];
  correoRatePick: string | undefined;
  onCorreoRateSelect: (optionId: ShippingQuoteOptionId, serviceCode: string) => void;
}

export function CheckoutCorreoOpcionesRadioGroup({
  optionId,
  correoOpts,
  correoRatePick,
  onCorreoRateSelect,
}: CheckoutCorreoOpcionesRadioGroupProps) {
  if (correoOpts.length < 2) return null;

  return (
    <div
      role="group"
      aria-label="Tarifas Correo Argentino"
      className="mt-2 space-y-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      {correoOpts.map((c, idx) => {
        const code = c.serviceCode ?? `__${idx}`;
        const active = correoRatePick ?? defaultCorreoServiceCode(correoOpts);
        const checked = c.serviceCode
          ? active?.toUpperCase() === c.serviceCode.toUpperCase()
          : active === code;
        const label = c.serviceName || c.serviceCode || `Opción ${idx + 1}`;
        return (
          <label
            key={`${optionId}-${code}`}
            className="flex items-center gap-2 cursor-pointer text-[10px] sm:text-xs text-gray-800"
          >
            <input
              type="radio"
              name={`correo-rate-${optionId}`}
              className="accent-[var(--red)] shrink-0"
              checked={checked}
              onChange={(e) => {
                e.stopPropagation();
                onCorreoRateSelect(optionId, c.serviceCode ?? String(idx));
              }}
            />
            <span className="leading-tight">
              {label}{' '}
              <span className="font-semibold text-black tabular-nums">{formatPrice(c.price)}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
