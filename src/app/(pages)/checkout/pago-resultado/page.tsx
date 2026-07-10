'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMpPaymentResult } from '@/app/hooks/useMpPaymentResult';
import {
  abandonarCheckoutMp,
  clearCheckoutMpSnapshot,
  fetchPaymentStatusMp,
  readCheckoutMpSnapshot,
  type PaymentStatusMpResponse,
} from '@/app/services/checkoutMp.service';
import type { MpReturnUiStatus } from '@/app/services/mpResultQuery';
import { useCart } from '@/app/components/hooks/useCart';
import MpResultStatusBlock from '@/app/components/checkout/MpResultStatusBlock';
import {
  CHECKOUT_INCOMPLETO_QUERY,
  CHECKOUT_ROUTES,
} from '@/app/components/checkout/checkoutRoutes';
import NewsletterConfirmationBanner from '@/app/components/newsletter/NewsletterConfirmationBanner';
import Button from '@/components/ui/Button';
import { trackMetaPurchase } from '@/app/analytics/metaPixel/metaPixel.client';

function parsePedidoIdFromExternalReference(ref: string | null): number | null {
  if (!ref) return null;
  const m = ref.match(/^pedido_(\d+)$/);
  if (!m) return null;
  const id = parseInt(m[1]!, 10);
  return Number.isFinite(id) ? id : null;
}

function mergeMpUiFromPoll(
  urlStatus: MpReturnUiStatus,
  live: PaymentStatusMpResponse | null
): MpReturnUiStatus {
  if (urlStatus === 'abandoned') return 'abandoned';
  if (!live) return urlStatus;
  const e = live.estadoInterno;
  const mp = (live.mpLiveStatus ?? '').toLowerCase();
  if (
    e === 'confirmado' ||
    e === 'procesando' ||
    e === 'despachado' ||
    e === 'entregado'
  ) {
    return 'approved';
  }
  if (mp === 'approved') return 'approved';
  if (e === 'fallido' || e === 'vencido' || e === 'cancelado') return 'failure';
  if (mp === 'rejected' || mp === 'cancelled' || mp === 'refunded') return 'failure';
  return urlStatus;
}

function PagoResultadoInner() {
  const { uiStatus, paymentId, externalReference } = useMpPaymentResult();
  const { clearCart } = useCart();
  const router = useRouter();
  const clearedRef = useRef(false);
  const failureAbandonRef = useRef(false);
  const abandonedRedirectRef = useRef(false);

  const snap = typeof window !== 'undefined' ? readCheckoutMpSnapshot() : null;
  const pedidoId =
    snap?.pedidoId ?? parsePedidoIdFromExternalReference(externalReference);

  const [liveStatus, setLiveStatus] = useState<PaymentStatusMpResponse | null>(null);

  const effectiveUi = useMemo(
    () => mergeMpUiFromPoll(uiStatus, liveStatus),
    [uiStatus, liveStatus]
  );

  useEffect(() => {
    if (effectiveUi === 'approved' && !clearedRef.current) {
      clearedRef.current = true;
      if (pedidoId != null && snap?.analytics) {
        trackMetaPurchase(snap.analytics, pedidoId);
      }
      clearCart();
      clearCheckoutMpSnapshot();
    }
  }, [effectiveUi, clearCart, pedidoId, snap?.analytics]);

  useEffect(() => {
    if (effectiveUi !== 'abandoned' || abandonedRedirectRef.current) return;
    abandonedRedirectRef.current = true;
    void (async () => {
      if (pedidoId != null) {
        try {
          await abandonarCheckoutMp(pedidoId);
        } catch {
          /* pago acreditado o ya cancelado — no bloquear la redirección */
        }
      }
      clearCheckoutMpSnapshot();
      router.replace(`${CHECKOUT_ROUTES.pago}?${CHECKOUT_INCOMPLETO_QUERY}=1`);
    })();
  }, [effectiveUi, pedidoId, router]);

  useEffect(() => {
    if (effectiveUi !== 'failure' || pedidoId == null || failureAbandonRef.current) return;
    failureAbandonRef.current = true;
    void (async () => {
      try {
        await abandonarCheckoutMp(pedidoId);
      } catch {
        /* pago acreditado o ya cancelado — no bloquear la UI */
      } finally {
        clearCheckoutMpSnapshot();
      }
    })();
  }, [effectiveUi, pedidoId]);

  useEffect(() => {
    if (pedidoId == null || uiStatus !== 'pending') return;

    let cancelled = false;
    const tick = async () => {
      try {
        const st = await fetchPaymentStatusMp(pedidoId);
        if (!cancelled) setLiveStatus(st);
      } catch {
        /* sesión o red */
      }
    };
    void tick();
    const id = setInterval(tick, 4000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [pedidoId, uiStatus]);

  const onRetry = useCallback(() => {
    router.push(CHECKOUT_ROUTES.pago);
  }, [router]);

  if (effectiveUi === 'abandoned') {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-600 text-sm">
        Checkout sin completar…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20">
        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 lg:px-15 py-1.5 sm:py-2">
          <nav className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => router.push('/#inicio')}
              className="flex items-center gap-0.5 text-gray-600 hover:text-[#Ed3237] transition-colors font-medium"
            >
              <Home className="w-3 h-3" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link href="/checkout/pedido" className="text-gray-600 hover:text-[#Ed3237] font-medium">
              Checkout
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-black font-semibold">Pago</span>
          </nav>
        </div>
      </div>

      <div className="flex-1 w-full max-w-5xl xl:max-w-6xl mx-auto px-4 lg:px-15 py-10 sm:py-14">
        <MpResultStatusBlock
          uiStatus={effectiveUi}
          paymentId={paymentId ?? liveStatus?.mercadoPagoPaymentId ?? null}
          externalReference={externalReference}
          snapshotTotalLabel={snap?.totalLabel ?? null}
          snapshotItemCount={snap?.itemCount ?? null}
          offlinePaymentReference={liveStatus?.offlinePaymentReference ?? null}
          onRetryCheckout={effectiveUi === 'failure' ? onRetry : undefined}
        />
        {effectiveUi === 'approved' && (
          <div className="mt-6 max-w-lg mx-auto">
            <NewsletterConfirmationBanner defaultEmail={snap?.clienteEmail ?? null} />
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Button variant="blackOutline" size="sm" onClick={() => router.push('/shoponline')}>
            Seguir comprando
          </Button>
          <Button variant="black" size="sm" onClick={() => router.push('/')}>
            Ir al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PagoResultadoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center text-gray-600 text-sm">
          Cargando resultado…
        </div>
      }
    >
      <PagoResultadoInner />
    </Suspense>
  );
}
