'use client';

import React from 'react';
import { GoogleIcon } from './GoogleIcon';

export type SocialProvider = 'google';

interface SocialButtonProps {
  provider: SocialProvider;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function SocialButton({
  provider,
  label,
  onClick,
  disabled = false,
}: SocialButtonProps) {
  if (provider === 'google') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-3 px-6 py-2.5 text-sm font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <GoogleIcon className="shrink-0" />
        {label}
      </button>
    );
  }
  return null;
}
