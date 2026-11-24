import { getSession } from "@/lib/auth";
import { aiService } from "@/server/services/ai";

// Force the route to always be evaluated dynamically (disables route caching)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Force Vercel to wait up to 60 seconds before timing out
export const maxDuration = 60;

export async function processRequest(req, { params }) {
  // 1. Securely extract the student session from user_session cookie
  const session = await getSession(req);
  if (!session || !session.user) {
    return new Response(JSON.stringify({ success: false, error: "UNAUTHORIZED", message: "Unauthorized", detail: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Delegate to unified AI service client
  const resolvedParams = await params;
  const pathParams = resolvedParams.path || [];

  return aiService.forwardProxyRequest({
    req,
    pathParams,
    token: session.user,
  });
}

// Export standard Next.js route handlers
export const GET    = processRequest;
export const POST   = processRequest;
export const PATCH  = processRequest;
export const DELETE = processRequest;
