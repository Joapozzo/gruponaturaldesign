'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Home, ChevronRight, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import NewsletterConfirmationBanner from '@/app/components/newsletter/NewsletterConfirmationBanner';
import { CheckoutPaymentProofBanner } from '@/app/components/checkout/CheckoutPaymentProofBanner';
import { useCart } from '@/app/components/hooks/useCart';
import {
  clearCheckoutManualSnapshot,
  fetchInstruccionesPago,
  readCheckoutManualSnapshot,
  type InstruccionesPagoResponse,
} from '@/app/services/checkoutManual.service';
import { trackMetaPedidoCreado } from '@/app/analytics/metaPixel/metaPixel.client';

function formatExpiresAt(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copiado`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('No se pudo copiar');
    }
  }, [value, label]);

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-black"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      Copiar
    </button>
  );
}

function BankRow({ label, value, copyLabel }: { label: string; value: string; copyLabel?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 py-2 border-b border-gray-100 last:border-0">
      <BankRowContent label={label} value={value} />
      <CopyButton value={value} label={copyLabel ?? label} />
    </div>
  );
}

function BankRowContent({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-900 break-all">{value}</p>
    </div>
  );
}

function SuccessCheck() {
  return (
    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto">
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function InstruccionesPagoInner() {
  const router = useRouter();
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const pedidoIdParam = searchParams.get('pedidoId');
  const pedidoId = pedidoIdParam ? parseInt(pedidoIdParam, 10) : NaN;

  const [data, setData] = useState<InstruccionesPagoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const snap = typeof window !== 'undefined' ? readCheckoutManualSnapshot() : null;
  const pedidoCreadoTrackedRef = useRef(false);

  useEffect(() => {
    if (!Number.isFinite(pedidoId) || pedidoId <= 0) {
      setError('Pedido no válido');
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const result = await fetchInstruccionesPago(pedidoId);
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Error al cargar instrucciones');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pedidoId]);

  /** Vacía el carrito solo tras un pedido manual recién confirmado (evita condición de carrera con /checkout/pago). */
  useEffect(() => {
    if (!data || !Number.isFinite(pedidoId) || pedidoId <= 0) return;
    const snap = readCheckoutManualSnapshot();
    if (!snap || snap.pedidoId !== pedidoId) return;
    const maxAgeMs = 60 * 60 * 1000;
    if (Date.now() - snap.savedAt > maxAgeMs) {
      clearCheckoutManualSnapshot();
      return;
    }
    if (!pedidoCreadoTrackedRef.current && snap.analytics) {
      pedidoCreadoTrackedRef.current = true;
      trackMetaPedidoCreado(snap.analytics, pedidoId);
    }
    clearCart();
    clearCheckoutManualSnapshot();
  }, [data, pedidoId, clearCart]);

  const isTransfer = data?.formaPago === 'transferencia';
  const expiresLabel = formatExpiresAt(data?.expiresAt ?? null);
  const showNextStepsBanner =
    data != null && (data.formaPago === 'efectivo' || (isTransfer && data.bankConfigured));

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20">
        <div className="w-full max-w-3xl mx-auto px-4 py-2">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/" className="hover:text-black flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Inicio
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900">Instrucciones de pago</span>
          </nav>
        </div>
      </div>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {loading ? (
          <p className="text-center text-gray-600 animate-pulse">Cargando...</p>
        ) : error ? (
          <div className="text-center space-y-4">
            <p className="text-red-600">{error}</p>
            <Button variant="blackOutline" onClick={() => router.push('/')}>
              Volver al inicio
            </Button>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="text-center">
              <SuccessCheck />
              <h1 className="text-2xl sm:text-3xl font-bold text-black mt-4">
                {isTransfer ? 'Completá tu transferencia' : 'Pedido registrado'}
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                Pedido <strong>{data.externalOrderId}</strong> · Total{' '}
                <strong>{data.totalFormatted}</strong>
              </p>
              {expiresLabel && (
                <p className="text-xs text-amber-700 mt-2">
                  Tenés tiempo para abonar hasta el {expiresLabel}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-3">
                Te enviamos un email a <strong>{data.customerEmail}</strong> con estos datos.
              </p>
            </div>

            {isTransfer && data.bank ? (
              <section className="rounded-xl border-2 border-gray-200 bg-gray-50 p-5 sm:p-6">
                <h2 className="text-sm font-bold text-black mb-4 uppercase tracking-wide">
                  Datos para transferir
                </h2>
                <BankRow label="Banco" value={data.bank.banco} />
                <BankRow label="Titular" value={data.bank.titular} />
                {data.bank.cuit ? <BankRow label="CUIT" value={data.bank.cuit} /> : null}
                <BankRow label="Tipo de cuenta" value={data.bank.tipoCuenta} />
                <BankRow label="Nº de cuenta" value={data.bank.numeroCuenta} />
                {data.bank.cbu ? <BankRow label="CBU" value={data.bank.cbu} copyLabel="CBU" /> : null}
                {data.bank.alias ? (
                  <BankRow label="Alias" value={data.bank.alias} copyLabel="Alias" />
                ) : null}
                {data.bank.instrucciones ? (
                  <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
                    {data.bank.instrucciones}
                  </p>
                ) : null}
              </section>
            ) : isTransfer && !data.bankConfigured ? (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-4">
                Los datos bancarios se están actualizando. Te contactaremos a la brevedad con la
                información para transferir.
              </p>
            ) : null}

            {showNextStepsBanner ? (
              <CheckoutPaymentProofBanner
                formaPago={data.formaPago}
                variant="confirmation"
                externalOrderId={data.externalOrderId}
              />
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button variant="brandRed" onClick={() => router.push('/')}>
                Ir al inicio
              </Button>
              <Button variant="blackOutline" onClick={() => router.push('/shoponline')}>
                Ver tienda
              </Button>
            </div>

            <NewsletterConfirmationBanner
              defaultEmail={snap?.customerEmail ?? data.customerEmail}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default function InstruccionesPagoPage() {
  return (
    <Suspense fallback={<p className="text-center py-12 text-gray-600">Cargando...</p>}>
      <InstruccionesPagoInner />
    </Suspense>
  );
}
