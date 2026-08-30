'use client';

import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const MarkdownTable = ({ children }) => {
  const tableRef = useRef(null);

  useEffect(() => {
    const ref = tableRef.current;
    if (!ref) return undefined;

    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        ref.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    ref.addEventListener('wheel', onWheel, { passive: false });
    return () => ref.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div ref={tableRef} className="overflow-x-auto scrollbar-thin my-4">
      <table className="min-w-full border border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {children}
      </table>
    </div>
  );
};

/**
 * MarkdownMathRenderer
 * Renders Markdown with full KaTeX math support (\(...\), \[...\], $$...$$, $...$),
 * responsive tables, code blocks, and theme styling.
 */
const MarkdownMathRenderer = ({ content, className = '' }) => {
  if (!content) return null;

  return (
    <div className={`text-base leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
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
          th: ({ children }) => <th className="px-3 py-2 text-left font-semibold border border-gray-300 dark:border-gray-700">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 border border-gray-300 dark:border-gray-700">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMathRenderer;
