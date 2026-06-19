import { describe, it, expect } from 'vitest';
import { parseProductSpecs } from '@/app/utils/productHelpers';

/** Replica la lógica de mapCartItemsToMpPayload para tests sin DOM. */
function mapLineSpecs(especificaciones?: string, bordado?: boolean) {
  const { color, talle } = parseProductSpecs(especificaciones);
  return {
    ...(talle ? { talle } : {}),
    ...(color ? { color } : {}),
    ...(bordado ? { bordado: true } : {}),
  };
}

describe('checkout cart item specs mapping', () => {
  it('parsea talle, color y bordado desde carrito', () => {
    const specs = mapLineSpecs('Color: Negro | Talle: 50 | Código: ABC', true);
    expect(specs).toEqual({
      color: 'Negro',
      talle: '50',
      bordado: true,
    });
  });

  it('omite campos ausentes', () => {
    const specs = mapLineSpecs(undefined, false);
    expect(specs).toEqual({});
  });
});
