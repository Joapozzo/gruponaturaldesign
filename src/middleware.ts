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
  pathname.startsWith('/politicas-cambio') ||
  pathname.startsWith('/api/');

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/api/')) return NextResponse.next();
  // En desarrollo, evitar HTTPS en localhost (evita ERR_SSL_PROTOCOL_ERROR)
  if (process.env.NODE_ENV === 'development' && req.nextUrl.protocol === 'https:' && req.nextUrl.hostname === 'localhost') {
    const httpUrl = new URL(req.nextUrl);
    httpUrl.protocol = 'http:';
    return NextResponse.redirect(httpUrl);
  }
  if (isPublicPath(pathname)) return NextResponse.next();

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const secret = process.env.AUTH_COOKIE_SECRET || process.env.JWT_SECRET;
  if (!token || !secret) {
    const loginUrl = new URL('/auth/login', req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const p = payload as { needsOnboarding?: boolean; needsEmailVerification?: boolean };
    if (pathname.startsWith('/auth/onboarding') || pathname.startsWith('/auth/verify-email')) {
      return NextResponse.next();
    }
    if (p.needsEmailVerification) {
      return NextResponse.redirect(new URL('/auth/verify-email', req.nextUrl));
    }
    if (p.needsOnboarding) {
      return NextResponse.redirect(new URL('/auth/onboarding', req.nextUrl));
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
