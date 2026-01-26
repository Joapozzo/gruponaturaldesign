'use client';

import React, { useState } from 'react';
import FormModal from '@/app/components/modal/FormModal';
import { TextField } from '@/app/components/producto/fields/TextField';
import { SelectField } from '@/app/components/producto/fields/SelectField';
// import { useClienterForm } from '@/app/hooks/useClienteForm';
import { clienteService } from '@/app/services/cliente.service';
import type { ClienteResponse } from '@/app/types/cliente.types';
import { useClienteForm } from '@/app/hooks/useClienteForm';

export interface ClienteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (cliente: ClienteResponse) => void;
  cliente?: ClienteResponse | null;
  /**
   * Si es true, muestra el modal en modo edición
   * Por defecto es false (modo creación)
   */
  editMode?: boolean;
}

// Opciones para categoría fiscal (común en Argentina)
const CATEGORIA_FISCAL_OPTIONS = [
  { value: 'Ri', label: 'Responsable Inscripto (RI)' },
  { value: 'Ex', label: 'Exento' },
  { value: 'No', label: 'No Responsable' },
  { value: 'Cf', label: 'Consumidor Final' },
  { value: 'Mi', label: 'Monotributista' },
];

// Opciones para tipo de cliente
const TIPO_CLIENTE_OPTIONS = [
  { value: 'persona', label: 'Persona' },
  { value: 'empresa', label: 'Empresa' },
];

export const ClienteFormModal: React.FC<ClienteFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  cliente,
  editMode = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditMode = editMode || !!cliente;

  const { formData, handleChange, getFormDataForSubmit, resetForm } = useClienteForm(
    cliente,
    isOpen
  );

  // Limpiar errores cuando cambia un campo
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    handleChange(e);
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  // Validación básica
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.razonSocial.trim()) {
      newErrors.razonSocial = 'La razón social es requerida';
    }

    // Validar email si se proporciona
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'El email no es válido';
      }
    }

    // Validar CUIT si se proporciona (formato argentino básico)
    if (formData.cuit && formData.cuit.trim()) {
      const cuitRegex = /^\d{11}$/;
      const cuitClean = formData.cuit.replace(/-/g, '');
      if (!cuitRegex.test(cuitClean)) {
        newErrors.cuit = 'El CUIT debe tener 11 dígitos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const dataToSubmit = getFormDataForSubmit();
      const result = await clienteService.create(dataToSubmit);

      // Limpiar formulario y cerrar modal
      resetForm();
      setErrors({});
      onClose();

      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error: any) {
      console.error('Error al crear cliente:', error);
      setErrors({
        submit: error.message || 'Error al crear el cliente. Por favor, intenta nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      setErrors({});
      onClose();
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Editar cliente' : 'Nuevo cliente'}
      onSubmit={handleSubmit}
      submitText={isEditMode ? 'Actualizar' : 'Crear'}
      loading={loading}
      disabled={loading}
    >
      <div className="space-y-4">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        {/* Información Básica */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
            Información Básica
          </h3>

          <TextField
            id="codigo"
            name="codigo"
            label="Código"
            value={formData.codigo}
            onChange={handleFieldChange}
            placeholder="Dejar vacío para generar automáticamente"
            error={errors.codigo}
          />

          <TextField
            id="razonSocial"
            name="razonSocial"
            label="Razón Social"
            value={formData.razonSocial}
            onChange={handleFieldChange}
            placeholder="Razón social del cliente"
            error={errors.razonSocial}
            required
          />

          <TextField
            id="nombre"
            name="nombre"
            label="Nombre"
            value={formData.nombre}
            onChange={handleFieldChange}
            placeholder="Nombre del cliente"
            error={errors.nombre}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              id="cuit"
              name="cuit"
              label="CUIT"
              value={formData.cuit}
              onChange={handleFieldChange}
              placeholder="12345678901"
              error={errors.cuit}
            />

            <SelectField
              id="categoriaFiscal"
              name="categoriaFiscal"
              label="Categoría Fiscal"
              value={formData.categoriaFiscal}
              onChange={handleFieldChange}
              options={CATEGORIA_FISCAL_OPTIONS}
              placeholder="Seleccionar categoría fiscal"
              error={errors.categoriaFiscal}
            />
          </div>

          <SelectField
            id="tipo"
            name="tipo"
            label="Tipo de Cliente"
            value={formData.tipo}
            onChange={handleFieldChange}
            options={TIPO_CLIENTE_OPTIONS}
            placeholder="Seleccionar tipo"
            error={errors.tipo}
          />
        </div>

        {/* Información de Contacto */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
            Información de Contacto
          </h3>

          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleFieldChange}
            placeholder="cliente@email.com"
            error={errors.email}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              id="telefono"
              name="telefono"
              label="Teléfono"
              value={formData.telefono}
              onChange={handleFieldChange}
              placeholder="1234567890"
              error={errors.telefono}
            />

            <TextField
              id="movil"
              name="movil"
              label="Móvil"
              value={formData.movil}
              onChange={handleFieldChange}
              placeholder="1234567890"
              error={errors.movil}
            />
          </div>
        </div>

        {/* Domicilio Fiscal */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
            Domicilio Fiscal
          </h3>

          <TextField
            id="domicilioFiscal"
            name="domicilioFiscal"
            label="Domicilio Fiscal"
            value={formData.domicilioFiscal}
            onChange={handleFieldChange}
            placeholder="Calle y número"
            error={errors.domicilioFiscal}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              id="cpFiscal"
              name="cpFiscal"
              label="Código Postal"
              value={formData.cpFiscal}
              onChange={handleFieldChange}
              placeholder="1234"
              error={errors.cpFiscal}
            />

            <TextField
              id="localidadId"
              name="localidadId"
              label="ID Localidad"
              value={formData.localidadId}
              onChange={handleFieldChange}
              placeholder="ID de localidad"
              error={errors.localidadId}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              id="provinciaId"
              name="provinciaId"
              label="ID Provincia"
              value={formData.provinciaId}
              onChange={handleFieldChange}
              placeholder="ID de provincia"
              error={errors.provinciaId}
            />

            <TextField
              id="paisId"
              name="paisId"
              label="ID País"
              value={formData.paisId}
              onChange={handleFieldChange}
              placeholder="ID de país"
              error={errors.paisId}
            />
          </div>
        </div>

        {/* Información Adicional */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
            Información Adicional
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              id="codigoExterno"
              name="codigoExterno"
              label="Código Externo"
              value={formData.codigoExterno}
              onChange={handleFieldChange}
              placeholder="Código externo"
              error={errors.codigoExterno}
            />

            <TextField
              id="ctbId"
              name="ctbId"
              label="ID Contabilidad (CTB)"
              value={formData.ctbId}
              onChange={handleFieldChange}
              placeholder="ID contabilidad"
              error={errors.ctbId}
            />
          </div>

          <TextField
            id="cuentaId"
            name="cuentaId"
            label="ID Cuenta"
            value={formData.cuentaId}
            onChange={handleFieldChange}
            placeholder="ID de cuenta"
            error={errors.cuentaId}
          />
        </div>
      </div>
    </FormModal>
  );
};

