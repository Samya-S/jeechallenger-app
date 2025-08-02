"use client";
import { useState, useEffect } from "react";

const TelegramPost = ({ url, themeGradient = "from-blue-600 to-purple-600" }) => {
  const [error, setError] = useState(false);

  // Theme configuration dictionary
  const themeConfig = {
    'from-blue-600 to-purple-600': {
      background: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    'from-green-600 to-teal-600': {
      background: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    'from-purple-600 to-pink-600': {
      background: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    'from-orange-600 to-red-600': {
      background: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    'from-indigo-600 to-cyan-600': {
      background: 'from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },
    'from-yellow-600 to-orange-600': {
      background: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    'from-emerald-600 to-teal-600': {
      background: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    }
  };

  const currentTheme = themeConfig[themeGradient] || themeConfig['from-blue-600 to-purple-600'];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-post", url);
    script.setAttribute("data-width", "100%");
    script.setAttribute("data-dark", "1");

    script.onerror = () => {
      setError(true); // Trigger error state if the script fails to load
    };

    const container = document.getElementById("telegram-widget-container");
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, [url]);

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
          <div className={`w-24 h-1 bg-gradient-to-r ${themeGradient} mx-auto rounded-full`}></div>
        </div>

        <div className="rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`bg-gradient-to-r ${themeGradient} p-3 rounded-full shadow-lg`}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">JEE Challenger</h3>
                <p className="text-gray-600 dark:text-gray-300">Official Telegram Channel</p>
              </div>
            </div>
            
            <div className={`bg-gradient-to-r ${currentTheme.background} rounded-xl p-4 mb-6 w-fit mx-auto`}>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className={currentTheme.textColor}>Please note:</strong> These links will only work if you are a subscriber of our official Telegram channel. If you're not subscribed, please join our channel first.
              </p>
            </div>
          </div>

          {error ? (
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
                  There was an issue loading the Telegram post. Please try refreshing the page or check your internet connection.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-4 -ml-10 md:-ml-0">
              <div id="telegram-widget-container" className="darkmode-ignore w-full" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TelegramPost;
