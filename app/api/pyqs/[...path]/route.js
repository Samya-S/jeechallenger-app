import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

// Always dynamic - never cache auth or API responses
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Allow up to 60s for Go backend responses
export const maxDuration = 60;

export async function processRequest(req, { params }) {
  // 1. Try to read the NextAuth session cookie.
  //    Token may be null for unauthenticated users - that is fine.
  //    Public routes (/questions, /papers) work without auth.
  //    The Go backend enforces auth on protected routes (/admin/*).
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 2. Build the target URL
  const resolvedParams = await params;
  const pathParams = resolvedParams.path || [];
  const apiPath = pathParams.join('/');
  const url = new URL(req.url);

  const targetUrl = process.env.NODE_ENV === 'production' || true
    ? 'https://pyqs-api.jeechallenger.com/' + apiPath + url.search
    : 'http://localhost:8080/' + apiPath + url.search;

  // 3. Build forwarded headers
  const headers = new Headers();
  const contentType = req.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  // 4. Attach Authorization only if user is logged in.
  //    The signed HS256 JWT is verified by Go using the shared NEXTAUTH_SECRET.
  if (token) {
    const signedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET, { algorithm: 'HS256' });
    headers.set('Authorization', 'Bearer ' + signedToken);
  }

  // 5. Forward the request to the Go backend
  try {
    const fetchOptions = { method: req.method, headers, cache: 'no-store' };

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      if (contentType && contentType.includes('multipart/form-data')) {
        fetchOptions.body = req.body;
        fetchOptions.duplex = 'half';
      } else {
        fetchOptions.body = await req.text();
      }
    }

    const response = await fetch(targetUrl, fetchOptions);
    const responseBody = await response.arrayBuffer();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('[pyqs-proxy] Error:', error);
    return new Response(JSON.stringify({ error: 'Backend connection failed' }), { status: 502 });
  }
}

export const GET    = processRequest;
export const POST   = processRequest;
export const PUT    = processRequest;
export const PATCH  = processRequest;
export const DELETE = processRequest;