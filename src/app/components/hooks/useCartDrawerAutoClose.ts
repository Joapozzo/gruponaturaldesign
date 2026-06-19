'use client';

import { useEffect } from 'react';

interface UseCartDrawerAutoCloseOptions {
    isInCheckout: boolean;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Hook para cerrar automáticamente el drawer cuando estamos en checkout
 */
export const useCartDrawerAutoClose = ({
    isInCheckout,
    isOpen,
    onClose,
}: UseCartDrawerAutoCloseOptions): void => {
    useEffect(() => {
        if (isInCheckout && isOpen) {
            onClose();
        }
    }, [isInCheckout, isOpen, onClose]);
};

