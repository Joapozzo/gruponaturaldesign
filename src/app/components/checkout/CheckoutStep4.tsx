'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '../hooks/useCart';
import { useCartStore } from '../../stores/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckoutMpPayment } from '@/app/hooks/useCheckoutMpPayment';
import { useCheckoutCupon } from '@/app/hooks/useCheckoutCupon';
import { CheckoutCuponSection } from '@/components/cupon/CheckoutCuponSection';
import {
  buildClienteDireccionFromShipping,
  iniciarPagoManual,
} from '@/app/services/checkoutMp.service';
import { useCheckoutQuote } from '@/app/hooks/useCheckoutQuote';
import type { CustomerData } from '@/app/types/cart';
import { CheckoutPaymentProofBanner } from '@/app/components/checkout/CheckoutPaymentProofBanner';
import { CheckoutExpiryNotice } from '@/app/components/checkout/CheckoutExpiryNotice';
import { saveCheckoutManualSnapshot } from '@/app/services/checkoutManual.service';
import { PaymentData, type MpCheckoutModo } from '@/app/types/cart';
import { RiBankLine } from 'react-icons/ri';
import { BsCashStack } from 'react-icons/bs';
import { formatPrice } from '@/app/utils/productHelpers';
import { CheckoutActionBar } from '@/app/components/checkout/CheckoutActionBar';
import { CheckoutMpRedirectOverlay } from '@/app/components/checkout/CheckoutMpRedirectOverlay';
import { useSales } from '../../contexts/SalesContext';
import OrderSummarySection from '@/app/components/checkout/OrderSummarySection';
import NewsletterCheckoutOptIn from '@/app/components/newsletter/NewsletterCheckoutOptIn';
import { useNewsletterSubscribe } from '@/app/hooks/useNewsletterSubscribe';
import { usePrecioConfigPublic } from '@/app/hooks/usePrecioConfigPublic';
import { useTiendaConfig } from '@/app/hooks/useTiendaConfig';
import { buildHastaCuotasConMpLabel } from '@/app/utils/precioDisplay';
import { buildCheckoutExpiryBullet } from '@/app/utils/checkoutPaymentCopy';
import { resolveCheckoutPriceMode } from '@/app/utils/checkoutPricing';
import { extractApiErrorMessage } from '@/lib/apiErrorMessage';
import { buildMetaPixelAnalyticsFromCart } from '@/app/analytics/metaPixel/metaPixel.mappers';
import { trackMetaAddPaymentInfo } from '@/app/analytics/metaPixel/metaPixel.client';
import toast from 'react-hot-toast';

function buildFacturaPayload(customer: CustomerData) {
  if (!customer.necesitaFactura) {
    return { necesitaFactura: false as const };
  }
  return {
    necesitaFactura: true as const,
    facturaTipo: customer.facturaTipo ?? undefined,
    facturaCuit: customer.cuit ?? undefined,
    facturaRazonSocial: customer.facturaRazonSocial ?? undefined,
  };
}

interface CheckoutStep4Props {
  onBack: () => void;
}

const PAYMENT_METHODS = [
  {
    id: 'transferencia',
    name: 'Transferencia',
    description: 'Transferencia bancaria',
    badge: '-15% OFF',
    icon: <RiBankLine />,
  },
  {
    id: 'efectivo',
    name: 'Efectivo',
    description: 'Al recibir o retirar',
    icon: <BsCashStack />,
  },
  {
    id: 'mercado_pago',
    name: 'Mercado Pago',
    description: 'Tarjeta o dinero en cuenta',
    icon: (
      <Image
        src="/logos/mp-logo.png"
        alt="Mercado Pago"
        width={28}
        height={28}
        className="object-contain"
      />
    ),
  },
] as const;

type PaymentMethodId = (typeof PAYMENT_METHODS)[number]['id'];

type Step4PaymentState = Omit<PaymentData, 'metodo'> & { metodo: PaymentMethodId };

