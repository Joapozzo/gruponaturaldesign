import { useState, useEffect } from 'react';
import type { ClienteResponse, ClienteCreateParams } from '@/app/types/cliente.types';

export interface ClienteFormData {
  codigo: string;
  nombre: string;
  razonSocial: string;
  cuit: string;
  categoriaFiscal: string;
  telefono: string;
  movil: string;
  codigoExterno: string;
  ctbId: string;
  cuentaId: string;
  email: string;
  domicilioFiscal: string;
  localidadId: string;
  cpFiscal: string;
  provinciaId: string;
  paisId: string;
  tipo: string;
}

const initialFormData: ClienteFormData = {
  codigo: '',
  nombre: '',
  razonSocial: '',
  cuit: '',
  categoriaFiscal: '',
  telefono: '',
  movil: '',
  codigoExterno: '',
  ctbId: '',
  cuentaId: '',
  email: '',
  domicilioFiscal: '',
  localidadId: '',
  cpFiscal: '',
  provinciaId: '',
  paisId: '',
  tipo: '',
};

export const useClienteForm = (
  cliente: ClienteResponse | null | undefined,
  isOpen: boolean
) => {
  const [formData, setFormData] = useState<ClienteFormData>(initialFormData);

  // Resetear formulario cuando se abre/cierra o cambia el cliente
  useEffect(() => {
    if (cliente) {
      setFormData({
        codigo: cliente.sfactoryCodigo || '',
        nombre: cliente.nombre || '',
        razonSocial: cliente.razonSocial || '',
        cuit: cliente.cuit || '',
        categoriaFiscal: cliente.categoriaFiscal || '',
        telefono: cliente.telefono || '',
        movil: cliente.movil || '',
        codigoExterno: cliente.codigoExterno || '',
        ctbId: '',
        cuentaId: '',
        email: cliente.email || '',
        domicilioFiscal: cliente.domicilioFiscal || '',
        localidadId: cliente.localidadId?.toString() || '',
        cpFiscal: cliente.cpFiscal || '',
        provinciaId: cliente.provinciaId?.toString() || '',
        paisId: cliente.paisId?.toString() || '',
        tipo: cliente.tipo || '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [cliente, isOpen]);

  const updateField = <K extends keyof ClienteFormData>(
    name: K,
    value: ClienteFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateField(name as keyof ClienteFormData, value);
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  // Convierte formData a ClienteCreateParams para enviar al backend
  const getFormDataForSubmit = (): ClienteCreateParams => {
    const parseNumber = (value: string): number | undefined => {
      if (!value || value.trim() === '') return undefined;
      const num = parseInt(value, 10);
      return isNaN(num) ? undefined : num;
    };

    const parseStringOrNumber = (value: string): string | number | undefined => {
      if (!value || value.trim() === '') return undefined;
      // Si es un número, devolver como número, sino como string
      const num = parseInt(value, 10);
      if (!isNaN(num) && String(num) === value.trim()) {
        return num;
      }
      return value.trim();
    };

    return {
      razonSocial: formData.razonSocial.trim(),
      nombre: formData.nombre.trim() || undefined,
      cuit: parseStringOrNumber(formData.cuit),
      tipo: formData.tipo.trim() || undefined,
      categoriaFiscal: formData.categoriaFiscal.trim() || undefined,
      telefono: parseStringOrNumber(formData.telefono),
      movil: parseStringOrNumber(formData.movil),
      codigoExterno: parseStringOrNumber(formData.codigoExterno),
      ctbId: parseNumber(formData.ctbId),
      cuentaId: parseNumber(formData.cuentaId),
      email: formData.email.trim() || undefined,
      domicilioFiscal: formData.domicilioFiscal.trim() || undefined,
      localidadId: parseNumber(formData.localidadId),
      cpFiscal: parseStringOrNumber(formData.cpFiscal),
      provinciaId: parseNumber(formData.provinciaId),
      paisId: parseNumber(formData.paisId),
      codigo: formData.codigo.trim() || undefined, // Si está vacío, el backend generará uno automáticamente
    };
  };

  return {
    formData,
    setFormData,
    updateField,
    handleChange,
    resetForm,
    getFormDataForSubmit,
  };
};

