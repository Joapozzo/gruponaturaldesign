'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthShell } from '@/components/auth/AuthShell';
import { formatAuthError } from '@/lib/auth-errors';
import toast from 'react-hot-toast';
import { AuthForm } from '@/components/auth/AuthForm';
import Button from '@/app/components/ui/Button';
import { TextField } from '@/app/components/producto/fields/TextField';

function getActionUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/action`;
  }
  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3002';
  return `${base}/auth/action`;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      const msg = 'Ingresá tu email.';
      setError(msg);
      toast.error(msg);
      return;
    }
    setLoading(true);
    try {
      const actionCodeSettings = {
        url: getActionUrl(),
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, trimmed, actionCodeSettings);
      setSent(true);
    } catch (err: unknown) {
      const msg = formatAuthError(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthShell
        title="Revisá tu correo"
        subtitle="Te enviamos un enlace para restablecer tu contraseña. Si no aparece, revisá la carpeta de spam."
      >
        <div className="space-y-4">
          <Link href="/auth/login" className="block w-full">
            <Button variant="brandRed" size="md" fullWidth>
              Volver a iniciar sesión
            </Button>
          </Link>
          <Link href="/auth/login" className="block w-full">
            <Button variant="brandRedOutline" size="md" fullWidth>
              Ya revisé mi email
            </Button>
          </Link>
          <p className="text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
              Volver al inicio
            </Link>
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="¿Olvidaste tu contraseña?"
      subtitle="Ingresá tu email y te enviamos un enlace para restablecerla."
    >
      <AuthForm onSubmit={handleSubmit} isLoading={loading} error={error}>
        <TextField
          id="forgot-email"
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          disabled={loading}
        />
        <Button type="submit" variant="brandRed" size="md" fullWidth disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </Button>
      </AuthForm>
      <p className="text-center mt-4">
        <Link href="/auth/login" className="text-sm text-[#Ed3237] hover:underline">
          Volver a iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}
