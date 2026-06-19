'use client';

import type { CustomerOrderStatus } from '@/app/validation/cuentaPedidos.schema';
import {
  ORDER_STATUS_STYLES,
  SUBTLE_STATUS_STYLES,
} from '@/app/utils/cuentaPedidosDisplay';

interface OrderStatusBadgeProps {
  status: CustomerOrderStatus;
  label: string;
  subtle?: boolean;
  className?: string;
}

export function OrderStatusBadge({
  status,
  label,
  subtle = false,
  className = '',
}: OrderStatusBadgeProps) {
  const styles = subtle ? SUBTLE_STATUS_STYLES : ORDER_STATUS_STYLES;
  const variant = styles[status] ?? styles.pendiente_confirmacion;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap ${variant} ${className}`}
    >
      {label}
    </span>
  );
}
