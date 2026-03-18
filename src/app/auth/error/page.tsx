'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import Button from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: 'Hay un problema de configuración. Contactá al administrador.',
  AccessDenied: 'No tenés permiso para acceder.',
  Verification: 'El enlace de verificación expiró o ya fue usado.',
  Default: 'Ocurrió un error. Intentá de nuevo.',
  CredentialsSignin: 'Credenciales inválidas. Revisá email y contraseña.',
  OAuthSignin: 'Error al iniciar con el proveedor.',
  OAuthCallback: 'Error al conectar con el proveedor.',
  OAuthCreateAccount: 'No se pudo crear la cuenta.',
  EmailCreateAccount: 'No se pudo crear la cuenta con ese email.',
  Callback: 'Error en el callback de autenticación.',
  OAuthAccountNotLinked:
    'Este email ya está asociado a otro método de inicio de sesión.',
  EmailSignin: 'Error al enviar el email.',
  SessionRequired: 'Iniciá sesión para continuar.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('error') ?? 'Default';
  const message =
    ERROR_MESSAGES[code] ?? ERROR_MESSAGES.Default ?? 'Ocurrió un error.';

  return (
    <AuthShell title="Error de autenticación">
      <div
        className="flex flex-col items-center text-center py-4"
        role="alert"
        aria-live="polite"
      >
        <AlertCircle className="w-14 h-14 text-red-600 mb-4" />
        <p className="text-sm text-gray-700 mb-6">{message}</p>
        <Link href="/auth/login" className="w-full">
          <Button variant="brandRed" size="md" fullWidth>
            Volver al login
          </Button>
        </Link>
        <p className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
            Volver al inicio
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Error">
          <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        </AuthShell>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
