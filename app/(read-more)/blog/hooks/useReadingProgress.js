import { useState, useEffect } from 'react';

export function useReadingProgress() {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    let ticking = false; // Lock variable

    const updateProgress = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const height = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (scrolled / height) * 100;
          
          setReadingProgress(Math.min(100, Math.max(0, progress)));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return readingProgress;
}