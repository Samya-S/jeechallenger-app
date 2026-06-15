"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa";

const AITutorThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() =>
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true),
    []
  );

  if (!mounted) {
    return (
      <div
        className="rounded-full bg-white/20 flex-shrink-0 w-9 h-9"
        aria-hidden="true"
      />
    );
  }

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-white/40 w-9 h-9"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <FaSun className="text-base" />
      ) : (
        <FaMoon className="text-base" />
      )}
    </button>
  );
};

export default AITutorThemeToggle;
