import { useMemo } from 'react';

export function useTableOfContents(content) {
  return useMemo(() => {
    if (!content) return [];
    
    const headings = [];
    const lines = content.split('\n');
    
    lines.forEach((line) => {
      // Trim whitespace and carriage returns to handle Windows line endings
      const trimmedLine = line.trim();
      
      const h2Match = trimmedLine.match(/^## (.+)$/);
      const h3Match = trimmedLine.match(/^### (.+)$/);
      
      if (h2Match) {
        const text = h2Match[1].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        headings.push({ level: 2, text, id });
      } else if (h3Match) {
        const text = h3Match[1].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        headings.push({ level: 3, text, id });
      }
    });
    
    return headings;
  }, [content]);
}
