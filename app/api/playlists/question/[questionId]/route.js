import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PYQS_API_URL, getAuthHeaders } from '@/server/services/pyqs';

export const dynamic = 'force-dynamic';

// GET /api/playlists/question/[questionId] — get user playlists containing this question
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questionId } = await params;

    const res = await fetch(`${PYQS_API_URL}/playlists/question/${questionId}`, {
      headers: getAuthHeaders(session.user.id),
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error fetching question membership:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
