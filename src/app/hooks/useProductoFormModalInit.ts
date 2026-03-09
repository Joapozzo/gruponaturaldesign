'use client';

import { useEffect, useRef } from 'react';
import type { ModoWizard } from '@/app/hooks/useProductoWizard';
import type { WizardState } from '@/app/hooks/useProductoWizard';
import type { ProductoCompletoResponse } from '@/app/services/producto.service';
import type { DatosPlantillaResponse } from '@/app/services/producto.service';
import type { ProductoPadreBusqueda } from '@/app/services/producto.service';

export interface UseProductoFormModalInitParams {
  isOpen: boolean;
  modo: ModoWizard;
  isEditMode: boolean;
  productoCompleto: ProductoCompletoResponse | undefined;
  productoPadreProp: ProductoPadreBusqueda | undefined;
  datosPlantilla: DatosPlantillaResponse | undefined;
  datosSFactoryParaEdicion: (ProductoCompletoResponse['datosSFactory'] & {
    rubro_id: number | null;
    subrubro_id: number | null;
  }) | null;
  wizardSetters: {
    updateDatosComunes: (data: Partial<WizardState['datosComunes']>) => void;
    updateDatosSFactory: (data: Partial<WizardState['datosSFactory']>) => void;
    updateDatosLocales: (data: Partial<WizardState['datosLocales']>) => void;
    updateVariante: (data: Partial<WizardState['variante']>) => void;
    setProductoPadreId: (id: number) => void;
    setProductoWebId: (id: number) => void;
    setItemId: (id: number) => void;
    setCreadoEnSFactory: (creado: boolean) => void;
    resetWizard: () => void;
  };
  onReset?: () => void;
}

export function useProductoFormModalInit({
  isOpen,
  modo,
  isEditMode,
  productoCompleto,
  productoPadreProp,
  datosPlantilla,
  datosSFactoryParaEdicion,
  wizardSetters,
  onReset,
}: UseProductoFormModalInitParams) {
  const {
    updateDatosComunes,
    updateDatosSFactory,
    updateDatosLocales,
    updateVariante,
    setProductoPadreId,
    setProductoWebId,
    setItemId,
    setCreadoEnSFactory,
    resetWizard,
  } = wizardSetters;

  const hasInitializedForSession = useRef(false);
  const prevIsOpenRef = useRef(isOpen);

  useEffect(() => {
    if (isOpen) {
      prevIsOpenRef.current = true;
      if (isEditMode && productoCompleto && !hasInitializedForSession.current) {
        const datos = datosSFactoryParaEdicion ?? productoCompleto.datosSFactory;
        updateDatosComunes({
          nombre: productoCompleto.datosLocales.nombre || productoCompleto.datosSFactory.descripcion,
          codigoBase: productoCompleto.productoPadre.codigoAgrupacion,
        });
        updateDatosSFactory(datos);
        const descripcionCorta =
          (datos.descrip_corta ?? productoCompleto.datosLocales.descripcionCorta) ?? '';
        const descripcionDetalle = (datos.detalle ?? productoCompleto.datosLocales.descripcion) ?? '';
        updateDatosLocales({
          descripcionMarketing: productoCompleto.datosLocales.descripcionMarketing ?? '',
          descripcionCorta,
          destacado: productoCompleto.datosLocales.destacado,
          descripcion: descripcionDetalle,
        });
        if (productoCompleto.variante) {
          updateVariante({
            talle: productoCompleto.variante.talle,
            color: productoCompleto.variante.color,
          });
          setProductoWebId(productoCompleto.variante.id);
          setItemId(productoCompleto.variante.sfactoryId);
        }
        setProductoPadreId(productoCompleto.productoPadre.id);
        setCreadoEnSFactory(true);
        hasInitializedForSession.current = true;
      } else if (modo === 'crear-variante' && productoPadreProp && !hasInitializedForSession.current) {
        updateDatosComunes({
          nombre: datosPlantilla?.datosSFactory.descripcion || productoPadreProp.nombre,
          codigoBase: productoPadreProp.codigoAgrupacion,
        });
        setProductoPadreId(productoPadreProp.id);
        if (datosPlantilla) {
          updateDatosSFactory(datosPlantilla.datosSFactory);
          const descripcionCorta =
            datosPlantilla.datosSFactory.descrip_corta ??
            datosPlantilla.datosLocales.descripcionCorta ??
            '';
          const descripcionDetalle =
            datosPlantilla.datosSFactory.detalle ?? datosPlantilla.datosLocales.descripcion ?? '';
          updateDatosLocales({
            descripcionMarketing: datosPlantilla.datosLocales.descripcionMarketing ?? '',
            descripcionCorta,
            destacado: datosPlantilla.datosLocales.destacado,
            descripcion: descripcionDetalle,
          });
        }
        hasInitializedForSession.current = true;
      }
    } else {
      if (prevIsOpenRef.current) {
        prevIsOpenRef.current = false;
        resetWizard();
        onReset?.();
      }
      hasInitializedForSession.current = false;
    }
  }, [
    isOpen,
    isEditMode,
    productoCompleto,
    productoPadreProp,
    datosPlantilla,
    modo,
    datosSFactoryParaEdicion,
    resetWizard,
    setCreadoEnSFactory,
    setItemId,
    setProductoPadreId,
    setProductoWebId,
    updateDatosComunes,
    updateDatosLocales,
    updateDatosSFactory,
    updateVariante,
    onReset,
  ]);
}
