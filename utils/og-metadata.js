import { normalizeOgTheme } from '@/config/og-themes';
import { getSiteUrl } from '@/config/site-url';

export const OG_PARAM_LIMITS = {
  title: 120,
  subtitle: 200,
  badge: 60,
};

export function sanitizeOgText(text, max) {
  if (!text) return '';
  return text.trim().slice(0, max);
}


/** Pack OG fields into one query param — avoids & in URLs (HTML encodes those as &amp;). */
export function packOgImageParams({ title, subtitle, theme = 'brand', badge }) {
  const payload = {
    t: sanitizeOgText(title, OG_PARAM_LIMITS.title) || 'JEE Challenger',
    th: normalizeOgTheme(theme),
  };
  const cleanSubtitle = sanitizeOgText(subtitle, OG_PARAM_LIMITS.subtitle);
  if (cleanSubtitle) payload.s = cleanSubtitle;
  const cleanBadge = sanitizeOgText(badge, OG_PARAM_LIMITS.badge);
  if (cleanBadge) payload.b = cleanBadge;
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function unpackOgImageParams(q) {
  const payload = JSON.parse(Buffer.from(q, 'base64url').toString('utf8'));
  return {
    title: sanitizeOgText(payload.t, OG_PARAM_LIMITS.title) || 'JEE Challenger',
    subtitle: sanitizeOgText(payload.s, OG_PARAM_LIMITS.subtitle),
    theme: normalizeOgTheme(payload.th),
    badge: sanitizeOgText(payload.b, OG_PARAM_LIMITS.badge) || 'JEE Challenger',
  };
}

export function buildOgImageUrl({ title, subtitle, theme = 'brand', badge }) {
  const q = packOgImageParams({ title, subtitle, theme, badge });
  return `/og?q=${q}`;
}

export function buildAbsoluteOgImageUrl(options) {
  return `${getSiteUrl()}${buildOgImageUrl(options)}`;
}

export function ogImages({ title, subtitle, theme = 'brand', badge, alt }) {
  const url = buildOgImageUrl({ title, subtitle, theme, badge });
  return [
    {
      url,
      width: 1200,
      height: 630,
      alt: alt || title || 'JEE Challenger',
      type: 'image/png',
    },
  ];
}

/** Returns openGraph.images + twitter image URLs from one config object. */
export function ogImageMeta(options) {
  const images = ogImages(options);
  return {
    images,
    twitterImages: images.map((image) => image.url),
  };
}
