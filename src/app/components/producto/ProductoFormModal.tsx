'use client';
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import FormModal from '../modal/FormModal';
import Button from '../ui/Button';
import { ProductoInfoStep } from './steps/ProductoInfoStep';
import { ProductoImagenesStep } from './steps/ProductoImagenesStep';
import { useProductoForm } from '@/app/hooks/useProductoForm';
import { useProductoSteps } from '@/app/hooks/useProductoSteps';
import { useProductoImages } from '@/app/hooks/useProductoImages';
import { useProductoValidation } from '@/app/hooks/useProductoValidation';
import { useRubros } from '@/app/hooks/useRubros';
import { useSubrubros } from '@/app/hooks/useSubrubros';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';

interface ProductoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ProductoPadreConVariantes> & { imagenes?: { principal: string; complementarias: string[] } }) => Promise<void>;
  producto?: ProductoPadreConVariantes | null;
  loading?: boolean;
}

export const ProductoFormModal: React.FC<ProductoFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  producto,
  loading = false,
}) => {
  const isEditMode = !!producto;

  // Hooks de estado y lógica
  const { formData, handleChange, updateField } = useProductoForm(producto, isOpen);
  const { currentStep, steps, currentStepIndex, nextStep, previousStep } = useProductoSteps(isOpen);
  const {
    imagenes,
    uploadPrincipal,
    uploadComplementaria,
    removePrincipal,
    removeComplementaria,
    maxComplementarias,
  } = useProductoImages(producto, isOpen);
  const { errors, validate, clearError } = useProductoValidation();

  // Cargar rubros y subrubros
  const empresaId = 1; // TODO: Obtener del contexto de autenticación
  const { data: rubrosData } = useRubros({ empresaId, visibleWeb: true, includeSubrubros: false });
  const { data: subrubrosData } = useSubrubros({
    empresaId,
    rubroId: formData.rubroId ? parseInt(formData.rubroId) : undefined,
    visibleWeb: true,
  });

  // Handler para cambios de campo con limpieza de errores
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    handleChange(e);
    if (errors[e.target.name]) {
      clearError(e.target.name);
    }
  };

  // Handler para cambio de rubro (limpia subrubro)
  const handleRubroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);
    updateField('subrubroId', '');
    if (errors.rubroId) {
      clearError('rubroId');
    }
  };

  // Handler para navegar al siguiente step
  const handleNext = () => {
    if (currentStep === 'info') {
      if (validate(formData)) {
        nextStep();
      }
    }
  };

  // Handler para submit final
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

  // Footer actions
  const footerActions = (
    <>
      {currentStep === 'imagenes' && (
        <Button
          type="button"
          variant="grayOutline"
          size="lg"
          onClick={previousStep}
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
        {loading
          ? 'Procesando...'
          : currentStep === 'imagenes'
          ? isEditMode
            ? 'Guardar Cambios'
            : 'Crear producto'
          : 'Siguiente'}
      </Button>
    </>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isEditMode ? 'Editar' : 'Crear'} Producto`}
      onSubmit={handleSubmit}
      submitText={
        currentStep === 'imagenes'
          ? isEditMode
            ? 'Guardar Cambios'
            : 'Crear producto'
          : 'Siguiente'
      }
      loading={loading && currentStep === 'imagenes'}
      size="lg"
      showCancel={false}
      footerActions={footerActions}
    >
      {/* Steps Indicator */}
      <div className="mb-6 px-2">
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
          <ProductoInfoStep
            formData={formData}
            errors={errors}
            onFieldChange={handleFieldChange}
            onRubroChange={handleRubroChange}
            rubrosData={rubrosData?.data}
            subrubrosData={subrubrosData?.data}
          />
        )}

        {currentStep === 'imagenes' && (
          <ProductoImagenesStep
            imagenes={imagenes}
            onPrincipalUpload={uploadPrincipal}
            onPrincipalRemove={removePrincipal}
            onComplementariaUpload={uploadComplementaria}
            onComplementariaRemove={removeComplementaria}
            maxComplementarias={maxComplementarias}
          />
        )}
      </AnimatePresence>
    </FormModal>
  );
};

export default ProductoFormModal;

