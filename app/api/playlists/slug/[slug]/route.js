import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PYQS_API_URL, getAuthHeaders } from '@/server/services/pyqs';

export const dynamic = 'force-dynamic';

// GET /api/playlists/slug/[slug] — fetch playlist detail (for public guest or authenticated owner)
export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    const headers = session?.user?.id ? getAuthHeaders(session.user.id) : {};

    const res = await fetch(`${PYQS_API_URL}/playlists/${slug}`, {
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
