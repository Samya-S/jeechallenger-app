import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PYQS_API_URL, getAuthHeaders } from '@/server/services/pyqs';

export const dynamic = 'force-dynamic';

// DELETE /api/playlists/[id]/questions/[questionId] — remove question from playlist
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, questionId } = await params;

    const res = await fetch(`${PYQS_API_URL}/playlists/${id}/questions/${questionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(session.user.id),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error removing question from playlist:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
