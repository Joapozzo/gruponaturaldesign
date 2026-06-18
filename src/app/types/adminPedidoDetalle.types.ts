import type { EstadoPedido, PedidoItem, PedidoSyncStatus } from '@/app/types/pedido.types';
import type { PedidoLabelAvailability } from '@/app/validation/pedidoShippingLabel.schema';

/** Respuesta de GET /admin/pedidos/:id (serialización JSON de Prisma). */
export interface AdminPedidoClienteDetalle {
  id: number;
  razonSocial?: string | null;
  sfactoryId?: number | null;
}

export interface AdminPedidoEnvioLogDetalle {
  id: number;
  operacion: string;
  provider: string;
  exitoso: boolean;
  error?: string | null;
  httpStatus?: number | null;
  creadoAt: string;
}

export interface AdminPedidoDetalle {
  id: number;
  empresaId: number;
  usuarioId?: number | null;
  clienteId?: number | null;
  sfactoryOrdenId?: number | null;
  sfactoryExternalOrderId?: string | null;
  sfactoryEstado?: string | null;
  estadoInterno: EstadoPedido;
  estadoErp?: string | null;
  syncStatus: PedidoSyncStatus;
  syncError?: string | null;
  sfactoryError?: string | null;
  tipoCliente?: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string | null;
  clienteDireccion?: string | null;
  refCliente?: string | null;
  numOrdenCompra?: string | null;
  entregaCp?: string | null;
  entregaNotas?: string | null;
  subtotal: string | number;
  descuento?: string | number;
  iva?: string | number;
  total: string | number;
  costoEnvio?: string | number;
  formaPago?: string | null;
  mercadoPagoStatus?: string | null;
  expiresAt?: string | null;
  formaEnvio?: string | null;
  andreaniSucursalId?: string | null;
  andreaniSucursalDescripcion?: string | null;
  andreaniNumeroEnvio?: string | null;
  correoTrackingNumber?: string | null;
  checkoutEnvioSnapshot?: unknown;
  observaciones?: string | null;
  trackingUrl?: string | null;
  /** Calculado en GET /admin/pedidos/:id */
  shippingLabel?: PedidoLabelAvailability | null;
  cuponCodigoSnapshot?: string | null;
  cuponDescuentoTotal?: string | number;
  fechaPedido: string;
  items: PedidoItem[];
  cliente?: AdminPedidoClienteDetalle | null;
  envioLogs?: AdminPedidoEnvioLogDetalle[];
}
