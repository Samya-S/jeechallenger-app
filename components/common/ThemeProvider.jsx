"use client";

import { ThemeProvider as NextThemesProvider } from "@teispace/next-themes";

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}