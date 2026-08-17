"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useId } from "react";
import { useTheme } from "@teispace/next-themes";

const TelegramPost = ({ url, themeGradient = "from-blue-600 to-purple-600" }) => {
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  // useId gives a collision-free, SSR-safe unique ID per instance
  const instanceId = useId();
  // resolvedTheme gives the actual "dark" or "light" value (resolves "system" for us)
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Track whether we're below Tailwind's `sm` breakpoint (640px)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Theme configuration dictionary
  const themeConfig = {
    "from-blue-600 to-purple-600": {
      background: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    "from-green-600 to-teal-600": {
      background: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    "from-purple-600 to-pink-600": {
      background: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    "from-orange-600 to-red-600": {
      background: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    "from-indigo-600 to-cyan-600": {
      background: "from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    "from-yellow-600 to-orange-600": {
      background: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    "from-emerald-600 to-teal-600": {
      background: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    "from-cyan-500 to-teal-600": {
      background: "from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20",
      textColor: "text-cyan-600 dark:text-cyan-400",
    },
  };

  const currentTheme = themeConfig[themeGradient] || themeConfig["from-blue-600 to-purple-600"];

  useEffect(() => {
    if (!url || !containerRef.current) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-post", url);
    script.setAttribute("data-width", "100%");
    // Re-runs whenever isDark changes, so the widget always matches the site theme
    script.setAttribute("data-dark", isDark ? "1" : "0");
    // Hide the channel avatar (userpic) on mobile screens
    script.setAttribute("data-userpic", isMobile ? "false" : "true");

    script.onload = () => setStatus("ready");
    script.onerror = () => setStatus("error");

    containerRef.current.appendChild(script);

    // Cleanup: wipe the container (removes the injected iframe too) on unmount/url/theme change
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [url, isDark, isMobile]);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Updates
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Stay updated with our latest posts and announcements from our official Telegram channel
          </p>
          <div className={`w-24 h-1 bg-gradient-to-r ${themeGradient} mx-auto rounded-full`} />
        </div>

        <div className="rounded-2xl">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`bg-gradient-to-r ${themeGradient} p-3 rounded-full shadow-lg`}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">JEE Challenger</h3>
                <p className="text-gray-600 dark:text-gray-300">Official Telegram Channel</p>
              </div>
            </div>

            <div className={`bg-gradient-to-r ${currentTheme.background} rounded-xl p-4 mb-6 w-fit mx-auto`}>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className={currentTheme.textColor}>Please note: </strong>
                These links will only work if you are a subscriber of our official Telegram channel.
                If you&lsquo;re not subscribed, please{" "}
                <Link
                  href="https://t.me/+oOnj4y_ZYqYyZjA1"
                  target="_blank"
                  className={`${currentTheme.textColor} font-semibold`}
                  aria-label="Join our Telegram channel"
                >
                  join
                </Link>
                {" "}our channel first.
              </p>
            </div>
          </div>

          {/* Loading skeleton */}
          {status === "loading" && (
            <div className="w-full animate-pulse rounded-xl overflow-hidden">
              <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-xl" />
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div className="text-center py-8">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="bg-red-500 p-3 rounded-full">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-red-800 dark:text-red-200">Unable to Load Post</h3>
                </div>
                <p className="text-red-700 dark:text-red-300">
                  There was an issue loading the Telegram post. Please try refreshing the page or{" "}
                  <Link
                    href={`https://t.me/${url}`}
                    target="_blank"
                    className="underline hover:text-red-800 dark:hover:text-red-200"
                  >
                    view it directly on Telegram
                  </Link>.
                </p>
              </div>
            </div>
          )}

          {/*
            Always in the DOM so containerRef stays attached.
            Hidden until the widget script finishes loading.
          */}
          <div
            ref={containerRef}
            id={`telegram-widget-${instanceId}`}
            className={`w-full ${status !== "ready" ? "hidden" : ""}`}
          />
        </div>
      </div>
    </section>
  );
};

export default TelegramPost;
