"use client";

import { usePathname } from 'next/navigation';
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import TelegramJoinFloat from "@/components/utils/TelegramJoinFloat";
import AIAnnouncementModal from "@/components/common/AIAnnouncementModal";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAITutorPage = pathname.startsWith('/ai-tutor');

  return (
    <>
      {!isAITutorPage && <Navbar />}
      {!isAITutorPage && <TelegramJoinFloat />}
      <div className={`${isAITutorPage ? 'text-left' : ''}`}>
        {children}
      </div>
      {!isAITutorPage && <Footer />}
      {!isAITutorPage && <AIAnnouncementModal />}
    </>
  );
} 