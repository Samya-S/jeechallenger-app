import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { pyqsService } from '@/server/services/pyqs';
import CBTScorecard from '@/components/cbt/results/CBTScorecard';
import CBTPacingHeatmap from '@/components/cbt/results/CBTPacingHeatmap';
import CBTSolutionReview from '@/components/cbt/results/CBTSolutionReview';
import CBTAttemptSwitcher from '@/components/cbt/results/CBTAttemptSwitcher';
import CBTRetakeButton from '@/components/cbt/results/CBTRetakeButton';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function loadSubmissionAndQuestions(slug, submissionId, sessionUserId) {
  try {
    if (!sessionUserId) return null;

    // 1. Fetch paper and canonical questions via unified service
    const paper = await pyqsService.getPaperBySlug(slug);
    if (!paper) return null;

    // 2. Fetch all user attempts for this paper (for attempt switcher and fallback to latest)
    let allAttempts = [];
    try {
      allAttempts = await pyqsService.getSubmissions({
        userId: sessionUserId,
        paperId: paper.paper_id,
        limit: 50,
      });
    } catch (listErr) {
      console.warn('Failed to load user attempt history:', listErr);
    }

    // Determine target submission ID: either requested or latest completed attempt
    const targetSubmissionId = submissionId || allAttempts[0]?._id;
    if (!targetSubmissionId) {
      return null;
    }

    // 3. Fetch specific submission via unified service
    const submission = await pyqsService.getSubmissionById({
      userId: sessionUserId,
      submissionId: targetSubmissionId,
    });
    if (!submission) return null;

    return {
      paper,
      submission,
      questions: paper.questions || [],
      allAttempts,
      paperSlug: paper.slug || slug,
    };
  } catch (error) {
    console.error('Failed to load submission data via pyqsService:', error);
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

  const { paper, submission, questions, allAttempts = [], paperSlug } = data;

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Navigation & Breadcrumbs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <Breadcrumbs
            crumbs={[
              { label: 'Mock Tests', href: '/mock-test' },
              { label: 'Scorecard', href: `/mock-test/${paperSlug}/results?submission=${submission._id}` },
            ]}
          />

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {allAttempts.length > 0 && (
              <CBTAttemptSwitcher
                paperSlug={paperSlug}
                allAttempts={allAttempts}
                currentSubmissionId={submission._id}
              />
            )}

            <CBTRetakeButton paper={paper} paperSlug={paperSlug} />

            <Link
              href={`/paper/${paperSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="sm:hidden">Full Paper</span>
              <span className="hidden sm:inline">View Full Paper</span>
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
