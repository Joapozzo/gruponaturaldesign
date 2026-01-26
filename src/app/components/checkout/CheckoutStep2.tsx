'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '../hooks/useCart';
import Button from '../ui/Button';
import { CustomerData, ShippingData } from '@/app/types/cart';
import { formatPrice } from '@/app/utils/productHelpers';
import { WHATSAPP_PHONE_NUMBER, getWhatsAppNumberForUrl } from '@/app/utils/constants';
import { useSales } from '../../contexts/SalesContext';

interface CheckoutStep2Props {
  onNext: () => void;
  onBack: () => void;
}

interface FormErrors {
  nombre?: string;
  apellido?: string;
  email?: string;
  confirmEmail?: string;
  telefono?: string;
  documento?: string;
  direccion?: string;
  localidad?: string;
  provincia?: string;
  codigo_postal?: string;
}

export default function CheckoutStep2({ onNext, onBack }: CheckoutStep2Props) {
  const router = useRouter();
  const { customerData, shippingData, setCustomerData, setShippingData, itemCount, items, subtotal, iva, total } = useCart();
  const { isWholesaleLimitReached } = useSales();

  // No redirigir automáticamente - mostrar alerta cuando llegue a 20 unidades

  // Customer Data State
  const [formData, setFormData] = useState<CustomerData>({
    nombre: customerData?.nombre || '',
    apellido: customerData?.apellido || '',
    email: customerData?.email || '',
    telefono: customerData?.telefono || '',
    empresa: customerData?.empresa || '',
    cuit: customerData?.cuit || '',
    fecha_nacimiento: customerData?.fecha_nacimiento || '',
    documento: customerData?.documento || '',
    tipo_documento: customerData?.tipo_documento || 'DNI',
  });

  // Estado para el email de confirmación
  const [confirmEmail, setConfirmEmail] = useState<string>(customerData?.email || '');

  // Shipping Data State
  const [shipping, setShipping] = useState<ShippingData>({
    tipo: shippingData?.tipo || 'envio',
    direccion: shippingData?.direccion || '',
    localidad: shippingData?.localidad || '',
    provincia: shippingData?.provincia || '',
    codigo_postal: shippingData?.codigo_postal || '',
    notas: shippingData?.notas || '',
    fecha_entrega: shippingData?.fecha_entrega || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation Functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
  };

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'Requerido';
        if (value.trim().length < 2) return 'Mínimo 2 caracteres';
        break;
      case 'apellido':
        if (!value.trim()) return 'Requerido';
        if (value.trim().length < 2) return 'Mínimo 2 caracteres';
        break;
      case 'email':
        if (!value.trim()) return 'Requerido';
        if (!validateEmail(value)) return 'Email inválido';
        break;
      case 'confirmEmail':
        if (!value.trim()) return 'Requerido';
        if (!validateEmail(value)) return 'Email inválido';
        if (value !== formData.email) return 'Los emails no coinciden';
        break;
      case 'telefono':
        if (!value.trim()) return 'Requerido';
        if (!validatePhone(value)) return 'Teléfono inválido';
        break;
      case 'documento':
        if (value && value.replace(/\D/g, '').length < 7) {
          return 'Mínimo 7 dígitos';
        }
        break;
      case 'direccion':
        if (shipping.tipo === 'envio' && !value.trim()) {
          return 'Requerido para envío';
        }
        break;
      case 'localidad':
        if (shipping.tipo === 'envio' && !value.trim()) {
          return 'Requerido para envío';
        }
        break;
      case 'provincia':
        if (shipping.tipo === 'envio' && !value.trim()) {
          return 'Requerido para envío';
        }
        break;
      case 'codigo_postal':
        if (shipping.tipo === 'envio' && !value.trim()) {
          return 'Requerido para envío';
        }
        break;
    }
    return undefined;
  };

  const handleCustomerChange = (field: keyof CustomerData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
    // Si cambia el email, también validar el confirmEmail
    if (field === 'email' && touched.confirmEmail) {
      const confirmError = validateField('confirmEmail', confirmEmail);
      setErrors({ ...errors, confirmEmail: confirmError });
    }
  };

  const handleConfirmEmailChange = (value: string) => {
    setConfirmEmail(value);
    if (touched.confirmEmail) {
      const error = validateField('confirmEmail', value);
      setErrors({ ...errors, confirmEmail: error });
    }
  };

  const handleShippingChange = (field: keyof ShippingData, value: string) => {
    setShipping({ ...shipping, [field]: value });
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    let value: string;
    if (field === 'confirmEmail') {
      value = confirmEmail;
    } else if (field in formData) {
      value = (formData as any)[field];
    } else {
      value = (shipping as any)[field];
    }
    const error = validateField(field, value);
    setErrors({ ...errors, [field]: error });
  };

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    ['nombre', 'apellido', 'email', 'telefono'].forEach((field) => {
      const error = validateField(field, (formData as any)[field]);
      if (error) {
        newErrors[field as keyof FormErrors] = error;
        isValid = false;
      }
    });

    // Validar confirmEmail
    const confirmEmailError = validateField('confirmEmail', confirmEmail);
    if (confirmEmailError) {
      newErrors.confirmEmail = confirmEmailError;
      isValid = false;
    }

    if (formData.documento) {
      const error = validateField('documento', formData.documento);
      if (error) {
        newErrors.documento = error;
        isValid = false;
      }
    }

    if (shipping.tipo === 'envio') {
      ['direccion', 'localidad', 'provincia', 'codigo_postal'].forEach((field) => {
        const error = validateField(field, (shipping as any)[field]);
        if (error) {
          newErrors[field as keyof FormErrors] = error;
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    // Validar que no sea compra mayorista antes de continuar
    if (isWholesaleLimitReached) {
      // No redirigir automáticamente, solo impedir continuar
      // El usuario debe usar el botón de mayorista si lo desea
      return;
    }

    const allFields = ['nombre', 'apellido', 'email', 'confirmEmail', 'telefono', 'direccion', 'localidad', 'provincia', 'codigo_postal'];
    const newTouched: Record<string, boolean> = {};
    allFields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    if (validateAllFields()) {
      setCustomerData(formData);
      setShippingData(shipping);
      onNext();
    }
  };

  return (
    <>
      {/* Estilos para autocompletado del navegador */}
      <style dangerouslySetInnerHTML={{
        __html: `
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active,
          textarea:-webkit-autofill,
          textarea:-webkit-autofill:hover,
          textarea:-webkit-autofill:focus,
          textarea:-webkit-autofill:active,
          select:-webkit-autofill,
          select:-webkit-autofill:hover,
          select:-webkit-autofill:focus,
          select:-webkit-autofill:active {
            -webkit-text-fill-color: #000000 !important;
            -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
            box-shadow: 0 0 0px 1000px #ffffff inset !important;
            transition: background-color 5000s ease-in-out 0s;
          }
          
          input:autofill,
          textarea:autofill,
          select:autofill {
            color: #000000 !important;
            background-color: #ffffff !important;
          }
        `
      }} />
      
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* LEFT SIDE - Formulario */}
      <div className="flex-1 flex flex-col min-w-0">
        <h2 className="text-xs sm:text-sm font-bold text-black mb-2 sm:mb-3">DATOS DEL CLIENTE</h2>

        {/* Scrollable Form */}
        <div className="max-h-[60vh] lg:max-h-[70vh] overflow-y-auto pr-2 space-y-3 sm:space-y-4">
          {/* Información Personal */}
          <div className="bg-white border-l-2 border-black p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-black">INFORMACIÓN PERSONAL</h3>

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                  Nombre <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleCustomerChange('nombre', e.target.value)}
                  onBlur={() => handleBlur('nombre')}
                  className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600 ${
                    errors.nombre && touched.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{
                    color: '#000000',
                    backgroundColor: '#ffffff',
                  }}
                  placeholder="Juan"
                />
                {errors.nombre && touched.nombre && (
                  <p className="text-red-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                  Apellido <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => handleCustomerChange('apellido', e.target.value)}
                  onBlur={() => handleBlur('apellido')}
                  className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600 ${
                    errors.apellido && touched.apellido ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{
                    color: '#000000',
                    backgroundColor: '#ffffff',
                  }}
                  placeholder="Pérez"
                />
                {errors.apellido && touched.apellido && (
                  <p className="text-red-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{errors.apellido}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleCustomerChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600 ${
                  errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{
                  color: '#000000',
                  backgroundColor: '#ffffff',
                }}
                placeholder="juan@ejemplo.com"
              />
              {errors.email && touched.email && (
                <p className="text-red-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{errors.email}</p>
              )}
            </div>

            {/* Confirmar Email */}
            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                Confirmar Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => handleConfirmEmailChange(e.target.value)}
                onBlur={() => handleBlur('confirmEmail')}
                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600 ${
                  errors.confirmEmail && touched.confirmEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{
                  color: '#000000',
                  backgroundColor: '#ffffff',
                }}
                placeholder="juan@ejemplo.com"
              />
              {errors.confirmEmail && touched.confirmEmail && (
                <p className="text-red-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{errors.confirmEmail}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                Teléfono <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleCustomerChange('telefono', e.target.value)}
                onBlur={() => handleBlur('telefono')}
                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600 ${
                  errors.telefono && touched.telefono ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{
                  color: '#000000',
                  backgroundColor: '#ffffff',
                }}
                placeholder="+54 11 1234-5678"
              />
              {errors.telefono && touched.telefono && (
                <p className="text-red-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{errors.telefono}</p>
              )}
            </div>

            {/* Tipo Doc y Número (en una fila) */}
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-3">
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">Tipo</label>
                <select
                  value={formData.tipo_documento}
                  onChange={(e) =>
                    handleCustomerChange('tipo_documento', e.target.value as 'DNI' | 'CUIT' | 'CUIL')
                  }
                  className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-black bg-white focus:outline-none focus:border-red-600"
                >
                  <option value="DNI">DNI</option>
                  <option value="CUIT">CUIT</option>
                  <option value="CUIL">CUIL</option>
                </select>
              </div>

              <div className="col-span-9">
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                  Número de Documento
                </label>
                <input
                  type="text"
                  value={formData.documento}
                  onChange={(e) => handleCustomerChange('documento', e.target.value)}
                  onBlur={() => handleBlur('documento')}
                  className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600 ${
                    errors.documento && touched.documento ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{
                    color: '#000000',
                    backgroundColor: '#ffffff',
                  }}
                  placeholder="12345678"
                />
                {errors.documento && touched.documento && (
                  <p className="text-red-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{errors.documento}</p>
                )}
              </div>
            </div>

            {/* Empresa y CUIT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">Empresa (Opcional)</label>
                <input
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => handleCustomerChange('empresa', e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600"
                  style={{
                    color: '#000000',
                    backgroundColor: '#ffffff',
                  }}
                  placeholder="Mi Empresa S.A."
                />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">CUIT (Opcional)</label>
                <input
                  type="text"
                  value={formData.cuit}
                  onChange={(e) => handleCustomerChange('cuit', e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600"
                  style={{
                    color: '#000000',
                    backgroundColor: '#ffffff',
                  }}
                  placeholder="20-12345678-9"
                />
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                Fecha de Nacimiento (Opcional)
              </label>
              <input
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => handleCustomerChange('fecha_nacimiento', e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-black bg-white focus:outline-none focus:border-red-600"
                style={{
                  color: '#000000',
                  backgroundColor: '#ffffff',
                }}
                max={new Date().toISOString().split('T')[0]}
              />
              {formData.fecha_nacimiento && (
                <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                  🎉 ¡Te enviaremos promociones especiales por tu cumpleaños!
                </p>
              )}
            </div>
          </div>

          {/* Datos de Envío */}
          <div className="bg-white border-l-2 border-black p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-black">DATOS DE ENVÍO</h3>

            {/* Tipo de Entrega */}
            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1.5 sm:mb-2">
                Tipo de Entrega <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-3 sm:gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="shipping_type"
                    value="envio"
                    checked={shipping.tipo === 'envio'}
                    onChange={(e) => handleShippingChange('tipo', e.target.value as 'envio' | 'retiro')}
                    className="mr-1.5 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4"
                  />
                  <span className="text-xs sm:text-sm text-black">Envío a domicilio</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="shipping_type"
                    value="retiro"
                    checked={shipping.tipo === 'retiro'}
                    onChange={(e) => handleShippingChange('tipo', e.target.value as 'envio' | 'retiro')}
                    className="mr-1.5 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4"
                  />
                  <span className="text-xs sm:text-sm text-black">Retiro en tienda</span>
                </label>
              </div>
            </div>

            {/* Campos de envío (solo si tipo === 'envio') */}
            {shipping.tipo === 'envio' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {/* Dirección */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                    Dirección <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={shipping.direccion}
                    onChange={(e) => handleShippingChange('direccion', e.target.value)}
                    onBlur={() => handleBlur('direccion')}
                    className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600 ${
                      errors.direccion && touched.direccion ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{
                      color: '#000000',
                      backgroundColor: '#ffffff',
                    }}
                    placeholder="Av. Corrientes 1234"
                  />
                  {errors.direccion && touched.direccion && (
                    <p className="text-red-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{errors.direccion}</p>
                  )}
                </div>

                {/* Localidad y Provincia */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                      Localidad <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={shipping.localidad}
                      onChange={(e) => handleShippingChange('localidad', e.target.value)}
                      onBlur={() => handleBlur('localidad')}
                      className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600 ${
                        errors.localidad && touched.localidad ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={{
                        color: '#000000',
                        backgroundColor: '#ffffff',
                      }}
                      placeholder="Buenos Aires"
                    />
                    {errors.localidad && touched.localidad && (
                      <p className="text-red-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{errors.localidad}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                      Provincia <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={shipping.provincia}
                      onChange={(e) => handleShippingChange('provincia', e.target.value)}
                      onBlur={() => handleBlur('provincia')}
                      className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600 ${
                        errors.provincia && touched.provincia ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={{
                        color: '#000000',
                        backgroundColor: '#ffffff',
                      }}
                      placeholder="Buenos Aires"
                    />
                    {errors.provincia && touched.provincia && (
                      <p className="text-red-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{errors.provincia}</p>
                    )}
                  </div>
                </div>

                {/* Código Postal */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                    Código Postal <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={shipping.codigo_postal}
                    onChange={(e) => handleShippingChange('codigo_postal', e.target.value)}
                    onBlur={() => handleBlur('codigo_postal')}
                    className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600 ${
                      errors.codigo_postal && touched.codigo_postal ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{
                      color: '#000000',
                      backgroundColor: '#ffffff',
                    }}
                    placeholder="1000"
                  />
                  {errors.codigo_postal && touched.codigo_postal && (
                    <p className="text-red-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{errors.codigo_postal}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Notas */}
            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
                Notas adicionales
              </label>
              <textarea
                value={shipping.notas}
                onChange={(e) => handleShippingChange('notas', e.target.value)}
                rows={2}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600 resize-none"
                style={{
                  color: '#000000',
                  backgroundColor: '#ffffff',
                }}
                placeholder="Ej: Timbre roto, llamar al llegar..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Resumen del Carrito Fijo */}
      <div className="w-full lg:w-80 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <h2 className="text-xs sm:text-sm font-bold text-black">RESUMEN DEL PEDIDO</h2>

        {/* Resumen del Carrito */}
        <div className="bg-white border-l-2 border-black p-3 sm:p-4 rounded-lg space-y-3">
          {/* Lista de productos */}
          <div className="space-y-1.5 sm:space-y-2 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                <span className="text-gray-500">{item.quantity}x</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-black line-clamp-1">{item.product.nombre}</p>
                  {item.especificaciones && (
                    <p className="text-gray-500 text-[9px] sm:text-[10px] line-clamp-1">{item.especificaciones}</p>
                  )}
                  {item.bordado && (
                    <p className="text-[9px] sm:text-[10px] text-red-600 font-semibold mt-0.5">✨ Bordado: SÍ</p>
                  )}
                </div>
                <span className="font-semibold text-black">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>
          
          {/* Totales */}
          <div className="pt-3 border-t border-gray-200 space-y-1.5">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
              <span>Total de productos</span>
              <span className="font-semibold">{itemCount}</span>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
              <span>Subtotal sin impuestos nacionales</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-bold text-black pt-1.5 border-t border-gray-300">
              <span>TOTAL</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-black text-white rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
          <h3 className="text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">MEDIOS DE ENVÍO</h3>
          <div className="text-[10px] sm:text-xs space-y-1.5 sm:space-y-2 text-gray-300">
            <div>
              <p className="font-semibold text-white mb-1">📍 Dentro de Ciudad de Cba:</p>
              <p className="ml-2">Servicio de cadetería a coordinar con el vendedor</p>
              <p className="ml-2 text-gray-400">El costo corre por cuenta del cliente</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">🚚 Interior de Cba. y Resto del país:</p>
              <p className="ml-2">A través de Correo Andreani</p>
              <p className="ml-2 text-gray-400">El costo corre por cuenta del cliente</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">🏬 PICK UP:</p>
              <p className="ml-2">Coordina tu retiro por nuestro punto en Alta Cba.</p>
              <p className="ml-2">Comunícate a través de WhatsApp al <a href={`https://wa.me/${getWhatsAppNumberForUrl()}`} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline">{WHATSAPP_PHONE_NUMBER}</a> indicando tu nombre y número de pedido.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:gap-2.5 mt-auto">
          <Button variant="black" size="sm" fullWidth onClick={handleSubmit} className="text-xs sm:text-sm py-1.5 sm:py-2">
            CONTINUAR
          </Button>
          <Button variant="blackOutline" size="sm" fullWidth onClick={onBack} className="text-xs sm:text-sm py-1.5 sm:py-2">
            VOLVER
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}
