import { useEffect, RefObject } from 'react';

/**
 * Hook para detectar clicks fuera de un elemento
 */
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
    ref: RefObject<T | null>,
    callback: () => void,
    isEnabled: boolean = true
) => {
    useEffect(() => {
        if (!isEnabled) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback, isEnabled]);
};

