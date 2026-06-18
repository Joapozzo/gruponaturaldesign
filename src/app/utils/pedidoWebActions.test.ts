import { describe, expect, it } from 'vitest';
import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';
import { getWebPedidoActions } from '@/app/utils/pedidoWebActions';

function pedido(overrides: Partial<AdminPedidoDetalle> = {}): AdminPedidoDetalle {
  return {
    id: 1,
    empresaId: 1,
    estadoInterno: 'confirmado',
    syncStatus: 'pending',
    clienteNombre: 'Cliente Test',
    clienteEmail: 'cliente@test.com',
    subtotal: 100,
    total: 100,
    fechaPedido: '2026-06-18T00:00:00.000Z',
    items: [],
    formaEnvio: 'andreani_domicilio',
    ...overrides,
  };
}

describe('getWebPedidoActions envio postal', () => {
  it('muestra generar envio cuando no hay tracking', () => {
    const actions = getWebPedidoActions(pedido());

    expect(actions.canCrearEnvioPostal).toBe(true);
    expect(actions.crearEnvioPostalLabel).toBe('Generar envío en carrier');
  });

  it('oculta alta de carrier cuando ya existe tracking', () => {
    const actions = getWebPedidoActions(
      pedido({
        checkoutEnvioSnapshot: { provider: 'andreani' },
        andreaniNumeroEnvio: 'AND-1',
      })
    );

    expect(actions.canCrearEnvioPostal).toBe(false);
  });

  it('usa label de reintento si hubo fallo de creacion previo', () => {
    const actions = getWebPedidoActions(
      pedido({
        envioLogs: [
          {
            id: 1,
            operacion: 'create_order_after',
            provider: 'correo',
            exitoso: false,
            error: 'sin tracking',
            httpStatus: 502,
            creadoAt: '2026-06-18T00:00:00.000Z',
          },
        ],
      })
    );

    expect(actions.canCrearEnvioPostal).toBe(true);
    expect(actions.crearEnvioPostalLabel).toBe('Reintentar generación de envío');
  });
});
