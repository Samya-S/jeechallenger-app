import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/utils/mongodb';
import CBTScorecard from '@/components/cbt/results/CBTScorecard';
import CBTPacingHeatmap from '@/components/cbt/results/CBTPacingHeatmap';
import CBTSolutionReview from '@/components/cbt/results/CBTSolutionReview';
import { ArrowLeft, RotateCcw, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function loadSubmissionAndQuestions(slug, submissionId, sessionUserId) {
  try {
    const client = await clientPromise;
    const db = client.db('jee_challenger_pyqs');

    // Find the paper to resolve paper_id and slug
    const paper = await db.collection('papers').findOne({
      $or: [{ slug }, { paper_id: slug }],
    });

    const paperId = paper ? paper.paper_id : slug;

    let submission = null;

    // Strategy 1: If explicit submissionId is provided, look it up
    if (submissionId) {
      let idQuery = null;
      try {
        idQuery = new ObjectId(submissionId);
      } catch {
        idQuery = submissionId;
      }

      submission = await db.collection('test_submissions').findOne({
        $or: [{ _id: idQuery }, { _id: String(submissionId) }],
      });
    }

    // Strategy 2: If no submissionId or not found, find the latest attempt by this user for this paper
    if (!submission && sessionUserId) {
      const userQueries = [{ user_id: sessionUserId }];
      try {
        userQueries.push({ user_id: new ObjectId(sessionUserId) });
      } catch {}

      submission = await db
        .collection('test_submissions')
        .find({
          $or: userQueries,
          paper_id: { $in: [paperId, slug] },
        })
        .sort({ submitted_at: -1, started_at: -1 })
        .limit(1)
        .toArray()
        .then((arr) => arr[0] || null);
    }

    if (!submission) return null;

    // Load full question documents for solutions
    let questions = [];
    if (submission.paper_id) {
      questions = await db
        .collection('production')
        .find({ paper_id: submission.paper_id })
        .sort({ question_number: 1 })
        .toArray();
    }

    if (questions.length === 0 && submission.question_attempts) {
      const qIds = submission.question_attempts
        .map((a) => {
          try {
            return typeof a.question_id === 'string' ? new ObjectId(a.question_id) : a.question_id;
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      if (qIds.length > 0) {
        questions = await db
          .collection('production')
          .find({ _id: { $in: qIds } })
          .sort({ question_number: 1 })
          .toArray();
      }
    }

    const cleanSubmission = JSON.parse(JSON.stringify(submission));
    const cleanQuestions = JSON.parse(JSON.stringify(questions));

    return {
      submission: cleanSubmission,
      questions: cleanQuestions,
      paperSlug: paper?.slug || slug,
    };
  } catch (error) {
    console.error('Failed to load submission data:', error);
    return null;
  }
}

export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedQuery = await searchParams;
  const slug = resolvedParams.slug;
  const submissionId = resolvedQuery?.submission;

  const session = await getServerSession(authOptions);
  const data = await loadSubmissionAndQuestions(slug, submissionId, session?.user?.id);

  if (!data?.submission) {
    return {
      title: 'Scorecard Not Found | JEE Challenger',
    };
  }

  const sub = data.submission;
  const score = sub.summary?.total_score ?? 0;
  const max = sub.summary?.max_marks ?? 300;

  return {
    title: `Scorecard: ${score}/${max} - ${sub.paper_title || slug} | JEE Challenger`,
    description: `Official mock test scorecard for ${sub.paper_title}. Score: ${score}/${max}, Accuracy: ${sub.summary?.accuracy_percentage}%. Detailed question-by-question solution review.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function MockTestResultsPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedQuery = await searchParams;
  const slug = resolvedParams.slug;
  const submissionId = resolvedQuery?.submission;

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect(`/login?callbackUrl=/mock-test/${slug}/results`);
  }

  const data = await loadSubmissionAndQuestions(slug, submissionId, session.user.id);

  if (!data || !data.submission) {
    // If no test submission exists yet, redirect to start the test
    redirect(`/mock-test/${slug}`);
  }

  const { submission, questions, paperSlug } = data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <Link
            href="/previous-year-questions?tab=papers"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Question Papers</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={`/mock-test/${paperSlug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
              <span>Retake Test</span>
            </Link>

            <Link
              href={`/paper/${paperSlug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Full Paper</span>
            </Link>
          </div>
        </div>

        {/* Section 1: Executive Scorecard Banner & Metrics */}
        <CBTScorecard submission={submission} />

        {/* Section 2: Pacing & Speed vs Accuracy Heatmap */}
        <CBTPacingHeatmap submission={submission} />

        {/* Section 3: Question-by-Question Solution Navigator */}
        <CBTSolutionReview submission={submission} questionsData={questions} />
      </div>
    </div>
  );
}
