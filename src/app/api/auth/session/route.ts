import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { AUTH_COOKIE_NAME } from '@/lib/auth-config';
import type { SessionUserState } from '@/types/auth.types';

// Backend API (Express) por defecto en 3002; Next (front) en otro puerto, ej. 3000
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
const JWT_SECRET = process.env.AUTH_COOKIE_SECRET || process.env.JWT_SECRET;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const SESSION_TIMEOUT_MS = 12000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = body?.idToken;
    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json(
        { success: false, error: 'idToken requerido' },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SESSION_TIMEOUT_MS);

    const res = await fetch(`${API_URL}/auth/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error || 'Error al crear sesión' },
        { status: res.status }
      );
    }

    const state = data.data as SessionUserState;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { success: true, data: state },
        { status: 200 }
      );
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const jwt = await new SignJWT({
      uid: state.uid,
      needsOnboarding: state.needsOnboarding,
      needsEmailVerification: state.needsEmailVerification,
      role: state.role,
      email: state.email,
      usuarioId: state.usuarioId,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .setIssuedAt()
      .sign(secret);

    const response = NextResponse.json({ success: true, data: state }, { status: 200 });
    response.cookies.set(AUTH_COOKIE_NAME, jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
    return response;
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: 'Timeout de sesión contra API' },
        { status: 504 }
      );
    }
    console.error('[auth/session]', e);
    return NextResponse.json(
      { success: false, error: 'Error interno' },
      { status: 500 }
    );
  }
}
