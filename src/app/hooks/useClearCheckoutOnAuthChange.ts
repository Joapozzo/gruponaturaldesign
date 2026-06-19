'use client';

import { useEffect, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { clearCheckoutSession } from '@/app/stores/cartStore';

/**
 * Limpia sesión de checkout al cerrar sesión o cambiar de usuario Firebase.
 */
export function useClearCheckoutOnAuthChange() {
  const prevUidRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      const uid = user?.uid ?? null;

      if (prevUidRef.current !== undefined && prevUidRef.current !== uid) {
        clearCheckoutSession();
      }

      prevUidRef.current = uid;
    });

    return () => unsub();
  }, []);
}
