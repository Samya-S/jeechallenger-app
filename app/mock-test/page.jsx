import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { pyqsService } from '@/server/services/pyqs';
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

export default async function MockTestHubPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const isVaultTab = resolvedSearchParams?.tab === 'vault' || resolvedSearchParams?.tab === 'mistake-vault';

  const session = await getServerSession(authOptions);

  let submissions = [];
  let vaultItems = [];
  let initialVaultCount = 0;
  let initialPapers = [];
  let initialTotalPapers = 0;
  let initialTotalPages = 1;

  // Pre-fetch initial page of papers and total count for instant, zero-flicker badge rendering (revalidated every 5m)
  try {
    const papersJson = await pyqsService.getPapers(
      { page: 1, limit: 12 },
      { next: { revalidate: 300 } }
    );
    initialPapers = papersJson?.data || papersJson?.papers || [];
    if (papersJson?.meta) {
      initialTotalPapers = papersJson.meta.total || 0;
      initialTotalPages = papersJson.meta.total_pages || 1;
    } else {
      initialTotalPapers = initialPapers.length;
    }
  } catch (err) {
    console.error('Failed to pre-fetch papers for CBT Hub SSR:', err);
  }

  // If authenticated, fetch user submissions and mistake vault from Go microservice via unified service
  if (session?.user?.id) {
    try {
      const [subsData, vaultData] = await Promise.all([
        pyqsService.getSubmissions({ userId: session.user.id, limit: 50 }, { cache: 'no-store' }),
        pyqsService.getMistakeVault(
          { userId: session.user.id, countOnly: !isVaultTab },
          { cache: 'no-store' }
        ),
      ]);

      submissions = subsData || [];
      initialVaultCount = vaultData?.total ?? 0;
      vaultItems = vaultData?.items || [];
    } catch (err) {
      console.error('Failed to load user CBT data from microservice:', err);
    }
  }

  return (
    <CBTHubComponent
      user={session?.user || null}
      submissions={submissions}
      initialVaultItems={vaultItems}
      initialVaultCount={initialVaultCount}
      initialPapers={initialPapers}
      initialTotalPapers={initialTotalPapers}
      initialTotalPages={initialTotalPages}
    />
  );
}
