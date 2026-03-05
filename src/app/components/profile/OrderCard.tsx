'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import { formatPrice } from '@/app/utils/productHelpers';
import { OrderItemRow } from './OrderItemRow';
import type { OrderSummary, OrderStatus } from '@/app/types/profile.types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  en_preparacion: 'En preparación',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  pendiente: 'bg-amber-50 text-amber-800',
  confirmado: 'bg-blue-50 text-blue-800',
  en_preparacion: 'bg-indigo-50 text-indigo-800',
  enviado: 'bg-purple-50 text-purple-800',
  entregado: 'bg-green-50 text-green-800',
  cancelado: 'bg-gray-100 text-gray-600',
};

interface OrderCardProps {
  order: OrderSummary;
}

/**
 * Tarjeta de un pedido: número, fecha, estado, total y líneas (colapsables).
 */
export function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const statusStyle = STATUS_STYLE[order.status] ?? STATUS_STYLE.pendiente;
  const statusLabel = STATUS_LABELS[order.status] ?? order.status;

  return (
    <article
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      aria-labelledby={`order-${order.id}-title`}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-3 text-left hover:bg-gray-50/80 transition-colors"
        aria-expanded={expanded}
        aria-controls={`order-${order.id}-items`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-gray-500" aria-hidden />
          </div>
          <div className="min-w-0">
            <h3 id={`order-${order.id}-title`} className="text-sm font-semibold text-gray-900">
              Pedido {order.numero}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{order.fecha}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`rounded-md px-2 py-1 text-xs font-medium ${statusStyle}`}>
            {statusLabel}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(order.total)}
          </span>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" aria-hidden />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" aria-hidden />
          )}
        </div>
      </button>
      <div
        id={`order-${order.id}-items`}
        role="region"
        aria-label={`Detalle del pedido ${order.numero}`}
        className={`border-t border-gray-100 ${expanded ? 'block' : 'hidden'}`}
      >
        <div className="px-4 sm:px-6 py-3 bg-gray-50/50">
          {order.items.map((item) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
          <div className="flex justify-end pt-2 mt-2 border-t border-gray-200">
            <span className="text-sm font-semibold text-gray-900">
              Total {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
