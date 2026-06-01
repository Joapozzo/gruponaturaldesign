'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { CartItem } from '@/app/types/cart';
import { ProductImage } from '../product-card/components/ProductImage';
import QuantityControlsUI from '@/app/components/ui/QuantityControls';
import { formatPrice } from '@/app/utils/productHelpers';

type Props = {
  item: CartItem;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  canAddMore: boolean;
  maxReached: boolean;
};

export function CheckoutCartItem({
  item,
  onQuantityChange,
  onRemove,
  canAddMore,
  maxReached,
}: Props) {
  const { product, quantity, subtotal, especificaciones, bordado = false } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 sm:p-4 relative hover:border-gray-300 transition-shadow"
    >
      <div className="flex gap-3 sm:gap-4 items-stretch min-h-[80px] sm:min-h-[88px]">
        <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <ProductImage
            src={product.imagen}
            alt={product.nombre || 'Producto'}
            className="w-full h-full"
            fill
            sizes="(max-width: 768px) 80px, 96px"
            objectFit="cover"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 pr-6">
              <h3 className="font-semibold text-black text-sm sm:text-base leading-snug line-clamp-2">
                {product.nombre}
              </h3>
              {product.categoria ? (
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide mt-0.5">
                  {product.categoria}
                </p>
              ) : null}
              {especificaciones ? (
                <p className="text-[10px] sm:text-xs text-gray-600 mt-1 line-clamp-2">
                  {especificaciones}
                </p>
              ) : null}
              {product.codigo ? (
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  Código: {product.codigo}
                </p>
              ) : null}
              {bordado ? (
                <p className="text-[10px] sm:text-xs text-red-600 font-semibold mt-0.5">
                  Bordado: SÍ
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-black hover:bg-gray-100 p-1 rounded transition-colors"
              aria-label="Eliminar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-end justify-between gap-2 mt-2">
            <div>
              <p className="text-sm sm:text-base font-bold text-black tabular-nums">
                {formatPrice(subtotal)}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 tabular-nums">
                {formatPrice(product.precioLista)} c/u
              </p>
            </div>
            <QuantityControlsUI
              quantity={quantity}
              onIncrement={() => onQuantityChange(product.id, quantity + 1)}
              onDecrement={() => onQuantityChange(product.id, quantity - 1)}
              canAddMore={canAddMore}
              maxReached={maxReached}
              className="!p-0.5 !space-x-1 [&_button]:!w-6 [&_button]:!h-6 [&_span]:!w-5 [&_span]:!text-[11px] [&_svg]:!w-2.5 [&_svg]:!h-2.5 sm:!p-1 sm:!space-x-1.5 sm:[&_button]:!w-8 sm:[&_button]:!h-8 sm:[&_span]:!w-8 sm:[&_span]:!text-sm sm:[&_svg]:!w-3.5 sm:[&_svg]:!h-3.5"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
