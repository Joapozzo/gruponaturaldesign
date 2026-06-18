'use client';

import type { CartItem, CustomerData, ShippingData } from '@/app/types/cart';
import type { CuponAplicado } from '@/app/types/cupones';
import { formatPrice } from '@/app/utils/productHelpers';
import {
  type CheckoutPriceMode,
  resolveCartLineSubtotal,
} from '@/app/utils/checkoutPricing';
import { cn } from '@/lib/utils';

export interface OrderSummarySectionProps {
  customerData: CustomerData | null;
  shippingData: ShippingData | null;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  /** @deprecated Preferir `productsTotal` + `payTotal`. */
  total?: number;
  /** Subtotal productos según forma de pago (lista o transfer). */
  productsTotal?: number;
  /** Total a pagar (productos + envío − cupón). */
  payTotal?: number;
  /** Precio por línea en el resumen (default lista). */
  priceMode?: CheckoutPriceMode;
  /** Suma envío cotizado en checkout (solo envío a domicilio/sucursal). */
  shippingExtra?: number;
  cuponAplicado?: CuponAplicado | null;
  variant?: 'sidebar' | 'payment-footer';
}

function SummaryTotals({
  productsTotal,
  payTotal,
  shippingExtra,
  cuponAplicado,
  compact = false,
}: {
  productsTotal: number;
  payTotal: number;
  shippingExtra: number;
  cuponAplicado?: CuponAplicado | null;
  compact?: boolean;
}) {
  const rowClass = compact
    ? 'flex justify-between text-[11px] text-gray-500'
    : 'flex justify-between text-[10px] sm:text-xs text-gray-500';
  const valueClass = 'text-gray-700 tabular-nums';

  return (
    <div className={cn('space-y-1', compact ? 'pt-2' : 'pt-2 sm:pt-3 border-t border-gray-200')}>
      <div className={rowClass}>
        <span>Subtotal productos</span>
        <span className={valueClass}>{formatPrice(productsTotal)}</span>
      </div>
      {shippingExtra > 0 ? (
        <div className={rowClass}>
          <span>+ Envío</span>
          <span className={valueClass}>{formatPrice(shippingExtra)}</span>
        </div>
      ) : null}
      {cuponAplicado ? (
        <div className={rowClass}>
          <span>Cupón {cuponAplicado.codigo}</span>
          <span className={valueClass}>-{formatPrice(cuponAplicado.descuentoTotal)}</span>
        </div>
      ) : null}
      <div
        className={cn(
          'flex justify-between border-t border-gray-200',
          compact ? 'pt-2 text-sm' : 'pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 text-sm sm:text-base',
        )}
      >
        <span className="font-medium text-gray-600">Total</span>
        <span className="font-semibold text-gray-900 tabular-nums">{formatPrice(payTotal)}</span>
      </div>
    </div>
  );
}

