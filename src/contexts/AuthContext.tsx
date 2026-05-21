'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { SessionUserState } from '@/types/auth.types';
import { clearCheckoutSession } from '@/app/stores/cartStore';
import { useClearCheckoutOnAuthChange } from '@/app/hooks/useClearCheckoutOnAuthChange';
import { tryHandleMaintenanceResponse } from '@/lib/api-maintenance';

type AuthContextValue = {
  firebaseUser: FirebaseUser | null;
  sessionState: SessionUserState | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSessionState: () => Promise<SessionUserState | null>;
  getToken: () => Promise<string | null>;
  resendVerificationEmail: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

class AuthSessionError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AuthSessionError';
    this.status = status;
  }
}

async function callSessionApi(idToken: string, timeoutMs = 10000): Promise<SessionUserState> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      credentials: 'include',
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (tryHandleMaintenanceResponse(res.status, data)) {
      throw new AuthSessionError('Servicio en mantenimiento', 503);
    }
    if (!res.ok || !data.success) {
      throw new AuthSessionError(data.error || 'Error al crear sesión', res.status);
    }
    return data.data as SessionUserState;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AuthSessionError('Timeout al crear sesión', 504);
    }
    if (error instanceof AuthSessionError) {
      throw error;
    }
    throw new AuthSessionError('Error al crear sesión');
  } finally {
    clearTimeout(timeout);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [sessionState, setSessionState] = useState<SessionUserState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getTokenRef = useRef<() => Promise<string | null>>(async () => null);

  useClearCheckoutOnAuthChange();

  const refreshSessionState = useCallback(async (): Promise<SessionUserState | null> => {
    const user = auth.currentUser;
    if (!user) {
      setSessionState(null);
      return null;
    }
    try {
      let token = await user.getIdToken();
      let state: SessionUserState;
      try {
        state = await callSessionApi(token);
      } catch (error: unknown) {
        // Solo forzar refresh de token cuando realmente fue 401 (token inválido/expirado).
        if (error instanceof AuthSessionError && error.status === 401) {
          token = await user.getIdToken(true);
          state = await callSessionApi(token);
        } else {
          throw error;
        }
      }
      setSessionState(state);
      return state;
    } catch {
      setSessionState(null);
      return null;
    }
  }, []);

  useEffect(() => {
    getTokenRef.current = async () => {
      const user = auth.currentUser;
      if (!user) return null;
      return user.getIdToken();
    };
  }, [firebaseUser]);

  useEffect(() => {
    const g = typeof window !== 'undefined' ? (window as unknown as { __getFirebaseToken?: () => Promise<string | null> }) : undefined;
    if (g) {
      g.__getFirebaseToken = () => getTokenRef.current();
      return () => {
        delete g.__getFirebaseToken;
      };
    }
  }, [firebaseUser]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      setFirebaseUser(user ?? null);
      if (!user) {
        setSessionState(null);
        setIsLoading(false);
        return;
      }
      try {
        let token = await user.getIdToken();
        let state: SessionUserState;
        try {
          state = await callSessionApi(token);
        } catch (error: unknown) {
          // Reintento único con token forzado para 401 real.
          if (error instanceof AuthSessionError && error.status === 401) {
            token = await user.getIdToken(true);
            state = await callSessionApi(token);
          } else {
            throw error;
          }
        }
        setSessionState(state);
      } catch {
        setSessionState(null);
      } finally {
        setIsLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await sendEmailVerification(userCred.user);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  }, []);

  const logout = useCallback(async () => {
    clearCheckoutSession();
    const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    await res.json().catch(() => ({}));
    setSessionState(null);
    await firebaseSignOut(auth);
  }, []);

  const getToken = useCallback(async () => {
    return getTokenRef.current();
  }, []);

  const resendVerificationEmail = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;
    await sendEmailVerification(user);
  }, []);

  const value: AuthContextValue = {
    firebaseUser,
    sessionState,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshSessionState,
    getToken,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
