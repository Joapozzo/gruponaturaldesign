'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/app/components/ui/Button';
import { TextField } from '@/app/components/producto/fields/TextField';
import { formatAuthError } from '@/lib/auth-errors';
import toast from 'react-hot-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const { firebaseUser, sessionState, isLoading, getToken, logout, refreshSessionState } = useAuth();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleVolverAtras = async (irAHome = false) => {
    setLeaving(true);
    try {
      await logout();
      if (typeof window !== 'undefined') {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch {
          // ignore
        }
        const target = irAHome ? '/' : '/auth/login';
        window.location.href = target;
        return;
      }
      router.replace(irAHome ? '/' : '/auth/login');
    } catch {
      router.replace(irAHome ? '/' : '/auth/login');
    } finally {
      setLeaving(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!firebaseUser) {
      router.replace('/auth/login');
      return;
    }
    if (sessionState?.onboardingCompleted) {
      router.replace('/');
      return;
    }
    if (sessionState?.needsEmailVerification) {
      router.replace('/auth/verify-email');
      return;
    }
    // Solo pre-llenar nombre/apellido cuando vengan de Firebase/Google (nombre real), no username ni placeholder
    const emailPart = sessionState?.email?.split('@')[0]?.toLowerCase() ?? '';
    const nombreReal = sessionState?.nombre?.trim();
    const isNombreDeProvider =
      !!nombreReal &&
      nombreReal.toLowerCase() !== emailPart &&
      nombreReal.toLowerCase() !== 'usuario' &&
      !nombreReal.includes('@');
    if (isNombreDeProvider) setNombre(sessionState!.nombre!);
    if (sessionState?.apellido?.trim()) setApellido(sessionState.apellido.trim());
  }, [firebaseUser, sessionState, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const name = nombre.trim();
    if (!name) {
      const msg = 'El nombre es obligatorio.';
      setError(msg);
      toast.error(msg);
      return;
    }
    setSubmitting(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('No hay sesión.');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
      const res = await fetch(`${API_URL}/auth/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: name,
          apellido: apellido.trim() || '',
          fechaNacimiento: fechaNacimiento || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar.');
      await refreshSessionState();
      router.replace(sessionState?.role === 'ADMIN' ? '/admin/dashboard' : '/');
    } catch (err: unknown) {
      const msg = formatAuthError(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
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
    <AuthShell title="Completá tu perfil" subtitle="Datos para tu cuenta">
      <AuthForm onSubmit={handleSubmit} isLoading={submitting} error={error}>
        <TextField
          id="onboarding-nombre"
          name="nombre"
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          required
          disabled={submitting}
          autoComplete="given-name"
        />
        <TextField
          id="onboarding-apellido"
          name="apellido"
          label="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          placeholder="Tu apellido"
          disabled={submitting}
          autoComplete="family-name"
        />
        <div>
          <label htmlFor="onboarding-fecha" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de nacimiento (opcional)
          </label>
          <input
            id="onboarding-fecha"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#Ed3237] focus:ring-1 focus:ring-[#Ed3237]"
          />
        </div>
        <Button type="submit" variant="brandRed" size="md" fullWidth disabled={submitting}>
          {submitting ? 'Guardando...' : 'Continuar'}
        </Button>
        <p className="text-center mt-4">
          <button
            type="button"
            onClick={() => handleVolverAtras(false)}
            disabled={leaving || submitting}
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline disabled:opacity-50"
          >
            {leaving ? 'Saliendo...' : 'Volver atrás'}
          </button>
        </p>
        <p className="text-center mt-1">
          <button
            type="button"
            onClick={() => handleVolverAtras(true)}
            disabled={leaving || submitting}
            className="text-sm text-gray-400 hover:text-gray-600 hover:underline disabled:opacity-50"
          >
            Ir al inicio (y cerrar sesión)
          </button>
        </p>
      </AuthForm>
    </AuthShell>
  );
}
