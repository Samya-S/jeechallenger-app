'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Monitor, ArrowLeft, BookOpen } from 'lucide-react';

function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    window.innerWidth < 1024
  );
}

export default function CBTMobileGuard({ children, paperSlug }) {
  const [isMobile, setIsMobile] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    setChecked(true);

    // If mobile is detected, immediately release any active fullscreen lock
    if (mobile && typeof document !== 'undefined') {
      const isFs = document.fullscreenElement || document.webkitFullscreenElement;
      if (isFs) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }
  }, []);

  // Avoid flash — render nothing until client check is done
  if (!checked) return null;

  if (!isMobile) return children;

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
          <Monitor className="w-8 h-8 text-blue-600" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">
            Desktop or Laptop Required
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            In accordance with official NTA Computer-Based Test standards, mock
            examinations require a minimum 1024&times;768 resolution with a
            keyboard and mouse. CBT mock tests cannot be taken on mobile devices
            or tablets.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/mock-test"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Mock Test Hub
          </Link>
          <Link
            href={paperSlug ? `/paper/${paperSlug}` : '/previous-year-questions'}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Practice Questions Without Timer
          </Link>
        </div>
      </div>
    </div>
  );
}
