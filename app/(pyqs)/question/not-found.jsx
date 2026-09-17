import Link from "next/link";
import { 
  BookOpen, 
  ArrowLeft, 
  Home, 
  Sparkles, 
  HelpCircle, 
  Compass, 
  FileText, 
  Atom, 
  FlaskConical, 
  Calculator,
  ChevronRight 
} from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
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
  const subjects = [
    {
      name: "Physics",
      icon: Atom,
      color: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800/60",
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/30 dark:to-gray-900",
      desc: "Mechanics, Electrodynamics, Optics, Thermodynamics, Modern Physics & more.",
      href: "/previous-year-questions?subject=Physics",
    },
    {
      name: "Chemistry",
      icon: FlaskConical,
      color: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800/60",
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/30 dark:to-gray-900",
      desc: "Physical, Organic, and Inorganic Chemistry with detailed reaction mechanisms.",
      href: "/previous-year-questions?subject=Chemistry",
    },
    {
      name: "Mathematics",
      icon: Calculator,
      color: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800/60",
      bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50/50 dark:from-purple-950/30 dark:to-gray-900",
      desc: "Calculus, Algebra, Coordinate Geometry, Vectors & 3D Geometry step-by-step.",
      href: "/previous-year-questions?subject=Mathematics",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero / Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 dark:from-orange-950 dark:via-orange-900 dark:to-amber-950 border-b border-orange-600/20 shadow-lg">
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
            { label: "Question Not Found" },
          ]}
          hasBanner={true}
          className="pt-4 z-10"
        />

        <div className="container mx-auto px-4 py-14 md:py-20 max-w-4xl relative text-center">
          <div className="space-y-6">
            {/* 404 Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/25 shadow-sm">
              <HelpCircle size={18} className="text-amber-200" />
              <span>404 - Question Not Found</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Question Not Found
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-orange-100 max-w-2xl mx-auto leading-relaxed">
              The question you&apos;re looking for might have been moved, renamed, or is currently being processed and verified. Explore thousands of verified JEE questions and full shift papers below.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/previous-year-questions"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-orange-600 hover:bg-orange-50 font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <BookOpen size={18} />
                Browse Chapter-Wise PYQs
              </Link>
              <Link
                href="/previous-year-questions?tab=papers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-orange-700/60 hover:bg-orange-700/80 text-white font-medium px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200"
              >
                <FileText size={18} />
                Explore Shift Papers
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
        {/* Subject Shortcuts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="text-orange-500" size={22} />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Practice Questions by Subject
              </h2>
            </div>
            <Link
              href="/previous-year-questions"
              className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline"
            >
              All Subjects →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.map((sub) => {
              const Icon = sub.icon;
              return (
                <Link
                  key={sub.name}
                  href={sub.href}
                  className={`p-6 rounded-2xl border ${sub.border} ${sub.bg} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group`}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${sub.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {sub.name} PYQs
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {sub.desc}
                    </p>
                  </div>
                  <div className="pt-5 flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                    <span>Practice {sub.name} Questions</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* AI Tutor Guidance Banner */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-orange-200/80 dark:border-orange-900/40 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center justify-center md:justify-start gap-2 text-orange-600 dark:text-orange-400 font-bold text-xs sm:text-sm uppercase tracking-wider">
              <Compass size={18} />
              <span>Stuck on a Specific Problem?</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
              Have doubts or need instant question solving?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Ask our 24/7 AI Tutor to get instant step-by-step LaTeX solutions, detailed concept explanations, and personalized JEE guidance.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/ai-tutor"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold shadow-md hover:shadow-lg transition-all duration-150 hover:scale-105 text-sm"
            >
              <Sparkles size={16} />
              Ask AI Tutor Free
            </Link>
            <Link
              href="/previous-year-questions"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold border border-gray-200 dark:border-gray-700 transition-colors text-sm shadow-xs"
            >
              <ArrowLeft size={16} />
              Back to PYQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
