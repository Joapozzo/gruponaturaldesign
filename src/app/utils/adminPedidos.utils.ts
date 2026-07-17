import type { PaginationInfo } from '@/components/ui/Table';
import type {
  AdminPedidoRow,
  AdminPedidosMergedPage,
  PedidoOrigenFilter,
} from '@/app/types/adminPedido.types';
import { mapEstadoPedidoLabel } from '@/app/utils/dashboard.utils';
import { computePedidoTotalNeto } from '@/app/utils/pedidoTotals';
import type {
  EstadoPedido,
  Pedido,
  PedidoSyncStatus,
  SFactoryPedido,
} from '@/app/types/pedido.types';

/** Debe coincidir con `pedidoListQuerySchema.limit.max` en API (100). */
export const MERGE_FETCH_LIMIT = 100;

const ESTADOS_WEB = new Set<string>([
  'carrito',
  'pendiente_pago',
  'pendiente_confirmacion',
  'procesando',
  'confirmado',
  'fallido',
  'despachado',
  'entregado',
  'cancelado',
  'vencido',
]);

export function formatWebPedidoNumero(p: Pedido): string {
  if (p.sfactoryExternalOrderId?.trim()) return p.sfactoryExternalOrderId.trim();
  return `WEB-${p.id}`;
}

export function parseEstadoUrlParam(
  value: string | null
): { estadoWeb?: EstadoPedido; estadoSfactory?: string } {
  if (!value) return {};
  if (ESTADOS_WEB.has(value)) return { estadoWeb: value as EstadoPedido };
  if (/^[1-5]$/.test(value)) return { estadoSfactory: value };
  return {};
}

export function parseSyncStatusUrlParam(value: string | null): PedidoSyncStatus[] {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is PedidoSyncStatus =>
      s === 'pending' || s === 'synced' || s === 'error' || s === 'conflict'
    );
}

export function normalizeWebPedido(p: Pedido): AdminPedidoRow {
  return {
    key: `web-${p.id}`,
    source: 'web',
    id: p.id,
    numero: formatWebPedidoNumero(p),
    cliente: p.clienteNombre,
    clienteSub: p.clienteEmail,
    fecha: p.fechaPedido,
    total: computePedidoTotalNeto(p),
    estadoLabel: mapEstadoPedidoLabel(p.estadoInterno),
    web: p,
  };
}

export function normalizeSfactoryPedido(p: SFactoryPedido): AdminPedidoRow {
  return {
    key: `sfactory-${p.id}`,
    source: 'sfactory',
    id: p.id,
    numero: p.numero?.trim() || `PE-${p.id}`,
    cliente: p.cliente,
    clienteSub: p.ref_cliente ? `Ref: ${p.ref_cliente}` : undefined,
    fecha: p.fecha,
    total: Number(p.total),
    estadoLabel: p.estado_d || `Estado ${p.estado}`,
    titulo: p.titulo,
    sfactory: p,
  };
}

export function mergePedidosLists(web: Pedido[], sfactory: SFactoryPedido[]): AdminPedidoRow[] {
  const webRows = web.map(normalizeWebPedido);
  const linkedSfactoryIds = new Set(
    web.map((p) => p.sfactoryOrdenId).filter((id): id is number => id != null)
  );
  const sfactoryOnly = sfactory
    .filter((p) => !linkedSfactoryIds.has(p.id))
    .map(normalizeSfactoryPedido);

  return [...webRows, ...sfactoryOnly].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

function matchesAdminPedidoSearch(row: AdminPedidoRow, q: string): boolean {
  const idStr = String(row.id);
  const haystack = [
    row.numero,
    idStr,
    `#${idStr}`,
    row.cliente,
    row.clienteSub,
    row.titulo,
  ]
    .filter(Boolean)
    .map((s) => s!.toLowerCase());

  return haystack.some((s) => s.includes(q));
}

export function filterMergedRowsBySearch(rows: AdminPedidoRow[], search: string): AdminPedidoRow[] {
  const q = search.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => matchesAdminPedidoSearch(row, q));
}

export function filterSfactoryBySearch(rows: SFactoryPedido[], search: string): SFactoryPedido[] {
  const q = search.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((p) =>
    matchesAdminPedidoSearch(normalizeSfactoryPedido(p), q)
  );
}

export function normalizeDateRange(
  desde: string,
  hasta: string,
  changed: 'desde' | 'hasta'
): { desde: string; hasta: string } {
  if (desde <= hasta) return { desde, hasta };
  return changed === 'hasta'
    ? { desde: hasta, hasta }
    : { desde, hasta: desde };
}

export function filterRowsByFechaRange(
  rows: AdminPedidoRow[],
  desde: string,
  hasta: string
): AdminPedidoRow[] {
  const from = new Date(`${desde}T00:00:00`).getTime();
  const to = new Date(`${hasta}T23:59:59.999`).getTime();
  if (Number.isNaN(from) || Number.isNaN(to)) return rows;
  return rows.filter((r) => {
    const t = new Date(r.fecha).getTime();
    return !Number.isNaN(t) && t >= from && t <= to;
  });
}

export function applyAdminPedidosFilters(
  rows: AdminPedidoRow[],
  opts: {
    origen: PedidoOrigenFilter;
    estadoSfactory?: string;
    syncStatuses: PedidoSyncStatus[];
  }
): AdminPedidoRow[] {
  let out = rows;

  if (opts.origen === 'ecommerce') {
    out = out.filter((r) => r.source === 'web');
  } else if (opts.origen === 'sfactory_erp') {
    out = out.filter((r) => r.source === 'sfactory');
  }

  if (opts.estadoSfactory) {
    out = out.filter((r) => r.source !== 'sfactory' || r.sfactory?.estado === opts.estadoSfactory);
  }

  if (opts.syncStatuses.length > 0) {
    out = out.filter((r) => {
      if (r.source !== 'web' || !r.web) return true;
      return opts.syncStatuses.includes(r.web.syncStatus);
    });
  }

  return out;
}

export function paginateAdminPedidos(
  rows: AdminPedidoRow[],
  page: number,
  limit: number
): AdminPedidosMergedPage {
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  return {
    data: rows.slice(start, start + limit),
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
}
