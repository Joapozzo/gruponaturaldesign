'use client';

import type { ShippingAgencyDto } from '@/app/services/checkoutShipping.service';
import { errorTextClass } from './checkoutShippingSelectionStyles';

interface CheckoutShippingAgencySelectProps {
  agencies: ShippingAgencyDto[];
  agenciesLoading: boolean;
  value: string;
  onChange: (agencyId: string) => void;
  error?: string;
}

export function CheckoutShippingAgencySelect({
  agencies,
  agenciesLoading,
  value,
  onChange,
  error,
}: CheckoutShippingAgencySelectProps) {
  return (
    <div className="pt-1 space-y-2">
      <label className="block text-[10px] sm:text-xs font-bold uppercase text-black">Sucursal</label>
      {agenciesLoading ? (
        <div className="h-10 bg-gray-100 rounded-lg animate-pulse border border-gray-200" />
      ) : (
        <select
          className={`w-full text-xs sm:text-sm border-2 rounded-lg px-2 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[var(--red)]/30 ${
            value ? 'border-[var(--red)]' : 'border-gray-300'
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Elegí sucursal…</option>
          {agencies.map((a) => (
            <option key={a.agencyId} value={a.agencyId}>
              {a.name} — {a.city}
            </option>
          ))}
        </select>
      )}
      {error ? <p className={`text-xs ${errorTextClass}`}>{error}</p> : null}
    </div>
  );
}
