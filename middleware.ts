import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow these paths without any checks
  const publicPaths = [
    '/',
    '/products',
    '/about',
    '/contact',
    '/cart',
    '/login',
    '/signup',
    '/faq',
    '/admin/login',
    '/api',
    '/_next',
    '/favicon.ico',
  ];

  // Check if current path starts with any public path
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // For admin paths (except login), check localStorage via header
  // Note: This is a simple check, real auth should use sessions/cookies
  if (pathname.startsWith('/admin')) {
    // Let the admin layout handle authentication
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
