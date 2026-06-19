'use client';

import { useState, useEffect } from 'react';

/**
 * Hook para manejar el estado de montaje del componente
 * Útil para evitar problemas de hidratación en SSR
 */
export const useMounted = (): boolean => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted;
};

