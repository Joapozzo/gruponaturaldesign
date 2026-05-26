'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { SocialButton } from '@/components/auth/SocialButton';
import { useAuthForm } from '@/hooks/auth/useAuthForm';
import Button from '@/components/ui/Button';
import { TextField } from '@/app/components/producto/fields/TextField';
import { AuthPasswordField } from '@/components/auth/AuthPasswordField';
import { useAuth } from '@/contexts/AuthContext';
import { formatAuthError } from '@/lib/auth-errors';
import { loginFormSchema } from '@/lib/schemas/login.schema';
import {
  AUTH_CALLBACK_PARAM,
  getSafeCallbackPath,
  resolvePostLoginDestination,
  withAuthCallback,
} from '@/lib/auth-callback-url';
import type { SessionUserState } from '@/types/auth.types';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.25 },
  }),
};

function redirectAfterAuth(state: SessionUserState, callbackUrl: string): void {
  if (state.needsEmailVerification) {
    window.location.href = withAuthCallback('/auth/verify-email', callbackUrl);
    return;
  }
  if (state.needsOnboarding) {
    window.location.href = withAuthCallback('/auth/onboarding', callbackUrl);
    return;
  }
  window.location.href = resolvePostLoginDestination(state.role, callbackUrl);
}

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackPath(
    searchParams.get(AUTH_CALLBACK_PARAM) ?? searchParams.get('redirect'),
  );
  const {
    login,
    loginWithGoogle,
    sessionState,
    firebaseUser,
    isLoading: authLoading,
  } = useAuth();
  const { email, setEmail, password, setPassword, error, setError } = useAuthForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const redirectingRef = useRef(false);

  useEffect(() => {
    if (authLoading || !firebaseUser || !sessionState || redirectingRef.current) return;
    redirectingRef.current = true;
    setIsRedirecting(true);
    redirectAfterAuth(sessionState, callbackUrl);
  }, [firebaseUser, sessionState, authLoading, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const parsed = loginFormSchema.safeParse({ email: email.trim(), password });
    if (!parsed.success) {
      const msg =
        parsed.error.flatten().fieldErrors.email?.[0] ??
        parsed.error.flatten().fieldErrors.password?.[0] ??
        'Revisá los datos.';
      setError(msg);
      toast.error(msg);
      return;
    }
    setIsLoading(true);
    try {
      const state = await login(parsed.data.email, parsed.data.password);
      if (!state) {
        const msg = 'No se pudo iniciar sesión. Intentá de nuevo.';
        setError(msg);
        toast.error(msg);
        return;
      }
      redirectingRef.current = true;
      setIsRedirecting(true);
      redirectAfterAuth(state, callbackUrl);
    } catch (err: unknown) {
      const msg = formatAuthError(err);
      setError(msg);
      toast.error(msg);
    } finally {
      if (!redirectingRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const state = await loginWithGoogle();
      if (!state) {
        const msg = 'No se pudo iniciar sesión con Google. Intentá de nuevo.';
        setError(msg);
        toast.error(msg);
        return;
      }
      redirectingRef.current = true;
      setIsRedirecting(true);
      redirectAfterAuth(state, callbackUrl);
    } catch (err: unknown) {
      const msg = formatAuthError(err);
      setError(msg);
      toast.error(msg);
    } finally {
      if (!redirectingRef.current) {
        setIsLoading(false);
      }
    }
  };

  if (authLoading || (firebaseUser && !sessionState) || isRedirecting) {
    return (
      <AuthShell title="Entrar" subtitle="Iniciá sesión con tu cuenta">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded-lg" />
          <div className="h-10 bg-gray-200 rounded-lg" />
          <div className="h-10 bg-gray-200 rounded-lg" />
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Entrar" subtitle="Iniciá sesión con tu cuenta">
      <AuthForm onSubmit={handleSubmit} isLoading={isLoading} error={error}>
        <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
          <TextField
            id="auth-email"
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            disabled={isLoading}
          />
        </motion.div>
        <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
          <AuthPasswordField
            id="auth-password"
            name="password"
            label="Contraseña"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </motion.div>
        <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
          <Button
            type="submit"
            variant="brandRed"
            size="md"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
          </Button>
        </motion.div>
      </AuthForm>
      <div className="flex items-center justify-between mt-4 text-sm">
        <Link
          href={withAuthCallback('/auth/register', callbackUrl)}
          className="text-[#Ed3237] hover:underline"
        >
          Crear cuenta
        </Link>
        <Link href="/auth/forgot-password" className="text-[#Ed3237] hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      <AuthDivider />
      <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
        <SocialButton
          provider="google"
          label="Continuar con Google"
          onClick={handleGoogle}
          disabled={isLoading}
        />
      </motion.div>
      <p className="text-center mt-2">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
          Volver al inicio
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthShell>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg" />
          </div>
        </AuthShell>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
