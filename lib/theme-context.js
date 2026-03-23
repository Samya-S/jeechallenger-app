"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(undefined);

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function validTheme(value) {
  return value === "light" || value === "dark" || value === "system";
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{transition:none!important;animation:none!important;}"
    )
  );
  document.head.appendChild(style);

  return () => {
    // Force reflow so browsers apply the style before removal.
    void window.getComputedStyle(document.body);
    requestAnimationFrame(() => {
      document.head.removeChild(style);
    });
  };
}

function applyThemeToDocument(theme, attribute = "class", disableTransitionOnChange = false) {
  const root = document.documentElement;
  const resolved = theme === "system" ? getSystemTheme() : theme;

  const restoreTransitions = disableTransitionOnChange ? disableTransitionsTemporarily() : null;

  if (attribute === "class") {
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
  } else {
    root.setAttribute(attribute, resolved);
  }

  if (restoreTransitions) {
    restoreTransitions();
  }

  return resolved;
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  storageKey = "theme",
}) {
  const [theme, setThemeState] = useState(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    const initial = validTheme(stored) ? stored : defaultTheme;
    const sanitized = enableSystem ? initial : initial === "system" ? "light" : initial;

    setThemeState(sanitized);
    setResolvedTheme(applyThemeToDocument(sanitized, attribute, disableTransitionOnChange));
    setMounted(true);
  }, [attribute, defaultTheme, disableTransitionOnChange, enableSystem, storageKey]);

  useEffect(() => {
    if (!mounted) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => {
      setResolvedTheme(applyThemeToDocument(theme, attribute, disableTransitionOnChange));
    };

    syncTheme();

    if (theme === "system" && enableSystem) {
      const handler = () => syncTheme();
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, [attribute, disableTransitionOnChange, enableSystem, mounted, theme]);

  const setTheme = (value) => {
    const next = enableSystem ? value : value === "system" ? "light" : value;
    if (!validTheme(next)) return;

    setThemeState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, next);
    }
  };

  const contextValue = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      systemTheme: getSystemTheme(),
    }),
    [theme, resolvedTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
