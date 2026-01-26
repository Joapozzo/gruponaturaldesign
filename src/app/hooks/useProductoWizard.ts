import { useState, useCallback } from 'react';
import type { SFactoryItemCreateData } from '../services/producto.service';

export type ModoWizard = 'crear-producto' | 'crear-variante' | 'editar';

export interface WizardState {
  modo: ModoWizard;
  pasoActual: 1 | 2 | 3;
  productoPadreId?: number;
  productoWebId?: number;
  itemId?: number; // ID de SFactory
  datosComunes: {
    nombre: string; // Este nombre se usará como "descripcion" en SFactory
    codigoBase: string;
    codigoCompleto?: string; // Para variantes
  };
  datosSFactory: Partial<SFactoryItemCreateData>;
  datosLocales: {
    descripcionMarketing: string;
    descripcionCorta: string;
    destacado: boolean;
    descripcion?: string;
  };
  variante: {
    talle: string | null;
    color: string | null;
  };
  imagenesSeleccionadas: File[]; // Archivos de imágenes seleccionados
  creadoEnSFactory: boolean; // Flag para bloquear edición Paso 2
  productoPadreSeleccionado?: {
    id: number;
    nombre: string;
    codigoAgrupacion: string;
  };
}

const initialState: WizardState = {
  modo: 'crear-producto',
  pasoActual: 1,
  datosComunes: {
    nombre: '',
    codigoBase: '',
  },
  datosSFactory: {},
  datosLocales: {
    descripcionMarketing: '',
    descripcionCorta: '',
    destacado: false,
  },
  variante: {
    talle: null,
    color: null,
  },
  imagenesSeleccionadas: [],
  creadoEnSFactory: false,
};

export function useProductoWizard(modo: ModoWizard = 'crear-producto') {
  const [state, setState] = useState<WizardState>({
    ...initialState,
    modo,
  });

  const resetWizard = useCallback(() => {
    setState({
      ...initialState,
      modo,
    });
  }, [modo]);

  const setPaso = useCallback((paso: 1 | 2 | 3) => {
    setState((prev) => ({ ...prev, pasoActual: paso }));
  }, []);

  const siguientePaso = useCallback(() => {
    setState((prev) => {
      if (prev.pasoActual < 3) {
        return { ...prev, pasoActual: (prev.pasoActual + 1) as 1 | 2 | 3 };
      }
      return prev;
    });
  }, []);

  const anteriorPaso = useCallback(() => {
    setState((prev) => {
      if (prev.pasoActual > 1) {
        return { ...prev, pasoActual: (prev.pasoActual - 1) as 1 | 2 | 3 };
      }
      return prev;
    });
  }, []);

  const updateDatosComunes = useCallback((data: Partial<WizardState['datosComunes']>) => {
    setState((prev) => ({
      ...prev,
      datosComunes: { ...prev.datosComunes, ...data },
    }));
  }, []);

  const updateDatosSFactory = useCallback((data: Partial<SFactoryItemCreateData>) => {
    setState((prev) => ({
      ...prev,
      datosSFactory: { ...prev.datosSFactory, ...data },
    }));
  }, []);

  const updateDatosLocales = useCallback((data: Partial<WizardState['datosLocales']>) => {
    setState((prev) => ({
      ...prev,
      datosLocales: { ...prev.datosLocales, ...data },
    }));
  }, []);

  const updateVariante = useCallback((data: Partial<WizardState['variante']>) => {
    setState((prev) => ({
      ...prev,
      variante: { ...prev.variante, ...data },
    }));
  }, []);

  const updateImagenesSeleccionadas = useCallback((files: File[]) => {
    setState((prev) => ({
      ...prev,
      imagenesSeleccionadas: files,
    }));
  }, []);

  const setProductoPadreId = useCallback((id: number) => {
    setState((prev) => ({ ...prev, productoPadreId: id }));
  }, []);

  const setProductoWebId = useCallback((id: number) => {
    setState((prev) => ({ ...prev, productoWebId: id }));
  }, []);

  const setItemId = useCallback((id: number) => {
    setState((prev) => ({ ...prev, itemId: id, creadoEnSFactory: true }));
  }, []);

  const setProductoPadreSeleccionado = useCallback((producto: WizardState['productoPadreSeleccionado']) => {
    setState((prev) => ({ ...prev, productoPadreSeleccionado: producto }));
  }, []);

  const setCreadoEnSFactory = useCallback((creado: boolean) => {
    setState((prev) => ({ ...prev, creadoEnSFactory: creado }));
  }, []);

  return {
    state,
    setPaso,
    siguientePaso,
    anteriorPaso,
    updateDatosComunes,
    updateDatosSFactory,
    updateDatosLocales,
    updateVariante,
    updateImagenesSeleccionadas,
    setProductoPadreId,
    setProductoWebId,
    setItemId,
    setProductoPadreSeleccionado,
    setCreadoEnSFactory,
    resetWizard,
  };
}

