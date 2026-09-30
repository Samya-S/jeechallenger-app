import Link from "next/link";
import { FaTelegram, FaInstagram, FaYoutube, FaGithub } from "react-icons/fa";
// import GoogleAdsUnit from "@/components/ui/GoogleAdsUnit";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission Column */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 group"
              aria-label="JEE Challenger Homepage"
            >
              <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                JEE Challenger
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              A free, open-source preparation platform helping JEE Main & Advanced aspirants master concepts, practice past papers, and track their progress.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <Link
                href="https://t.me/+oOnj4y_ZYqYyZjA1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join our Telegram channel"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#229ED9] dark:hover:text-[#229ED9] bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 hover:border-[#229ED9]/40 hover:bg-[#229ED9]/5 dark:hover:bg-[#229ED9]/10 transition-all"
              >
                <FaTelegram className="text-lg" />
              </Link>
              <Link
                href="https://www.instagram.com/jeechallenger"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#E4405F] dark:hover:text-[#E4405F] bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 hover:border-[#E4405F]/40 hover:bg-[#E4405F]/5 dark:hover:bg-[#E4405F]/10 transition-all"
              >
                <FaInstagram className="text-lg" />
              </Link>
              <Link
                href="https://www.youtube.com/@jeechallenger"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to our YouTube channel"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#FF0000] dark:hover:text-[#FF0000] bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 hover:border-[#FF0000]/40 hover:bg-[#FF0000]/5 dark:hover:bg-[#FF0000]/10 transition-all"
              >
                <FaYoutube className="text-lg" />
              </Link>
            </div>
          </div>

          {/* Resources Column */}
          <div className="col-span-1">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/physics" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Physics
                </Link>
              </li>
              <li>
                <Link href="/chemistry" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Chemistry
                </Link>
              </li>
              <li>
                <Link href="/mathematics" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Mathematics
                </Link>
              </li>
              <li>
                <Link href="/previous-year-questions" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Previous Year Questions
                </Link>
              </li>
              <li>
                <Link href="/more-study-materials" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  More Materials
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Access Column */}
          <div className="col-span-1">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Quick Access
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/ai-tutor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  AI Tutor
                </Link>
              </li>
              <li>
                <Link
                  href="/syllabus-tracker"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Syllabus Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/chemistry/periodic-table"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Periodic Table
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Articles & Tips
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Latest News
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support Column */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Legal & Support
            </h3>
            <ul className="flex flex-wrap sm:flex-col gap-x-5 gap-y-2.5 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Support Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p className="text-center sm:text-left" suppressHydrationWarning>
            © 2020–{new Date().getFullYear()} JEE Challenger. All rights reserved.
          </p>

          <Link
            href="https://github.com/Samya-S/jeechallenger-app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <FaGithub className="text-sm" />
            <span>Source Code</span>
          </Link>
        </div>
      </div>

      {/* <GoogleAdsUnit /> */}
    </footer>
  );
};

export default Footer;
