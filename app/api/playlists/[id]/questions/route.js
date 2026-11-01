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

// POST /api/playlists/[id]/questions — add question to playlist
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const token = getSignedToken(session.user.id);

    const res = await fetch(`${BACKEND_URL}/playlists/${id}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error adding question to playlist:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
