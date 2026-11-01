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

  // 1. Fetch published papers from Go microservice
  let papers = [];
  try {
    const res = await fetch(`${BACKEND_URL}/papers?limit=100`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      papers = json?.data || [];
    }
  } catch (err) {
    console.error('Failed to load papers from Go microservice:', err);
  }

  let submissions = [];
  let vaultItems = [];

  // 2. If authenticated, fetch user submissions and mistake vault from Go microservice
  if (session?.user?.id) {
    const signedToken = jwt.sign(
      { id: session.user.id },
      process.env.NEXTAUTH_SECRET,
      { algorithm: 'HS256' }
    );
    const authHeaders = { Authorization: `Bearer ${signedToken}` };

    try {
      const [subsRes, vaultRes] = await Promise.all([
        fetch(`${BACKEND_URL}/cbt/submissions?limit=50`, {
          headers: authHeaders,
          cache: 'no-store',
        }),
        fetch(`${BACKEND_URL}/cbt/mistake-vault`, {
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
      papers={papers}
      submissions={submissions}
      initialVaultItems={vaultItems}
    />
  );
}
