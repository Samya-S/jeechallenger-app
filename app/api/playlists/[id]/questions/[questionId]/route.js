import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { BACKEND_API_URL, getAuthHeaders } from '@/server/services/pyqs';

export const dynamic = 'force-dynamic';

// DELETE /api/playlists/[id]/questions/[questionId] — remove question from playlist
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(req);
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
    }

    const { id, questionId } = await params;

    const res = await fetch(`${BACKEND_API_URL}/playlists/${id}/questions/${questionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(session.user.id),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error removing question from playlist:', err);
    return NextResponse.json({ success: false, error: 'INTERNAL_SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
