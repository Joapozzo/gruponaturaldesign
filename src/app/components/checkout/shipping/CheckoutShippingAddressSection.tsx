'use client';

import { useMemo } from 'react';
import { CheckoutCombobox } from '@/app/components/checkout/CheckoutCombobox';
import {
  CheckoutStep2FormField,
  CheckoutStep2TextInput,
} from '@/app/components/checkout/CheckoutStep2FormField';
import type { CheckoutStep2FormErrors } from '@/app/components/checkout/checkoutStep2.validation';
import { useGeoref } from '@/app/hooks/useGeoref';
import type { ShippingData } from '@/app/types/cart';

interface CheckoutShippingAddressSectionProps {
  shipping: ShippingData;
  errors: CheckoutStep2FormErrors;
  touched: Record<string, boolean>;
  onShippingChange: (field: keyof ShippingData, value: string) => void;
  patchShipping: (patch: Partial<ShippingData>) => void;
  onBlur: (field: string) => void;
  onCodigoPostalBlur?: () => void;
}

export function CheckoutShippingAddressSection({
  shipping,
  errors,
  touched,
  onShippingChange,
  patchShipping,
  onBlur,
  onCodigoPostalBlur,
}: CheckoutShippingAddressSectionProps) {
  const { provincias, localidades, loadingProvincias, loadingLocalidades } = useGeoref(
    shipping.provincia
  );

  const hasProvinciaSeleccionada = useMemo(() => {
    const name = (shipping.provincia ?? '').trim();
    if (!name) return false;
    return provincias.some((p) => p.nombre === name);
  }, [shipping.provincia, provincias]);

  const handleProvinciaChange = (nombre: string) => {
    patchShipping({
      provincia: nombre,
      localidad: '',
      checkoutEnvio: undefined,
    });
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 rounded-lg space-y-3">
      <h3 className="text-xs sm:text-sm font-bold text-black uppercase">Dirección de envío</h3>

      <CheckoutStep2FormField label="Dirección" required error={errors.direccion} touched={touched.direccion}>
        <CheckoutStep2TextInput
          type="text"
          value={shipping.direccion ?? ''}
          onChange={(e) => onShippingChange('direccion', e.target.value)}
          onBlur={() => onBlur('direccion')}
          error={errors.direccion}
          touched={touched.direccion}
          placeholder="Av. Corrientes 1234"
        />
      </CheckoutStep2FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <CheckoutStep2FormField
          label="Provincia"
          required
          error={errors.provincia}
          touched={touched.provincia}
        >
          <CheckoutCombobox
            options={provincias}
            value={shipping.provincia ?? ''}
            onChange={handleProvinciaChange}
            onBlur={() => onBlur('provincia')}
            error={errors.provincia}
            touched={touched.provincia}
            placeholder="Elegí una provincia"
            loading={loadingProvincias}
          />
        </CheckoutStep2FormField>

        <CheckoutStep2FormField
          label="Localidad"
          required
          error={errors.localidad}
          touched={touched.localidad}
        >
          <CheckoutCombobox
            options={localidades}
            value={shipping.localidad ?? ''}
            onChange={(v) => onShippingChange('localidad', v)}
            onBlur={() => onBlur('localidad')}
            error={errors.localidad}
            touched={touched.localidad}
            disabled={!hasProvinciaSeleccionada}
            placeholder={
              hasProvinciaSeleccionada ? 'Elegí una localidad' : 'Seleccioná primero una provincia'
            }
            loading={loadingLocalidades}
          />
        </CheckoutStep2FormField>
      </div>

      <CheckoutStep2FormField
        label="Código Postal"
        required
        error={errors.codigo_postal}
        touched={touched.codigo_postal}
      >
        <CheckoutStep2TextInput
          type="text"
          value={shipping.codigo_postal ?? ''}
          onChange={(e) => onShippingChange('codigo_postal', e.target.value)}
          onBlur={() => {
            onBlur('codigo_postal');
            onCodigoPostalBlur?.();
          }}
          error={errors.codigo_postal}
          touched={touched.codigo_postal}
          placeholder="Ej: 5000"
        />
      </CheckoutStep2FormField>
    </div>
  );
}
