import { describe, it, expect } from 'vitest';
import { formatPrice } from './precio';

describe('formatPrice', () => {
  it('formatea en ARS', () => {
    const s = formatPrice(1234.5);
    expect(s).toMatch(/\$/);
    expect(s.replace(/\D/g, '')).toContain('1234');
  });

  it('formatea cero', () => {
    expect(formatPrice(0)).toMatch(/\$.*0/);
  });
});
