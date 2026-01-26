import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productoService } from '../services/producto.service';
import { productosKeys } from '../utils/productosKeys';

export function useProductoVariante() {
  const [codigoBase, setCodigoBase] = useState<string>('');
  const [productoPadreId, setProductoPadreId] = useState<number | null>(null);

  // Query para obtener variantes por código base
  const {
    data: variantesData,
    isLoading: isLoadingVariantes,
    error: errorVariantes,
  } = useQuery({
    queryKey: productosKeys.variantesPorCodigoBase(codigoBase),
    queryFn: () => productoService.obtenerVariantesPorCodigoBase(codigoBase),
    enabled: !!codigoBase && codigoBase.length > 0,
  });

  // Query para obtener combinaciones
  const {
    data: combinacionesData,
    isLoading: isLoadingCombinaciones,
    error: errorCombinaciones,
  } = useQuery({
    queryKey: productosKeys.combinaciones(productoPadreId!),
    queryFn: () => productoService.obtenerCombinaciones(productoPadreId!),
    enabled: !!productoPadreId,
  });

  const siguienteNumeroSugerido = variantesData?.siguienteSugerido || 1;
  const ultimoNumero = variantesData?.ultimoNumero || 0;

  const validarCombinacion = useCallback(
    (talle: string | null, color: string | null): boolean => {
      if (!combinacionesData) return true;

      return !combinacionesData.combinaciones.some(
        (c) => c.talle === talle && c.color === color
      );
    },
    [combinacionesData]
  );

  return {
    codigoBase,
    setCodigoBase,
    productoPadreId,
    setProductoPadreId,
    variantesData,
    isLoadingVariantes,
    errorVariantes,
    siguienteNumeroSugerido,
    ultimoNumero,
    combinacionesData,
    isLoadingCombinaciones,
    errorCombinaciones,
    validarCombinacion,
  };
}

