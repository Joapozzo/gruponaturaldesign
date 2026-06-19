'use client';

import type { ShippingTrackingEvent } from '@/app/validation/shippingTracking.schema';

interface ShippingTrackingTimelineProps {
  events: ShippingTrackingEvent[];
  trackingNumber: string;
}

export function ShippingTrackingTimeline({ events, trackingNumber }: ShippingTrackingTimelineProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-neutral-600 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
        No hay eventos de seguimiento para <span className="font-mono font-medium">{trackingNumber}</span>.
        El envío puede estar recién registrado; probá más tarde o abrí el sitio del transportista.
      </p>
    );
  }

  return (
    <ol className="space-y-0 border-l-2 border-neutral-200 ml-2">
      {events.map((ev, idx) => (
        <li key={`${ev.date}-${ev.statusId}-${idx}`} className="relative pl-5 pb-5 last:pb-0">
          <span
            className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--red-dark)]"
            aria-hidden
          />
          <p className="text-sm font-semibold text-neutral-900">{ev.status || 'Sin descripción'}</p>
          {ev.date ? <p className="text-xs text-neutral-500 mt-0.5">{ev.date}</p> : null}
          {ev.facility ? (
            <p className="text-xs text-neutral-600 mt-0.5">{ev.facility}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
