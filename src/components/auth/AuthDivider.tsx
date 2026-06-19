'use client';

import React from 'react';

export function AuthDivider() {
  return (
    <div className="relative flex items-center gap-3 my-4">
      <span className="flex-1 h-px bg-gray-200" aria-hidden />
      <span className="text-xs text-gray-500 font-medium">
        o continúa con
      </span>
      <span className="flex-1 h-px bg-gray-200" aria-hidden />
    </div>
  );
}
