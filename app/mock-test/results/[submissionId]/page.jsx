import { notFound, redirect } from 'next/navigation';
import { ObjectId } from 'mongodb';
import clientPromise from '@/utils/mongodb';

export const dynamic = 'force-dynamic';

export default async function LegacyResultsRedirect({ params }) {
  const resolvedParams = await params;
  const submissionId = resolvedParams.submissionId;

  try {
    const client = await clientPromise;
    const db = client.db('jee_challenger_pyqs');

    let idQuery = null;
    try {
      idQuery = new ObjectId(submissionId);
    } catch {
      idQuery = submissionId;
    }

    const submission = await db.collection('test_submissions').findOne(
      { $or: [{ _id: idQuery }, { _id: String(submissionId) }] },
      { projection: { paper_id: 1 } }
    );

    if (!submission) {
      notFound();
    }

    // Resolve paper slug
    const paper = await db.collection('papers').findOne(
      { $or: [{ paper_id: submission.paper_id }, { slug: submission.paper_id }] },
      { projection: { slug: 1 } }
    );

    const targetSlug = paper?.slug || submission.paper_id;
    redirect(`/mock-test/${targetSlug}/results?submission=${submissionId}`);
  } catch (error) {
    if (error?.message?.includes('NEXT_REDIRECT')) throw error;
    notFound();
  }
}

