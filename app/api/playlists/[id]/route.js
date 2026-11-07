import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PYQS_API_URL, getAuthHeaders } from '@/server/services/pyqs';

export const dynamic = 'force-dynamic';

// PUT /api/playlists/[id] — update playlist
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const res = await fetch(`${PYQS_API_URL}/playlists/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(session.user.id, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error updating playlist:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/playlists/[id] — delete custom playlist
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const res = await fetch(`${PYQS_API_URL}/playlists/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(session.user.id),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error deleting playlist:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
