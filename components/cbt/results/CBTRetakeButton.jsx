'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw } from 'lucide-react';
import CBTMockTestModal from '@/components/modals/CBTMockTestModal';

export default function CBTRetakeButton({ paper, paperSlug }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartExam = (slug) => {
    try {
      if (typeof document !== 'undefined' && !document.fullscreenElement) {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen().catch(() => {});
        }
      }
    } catch {
      // Ignore fullscreen rejection
    }
    router.push(`/mock-test/${slug || paperSlug}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-xs transition-all cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
        <span className="sm:hidden">Retake</span>
        <span className="hidden sm:inline">Retake Test</span>
      </button>

      <CBTMockTestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleStartExam}
        paper={paper || { slug: paperSlug, duration_minutes: 180, total_marks: 300 }}
      />
    </>
  );
}
