import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/utils/mongodb';
import CBTExamRoom from '@/components/cbt/CBTExamRoom';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

async function loadPaperAndQuestions(slug) {
  // Strategy 1: Fetch via Go Microservice API
  try {
    const res = await fetch(`${BACKEND_URL}/papers/${slug}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      const paper = data.data || data;
      if (paper && paper.questions && paper.questions.length > 0) {
        return paper;
      }
    }
  } catch (err) {
    // Fall back to direct database query
  }

  // Strategy 2: Direct MongoDB Atlas Query Fallback
  try {
    const client = await clientPromise;
    const db = client.db('jee_challenger_pyqs');
    const paper = await db.collection('papers').findOne({
      $or: [{ slug }, { paper_id: slug }],
    });

    if (!paper) return null;

    // Collect question IDs or query by paper_id
    let questions = [];
    const allQuestionIds = (paper.sections || [])
      .flatMap((s) => s.question_ids || [])
      .map((id) => {
        try {
          return typeof id === 'string' ? new ObjectId(id) : id;
        } catch {
          return id;
        }
      });

    if (allQuestionIds.length > 0) {
      questions = await db
        .collection('production')
        .find({ _id: { $in: allQuestionIds } })
        .sort({ question_number: 1 })
        .toArray();
    }

    if (questions.length === 0 && paper.paper_id) {
      questions = await db
        .collection('production')
        .find({ paper_id: paper.paper_id })
        .sort({ question_number: 1 })
        .toArray();
    }

    // Convert ObjectIds to strings for JSON serialization
    const cleanPaper = JSON.parse(JSON.stringify(paper));
    cleanPaper.questions = JSON.parse(JSON.stringify(questions));

    return cleanPaper;
  } catch (dbErr) {
    console.error('Failed to query paper directly from MongoDB:', dbErr);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const paper = await loadPaperAndQuestions(slug);

  if (!paper) {
    return {
      title: 'Mock Test Not Found | JEE Challenger',
    };
  }

  const examLabel = paper.exam_type === 'JEE_ADVANCED' ? 'JEE Advanced' : 'JEE Main';
  return {
    title: `${paper.title || slug} - Official CBT Mock Test | JEE Challenger`,
    description: `Take official full-length ${examLabel} Computer Based Mock Test with authentic NTA interface, real-time timer, and instant performance analysis.`,
    robots: {
      index: false, // Prevent search indexing of live exam room
      follow: false,
    },
  };
}

export default async function MockTestPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect(`/login?callbackUrl=/mock-test/${slug}`);
  }

  const paper = await loadPaperAndQuestions(slug);

  if (!paper || !paper.questions || paper.questions.length === 0) {
    notFound();
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-white text-gray-900 select-none">
      <CBTExamRoom
        paperData={paper}
        questionsData={paper.questions}
        candidateName={session.user.name || 'Candidate'}
      />
    </div>
  );
}
