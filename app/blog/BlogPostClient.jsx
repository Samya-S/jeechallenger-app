'use client';

import { useState } from 'react';

// Components
import ReadingProgressBar from './components/ReadingProgressBar';
import { MobileTOC, DesktopTOC } from './components/TableOfContents';

// Hooks
import { useTableOfContents } from './hooks/useTableOfContents';
import { useReadingProgress } from './hooks/useReadingProgress';
import { useActiveHeading } from './hooks/useActiveHeading';

export default function BlogPostClient({ content, children }) {
  const [showTOC, setShowTOC] = useState(false);

  // Custom hooks
  const tableOfContents = useTableOfContents(content);
  const readingProgress = useReadingProgress();
  const activeHeading = useActiveHeading(tableOfContents);

  return (
    <>
      <ReadingProgressBar progress={readingProgress} />

      <article className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex gap-8 relative">
            {/* Main Content */}
            <div className="flex-1 min-w-0 max-w-4xl mx-auto text-left">
              {/* Mobile TOC */}
              <MobileTOC 
                tableOfContents={tableOfContents}
                activeHeading={activeHeading}
                showTOC={showTOC}
                setShowTOC={setShowTOC}
              />

              {/* Server-rendered content */}
              {children}
            </div>

            {/* Desktop TOC Sidebar */}
            <DesktopTOC 
              tableOfContents={tableOfContents}
              activeHeading={activeHeading}
            />
          </div>
        </div>
      </article>
    </>
  );
}
