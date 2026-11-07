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
    const subject = searchParams.get('subject') || '';
    const countOnly = searchParams.get('count_only') === 'true';

    const data = await pyqsService.getMistakeVault({
      userId: session.user.id,
      subject,
      countOnly,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching mistake vault via pyqsService:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { question_id } = body;

    if (!question_id) {
      return NextResponse.json(
        { error: 'question_id is required' },
        { status: 400 }
      );
    }

    const result = await pyqsService.toggleMistakeVaultItem({
      userId: session.user.id,
      questionId: question_id,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error || 'Failed to toggle mistake vault' },
        { status: result.status || 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error toggling mistake vault via pyqsService:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
