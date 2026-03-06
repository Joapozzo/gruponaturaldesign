/**
 * Cálculo de precios derivados a partir del precio lista.
 * Debe coincidir con api/src/config/precios.config.ts (15% transfer, 3 cuotas, IVA 21%).
 */

const DESCUENTO_TRANSFERENCIA = 0.15;
const FACTOR_TRANSFERENCIA = 1 - DESCUENTO_TRANSFERENCIA; // 0.85
const FACTOR_IVA = 1.21;
const CUOTAS_DEFAULT = 3;

export function calcularPreciosDerivados(precioLista: number | null): {
  precioTransfer: number | null;
  precioFinanciado: number | null;
  precioSinImp: number | null;
  cuotas: number;
} {
  if (precioLista == null || precioLista <= 0) {
    return {
      precioTransfer: null,
      precioFinanciado: null,
      precioSinImp: null,
      cuotas: CUOTAS_DEFAULT,
    };
  }
  const precioTransfer = Number((precioLista * FACTOR_TRANSFERENCIA).toFixed(2));
  const precioFinanciado = Number((precioLista / CUOTAS_DEFAULT).toFixed(2));
  const precioSinImp = Number((precioTransfer / FACTOR_IVA).toFixed(2));
  return {
    precioTransfer,
    precioFinanciado,
    precioSinImp,
    cuotas: CUOTAS_DEFAULT,
  };
}
