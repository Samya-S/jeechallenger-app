import { ImageResponse } from 'next/og';
import { OG_THEMES } from '@/lib/og-themes';
import { getSiteUrl } from '@/lib/site-url';
import fs from 'fs/promises';
import path from 'path';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';
export { OG_THEMES };

function titleFontSize(title) {
  const len = title.length;
  if (len <= 30) return 72;
  if (len <= 45) return 60;
  if (len <= 60) return 50;
  if (len <= 80) return 42;
  return 36;
}

function subtitleFontSize(subtitle) {
  const len = subtitle?.length || 0;
  if (len <= 60) return 30;
  if (len <= 100) return 26;
  return 22;
}

function truncate(text, max = 120) {
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function themeLabel(theme) {
  const labels = {
    physics: 'Physics',
    chemistry: 'Chemistry',
    mathematics: 'Mathematics',
    materials: 'Study Materials',
    pyqs: 'Previous Year Questions',
    'ai-tutor': 'AI Tutor',
    'jee-main': 'JEE Main',
    'jee-advanced': 'JEE Advanced',
    news: 'JEE News',
    blog: 'Blog',
    syllabus: 'Syllabus Tracker',
    platform: 'Platforms',
    legal: 'Legal',
    home: 'Home',
  };
  return labels[theme] || null;
}

export function OgImageLayout({
  title,
  subtitle,
  badge = 'JEE Challenger',
  theme = 'brand',
  baseUrl = getSiteUrl(),
}) {
  const colors = OG_THEMES[theme] || OG_THEMES.brand;
  const displayTitle = truncate(title, 100);
  const displaySubtitle = truncate(subtitle, 200);
  const fontSize = titleFontSize(displayTitle);
  const subSize = subtitleFontSize(displaySubtitle);
  const siteHost = new URL(baseUrl).host;

  return (
    <div
      style={{
        fontFamily: '"Jost"',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'linear-gradient(135deg, #0f172a 0%, #111827 40%, #1e1b4b 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)',
          backgroundSize: '32px 32px',
          opacity: 0.35,
        }}
      />

      {/* Glow orbs */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: colors.glow,
          opacity: 0.18,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: -60,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: colors.to,
          opacity: 0.14,
        }}
      />

      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          background: `linear-gradient(180deg, ${colors.from}, ${colors.to})`,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          width: '100%',
          padding: '52px 72px 0 76px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Brand row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 32,
            }}
          >
            <img
              src={`${baseUrl}/images/jcicon.jpg`}
              width={56}
              height={56}
              style={{
                borderRadius: 12,
                marginRight: 14,
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#e2e8f0',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: `1px solid ${colors.from}`,
                  background: '#0f172a',
                }}
              >
                {badge}
              </div>
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              fontSize,
              fontWeight: 800,
              color: '#f8fafc',
              lineHeight: 1.12,
              marginBottom: displaySubtitle ? 20 : 0,
              letterSpacing: '-0.025em',
            }}
          >
            {displayTitle}
          </div>

          {/* Subtitle */}
          {displaySubtitle ? (
            <div
              style={{
                display: 'flex',
                fontSize: subSize,
                color: '#cbd5e1',
                lineHeight: 1.5,
                maxWidth: 960,
              }}
            >
              {displaySubtitle}
            </div>
          ) : null}
        </div>
      </div>

      {/* Footer URL */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          padding: '0 72px 32px 76px',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 16,
            color: '#475569',
          }}
        >
          {siteHost}
        </div>
      </div>
    </div>
  );
}

function resolveBaseUrl(baseUrl) {
  try {
    return new URL(baseUrl || getSiteUrl()).origin;
  } catch {
    return getSiteUrl();
  }
}

function buildImageResponse(element, fontRegular, fontSemiBold, fontBold) {
  return new ImageResponse(element, {
    ...OG_SIZE,
    ...(fontRegular && fontSemiBold && fontBold && {
      fonts: [
        { name: 'Jost', data: fontRegular, style: 'normal', weight: 400 },
        { name: 'Jost', data: fontSemiBold, style: 'normal', weight: 700 },
        { name: 'Jost', data: fontBold, style: 'normal', weight: 800 }, // Re-using bold data for 800
      ],
    }),
  });
}

export async function createOgImageResponse({ title, subtitle, badge, theme = 'brand', baseUrl }) {
  const resolvedBaseUrl = resolveBaseUrl(baseUrl);

  // Read the STATIC fonts directly from the file system
  const fontRegularPath = path.join(process.cwd(), 'public', 'fonts', 'Jost', 'static', 'Jost-Regular.ttf');
  const fontSemiBoldPath = path.join(process.cwd(), 'public', 'fonts', 'Jost', 'static', 'Jost-SemiBold.ttf');
  const fontBoldPath = path.join(process.cwd(), 'public', 'fonts', 'Jost', 'static', 'Jost-Bold.ttf');
  
  // Read both files
  const fontRegularData = await fs.readFile(fontRegularPath);
  const fontSemiBoldData = await fs.readFile(fontSemiBoldPath);
  const fontBoldData = await fs.readFile(fontBoldPath);
  
  return buildImageResponse(
    (
      <OgImageLayout
        title={title}
        subtitle={subtitle}
        badge={badge}
        theme={theme}
        baseUrl={resolvedBaseUrl}
      />
    ),
    fontRegularData,
    fontSemiBoldData,
    fontBoldData
  );
}

/** Minimal layout without external assets — used when full generation fails. */
export function createFallbackOgImageResponse() {
  const colors = OG_THEMES.brand;

  return buildImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 16,
          }}
        >
          JEE Challenger
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: '#e2e8f0',
          }}
        >
          Free JEE Preparation Platform
        </div>
      </div>
    ),
  );
}
