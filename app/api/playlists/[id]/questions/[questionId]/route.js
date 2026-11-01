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

// DELETE /api/playlists/[id]/questions/[questionId] — remove question from playlist
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, questionId } = await params;
    const token = getSignedToken(session.user.id);

    const res = await fetch(`${BACKEND_URL}/playlists/${id}/questions/${questionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error removing question from playlist:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
