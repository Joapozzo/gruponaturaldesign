'use client';

import { OrderCardSkeleton } from '../orders/OrderCardSkeleton';

export function ProfilePageSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 lg:items-start">
      <div className="lg:col-span-4 h-40 bg-white rounded-lg border border-gray-200" />
      <div className="lg:col-span-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="h-12 border-b border-gray-100 bg-gray-50/50" />
        <div className="p-4 sm:p-6 space-y-3">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      </div>
    </div>
  );
}
