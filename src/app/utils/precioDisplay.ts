export function buildHastaCuotasConMpLabel(cuotasFinanciado: number): string {
  const n = cuotasFinanciado;
  return n === 1 ? 'Hasta 1 cuota con Mercado Pago' : `Hasta ${n} cuotas con Mercado Pago`;
}

export function buildPromoCuotasLabel(
  cuotasFinanciado: number,
  _sinInteres?: boolean
): string {
  const n = cuotasFinanciado;
  return n === 1 ? 'HASTA 1 CUOTA' : `HASTA ${n} CUOTAS`;
}

export function buildPaymentBenefitsDescription(
  cuotasFinanciado: number,
  descuentoTransferPct: number,
  _sinInteres?: boolean
): string {
  return `Hasta ${cuotasFinanciado} cuotas - ${descuentoTransferPct}% off con transferencia`;
}
