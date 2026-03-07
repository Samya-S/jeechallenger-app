import { useState, useEffect } from 'react';

export function useActiveHeading(tableOfContents) {
  const [activeHeading, setActiveHeading] = useState('');

  // Track active heading based on scroll position
  useEffect(() => {
    if (tableOfContents.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for fixed header

      // Find the current section based on scroll position
      let currentHeading = tableOfContents[0]?.id || '';

      for (const heading of tableOfContents) {
        const element = document.getElementById(heading.id);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            currentHeading = heading.id;
          } else {
            break;
          }
        }
      }

      setActiveHeading(currentHeading);
    };

    // Set initial active heading
    handleScroll();

    // Add scroll listener with throttling
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [tableOfContents]);

  // Auto-scroll TOC to keep active section visible (desktop sidebar only)
  useEffect(() => {
    if (!activeHeading) return;

    // Only target links within the desktop sidebar TOC
    const desktopToc = document.getElementById('desktop-toc');
    if (!desktopToc) return;

    const activeTocLink = desktopToc.querySelector(`a[href="#${activeHeading}"]`);
    if (activeTocLink) {
      activeTocLink.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [activeHeading]);

  return activeHeading;
}
