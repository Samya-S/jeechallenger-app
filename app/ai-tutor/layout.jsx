'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import AITutorComponent from './AITutorComponent';
import AITutorSkeleton from './components/AITutorSkeleton';

export default function AITutorLayout({ children }) {
  const pathname = usePathname();
  const chatIdMatch = pathname.match(/^\/ai-tutor\/chat\/([^/]+)$/);
  const isMainChatUI = pathname === '/ai-tutor' || Boolean(chatIdMatch);

  // If visiting an invalid sub-route (e.g. /ai-tutor/invalid-link), pass through to the 404 handler
  if (!isMainChatUI) {
    return children;
  }

  // Otherwise, render the persistent AI Tutor app shell + page metadata/SEO structured data
  return (
    <>
      <Suspense fallback={<AITutorSkeleton />}>
        <AITutorComponent chatId={chatIdMatch?.[1] ?? null} />
      </Suspense>
      {children}
    </>
  );
}
