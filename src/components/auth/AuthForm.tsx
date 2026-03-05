'use client';

import React from 'react';

interface AuthFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function AuthForm({
  children,
  onSubmit,
  isLoading = false,
  error,
}: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
        >
          {error}
        </div>
      )}
      <fieldset disabled={isLoading} className="space-y-4 border-none p-0 m-0">
        {children}
      </fieldset>
    </form>
  );
}
