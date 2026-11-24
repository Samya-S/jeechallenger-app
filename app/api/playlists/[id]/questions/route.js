import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { BACKEND_API_URL, getAuthHeaders } from '@/server/services/pyqs';

export const dynamic = 'force-dynamic';

// POST /api/playlists/[id]/questions — add question to playlist
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(req);
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const res = await fetch(`${BACKEND_API_URL}/playlists/${id}/questions`, {
      method: 'POST',
      headers: getAuthHeaders(session.user.id, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error adding question to playlist:', err);
    return NextResponse.json({ success: false, error: 'INTERNAL_SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
