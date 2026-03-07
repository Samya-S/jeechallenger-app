'use client';

import { Menu, X, ChevronRight } from 'lucide-react';

export function MobileTOC({ tableOfContents, activeHeading, showTOC, setShowTOC }) {
  if (tableOfContents.length === 0) return null;

  return (
    <>
      {/* Mobile TOC Toggle */}
      <button
        onClick={() => setShowTOC(!showTOC)}
        className="lg:hidden w-full mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-between text-blue-700 dark:text-blue-300 font-medium"
      >
        <span className="flex items-center gap-2">
          <Menu size={20} />
          Table of Contents
        </span>
        {showTOC ? <X size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Mobile TOC */}
      {showTOC && (
        <div className="lg:hidden mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <nav className="space-y-2 text-left">
            {tableOfContents.map((heading, index) => (
              <a
                key={index}
                href={`#${heading.id}`}
                onClick={() => setShowTOC(false)}
                className={`block py-2 px-3 -mx-3 text-sm transition-all rounded-lg ${
                  heading.level === 3 ? 'pl-7' : ''
                } ${
                  activeHeading === heading.id
                    ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

export function DesktopTOC({ tableOfContents, activeHeading }) {
  if (tableOfContents.length === 0) return null;

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Menu size={20} />
              Table of Contents
            </h3>
          </div>
          <nav id="desktop-toc" className="p-6 pt-4 space-y-2 max-h-[calc(100vh-14rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 text-left">
            {tableOfContents.map((heading, index) => (
              <a
                key={index}
                href={`#${heading.id}`}
                className={`block py-2 px-3 -mx-3 text-sm transition-all rounded-lg ${
                  heading.level === 3 ? 'pl-7' : ''
                } ${
                  activeHeading === heading.id
                    ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}

// Default export for backward compatibility
export default function TableOfContents({ 
  tableOfContents, 
  activeHeading, 
  showTOC, 
  setShowTOC 
}) {
  if (tableOfContents.length === 0) return null;

  return (
    <>
      <MobileTOC 
        tableOfContents={tableOfContents}
        activeHeading={activeHeading}
        showTOC={showTOC}
        setShowTOC={setShowTOC}
      />
      <DesktopTOC 
        tableOfContents={tableOfContents}
        activeHeading={activeHeading}
      />
    </>
  );
}
