'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { SocialButton } from '@/components/auth/SocialButton';
import { AuthPasswordField } from '@/components/auth/AuthPasswordField';
import { PasswordRules } from '@/components/auth/PasswordRules';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { TextField } from '@/app/components/producto/fields/TextField';
import { formatAuthError } from '@/lib/auth-errors';
import { registerFormSchema } from '@/lib/schemas/register.schema';
import {
  AUTH_CALLBACK_PARAM,
  getSafeCallbackPath,
  resolvePostLoginDestination,
  withAuthCallback,
} from '@/lib/auth-callback-url';
import toast from 'react-hot-toast';

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.25 },
  }),
};

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackPath(searchParams.get(AUTH_CALLBACK_PARAM));
  const { register: registerFirebase, loginWithGoogle, firebaseUser, sessionState, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !firebaseUser || !sessionState) return;
    if (sessionState.needsEmailVerification) {
      router.replace(withAuthCallback('/auth/verify-email', callbackUrl));
      return;
    }
    if (sessionState.needsOnboarding) {
      router.replace(withAuthCallback('/auth/onboarding', callbackUrl));
      return;
    }
    router.replace(resolvePostLoginDestination(sessionState.role, callbackUrl));
  }, [firebaseUser, sessionState, authLoading, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const result = registerFormSchema.safeParse({
      email: email.trim(),
      password,
      confirmPassword,
    });
    if (!result.success) {
      const first = result.error.flatten().fieldErrors;
      const msg =
        first.password?.[0] ??
        first.confirmPassword?.[0] ??
        first.email?.[0] ??
        'Revisá los datos.';
      setError(msg);
      toast.error(msg);
      return;
    }
    setIsLoading(true);
    try {
      await registerFirebase(result.data.email, result.data.password);
      router.replace(withAuthCallback('/auth/verify-email', callbackUrl));
    } catch (err: unknown) {
      const msg = formatAuthError(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      const msg = formatAuthError(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Crear cuenta" subtitle="Email y contraseña">
      <AuthForm onSubmit={handleSubmit} isLoading={isLoading} error={error}>
        <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
          <TextField
            id="register-email"
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </motion.div>
        <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
          <AuthPasswordField
            id="register-password"
            name="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Creá una contraseña"
            required
            disabled={isLoading}
          />
          <PasswordRules password={password} className="mt-1.5" />
        </motion.div>
        <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
          <AuthPasswordField
            id="register-confirm"
            name="confirmPassword"
            label="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetí la contraseña"
            required
            disabled={isLoading}
          />
        </motion.div>
        <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
          <Button
            type="submit"
            variant="brandRed"
            size="md"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Crear cuenta'}
          </Button>
        </motion.div>
      </AuthForm>
      <AuthDivider />
      <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
        <SocialButton
          provider="google"
          label="Registrarse con Google"
          onClick={handleGoogle}
          disabled={isLoading}
        />
      </motion.div>
      <p className="text-center text-sm text-gray-600 mt-6">
        ¿Ya tenés cuenta?{' '}
        <Link href={withAuthCallback('/auth/login', callbackUrl)} className="text-[#Ed3237] hover:underline">
          Iniciar sesión
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Crear cuenta" subtitle="Email y contraseña">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg" />
          </div>
        </AuthShell>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
