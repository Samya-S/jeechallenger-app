import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PYQS_API_URL, getAuthHeaders } from '@/server/services/pyqs';

export const dynamic = 'force-dynamic';

// GET /api/playlists — list all playlists for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED', message: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(`${PYQS_API_URL}/playlists`, {
      headers: getAuthHeaders(session.user.id),
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error fetching playlists:', err);
    return NextResponse.json({ success: false, error: 'INTERNAL_SERVER_ERROR', message: err.message }, { status: 500 });
  }
}

// POST /api/playlists — create new custom playlist
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED', message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(`${PYQS_API_URL}/playlists`, {
      method: 'POST',
      headers: getAuthHeaders(session.user.id, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error creating playlist:', err);
    return NextResponse.json({ success: false, error: 'INTERNAL_SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