function normalizeStoredMetodo(m: PaymentData['metodo'] | undefined): PaymentMethodId {
  if (m === 'tarjeta') return 'mercado_pago';
  if (m === 'whatsapp' || m === 'transferencia' || m === 'efectivo' || m === 'mercado_pago') {
    return m === 'whatsapp' ? 'transferencia' : m;
  }
  return 'transferencia';
}

export default function CheckoutStep4({ onBack }: CheckoutStep4Props) {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const {
    startPayment,
    loading: mpLoading,
    error: mpError,
    phase: mpPhase,
    fallbackCheckoutUrl,
    cancelPayment,
    clearError,
  } = useCheckoutMpPayment();

  const {
    items,
    customerData,
    shippingData,
    paymentData,
    setPaymentData,
    itemCount,
    subtotal,
    cuponAplicado,
  } = useCart();
  const cuponHook = useCheckoutCupon({
    onSuccess: (cupon) => {
      useCartStore.getState().setCuponAplicado(cupon);
      toast.success(
        `Cupón "${cupon.codigo}" aplicado: -$${cupon.descuentoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
      );
    },
  });
  const { isWholesaleLimitReached } = useSales();

  const [payment, setPayment] = useState<Step4PaymentState>(() => ({
    metodo: normalizeStoredMetodo(paymentData?.metodo),
    mpModo:
      paymentData?.mpModo ??
      (normalizeStoredMetodo(paymentData?.metodo) === 'mercado_pago' ? 'financiado' : undefined),
    notas: paymentData?.notas || '',
  }));

  const [isProcessing, setIsProcessing] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const submitLockRef = useRef(false);
  const { subscribe: newsletterSubscribe } = useNewsletterSubscribe();

  const resolvedCuponCodigo =
    cuponAplicado?.codigo ?? cuponHook.cuponAplicado?.codigo ?? cuponHook.codigo.trim();

  const {
    quote,
    mpQuotes,
    loading: quoteLoading,
    error: quoteError,
    refresh: refreshQuote,
  } = useCheckoutQuote({
    items,
    shippingData,
    paymentMetodo: payment.metodo,
    mpModo: payment.mpModo,
    cuponCodigo: resolvedCuponCodigo || undefined,
    enabled: Boolean(firebaseUser),
  });

  const shippingExtra = quote?.costoEnvio ?? 0;
  const cuponDescuento = quote?.descuentoCupon ?? cuponAplicado?.descuentoTotal ?? cuponHook.cuponAplicado?.descuentoTotal ?? 0;
  const priceMode = resolveCheckoutPriceMode(payment.metodo, payment.mpModo);
  const productsTotal = quote?.subtotalProductos ?? 0;
  const productsGross = productsTotal + cuponDescuento;
  const productsGrossLista = mpQuotes.financiado
    ? mpQuotes.financiado.subtotalProductos + (mpQuotes.financiado.descuentoCupon ?? 0)
    : undefined;
  const payTotal = quote?.totalFinal ?? 0;
  const payTotalOff = mpQuotes.transfer?.totalFinal ?? payTotal;
  const payTotalLista = mpQuotes.financiado?.totalFinal ?? payTotal;
  const mpSelected = payment.metodo === 'mercado_pago';
  const mpFinanciado = mpSelected && payment.mpModo === 'financiado';
  const { data: precioConfig } = usePrecioConfigPublic();
  const tiendaConfig = useTiendaConfig();
  const cuotasLabel = buildHastaCuotasConMpLabel(precioConfig?.cuotasFinanciado ?? 3);

  const handlePaymentSelect = (metodo: PaymentMethodId) => {
    clearError();
    setManualError(null);
    setPayment((prev) => ({
      ...prev,
      metodo,
      mpModo: metodo === 'mercado_pago' ? (prev.mpModo ?? 'financiado') : undefined,
    }));
  };

  const handleMpModoSelect = (mpModo: MpCheckoutModo) => {
    clearError();
    setPayment((prev) => ({ ...prev, mpModo }));
  };

  const subscribeNewsletterIfNeeded = (email?: string) => {
    if (!newsletterOptIn || !email || typeof window === 'undefined') return;
    if (localStorage.getItem('newsletter_subscribed') === 'true') return;
    newsletterSubscribe(email).catch(() => {});
  };

  const handleSubmitOrder = async () => {
    if (
      isWholesaleLimitReached ||
      submitLockRef.current ||
      isProcessing ||
      mpLoading ||
      quoteLoading
    ) {
      return;
    }

    submitLockRef.current = true;

    let cuponCodigo: string | undefined;
    try {
      cuponCodigo = await cuponHook.resolveForCheckout(items);
    } catch (error) {
      submitLockRef.current = false;
      toast.error(error instanceof Error ? error.message : 'Cupón inválido');
      return;
    }

    const freshQuote = await refreshQuote();
    if (!freshQuote?.quoteId) {
      submitLockRef.current = false;
      const msg = quoteError ?? 'No se pudo calcular el total. Intentá de nuevo.';
      toast.error(msg);
      return;
    }

    const payTotalFresh = freshQuote.totalFinal;
    const clienteNombre = customerData
      ? `${customerData.nombre} ${customerData.apellido}`.trim()
      : '';
    const clienteDireccion =
      shippingData?.tipo === 'envio' ? buildClienteDireccionFromShipping(shippingData) : undefined;
    const observaciones =
      [payment.notas, shippingData?.notas].filter(Boolean).join(' | ') || undefined;
    const factura = customerData ? buildFacturaPayload(customerData) : { necesitaFactura: false as const };

    if (payment.metodo === 'mercado_pago') {
      if (!customerData?.email) {
        submitLockRef.current = false;
        toast.error('Faltan datos del cliente.');
        return;
      }
      if (!payment.mpModo) {
        submitLockRef.current = false;
        toast.error('Elegí cómo pagar con Mercado Pago.');
        return;
      }
      if (!firebaseUser) {
        submitLockRef.current = false;
        toast.error('Iniciá sesión para pagar con Mercado Pago.', { duration: 5000 });
        return;
      }
      clearError();
      setPaymentData(payment);
      subscribeNewsletterIfNeeded(customerData.email);

      const checkoutAnalytics = buildMetaPixelAnalyticsFromCart(items, payTotalFresh);
      trackMetaAddPaymentInfo(items, payTotalFresh, payment.metodo);

      await startPayment({
        body: {
          quoteId: freshQuote.quoteId,
          clienteNombre: clienteNombre || customerData.email,
          clienteEmail: customerData.email,
          clienteTelefono: customerData.telefono,
          clienteDireccion,
          observaciones,
          ...factura,
        },
        snapshot: {
          totalLabel: formatPrice(payTotalFresh),
          itemCount,
          clienteEmail: customerData.email,
          analytics: checkoutAnalytics,
        },
        cuponCodigo,
      }).then((ok) => {
        if (!ok) submitLockRef.current = false;
      });
      return;
    }

    if (!customerData?.email) {
      submitLockRef.current = false;
      toast.error('Faltan datos del cliente.');
      return;
    }
    if (!firebaseUser) {
      submitLockRef.current = false;
      toast.error('Iniciá sesión para confirmar el pedido.', { duration: 5000 });
      return;
    }

    setManualError(null);
    setIsProcessing(true);
    trackMetaAddPaymentInfo(items, payTotalFresh, payment.metodo);

    try {
      setPaymentData(payment);
      subscribeNewsletterIfNeeded(customerData.email);

      const pedidoData = await iniciarPagoManual({
        quoteId: freshQuote.quoteId,
        clienteNombre: clienteNombre || customerData.email,
        clienteEmail: customerData.email,
        clienteTelefono: customerData.telefono,
        clienteDireccion,
        observaciones,
        ...factura,
      });

      saveCheckoutManualSnapshot({
        pedidoId: pedidoData.pedidoId,
        externalOrderId: pedidoData.externalOrderId,
        formaPago: pedidoData.formaPago,
        totalLabel: formatPrice(payTotalFresh),
        customerEmail: customerData.email,
        analytics: buildMetaPixelAnalyticsFromCart(items, payTotalFresh),
      });

      router.replace(
        pedidoData.redirectPath ??
          `/checkout/instrucciones-pago?pedidoId=${pedidoData.pedidoId}`
      );
    } catch (error) {
      submitLockRef.current = false;
      setManualError(
        extractApiErrorMessage(
          error,
          'Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.'
        )
      );
      setIsProcessing(false);
    }
  };

  const busy = isProcessing || mpLoading || quoteLoading;

  const continueLabel = quoteLoading
    ? 'CALCULANDO...'
    : mpLoading
    ? mpPhase === 'redirecting'
      ? 'REDIRIGIENDO...'
      : 'PROCESANDO...'
    : isProcessing
      ? 'PROCESANDO...'
      : 'CONFIRMAR';

  const summaryProps = {
    customerData,
    shippingData,
    items,
    itemCount,
    subtotal,
    productsTotal,
    productsGross,
    productsGrossLista,
    payTotal,
    priceMode,
    shippingExtra,
    cuponAplicado: cuponAplicado || cuponHook.cuponAplicado,
  };

  const mobileFooterRef = useRef<HTMLDivElement>(null);
  const [mobileFooterPad, setMobileFooterPad] = useState(144);

  useEffect(() => {
    const el = mobileFooterRef.current;
    if (!el) return;

    const lgQuery = window.matchMedia('(min-width: 1024px)');

    const update = () => {
      if (lgQuery.matches) {
        setMobileFooterPad(0);
        return;
      }
      setMobileFooterPad(el.getBoundingClientRect().height + 16);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    lgQuery.addEventListener('change', update);
    return () => {
      ro.disconnect();
      lgQuery.removeEventListener('change', update);
    };
  }, [items.length, itemCount, shippingExtra, cuponDescuento, payment.metodo, payment.mpModo, productsTotal, payTotal]);

  return (
    <div
      className="flex flex-col lg:flex-row gap-4 lg:gap-8 lg:items-start lg:pb-0"
      style={{ paddingBottom: mobileFooterPad > 0 ? mobileFooterPad : undefined }}
    >
      <section className="w-full lg:flex-[7] lg:min-w-0 flex flex-col gap-4 sm:gap-5">
        <CheckoutCuponSection cupon={cuponHook} />

        <h2 className="text-sm sm:text-base font-bold text-black tracking-tight">FORMA DE PAGO</h2>

        <div className="space-y-3 sm:space-y-4">
          {PAYMENT_METHODS.map((method) => (
            <motion.button
              key={method.id}
              type="button"
              onClick={() => handlePaymentSelect(method.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 sm:p-5 border-2 rounded-xl text-left transition-all relative overflow-hidden ${
                payment.metodo === method.id
                  ? 'border-black bg-gray-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              {method.id === 'mercado_pago' && (
                <Image
                  src="/logos/mp-logo.png"
                  alt=""
                  aria-hidden
                  width={140}
                  height={140}
                  className="pointer-events-none absolute -right-2 sm:right-2 top-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 object-contain opacity-[0.1] rotate-12 select-none"
                />
              )}
              <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl lg:text-4xl text-black shrink-0 flex items-center justify-center w-10 sm:w-12">
                  {method.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                    <h4
                      className={`font-bold text-sm sm:text-base ${
                        payment.metodo === method.id ? 'text-black' : 'text-gray-900'
                      }`}
                    >
                      {method.name}
                    </h4>
                    {'badge' in method && method.badge && (
                      <span className="text-[10px] sm:text-xs bg-red-600 text-white px-2 sm:px-2.5 py-0.5 rounded font-bold">
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    {method.id === 'mercado_pago' && mpSelected && mpFinanciado
                      ? cuotasLabel
                      : method.id === 'mercado_pago' && mpSelected && payment.mpModo === 'transfer'
                        ? 'Precio OFF'
                        : method.description}
                  </p>
                </div>
                {payment.metodo === method.id && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {mpSelected && (
          <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-bold text-black">Elegí cómo pagar</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {(
                [
                  {
                    id: 'transfer' as const,
                    title: 'Transfer / 1 pago',
                    priceLabel: 'Precio OFF',
                    price: payTotalOff,
                    highlightClass: 'font-bold text-red-600',
                  },
                  {
                    id: 'financiado' as const,
                    title: 'Financiar en cuotas',
                    priceLabel: 'Precio lista',
                    price: payTotalLista,
                    highlightClass: 'font-bold text-black',
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleMpModoSelect(opt.id)}
                  className={`rounded-lg border-2 p-3 sm:p-4 text-left transition-all ${
                    payment.mpModo === opt.id
                      ? 'border-black bg-white shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="font-bold text-sm text-black">{opt.title}</span>
                  <p className="text-xs mt-1">
                    <span className={opt.highlightClass}>{opt.priceLabel}</span>{' '}
                    <span className="font-semibold text-gray-900">{formatPrice(opt.price)}</span>
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
            Notas sobre el pago
          </label>
          <textarea
            value={payment.notas}
            onChange={(e) => setPayment({ ...payment, notas: e.target.value })}
            rows={3}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:border-red-600 resize-none"
            placeholder="Ej: Prefiero pagar en efectivo..."
          />
        </div>

        {quoteError && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5">
            <p>{quoteError}</p>
          </div>
        )}

        {mpError && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-2 py-1.5 space-y-2">
            <p>{mpError}</p>
            {fallbackCheckoutUrl ? (
              <a
                href={fallbackCheckoutUrl}
                className="inline-block font-semibold text-red-700 underline underline-offset-2 hover:text-red-900"
              >
                Abrir Mercado Pago manualmente
              </a>
            ) : null}
          </div>
        )}

        {manualError && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-2 py-1.5">
            <p>{manualError}</p>
          </div>
        )}

        {payment.metodo === 'transferencia' || payment.metodo === 'efectivo' ? (
          <CheckoutPaymentProofBanner formaPago={payment.metodo} />
        ) : payment.metodo === 'mercado_pago' ? (
          <CheckoutExpiryNotice />
        ) : null}

        <div className="hidden lg:block">
          <CheckoutActionBar
            onBack={onBack}
            onContinue={handleSubmitOrder}
            continueLabel={continueLabel}
            backDisabled={busy}
            continueDisabled={busy}
            fixedOnMobile={false}
          />
        </div>

        <NewsletterCheckoutOptIn checked={newsletterOptIn} onChange={setNewsletterOptIn} />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-700">
          <p className="font-bold text-black mb-2 text-sm sm:text-base">¿QUÉ SUCEDE DESPUÉS?</p>
          {payment.metodo === 'mercado_pago' ? (
            <ul className="space-y-0.5 sm:space-y-1">
              <li>• Serás redirigido a Mercado Pago para abonar</li>
              <li>• Al volver verás el resultado del pago en esta tienda</li>
              <li>• Necesitás tener sesión iniciada</li>
              <li>
                • {buildCheckoutExpiryBullet('mercado_pago', tiendaConfig)}
              </li>
            </ul>
          ) : (
            <ul className="space-y-0.5 sm:space-y-1">
              <li>• Verás los datos para transferir o las instrucciones de efectivo</li>
              <li>• Recibirás un email con el detalle y datos de pago</li>
              <li>• El pedido queda pendiente hasta confirmar el pago</li>
              <li>
                • {buildCheckoutExpiryBullet(payment.metodo, tiendaConfig)}
              </li>
            </ul>
          )}
        </div>
      </section>

      <div className="hidden lg:block w-full lg:flex-[4] lg:min-w-0 min-w-0">
        <OrderSummarySection {...summaryProps} variant="sidebar" />
      </div>

      <div
        ref={mobileFooterRef}
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 overflow-hidden rounded-t-2xl border-t border-gray-200 bg-white shadow-[0_-8px_24px_-4px_rgb(0_0_0/0.08)]"
      >
        <OrderSummarySection {...summaryProps} variant="payment-footer" />
        <CheckoutActionBar
          onBack={onBack}
          onContinue={handleSubmitOrder}
          continueLabel={continueLabel}
          backDisabled={busy}
          continueDisabled={busy}
          fixedOnMobile={false}
          className="px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-gray-200 bg-white"
        />
      </div>

      {mpLoading ? (
        <CheckoutMpRedirectOverlay phase={mpPhase} onCancel={cancelPayment} />
      ) : null}
    </div>
  );
}
