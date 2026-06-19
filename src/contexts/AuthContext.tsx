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
import { getEmailActionCodeSettings } from '@/lib/auth-action-url';

type AuthContextValue = {
  firebaseUser: FirebaseUser | null;
  sessionState: SessionUserState | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<SessionUserState | null>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<SessionUserState | null>;
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
  const sessionSyncGenRef = useRef(0);

  useClearCheckoutOnAuthChange();

  const syncSessionForUser = useCallback(async (user: FirebaseUser): Promise<SessionUserState | null> => {
    const gen = ++sessionSyncGenRef.current;
    try {
      let token = await user.getIdToken();
      let state: SessionUserState;
      try {
        state = await callSessionApi(token);
      } catch (error: unknown) {
        if (error instanceof AuthSessionError && error.status === 401) {
          token = await user.getIdToken(true);
          state = await callSessionApi(token);
        } else {
          throw error;
        }
      }
      if (gen === sessionSyncGenRef.current) {
        setSessionState(state);
      }
      return state;
    } catch {
      if (gen === sessionSyncGenRef.current) {
        setSessionState(null);
      }
      return null;
    }
  }, []);

  const refreshSessionState = useCallback(async (): Promise<SessionUserState | null> => {
    const user = auth.currentUser;
    if (!user) {
      sessionSyncGenRef.current += 1;
      setSessionState(null);
      return null;
    }
    return syncSessionForUser(user);
  }, [syncSessionForUser]);

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
        sessionSyncGenRef.current += 1;
        setSessionState(null);
        setIsLoading(false);
        return;
      }
      try {
        await syncSessionForUser(user);
      } finally {
        setIsLoading(false);
      }
    });
    return () => unsub();
  }, [syncSessionForUser]);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
    return refreshSessionState();
  }, [refreshSessionState]);

  const register = useCallback(async (email: string, password: string) => {
    const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    try {
      await sendEmailVerification(userCred.user, getEmailActionCodeSettings());
    } catch (e) {
      console.error('[auth/register] sendEmailVerification', e);
      // La cuenta ya existe; reenvío desde /auth/verify-email
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
    return refreshSessionState();
  }, [refreshSessionState]);

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
    await sendEmailVerification(user, getEmailActionCodeSettings());
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
