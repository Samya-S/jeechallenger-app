import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { BACKEND_API_URL, getAuthHeaders } from '@/server/services/pyqs';

export const dynamic = 'force-dynamic';

// POST /api/playlists/slug/[slug]/clone — clone a public playlist to current user's lists
export async function POST(req, { params }) {
  try {
    const { slug } = await params;
    const session = await getServerSession(req);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_API_URL}/playlists/slug/${slug}/clone`, {
      method: 'POST',
      headers: getAuthHeaders(session.user.id),
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error cloning playlist by slug:', err);
    return NextResponse.json({ success: false, error: 'INTERNAL_SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
