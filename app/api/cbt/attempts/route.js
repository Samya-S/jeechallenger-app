import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const client = await clientPromise;
    const db = client.db('jee_challenger_pyqs');

    const userQueries = [{ user_id: userId }];
    try {
      userQueries.push({ user_id: new ObjectId(userId) });
    } catch {}

    const submissions = await db
      .collection('test_submissions')
      .find({ $or: userQueries })
      .sort({ submitted_at: -1, started_at: -1 })
      .project({
        _id: 1,
        paper_id: 1,
        paper_title: 1,
        submitted_at: 1,
        started_at: 1,
        time_taken_seconds: 1,
        summary: 1,
      })
      .limit(50)
      .toArray();

    // Map paper_slug if paper exists
    const paperIds = [...new Set(submissions.map((s) => s.paper_id).filter(Boolean))];
    const papers = await db
      .collection('papers')
      .find({ paper_id: { $in: paperIds } })
      .project({ paper_id: 1, slug: 1 })
      .toArray();

    const slugMap = new Map();
    papers.forEach((p) => {
      slugMap.set(p.paper_id, p.slug);
    });

    const formattedSubmissions = submissions.map((sub) => ({
      ...sub,
      paper_slug: slugMap.get(sub.paper_id) || sub.paper_id,
    }));

    return NextResponse.json({ submissions: formattedSubmissions });
  } catch (error) {
    console.error('Failed to fetch test submissions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
