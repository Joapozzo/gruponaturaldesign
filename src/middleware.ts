import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { AUTH_COOKIE_NAME } from '@/lib/auth-config';

const publicPaths = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/onboarding',
  '/auth/error',
  '/auth/action',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/manifest.webmanifest',
  '/manifest.json',
];
const isPublicPath = (pathname: string) =>
  publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
  pathname.startsWith('/producto') ||
  pathname.startsWith('/categoria') ||
  pathname.startsWith('/shoponline') ||
  pathname.startsWith('/mayorista') ||
  pathname.startsWith('/personalizados') ||
  pathname.startsWith('/politicas-cambio') ||
  pathname.startsWith('/api/');

const isAdminPath = (pathname: string) => pathname.startsWith('/admin');
const isAuthPath = (pathname: string) => pathname.startsWith('/auth');

function isAdminRole(role: unknown): boolean {
  return role === 'ADMIN' || (Array.isArray(role) && role.includes('ADMIN'));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/api/')) return NextResponse.next();
  // En desarrollo, evitar HTTPS en localhost (evita ERR_SSL_PROTOCOL_ERROR)
  if (process.env.NODE_ENV === 'development' && req.nextUrl.protocol === 'https:' && req.nextUrl.hostname === 'localhost') {
    const httpUrl = new URL(req.nextUrl);
    httpUrl.protocol = 'http:';
    return NextResponse.redirect(httpUrl);
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const secret = process.env.AUTH_COOKIE_SECRET || process.env.JWT_SECRET;

  // Rutas públicas: si hay sesión válida y es ADMIN, redirigir al dashboard
  if (isPublicPath(pathname)) {
    if (token && secret) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
        const role = (payload as { role?: string | string[] }).role;
        if (isAdminRole(role)) {
          return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl));
        }
      } catch {
        // Token inválido, dejar pasar como usuario anónimo
      }
    }
    return NextResponse.next();
  }

  if (!token || !secret) {
    const loginUrl = new URL('/auth/login', req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const p = payload as { needsOnboarding?: boolean; needsEmailVerification?: boolean; role?: string | string[] };
    if (pathname.startsWith('/auth/onboarding') || pathname.startsWith('/auth/verify-email')) {
      return NextResponse.next();
    }
    if (p.needsEmailVerification) {
      return NextResponse.redirect(new URL('/auth/verify-email', req.nextUrl));
    }
    if (p.needsOnboarding) {
      return NextResponse.redirect(new URL('/auth/onboarding', req.nextUrl));
    }
    // Admin autenticado solo en /admin; si intenta ir a otra ruta protegida, al dashboard
    if (isAdminRole(p.role) && !isAdminPath(pathname) && !isAuthPath(pathname)) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl));
    }
  } catch {
    const loginUrl = new URL('/auth/login', req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
};
