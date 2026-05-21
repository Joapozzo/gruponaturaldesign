'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, ExternalLink, Loader2, Package } from 'lucide-react';
import { formatPrice } from '@/app/utils/productHelpers';
import { getMiPedido } from '@/app/services/cuentaPedidos.service';
import type { CuentaPedidoListItem } from '@/app/validation/cuentaPedidos.schema';
import {
  formatPedidoFechaPerfil,
  mapFormaPagoLabel,
  mapSyncStatusHint,
} from '@/app/utils/cuentaPedidosDisplay';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderItemRow } from '../OrderItemRow';

interface OrderCardProps {
  order: CuentaPedidoListItem;
}

export function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const syncHint = mapSyncStatusHint(order.syncStatus, order.sfactoryOrdenId);
  const formaLabel = mapFormaPagoLabel(order.formaPago);
  const isSubtleStatus =
    order.estado === 'fallido' || order.estado === 'vencido' || order.estado === 'cancelado';

  const detailQuery = useQuery({
    queryKey: ['cuenta', 'pedidos', order.id, 'detail'],
    queryFn: () => getMiPedido(order.id),
    enabled: expanded,
    staleTime: 5 * 60 * 1000,
  });

  const items = detailQuery.data?.items ?? [];

  return (
    <article
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      aria-labelledby={`order-${order.id}-title`}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-left hover:bg-gray-50/80 transition-colors"
        aria-expanded={expanded}
        aria-controls={`order-${order.id}-items`}
      >
        <div className="flex items-center gap-3 min-w-0 w-full sm:flex-1">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-gray-500" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              id={`order-${order.id}-title`}
              className="text-sm font-semibold text-gray-900 truncate"
            >
              Pedido {order.numero}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatPedidoFechaPerfil(order.fechaPedido)}
              {formaLabel ? ` · ${formaLabel}` : ''}
              {order.itemCount > 0
                ? ` · ${order.itemCount} producto${order.itemCount === 1 ? '' : 's'}`
                : ''}
            </p>
            {syncHint ? <p className="text-xs text-gray-400 mt-0.5">{syncHint}</p> : null}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto flex-shrink-0 sm:pl-0">
          <OrderStatusBadge
            status={order.estado}
            label={order.estadoLabel}
            subtle={isSubtleStatus}
          />
          <span className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</span>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden />
          )}
        </div>
      </button>

      {(order.canViewPaymentInstructions || order.trackingUrl) && (
        <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-2 border-b border-gray-50">
          {order.canViewPaymentInstructions ? (
            <Link
              href={`/checkout/instrucciones-pago?pedidoId=${order.id}`}
              className="text-xs font-medium text-red-600 hover:text-red-700 underline-offset-2 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Ver datos de pago
            </Link>
          ) : null}
          {order.trackingUrl ? (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-black"
              onClick={(e) => e.stopPropagation()}
            >
              Seguir envío
              <ExternalLink className="w-3 h-3" aria-hidden />
            </a>
          ) : null}
        </div>
      )}

      <div
        id={`order-${order.id}-items`}
        role="region"
        aria-label={`Detalle del pedido ${order.numero}`}
        className={expanded ? 'block' : 'hidden'}
      >
        <div className="px-4 sm:px-6 py-3 bg-gray-50/50">
          {detailQuery.isPending ? (
            <div className="flex items-center justify-center py-6 text-gray-500 text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
              Cargando detalle...
            </div>
          ) : detailQuery.isError ? (
            <p className="text-sm text-red-600 py-2">No se pudo cargar el detalle.</p>
          ) : (
            <>
              {items.map((item) => (
                <OrderItemRow
                  key={item.id}
                  item={{
                    id: String(item.id),
                    productName: item.productName,
                    productSlug: item.productSlug,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.subtotal,
                    especificaciones: item.especificaciones,
                  }}
                />
              ))}
              <div className="flex justify-end pt-2 mt-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-900">
                  Total {formatPrice(order.total)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
