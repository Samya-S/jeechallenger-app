"use client";
import { useState, useEffect } from 'react';

const ScrollToTopButton = ({ gradientColors, hoverColors }) => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollButton(scrollTop > 300); // Show button after scrolling 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showScrollButton) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`bg-gradient-to-r ${gradientColors} ${hoverColors} text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110`}
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

export default ScrollToTopButton; 