'use client';

import { useState, useCallback } from 'react';

export interface AuthFormState {
  email: string;
  password: string;
  confirmPassword?: string;
}

export function useAuthForm(initial: Partial<AuthFormState> = {}) {
  const [email, setEmail] = useState(initial.email ?? '');
  const [password, setPassword] = useState(initial.password ?? '');
  const [confirmPassword, setConfirmPassword] = useState(
    initial.confirmPassword ?? ''
  );
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    reset,
  };
}
