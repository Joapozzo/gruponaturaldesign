'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { applyActionCode, confirmPasswordReset, checkActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthShell } from '@/components/auth/AuthShell';
import Button from '@/components/ui/Button';
import { AuthPasswordField } from '@/components/auth/AuthPasswordField';
import Link from 'next/link';

type ActionStatus = 'loading' | 'success' | 'error' | 'form';
type ActionMode = 'verifyEmail' | 'resetPassword' | 'recoverEmail' | null;

function ActionContent() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get('mode') as ActionMode) || null;
  const oobCode = searchParams.get('oobCode');
  const apiKey = searchParams.get('apiKey');

  const [status, setStatus] = useState<ActionStatus>('loading');
  const [message, setMessage] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!oobCode || !apiKey) {
      setStatus('error');
      setMessage('Enlace inválido o expirado. Solicitá uno nuevo.');
      return;
    }
    if (mode === 'verifyEmail') {
      checkActionCode(auth, oobCode)
        .then(() => setStatus('form'))
        .catch(() => {
          setStatus('error');
          setMessage('El enlace expiró o ya fue usado. Solicitá otro desde el registro o el login.');
        });
      return;
    }
    if (mode === 'resetPassword') {
      checkActionCode(auth, oobCode)
        .then(() => setStatus('form'))
        .catch(() => {
          setStatus('error');
          setMessage('El enlace expiró o ya fue usado. Solicitá otro desde "¿Olvidaste tu contraseña?".');
        });
      return;
    }
    if (mode === 'recoverEmail') {
      applyActionCode(auth, oobCode)
        .then(() => {
          setStatus('success');
          setMessage('Email recuperado correctamente.');
        })
        .catch(() => {
          setStatus('error');
          setMessage('Enlace inválido o expirado.');
        });
      return;
    }
    setStatus('error');
    setMessage('Acción no reconocida.');
  }, [mode, oobCode, apiKey]);

  const handleVerifyEmail = async () => {
    if (!oobCode) return;
    setSubmitting(true);
    applyActionCode(auth, oobCode)
      .then(() => {
        setStatus('success');
        setMessage('Email verificado. Ya podés iniciar sesión.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'El enlace expiró o ya fue usado. Solicitá otro desde el registro o el login.');
      })
      .finally(() => setSubmitting(false));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }
    if (!oobCode) return;
    setSubmitting(true);
    confirmPasswordReset(auth, oobCode, newPassword)
      .then(() => {
        setStatus('success');
        setMessage('Contraseña actualizada. Iniciá sesión con tu nueva contraseña.');
      })
      .catch((err) => {
        setPasswordError(err.message || 'No se pudo actualizar. El enlace pudo haber expirado.');
      })
      .finally(() => setSubmitting(false));
  };

  if (status === 'loading') {
    return (
      <AuthShell title="Procesando...">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded-lg" />
          <div className="h-10 bg-gray-200 rounded-lg" />
        </div>
      </AuthShell>
    );
  }

  if (status === 'form' && mode === 'verifyEmail') {
    return (
      <AuthShell
        title="Verificá tu email"
        subtitle="Confirmá tu dirección de correo para asegurar tu cuenta."
      >
        <div className="space-y-4">
          <Button
            type="button"
            variant="brandRed"
            size="md"
            fullWidth
            disabled={submitting}
            onClick={handleVerifyEmail}
          >
            {submitting ? 'Verificando...' : 'Verificar email'}
          </Button>
          <p className="text-center">
            <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
              Volver a iniciar sesión
            </Link>
          </p>
        </div>
      </AuthShell>
    );
  }

  if (status === 'form' && mode === 'resetPassword') {
    return (
      <AuthShell title="Nueva contraseña" subtitle="Elegí una contraseña de al menos 6 caracteres">
        <form onSubmit={handleResetPassword} className="space-y-4">
          {passwordError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
              {passwordError}
            </div>
          )}
          <AuthPasswordField
            id="new-password"
            name="newPassword"
            label="Nueva contraseña"
            placeholder="********"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={submitting}
            minLength={6}
          />
          <AuthPasswordField
            id="confirm-password"
            name="confirmPassword"
            label="Confirmar contraseña"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={submitting}
            minLength={6}
          />
          <Button type="submit" variant="brandRed" size="md" fullWidth disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar contraseña'}
          </Button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={status === 'success' ? 'Listo' : 'Error'}
      subtitle={message}
    >
      <div className="space-y-4">
        <Link href="/auth/login" className="block w-full">
          <Button variant="brandRed" size="md" fullWidth>
            Ir a iniciar sesión
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

export default function AuthActionPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Cargando...">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg" />
          </div>
        </AuthShell>
      }
    >
      <ActionContent />
    </Suspense>
  );
}
