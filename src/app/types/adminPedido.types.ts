import type { PaginationInfo } from '@/components/ui/Table';
import type { EstadoPedido, Pedido, PedidoSyncStatus, SFactoryPedido } from '@/app/types/pedido.types';

export type PedidoOrigenFilter = 'all' | 'ecommerce' | 'sfactory_erp';

export type AdminPedidoRow = {
  /** Clave estable para React (evita colisión web#25 vs sfactory#25). */
  key: string;
  source: 'web' | 'sfactory';
  id: number;
  numero: string;
  cliente: string;
  clienteSub?: string;
  /** ISO o YYYY-MM-DD para ordenar. */
  fecha: string;
  total: number;
  estadoLabel: string;
  titulo?: string | null;
  web?: Pedido;
  sfactory?: SFactoryPedido;
};

export type AdminPedidosMergedPage = {
  data: AdminPedidoRow[];
  pagination: PaginationInfo;
};
