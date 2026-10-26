import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ObjectId } from 'mongodb';
import clientPromise from '@/utils/mongodb';
import CBTScorecard from '@/components/cbt/results/CBTScorecard';
import CBTPacingHeatmap from '@/components/cbt/results/CBTPacingHeatmap';
import CBTSolutionReview from '@/components/cbt/results/CBTSolutionReview';
import { ArrowLeft, RotateCcw, Share2, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function loadSubmissionAndQuestions(submissionId) {
  try {
    const client = await clientPromise;
    const db = client.db('jee_challenger_pyqs');

    let idQuery = null;
    try {
      idQuery = new ObjectId(submissionId);
    } catch {
      idQuery = submissionId;
    }

    const submission = await db.collection('test_submissions').findOne({
      $or: [{ _id: idQuery }, { _id: String(submissionId) }],
    });

    if (!submission) return null;

    // Load full question documents with solutions
    let questions = [];
    if (submission.paper_id) {
      questions = await db
        .collection('production')
        .find({ paper_id: submission.paper_id })
        .sort({ question_number: 1 })
        .toArray();
    }

    // Fallback: If paper_id didn't yield questions, load by question_id list in submission
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

    // Serialize MongoDB ObjectIds and Dates for client components
    const cleanSubmission = JSON.parse(JSON.stringify(submission));
    const cleanQuestions = JSON.parse(JSON.stringify(questions));

    return { submission: cleanSubmission, questions: cleanQuestions };
  } catch (error) {
    console.error('Failed to load submission data:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const submissionId = resolvedParams.submissionId;
  const data = await loadSubmissionAndQuestions(submissionId);

  if (!data?.submission) {
    return {
      title: 'Scorecard Not Found | JEE Challenger',
    };
  }

  const sub = data.submission;
  const score = sub.summary?.total_score ?? 0;
  const max = sub.summary?.max_marks ?? 300;

  return {
    title: `Scorecard: ${score}/${max} - ${sub.paper_title || sub.paper_id} | JEE Challenger`,
    description: `Official mock test scorecard for ${sub.paper_title}. Total marks: ${score}/${max}, Accuracy: ${sub.summary?.accuracy_percentage}%. View step-by-step solutions and speed analysis.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function MockTestResultsPage({ params }) {
  const resolvedParams = await params;
  const submissionId = resolvedParams.submissionId;
  const data = await loadSubmissionAndQuestions(submissionId);

  if (!data || !data.submission) {
    notFound();
  }

  const { submission, questions } = data;
  const paperSlug = submission.paper_id;

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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
              <span>Retake Test</span>
            </Link>

            <Link
              href={`/paper/${paperSlug}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
            >
              <span>Paper Overview</span>
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
