import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

// Force the route to always be evaluated dynamically (disables route caching)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Force Vercel to wait up to 60 seconds before timing out
export const maxDuration = 60;

export async function processRequest(req, { params }) {
  // 1. Securely extract the NextAuth JWT from the hidden HTTP-Only cookie
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token) {
    return new Response(JSON.stringify({ detail: "Unauthorized" }), { status: 401 });
  }

  // 2. RE-SIGN THE TOKEN
  // We take the object from NextAuth and sign it into a string
  // Python's jwt.decode uses HS256, so we must use the same here.
  const signedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET, { algorithm: 'HS256' });

  // 3. Extract the exact path the frontend is trying to reach (e.g., "chats" or "files/upload")
  const resolvedParams = await params;
  const pathParams = resolvedParams.path || [];
  const apiPath = pathParams.join('/');
  
  // 4. Build the URL to your Python backend
  const targetUrl = process.env.NODE_ENV === 'production' || true
    ? `https://ai-api.jeechallenger.com/${apiPath}`
    : `http://localhost:8000/${apiPath}`;

  // 5. Extract query parameters from the original request
  const url = new URL(req.url);
  const targetUrlWithQuery = `${targetUrl}${url.search}`;

  // 6. Prepare the headers, injecting the secure JWT so Python can read it
  const headers = new Headers();
  
  // Keep the exact content-type from the browser, which includes the critical 'boundary=...' string
  const contentType = req.headers.get('content-type');
  if (contentType) {
    headers.set('content-type', contentType);
  }
  
  // Inject the signed token
  headers.set('Authorization', `Bearer ${signedToken}`);

  // 7. Forward the request to Python
  try {
    const fetchOptions = {
      method: req.method,
      headers: headers,      
      cache: 'no-store', // to ensure fetch ALWAYS hits your Python backend
    };

    // Only attach body for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      if (contentType && contentType.includes('multipart/form-data')) {
        // Forward the raw stream
        fetchOptions.body = req.body;
        fetchOptions.duplex = 'half';
        
        // FIX: We do NOT delete the content-type header here. 
        // FastAPI needs the original boundary string to parse the stream.
      } else {
        // For standard JSON requests
        fetchOptions.body = await req.text();
      }
    }

    const response = await fetch(targetUrlWithQuery, fetchOptions);
    
    // 8. Send the Python response directly back to the frontend
    const responseBody = await response.arrayBuffer();
    return new Response(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',

        // Instruct Vercel's Edge Network AND the browser to never cache this response
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error) {
    console.error("Proxy Error:", error);
    return new Response(JSON.stringify({ detail: "Backend connection failed" }), { status: 500 });
  }
}

// Export standard Next.js route handlers
export const GET = processRequest;
export const POST = processRequest;
export const PUT = processRequest;
export const PATCH = processRequest;
export const DELETE = processRequest;