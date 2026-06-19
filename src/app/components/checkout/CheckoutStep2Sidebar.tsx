'use client';

import { MapPin, Store, Truck } from 'lucide-react';
import type { CartItem } from '@/app/types/cart';
import { formatPrice } from '@/app/utils/productHelpers';
import { CheckoutActionBar } from '@/app/components/checkout/CheckoutActionBar';

type Props = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  total: number;
  /** Cotización de envío (ARS), si ya se calculó en el paso 2. */
  shippingQuote?: number;
  onContinue: () => void;
  onBack: () => void;
  /** Deshabilita CONTINUAR (p. ej. envío sin cotizar). */
  continueDisabled?: boolean;
  /** Texto nativo al hover (tooltip) cuando está deshabilitado. */
  continueTitle?: string;
  backLabel?: string;
  continueLabel?: string;
  backDisabled?: boolean;
};

export function CheckoutStep2Sidebar({
  items,
  itemCount,
  subtotal,
  total,
  shippingQuote,
  onContinue,
  onBack,
  continueDisabled = false,
  continueTitle,
  backLabel,
  continueLabel,
  backDisabled = false,
}: Props) {
  return (
    <div className="w-full lg:w-80 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
      <h2 className="text-xs sm:text-sm font-bold text-black">RESUMEN DEL PEDIDO</h2>

      <div className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 rounded-lg space-y-3">
        <div className="space-y-1.5 sm:space-y-2 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
              <span className="text-gray-500">{item.quantity}x</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-black line-clamp-1">{item.product.nombre}</p>
                {item.especificaciones ? (
                  <p className="text-gray-500 text-[9px] sm:text-[10px] line-clamp-1">{item.especificaciones}</p>
                ) : null}
                {item.bordado ? (
                  <p className="text-[9px] sm:text-[10px] text-red-600 font-semibold mt-0.5">✨ Bordado: SÍ</p>
                ) : null}
              </div>
              <span className="font-semibold text-black">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-200 space-y-1.5">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600">
            <span>Total de productos</span>
            <span className="font-semibold">{itemCount}</span>
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
            <span>Subtotal sin impuestos</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {shippingQuote != null && shippingQuote > 0 ? (
            <div className="flex justify-between text-[10px] sm:text-xs text-gray-600 pt-1">
              <span>Envío</span>
              <span>{formatPrice(shippingQuote)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-sm sm:text-base font-bold text-black pt-1.5 border-t border-gray-300">
            <span>{shippingQuote != null && shippingQuote > 0 ? 'TOTAL CON ENVÍO' : 'TOTAL'}</span>
            <span>{formatPrice(total + (shippingQuote ?? 0))}</span>
          </div>
        </div>
      </div>

      <div className="hidden lg:block bg-black text-white rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
        <h3 className="text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">MEDIOS DE ENVÍO</h3>
        <div className="text-[10px] sm:text-xs space-y-1.5 sm:space-y-2 text-gray-300">
          <div>
            <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />
              Dentro de Ciudad de Cba:
            </p>
            <p className="ml-2">Servicio de cadetería a coordinar con el vendedor</p>
            <p className="ml-2 text-gray-400">El costo corre por cuenta del cliente</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 shrink-0" aria-hidden />
              Interior de Cba. y Resto del país:
            </p>
            <p className="ml-2">A través de Correo Andreani</p>
            <p className="ml-2 text-gray-400">El costo corre por cuenta del cliente</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 shrink-0" aria-hidden />
              PICK UP:
            </p>
            <p className="ml-2">Coordina tu retiro por nuestro punto en Alta Cba.</p>
            <p className="ml-2">Te enviaremos las instrucciones de retiro por email.</p>
            {/* WhatsApp deshabilitado en checkout
            <p className="ml-2">
              Comunícate a través de WhatsApp al{' '}
              <a href={`https://wa.me/...`} ...>{WHATSAPP_PHONE_NUMBER}</a>
            </p>
            */}
          </div>
        </div>
      </div>

      <CheckoutActionBar
        onBack={onBack}
        onContinue={onContinue}
        backLabel={backLabel}
        continueLabel={continueLabel}
        backDisabled={backDisabled}
        continueDisabled={continueDisabled}
        continueTitle={continueTitle}
        className="mt-auto"
      />
    </div>
  );
}
