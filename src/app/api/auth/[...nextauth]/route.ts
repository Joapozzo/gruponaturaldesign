import { NextRequest, NextResponse } from 'next/server';

/**
 * NextAuth was replaced by Firebase. Redirect any old /api/auth/* calls to login.
 */
export function GET(req: NextRequest) {
  const url = new URL('/auth/login', req.url);
  return NextResponse.redirect(url);
}
export function POST(req: NextRequest) {
  const url = new URL('/auth/login', req.url);
  return NextResponse.redirect(url);
}
