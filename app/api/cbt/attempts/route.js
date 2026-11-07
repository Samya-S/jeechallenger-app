import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { pyqsService } from '@/server/services/pyqs';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const paperId = searchParams.get('paper_id') || '';
    const limit = searchParams.get('limit') || '50';

    const submissions = await pyqsService.getSubmissions({
      userId: session.user.id,
      paperId,
      limit,
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Failed to fetch test submissions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
