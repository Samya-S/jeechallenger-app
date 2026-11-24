import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { BACKEND_API_URL, getAuthHeaders } from '@/server/services/pyqs';

export const dynamic = 'force-dynamic';

// GET /api/playlists/bookmarked-ids — fetch all question IDs saved by current user
export async function GET(req) {
  try {
    const session = await getServerSession(req);
    if (!session || !session.user?.id) {
      return NextResponse.json({ data: [] });
    }

    const res = await fetch(`${BACKEND_API_URL}/playlists/bookmarked-ids`, {
      headers: getAuthHeaders(session.user.id),
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error fetching bookmarked IDs:', err);
    return NextResponse.json({ success: false, error: 'INTERNAL_SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
