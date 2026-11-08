import jwt from 'jsonwebtoken';

/**
 * Creates a short-lived (60s) machine-to-machine JWT for internal microservices.
 * @param {'pyqs-service' | 'ai-service'} audience
 * @returns {string | null}
 */
export function getServiceToken(audience) {
  const secret = audience === 'pyqs-service'
    ? process.env.PYQS_SERVICE_SECRET
    : process.env.AI_SERVICE_SECRET;

  if (!secret) return null;

  return jwt.sign(
    {
      iss: 'jeechallenger-web',
      aud: audience,
    },
    secret,
    {
      algorithm: 'HS256',
      expiresIn: '60s',
    }
  );
}

/**
 * Attaches X-Internal-Token to headers.
 * Supports Headers instance, plain object, or creates a new Headers instance.
 * @param {Headers | Record<string, string> | null | undefined} headers
 * @param {'pyqs-service' | 'ai-service'} audience
 * @returns {Headers | Record<string, string>}
 */
export function attachServiceToken(headers, audience) {
  const token = getServiceToken(audience);
  if (!token) return headers || {};

  if (headers instanceof Headers) {
    headers.set('X-Internal-Token', token);
    return headers;
  }

  return {
    ...headers,
    'X-Internal-Token': token,
  };
}
