"use client";

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
// import TelegramJoinFloat from "@/components/ui/TelegramJoinFloat";
// import AIAnnouncementModal from "@/components/modals/AIAnnouncementModal";
// import FeedbackModal from "@/components/modals/FeedbackModal";
import DonationModal from "@/components/modals/DonationModal";
import TelegramGateProvider from '../providers/TelegramGateProvider';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAITutorPage = pathname.startsWith('/ai-tutor');

  return (
    <TelegramGateProvider>
      {!isAITutorPage && (
        <Suspense fallback={
          <div className="h-[4.5rem] w-full flex items-center justify-between px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 fixed top-0">
            <div className="font-bold text-lg">JEE Challenger</div>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        }>
          <Navbar />
        </Suspense>
      )}
      {/* {!isAITutorPage && <TelegramJoinFloat />} */}
      {isAITutorPage ? (
        <div className="text-left">
          {children}
        </div>
      ) : (
        <main>
          {children}
        </main>
      )}
      {!isAITutorPage && <Footer />}
      {/* {!isAITutorPage && <AIAnnouncementModal />} */}
      {/* {!isAITutorPage && <FeedbackModal />} */}
      {!isAITutorPage && <DonationModal />}
    </TelegramGateProvider>
  );
} 