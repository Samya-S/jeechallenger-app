import { attachServiceToken } from './internal-token';
import jwt from 'jsonwebtoken';

export const AI_API_URL = process.env.AI_API_URL || 'https://ai-api.jeechallenger.com';

/**
 * Creates an HS256 JWT signed with NEXTAUTH_SECRET for Python FastAPI backend authentication.
 */
export function signAiToken(tokenOrId) {
  if (!tokenOrId) {
    throw new Error('aiService: token or userId is required to generate authentication token');
  }
  const payload = typeof tokenOrId === 'object' ? tokenOrId : { id: tokenOrId };
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET, { algorithm: 'HS256' });
}

/**
 * Generates authorization headers containing the signed Bearer token.
 */
export function getAiAuthHeaders(tokenOrId = null, extraHeaders = {}) {
  const headers = { ...extraHeaders };
  attachServiceToken(headers, 'ai-service');
  if (tokenOrId) {
    const signedToken = signAiToken(tokenOrId);
    headers['Authorization'] = `Bearer ${signedToken}`;
  }
  return headers;
}

/**
 * In-memory velocity gatekeeper for AI chat message generation.
 * Enforces a 2-second cooldown per user to prevent rapid-fire token exhaustion and script spam.
 */
const lastMessageTimestamps = new Map();
let lastCleanupTime = Date.now();

const COOLDOWN_MS = 2000;
const CLEANUP_INTERVAL_MS = 60000; // 1 minute
const ENTRY_TTL_MS = 30000;        // Prune records older than 30 seconds

function checkAiMessageCooldown(userId) {
  if (!userId) return { allowed: true };
  const now = Date.now();

  // Periodic pruning of stale entries to prevent memory accumulation
  if (now - lastCleanupTime > CLEANUP_INTERVAL_MS || lastMessageTimestamps.size > 5000) {
    lastCleanupTime = now;
    for (const [uid, timestamp] of lastMessageTimestamps.entries()) {
      if (now - timestamp > ENTRY_TTL_MS) {
        lastMessageTimestamps.delete(uid);
      }
    }
  }

  const lastTime = lastMessageTimestamps.get(userId);
  if (lastTime && (now - lastTime) < COOLDOWN_MS) {
    const retryAfter = Math.max(1, Math.ceil((COOLDOWN_MS - (now - lastTime)) / 1000));
    return {
      allowed: false,
      retryAfterSeconds: retryAfter,
    };
  }

  // Update timestamp only on allowed request
  lastMessageTimestamps.set(userId, now);
  return { allowed: true };
}

/**
 * Unified Python AI Microservice Client
 * Single Source of Truth for https://ai-api.jeechallenger.com
 */
export const aiService = {
  baseUrl: AI_API_URL,

  /**
   * Forwards a browser request through to the Python FastAPI backend,
   * preserving headers, multipart boundaries, and streaming bodies.
   */
  async forwardProxyRequest({ req, pathParams = [], token }) {
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'UNAUTHORIZED', message: 'Unauthorized', detail: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2-Second Gatekeeper: Enforce velocity cooldown on costly AI message generation
    // Covers both new chat message creation (POST /chats) and existing chat replies (POST /chats/[id]/messages)
    const cleanPath = pathParams.filter(Boolean);
    const isAiMessageRequest =
      req.method === 'POST' &&
      ((cleanPath.length === 1 && cleanPath[0] === 'chats') ||
       (cleanPath.length === 3 && cleanPath[0] === 'chats' && cleanPath[2] === 'messages'));

    if (isAiMessageRequest) {
      const userId = token.id || token.sub || token.email;
      const cooldown = checkAiMessageCooldown(userId);
      if (!cooldown.allowed) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'RATE_LIMITED',
            message: 'Please wait a moment before sending another message.',
            retry_after: cooldown.retryAfterSeconds,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(cooldown.retryAfterSeconds),
              'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
          }
        );
      }
    }

    const signedToken = signAiToken(token);
    const apiPath = pathParams.join('/');
    const cleanApiPath = apiPath.startsWith('/') ? apiPath.slice(1) : apiPath;
    const url = new URL(req.url);
    const targetUrlWithQuery = `${AI_API_URL}/${cleanApiPath}${url.search}`;

    const headers = new Headers();
    const contentType = req.headers.get('content-type');
    if (contentType) {
      headers.set('content-type', contentType);
    }
    headers.set('Authorization', `Bearer ${signedToken}`);
    attachServiceToken(headers, 'ai-service');

    try {
      const fetchOptions = {
        method: req.method,
        headers,
        cache: 'no-store',
      };

      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        if (contentType && contentType.includes('multipart/form-data')) {
          fetchOptions.body = req.body;
          fetchOptions.duplex = 'half';
        } else {
          fetchOptions.body = await req.text();
        }
      }

      const response = await fetch(targetUrlWithQuery, fetchOptions);
      const responseBody = await response.arrayBuffer();

      return new Response(responseBody, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('content-type') || 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    } catch (error) {
      console.error('[aiService] Proxy Error:', error);
      return new Response(JSON.stringify({ success: false, error: 'BAD_GATEWAY', message: 'Backend connection failed', detail: 'Backend connection failed' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

export default aiService;
