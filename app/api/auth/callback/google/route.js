import { NextResponse } from 'next/server';
import { attachServiceToken } from '@/server/services/internal-token';
import { BACKEND_API_URL } from '@/server/services/pyqs';

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
  const url = new URL(req.url);
  const baseUrl = getBaseUrl(req);

  // 1. Handle user cancellation or Google errors
  const googleError = url.searchParams.get('error');
  if (googleError) {
    console.error('[auth-callback] Google OAuth error:', googleError);
    return NextResponse.redirect(`${baseUrl}/login?error=OAuthSignin`, 302);
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    console.error('[auth-callback] Missing code or state from Google callback');
    return NextResponse.redirect(`${baseUrl}/login?error=OAuthSignin`, 302);
  }

  // 2. Validate CSRF state from cookie
  const oauthStateCookie = req.cookies.get('oauth_state')?.value;
  let savedState = null;
  let targetCallbackUrl = '/';

  if (oauthStateCookie) {
    try {
      const parsed = JSON.parse(oauthStateCookie);
      savedState = parsed.state;
      if (parsed.callbackUrl && parsed.callbackUrl.startsWith('/') && !parsed.callbackUrl.startsWith('//')) {
        targetCallbackUrl = parsed.callbackUrl;
      }
    } catch {
      savedState = oauthStateCookie;
    }
  }

  if (!savedState || savedState !== state) {
    console.error('[auth-callback] CSRF state mismatch:', { savedState, state });
    return NextResponse.redirect(`${baseUrl}/login?error=OAuthSignin`, 302);
  }

  // 3. Exchange authorization code with Google for id_token
  const redirectUri = `${baseUrl}/api/auth/callback/google`;
  const tokenEndpoint = 'https://oauth2.googleapis.com/token';

  let googleTokens;
  try {
    const tokenRes = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[auth-callback] Google token exchange failed:', tokenRes.status, errText);
      return NextResponse.redirect(`${baseUrl}/login?error=OAuthSignin`, 302);
    }

    googleTokens = await tokenRes.json();
  } catch (err) {
    console.error('[auth-callback] Network error contacting Google token endpoint:', err);
    return NextResponse.redirect(`${baseUrl}/login?error=OAuthSignin`, 302);
  }

  if (!googleTokens?.id_token) {
    console.error('[auth-callback] No id_token returned by Google');
    return NextResponse.redirect(`${baseUrl}/login?error=OAuthSignin`, 302);
  }

  // 4. Authenticate with Go Backend (POST /auth/google)
  let goAuthData;
  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    // Forward telemetry headers to Go for login_logs & device analytics
    const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || '';
    const userAgent = req.headers.get('user-agent') || '';
    const cfCity = req.headers.get('cf-ipcity') || '';
    const cfCountry = req.headers.get('cf-ipcountry') || '';

    if (clientIp) headers.set('CF-Connecting-IP', clientIp);
    if (userAgent) headers.set('User-Agent', userAgent);
    if (cfCity) headers.set('CF-IPCity', cfCity);
    if (cfCountry) headers.set('CF-IPCountry', cfCountry);

    attachServiceToken(headers, 'backend-service');

    const backendRes = await fetch(`${BACKEND_API_URL}/auth/google`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id_token: googleTokens.id_token }),
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      console.error('[auth-callback] Go backend student auth failed:', backendRes.status, errText);
      return NextResponse.redirect(`${baseUrl}/login?error=OAuthSignin`, 302);
    }

    goAuthData = await backendRes.json();
  } catch (err) {
    console.error('[auth-callback] Network error contacting Go backend /auth/google:', err);
    return NextResponse.redirect(`${baseUrl}/login?error=OAuthSignin`, 302);
  }

  const user = goAuthData?.user;
  const token = goAuthData?.token;

  if (!token || !user) {
    console.error('[auth-callback] Invalid response from Go backend:', goAuthData);
    return NextResponse.redirect(`${baseUrl}/login?error=OAuthSignin`, 302);
  }

  // 5. Set HttpOnly user_session cookie containing 30-day Go JWT
  const response = NextResponse.redirect(`${baseUrl}${targetCallbackUrl}`, 302);

  response.cookies.set('user_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  // Clear CSRF state cookie
  response.cookies.set('oauth_state', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
