import type { CustomerOrderStatus } from '@/app/validation/cuentaPedidos.schema';
import type { PedidoSyncStatus } from '@/app/types/pedido.types';

export const ORDER_STATUS_STYLES: Record<CustomerOrderStatus, string> = {
  pendiente_pago: 'bg-amber-50 text-amber-800',
  pendiente_confirmacion: 'bg-amber-50 text-amber-800',
  confirmado: 'bg-blue-50 text-blue-800',
  en_preparacion: 'bg-indigo-50 text-indigo-800',
  enviado: 'bg-purple-50 text-purple-800',
  entregado: 'bg-green-50 text-green-800',
  cancelado: 'bg-gray-100 text-gray-600',
  fallido: 'bg-red-50 text-red-700',
  vencido: 'bg-gray-100 text-gray-500',
};

export const SUBTLE_STATUS_STYLES: Record<CustomerOrderStatus, string> = {
  pendiente_pago: 'bg-amber-50/80 text-amber-700',
  pendiente_confirmacion: 'bg-amber-50/80 text-amber-700',
  confirmado: 'bg-blue-50/80 text-blue-700',
  en_preparacion: 'bg-indigo-50/80 text-indigo-700',
  enviado: 'bg-purple-50/80 text-purple-700',
  entregado: 'bg-green-50/80 text-green-700',
  cancelado: 'bg-gray-50 text-gray-500',
  fallido: 'bg-red-50/70 text-red-600',
  vencido: 'bg-gray-50 text-gray-500',
};

export function formatPedidoFechaPerfil(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function mapFormaPagoLabel(forma: string | null): string | null {
  if (!forma) return null;
  if (forma === 'mercado_pago') return 'Mercado Pago';
  if (forma === 'transferencia') return 'Transferencia';
  if (forma === 'efectivo') return 'Efectivo';
  return forma;
}

export function mapSyncStatusHint(
  syncStatus: PedidoSyncStatus,
  sfactoryOrdenId: number | null
): string | null {
  if (sfactoryOrdenId != null) return null;
  if (syncStatus === 'pending') return 'Procesando en sistema';
  if (syncStatus === 'error') return 'Demora al sincronizar';
  if (syncStatus === 'conflict') return 'Revisión en sistema';
  return null;
}
