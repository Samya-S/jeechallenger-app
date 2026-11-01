import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

function getSignedToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.NEXTAUTH_SECRET,
    { algorithm: 'HS256' }
  );
}

// PUT /api/playlists/[id] — update playlist
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const token = getSignedToken(session.user.id);

    const res = await fetch(`${BACKEND_URL}/playlists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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
    const token = getSignedToken(session.user.id);

    const res = await fetch(`${BACKEND_URL}/playlists/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error deleting playlist:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
