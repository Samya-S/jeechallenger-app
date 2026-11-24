import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function getBaseUrl(req) {
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  return new URL(req.url).origin;
}

export async function GET(req) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'GOOGLE_CLIENT_ID not configured' }, { status: 500 });
  }

  const url = new URL(req.url);
  const rawCallbackUrl = url.searchParams.get('callbackUrl') || '/';
  const callbackUrl = (rawCallbackUrl.startsWith('/') && !rawCallbackUrl.startsWith('//'))
    ? rawCallbackUrl
    : '/';

  const state = crypto.randomBytes(32).toString('hex');
  const baseUrl = getBaseUrl(req);
  const redirectUri = `${baseUrl}/api/auth/callback/google`;

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('state', state);
  googleAuthUrl.searchParams.set('prompt', 'select_account');
  googleAuthUrl.searchParams.set('access_type', 'online');

  const statePayload = JSON.stringify({ state, callbackUrl });
  const response = NextResponse.redirect(googleAuthUrl.toString(), 302);

  response.cookies.set('oauth_state', statePayload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 300, // 5 minutes
  });

  return response;
}
