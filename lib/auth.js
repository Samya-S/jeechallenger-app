import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

/**
 * Parse raw Cookie header string into key-value map.
 * @param {string | null | undefined} cookieHeader
 * @returns {Record<string, string>}
 */
export function parseCookieHeader(cookieHeader) {
  if (!cookieHeader) return {};
  const cookiesMap = {};
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const key = pair.substring(0, idx).trim();
    const val = pair.substring(idx + 1).trim();
    if (key) {
      try {
        cookiesMap[key] = decodeURIComponent(val);
      } catch {
        cookiesMap[key] = val;
      }
    }
  }
  return cookiesMap;
}

/**
 * Extracts raw session token string from Next.js Request, Headers, or Cookie header.
 * Checks NextRequest cookies, raw Cookie header (user_session), and Authorization header.
 * @param {Request} [req]
 * @returns {string | null}
 */
export function getUserTokenFromRequest(req) {
  if (!req) return null;

  // 1. NextRequest cookie map
  if (req.cookies && typeof req.cookies.get === 'function') {
    const cookie = req.cookies.get('user_session');
    if (cookie?.value) return cookie.value;
  }

  // 2. Raw Cookie header
  const rawCookie = req.headers?.get?.('cookie');
  if (rawCookie) {
    const parsed = parseCookieHeader(rawCookie);
    if (parsed.user_session) return parsed.user_session;
  }

  // 3. Authorization Bearer header
  const authHeader = req.headers?.get?.('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) return token;
  }

  return null;
}

/**
 * Verifies HS256 student JWT against JWT_SECRET and returns typed user session payload.
 * Strictly adheres to canonical Go-minted claims schema without loose fallbacks.
 * @param {string | null | undefined} token
 * @returns {{ id: string, email: string, name: string, image: string | null, plan_name: string, subscription_plan_id: string | null, services: Record<string, any>, is_admin: boolean } | null}
 */
export function verifyUserToken(token) {
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('[auth] CRITICAL: JWT_SECRET environment variable is not defined');
    return null;
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });

    const userId = payload.id || payload.sub;
    if (!userId || typeof userId !== 'string') {
      return null;
    }

    return {
      id: userId,
      email: payload.email || '',
      name: payload.name || 'Student',
      image: payload.image || payload.picture || null,
      plan_name: payload.plan_name || 'Starter',
      subscription_plan_id: payload.subscription_plan_id || null,
      services: payload.services && typeof payload.services === 'object' ? payload.services : {},
      is_admin: Boolean(payload.is_admin || payload.isAdmin),
    };
  } catch {
    return null;
  }
}

/**
 * Authenticates request and returns the validated student user and token.
 * @param {Request} req
 * @returns {Promise<{ user: { id: string, email: string, name: string, image: string | null, plan_name: string, subscription_plan_id: string | null, services: Record<string, any>, is_admin: boolean }, token: string } | null>}
 */
export async function getSession(req) {
  const token = getUserTokenFromRequest(req);
  if (!token) return null;

  const user = verifyUserToken(token);
  if (!user) return null;

  return { user, token };
}

/**
 * Drop-in replacement for NextAuth's getServerSession.
 * Supports passing a Request object, or resolving from next/headers cookies() in Server Components / Route Handlers.
 * @param {Request | any} [reqOrOptions]
 * @returns {Promise<{ user: { id: string, email: string, name: string, image: string | null, plan_name: string, subscription_plan_id: string | null, services: Record<string, any>, is_admin: boolean } } | null>}
 */
export async function getServerSession(reqOrOptions) {
  let token = null;

  // 1. Check if a Request object was passed
  if (reqOrOptions && (reqOrOptions.headers || reqOrOptions.cookies)) {
    token = getUserTokenFromRequest(reqOrOptions);
  }

  // 2. Fall back to next/headers cookies() if no token found from req
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get('user_session')?.value || null;
    } catch {
      token = null;
    }
  }

  if (!token) return null;

  const user = verifyUserToken(token);
  if (!user) return null;

  return { user };
}

/**
 * Legacy authOptions export for drop-in compatibility.
 */
export const authOptions = {};
