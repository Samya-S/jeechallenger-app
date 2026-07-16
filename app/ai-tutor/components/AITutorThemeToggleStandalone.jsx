"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@teispace/next-themes";
import { FaSun, FaMoon } from "react-icons/fa";

/** Theme toggle for pages without the gradient AI tutor navbar (e.g. login). */
const AITutorThemeToggleStandalone = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() =>
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true),
    []
  );

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80" aria-hidden="true" />
    );
  }

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <FaSun className="text-base" /> : <FaMoon className="text-base" />}
    </button>
  );
};

export default AITutorThemeToggleStandalone;
