'use client';

import { apiClient } from '@/lib/apiClient';
import {
  cuentaPedidoDetailSchema,
  cuentaPedidosListResponseSchema,
  type CuentaPedidoDetail,
  type CuentaPedidosListResponse,
} from '@/app/validation/cuentaPedidos.schema';

const DEFAULT_LIMIT = 10;

export async function getMisPedidos(params?: {
  page?: number;
  limit?: number;
}): Promise<CuentaPedidosListResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(params?.page ?? 1));
  searchParams.set('limit', String(params?.limit ?? DEFAULT_LIMIT));

  const res = await apiClient.getPaginated<unknown>(
    `/cuenta/pedidos?${searchParams.toString()}`
  );

  if (!res.success) {
    throw new Error(res.message || res.error || 'Error al obtener pedidos');
  }

  const parsed = cuentaPedidosListResponseSchema.safeParse({
    data: res.data ?? [],
    pagination: res.pagination,
  });

  if (!parsed.success) {
    throw new Error('Respuesta de pedidos inválida');
  }

  return parsed.data;
}

export async function getMiPedido(id: number): Promise<CuentaPedidoDetail> {
  const res = await apiClient.get<unknown>(`/cuenta/pedidos/${id}`);

  if (!res.success || res.data === undefined) {
    throw new Error(res.message || res.error || 'Error al obtener pedido');
  }

  const parsed = cuentaPedidoDetailSchema.safeParse(res.data);
  if (!parsed.success) {
    throw new Error('Respuesta de pedido inválida');
  }

  return parsed.data;
}
