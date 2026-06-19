import { describe, it, expect } from 'vitest';
import { parseMercadoPagoReturnParams } from './mpResultQuery';

describe('parseMercadoPagoReturnParams', () => {
  it('mapea mp_return=success a approved', () => {
    const p = parseMercadoPagoReturnParams(new URLSearchParams('mp_return=success&payment_id=99'));
    expect(p.uiStatus).toBe('approved');
    expect(p.paymentId).toBe('99');
  });

  it('mapea status=approved a approved', () => {
    const p = parseMercadoPagoReturnParams(
      new URLSearchParams('status=approved&external_reference=ped-1')
    );
    expect(p.uiStatus).toBe('approved');
    expect(p.externalReference).toBe('ped-1');
  });

  it('mapea pending e in_process', () => {
    expect(parseMercadoPagoReturnParams(new URLSearchParams('mp_return=pending')).uiStatus).toBe(
      'pending'
    );
    expect(parseMercadoPagoReturnParams(new URLSearchParams('status=in_process')).uiStatus).toBe(
      'pending'
    );
  });

  it('mapea failure con payment_id y rejected', () => {
    expect(parseMercadoPagoReturnParams(new URLSearchParams('mp_return=failure')).uiStatus).toBe(
      'abandoned'
    );
    expect(
      parseMercadoPagoReturnParams(
        new URLSearchParams('mp_return=failure&payment_id=123')
      ).uiStatus
    ).toBe('failure');
    expect(parseMercadoPagoReturnParams(new URLSearchParams('status=rejected')).uiStatus).toBe(
      'failure'
    );
  });

  it('acepta paymentId y collection_id como alias', () => {
    expect(
      parseMercadoPagoReturnParams(new URLSearchParams('paymentId=1&status=approved')).paymentId
    ).toBe('1');
    expect(
      parseMercadoPagoReturnParams(new URLSearchParams('collection_id=2&status=approved')).paymentId
    ).toBe('2');
  });

  it('retorna unknown sin params reconocibles', () => {
    expect(parseMercadoPagoReturnParams(new URLSearchParams('foo=bar')).uiStatus).toBe('unknown');
  });
});
