'use client';

import React from 'react';
import { User, Mail } from 'lucide-react';
import type { ProfileUser } from '@/app/types/profile.types';

interface ProfileUserCardProps {
  user: ProfileUser;
  /** Si true, muestra badge de rol (útil en admin). */
  showRole?: boolean;
}

/**
 * Tarjeta de solo lectura con datos del usuario.
 * Reutilizable en perfil de usuario y en vistas de admin.
 */
export function ProfileUserCard({ user, showRole = true }: ProfileUserCardProps) {
  const fullName = [user.nombre, user.apellido].filter(Boolean).join(' ') || '—';

  return (
    <section
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      aria-labelledby="profile-user-heading"
    >
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h2 id="profile-user-heading" className="text-sm font-semibold text-gray-700">
          Datos de la cuenta
        </h2>
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nombre</p>
            <p className="text-gray-900 font-medium mt-0.5">{fullName}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Mail className="w-5 h-5 text-gray-500" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
            <p className="text-gray-900 font-medium mt-0.5 break-all">{user.email}</p>
          </div>
        </div>
        {showRole && user.role && (
          <div className="pt-2">
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 capitalize">
              {user.role.toLowerCase()}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
