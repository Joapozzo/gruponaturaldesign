'use client';

import React from 'react';
import { OrderCard } from './OrderCard';
import type { OrderSummary } from '@/app/types/profile.types';

interface ProfileOrdersSectionProps {
  orders: OrderSummary[];
  /** Título de la sección (ej. "Mis pedidos" o "Pedidos del cliente"). */
  title?: string;
  emptyMessage?: string;
}

/**
 * Sección que lista los pedidos del usuario.
 * Reutilizable en perfil y en admin (vista de un cliente).
 */
export function ProfileOrdersSection({
  orders,
  title = 'Mis pedidos',
  emptyMessage = 'Aún no tenés pedidos.',
}: ProfileOrdersSectionProps) {
  return (
    <section aria-labelledby="orders-section-heading">
      <h2 id="orders-section-heading" className="text-lg font-semibold text-gray-900 mb-4">
        {title}
      </h2>
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="space-y-3 list-none p-0 m-0">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
