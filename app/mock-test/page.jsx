import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import jwt from 'jsonwebtoken';
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

const BACKEND_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

export default async function MockTestHubPage() {
  const session = await getServerSession(authOptions);

  let submissions = [];
  let vaultItems = [];
  let initialPapers = [];
  let initialTotalPapers = 0;
  let initialTotalPages = 1;

  // Pre-fetch initial page of papers and total count for instant, zero-flicker badge rendering
  try {
    const papersRes = await fetch(`${BACKEND_URL}/papers?page=1&limit=12`, {
      next: { revalidate: 300 },
    });
    if (papersRes.ok) {
      const papersJson = await papersRes.json();
      initialPapers = papersJson?.data || papersJson?.papers || [];
      if (papersJson?.meta) {
        initialTotalPapers = papersJson.meta.total || 0;
        initialTotalPages = papersJson.meta.total_pages || 1;
      } else {
        initialTotalPapers = initialPapers.length;
      }
    }
  } catch (err) {
    console.error('Failed to pre-fetch papers for CBT Hub SSR:', err);
  }

  // If authenticated, fetch user submissions and mistake vault from Go microservice
  if (session?.user?.id) {
    const signedToken = jwt.sign(
      { id: session.user.id },
      process.env.NEXTAUTH_SECRET,
      { algorithm: 'HS256' }
    );
    const authHeaders = { Authorization: 'Bearer ' + signedToken };

    try {
      const [subsRes, vaultRes] = await Promise.all([
        fetch(BACKEND_URL + '/cbt/submissions?limit=50', {
          headers: authHeaders,
          cache: 'no-store',
        }),
        fetch(BACKEND_URL + '/cbt/mistake-vault', {
          headers: authHeaders,
          cache: 'no-store',
        }),
      ]);

      if (subsRes.ok) {
        const subsJson = await subsRes.json();
        submissions = subsJson?.data || [];
      }

      if (vaultRes.ok) {
        const vaultJson = await vaultRes.json();
        vaultItems = vaultJson?.items || [];
      }
    } catch (err) {
      console.error('Failed to load user CBT data from microservice:', err);
    }
  }

  return (
    <CBTHubComponent
      user={session?.user || null}
      submissions={submissions}
      initialVaultItems={vaultItems}
      initialPapers={initialPapers}
      initialTotalPapers={initialTotalPapers}
      initialTotalPages={initialTotalPages}
    />
  );
}
