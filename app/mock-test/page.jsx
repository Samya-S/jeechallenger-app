import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import CBTHubComponent from '@/components/cbt/hub/CBTHubComponent';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CBT Mock Test Center & Mistake Vault | JEE Challenger',
  description: 'Practice official timed JEE Main and JEE Advanced Computer-Based Tests (CBT). Track your attempt history, speed analytics, and review your persistent Mistake Vault.',
  robots: {
    index: true,
    follow: true,
  },
};

export default async function MockTestHubPage() {
  const session = await getServerSession(authOptions);
  const client = await clientPromise;
  const db = client.db('jee_challenger_pyqs');

  // Load published papers
  const rawPapers = await db
    .collection('papers')
    .find({})
    .sort({ exam_year: -1, title: 1 })
    .project({
      _id: 1,
      title: 1,
      slug: 1,
      paper_id: 1,
      exam_type: 1,
      exam_year: 1,
      duration_minutes: 1,
      total_marks: 1,
      sections: 1,
    })
    .toArray();

  let submissions = [];
  let vaultItems = [];

  if (session?.user?.id) {
    const userId = session.user.id;
    const userQueries = [{ user_id: userId }];
    try {
      userQueries.push({ user_id: new ObjectId(userId) });
    } catch {}

    // Load user's test submissions
    submissions = await db
      .collection('test_submissions')
      .find({ $or: userQueries })
      .sort({ submitted_at: -1, started_at: -1 })
      .limit(50)
      .toArray();

    // Load user's Mistake Vault items
    const rawVault = await db
      .collection('mistake_vault')
      .find({ $or: userQueries })
      .sort({ saved_at: -1 })
      .limit(100)
      .toArray();

    // Populate question documents for vault items
    const qIds = rawVault
      .map((item) => {
        if (!item.question_id) return null;
        try {
          return typeof item.question_id === 'string'
            ? new ObjectId(item.question_id)
            : item.question_id;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    let questions = [];
    if (qIds.length > 0) {
      questions = await db
        .collection('production')
        .find({ _id: { $in: qIds } })
        .toArray();
    }

    const questionMap = new Map();
    questions.forEach((q) => {
      questionMap.set(String(q._id), q);
    });

    vaultItems = rawVault.map((item) => ({
      ...item,
      question: questionMap.get(String(item.question_id)) || null,
    }));
  }

  const cleanPapers = JSON.parse(JSON.stringify(rawPapers));
  const cleanSubmissions = JSON.parse(JSON.stringify(submissions));
  const cleanVaultItems = JSON.parse(JSON.stringify(vaultItems));

  return (
    <CBTHubComponent
      user={session?.user || null}
      papers={cleanPapers}
      submissions={cleanSubmissions}
      initialVaultItems={cleanVaultItems}
    />
  );
}
