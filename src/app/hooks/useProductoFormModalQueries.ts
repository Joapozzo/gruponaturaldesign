'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productoService } from '@/app/services/producto.service';
import { productosKeys } from '@/app/utils/productosKeys';
import { useRubros } from '@/app/hooks/useRubros';
import { useSubrubros } from '@/app/hooks/useSubrubros';
import { normalizeSFactoryIdsForEdit } from '@/app/utils/productoFormModal.utils';
import type { ModoWizard } from '@/app/hooks/useProductoWizard';
import type { WizardState } from '@/app/hooks/useProductoWizard';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';
import type { ProductoPadreBusqueda } from '@/app/services/producto.service';
import type { ProductoCompletoResponse } from '@/app/services/producto.service';
import type { DatosPlantillaResponse } from '@/app/services/producto.service';

export interface UseProductoFormModalQueriesParams {
  isOpen: boolean;
  modo: ModoWizard;
  isEditMode: boolean;
  producto: ProductoPadreConVariantes | null | undefined;
  productoPadreSeleccionado: ProductoPadreBusqueda | undefined;
  wizardState: WizardState;
  empresaId: number;
}

export function useProductoFormModalQueries({
  isOpen,
  modo,
  isEditMode,
  producto,
  productoPadreSeleccionado: _productoPadreProp,
  wizardState,
  empresaId,
}: UseProductoFormModalQueriesParams) {
  const { data: rubrosData } = useRubros({
    empresaId,
    visibleWeb: true,
    includeSubrubros: false,
  });

  const rubroLocalId = useMemo(() => {
    const rubroId = wizardState.datosSFactory.rubro_id;
    if (rubroId == null) return undefined;
    return rubrosData?.data?.find((r) => r.sfactoryId === rubroId)?.id;
  }, [wizardState.datosSFactory.rubro_id, rubrosData?.data]);

  const { data: subrubrosData } = useSubrubros({
    empresaId,
    rubroId: rubroLocalId,
    visibleWeb: true,
  });

  const { data: productoCompleto, isLoading: isLoadingProductoCompleto } = useQuery({
    queryKey: productosKeys.completo(producto?.id || 0),
    queryFn: () => productoService.obtenerProductoCompleto(producto!.id),
    enabled: isEditMode && !!producto && isOpen,
  });

  const { data: datosPlantilla, isLoading: isLoadingPlantilla } = useQuery({
    queryKey: productosKeys.datosPlantilla(wizardState.productoPadreId!),
    queryFn: () => productoService.obtenerDatosPlantilla(wizardState.productoPadreId!),
    enabled: modo === 'crear-variante' && !!wizardState.productoPadreId && isOpen,
  });

  const { data: variantesData } = useQuery({
    queryKey: productosKeys.variantesPorCodigoBase(wizardState.datosComunes.codigoBase),
    queryFn: () => productoService.obtenerVariantesPorCodigoBase(wizardState.datosComunes.codigoBase),
    enabled:
      modo === 'crear-variante' &&
      !!wizardState.datosComunes.codigoBase &&
      wizardState.datosComunes.codigoBase.length > 0 &&
      isOpen,
  });

  const datosSFactoryParaEdicion = useMemo((): (ProductoCompletoResponse['datosSFactory'] & {
    rubro_id: number | null;
    subrubro_id: number | null;
}) | null => {
    if (!isOpen || !isEditMode || !productoCompleto) return null;
    return normalizeSFactoryIdsForEdit(
      productoCompleto.datosSFactory,
      rubrosData?.data,
      subrubrosData?.data
    ) as (ProductoCompletoResponse['datosSFactory'] & {
      rubro_id: number | null;
      subrubro_id: number | null;
    });
  }, [isOpen, isEditMode, productoCompleto, rubrosData?.data, subrubrosData?.data]);

  return {
    productoCompleto,
    datosPlantilla: datosPlantilla as DatosPlantillaResponse | undefined,
    variantesData,
    rubrosData,
    subrubrosData,
    datosSFactoryParaEdicion,
    rubroLocalId,
    isLoadingProductoCompleto,
    isLoadingPlantilla,
  };
}
