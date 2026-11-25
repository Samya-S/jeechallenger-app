import { NextResponse } from 'next/server';

export function proxy(request) {
  const ua = request.headers.get('user-agent') || 'unknown';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
  console.log(`[Visitor] ${request.nextUrl.pathname} | IP: ${ip} | UA: ${ua}`);
  return NextResponse.next();
}

export const config = {
  matcher: ['/question/:path*', '/paper/:path*'],
};
