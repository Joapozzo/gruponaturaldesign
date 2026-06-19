'use client';

import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useProductoWizard, type ModoWizard } from '@/app/hooks/useProductoWizard';
import { useProductosMutations } from '@/app/hooks/useProductosMutations';
import { useFormErrors } from '@/app/hooks/useFormErrors';
import { useProductoCodigoValidation } from '@/app/hooks/useProductoCodigoValidation';
import { useProductoFormModalQueries } from '@/app/hooks/useProductoFormModalQueries';
import { useProductoFormModalInit } from '@/app/hooks/useProductoFormModalInit';
import { useProductoFormModalValidation } from '@/app/hooks/useProductoFormModalValidation';
import { useProductoFormModalSubmit } from '@/app/hooks/useProductoFormModalSubmit';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';
import type { ProductoPadreBusqueda } from '@/app/services/producto.service';

export interface UseProductoFormModalParams {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ProductoPadreConVariantes) => Promise<void>;
  producto?: ProductoPadreConVariantes | null;
  modo?: ModoWizard;
  productoPadreSeleccionado?: ProductoPadreBusqueda;
  loading?: boolean;
}

const EMPRESA_ID = 1; // TODO: del contexto de autenticación

export function useProductoFormModal({
  isOpen,
  onClose,
  onSubmit,
  producto,
  modo: modoProp,
  productoPadreSeleccionado: productoPadreProp,
  loading: loadingProp = false,
}: UseProductoFormModalParams) {
  const modo: ModoWizard = modoProp || (producto ? 'editar' : 'crear-producto');
  const isEditMode = modo === 'editar';

  const wizard = useProductoWizard(modo);
  const {
    state: wizardState,
    siguientePaso,
    anteriorPaso,
    setPaso,
    updateDatosComunes,
    updateDatosSFactory,
    updateDatosLocales,
    updateVariante,
    setProductoPadreId,
    setProductoWebId,
    setItemId,
    setCreadoEnSFactory,
    resetWizard,
  } = wizard;

  const mutations = useProductosMutations({
    empresaId: EMPRESA_ID,
    onSuccess: (message) => toast.success(message),
    onError: (message) => toast.error(message),
  });

  const formErrors = useFormErrors();
  const { errors, setErrorsAndScroll, setErrorsFromBackend, clearError, resetErrors } = formErrors;

  const codigoValidation = useProductoCodigoValidation({
    validarCodigo: mutations.validarCodigo,
    onErrorSet: (errs) => formErrors.setErrors((prev) => ({ ...prev, ...errs })),
    clearError,
  });

  const queries = useProductoFormModalQueries({
    isOpen,
    modo,
    isEditMode,
    producto,
    productoPadreSeleccionado: productoPadreProp,
    wizardState,
    empresaId: EMPRESA_ID,
  });

  const { datosSFactoryParaEdicion, productoCompleto, datosPlantilla } = queries;

  const onReset = useCallback(() => {
    resetErrors();
    codigoValidation.resetCodigoValidation();
  }, [resetErrors, codigoValidation]);

  useProductoFormModalInit({
    isOpen,
    modo,
    isEditMode,
    productoCompleto,
    productoPadreProp,
    datosPlantilla,
    datosSFactoryParaEdicion,
    wizardSetters: {
      updateDatosComunes,
      updateDatosSFactory,
      updateDatosLocales,
      updateVariante,
      setProductoPadreId,
      setProductoWebId,
      setItemId,
      setCreadoEnSFactory,
      resetWizard,
    },
    onReset,
  });

  const validation = useProductoFormModalValidation({
    modo,
    wizardState,
    codigoValido: codigoValidation.codigoValido,
    codigoMensaje: codigoValidation.codigoMensaje,
    variantesData: queries.variantesData,
    setErrorsAndScrollFn: setErrorsAndScroll,
  });

  const { handleSiguiente, handleFinalizar } = useProductoFormModalSubmit({
    wizardState,
    modo,
    isEditMode,
    datosSFactoryParaEdicion: datosSFactoryParaEdicion ?? null,
    validarPaso1: validation.validarPaso1,
    validarPaso2: validation.validarPaso2,
    validarPaso3: validation.validarPaso3,
    validarCodigo: codigoValidation.validarCodigo,
    mutations,
    wizardActions: {
      setPaso,
      siguientePaso,
      setProductoPadreId,
      setProductoWebId,
      setItemId,
      setCreadoEnSFactory,
    },
    setErrorsFromBackend,
    onClose,
    onSubmit,
  });

  const handleNombreChange = useCallback(
    (value: string) => {
      updateDatosComunes({ nombre: value });
      clearError('nombre');
    },
    [updateDatosComunes, clearError]
  );

  const handleCodigoBaseChange = useCallback(
    (value: string) => {
      updateDatosComunes({ codigoBase: value });
      clearError('codigoBase');
    },
    [updateDatosComunes, clearError]
  );

  const handleCodigoCompletoChange = useCallback(
    (value: string) => {
      updateDatosComunes({ codigoCompleto: value });
      codigoValidation.validarCodigo(value);
    },
    [updateDatosComunes, codigoValidation]
  );

  const handleSFactoryFieldChange = useCallback(
    (field: string, value: string | number | boolean | null | undefined) => {
      updateDatosSFactory({ [field]: value });
      if (field === 'descrip_corta') {
        updateDatosLocales({
          descripcionCorta: value != null ? String(value) : '',
        });
      }
      if (field === 'detalle') {
        updateDatosLocales({
          descripcion: value != null ? String(value) : '',
        });
      }
      clearError(field);
    },
    [updateDatosSFactory, updateDatosLocales, clearError]
  );

  const isLoading =
    loadingProp ||
    queries.isLoadingProductoCompleto ||
    queries.isLoadingPlantilla ||
    mutations.isCreandoProducto ||
    mutations.isActualizandoSFactory ||
    mutations.isActualizandoLocales ||
    mutations.isActualizandoVariante;

  const hasChanges = useMemo(() => {
    if (!isEditMode || !productoCompleto) return true;
    const loc = productoCompleto.datosLocales;
    const iniNombre = loc.nombre ?? '';
    const iniDescMarketing = loc.descripcionMarketing ?? '';
    const iniDescCorta = loc.descripcionCorta ?? '';
    const iniDestacado = loc.destacado;
    const iniDesc = loc.descripcion ?? '';
    const iniTalle = productoCompleto.variante?.talle ?? null;
    const iniColor = productoCompleto.variante?.color ?? null;
    if (wizardState.datosComunes.nombre !== iniNombre) return true;
    if ((wizardState.datosLocales.descripcionMarketing ?? '') !== iniDescMarketing) return true;
    if ((wizardState.datosLocales.descripcionCorta ?? '') !== iniDescCorta) return true;
    if (wizardState.datosLocales.destacado !== iniDestacado) return true;
    if ((wizardState.datosLocales.descripcion ?? '') !== iniDesc) return true;
    if (wizardState.variante.talle !== iniTalle) return true;
    if (wizardState.variante.color !== iniColor) return true;
    const orig = datosSFactoryParaEdicion;
    if (orig) {
      if ((wizardState.datosSFactory.rubro_id ?? null) !== (orig.rubro_id ?? null)) return true;
      if ((wizardState.datosSFactory.subrubro_id ?? null) !== (orig.subrubro_id ?? null)) return true;
      if ((wizardState.datosSFactory.descrip_corta ?? '') !== (orig.descrip_corta ?? '')) return true;
      if ((wizardState.datosSFactory.detalle ?? '') !== (orig.detalle ?? '')) return true;
      if (((wizardState.datosSFactory.um_id ?? 1) !== (orig.um_id ?? 1))) return true;
    }
    return false;
  }, [
    isEditMode,
    productoCompleto,
    datosSFactoryParaEdicion,
    wizardState.datosComunes.nombre,
    wizardState.datosLocales.descripcionMarketing,
    wizardState.datosLocales.descripcionCorta,
    wizardState.datosLocales.destacado,
    wizardState.datosLocales.descripcion,
    wizardState.variante.talle,
    wizardState.variante.color,
    wizardState.datosSFactory.rubro_id,
    wizardState.datosSFactory.subrubro_id,
    wizardState.datosSFactory.descrip_corta,
    wizardState.datosSFactory.detalle,
    wizardState.datosSFactory.um_id,
  ]);

  const totalPasos = modo === 'crear-variante' ? 2 : 3;
  const pasoVisible =
    modo === 'crear-variante'
      ? wizardState.pasoActual === 1
        ? 1
        : 2
      : wizardState.pasoActual;
  const isLastStep =
    (modo === 'crear-variante' && wizardState.pasoActual === 3) ||
    wizardState.pasoActual === 3;

  return {
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
    rubrosData: queries.rubrosData,
    subrubrosData: queries.subrubrosData,
    variantesData: queries.variantesData,
    productoPadreProp,
    codigoValidation: {
      isValidatingCodigo: codigoValidation.isValidatingCodigo,
      codigoValido: codigoValidation.codigoValido,
      codigoMensaje: codigoValidation.codigoMensaje,
    },
  };
}
