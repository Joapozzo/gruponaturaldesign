export type AdminNotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export type AdminNotificationType =
  | 'pedido.created'
  | 'pedido.payment_approved'
  | 'pedido.status_changed'
  | 'pedido.confirmation_required'
  | 'pedido.sync_failed'
  | 'pedido.sync_recovered'
  | 'pedido.cancelled'
  | 'pedido.expired'
  | 'stock.critical';

export interface AdminNotificationPayload {
  pedidoId?: number;
  estadoAnterior?: string | null;
  estadoNuevo?: string | null;
  syncStatus?: string | null;
  sfactoryOrdenId?: number | null;
  total?: string | number | null;
  clienteNombre?: string | null;
  [key: string]: unknown;
}

export interface AdminNotification {
  id: number;
  empresaId: number;
  type: AdminNotificationType;
  severity: AdminNotificationSeverity;
  title: string;
  message: string;
  entityType: string | null;
  entityId: string | null;
  payload: AdminNotificationPayload | null;
  readAt: string | null;
  createdAt: string;
}

export interface AdminNotificationListParams {
  limit?: number;
  unreadOnly?: boolean;
}

