import { describe, it, expect } from 'vitest';
import { formatPedidoEntregaDisplay, mapFormaPagoLabel } from './pedidoEntregaDisplay';
import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';

function pedido(partial: Partial<AdminPedidoDetalle>): AdminPedidoDetalle {
  return {
    id: 1,
    empresaId: 1,
    estadoInterno: 'confirmado',
    syncStatus: 'synced',
    clienteNombre: 'Cliente',
    clienteEmail: 'c@gmail.com',
    subtotal: 100,
    total: 100,
    fechaPedido: '2024-01-01',
    items: [],
    ...partial,
  };
}

describe('pedidoEntregaDisplay', () => {
  it('detecta retiro en local sin envío postal', () => {
    const d = formatPedidoEntregaDisplay(
      pedido({ costoEnvio: 0, formaEnvio: null, checkoutEnvioSnapshot: null })
    );
    expect(d.tipoLabel).toBe('Retiro en local');
    expect(d.costoEnvioLabel).toBe('Sin envío');
  });

  it('usa snapshot Andreani domicilio', () => {
    const d = formatPedidoEntregaDisplay(
      pedido({
        costoEnvio: 1500,
        checkoutEnvioSnapshot: {
          provider: 'andreani',
          deliveryType: 'homeDelivery',
          cpDestino: '5000',
          address: { street: 'Av Siempre Viva', city: 'Córdoba', zipCode: '5000' },
        },
      })
    );
    expect(d.tipoLabel).toContain('Andreani');
    expect(d.tipoLabel).toContain('domicilio');
    expect(d.detalle).toBe('CP 5000');
  });

  it('mapFormaPagoLabel con fallback', () => {
    expect(mapFormaPagoLabel(undefined)).toBe('—');
    expect(mapFormaPagoLabel('mercado_pago')).toBe('Mercado Pago');
  });
});
