import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // Add cache headers for better performance
  const pathname = request.nextUrl.pathname;

  // Enhanced cache control for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );
  }

  // Add compression hint
  if (!response.headers.has('Content-Encoding')) {
    response.headers.set('Accept-Encoding', 'gzip, deflate, br');
  }

  // Add resource timing headers for better monitoring
  response.headers.set('Timing-Allow-Origin', '*');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
