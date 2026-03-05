'use client';

import React from 'react';
import { formatPrice } from '@/app/utils/productHelpers';
import type { OrderItemLine } from '@/app/types/profile.types';

interface OrderItemRowProps {
  item: OrderItemLine;
}

/**
 * Una línea de ítem dentro de un pedido.
 */
export function OrderItemRow({ item }: OrderItemRowProps) {
  return (
    <div className="flex justify-between items-start gap-2 py-2 border-b border-gray-100 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{item.productName}</p>
        {item.especificaciones && (
          <p className="text-xs text-gray-500 mt-0.5">{item.especificaciones}</p>
        )}
        <p className="text-xs text-gray-500 mt-0.5">
          {item.quantity} × {formatPrice(item.unitPrice)}
        </p>
      </div>
      <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
        {formatPrice(item.subtotal)}
      </p>
    </div>
  );
}
