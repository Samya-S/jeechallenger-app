'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import AITutorComponent from './AITutorComponent';

export default function AITutorLayout({ children }) {
  const pathname = usePathname();
  const chatIdMatch = pathname.match(/^\/ai-tutor\/chat\/([^/]+)$/);
  const isMainChatUI = pathname === '/ai-tutor' || Boolean(chatIdMatch);

  return (
    <SessionProvider>
      {isMainChatUI ? (
        <AITutorComponent chatId={chatIdMatch?.[1] ?? null} />
      ) : (
        children
      )}
      {isMainChatUI && children}
    </SessionProvider>
  );
}
