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

// GET /api/playlists — list all playlists for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = getSignedToken(session.user.id);
    const res = await fetch(`${BACKEND_URL}/playlists`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error fetching playlists:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/playlists — create new custom playlist
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const token = getSignedToken(session.user.id);

    const res = await fetch(`${BACKEND_URL}/playlists`, {
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
    console.error('Error creating playlist:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
