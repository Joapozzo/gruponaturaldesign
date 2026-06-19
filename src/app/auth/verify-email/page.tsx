'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import Button from '@/components/ui/Button';
import {
  AUTH_CALLBACK_PARAM,
  getSafeCallbackPath,
  resolvePostLoginDestination,
  withAuthCallback,
} from '@/lib/auth-callback-url';
import toast from 'react-hot-toast';

const NOT_VERIFIED_MESSAGE =
  'Tu email todavía no está verificado. Abrí el enlace del correo (revisá spam) o reenviá el enlace.';

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded-lg" />
      <div className="h-10 bg-gray-200 rounded-lg" />
    </div>
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackPath(searchParams.get(AUTH_CALLBACK_PARAM));
  const { firebaseUser, sessionState, isLoading, resendVerificationEmail, refreshSessionState, logout } = useAuth();
  const [resending, setResending] = useState(false);
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!firebaseUser) {
      router.replace(withAuthCallback('/auth/login', callbackUrl));
      return;
    }
    if (sessionState && !sessionState.needsEmailVerification) {
      if (sessionState.needsOnboarding) {
        router.replace(withAuthCallback('/auth/onboarding', callbackUrl));
      } else {
        router.replace(resolvePostLoginDestination(sessionState.role, callbackUrl));
      }
    }
  }, [firebaseUser, sessionState, isLoading, router, callbackUrl]);

  const handleYaRevisé = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setChecking(true);
    setCheckMessage(null);
    try {
      await user.reload();
      await user.getIdToken(true);
      const state = await refreshSessionState();
      const stillUnverified =
        !auth.currentUser?.emailVerified || state?.needsEmailVerification === true;
      if (stillUnverified) {
        setCheckMessage(NOT_VERIFIED_MESSAGE);
        toast.error(NOT_VERIFIED_MESSAGE);
      }
    } catch {
      const msg = 'No pudimos verificar el estado. Intentá de nuevo en unos segundos.';
      setCheckMessage(msg);
      toast.error(msg);
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerificationEmail();
      setSent(true);
      setCheckMessage(null);
    } catch {
      toast.error('No pudimos reenviar el enlace. Intentá de nuevo.');
    } finally {
      setResending(false);
    }
  };

  const handleUsarOtraCuenta = async () => {
    setLeaving(true);
    try {
      await logout();
      router.replace(withAuthCallback('/auth/login', callbackUrl));
    } catch {
      router.replace(withAuthCallback('/auth/login', callbackUrl));
    } finally {
      setLeaving(false);
    }
  };

  if (isLoading || !firebaseUser) {
    return (
      <AuthShell title="Cargando...">
        <LoadingSkeleton />
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Verificá tu email">
      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-600">
          Enviamos un enlace a <strong>{firebaseUser.email}</strong>. Abrí el correo, hacé clic en el enlace y después
          confirmá acá. Si no llega, revisá spam o reenviá el enlace.
        </p>
        {checkMessage && (
          <div
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-left text-sm text-amber-900"
            role="alert"
          >
            {checkMessage}
          </div>
        )}
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
        <button
          type="button"
          onClick={handleUsarOtraCuenta}
          disabled={leaving}
          className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          {leaving ? 'Saliendo...' : 'Usar otra cuenta'}
        </button>
      </div>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Cargando...">
          <LoadingSkeleton />
        </AuthShell>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
