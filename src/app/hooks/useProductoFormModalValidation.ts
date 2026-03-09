'use client';

import { useCallback } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import type { ModoWizard } from '@/app/hooks/useProductoWizard';
import type { WizardState } from '@/app/hooks/useProductoWizard';
const ECOMMERCE_RUBROS_SFACTORY_IDS = [3285, 3314] as const;
const RUBROS_PERMITIDOS_MSG =
  'Solo se permiten rubros PRODUCTO WORKWEAR (3285) y PRODUCTO OFFICE (3314).';

const paso2SFactorySchema = z.object({
  rubro_id: z
    .number({
      error: (issue) => (issue.input === undefined ? 'El rubro es requerido' : 'Valor inválido'),
    })
    .refine((id) => ECOMMERCE_RUBROS_SFACTORY_IDS.includes(id as (typeof ECOMMERCE_RUBROS_SFACTORY_IDS)[number]), {
      message: RUBROS_PERMITIDOS_MSG,
    }),
  subrubro_id: z.number({
    error: (issue) =>
      issue.input === undefined ? 'El subrubro es requerido' : 'Valor inválido',
  }),
});

export interface UseProductoFormModalValidationParams {
  modo: ModoWizard;
  wizardState: WizardState;
  codigoValido: boolean | undefined;
  codigoMensaje: string;
  variantesData?: { variantes: Array<{ color: string | null }> };
  setErrorsAndScrollFn: (errors: Record<string, string>) => void;
}

export function useProductoFormModalValidation({
  modo,
  wizardState,
  codigoValido,
  codigoMensaje,
  variantesData,
  setErrorsAndScrollFn,
}: UseProductoFormModalValidationParams) {
  const validarPaso1 = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (modo !== 'editar') {
      if (!wizardState.datosComunes.nombre.trim()) {
        newErrors.nombre = 'El nombre es requerido';
      }
    }

    if (modo === 'crear-variante') {
      const codigoCompleto =
        wizardState.datosComunes.codigoCompleto || wizardState.datosComunes.codigoBase + '';
      if (!codigoCompleto.trim() || !wizardState.datosComunes.codigoBase.trim()) {
        newErrors.codigoCompleto = 'El código completo es requerido';
      } else if (codigoValido === false) {
        newErrors.codigoCompleto = codigoMensaje || 'Este código ya existe';
      }
      if (!wizardState.variante.talle) {
        newErrors.talle = 'El talle es requerido para variantes';
      }
      if (!wizardState.variante.color) {
        newErrors.color = 'El color es requerido para variantes';
      }
    } else if (modo !== 'editar') {
      if (!wizardState.datosComunes.codigoBase.trim()) {
        newErrors.codigoBase = 'El código base es requerido';
      }
    }

    setErrorsAndScrollFn(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [modo, wizardState, codigoValido, codigoMensaje, setErrorsAndScrollFn]);

  const validarPaso2 = useCallback((): boolean => {
    if (modo === 'crear-variante') return true;

    const result = paso2SFactorySchema.safeParse({
      rubro_id: wizardState.datosSFactory.rubro_id ?? undefined,
      subrubro_id: wizardState.datosSFactory.subrubro_id ?? undefined,
    });

    if (result.success) {
      setErrorsAndScrollFn({});
      return true;
    }

    const newErrors: Record<string, string> = {};
    const zodErrors = result.error.flatten().fieldErrors;
    if (zodErrors.rubro_id?.[0]) newErrors.rubro_id = zodErrors.rubro_id[0];
    if (zodErrors.subrubro_id?.[0]) newErrors.subrubro_id = zodErrors.subrubro_id[0];
    setErrorsAndScrollFn(newErrors);
    return false;
  }, [modo, wizardState.datosSFactory.rubro_id, wizardState.datosSFactory.subrubro_id, setErrorsAndScrollFn]);

  const validarPaso3 = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (modo === 'crear-variante') {
      if (!wizardState.variante.talle) {
        newErrors.talle = 'El talle es requerido para variantes';
      }
      if (!wizardState.variante.color) {
        newErrors.color = 'El color es requerido para variantes';
      } else if (variantesData?.variantes) {
        const coloresExistentes = variantesData.variantes
          .map((v) => v.color)
          .filter((c): c is string => !!c);
        if (coloresExistentes.includes(wizardState.variante.color)) {
          toast(
            `⚠️ El color "${wizardState.variante.color}" ya existe en este producto. Se creará otra variante con el mismo color.`,
            { duration: 5000, icon: '⚠️' }
          );
        }
      }
    }

    setErrorsAndScrollFn(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [modo, wizardState, variantesData, setErrorsAndScrollFn]);

  return { validarPaso1, validarPaso2, validarPaso3 };
}
