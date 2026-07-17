import type { PaginationInfo } from '@/components/ui/Table';

export type EstadoPedido =
  | 'carrito'
  | 'pendiente_pago'
  | 'pendiente_confirmacion'
  | 'procesando'
  | 'confirmado'
  | 'fallido'
  | 'despachado'
  | 'entregado'
  | 'cancelado'
  | 'vencido';

export type PedidoSyncStatus = 'pending' | 'synced' | 'conflict' | 'error';

export interface PedidoItem {
  id: number;
  nombre: string;
  codigo: string;
  cantidad: string | number;
  precioUnitario: string | number;
  subtotal: string | number;
  talle?: string | null;
  color?: string | null;
  bordado?: boolean;
}

export interface Pedido {
  id: number;
  sfactoryOrdenId?: number | null;
  sfactoryExternalOrderId?: string | null;
  sfactoryEstado?: string | null;
  estadoInterno: EstadoPedido;
  estadoErp?: string | null;
  syncStatus: PedidoSyncStatus;
  syncError?: string | null;
  clienteNombre: string;
  clienteEmail: string;
  /** Bruto (subtotal + envío). El monto cobrado es total − descuento. */
  total: string | number;
  descuento?: string | number | null;
  cuponDescuentoTotal?: string | number | null;
  formaPago?: string | null;
  fechaPedido: string;
  sfactorySyncedAt?: string | null;
  sfactoryLastReadAt?: string | null;
  stockReservadoWeb: boolean;
  items?: PedidoItem[];
}

export interface PedidoQueryParams {
  page?: number;
  limit?: number;
  estado?: EstadoPedido;
  syncStatus?: PedidoSyncStatus;
  search?: string;
  desde?: string;
  hasta?: string;
  empresa_id?: number;
  comercial_id?: number;
}

export interface PedidoListResponse {
  data: Pedido[];
  pagination: PaginationInfo;
}

export interface SFactoryPedidoItem {
  sku: string;
  cantidad: number;
  precio?: number;
  descuento?: number;
  iva?: number;
  descripcion?: string;
  fecha_entrega?: string;
  especificaciones?: string;
  notas?: string;
}

export interface SFactoryPedidoCliente {
  nombre?: string;
  cuit?: string;
  email?: string;
  razon_social?: string;
  telefono?: string;
  movil?: string;
}

export interface SFactoryPedidoEntrega {
  provincia: string;
  localidad: string;
  direccion: string;
  cp: string;
  localidad_id?: number;
  notas?: string;
}

export interface SFactoryPedido {
  id: number;
  estado: string;
  estado_d: string;
  fecha: string;
  numero: string;
  titulo: string | null;
  observaciones: string | null;
  cliente: string;
  cliente_grupo: string | null;
  ref_cliente: string | null;
  num_orden_compra: string | null;
  fecha_entrega: string;
  hora_entrega: string;
  estado_entrega: number;
  estado_produccion: number;
  moneda: string;
  moneda_cotizacion: string;
  centro_costo: number;
  neto: string;
  total: string;
  facturado: string;
  pagado: string;
  saldo: string;
  a_facturar: string;
  comercial: string;
  empresa_id: number;
  sucursal: string | null;
  unidad_negocio: string | null;
  origen_venta: string | null;
  usuario_crea: string;
  fecha_alta: string;
  usuario_modifica: string | null;
  fecha_modifica: string | null;
}

export interface SFactoryPedidoListResponse {
  data: SFactoryPedido[];
  pagination: PaginationInfo;
}
