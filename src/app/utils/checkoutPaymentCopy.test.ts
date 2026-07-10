import { describe, it, expect } from 'vitest';
import {
  buildCheckoutExpiryBullet,
  buildEfectivoProofMessage,
  buildMpExpiryMessage,
  buildPaymentProofMessage,
  DEFAULT_TIENDA_CONFIG_PUBLIC,
  formatPlazoHoras,
} from './checkoutPaymentCopy';

describe('checkoutPaymentCopy', () => {
  it('buildPaymentProofMessage incluye comprobante y plazo en checkout', () => {
    const msg = buildPaymentProofMessage(DEFAULT_TIENDA_CONFIG_PUBLIC);
    expect(msg.toLowerCase()).toContain('comprobante');
    expect(msg).toContain('2 días');
    expect(msg).toContain(DEFAULT_TIENDA_CONFIG_PUBLIC.whatsappTelefono);
  });

  it('buildPaymentProofMessage en confirmación omite plazo genérico', () => {
    const msg = buildPaymentProofMessage({
      ...DEFAULT_TIENDA_CONFIG_PUBLIC,
      variant: 'confirmation',
    });
    expect(msg.toLowerCase()).toContain('comprobante');
    expect(msg).not.toContain('2 días');
  });

  it('buildPaymentProofMessage usa config mock', () => {
    const msg = buildPaymentProofMessage({
      whatsappTelefono: '+54 9 351 000-0000',
      pagoManualHorasPlazo: 24,
      pagoManualInstruccionesExtra: 'Incluí el número de pedido.',
    });
    expect(msg).toContain('+54 9 351 000-0000');
    expect(msg).toContain('1 día');
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

  it('formatPlazoHoras usa días cuando aplica', () => {
    expect(formatPlazoHoras(48)).toBe('2 días');
    expect(formatPlazoHoras(2)).toBe('2 horas');
    expect(formatPlazoHoras(1)).toBe('1 hora');
  });

  it('buildMpExpiryMessage usa mpExpiresHours', () => {
    const msg = buildMpExpiryMessage(2);
    expect(msg).toContain('2 horas');
    expect(msg.toLowerCase()).toContain('mercado pago');
  });

  it('buildCheckoutExpiryBullet distingue MP y manual', () => {
    expect(buildCheckoutExpiryBullet('mercado_pago', { mpExpiresHours: 2, pagoManualHorasPlazo: 240 })).toContain(
      '2 horas'
    );
    expect(
      buildCheckoutExpiryBullet('transferencia', { mpExpiresHours: 2, pagoManualHorasPlazo: 240 })
    ).toContain('10 días');
  });
});
