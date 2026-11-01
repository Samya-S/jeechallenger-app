import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

// GET /api/playlists/slug/[slug] — fetch playlist detail (for public guest or authenticated owner)
export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    const headers = {};
    if (session?.user?.id) {
      const token = jwt.sign(
        { id: session.user.id },
        process.env.NEXTAUTH_SECRET,
        { algorithm: 'HS256' }
      );
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BACKEND_URL}/playlists/${slug}`, {
      headers,
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error fetching playlist by slug:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
