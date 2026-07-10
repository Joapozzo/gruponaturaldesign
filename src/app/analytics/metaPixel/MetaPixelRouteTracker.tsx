'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackMetaPageView } from '@/app/analytics/metaPixel/metaPixel.client';
import { isMetaPixelEnabled } from '@/app/analytics/metaPixel/metaPixel.config';

/** Re-dispara PageView en navegación client-side (App Router). */
export function MetaPixelRouteTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isMetaPixelEnabled()) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    trackMetaPageView();
  }, [pathname]);

  return null;
}
