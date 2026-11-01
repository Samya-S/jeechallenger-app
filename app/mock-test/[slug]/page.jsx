import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CBTExamRoom from '@/components/cbt/CBTExamRoom';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

async function loadPaperAndQuestions(slug) {
  try {
    const res = await fetch(`${BACKEND_URL}/papers/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    const paper = data?.data;
    if (paper && Array.isArray(paper.questions) && paper.questions.length > 0) {
      return paper;
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch paper from PYQ microservice:', err);
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

  // Generate authentic 12-digit Roll Number based on User ID
  const candidateRollNo =
    '2603' +
    (session.user.id
      ? String(session.user.id).replace(/\D/g, '').slice(-8).padStart(8, '10048291')
      : '10048291');

  return (
    <div className="w-screen h-screen overflow-hidden bg-white text-gray-900 select-none">
      <CBTExamRoom
        paperData={paper}
        questionsData={paper.questions}
        candidateName={session.user.name || 'Candidate'}
        candidateRollNo={candidateRollNo}
        candidateImage={session.user.image}
      />
    </div>
  );
}
