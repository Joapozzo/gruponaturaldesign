/**
 * Tipos de cuotas / precio público (espejo del backend).
 */

export type InstallmentProviderId = 'mercado_pago' | 'static' | (string & {});

export interface InstallmentQuote {
  provider: InstallmentProviderId;
  cuotas: number;
  montoCuota: number;
  totalFinanciado: number;
  sinInteres: boolean;
  moneda: 'ARS';
  cft?: string | null;
  tea?: string | null;
  referencia?: string | null;
  estimado?: boolean;
}

export interface PrecioPublico {
  precioLista: number | null;
  precioTransfer: number | null;
  precioSinImp: number | null;
  /** @deprecated usar cuotas.montoCuota */
  precio3Cuotas?: number | null;
  precio3cuotas?: number | null;
  cuotas: InstallmentQuote | null;
}

export function resolvePrecio3Cuotas(precio: Partial<PrecioPublico>): number | null {
  if (precio.cuotas?.montoCuota != null) return precio.cuotas.montoCuota;
  if (precio.precio3Cuotas != null) return precio.precio3Cuotas;
  if (precio.precio3cuotas != null) return precio.precio3cuotas;
  return null;
}

export function buildPrecioPublicoFromLegacy(input: {
  precioLista?: number | null;
  precioTransfer?: number | null;
  precioSinImp?: number | null;
  precio3Cuotas?: number | null;
  precio3cuotas?: number | null;
  precioSImp?: number | null;
  cuotas?: InstallmentQuote | null;
  cuotasFinanciado?: number | null;
}): PrecioPublico {
  const precioLista = input.precioLista ?? null;
  const cuotas =
    input.cuotas ??
    (() => {
      const monto = input.precio3Cuotas ?? input.precio3cuotas ?? null;
      const n = input.cuotasFinanciado ?? 3;
      if (monto == null || precioLista == null) return null;
      return {
        provider: 'static' as const,
        cuotas: n,
        montoCuota: monto,
        totalFinanciado: precioLista,
        sinInteres: false,
        moneda: 'ARS' as const,
        estimado: true,
      };
    })();

  return {
    precioLista,
    precioTransfer: input.precioTransfer ?? null,
    precioSinImp: input.precioSinImp ?? input.precioSImp ?? null,
    precio3Cuotas: resolvePrecio3Cuotas({ ...input, cuotas }),
    cuotas,
  };
}
