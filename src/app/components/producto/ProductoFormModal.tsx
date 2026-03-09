'use client';

import React from 'react';
import FormModal from '../modal/FormModal';
import WizardFooter from '../modal/WizardFooter';
import { ProductoDatosComunesStep } from './steps/ProductoDatosComunesStep';
import { ProductoDatosSFactoryStep } from './steps/ProductoDatosSFactoryStep';
import { ProductoDatosLocalesStep } from './steps/ProductoDatosLocalesStep';
import { useProductoFormModal } from '@/app/hooks/useProductoFormModal';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';
import type { ProductoPadreBusqueda } from '@/app/services/producto.service';

export interface ProductoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ProductoPadreConVariantes) => Promise<void>;
  producto?: ProductoPadreConVariantes | null;
  modo?: 'crear-producto' | 'crear-variante' | 'editar';
  productoPadreSeleccionado?: ProductoPadreBusqueda;
  loading?: boolean;
}

export const ProductoFormModal: React.FC<ProductoFormModalProps> = (props) => {
  const {
    modo,
    isEditMode,
    wizardState,
    errors,
    isLoading,
    totalPasos,
    pasoVisible,
    isLastStep,
    hasChanges,
    handleSiguiente,
    handleFinalizar,
    handleNombreChange,
    handleCodigoBaseChange,
    handleCodigoCompletoChange,
    handleSFactoryFieldChange,
    updateVariante,
    updateDatosLocales,
    setPaso,
    anteriorPaso,
    onClose,
    rubrosData,
    subrubrosData,
    variantesData,
    productoPadreProp,
    codigoValidation,
  } = useProductoFormModal(props);

  const title = isEditMode
    ? 'Editar producto'
    : modo === 'crear-variante'
      ? 'Crear Variante'
      : 'Crear producto nuevo';

  const handleAnterior =
    wizardState.pasoActual === 1
      ? onClose
      : modo === 'crear-variante' && wizardState.pasoActual === 3
        ? () => setPaso(1)
        : anteriorPaso;

  const handlePrimaryAction = isLastStep ? handleFinalizar : handleSiguiente;
  const primaryLabel = isLastStep ? 'Finalizar' : 'Siguiente';
  const disableFinalizar = isLastStep && !hasChanges;

  return (
    <FormModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={title}
      size="xl"
      showCancel={false}
      footerActions={
        <WizardFooter
          pasoActual={pasoVisible}
          totalPasos={totalPasos}
          onAnterior={handleAnterior}
          onSiguiente={handlePrimaryAction}
          isLoading={isLoading}
          siguienteLabel={primaryLabel}
          disabledSiguiente={disableFinalizar}
        />
      }
    >
      {wizardState.pasoActual === 1 && (
        <ProductoDatosComunesStep
          modo={modo}
          nombre={wizardState.datosComunes.nombre}
          codigoBase={wizardState.datosComunes.codigoBase}
          codigoCompleto={wizardState.datosComunes.codigoCompleto}
          productoPadreNombre={productoPadreProp?.nombre}
          siguienteNumeroSugerido={variantesData?.siguienteSugerido}
          variante={modo === 'crear-variante' ? wizardState.variante : undefined}
          onTalleChange={
            modo === 'crear-variante'
              ? (value) => updateVariante({ talle: value })
              : undefined
          }
          onColorChange={
            modo === 'crear-variante'
              ? (value) => updateVariante({ color: value })
              : undefined
          }
          onNombreChange={handleNombreChange}
          onCodigoBaseChange={handleCodigoBaseChange}
          onCodigoCompletoChange={handleCodigoCompletoChange}
          errors={errors}
          isValidatingCodigo={codigoValidation.isValidatingCodigo}
          codigoValido={codigoValidation.codigoValido}
          codigoMensaje={codigoValidation.codigoMensaje}
        />
      )}

      {wizardState.pasoActual === 2 && modo !== 'crear-variante' && (
        <ProductoDatosSFactoryStep
          datosSFactory={wizardState.datosSFactory}
          errors={errors}
          onFieldChange={handleSFactoryFieldChange}
          bloqueado={false}
          descripcionSoloLectura={isEditMode}
          rubros={rubrosData?.data ?? []}
          subrubros={subrubrosData?.data ?? []}
        />
      )}

      {wizardState.pasoActual === 3 && (
        <ProductoDatosLocalesStep
          datosLocales={wizardState.datosLocales}
          modo={modo}
          errors={errors}
          onDescripcionMarketingChange={(value) =>
            updateDatosLocales({ descripcionMarketing: value })
          }
          onDestacadoChange={(value) =>
            updateDatosLocales({ destacado: value })
          }
        />
      )}
    </FormModal>
  );
};

export default ProductoFormModal;
