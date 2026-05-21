'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CheckoutCorreoOpcionQuote } from '@/app/services/checkoutShipping.service';
import type { QuoteResult, ShippingQuoteOptionId } from '@/app/components/checkout/shipping/shippingQuote.utils';
import { resolveCorreoSelection } from '@/app/components/checkout/shipping/shippingQuote.utils';
import { formatPrice } from '@/app/utils/productHelpers';
import { CheckoutCorreoOpcionesRadioGroup } from '@/app/components/checkout/shipping/CheckoutCorreoOpcionesRadioGroup';
import { errorTextClass, selectedCardClass, selectedCheckClass, unselectedCardClass } from './checkoutShippingSelectionStyles';

type QuoteOptionMeta = {
  id: ShippingQuoteOptionId;
  carrierLabel: string;
  modalityLabel: string;
  provider: string;
};

interface CheckoutShippingQuoteOptionCardProps {
  opt: QuoteOptionMeta;
  q: QuoteResult | undefined;
  selected: boolean;
  quoteLoading: boolean;
  correoRatePick: string | undefined;
  onOptionClick: (optionId: ShippingQuoteOptionId) => void;
  onCorreoRateSelect: (optionId: ShippingQuoteOptionId, serviceCode: string) => void;
}

export function CheckoutShippingQuoteOptionCard({
  opt,
  q,
  selected,
  quoteLoading,
  correoRatePick,
  onOptionClick,
  onCorreoRateSelect,
}: CheckoutShippingQuoteOptionCardProps) {
  const hasPrice = q && 'precio' in q;
  const err = q && 'error' in q;
  const interactive = Boolean(hasPrice && !quoteLoading);
  const correoOpts: CheckoutCorreoOpcionQuote[] | undefined =
    hasPrice && opt.provider === 'correo' && q && 'correoOpciones' in q ? q.correoOpciones : undefined;

  const displayPrice =
    hasPrice && q && correoOpts?.length
      ? resolveCorreoSelection(q, correoRatePick).price
      : hasPrice && q
        ? q.precio
        : 0;

  const borderClass =
    selected && hasPrice
      ? selectedCardClass
      : hasPrice
        ? unselectedCardClass
        : err
          ? 'border-gray-200 bg-gray-50 opacity-90 cursor-not-allowed'
          : 'border-dashed border-gray-300 bg-gray-50/80 cursor-default';

  return (
    <motion.button
      key={opt.id}
      type="button"
      disabled={!interactive}
      onClick={() => interactive && onOptionClick(opt.id)}
      whileHover={interactive ? { scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      className={`w-full p-2 sm:p-3 border-2 rounded-lg text-left transition-all ${borderClass}`}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-xs sm:text-sm text-black">{opt.carrierLabel}</p>
          <p className="text-[10px] sm:text-xs text-gray-600 uppercase font-semibold tracking-tight">
            {opt.modalityLabel}
          </p>
          {quoteLoading ? (
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mt-1.5" aria-hidden />
          ) : hasPrice ? (
            <p className="text-xs sm:text-sm font-bold text-black mt-1">
              {formatPrice(displayPrice)}
              {correoOpts && correoOpts.length > 1 ? (
                <span className="font-normal text-gray-600 text-[10px] ml-1">(según tarifa)</span>
              ) : null}
            </p>
          ) : err && q ? (
            <p className={`text-[10px] sm:text-xs mt-1 ${errorTextClass}`}>{q.error}</p>
          ) : (
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Precio al cotizar</p>
          )}
          {hasPrice && correoOpts && correoOpts.length >= 2 ? (
            <CheckoutCorreoOpcionesRadioGroup
              optionId={opt.id}
              correoOpts={correoOpts}
              correoRatePick={correoRatePick}
              onCorreoRateSelect={onCorreoRateSelect}
            />
          ) : null}
        </div>
        {selected && hasPrice && !quoteLoading ? (
          <div
            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 ${selectedCheckClass}`}
          >
            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" strokeWidth={3} />
          </div>
        ) : null}
      </div>
    </motion.button>
  );
}
