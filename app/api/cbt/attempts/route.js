import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const paperId = searchParams.get('paper_id') || '';
    const limit = searchParams.get('limit') || '50';

    const signedToken = jwt.sign(
      { id: session.user.id },
      process.env.NEXTAUTH_SECRET,
      { algorithm: 'HS256' }
    );

    let url = `${BACKEND_URL}/cbt/submissions?limit=${encodeURIComponent(limit)}`;
    if (paperId) {
      url += `&paper_id=${encodeURIComponent(paperId)}`;
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${signedToken}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ submissions: [] });
    }

    const json = await res.json();
    return NextResponse.json({ submissions: json?.data || [] });
  } catch (error) {
    console.error('Failed to fetch test submissions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
