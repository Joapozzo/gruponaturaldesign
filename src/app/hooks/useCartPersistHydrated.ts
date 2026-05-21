'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/app/stores/cartStore';

export function useCartPersistHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return useCartStore.persist?.hasHydrated() ?? false;
  });

  useEffect(() => {
    if (!useCartStore.persist) return;
    const unsub = useCartStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useCartStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return unsub;
  }, []);

  return hydrated;
}
