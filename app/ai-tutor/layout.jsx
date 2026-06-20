'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import AITutorComponent from './AITutorComponent';
import { Suspense } from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function AITutorLayout({ children }) {
  const pathname = usePathname();
  const chatIdMatch = pathname.match(/^\/ai-tutor\/chat\/([^/]+)$/);
  const isMainChatUI = pathname === '/ai-tutor' || Boolean(chatIdMatch);

  return (
    <SessionProvider>
      {isMainChatUI ? (
        <Suspense fallback={
          <div className="fixed inset-0 h-[100dvh] bg-gray-50 dark:bg-black flex items-center justify-center">
            <FaSpinner className="animate-spin text-blue-500 text-3xl" />
          </div>
        }>
          <AITutorComponent chatId={chatIdMatch?.[1] ?? null} />
        </Suspense>
      ) : (
        children
      )}
      {isMainChatUI && children}
    </SessionProvider>
  );
}
