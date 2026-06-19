'use client';

import {
  getNextPasswordRule,
  getPasswordRuleChecks,
  type PasswordSchemaOptions,
} from '@/lib/schemas/password.schema';
import { Check } from 'lucide-react';

interface PasswordRulesProps {
  password: string;
  options?: PasswordSchemaOptions;
  className?: string;
  /** 'all' lista todas; 'next' solo la primera regla pendiente */
  mode?: 'all' | 'next';
}

/** Muestra las reglas de contraseña y las va completando al tipear (minimalista) */
export function PasswordRules({ password, options, className = '', mode = 'all' }: PasswordRulesProps) {
  if (mode === 'next') {
    const next = getNextPasswordRule(password, options);
    if (!next) return null;

    return (
      <p className={`text-xs text-red-500 ${className}`} role="status" aria-live="polite">
        {next.label}
      </p>
    );
  }

  const checks = getPasswordRuleChecks(password, options);

  return (
    <ul
      className={`flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 ${className}`}
      role="status"
      aria-live="polite"
    >
      {checks.map(({ id, label, ok }) => (
        <li
          key={id}
          className={`flex items-center gap-1 ${ok ? 'text-green-600' : ''}`}
        >
          <span className="flex h-4 w-4 shrink-0 items-center justify-center">
            {ok ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <span className="h-2 w-2 rounded-full bg-gray-300" />}
          </span>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
