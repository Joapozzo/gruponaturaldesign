import { useState, useEffect } from 'react';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';

export interface ProductoFormData {
  nombre: string;
  codigoAgrupacion: string;
  descripcion: string;
  descripcionCorta: string;
  descripcionMarketing: string;
  rubroId: string;
  subrubroId: string;
  sexo: string;
  talle: string;
  destacado: boolean;
}

const initialFormData: ProductoFormData = {
  nombre: '',
  codigoAgrupacion: '',
  descripcion: '',
  descripcionCorta: '',
  descripcionMarketing: '',
  rubroId: '',
  subrubroId: '',
  sexo: '',
  talle: '',
  destacado: false,
};

export const useProductoForm = (
  producto: ProductoPadreConVariantes | null | undefined,
  isOpen: boolean
) => {
  const [formData, setFormData] = useState<ProductoFormData>(initialFormData);

  // Parsear producto y cargar datos en el formulario
  useEffect(() => {
    if (producto) {
      const primeraVariante = producto.productosWeb?.[0];
      setFormData({
        nombre: producto.nombre || '',
        codigoAgrupacion: producto.codigoAgrupacion || '',
        descripcion: producto.descripcion || '',
        descripcionCorta: producto.descripcionCorta || '',
        descripcionMarketing: producto.descripcionMarketing || '',
        rubroId: producto.rubroId?.toString() || '',
        subrubroId: producto.subrubroId?.toString() || '',
        sexo: primeraVariante?.sexo || '',
        talle: primeraVariante?.talle || '',
        destacado: producto.destacado || false,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [producto, isOpen]);

  const updateField = <K extends keyof ProductoFormData>(
    name: K,
    value: ProductoFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    updateField(
      name as keyof ProductoFormData,
      (type === 'checkbox' ? checked : value) as ProductoFormData[keyof ProductoFormData]
    );
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    setFormData,
    updateField,
    handleChange,
    resetForm,
  };
};

