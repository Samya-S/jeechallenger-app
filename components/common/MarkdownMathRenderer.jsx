'use client';

import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const MarkdownTable = ({ children }) => {
  const tableRef = useRef(null);

  useEffect(() => {
    const ref = tableRef.current;
    if (!ref) return undefined;

    const onWheel = (e) => {
      if (e.shiftKey) return;
      if (ref.scrollWidth > ref.clientWidth) {
        if (e.deltaY !== 0 && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
          const canScrollLeft = ref.scrollLeft > 0;
          const canScrollRight = ref.scrollLeft < ref.scrollWidth - ref.clientWidth - 1;
          if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
            ref.scrollLeft += e.deltaY;
            e.preventDefault();
          }
        }
      }
    };

    ref.addEventListener('wheel', onWheel, { passive: false });
    return () => ref.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div ref={tableRef} className="overflow-x-auto scrollbar-thin my-4 max-w-full w-fit border border-gray-300 dark:border-gray-700 rounded-lg">
      <table className="w-max table-auto border-collapse border border-gray-300 dark:border-gray-700">
        {children}
      </table>
    </div>
  );
};

const resolveUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://pyq-assets.jeechallenger.com/${url}`;
};

const replaceShortcodesWithLayout = (text, pattern, urls, typePrefix) => {
  if (!text || !urls || urls.length === 0) return text;

  return text.replace(pattern, (match, idxStr, offset, fullString) => {
    const idx = parseInt(idxStr, 10);
    const url = urls[idx];
    if (!url) return match;

    const before = fullString.slice(0, offset);
    const after = fullString.slice(offset + match.length);

    const lineBefore = before.split(/\r?\n/).pop() || "";
    const lineAfter = after.split(/\r?\n/).shift() || "";

    const isStandalone = lineBefore.trim() === "" && lineAfter.trim() === "";
    const alt = isStandalone ? `standalone:${typePrefix} ${idx}` : `${typePrefix} ${idx}`;
    const imgMarkdown = `![${alt}](${resolveUrl(url)})`;

    return isStandalone ? `\n\n${imgMarkdown}\n\n` : imgMarkdown;
  });
};

/**
 * MarkdownMathRenderer
 * Renders Markdown with full KaTeX math support (\(...\), \[...\], $$...$$, $...$),
 * responsive tables, code blocks, theme styling, and inline diagram shortcode positioning.
 */
const MarkdownMathRenderer = ({
  content,
  className = '',
  diagramUrls = [],
  passageDiagramUrls = [],
  onImageClick,
}) => {
  if (!content) return null;

  let processedContent = typeof content === 'string' ? content : String(content);

  processedContent = replaceShortcodesWithLayout(
    processedContent,
    /\{\{diagram[:_](\d+)\}\}/gi,
    diagramUrls,
    "Diagram"
  );

  processedContent = replaceShortcodesWithLayout(
    processedContent,
    /\{\{passage_diagram[:_](\d+)\}\}/gi,
    passageDiagramUrls,
    "Passage Diagram"
  );

  return (
    <div className={`text-left text-base leading-relaxed [&_.katex-display]:text-left [&_.katex-display]:my-3 [&_.katex-display]:py-1.5 [&_.katex-display]:px-1 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display>.katex]:text-left ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
        rehypePlugins={[rehypeKatex]}
        components={{
          img: ({ src, alt }) => {
            const isStandalone = typeof alt === "string" && alt.startsWith("standalone:");
            const displayAlt = isStandalone ? alt.replace(/^standalone:/, "").trim() : (alt || "Diagram");

            if (isStandalone) {
              return (
                <span
                  className="my-3 block w-fit max-w-md md:max-w-lg relative rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-800 p-2 md:p-3 bg-white dark:bg-gray-800 shadow-sm md:shadow-md cursor-zoom-in hover:border-orange-500/70 hover:shadow-lg transition-all"
                  onClick={() => {
                    if (onImageClick) {
                      onImageClick(src);
                    } else if (src && typeof window !== "undefined") {
                      window.open(src, "_blank");
                    }
                  }}
                  title="Click to zoom diagram"
                >
                  <img
                    src={src}
                    alt={displayAlt}
                    className="max-h-72 md:max-h-80 max-w-full w-auto h-auto object-contain rounded-lg md:rounded-xl block"
                    loading="lazy"
                  />
                </span>
              );
            }

            return (
              <img
                src={src}
                alt={displayAlt}
                className="max-h-32 md:max-h-36 max-w-xs md:max-w-md max-w-full w-auto h-auto object-contain inline-block align-middle my-1 mx-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-1 shadow-sm cursor-zoom-in hover:border-orange-500/70 hover:shadow-md transition-all"
                onClick={() => {
                  if (onImageClick) {
                    onImageClick(src);
                  } else if (src && typeof window !== "undefined") {
                    window.open(src, "_blank");
                  }
                }}
                title="Click to zoom diagram"
                loading="lazy"
              />
            );
          },
          p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-left">{children}</p>,
          h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3 text-gray-900 dark:text-gray-100">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100">{children}</h3>,
          hr: () => <hr className="my-6 border-gray-300 dark:border-gray-700" />,
          ul: ({ children }) => <ul className="list-disc mb-4 space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal mb-4 space-y-2 pl-6">{children}</ol>,
          li: ({ children }) => <li className="mb-1 leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline break-all"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4 overflow-x-auto text-sm">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic mb-4 py-1 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-r">
              {children}
            </blockquote>
          ),
          table: ({ children }) => <MarkdownTable>{children}</MarkdownTable>,
          thead: ({ children }) => <thead className="bg-gray-100 dark:bg-gray-700">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-gray-200 dark:border-gray-700">{children}</tr>,
          th: ({ children }) => <th className="px-4 py-3 text-left font-semibold border border-gray-300 dark:border-gray-700 align-middle whitespace-nowrap">{children}</th>,
          td: ({ children }) => <td className="px-4 py-3 border border-gray-300 dark:border-gray-700 align-middle whitespace-nowrap">{children}</td>,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMathRenderer;
