'use client';

import React from 'react';

interface ProfilePageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Para admin: ej. "Panel" para no duplicar "Perfil" */
  className?: string;
}

/**
 * Contenedor reutilizable para páginas de perfil (usuario y admin).
 * Una sola responsabilidad: layout y título.
 */
export function ProfilePageLayout({
  children,
  title,
  subtitle,
  className = '',
}: ProfilePageLayoutProps) {
  return (
    <div className={`w-full bg-gray-50 min-h-[60vh] ${className}`}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <header className="mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}
