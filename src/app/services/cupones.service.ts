import { apiClient } from '@/lib/apiClient';
import type { CuponValidationItem, CuponValidacionResponse } from '@/app/types/cupones';

export interface ValidarCuponParams {
  codigo: string;
  items: CuponValidationItem[];
  formaPago?: 'transferencia' | 'tarjeta' | 'mercado_pago';
}

export async function validarCupon(params: ValidarCuponParams): Promise<CuponValidacionResponse> {
  const subtotal =
    params.items.reduce((sum, i) => sum + i.precioUnitario * i.cantidad, 0);

  const res = await apiClient.post<CuponValidacionResponse>('/cupones/validar', {
    ...params,
    subtotal,
  });

  if (!res.success || res.data == null) {
    throw new Error(res.message || res.error || 'Error al validar cupón');
  }

  const data = res.data;
  if (!data.aplicable) {
    throw new Error(data.mensaje || 'Cupón no aplicable');
  }

  return data;
}