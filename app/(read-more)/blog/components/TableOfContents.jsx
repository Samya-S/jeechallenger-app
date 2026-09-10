'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, List } from 'lucide-react';
import styles from './TableOfContents.module.css';

export function MobileTOC({ tableOfContents, activeHeading, showTOC, setShowTOC, handleClick }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isScrolledPastTop, setIsScrolledPastTop] = useState(false);
  const activeLinkRef = useRef(null);
  const inlineTocRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // Smoothly close the bottom sheet with exit animation
  const closeSheet = () => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimeoutRef.current = setTimeout(() => {
      setIsSheetOpen(false);
      setIsClosing(false);
    }, 240); // Matches .animate-slide-down duration
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Dynamically observe the exact position of the inline TOC.
  // The floating button appears ONLY after the inline TOC has completely scrolled past the top.
  useEffect(() => {
    const element = inlineTocRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const hasScrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setIsScrolledPastTop(hasScrolledPast);
      },
      { threshold: 0 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [showTOC]);

  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    if (isSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSheetOpen]);

  // Handle ESC key to dismiss bottom sheet
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSheet();
      }
    };
    if (isSheetOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSheetOpen, isClosing]);

  // Ensure active heading is visible inside bottom sheet when opened
  useEffect(() => {
    if (isSheetOpen && activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isSheetOpen]);

  if (tableOfContents.length === 0) return null;

  return (
    <>
      {/* 1 & 2. Inline Mobile TOC Area (observed via inlineTocRef) */}
      <div ref={inlineTocRef} className="lg:hidden">
        {/* Inline Mobile TOC Toggle */}
        <button
          onClick={() => setShowTOC(!showTOC)}
          className="w-full mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-between text-blue-700 dark:text-blue-300 font-medium transition-colors"
        >
          <span className="flex items-center gap-2">
            <Menu size={20} />
            Table of Contents
          </span>
          {showTOC ? <X size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Inline Mobile TOC Content */}
        {showTOC && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <nav className="space-y-2 text-left">
              {tableOfContents.map((heading, index) => (
                <a
                  key={index}
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault(); // Stop default jump
                    handleClick(heading.id); // Trigger the "lock" in useActiveHeading
                    window.history.pushState(null, '', `#${heading.id}`);
                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                    setShowTOC(false); // Close menu
                  }}
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
      </div>

      {/* 3. Floating Mobile Pill Trigger (appears smoothly when scrolled past top, refined subtle shadow) */}
      <div
        className={`lg:hidden fixed bottom-6 right-5 z-40 transition-all duration-300 ${
          isScrolledPastTop && !isSheetOpen && !isClosing
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={() => {
            setIsClosing(false);
            setIsSheetOpen(true);
          }}
          aria-label="Open Table of Contents"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/25 border border-blue-400/20 active:scale-95 transition-all duration-200"
        >
          <List size={18} />
          <span>Contents</span>
        </button>
      </div>

      {/* 4. Slide-Up & Slide-Down Bottom Sheet Drawer */}
      {isSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm ${
              isClosing ? styles.fadeOut : styles.fadeIn
            }`}
            onClick={closeSheet}
            aria-hidden="true"
          />

          {/* Sheet Container */}
          <div
            className={`relative z-10 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-gray-700 max-h-[75vh] flex flex-col ${
              isClosing ? styles.slideDown : styles.slideUp
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Table of Contents"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto my-3 flex-shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-base">
                <Menu size={18} className="text-blue-600 dark:text-blue-400" />
                <span>Table of Contents</span>
              </div>
              <button
                onClick={closeSheet}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close Table of Contents"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable list */}
            <nav className="p-6 overflow-y-auto space-y-2 flex-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 text-left">
              {tableOfContents.map((heading, index) => {
                const isActive = activeHeading === heading.id;
                return (
                  <a
                    key={index}
                    ref={isActive ? activeLinkRef : null}
                    href={`#${heading.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(heading.id);
                      window.history.pushState(null, '', `#${heading.id}`);
                      document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                      closeSheet();
                    }}
                    className={`block py-2.5 px-3 -mx-3 text-sm transition-all rounded-lg ${
                      heading.level === 3 ? 'pl-7' : ''
                    } ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {heading.text}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export function DesktopTOC({ tableOfContents, activeHeading, handleClick }) {
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
                onClick={(e) => {
                  e.preventDefault(); // Stop default jump
                  handleClick(heading.id); // Trigger the "lock" in useActiveHeading
                  window.history.pushState(null, '', `#${heading.id}`);
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
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
  setShowTOC,
  handleClick
}) {
  if (tableOfContents.length === 0) return null;

  return (
    <>
      <MobileTOC 
        tableOfContents={tableOfContents}
        activeHeading={activeHeading}
        showTOC={showTOC}
        setShowTOC={setShowTOC}
        handleClick={handleClick}
      />
      <DesktopTOC 
        tableOfContents={tableOfContents}
        activeHeading={activeHeading}
        handleClick={handleClick}
      />
    </>
  );
}
