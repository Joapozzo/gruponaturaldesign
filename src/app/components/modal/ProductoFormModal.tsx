'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Upload, X, Image as ImageIcon } from 'lucide-react';
import FormModal from './FormModal';
import Button from '../ui/Button';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';
import { useRubros } from '@/app/hooks/useRubros';
import { useSubrubros } from '@/app/hooks/useSubrubros';

interface ProductoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ProductoPadreConVariantes> & { imagenes?: { principal: string; complementarias: string[] } }) => Promise<void>;
  producto?: ProductoPadreConVariantes | null;
  loading?: boolean;
}

type Step = 'info' | 'imagenes';

const ProductoFormModal: React.FC<ProductoFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  producto,
  loading = false,
}) => {
  const isEditMode = !!producto;
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [formData, setFormData] = useState({
    nombre: '',
    codigoAgrupacion: '',
    descripcion: '',
    descripcionCorta: '',
    descripcionMarketing: '',
    rubroId: '',
    subrubroId: '',
    sexo: '',
    talle: '',
    publicado: false,
    destacado: false,
  });

  const [imagenes, setImagenes] = useState<{
    principal: string;
    complementarias: string[];
  }>({
    principal: '',
    complementarias: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar rubros y subrubros
  const empresaId = 1; // TODO: Obtener del contexto de autenticación
  const { data: rubrosData } = useRubros({ empresaId, visibleWeb: true, includeSubrubros: false });
  const { data: subrubrosData } = useSubrubros({ 
    empresaId, 
    rubroId: formData.rubroId ? parseInt(formData.rubroId) : undefined,
    visibleWeb: true 
  });

  // Cargar datos del producto si está en modo edición
  useEffect(() => {
    if (producto) {
      // Obtener sexo y talle de la primera variante si existe
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
        publicado: producto.publicado || false,
        destacado: producto.destacado || false,
      });

      // Cargar imágenes si existen
      if (producto.imagenes) {
        try {
          const imgData = typeof producto.imagenes === 'string' 
            ? JSON.parse(producto.imagenes) 
            : producto.imagenes;
          
          if (Array.isArray(imgData) && imgData.length > 0) {
            setImagenes({
              principal: imgData[0] || '',
              complementarias: imgData.slice(1) || [],
            });
          } else if (typeof imgData === 'object' && imgData.principal) {
            setImagenes({
              principal: imgData.principal || '',
              complementarias: imgData.complementarias || [],
            });
          }
        } catch (e) {
          // Si no se puede parsear, dejar vacío
        }
      }
    } else {
      // Resetear formulario para modo creación
      setFormData({
        nombre: '',
        codigoAgrupacion: '',
        descripcion: '',
        descripcionCorta: '',
        descripcionMarketing: '',
        rubroId: '',
        subrubroId: '',
        sexo: '',
        talle: '',
        publicado: false,
        destacado: false,
      });
      setImagenes({
        principal: '',
        complementarias: [],
      });
    }
    setErrors({});
    setCurrentStep('info');
  }, [producto, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (type: 'principal' | 'complementaria', file?: File) => {
    if (!file) return;

    // Por ahora solo guardamos la URL, en producción deberías subir el archivo
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'principal') {
        setImagenes((prev) => ({ ...prev, principal: result }));
      } else {
        setImagenes((prev) => ({
          ...prev,
          complementarias: [...prev.complementarias, result],
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: 'principal' | 'complementaria', index?: number) => {
    if (type === 'principal') {
      setImagenes((prev) => ({ ...prev, principal: '' }));
    } else if (index !== undefined) {
      setImagenes((prev) => ({
        ...prev,
        complementarias: prev.complementarias.filter((_, i) => i !== index),
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.codigoAgrupacion.trim()) {
      newErrors.codigoAgrupacion = 'El código de agrupación es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 'info') {
      if (validate()) {
        setCurrentStep('imagenes');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'imagenes') {
      setCurrentStep('info');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 'info') {
      handleNext();
      return;
    }

    // Si estamos en el step de imágenes, hacer submit final
    const submitData: Partial<ProductoPadreConVariantes> & { 
      imagenes?: { principal: string; complementarias: string[] };
      sexo?: string;
      talle?: string;
    } = {
      nombre: formData.nombre.trim(),
      codigoAgrupacion: formData.codigoAgrupacion.trim(),
      descripcion: formData.descripcion.trim() || null,
      descripcionCorta: formData.descripcionCorta.trim() || null,
      descripcionMarketing: formData.descripcionMarketing.trim() || null,
      rubroId: formData.rubroId ? parseInt(formData.rubroId) : null,
      subrubroId: formData.subrubroId ? parseInt(formData.subrubroId) : null,
      sexo: formData.sexo.trim() || undefined,
      talle: formData.talle.trim() || undefined,
      publicado: formData.publicado,
      destacado: formData.destacado,
      imagenes: imagenes,
    };

    await onSubmit(submitData);
  };

  const steps: { key: Step; label: string }[] = [
    { key: 'info', label: 'Información' },
    { key: 'imagenes', label: 'Imágenes' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const footerActions = (
    <>
      {currentStep === 'imagenes' && (
        <Button
          type="button"
          variant="grayOutline"
          size="lg"
          onClick={handleBack}
          disabled={loading}
          className="tracking-wide h-12"
        >
          <ChevronLeft className="w-4 h-4 mr-2 inline" />
          Anterior
        </Button>
      )}
      <Button
        type="button"
        variant="grayOutline"
        size="lg"
        fullWidth={currentStep === 'info'}
        onClick={onClose}
        disabled={loading}
        className="tracking-wide h-12"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        variant="black"
        size="lg"
        fullWidth
        disabled={loading}
        className="tracking-wide h-12 flex items-center justify-center"
      >
        {loading ? 'Procesando...' : currentStep === 'imagenes' ? (isEditMode ? 'Guardar Cambios' : 'Crear Producto') : 'Siguiente'}
      </Button>
    </>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isEditMode ? 'Editar' : 'Crear'} Producto`}
      onSubmit={handleSubmit}
      submitText={currentStep === 'imagenes' ? (isEditMode ? 'Guardar Cambios' : 'Crear Producto') : 'Siguiente'}
      loading={loading && currentStep === 'imagenes'}
      size="lg"
      showCancel={false}
      footerActions={footerActions}
    >
      {/* Steps Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    index <= currentStepIndex
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    index <= currentStepIndex ? 'text-black' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    index < currentStepIndex ? 'bg-black' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 'info' && (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nombre del producto"
              />
              {errors.nombre && (
                <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* Código de Agrupación */}
            <div>
              <label htmlFor="codigoAgrupacion" className="block text-sm font-medium text-gray-700 mb-1">
                Código de Agrupación <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="codigoAgrupacion"
                name="codigoAgrupacion"
                value={formData.codigoAgrupacion}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.codigoAgrupacion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Código único de agrupación"
              />
              {errors.codigoAgrupacion && (
                <p className="text-red-500 text-xs mt-1">{errors.codigoAgrupacion}</p>
              )}
            </div>

            {/* Descripción Corta */}
            <div>
              <label htmlFor="descripcionCorta" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Corta
              </label>
              <input
                type="text"
                id="descripcionCorta"
                name="descripcionCorta"
                value={formData.descripcionCorta}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Descripción breve del producto"
              />
            </div>

            {/* Descripción Completa */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Completa
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Descripción detallada del producto"
              />
            </div>

            {/* Descripción Marketing */}
            <div>
              <label htmlFor="descripcionMarketing" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Marketing
              </label>
              <textarea
                id="descripcionMarketing"
                name="descripcionMarketing"
                value={formData.descripcionMarketing}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Descripción para marketing y SEO"
              />
            </div>

            {/* Rubro y Subrubro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="rubroId" className="block text-sm font-medium text-gray-700 mb-1">
                  Rubro
                </label>
                <select
                  id="rubroId"
                  name="rubroId"
                  value={formData.rubroId}
                  onChange={(e) => {
                    handleChange(e);
                    // Limpiar subrubro cuando cambia el rubro
                    setFormData((prev) => ({ ...prev, subrubroId: '' }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  <option value="">Seleccionar rubro</option>
                  {rubrosData?.data.map((rubro) => (
                    <option key={rubro.id} value={rubro.id}>
                      {rubro.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subrubroId" className="block text-sm font-medium text-gray-700 mb-1">
                  Subrubro
                </label>
                <select
                  id="subrubroId"
                  name="subrubroId"
                  value={formData.subrubroId}
                  onChange={handleChange}
                  disabled={!formData.rubroId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">{formData.rubroId ? 'Seleccionar subrubro' : 'Primero selecciona un rubro'}</option>
                  {subrubrosData?.data.map((subrubro) => (
                    <option key={subrubro.id} value={subrubro.id}>
                      {subrubro.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sexo y Talle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-1">
                  Sexo
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  <option value="">Seleccionar sexo</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Niño">Niño</option>
                  <option value="Niña">Niña</option>
                </select>
              </div>

              <div>
                <label htmlFor="talle" className="block text-sm font-medium text-gray-700 mb-1">
                  Talle
                </label>
                <select
                  id="talle"
                  name="talle"
                  value={formData.talle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  <option value="">Seleccionar talle</option>
                  <option value="2XS">2XS</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="2XL">2XL</option>
                  <option value="3XL">3XL</option>
                  <option value="4XL">4XL</option>
                  <option value="34">34</option>
                  <option value="36">36</option>
                  <option value="38">38</option>
                  <option value="40">40</option>
                  <option value="42">42</option>
                  <option value="44">44</option>
                  <option value="46">46</option>
                  <option value="48">48</option>
                  <option value="50">50</option>
                  <option value="52">52</option>
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="publicado"
                  checked={formData.publicado}
                  onChange={handleChange}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-700">Publicado</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="destacado"
                  checked={formData.destacado}
                  onChange={handleChange}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-700">Destacado</span>
              </label>
            </div>
          </motion.div>
        )}

        {currentStep === 'imagenes' && (
          <motion.div
            key="imagenes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Imagen Principal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Principal
              </label>
              {imagenes.principal ? (
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden group">
                  <img
                    src={imagenes.principal}
                    alt="Imagen principal"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage('principal')}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Haz clic para subir imagen principal</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload('principal', file);
                    }}
                  />
                </label>
              )}
            </div>

            {/* Imágenes Complementarias */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes Complementarias
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {imagenes.complementarias.map((img, index) => (
                  <div key={index} className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden group">
                    <img
                      src={img}
                      alt={`Complementaria ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('complementaria', index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {imagenes.complementarias.length < 6 && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-600">Agregar</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload('complementaria', file);
                      }}
                    />
                  </label>
                )}
              </div>
              {imagenes.complementarias.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Puedes agregar hasta 6 imágenes complementarias
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </FormModal>
  );
};

export default ProductoFormModal;
