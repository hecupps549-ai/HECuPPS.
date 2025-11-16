import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Assume the frontend is running on localhost:3000
  const origin = request.headers.get('origin') ?? '';
  const allowedOrigins = ['http://localhost:3000', 'https://your-production-frontend-url.com'];

  const response = request.method === 'OPTIONS'
    ? new Response(null, { status: 204 })
    : NextResponse.next();

  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

export const config = {
  matcher: '/api/:path*',
}
