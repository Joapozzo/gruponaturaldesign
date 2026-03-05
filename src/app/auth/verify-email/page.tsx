'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import Button from '@/app/components/ui/Button';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { firebaseUser, sessionState, isLoading, resendVerificationEmail, refreshSessionState, logout } = useAuth();
  const [resending, setResending] = useState(false);
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!firebaseUser) {
      router.replace('/auth/login');
      return;
    }
    if (sessionState && !sessionState.needsEmailVerification) {
      if (sessionState.needsOnboarding) router.replace('/auth/onboarding');
      else router.replace(sessionState.role === 'ADMIN' ? '/admin/dashboard' : '/');
    }
  }, [firebaseUser, sessionState, isLoading, router]);

  const handleYaRevisé = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setChecking(true);
    try {
      await user.reload();
      await user.getIdToken(true);
      await refreshSessionState();
    } catch {
      // ignore
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerificationEmail();
      setSent(true);
    } catch {
      // ignore
    } finally {
      setResending(false);
    }
  };

  if (isLoading || !firebaseUser) {
    return (
      <AuthShell title="Cargando...">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded-lg" />
          <div className="h-10 bg-gray-200 rounded-lg" />
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Email no verificado"
      subtitle="Tu cuenta aún no está verificada."
    >
      <div className="space-y-4 text-center">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <p className="font-medium">Tu email no está verificado</p>
          <p className="mt-0.5 text-amber-700">
            Enviamos un enlace a <strong>{firebaseUser.email}</strong>. Abrí el correo, hacé clic en el enlace y después tocá &quot;Ya revisé mi email&quot;.
          </p>
        </div>
        <p className="text-sm text-gray-600">
          Si no ves el correo, revisá la carpeta de spam o solicitá otro enlace.
        </p>
        <Button
          type="button"
          variant="brandRed"
          size="md"
          fullWidth
          disabled={checking}
          onClick={handleYaRevisé}
        >
          {checking ? 'Verificando...' : 'Ya revisé mi email'}
        </Button>
        <Button
          type="button"
          variant="brandRedOutline"
          size="md"
          fullWidth
          disabled={resending}
          onClick={handleResend}
        >
          {resending ? 'Enviando...' : sent ? 'Enlace reenviado' : 'Reenviar enlace'}
        </Button>
        <div className="flex flex-col gap-2 text-center">
          <Link href="/auth/login" className="text-sm text-[#Ed3237] hover:underline">
            Volver a iniciar sesión
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </AuthShell>
  );
}
