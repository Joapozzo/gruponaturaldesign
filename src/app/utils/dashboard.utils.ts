import type {
  DashPedidoSnippet,
  EstadoPedido,
  PedidoSyncStatus,
  FormaEnvio,
  DashboardAlertasResponse,
} from '@/app/types/dashboard.types';

export function toYmd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseYmd(ymd: string): Date {
  return new Date(`${ymd}T00:00:00.000Z`);
}

export function defaultDashboardRange(): { desde: string; hasta: string } {
  const hasta = toYmd(new Date());
  const desde = toYmd(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  return { desde, hasta };
}

export function formatRangoLabel(desde: string, hasta: string): string {
  const d = parseYmd(desde);
  const h = parseYmd(hasta);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return `${d.toLocaleDateString('es-AR', opts)} – ${h.toLocaleDateString('es-AR', opts)}`;
}

export function formatMoneyArs(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return '$ 0,00';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatInteger(value: number): string {
  return new Intl.NumberFormat('es-AR').format(value);
}

export function decimalStringToNumber(s: string): number {
  const n = parseFloat(s);
  return Number.isNaN(n) ? 0 : n;
}

export function pctDelta(
  actual: string | number,
  anterior?: string | number
): { absoluto: number; pct: number | null } {
  const a = decimalStringToNumber(String(actual));
  if (anterior === undefined) return { absoluto: a, pct: null };
  const ant = decimalStringToNumber(String(anterior));
  if (ant === 0) return { absoluto: a, pct: null };
  return {
    absoluto: a - ant,
    pct: ((a - ant) / ant) * 100,
  };
}

const ESTADO_LABELS: Record<string, string> = {
  pendiente_confirmacion: 'Pendiente confirmación',
  confirmado: 'Confirmado',
  procesando: 'Procesando',
  pendiente_pago: 'Falta el pago',
  fallido: 'Fallido',
  despachado: 'Despachado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
  vencido: 'Vencido',
  carrito: 'Carrito',
};

const SYNC_LABELS: Record<string, string> = {
  synced: 'Sincronizado',
  pending: 'Pendiente',
  error: 'Error',
  conflict: 'Conflicto',
};

const ENVIO_LABELS: Record<string, string> = {
  andreani_sucursal: 'Andreani · retiro en sucursal',
  andreani_domicilio: 'Andreani · envío a domicilio',
  correo_sucursal: 'Correo Argentino · retiro en sucursal',
  correo_domicilio: 'Correo Argentino · envío a domicilio',
};

export function mapEstadoPedidoLabel(estado: EstadoPedido): string {
  return ESTADO_LABELS[estado] ?? estado;
}

export { mapEstadoPedidoBadgeVariant } from '@/app/utils/pedidoEstadoDisplay';

export function mapSyncStatusLabel(status: PedidoSyncStatus): string {
  return SYNC_LABELS[status] ?? status;
}

export function mapFormaEnvioLabel(envio: FormaEnvio | null): string {
  if (!envio) return '—';
  return ENVIO_LABELS[envio] ?? envio;
}

export interface AlertasSummary {
  pendientesConfirmacion: number;
  sfactoryIssues: number;
  pagoPendienteAntiguo: number;
  total: number;
}

export function summarizeAlertas(data: DashboardAlertasResponse): AlertasSummary {
  const pendientesConfirmacion = data.pendientesConfirmacion.length;
  const sfactoryIssues = data.sfactoryIssues.length;
  const pagoPendienteAntiguo = data.pagoPendienteAntiguo.length;
  return {
    pendientesConfirmacion,
    sfactoryIssues,
    pagoPendienteAntiguo,
    total: pendientesConfirmacion + sfactoryIssues + pagoPendienteAntiguo,
  };
}

export function formatPedidoFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isVencido(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}
