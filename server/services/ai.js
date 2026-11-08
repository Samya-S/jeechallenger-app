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
      return new Response(JSON.stringify({ detail: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
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
      return new Response(JSON.stringify({ detail: 'Backend connection failed' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

export default aiService;
