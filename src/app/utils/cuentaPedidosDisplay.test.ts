import { describe, it, expect } from 'vitest';
import {
  formatPedidoFechaPerfil,
  mapFormaPagoLabel,
  mapSyncStatusHint,
  ORDER_STATUS_STYLES,
} from './cuentaPedidosDisplay';

describe('cuentaPedidosDisplay', () => {
  it('formatPedidoFechaPerfil formatea fecha ISO', () => {
    const s = formatPedidoFechaPerfil('2024-06-15T12:00:00.000Z');
    expect(s.length).toBeGreaterThan(0);
    expect(s).toMatch(/2024/);
  });

  it('mapFormaPagoLabel traduce formas conocidas', () => {
    expect(mapFormaPagoLabel(null)).toBeNull();
    expect(mapFormaPagoLabel('mercado_pago')).toBe('Mercado Pago');
    expect(mapFormaPagoLabel('transferencia')).toBe('Transferencia');
    expect(mapFormaPagoLabel('otro')).toBe('otro');
  });

  it('mapSyncStatusHint sin sfactory id', () => {
    expect(mapSyncStatusHint('pending', null)).toBe('Procesando en sistema');
    expect(mapSyncStatusHint('error', null)).toBe('Demora al sincronizar');
    expect(mapSyncStatusHint('synced', 99)).toBeNull();
  });

  it('ORDER_STATUS_STYLES cubre estados clave', () => {
    expect(ORDER_STATUS_STYLES.confirmado).toContain('blue');
    expect(ORDER_STATUS_STYLES.cancelado).toBeDefined();
  });
});
