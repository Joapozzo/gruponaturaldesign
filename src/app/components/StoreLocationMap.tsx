'use client';

import { cn } from '@/lib/utils';
import {
  STORE_LOCATION_MAP_EMBED_URL,
  STORE_LOCATION_MAP_TITLE,
} from '@/app/utils/constants';

interface StoreLocationMapProps {
  className?: string;
  /** Tailwind min-height class, e.g. `min-h-[200px]` */
  minHeightClass?: string;
  /** Showroom-style hover caption (contact page). */
  showHoverCaption?: boolean;
}

export function StoreLocationMap({
  className,
  minHeightClass = 'min-h-[200px]',
  showHoverCaption = false,
}: StoreLocationMapProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm group',
        minHeightClass,
        className
      )}
    >
      <iframe
        src={STORE_LOCATION_MAP_EMBED_URL}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={cn(
          'absolute inset-0 h-full w-full',
          showHoverCaption && 'grayscale transition-all duration-500 group-hover:grayscale-0'
        )}
        title={STORE_LOCATION_MAP_TITLE}
      />
      {showHoverCaption ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-red-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-3 left-3 bg-white px-2 py-1.5 shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-xs font-semibold text-gray-800">📍 Nuestro Showroom</p>
          </div>
        </>
      ) : null}
    </div>
  );
}
