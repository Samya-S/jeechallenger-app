import Link from "next/link";
import { 
  FileText, 
  ArrowLeft, 
  Home, 
  Sparkles, 
  HelpCircle, 
  Compass, 
  BookOpen, 
  Award, 
  ChevronRight 
} from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
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
  const examCategories = [
    {
      name: "JEE Main Shift Papers",
      tag: "Session 1 & 2 Shifts",
      desc: "Complete 3-hour shift papers with subject-wise Section A (MCQs) and Section B (Numericals).",
      color: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800/60",
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/30 dark:to-gray-900",
      badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
      href: "/previous-year-questions?tab=papers&exam_type=JEE_MAIN",
    },
    {
      name: "JEE Advanced Question Papers",
      tag: "Paper 1 & Paper 2",
      desc: "Official Paper 1 & Paper 2 with complex multiple-correct, numerical range, and comprehension sections.",
      color: "text-orange-600 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800/60",
      bg: "bg-gradient-to-br from-orange-50 to-amber-50/50 dark:from-orange-950/30 dark:to-gray-900",
      badgeClass: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
      href: "/previous-year-questions?tab=papers&exam_type=JEE_ADVANCED",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50/30 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero / Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-orange-600 to-amber-600 dark:from-red-950 dark:via-orange-950 dark:to-amber-950 border-b border-orange-600/20 shadow-lg">
        <div
          className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 40' stroke='rgba(255,255,255,0.2)' stroke-width='1' fill='none'/%3E%3Cpath d='M40 40L40 0' stroke='rgba(255,255,255,0.2)' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />

        <Breadcrumbs
          crumbs={[
            { label: "PYQs", href: "/previous-year-questions" },
            { label: "Paper Not Found" },
          ]}
          hasBanner={true}
          className="pt-4 z-10"
        />

        <div className="container mx-auto px-4 py-14 md:py-20 max-w-4xl relative text-center">
          <div className="space-y-6">
            {/* 404 Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/25 shadow-sm">
              <HelpCircle size={18} className="text-amber-200" />
              <span>404 - Paper Not Found</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Question Paper Not Found
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-orange-100 max-w-2xl mx-auto leading-relaxed">
              The exam paper you&apos;re looking for might not be available yet or the URL might have changed. Access our complete archive of official JEE Main and Advanced shift papers below.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/previous-year-questions?tab=papers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-orange-600 hover:bg-orange-50 font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <FileText size={18} />
                Browse All Shift Papers
              </Link>
              <Link
                href="/previous-year-questions"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-orange-700/60 hover:bg-orange-700/80 text-white font-medium px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200"
              >
                <BookOpen size={18} />
                Chapter-Wise Practice
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-3.5 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200"
              >
                <Home size={18} />
                Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
        {/* Exam Shortcuts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="text-orange-500" size={22} />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Explore Full Shift Papers
              </h2>
            </div>
            <Link
              href="/previous-year-questions?tab=papers"
              className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline"
            >
              View all papers →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {examCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={`p-6 sm:p-8 rounded-2xl border ${cat.border} ${cat.bg} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${cat.badgeClass}`}>
                      {cat.tag}
                    </span>
                    <Award className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-1.5 text-sm font-bold text-orange-600 dark:text-orange-400">
                  <span>Explore {cat.name}</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Continuous Upload Banner */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-orange-200/80 dark:border-orange-900/40 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center justify-center md:justify-start gap-2 text-orange-600 dark:text-orange-400 font-bold text-xs sm:text-sm uppercase tracking-wider">
              <Compass size={18} />
              <span>Continuous Archive Processing</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
              Looking for a recent session paper?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              We are actively uploading and verifying official answer keys and step-by-step solutions for recent shifts. Check back soon or practice topic-wise questions from our archive.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/previous-year-questions"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold shadow-md hover:shadow-lg transition-all duration-150 hover:scale-105 text-sm"
            >
              <BookOpen size={16} />
              Chapter-Wise PYQs
            </Link>
            <Link
              href="/ai-tutor"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold border border-gray-200 dark:border-gray-700 transition-colors text-sm shadow-xs"
            >
              <Sparkles size={16} />
              Ask AI Tutor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
