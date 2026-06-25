import { describe, it, expect } from 'vitest';
import {
  buildEfectivoProofMessage,
  buildPaymentProofMessage,
  DEFAULT_TIENDA_CONFIG_PUBLIC,
} from './checkoutPaymentCopy';

describe('checkoutPaymentCopy', () => {
  it('buildPaymentProofMessage incluye comprobante y plazo en checkout', () => {
    const msg = buildPaymentProofMessage(DEFAULT_TIENDA_CONFIG_PUBLIC);
    expect(msg.toLowerCase()).toContain('comprobante');
    expect(msg).toContain('48 horas');
    expect(msg).toContain(DEFAULT_TIENDA_CONFIG_PUBLIC.whatsappTelefono);
  });

  it('buildPaymentProofMessage en confirmación omite plazo genérico', () => {
    const msg = buildPaymentProofMessage({
      ...DEFAULT_TIENDA_CONFIG_PUBLIC,
      variant: 'confirmation',
    });
    expect(msg.toLowerCase()).toContain('comprobante');
    expect(msg).not.toContain('48 horas');
  });

  it('buildPaymentProofMessage usa config mock', () => {
    const msg = buildPaymentProofMessage({
      whatsappTelefono: '+54 9 351 000-0000',
      pagoManualHorasPlazo: 24,
      pagoManualInstruccionesExtra: 'Incluí el número de pedido.',
    });
    expect(msg).toContain('+54 9 351 000-0000');
    expect(msg).toContain('24 horas');
    expect(msg).toContain('número de pedido');
  });

  it('buildEfectivoProofMessage menciona comprobante, WhatsApp y pedido', () => {
    const msg = buildEfectivoProofMessage({
      ...DEFAULT_TIENDA_CONFIG_PUBLIC,
      variant: 'confirmation',
      externalOrderId: 'WEB-87',
    });
    expect(msg.toLowerCase()).toContain('comprobante');
    expect(msg.toLowerCase()).toContain('whatsapp');
    expect(msg).toContain('WEB-87');
  });

  it('incluye email de tienda cuando está configurado', () => {
    const msg = buildPaymentProofMessage({
      whatsappTelefono: '+54 9 351 000-0000',
      emailPedidosInterno: 'pedidos@tienda.com',
      variant: 'confirmation',
    });
    expect(msg.toLowerCase()).toContain('comprobante');
    expect(msg).toContain('pedidos@tienda.com');
    expect(msg).toContain('+54 9 351 000-0000');
  });
});
