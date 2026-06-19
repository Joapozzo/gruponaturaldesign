'use client';

import React from 'react';
import Link from 'next/link';

const DEFAULT_MAYORISTA_TEXT =
  'SI TÚ PEDIDO SUPERA LAS 20 UNIDADES TENES PRECIOS MAYORISTAS!';

interface AnnouncementBannerProps {
  /** Contenido custom. Si no se pasa, se muestra el mensaje mayorista por defecto. */
  children?: React.ReactNode;
  /** Clases adicionales para el contenedor */
  className?: string;
}

/**
 * Banner horizontal full width, arriba del hero (no sigue el scroll).
 * CTA a /mayorista. Reutilizable con children.
 */
export default function AnnouncementBanner({
  children,
  className = '',
}: AnnouncementBannerProps) {
  return (
    <Link
      href="/mayorista"
      className={`block w-full bg-black text-white text-center py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 text-xs sm:text-sm md:text-base font-semibold shadow-md underline underline-offset-2 decoration-white/80 hover:bg-neutral-900 transition-colors ${className}`}
      role="banner"
    >
      {children ?? DEFAULT_MAYORISTA_TEXT}
    </Link>
  );
}
