import { ImageResponse } from 'next/og';
import { getArticleBySlug } from '../../../lib/articles';

// Route segment config
export const runtime = 'nodejs';

// Image metadata
export const alt = 'Blog Post Image';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image({ params }) {
  const { slug } = await params;
  const post = getArticleBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold', textAlign: 'center', color: '#1a202c' }}>
          {post?.title || 'JEE Challenger'}
        </div>
        <div style={{ fontSize: 30, color: '#4a5568', marginTop: 20 }}>
          JEE Challenger Blog
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}