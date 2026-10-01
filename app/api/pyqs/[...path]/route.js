import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

// Dynamic route evaluation - edge cache managed via Cache-Control headers
export const dynamic = 'force-dynamic';

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

  const pyqsBaseUrl = process.env.PYQS_API_URL || (
    process.env.NODE_ENV === 'production'
      ? 'https://pyqs-api.jeechallenger.com'
      : 'http://localhost:8080'
  );
  const targetUrl = `${pyqsBaseUrl.replace(/\/+$/, '')}/${apiPath}${url.search}`;

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

    const isPublicGet = req.method === 'GET' && !token && response.ok;

    const responseHeaders = {
      'Content-Type': response.headers.get('content-type') || 'application/json',
    };

    if (isPublicGet) {
      // Micro-cache public reads at the CDN Edge for 60s with 5min SWR to absorb visitor traffic bursts
      responseHeaders['Cache-Control'] = 'public, s-maxage=60, stale-while-revalidate=300';
    } else {
      // Authenticated users, admin actions, and mutations are never cached
      responseHeaders['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
      responseHeaders['Pragma'] = 'no-cache';
      responseHeaders['Expires'] = '0';
    }

    return new Response(responseBody, {
      status: response.status,
      headers: responseHeaders,
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