import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

function getUserQueries(userId) {
  const queries = [{ user_id: userId }];
  try {
    queries.push({ user_id: new ObjectId(userId) });
  } catch {}
  return queries;
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const client = await clientPromise;
    const db = client.db('jee_challenger_pyqs');

    const { searchParams } = new URL(request.url);
    const paperId = searchParams.get('paper_id');
    const subject = searchParams.get('subject');

    const userQueries = getUserQueries(userId);
    const filter = { $or: userQueries };

    if (paperId) {
      filter.paper_id = paperId;
    }
    if (subject && subject !== 'ALL') {
      filter.subject = subject;
    }

    // If querying for a specific paper, return lightweight list of saved question numbers
    if (paperId) {
      const items = await db
        .collection('mistake_vault')
        .find(filter)
        .project({ question_number: 1, question_id: 1, subject: 1, paper_id: 1, saved_at: 1 })
        .toArray();

      const savedQuestionNumbers = items.map((i) => i.question_number);
      const savedQuestionIds = items.map((i) => String(i.question_id || ''));

      return NextResponse.json({
        savedQuestionNumbers,
        savedQuestionIds,
        items,
        total: items.length,
      });
    }

    // If querying full Mistake Vault across all papers, fetch populated questions
    const items = await db
      .collection('mistake_vault')
      .find(filter)
      .sort({ saved_at: -1 })
      .limit(100)
      .toArray();

    // Fetch associated question documents from production collection
    const questionObjectIds = [];
    items.forEach((item) => {
      if (item.question_id) {
        try {
          questionObjectIds.push(
            typeof item.question_id === 'string'
              ? new ObjectId(item.question_id)
              : item.question_id
          );
        } catch {}
      }
    });

    let questions = [];
    if (questionObjectIds.length > 0) {
      questions = await db
        .collection('production')
        .find({ _id: { $in: questionObjectIds } })
        .toArray();
    }

    const questionMap = new Map();
    questions.forEach((q) => {
      questionMap.set(String(q._id), q);
    });

    // Attach full question doc to each vault item
    const populatedItems = items.map((item) => ({
      ...item,
      question: questionMap.get(String(item.question_id)) || null,
    }));

    return NextResponse.json({
      items: populatedItems,
      total: items.length,
    });
  } catch (error) {
    console.error('Error fetching mistake vault:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { paper_id, paper_slug, question_number, question_id, subject, chapter } = body;

    if (!paper_id || (question_number === undefined && !question_id)) {
      return NextResponse.json(
        { error: 'paper_id and question_id (or question_number) are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('jee_challenger_pyqs');

    let cleanQId = null;
    if (question_id) {
      try {
        cleanQId = typeof question_id === 'string' && ObjectId.isValid(question_id)
          ? new ObjectId(question_id)
          : question_id;
      } catch {
        cleanQId = question_id;
      }
    }

    const userQueries = getUserQueries(userId);
    const existingFilter = {
      $or: userQueries,
      paper_id,
      ...(cleanQId ? { question_id: cleanQId } : { question_number: Number(question_number) }),
    };

    const existing = await db.collection('mistake_vault').findOne(existingFilter);

    if (existing) {
      // Toggle OFF: Remove from Mistake Vault
      await db.collection('mistake_vault').deleteOne({ _id: existing._id });
      const remainingCount = await db
        .collection('mistake_vault')
        .countDocuments({ $or: userQueries, paper_id });

      return NextResponse.json({
        saved: false,
        message: 'Question removed from Mistake Vault',
        paper_id,
        question_number: Number(question_number),
        remainingForPaper: remainingCount,
      });
    }

    // Toggle ON: Save to Mistake Vault in MongoDB
    let userObjectId = null;
    try {
      userObjectId = new ObjectId(userId);
    } catch {
      userObjectId = userId;
    }

    const doc = {
      user_id: userObjectId,
      paper_id,
      paper_slug: paper_slug || paper_id,
      question_number: Number(question_number),
      question_id: cleanQId,
      subject: subject || null,
      chapter: chapter || null,
      saved_at: new Date(),
    };

    await db.collection('mistake_vault').insertOne(doc);
    const totalForPaper = await db
      .collection('mistake_vault')
      .countDocuments({ $or: userQueries, paper_id });

    return NextResponse.json({
      saved: true,
      message: 'Question saved to Mistake Vault',
      paper_id,
      question_number: Number(question_number),
      totalForPaper,
    });
  } catch (error) {
    console.error('Error toggling mistake vault:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
