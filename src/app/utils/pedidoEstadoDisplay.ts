import type { EstadoPedido } from '@/app/types/pedido.types';

export type PedidoBadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'default';

const ADMIN_ESTADO_LABELS: Record<EstadoPedido, string> = {
  carrito: 'Carrito',
  pendiente_pago: 'Falta el pago',
  pendiente_confirmacion: 'Pendiente confirmación',
  procesando: 'Procesando',
  confirmado: 'Confirmado',
  fallido: 'Fallido',
  despachado: 'Despachado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
  vencido: 'Vencido',
};

const ESTADO_BADGE_VARIANT: Record<EstadoPedido, PedidoBadgeVariant> = {
  carrito: 'default',
  pendiente_pago: 'warning',
  pendiente_confirmacion: 'warning',
  procesando: 'info',
  confirmado: 'success',
  fallido: 'danger',
  despachado: 'info',
  entregado: 'success',
  cancelado: 'danger',
  vencido: 'default',
};

export interface EstadoReferenciaRow {
  nombre: string;
  descripcion: string;
  estadoKey?: EstadoPedido;
}

export const ESTADOS_ECOMMERCE_REF: EstadoReferenciaRow[] = [
  {
    estadoKey: 'pendiente_pago',
    nombre: 'Falta el pago',
    descripcion:
      'Cliente inició checkout con Mercado Pago y aún no pagó. No se puede confirmar manualmente; se procesa solo cuando MP aprueba el pago.',
  },
  {
    estadoKey: 'pendiente_confirmacion',
    nombre: 'Pendiente confirmación',
    descripcion:
      'Transferencia, efectivo o pedido manual: el admin debe verificar que el pago fue acreditado antes de confirmar.',
  },
  {
    estadoKey: 'procesando',
    nombre: 'Procesando',
    descripcion: 'Reservando stock y creando la orden en SFactory.',
  },
  {
    estadoKey: 'confirmado',
    nombre: 'Confirmado',
    descripcion: 'Pago acreditado o aprobado por admin; orden creada en SFactory.',
  },
  {
    estadoKey: 'fallido',
    nombre: 'Fallido',
    descripcion: 'Pago rechazado por Mercado Pago o error al crear la orden en SFactory.',
  },
  {
    estadoKey: 'cancelado',
    nombre: 'Cancelado',
    descripcion: 'Rechazado por admin o vencido sin pago (checkout web).',
  },
  {
    estadoKey: 'vencido',
    nombre: 'Vencido',
    descripcion: 'Pedido cargado desde admin que expiró sin confirmación.',
  },
  {
    estadoKey: 'despachado',
    nombre: 'Despachado / Entregado',
    descripcion: 'Estados logísticos avanzados, sincronizados desde el ERP.',
  },
];

export const ESTADOS_SFACTORY_REF: Array<EstadoReferenciaRow & { codigo: string }> = [
  {
    codigo: '1',
    nombre: 'Pendiente',
    descripcion: 'Orden en ERP en cotización. Se puede aprobar o cancelar desde admin.',
  },
  {
    codigo: '5',
    nombre: 'En curso',
    descripcion: 'Venta en proceso en el ERP.',
  },
  {
    codigo: '2',
    nombre: 'Confirmado',
    descripcion: 'Venta confirmada en SFactory.',
  },
  {
    codigo: '3',
    nombre: 'Despachado',
    descripcion: 'Pedido despachado en el ERP.',
  },
  {
    codigo: '4',
    nombre: 'Cancelado',
    descripcion: 'Orden cancelada en SFactory.',
  },
];

export function mapEstadoPedidoAdminLabel(estado: EstadoPedido): string {
  return ADMIN_ESTADO_LABELS[estado] ?? estado;
}

export function mapEstadoPedidoBadgeVariant(estado: EstadoPedido): PedidoBadgeVariant {
  return ESTADO_BADGE_VARIANT[estado] ?? 'default';
}

export function mapSfactoryEstadoBadgeVariant(
  estado: string
): PedidoBadgeVariant {
  const variantMap: Record<string, PedidoBadgeVariant> = {
    '1': 'warning',
    '2': 'success',
    '3': 'info',
    '4': 'danger',
    '5': 'warning',
  };
  return variantMap[estado] ?? 'default';
}

export function mapMercadoPagoStatusLabel(status: string | null | undefined): string | null {
  if (!status) return null;
  const labels: Record<string, string> = {
    approved: 'Aprobado',
    pending: 'Pendiente',
    in_process: 'En proceso',
    authorized: 'Autorizado',
    rejected: 'Rechazado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
    charged_back: 'Contracargo',
  };
  return labels[status] ?? status;
}
