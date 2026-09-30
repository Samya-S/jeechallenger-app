import Link from "next/link";
import { BookOpen, FileText, Home, HelpCircle } from "lucide-react";
import { ogImageMeta } from "@/utils/og-metadata";

const pageOg = ogImageMeta({
  title: "404 - Question Not Found",
  subtitle: "The requested JEE Previous Year Question could not be found or has not been published yet.",
  theme: "pyqs",
  badge: "JEE PYQs",
  alt: "Question Not Found | JEE Challenger",
});

export const metadata = {
  title: "Question Not Found | JEE Challenger",
  description: "The requested JEE Previous Year Question could not be found. Explore thousands of verified JEE Main & Advanced questions with step-by-step KaTeX solutions.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Question Not Found | JEE Challenger",
    description: "The requested JEE Previous Year Question could not be found. Explore thousands of verified JEE Main & Advanced questions with step-by-step KaTeX solutions.",
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Question Not Found | JEE Challenger",
    description: "The requested JEE Previous Year Question could not be found. Explore thousands of verified JEE Main & Advanced questions with step-by-step KaTeX solutions.",
    images: pageOg.twitterImages,
  },
};

export default function QuestionNotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-12 sm:py-16 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Visual Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-md shadow-orange-500/20 text-white">
          <HelpCircle size={32} />
        </div>

        {/* 404 Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800/60 mb-3">
          <HelpCircle size={14} />
          <span>404 • Question Not Found</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
          Question Not Found
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8">
          The question you are looking for might have been moved, is currently being verified, or doesn&apos;t exist. Practice thousands of chapter-wise JEE questions with step-by-step solutions.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/previous-year-questions"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-150 hover:scale-[1.02] text-sm"
          >
            <BookOpen size={17} />
            Practice PYQs
          </Link>
          <Link
            href="/previous-year-questions?tab=papers"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold border border-slate-200 dark:border-gray-800 transition-colors text-sm"
          >
            <FileText size={17} />
            Shift Papers
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold border border-slate-200 dark:border-gray-800 transition-colors text-sm"
          >
            <Home size={17} />
            Home
          </Link>
        </div>

        {/* Quick Links by Subject */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-8 w-full">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
            Practice by Subject
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/previous-year-questions?subject=Physics"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-[#0d1320] dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 transition-colors"
            >
              Physics PYQs
            </Link>
            <Link
              href="/previous-year-questions?subject=Chemistry"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-[#0d1320] dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 transition-colors"
            >
              Chemistry PYQs
            </Link>
            <Link
              href="/previous-year-questions?subject=Mathematics"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-[#0d1320] dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800 transition-colors"
            >
              Mathematics PYQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
