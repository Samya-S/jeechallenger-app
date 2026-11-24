import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const session = await getSession(req);

    if (!session || !session.user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: session.user,
    });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
