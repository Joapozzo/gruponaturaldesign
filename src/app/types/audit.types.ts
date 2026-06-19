export type AuditEntity =
  | 'producto_padre'
  | 'producto_web'
  | 'producto_precio'
  | 'producto_imagen'
  | 'cliente'
  | 'pedido'
  | 'pedido_item'
  | 'usuario'
  | 'sesion'
  | 'rubro'
  | 'subrubro'
  | 'empresa'
  | 'regla_parseo'
  | 'campo_personalizado'
  | 'sync'
  | 'otro';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface AuditLogItem {
  id: number;
  empresaId: number | null;
  entity: AuditEntity;
  entityId: string | null;
  action: AuditAction;
  oldValues: unknown;
  newValues: unknown;
  /** Resumen legible del cambio (ej. "Se despublicó el producto", "publicado: true → false") */
  summary?: string | null;
  userId: number | null;
  userEmail: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  method: string | null;
  path: string | null;
  createdAt: string;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  entity?: AuditEntity;
  userId?: number;
  userEmail?: string;
  dateFrom?: string;
  dateTo?: string;
  action?: AuditAction;
  method?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
