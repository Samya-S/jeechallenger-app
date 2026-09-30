import Link from "next/link";
import { FileText, BookOpen, Home, HelpCircle } from "lucide-react";
import { ogImageMeta } from "@/utils/og-metadata";

const pageOg = ogImageMeta({
  title: "404 - Paper Not Found",
  subtitle: "The requested JEE Previous Year Question Paper could not be found or has not been uploaded yet.",
  theme: "pyqs",
  badge: "JEE Papers",
  alt: "Paper Not Found | JEE Challenger",
});

export const metadata = {
  title: "Question Paper Not Found | JEE Challenger",
  description: "The requested JEE Previous Year Question Paper could not be found. Browse complete official JEE Main & Advanced shift papers with verified answer keys and KaTeX solutions.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Question Paper Not Found | JEE Challenger",
    description: "The requested JEE Previous Year Question Paper could not be found. Browse complete official JEE Main & Advanced shift papers with verified answer keys and KaTeX solutions.",
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Question Paper Not Found | JEE Challenger",
    description: "The requested JEE Previous Year Question Paper could not be found. Browse complete official JEE Main & Advanced shift papers with verified answer keys and KaTeX solutions.",
    images: pageOg.twitterImages,
  },
};

export default function PaperNotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-12 sm:py-16 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Visual Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-md shadow-orange-500/20 text-white">
          <FileText size={32} />
        </div>

        {/* 404 Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800/60 mb-3">
          <HelpCircle size={14} />
          <span>404 • Paper Not Found</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
          Question Paper Not Found
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8">
          The question paper you are looking for might not be uploaded yet, was moved, or the link is incorrect. Explore our complete archive of official JEE shift papers.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/previous-year-questions?tab=papers"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-150 hover:scale-[1.02] text-sm"
          >
            <FileText size={17} />
            Browse Shift Papers
          </Link>
          <Link
            href="/previous-year-questions"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold border border-slate-200 dark:border-gray-800 transition-colors text-sm"
          >
            <BookOpen size={17} />
            Practice PYQs
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold border border-slate-200 dark:border-gray-800 transition-colors text-sm"
          >
            <Home size={17} />
            Home
          </Link>
        </div>

        {/* Quick Links */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-8 w-full">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
            Quick Access
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/previous-year-questions?tab=papers&exam_type=JEE_MAIN"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-[#0d1320] dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 transition-colors"
            >
              JEE Main Shifts
            </Link>
            <Link
              href="/previous-year-questions?tab=papers&exam_type=JEE_ADVANCED"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-[#0d1320] dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 transition-colors"
            >
              JEE Advanced Papers
            </Link>
            <Link
              href="/ai-tutor"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-[#0d1320] dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 transition-colors"
            >
              AI Tutor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
