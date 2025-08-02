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
      {!isAITutorPage && <AIAnnouncementModal />}
    </>
  );
} 