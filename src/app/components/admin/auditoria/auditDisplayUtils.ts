import type { AuditLogItem } from '@/app/types/audit.types';

export const ENTITY_LABELS: Record<string, string> = {
  producto_padre: 'Producto padre',
  producto_web: 'Producto web',
  producto_precio: 'Precio',
  producto_imagen: 'Imagen',
  cliente: 'Cliente',
  pedido: 'Pedido',
  pedido_item: 'Item pedido',
  usuario: 'Usuario',
  sesion: 'Sesión',
  rubro: 'Rubro',
  subrubro: 'Subrubro',
  empresa: 'Empresa',
  regla_parseo: 'Regla parseo',
  campo_personalizado: 'Campo personalizado',
  sync: 'Sync',
  otro: 'Otro',
};

export const ACTION_LABELS: Record<string, string> = {
  CREATE: 'Crear',
  UPDATE: 'Actualizar',
  DELETE: 'Eliminar',
};

export function formatAuditDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });
  } catch {
    return iso;
  }
}

export function getAuditSummaryPreview(item: AuditLogItem): string {
  if (item.summary) return item.summary;

  const oldV = item.oldValues;
  const newV = item.newValues;

  if (item.action === 'DELETE' && oldV) return 'Registro eliminado';

  if (newV && typeof newV === 'object' && !Array.isArray(newV)) {
    const parts = Object.entries(newV as Record<string, unknown>)
      .filter(([key]) => !['createdAt', 'updatedAt', 'empresaId'].includes(key))
      .slice(0, 3)
      .map(([key, value]) => `${key}: ${String(value)}`);
    return parts.join('; ') || '—';
  }

  return '—';
}

export function hasAuditDetail(item: AuditLogItem): boolean {
  if (item.summary) return true;
  if (item.oldValues != null || item.newValues != null) return true;
  return false;
}
