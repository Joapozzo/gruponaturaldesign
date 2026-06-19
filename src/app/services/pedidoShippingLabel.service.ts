import { apiClient } from '@/lib/apiClient';
import {
  pedidoLabelAvailabilitySchema,
  type PedidoLabelAvailability,
} from '@/app/validation/pedidoShippingLabel.schema';

export async function fetchPedidoLabelAvailability(
  pedidoId: number
): Promise<PedidoLabelAvailability> {
  const res = await apiClient.get<PedidoLabelAvailability>(
    `/admin/pedidos/${pedidoId}/etiqueta/disponibilidad`
  );
  if (!res.success || res.data === undefined) {
    throw new Error(res.message || res.error || 'No se pudo consultar la etiqueta');
  }
  const parsed = pedidoLabelAvailabilitySchema.safeParse(res.data);
  if (!parsed.success) {
    throw new Error('Respuesta de disponibilidad de etiqueta inválida');
  }
  return parsed.data;
}

export async function downloadPedidoLabelFile(
  pedidoId: number
): Promise<{ blob: Blob; fileName: string }> {
  const { blob, fileName: headerName } = await apiClient.getBlob(
    `/admin/pedidos/${pedidoId}/etiqueta`
  );
  const fallback = `etiqueta-pedido-${pedidoId}.pdf`;
  return {
    blob,
    fileName: headerName ?? fallback,
  };
}
