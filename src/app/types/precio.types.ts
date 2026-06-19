/**
 * Precio público (espejo del backend).
 */

export interface PrecioPublico {
  precioLista: number | null;
  precioTransfer: number | null;
  precioSinImp: number | null;
}

export function buildPrecioPublico(input: {
  precioLista?: number | null;
  precioTransfer?: number | null;
  precioSinImp?: number | null;
  precioSImp?: number | null;
}): PrecioPublico {
  return {
    precioLista: input.precioLista ?? null,
    precioTransfer: input.precioTransfer ?? null,
    precioSinImp: input.precioSinImp ?? input.precioSImp ?? null,
  };
}
