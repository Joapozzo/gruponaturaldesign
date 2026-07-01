import { describe, it, expect } from 'vitest';
import {
  formatWebPedidoNumero,
  parseEstadoUrlParam,
  parseSyncStatusUrlParam,
  mergePedidosLists,
  filterSfactoryBySearch,
  filterMergedRowsBySearch,
  paginateAdminPedidos,
  applyAdminPedidosFilters,
} from './adminPedidos.utils';
import type { AdminPedidoRow } from '@/app/types/adminPedido.types';
import type { Pedido, SFactoryPedido } from '@/app/types/pedido.types';

function webPedido(partial: Partial<Pedido> & Pick<Pedido, 'id'>): Pedido {
  return {
    estadoInterno: 'confirmado',
    syncStatus: 'synced',
    clienteNombre: 'A',
    clienteEmail: 'a@gmail.com',
    total: 100,
    fechaPedido: '2024-06-01T10:00:00Z',
    ...partial,
  } as Pedido;
}

describe('adminPedidos.utils', () => {
  it('formatWebPedidoNumero prioriza sfactory external id', () => {
    expect(formatWebPedidoNumero(webPedido({ id: 5, sfactoryExternalOrderId: ' EXT-1 ' }))).toBe(
      'EXT-1'
    );
    expect(formatWebPedidoNumero(webPedido({ id: 5 }))).toBe('WEB-5');
  });

  it('parseEstadoUrlParam distingue web y sfactory', () => {
    expect(parseEstadoUrlParam('confirmado')).toEqual({ estadoWeb: 'confirmado' });
    expect(parseEstadoUrlParam('3')).toEqual({ estadoSfactory: '3' });
    expect(parseEstadoUrlParam('invalid')).toEqual({});
  });

  it('parseSyncStatusUrlParam filtra valores válidos', () => {
    expect(parseSyncStatusUrlParam('pending,error,bad')).toEqual(['pending', 'error']);
    expect(parseSyncStatusUrlParam(null)).toEqual([]);
  });

  it('mergePedidosLists excluye sfactory ya vinculados', () => {
    const web = [webPedido({ id: 1, sfactoryOrdenId: 10 })];
    const sf = [
      { id: 10, cliente: 'X', fecha: '2024-05-01', total: 50, estado: '1', estado_d: 'Ok' },
      { id: 11, cliente: 'Y', fecha: '2024-07-01', total: 60, estado: '1', estado_d: 'Ok' },
    ] as unknown as SFactoryPedido[];
    const merged = mergePedidosLists(web, sf);
    expect(merged).toHaveLength(2);
    expect(merged.some((r) => r.key === 'sfactory-10')).toBe(false);
    expect(merged[0].key).toBe('sfactory-11');
  });

  it('filterSfactoryBySearch por numero y cliente', () => {
    const rows = [
      { id: 1, numero: 'PE-100', cliente: 'Acme', fecha: '2024-01-01', total: 1, estado: '1' },
    ] as unknown as SFactoryPedido[];
    expect(filterSfactoryBySearch(rows, 'acme')).toHaveLength(1);
    expect(filterSfactoryBySearch(rows, 'zzz')).toHaveLength(0);
  });

  it('filterMergedRowsBySearch por WEB-, #id y email', () => {
    const rows: AdminPedidoRow[] = [
      {
        key: 'web-5',
        source: 'web',
        id: 5,
        numero: 'WEB-5',
        cliente: 'Juan',
        clienteSub: 'juan@gmail.com',
        fecha: '2024-01-01',
        total: 100,
        estadoLabel: 'Ok',
      },
      {
        key: 'sfactory-10',
        source: 'sfactory',
        id: 10,
        numero: 'PE-10',
        cliente: 'Acme',
        fecha: '2024-01-01',
        total: 50,
        estadoLabel: 'Ok',
      },
    ];
    expect(filterMergedRowsBySearch(rows, 'WEB-5')).toHaveLength(1);
    expect(filterMergedRowsBySearch(rows, '#5')).toHaveLength(1);
    expect(filterMergedRowsBySearch(rows, 'juan@gmail.com')).toHaveLength(1);
    expect(filterMergedRowsBySearch(rows, 'PE-10')).toHaveLength(1);
    expect(filterMergedRowsBySearch(rows, 'zzz')).toHaveLength(0);
  });

  it('paginateAdminPedidos respeta limit y total', () => {
    const rows = Array.from({ length: 5 }, (_, i) => ({
      key: `w-${i}`,
      source: 'web' as const,
      id: i,
      numero: `W-${i}`,
      cliente: 'C',
      fecha: '2024-01-01',
      total: 1,
      estadoLabel: 'Ok',
    }));
    const page = paginateAdminPedidos(rows, 2, 2);
    expect(page.data).toHaveLength(2);
    expect(page.pagination.total).toBe(5);
    expect(page.pagination.page).toBe(2);
  });

  it('applyAdminPedidosFilters por origen ecommerce', () => {
    const rows = [
      { key: 'w-1', source: 'web' as const, id: 1, numero: 'W', cliente: 'C', fecha: '2024-01-01', total: 1, estadoLabel: 'Ok', web: webPedido({ id: 1 }) },
      { key: 's-1', source: 'sfactory' as const, id: 2, numero: 'S', cliente: 'C', fecha: '2024-01-01', total: 1, estadoLabel: 'Ok' },
    ];
    const filtered = applyAdminPedidosFilters(rows, {
      origen: 'ecommerce',
      syncStatuses: [],
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].source).toBe('web');
  });
});
