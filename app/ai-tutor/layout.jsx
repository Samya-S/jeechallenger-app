'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { usePathname } from 'next/navigation';
import AITutorComponent from './AITutorComponent';

export default function AITutorLayout({ children }) {
  const pathname = usePathname();
  const chatIdMatch = pathname.match(/^\/ai-tutor\/chat\/([^/]+)$/);
  const isMainChatUI = pathname === '/ai-tutor' || Boolean(chatIdMatch);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {isMainChatUI ? (
        <AITutorComponent chatId={chatIdMatch?.[1] ?? null} />
      ) : (
        children
      )}
      {isMainChatUI && children}
    </GoogleOAuthProvider>
  );
}
