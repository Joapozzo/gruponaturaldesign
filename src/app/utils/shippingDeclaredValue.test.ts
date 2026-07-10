import { describe, it, expect } from 'vitest';
import { resolveShippingDeclaredValueSubtotal } from './shippingDeclaredValue';

describe('resolveShippingDeclaredValueSubtotal', () => {
  it('modo lista usa totalLista', () => {
    expect(resolveShippingDeclaredValueSubtotal('lista', 41140, 35000)).toBe(41140);
  });

  it('modo transfer usa totalTransfer', () => {
    expect(resolveShippingDeclaredValueSubtotal('transfer', 41140, 35000)).toBe(35000);
  });

  it('transfer 0 cae en totalLista', () => {
    expect(resolveShippingDeclaredValueSubtotal('transfer', 41140, 0)).toBe(41140);
  });
});
