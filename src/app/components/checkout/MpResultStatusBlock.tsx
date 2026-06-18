'use client';

import Image from 'next/image';
import { CheckCircle2, Clock3, HelpCircle, LogOut, XCircle } from 'lucide-react';
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

const STATUS_CONFIG: Record<
  MpReturnUiStatus,
  {
    title: string;
    description: string;
    badge: string;
    badgeClass: string;
    ringClass: string;
    Icon: typeof CheckCircle2;
    iconClass: string;
  }
> = {
  approved: {
    title: 'Pago aprobado',
    description: 'Tu pedido quedó registrado. Recibirás novedades por email.',
    badge: 'Aprobado',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    ringClass: 'ring-emerald-100',
    Icon: CheckCircle2,
    iconClass: 'text-emerald-600',
  },
  pending: {
    title: 'Aguardando pago',
    description:
      'Si elegiste efectivo o un medio pendiente de acreditación, completá el pago con los datos indicados abajo. Esta pantalla se actualiza sola cuando se acredita.',
    badge: 'Pendiente',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
    ringClass: 'ring-amber-100',
    Icon: Clock3,
    iconClass: 'text-amber-600',
  },
  failure: {
    title: 'Pago no completado',
    description:
      'El cobro no se concretó. No se debitó el monto. Podés volver al checkout e intentar con otro medio.',
    badge: 'No completado',
    badgeClass: 'bg-red-50 text-red-800 border-red-200',
    ringClass: 'ring-red-100',
    Icon: XCircle,
    iconClass: 'text-[#Ed3237]',
  },
  abandoned: {
    title: 'Checkout sin completar',
    description: 'Volviste sin finalizar el pago. Te redirigimos al checkout para que puedas continuar.',
    badge: 'Sin completar',
    badgeClass: 'bg-gray-50 text-gray-800 border-gray-200',
    ringClass: 'ring-gray-100',
    Icon: LogOut,
    iconClass: 'text-gray-600',
  },
  unknown: {
    title: 'Resultado del pago',
    description: 'Si tenés dudas, contactanos con el número de operación (si figura abajo).',
    badge: 'Consultar',
    badgeClass: 'bg-gray-50 text-gray-800 border-gray-200',
    ringClass: 'ring-gray-100',
    Icon: HelpCircle,
    iconClass: 'text-gray-600',
  },
};

function formatExternalReference(ref: string | null): string | null {
  if (!ref) return null;
  const m = ref.match(/^pedido_(\d+)$/);
  return m ? `#${m[1]}` : ref;
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
  const cfg = STATUS_CONFIG[uiStatus];
  const { Icon } = cfg;
  const pedidoLabel = formatExternalReference(externalReference);

  return (
    <div className="w-full max-w-lg mx-auto overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-[#f7fbfd] px-5 py-4">
        <Image
          src="/logos/mp-logo.png"
          alt="Mercado Pago"
          width={120}
          height={32}
          className="h-7 w-auto object-contain"
          priority
        />
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.badgeClass}`}>
          {cfg.badge}
        </span>
      </div>

      <div className="px-6 py-8 sm:px-8">
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white ring-8 ${cfg.ringClass}`}
        >
          <Icon className={`h-9 w-9 ${cfg.iconClass}`} aria-hidden />
        </div>

        <h1 className="mb-2 text-center text-xl font-bold text-black sm:text-2xl">{cfg.title}</h1>
        <p className="mb-6 text-center text-sm leading-relaxed text-gray-600">{cfg.description}</p>

        {(snapshotTotalLabel != null || snapshotItemCount != null) && (
          <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Resumen</p>
            <div className="flex justify-between gap-4">
              {snapshotItemCount != null && (
                <span>
                  <span className="text-gray-500">Productos</span>
                  <br />
                  <strong>{snapshotItemCount} u.</strong>
                </span>
              )}
              {snapshotTotalLabel != null && (
                <span className="text-right">
                  <span className="text-gray-500">Total</span>
                  <br />
                  <strong>{snapshotTotalLabel}</strong>
                </span>
              )}
            </div>
          </div>
        )}

        {uiStatus === 'pending' && offlinePaymentReference && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <p className="mb-1 font-semibold text-amber-900">Referencia para pagar en sucursal</p>
            <p className="break-all font-mono text-base text-gray-900">{offlinePaymentReference}</p>
            <p className="mt-2 text-xs text-gray-600">
              Conservá este código hasta que el pago figure como acreditado en Mercado Pago.
            </p>
          </div>
        )}

        {(paymentId || pedidoLabel) && (
          <dl className="space-y-2 rounded-xl border border-gray-100 bg-white p-4 text-xs sm:text-sm">
            {pedidoLabel && (
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">Pedido</dt>
                <dd className="font-mono font-medium text-gray-900">{pedidoLabel}</dd>
              </div>
            )}
            {paymentId && (
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">ID de pago</dt>
                <dd className="break-all text-right font-mono text-gray-900">{paymentId}</dd>
              </div>
            )}
          </dl>
        )}

        {uiStatus === 'failure' && onRetryCheckout && (
          <div className="mt-6">
            <Button variant="brandRed" size="md" type="button" fullWidth onClick={onRetryCheckout}>
              Reintentar pago
            </Button>
            <p className="mt-3 text-center text-xs text-gray-500">
              También podés elegir transferencia o efectivo en el checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
