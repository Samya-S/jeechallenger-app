import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

// GET /api/playlists/bookmarked-ids — fetch all question IDs saved by current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ data: [] });
    }

    const token = jwt.sign(
      { id: session.user.id },
      process.env.NEXTAUTH_SECRET,
      { algorithm: 'HS256' }
    );

    const res = await fetch(`${BACKEND_URL}/playlists/bookmarked-ids`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error fetching bookmarked IDs:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
