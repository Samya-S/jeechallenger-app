import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import BlogCard from "@/components/ui/BlogCard";

export default function BlogsDemoWidget({ latestArticles = [] }) {
  return (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">Preparation Insights</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                    Latest Articles & Preparation Guides
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Stay updated with topper strategies, exam insights, and revision planning guides.
                  </p>
                </div>

                <div>
                  <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>View All Articles</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {latestArticles && latestArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {latestArticles.map((article) => (
                    <BlogCard key={article.slug} post={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-md shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06]">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Explore our complete blog collection for in-depth JEE preparation advice.</p>
                  <Link
                    href="/blogs"
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                  >
                    <span>Browse All Articles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

  );
}
