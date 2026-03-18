'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthForm } from '@/components/auth/AuthForm';
import { useApiMutation } from '@/hooks/auth/useApiMutation';
import Button from '@/components/ui/Button';
import { AuthPasswordField } from '@/components/auth/AuthPasswordField';

interface ResetBody {
  token: string;
  newPassword: string;
}

interface ResetResponse {
  success?: boolean;
  message?: string;
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { mutate, isLoading, error } = useApiMutation<ResetBody, ResetResponse>({
    url: '/auth/reset-password',
    onSuccess: () => {
      router.push('/auth/login');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    if (!token) {
      setLocalError('Falta el token. Usá el enlace que te enviamos por email.');
      return;
    }
    if (password.length < 8) {
      setLocalError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }
    mutate({ token, newPassword: password });
  };

  const formError = localError ?? error ?? undefined;

  if (!token) {
    return (
      <AuthShell title="Enlace inválido">
        <p className="text-sm text-gray-600 mb-4">
          Falta el token de restablecimiento. Usá el enlace que te enviamos por
          email.
        </p>
        <Link href="/auth/forgot-password">
          <Button variant="brandRed" size="md" fullWidth>
            Solicitar nuevo enlace
          </Button>
        </Link>
        <p className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
            Volver al inicio
          </Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Nueva contraseña"
      subtitle="Elegí una contraseña segura."
    >
      <AuthForm onSubmit={handleSubmit} isLoading={isLoading} error={formError}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <AuthPasswordField
            id="reset-password"
            name="newPassword"
            label="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            required
            disabled={isLoading}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.25 }}
        >
          <AuthPasswordField
            id="reset-confirm"
            name="confirmPassword"
            label="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetí la contraseña"
            required
            disabled={isLoading}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.25 }}
        >
          <Button
            type="submit"
            variant="brandRed"
            size="md"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Cambiar contraseña'}
          </Button>
        </motion.div>
      </AuthForm>
      <p className="text-center text-sm text-gray-600 mt-6">
        <Link href="/auth/login" className="text-[#Ed3237] hover:underline">
          Volver al login
        </Link>
      </p>
      <p className="text-center mt-4">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
          Volver al inicio
        </Link>
      </p>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthShell>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg" />
          </div>
        </AuthShell>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
