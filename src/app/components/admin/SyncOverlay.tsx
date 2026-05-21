'use client';

import { Loader2 } from 'lucide-react';

interface SyncOverlayProps {
  isOpen: boolean;
  title?: string;
  message?: string;
}

export function SyncOverlay({
  isOpen,
  title = 'Procesando...',
  message = 'Por favor espera.',
}: SyncOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-4 border border-gray-200">
        <Loader2 className="w-12 h-12 animate-spin text-gray-700" />
        <p className="text-base font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 text-center max-w-sm">{message}</p>
      </div>
    </div>
  );
}