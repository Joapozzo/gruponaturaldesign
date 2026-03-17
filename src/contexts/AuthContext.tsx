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

type AuthContextValue = {
  firebaseUser: FirebaseUser | null;
  sessionState: SessionUserState | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSessionState: () => Promise<void>;
  getToken: () => Promise<string | null>;
  resendVerificationEmail: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function callSessionApi(idToken: string): Promise<SessionUserState> {
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Error al crear sesión');
  }
  return data.data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [sessionState, setSessionState] = useState<SessionUserState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getTokenRef = useRef<() => Promise<string | null>>(async () => null);

  const refreshSessionState = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setSessionState(null);
      return;
    }
    try {
      const token = await user.getIdToken();
      const state = await callSessionApi(token);
      setSessionState(state);
    } catch {
      setSessionState(null);
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
        const token = await user.getIdToken();
        const state = await callSessionApi(token);
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
