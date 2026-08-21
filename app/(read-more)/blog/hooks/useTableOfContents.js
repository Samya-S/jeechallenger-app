import { useMemo } from 'react';

export function useTableOfContents(content) {
  return useMemo(() => {
    if (!content) return [];
    
    const headings = [];
    const lines = content.split('\n');
    const slugCounts = {}; // Keep track of duplicates!
    
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      const h2Match = trimmedLine.match(/^## (.+)$/);
      const h3Match = trimmedLine.match(/^### (.+)$/);
      
      if (h2Match || h3Match) {
        const text = h2Match ? h2Match[1].trim() : h3Match[1].trim();
        const level = h2Match ? 2 : 3;
        
        // MATCH THE PARSER'S EXACT LOGIC
        let id = text.toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '') // 1. Removes '+', leaving two spaces intact ("Fact  Exception")
          .replace(/\s/g, '-');     // 2. Converts EVERY space to a dash (two spaces = "--")
        
        // Remove trailing/leading dashes just in case a special char was at the very end
        id = id.replace(/^-+|-+$/g, '');
        
        // Append counter if it's a duplicate (e.g., tier-2, tier-2-1)
        if (slugCounts[id] !== undefined) {
          slugCounts[id]++;
          id = `${id}-${slugCounts[id]}`;
        } else {
          slugCounts[id] = 0;
        }
        
        headings.push({ level, text, id });
      }
    });
    
    return headings;
  }, [content]);
}