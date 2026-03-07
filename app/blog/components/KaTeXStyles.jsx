'use client';

import { useEffect } from 'react';

export default function KaTeXStyles() {
  useEffect(() => {
    // Dynamically load KaTeX CSS only when needed
    if (!document.getElementById('katex-css')) {
      const link = document.createElement('link');
      link.id = 'katex-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css';
      link.integrity = 'sha384-UHKtY3pxOZhFtyNfUsW3HMOZCPCAmZlSsWd8riM+9NKMvPd6oywZCT8cRBMPYFbj';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  }, []);

  return null;
}
