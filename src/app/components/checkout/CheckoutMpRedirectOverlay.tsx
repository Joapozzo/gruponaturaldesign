'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { MpPaymentPhase } from '@/app/hooks/useCheckoutMpPayment';

const CANCEL_VISIBLE_MS = 5_000;

interface CheckoutMpRedirectOverlayProps {
  phase: MpPaymentPhase;
  onCancel: () => void;
}

export function CheckoutMpRedirectOverlay({ phase, onCancel }: CheckoutMpRedirectOverlayProps) {
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    setShowCancel(false);
    const timer = window.setTimeout(() => setShowCancel(true), CANCEL_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const message =
    phase === 'redirecting' ? 'Redirigiendo a Mercado Pago...' : 'Preparando tu pago...';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center px-4"
      role="alertdialog"
      aria-busy="true"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-4 max-w-sm text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Loader2 className="w-12 h-12 text-[#Ed3237]" aria-hidden />
        </motion.div>
        <p className="text-lg font-medium text-neutral-700">{message}</p>
        {showCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-600 underline underline-offset-2 hover:text-black transition-colors"
          >
            Cancelar y volver al checkout
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}