function ProductsBlock({
  items,
  compact,
  priceMode = 'lista',
}: {
  items: CartItem[];
  compact?: boolean;
  priceMode?: CheckoutPriceMode;
}) {
  return (
    <div className={cn('space-y-1.5', compact ? '' : 'sm:space-y-2')}>
      <h3
        className={cn(
          'font-medium uppercase tracking-wide text-gray-500',
          compact ? 'text-[10px]' : 'text-xs sm:text-sm',
        )}
      >
        Productos ({items.length})
      </h3>
      <div className="space-y-1.5">
        {items.map((item, index) => (
          <div
            key={`${item.product.id}-${index}`}
            className={cn(
              'text-[10px] sm:text-xs',
              compact ? 'py-1 border-b border-gray-100 last:border-0' : 'bg-gray-50/80 p-1.5 sm:p-2 rounded',
            )}
          >
            <p className="font-medium text-gray-800">
              {index + 1}. {item.product.nombre}
            </p>
            {item.especificaciones ? (
              <p className="text-gray-500 text-[9px] sm:text-[10px] mt-0.5">{item.especificaciones}</p>
            ) : null}
            {item.bordado ? (
              <p className="text-gray-500 mt-0.5 text-[9px] sm:text-[10px]">Bordado</p>
            ) : null}
            <p className="text-gray-500 mt-0.5">
              {item.quantity} u. · {formatPrice(resolveCartLineSubtotal(item, priceMode))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomerBlock({
  customerData,
  compact,
}: {
  customerData: CustomerData | null;
  compact?: boolean;
}) {
  return (
    <div className="space-y-1">
      <h3
        className={cn(
          'font-medium uppercase tracking-wide text-gray-500',
          compact ? 'text-[10px]' : 'text-xs sm:text-sm',
        )}
      >
        Cliente
      </h3>
      <div className="text-[10px] sm:text-xs text-gray-600 space-y-0.5">
        <p>
          {customerData?.nombre} {customerData?.apellido}
        </p>
        <p>{customerData?.email}</p>
        <p>{customerData?.telefono}</p>
        {customerData?.empresa ? <p>{customerData.empresa}</p> : null}
      </div>
    </div>
  );
}

function ShippingBlock({
  shippingData,
  compact,
}: {
  shippingData: ShippingData | null;
  compact?: boolean;
}) {
  return (
    <div className="space-y-1">
      <h3
        className={cn(
          'font-medium uppercase tracking-wide text-gray-500',
          compact ? 'text-[10px]' : 'text-xs sm:text-sm',
        )}
      >
        Entrega
      </h3>
      <div className="text-[10px] sm:text-xs text-gray-600 space-y-0.5">
        {shippingData?.tipo === 'envio' ? (
          <>
            <p>
              {(shippingData.checkoutDelivery ?? 'homeDelivery') === 'agency'
                ? 'Retiro en sucursal'
                : 'Envío a domicilio'}
            </p>
            {(shippingData.checkoutDelivery ?? 'homeDelivery') === 'homeDelivery' ? (
              <>
                <p>{shippingData.direccion}</p>
                <p>
                  {shippingData.localidad}, {shippingData.provincia}
                </p>
              </>
            ) : shippingData.checkoutEnvio?.agencyLabel ? (
              <p>{shippingData.checkoutEnvio.agencyLabel}</p>
            ) : null}
            <p>CP {shippingData.codigo_postal}</p>
            {shippingData.checkoutProvider ? (
              <p>{shippingData.checkoutProvider === 'andreani' ? 'Andreani' : 'Correo Argentino'}</p>
            ) : null}
            {shippingData.fecha_entrega ? <p>{shippingData.fecha_entrega}</p> : null}
          </>
        ) : (
          <p>Retiro en tienda</p>
        )}
        {shippingData?.notas ? <p>{shippingData.notas}</p> : null}
      </div>
    </div>
  );
}

function PaymentFooterSummary({
  items,
  productsTotal,
  payTotal,
  shippingExtra,
  cuponAplicado,
  priceMode = 'lista',
}: {
  items: CartItem[];
  productsTotal: number;
  payTotal: number;
  shippingExtra: number;
  cuponAplicado?: CuponAplicado | null;
  priceMode?: CheckoutPriceMode;
}) {
  const manyProducts = items.length > 3;

  return (
    <div className="bg-gray-50 px-4 pt-3 pb-2">
      {items.length > 0 ? (
        <div className={cn('space-y-1', manyProducts && 'max-h-[20vh] overflow-y-auto')}>
          {items.map((item, index) => (
            <div
              key={`${item.product.id}-${index}`}
              className="flex justify-between gap-2 text-[11px] text-gray-600"
            >
              <span className="truncate">
                {item.quantity}x {item.product.nombre}
              </span>
              <span className="shrink-0 tabular-nums text-gray-700">
                {formatPrice(resolveCartLineSubtotal(item, priceMode))}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
        <div className="flex justify-between text-[11px] text-gray-500">
          <span>Subtotal productos</span>
          <span className="tabular-nums text-gray-700">{formatPrice(productsTotal)}</span>
        </div>
        {shippingExtra > 0 ? (
          <div className="flex justify-between text-[11px] text-gray-500">
            <span>+ Envío</span>
            <span className="tabular-nums text-gray-700">{formatPrice(shippingExtra)}</span>
          </div>
        ) : null}
        {cuponAplicado ? (
          <div className="flex justify-between text-[11px] text-gray-500">
            <span>Cupón {cuponAplicado.codigo}</span>
            <span className="tabular-nums text-gray-700">-{formatPrice(cuponAplicado.descuentoTotal)}</span>
          </div>
        ) : null}
        <div className="flex justify-between text-sm font-semibold text-gray-900 pt-1 border-t border-gray-200">
          <span>TOTAL</span>
          <span className="tabular-nums">{formatPrice(payTotal)}</span>
        </div>
      </div>
    </div>
  );
}

export default function OrderSummarySection({
  customerData,
  shippingData,
  items,
  total,
  productsTotal: productsTotalProp,
  payTotal: payTotalProp,
  priceMode = 'lista',
  shippingExtra = 0,
  cuponAplicado,
  variant = 'sidebar',
}: OrderSummarySectionProps) {
  const productsTotal = productsTotalProp ?? total ?? 0;
  const payTotal =
    payTotalProp ?? productsTotal + shippingExtra - (cuponAplicado?.descuentoTotal ?? 0);
  const isFooter = variant === 'payment-footer';

  if (isFooter) {
    return (
      <PaymentFooterSummary
        items={items}
        productsTotal={productsTotal}
        payTotal={payTotal}
        shippingExtra={shippingExtra}
        cuponAplicado={cuponAplicado}
        priceMode={priceMode}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <h2 className="text-xs sm:text-sm font-medium uppercase tracking-wide text-gray-500 mb-2 sm:mb-3">
        Resumen final
      </h2>

      <div className="max-h-[60vh] lg:max-h-[70vh] overflow-y-auto pr-2 space-y-2 sm:space-y-3 lg:min-w-0">
        <div className="bg-gray-50/80 border border-gray-200 p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3">
          <ProductsBlock items={items} priceMode={priceMode} />
        </div>

        <div className="bg-gray-50/80 border border-gray-200 p-3 sm:p-4 rounded-lg">
          <CustomerBlock customerData={customerData} />
        </div>

        <div className="bg-gray-50/80 border border-gray-200 p-3 sm:p-4 rounded-lg">
          <ShippingBlock shippingData={shippingData} />
        </div>

        <div className="bg-gray-50 border border-gray-200 p-3 sm:p-4 rounded-lg">
          <SummaryTotals
            productsTotal={productsTotal}
            payTotal={payTotal}
            shippingExtra={shippingExtra}
            cuponAplicado={cuponAplicado}
          />
        </div>
      </div>
    </div>
  );
}
