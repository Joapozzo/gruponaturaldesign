'use client';

import type { ShippingAgencyDto } from '@/app/services/checkoutShipping.service';
import { errorTextClass } from './checkoutShippingSelectionStyles';

interface CheckoutShippingAgencySelectProps {
  providerLabel: string;
  agencies: ShippingAgencyDto[];
  agenciesLoading: boolean;
  value: string;
  onChange: (agencyId: string) => void;
  error?: string;
}

export function CheckoutShippingAgencySelect({
  providerLabel,
  agencies,
  agenciesLoading,
  value,
  onChange,
  error,
}: CheckoutShippingAgencySelectProps) {
  const selectId = `agency-select-${providerLabel.toLowerCase().replace(/\s+/g, '-')}`;
  const placeholder = `Elegí sucursal de ${providerLabel} a retirar…`;

  return (
    <div className="pt-1 space-y-2">
      <label
        htmlFor={selectId}
        className="block text-[10px] sm:text-xs font-bold uppercase text-black"
      >
        Sucursales de {providerLabel}
      </label>
      {agenciesLoading ? (
        <div className="h-10 bg-gray-100 rounded-lg animate-pulse border border-gray-200" />
      ) : (
        <select
          id={selectId}
          aria-label={placeholder}
          className={`w-full text-xs sm:text-sm border-2 rounded-lg px-2 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[var(--red)]/30 ${
            value ? 'border-[var(--red)]' : 'border-gray-300'
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
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
