/**
 * Cálculo de precios derivados a partir del precio lista.
 *
 * Si se pasa `config`, usa esos valores (descuentoTransferencia, iva, cuotasFinanciado).
 * Si no, usa defaults hardcodeados como fallback.
 *
 * La fuente oficial de verdad es `useEmpresaPrecioConfig` + API (empresa_precio_config).
 * Este util re-exporta la función del hook para compatibilidad.
 */

export {
  calcularPreciosDerivados,
} from '@/app/hooks/useEmpresaPrecioConfig';
