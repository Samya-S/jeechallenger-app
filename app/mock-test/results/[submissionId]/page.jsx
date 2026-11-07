import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { pyqsService } from '@/server/services/pyqs';

export const dynamic = 'force-dynamic';

export default async function LegacyResultsRedirect({ params }) {
  const resolvedParams = await params;
  const submissionId = resolvedParams.submissionId;

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    redirect(`/login?callbackUrl=/mock-test/results/${submissionId}`);
  }

  try {
    const submission = await pyqsService.getSubmissionById({
      userId: session.user.id,
      submissionId,
    });

    if (!submission) {
      notFound();
    }

    const targetSlug = submission.paper_slug;
    if (!targetSlug) {
      notFound();
    }

    redirect(`/mock-test/${targetSlug}/results?submission=${submissionId}`);
  } catch (error) {
    if (error?.message?.includes('NEXT_REDIRECT')) throw error;
    notFound();
  }
}
