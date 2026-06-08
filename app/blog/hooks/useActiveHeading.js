import { useState, useEffect, useRef } from 'react';

export function useActiveHeading(tableOfContents) {
  const [activeHeading, setActiveHeading] = useState('');
  const visibleHeadings = useRef(new Map());
  const isClicking = useRef(false);

  const handleClick = (id) => {
    setActiveHeading(id);
    isClicking.current = true;
    setTimeout(() => { isClicking.current = false; }, 800); // Lock for 800ms
  };

  useEffect(() => {
    if (tableOfContents.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClicking.current) return; // 3. Ignore updates during manual scroll

        entries.forEach((entry) => {
          visibleHeadings.current.set(entry.target.id, entry.isIntersecting);
        });

        for (const heading of tableOfContents) {
          if (visibleHeadings.current.get(heading.id)) {
            setActiveHeading(heading.id);
            break; 
          }
        }
      },
      { rootMargin: "-150px 0px -50% 0px", threshold: 0 }
    );

    tableOfContents.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => {
      tableOfContents.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [tableOfContents]);

  // Auto-scroll TOC to keep active section visible (desktop sidebar only)
  useEffect(() => {
    if (!activeHeading) return;

    // Use requestAnimationFrame to defer sidebar scroll until 
    // the browser has started processing the main page scroll
    const syncSidebar = () => {
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
    };

    const frameId = requestAnimationFrame(syncSidebar);
    return () => cancelAnimationFrame(frameId);
  }, [activeHeading]);

  return { activeHeading, handleClick };
}
