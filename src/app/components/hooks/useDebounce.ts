import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * @param value - El valor a debounce
 * @param delay - El delay en milisegundos (default: 300ms)
 * @returns El valor debounceado
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Crear un timer que actualiza el valor después del delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Limpiar el timer si el value cambia antes de que expire el delay
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

