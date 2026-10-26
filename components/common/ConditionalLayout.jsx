"use client";

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import DonationModal from "@/components/modals/DonationModal";
import TelegramGateProvider from '../providers/TelegramGateProvider';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAITutorPage = pathname.startsWith('/ai-tutor');
  const isCBTExam = pathname.startsWith('/mock-test') && !pathname.includes('/results');
  const isMinimalLayout = isAITutorPage || isCBTExam;

  return (
    <TelegramGateProvider>
      {!isMinimalLayout && (
        <Suspense fallback={
          <div className="h-16 w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/60 z-50 sticky top-0">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">JEE Challenger</div>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        }>
          <Navbar />
        </Suspense>
      )}
      {isMinimalLayout ? (
        <div className="text-left w-full h-full">
          {children}
        </div>
      ) : (
        <main>
          {children}
        </main>
      )}
      {!isMinimalLayout && <Footer />}
      {!isMinimalLayout && <DonationModal />}
    </TelegramGateProvider>
  );
}
