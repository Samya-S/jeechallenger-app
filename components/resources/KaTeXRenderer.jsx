"use client";
import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * KaTeXRenderer
 * Renders a single LaTeX string using KaTeX.
 * Now uses Server-Side Rendering (SSR) via renderToString so math markup is visible to SEO bots instantly.
 */
const KaTeXRenderer = ({ latex, displayMode = false, className = "" }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false,
        trust: false,
      });
    } catch (e) {
      return latex; // fallback to raw string on error
    }
  }, [latex, displayMode]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default KaTeXRenderer;
