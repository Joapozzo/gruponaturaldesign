import { describe, it, expect } from 'vitest';
import { resolvePedidoShippingTracking } from './pedidoShippingTracking';
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

describe('resolvePedidoShippingTracking', () => {
  it('prioriza número Andreani cuando el snapshot indica andreani', () => {
    const r = resolvePedidoShippingTracking(
      pedido({
        checkoutEnvioSnapshot: { provider: 'andreani' },
        andreaniNumeroEnvio: ' AND123 ',
        correoTrackingNumber: 'COR999',
      })
    );
    expect(r.shippingProvider).toBe('andreani');
    expect(r.trackingNumber).toBe('AND123');
  });

  it('usa formaEnvio cuando no hay snapshot', () => {
    const r = resolvePedidoShippingTracking(
      pedido({
        formaEnvio: 'correo_domicilio',
        correoTrackingNumber: 'PAQ456',
      })
    );
    expect(r.shippingProvider).toBe('correo');
    expect(r.trackingNumber).toBe('PAQ456');
  });

  it('expone trackingUrl del pedido', () => {
    const r = resolvePedidoShippingTracking(
      pedido({ trackingUrl: ' https://track.example/1 ' })
    );
    expect(r.trackingUrl).toBe('https://track.example/1');
  });
});
