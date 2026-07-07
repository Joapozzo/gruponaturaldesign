import type { EstadoPedido, PedidoSyncStatus } from '@/app/types/pedido.types';

export type TipoCliente = 'minorista' | 'mayorista' | 'distribuidor' | string;

export type { EstadoPedido, PedidoSyncStatus };

export type FormaEnvio = string;

export interface PeriodoVentasTipoCliente {
  tipoCliente: TipoCliente;
  ventasTotales: string;
  cantidadPedidos: number;
  ticketPromedio: string | null;
}

export interface PeriodMetricasDashboard {
  pedidosNuevos: number;
  ventasTotales: string;
  cantidadPedidosVentas: number;
  ticketPromedio: string | null;
  porTipoCliente: PeriodoVentasTipoCliente[];
}

export interface DashPedidoSnippet {
  id: number;
  clienteNombre: string;
  clienteEmail: string;
  total: string;
  estadoInterno: EstadoPedido;
  estadoErp: string | null;
  sfactoryEstado: string | null;
  syncStatus: PedidoSyncStatus;
  formaEnvio: FormaEnvio | null;
  fechaPedido: string;
  expiresAt: string | null;
}

export interface DashStockCriticoRow {
  id: number;
  nombre: string;
  sfactoryCodigo: string;
  productoPadreId: number;
  stockCache: string | null;
  precioCache: string | null;
}

export interface DashboardKpisQueryInput {
  fechaDesde?: string;
  fechaHasta?: string;
  compare?: boolean;
  segmentarTipoCliente?: boolean;
}

export interface DashboardSerieQueryInput {
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface DashboardAlertasQueryInput {
  limitePendientesConfirmacion?: number;
  limiteSfactoryIssues?: number;
  limitePagoPendienteAntiguo?: number;
  horasPagoPendienteMin?: number;
  limiteProximosAVencer?: number;
  horasProximoVencimiento?: number;
}

export interface DashboardRecientesQueryInput {
  limit?: number;
}

export interface DashboardStockCriticoQueryInput {
  limit?: number;
  maxStock?: number;
  incluirSinStockSync?: boolean;
}

export interface DashboardFullQueryInput {
  fechaDesde?: string;
  fechaHasta?: string;
  serieFechaDesde?: string;
  serieFechaHasta?: string;
  compare?: boolean;
  segmentarTipoCliente?: boolean;
  limitePendientesConfirmacion?: number;
  limiteSfactoryIssues?: number;
  limitePagoPendienteAntiguo?: number;
  horasPagoPendienteMin?: number;
  limitRecientes?: number;
  limitStockCritico?: number;
  maxStockCritico?: number;
  incluirSinStockSync?: boolean;
}

export interface DashboardKpisResponse {
  generatedAt: string;
  rangoActual: { desde: string; hasta: string };
  rangoComparacion?: { desde: string; hasta: string };
  snapshot: { pendientesConfirmacion: number; erroresSfactory: number };
  metricas: {
    actual: PeriodMetricasDashboard;
    anterior?: PeriodMetricasDashboard;
  };
}

export interface DashboardSeriePunto {
  fecha: string;
  ventasTotales: string;
  cantidadPedidos: number;
}

export interface DashboardSerieResponse {
  generatedAt: string;
  rangoSerie: { desde: string; hasta: string };
  puntos: DashboardSeriePunto[];
}

export interface DashboardAlertasResponse {
  generatedAt: string;
  horasPagoPendienteMin: number;
  horasProximoVencimiento?: number;
  pendientesConfirmacion: DashPedidoSnippet[];
  sfactoryIssues: DashPedidoSnippet[];
  pagoPendienteAntiguo: DashPedidoSnippet[];
  proximosAVencer: DashPedidoSnippet[];
}

export interface DashboardRecientesResponse {
  generatedAt: string;
  items: DashPedidoSnippet[];
}

export interface DashboardStockCriticoResponse {
  generatedAt: string;
  maxStock: number;
  items: DashStockCriticoRow[];
}

export interface DashboardFullResponse {
  generatedAt: string;
  kpis: DashboardKpisResponse;
  serieVentas: DashboardSerieResponse;
  alertas: DashboardAlertasResponse;
  pedidosRecientes: DashboardRecientesResponse;
  stockCritico: DashboardStockCriticoResponse;
}
