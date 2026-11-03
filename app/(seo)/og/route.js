import fs from 'node:fs/promises';
import path from 'node:path';
import { createFallbackOgImageResponse, createOgImageResponse } from '@/utils/og-image';
import { OG_PARAM_LIMITS, sanitizeOgText, unpackOgImageParams } from '@/utils/og-metadata';
import { normalizeOgTheme } from '@/config/og-themes';

export const runtime = 'nodejs';

function getRequestBaseUrl(request) {
  const host = request.headers.get('host');
  if (!host) return undefined;
  const protocol = request.headers.get('x-forwarded-proto')
    || (host.includes('localhost') ? 'http' : 'https');
  return `${protocol}://${host}`;
}

function resolveOgParams(searchParams) {
  const q = searchParams.get('q');
  if (q) return unpackOgImageParams(q);

  return {
    title: sanitizeOgText(searchParams.get('title'), OG_PARAM_LIMITS.title) || 'JEE Challenger',
    subtitle: sanitizeOgText(searchParams.get('subtitle'), OG_PARAM_LIMITS.subtitle),
    theme: normalizeOgTheme(searchParams.get('theme')),
    badge: sanitizeOgText(searchParams.get('badge'), OG_PARAM_LIMITS.badge) || 'JEE Challenger',
  };
}

export async function GET(request) {
  const baseUrl = getRequestBaseUrl(request);

  try {
    const { title, subtitle, theme, badge } = resolveOgParams(
      new URL(request.url).searchParams,
    );

    return await createOgImageResponse({ title, subtitle, theme, badge, baseUrl });
  } catch {
    try {
      return createFallbackOgImageResponse();
    } catch {
      try {
        const staticFallbackPath = path.join(process.cwd(), 'public', 'og-image-1200x630.png');
        const buffer = await fs.readFile(staticFallbackPath);
        return new Response(buffer, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400',
          },
        });
      } catch {
        return new Response('Failed to generate the image', { status: 500 });
      }
    }
  }
}
