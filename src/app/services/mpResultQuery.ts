/**
 * Parámetros típicos al volver de Mercado Pago (redirect success/failure/pending).
 */
export type MpReturnUiStatus = 'approved' | 'pending' | 'failure' | 'unknown';

export interface MercadoPagoReturnParsed {
  uiStatus: MpReturnUiStatus;
  paymentId: string | null;
  externalReference: string | null;
  collectionStatus: string | null;
  rawStatus: string | null;
}

export function parseMercadoPagoReturnParams(
  searchParams: URLSearchParams
): MercadoPagoReturnParsed {
  const mpReturn = (searchParams.get('mp_return') ?? '').toLowerCase();
  const rawStatus = searchParams.get('status') ?? searchParams.get('collection_status');
  const collectionStatus = searchParams.get('collection_status');
  const paymentId =
    searchParams.get('payment_id') ??
    searchParams.get('paymentId') ??
    searchParams.get('collection_id');
  const externalReference = searchParams.get('external_reference');

  const s = (rawStatus ?? '').toLowerCase();
  let uiStatus: MpReturnUiStatus = 'unknown';
  if (mpReturn === 'success' || s === 'approved' || s === 'success') {
    uiStatus = 'approved';
  } else if (mpReturn === 'pending' || s === 'pending' || s === 'in_process' || s === 'in process') {
    uiStatus = 'pending';
  } else if (
    mpReturn === 'failure' ||
    s === 'failure' ||
    s === 'rejected' ||
    s === 'cancelled' ||
    s === 'canceled' ||
    s === 'null'
  ) {
    uiStatus = 'failure';
  }

  return {
    uiStatus,
    paymentId,
    externalReference,
    collectionStatus,
    rawStatus,
  };
}
