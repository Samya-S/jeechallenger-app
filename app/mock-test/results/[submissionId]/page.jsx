import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

export default async function LegacyResultsRedirect({ params }) {
  const resolvedParams = await params;
  const submissionId = resolvedParams.submissionId;

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    redirect(`/login?callbackUrl=/mock-test/results/${submissionId}`);
  }

  try {
    const signedToken = jwt.sign(
      { id: session.user.id },
      process.env.NEXTAUTH_SECRET,
      { algorithm: 'HS256' }
    );

    const res = await fetch(`${BACKEND_URL}/cbt/submissions/${submissionId}`, {
      headers: { Authorization: `Bearer ${signedToken}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      notFound();
    }

    const json = await res.json();
    const submission = json?.data;
    if (!submission) {
      notFound();
    }

    const targetSlug = submission.paper_slug || submission.paper_id;
    redirect(`/mock-test/${targetSlug}/results?submission=${submissionId}`);
  } catch (error) {
    if (error?.message?.includes('NEXT_REDIRECT')) throw error;
    notFound();
  }
}

