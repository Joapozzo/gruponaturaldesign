'use client';

import React from 'react';
import Link from 'next/link';
import { formatPrice } from '@/app/utils/productHelpers';
import type { OrderItemLine } from '@/app/types/profile.types';

interface OrderItemRowProps {
  item: OrderItemLine;
}

/**
 * Una línea de ítem dentro de un pedido.
 */
export function OrderItemRow({ item }: OrderItemRowProps) {
  const href = item.productSlug?.trim()
    ? `/producto/${encodeURIComponent(item.productSlug.trim())}`
    : null;

  const title = (
    <>
      {href ? (
        <Link
          href={href}
          className="text-red-600 hover:text-red-700 underline-offset-2 hover:underline font-medium"
        >
          {item.productName}
        </Link>
      ) : (
        <span className="font-medium text-gray-900">{item.productName}</span>
      )}
    </>
  );

  return (
    <div className="flex justify-between items-start gap-2 py-2 border-b border-gray-100 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-900">{title}</p>
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
