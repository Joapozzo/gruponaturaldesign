'use client';

import type { MpReturnUiStatus } from '@/app/services/mpResultQuery';
import Button from '@/components/ui/Button';

export interface MpResultStatusBlockProps {
  uiStatus: MpReturnUiStatus;
  paymentId: string | null;
  externalReference: string | null;
  snapshotTotalLabel?: string | null;
  snapshotItemCount?: number | null;
  /** Referencia offline (Rapipago, etc.) desde la API de MP. */
  offlinePaymentReference?: string | null;
  onRetryCheckout?: () => void;
}

function statusTitle(ui: MpReturnUiStatus): string {
  switch (ui) {
    case 'approved':
      return 'Pago aprobado';
    case 'pending':
      return 'Aguardando pago';
    case 'failure':
      return 'Pago no completado';
    default:
      return 'Resultado del pago';
  }
}

function statusDescription(ui: MpReturnUiStatus): string {
  switch (ui) {
    case 'approved':
      return 'Tu pedido quedó registrado. Recibirás novedades por email.';
    case 'pending':
      return 'Si elegiste un medio en efectivo o pendiente de acreditación, completá el pago con los datos indicados abajo. Esta pantalla se actualiza sola cuando el pago se acredita.';
    case 'failure':
      return 'No se completó el cobro. Podés volver al checkout e intentar de nuevo.';
    default:
      return 'Si tenés dudas, contactanos con el número de operación (si figura abajo).';
  }
}

export default function MpResultStatusBlock({
  uiStatus,
  paymentId,
  externalReference,
  snapshotTotalLabel,
  snapshotItemCount,
  offlinePaymentReference,
  onRetryCheckout,
}: MpResultStatusBlockProps) {
  const accent =
    uiStatus === 'approved'
      ? 'bg-red-600'
      : uiStatus === 'pending'
        ? 'bg-amber-600'
        : uiStatus === 'failure'
          ? 'bg-gray-700'
          : 'bg-black';

  return (
    <div className="w-full max-w-lg mx-auto bg-white border-2 border-black rounded-lg p-6 sm:p-8 shadow-sm">
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${accent}`}
      >
        {uiStatus === 'approved' ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="text-white text-2xl font-bold">MP</span>
        )}
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-black text-center mb-2">{statusTitle(uiStatus)}</h1>
      <p className="text-sm text-gray-600 text-center mb-6">{statusDescription(uiStatus)}</p>

      {(snapshotTotalLabel != null || snapshotItemCount != null) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800 mb-4 space-y-1">
          {snapshotItemCount != null && (
            <p>
              <strong>Productos:</strong> {snapshotItemCount} u.
            </p>
          )}
          {snapshotTotalLabel != null && (
            <p>
              <strong>Total:</strong> {snapshotTotalLabel}
            </p>
          )}
        </div>
      )}

      {uiStatus === 'pending' && offlinePaymentReference && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-gray-900 mb-4">
          <p className="font-semibold text-amber-900 mb-1">Referencia para pagar en sucursal</p>
          <p className="font-mono text-base break-all">{offlinePaymentReference}</p>
          <p className="text-gray-600 mt-2 text-xs">
            Conservá este código hasta que el pago figure como acreditado en Mercado Pago.
          </p>
        </div>
      )}

      <dl className="text-xs sm:text-sm text-gray-700 space-y-2 border-t border-gray-200 pt-4">
        {paymentId && (
          <div className="flex justify-between gap-2">
            <dt className="text-gray-500">ID de pago</dt>
            <dd className="font-mono text-right break-all">{paymentId}</dd>
          </div>
        )}
        {externalReference && (
          <div className="flex justify-between gap-2">
            <dt className="text-gray-500">Referencia</dt>
            <dd className="font-mono text-right break-all">{externalReference}</dd>
          </div>
        )}
      </dl>

      {uiStatus === 'failure' && onRetryCheckout && (
        <div className="mt-6 flex justify-center">
          <Button variant="black" size="sm" type="button" onClick={onRetryCheckout}>
            Reintentar pago
          </Button>
        </div>
      )}
    </div>
  );
}
