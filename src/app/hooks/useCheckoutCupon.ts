import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { validarCupon } from '@/app/services/cupones.service';
import { useCartStore } from '@/app/stores/cartStore';
import type { CuponValidationItem, CuponValidacionResponse, CuponAplicado } from '@/app/types/cupones';
import type { CartItem } from '@/app/types/cart';

interface UseCheckoutCuponOptions {
  onSuccess?: (cupon: CuponAplicado) => void;
  onError?: (error: Error) => void;
}

export type UseCheckoutCuponReturn = ReturnType<typeof useCheckoutCupon>;

export function useCheckoutCupon(options?: UseCheckoutCuponOptions) {
  const [codigo, setCodigo] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState<CuponAplicado | null>(null);
  const [ultimaValidacion, setUltimaValidacion] = useState<CuponValidacionResponse | null>(null);

  const mapItems = useCallback((items: CartItem[]): CuponValidationItem[] => {
    return items.map((item) => ({
      productoWebId: item.product.productoWebId ?? item.product.id,
      productoPadreId: item.product.productoPadreId ?? item.product.id,
      cantidad: item.quantity,
      precioUnitario: item.product.precioLista ?? item.product.precio ?? 0,
    }));
  }, []);

  const validateMutation = useMutation({
    mutationFn: (params: { codigo: string; items: CuponValidationItem[] }) =>
      validarCupon({ ...params, formaPago: 'mercado_pago' }),
    onSuccess: (data) => {
      setUltimaValidacion(data);
      if (data.aplicable && data.cupon) {
        const cupon: CuponAplicado = {
          id: data.cupon.id,
          codigo: data.cupon.codigo,
          nombre: data.cupon.nombre,
          tipoDescuento: data.cupon.tipoDescuento,
          valorDescuento: data.cupon.valorDescuento,
          descuentoTotal: data.descuentoTotal,
        };
        setCuponAplicado(cupon);
        useCartStore.getState().setCuponAplicado(cupon);
        options?.onSuccess?.(cupon);
      }
    },
    onError: options?.onError,
  });

  const validate = useCallback(
    async (items: CartItem[]) => {
      if (!codigo.trim()) {
        setCuponAplicado(null);
        setUltimaValidacion(null);
        useCartStore.getState().setCuponAplicado(null);
        return;
      }
      const itemsForValidation = mapItems(items);
      await validateMutation.mutateAsync({ codigo, items: itemsForValidation });
    },
    [codigo, mapItems, validateMutation]
  );

  const clearCupon = useCallback(() => {
    setCodigo('');
    setCuponAplicado(null);
    setUltimaValidacion(null);
    useCartStore.getState().setCuponAplicado(null);
  }, []);

  const isValidForCheckout = useCallback(() => {
    return (
      !!cuponAplicado &&
      !!ultimaValidacion &&
      ultimaValidacion.aplicable &&
      codigo === ultimaValidacion.cupon?.codigo
    );
  }, [cuponAplicado, ultimaValidacion, codigo]);

  const getCuponForCheckout = useCallback(() => {
    if (!isValidForCheckout()) return undefined;
    return cuponAplicado?.codigo;
  }, [isValidForCheckout, cuponAplicado]);

  /** Revalida si hace falta y devuelve el código listo para el POST de checkout. */
  const resolveForCheckout = useCallback(
    async (items: CartItem[]): Promise<string | undefined> => {
      if (isValidForCheckout()) return cuponAplicado?.codigo;

      const code =
        cuponAplicado?.codigo?.trim() ||
        useCartStore.getState().cuponAplicado?.codigo?.trim() ||
        codigo.trim();
      if (!code) return undefined;

      const data = await validarCupon({
        codigo: code,
        items: mapItems(items),
        formaPago: 'mercado_pago',
      });

      if (!data.aplicable || !data.cupon) {
        throw new Error(data.mensaje || 'Cupón no aplicable');
      }

      const cupon: CuponAplicado = {
        id: data.cupon.id,
        codigo: data.cupon.codigo,
        nombre: data.cupon.nombre,
        tipoDescuento: data.cupon.tipoDescuento,
        valorDescuento: data.cupon.valorDescuento,
        descuentoTotal: data.descuentoTotal,
      };

      setCodigo(code);
      setUltimaValidacion(data);
      setCuponAplicado(cupon);
      useCartStore.getState().setCuponAplicado(cupon);
      options?.onSuccess?.(cupon);

      return cupon.codigo;
    },
    [isValidForCheckout, cuponAplicado, codigo, mapItems, options]
  );

  return {
    codigo,
    setCodigo,
    cuponAplicado,
    ultimaValidacion,
    isValidating: validateMutation.isPending,
    isError: !!validateMutation.error,
    errorMessage: validateMutation.error?.message,
    validate,
    clearCupon,
    isValidForCheckout,
    getCuponForCheckout,
    resolveForCheckout,
    appliedDiscount: cuponAplicado?.descuentoTotal ?? 0,
  };
}