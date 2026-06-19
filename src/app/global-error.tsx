'use client';

import { useEffect } from 'react';

/**
 * Error boundary a nivel raíz: captura errores que escapan del árbol (incl. layout).
 * Evita pantalla en blanco o crash total; muestra mensaje amigable y opción de recargar.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="es-AR">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '420px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Algo salió mal</h1>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Ocurrió un error inesperado. Por favor intentá recargar la página o volvé más tarde.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
            }}
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
