'use client';

import type { CustomerData } from '@/app/types/cart';
import type { CheckoutStep2FormErrors } from '@/app/components/checkout/checkoutStep2.validation';
import {
  CheckoutStep2FormField,
  CheckoutStep2TextInput,
  CheckoutStep2Select,
} from '@/app/components/checkout/CheckoutStep2FormField';

type Props = {
  formData: CustomerData;
  errors: CheckoutStep2FormErrors;
  touched: Record<string, boolean>;
  confirmEmail: string;
  onCustomerChange: (field: keyof CustomerData, value: string) => void;
  onConfirmEmailChange: (value: string) => void;
  onBlur: (field: string) => void;
};

export function CheckoutStep2PersonalSection({
  formData,
  errors,
  touched,
  confirmEmail,
  onCustomerChange,
  onConfirmEmailChange,
  onBlur,
}: Props) {
  const maxBirthDate = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3">
      {/* <h3 className="text-xs sm:text-sm font-bold text-black">INFORMACIÓN PERSONAL</h3> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <CheckoutStep2FormField label="Nombre" required error={errors.nombre} touched={touched.nombre}>
          <CheckoutStep2TextInput
            type="text"
            value={formData.nombre}
            onChange={(e) => onCustomerChange('nombre', e.target.value)}
            onBlur={() => onBlur('nombre')}
            error={errors.nombre}
            touched={touched.nombre}
            placeholder="Nombre"
          />
        </CheckoutStep2FormField>

        <CheckoutStep2FormField label="Apellido" required error={errors.apellido} touched={touched.apellido}>
          <CheckoutStep2TextInput
            type="text"
            value={formData.apellido}
            onChange={(e) => onCustomerChange('apellido', e.target.value)}
            onBlur={() => onBlur('apellido')}
            error={errors.apellido}
            touched={touched.apellido}
            placeholder="Apellido"
          />
        </CheckoutStep2FormField>
      </div>

      <CheckoutStep2FormField label="Email" required error={errors.email} touched={touched.email}>
        <CheckoutStep2TextInput
          type="email"
          value={formData.email}
          onChange={(e) => onCustomerChange('email', e.target.value)}
          onBlur={() => onBlur('email')}
          error={errors.email}
          touched={touched.email}
          placeholder="mail@ejemplo.com"
        />
      </CheckoutStep2FormField>

      <CheckoutStep2FormField
        label="Confirmar Email"
        required
        error={errors.confirmEmail}
        touched={touched.confirmEmail}
      >
        <CheckoutStep2TextInput
          type="email"
          value={confirmEmail}
          onChange={(e) => onConfirmEmailChange(e.target.value)}
          onBlur={() => onBlur('confirmEmail')}
          error={errors.confirmEmail}
          touched={touched.confirmEmail}
          placeholder="mail@ejemplo.com"
        />
      </CheckoutStep2FormField>

      <CheckoutStep2FormField label="Teléfono" required error={errors.telefono} touched={touched.telefono}>
        <CheckoutStep2TextInput
          type="tel"
          value={formData.telefono}
          onChange={(e) => onCustomerChange('telefono', e.target.value)}
          onBlur={() => onBlur('telefono')}
          error={errors.telefono}
          touched={touched.telefono}
          placeholder="+54 11 1234-5678"
        />
      </CheckoutStep2FormField>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-3">
          <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">Tipo</label>
          <CheckoutStep2Select
            value={formData.tipo_documento}
            onChange={(e) =>
              onCustomerChange('tipo_documento', e.target.value as 'DNI' | 'CUIT' | 'CUIL')
            }
          >
            <option value="DNI">DNI</option>
            <option value="CUIT">CUIT</option>
            <option value="CUIL">CUIL</option>
          </CheckoutStep2Select>
        </div>

        <div className="col-span-9">
          <CheckoutStep2FormField
            label="Número de Documento"
            error={errors.documento}
            touched={touched.documento}
          >
            <CheckoutStep2TextInput
              type="text"
              value={formData.documento}
              onChange={(e) => onCustomerChange('documento', e.target.value)}
              onBlur={() => onBlur('documento')}
              error={errors.documento}
              touched={touched.documento}
              placeholder="12345678"
            />
          </CheckoutStep2FormField>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <CheckoutStep2FormField label="Empresa (Opcional)">
          <CheckoutStep2TextInput
            type="text"
            value={formData.empresa}
            onChange={(e) => onCustomerChange('empresa', e.target.value)}
            placeholder="Mi Empresa S.A."
          />
        </CheckoutStep2FormField>
        <CheckoutStep2FormField label="CUIT (Opcional)">
          <CheckoutStep2TextInput
            type="text"
            value={formData.cuit}
            onChange={(e) => onCustomerChange('cuit', e.target.value)}
            placeholder="20-12345678-9"
          />
        </CheckoutStep2FormField>
      </div>

      <CheckoutStep2FormField label="Fecha de Nacimiento (Opcional)">
        <CheckoutStep2TextInput
          type="date"
          value={formData.fecha_nacimiento}
          onChange={(e) => onCustomerChange('fecha_nacimiento', e.target.value)}
          max={maxBirthDate}
        />
        {formData.fecha_nacimiento ? (
          <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
            🎉 ¡Te enviaremos promociones especiales por tu cumpleaños!
          </p>
        ) : null}
      </CheckoutStep2FormField>
    </div>
  );
}
