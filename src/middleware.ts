import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function middleware(request: NextRequest) {
    // Interceptar errores de acceso denegado en el callback antes de que Auth0 los procese
    const url = request.nextUrl.clone();
    
    if (url.pathname === '/auth/callback') {
        const error = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');
        
        // Si hay un error de acceso denegado, redirigir a la página de error amigable
        if (error === 'access_denied') {
            const decodedMessage = errorDescription 
                ? decodeURIComponent(errorDescription) 
                : 'Verificá tu email para continuar.';
            
            const errorUrl = new URL('/auth/email-verification-required', request.url);
            errorUrl.searchParams.set('message', decodedMessage);
            
            return NextResponse.redirect(errorUrl);
        }
    }
    
    // Si no hay error o no es el callback, continuar con el flujo normal de Auth0
    return await auth0.middleware(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - robots.txt (robots file)
         * - sitemap.xml (sitemap file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
    ],
};