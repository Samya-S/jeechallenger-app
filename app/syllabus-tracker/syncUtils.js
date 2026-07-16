/**
 * Utility functions for syncing syllabus tracker progress.
 */

export function isEmptyProgress(progress) {
  if (!progress || Object.keys(progress).length === 0) return true;
  
  const subjects = ['physics', 'chemistry', 'mathematics'];
  for (const subj of subjects) {
    const subjData = progress[subj];
    if (!subjData) continue;
    
    for (const chapId of Object.keys(subjData)) {
      const chap = subjData[chapId];
      if (chap.theory || chap.pyqs || chap.revision) {
        return false;
      }
    }
  }
  return true;
}

export function isSameProgress(p1, p2) {
  if (!p1 || !p2) return p1 === p2;
  
  const subjects = ['physics', 'chemistry', 'mathematics'];
  for (const subj of subjects) {
    const s1 = p1[subj] || {};
    const s2 = p2[subj] || {};
    
    const keys1 = Object.keys(s1);
    const keys2 = Object.keys(s2);
    
    // Create sets of keys where at least one property is true
    const activeKeys1 = keys1.filter(k => s1[k].theory || s1[k].pyqs || s1[k].revision);
    const activeKeys2 = keys2.filter(k => s2[k].theory || s2[k].pyqs || s2[k].revision);
    
    if (activeKeys1.length !== activeKeys2.length) return false;
    
    for (const key of activeKeys1) {
      if (!s2[key]) return false;
      if (
        !!s1[key].theory !== !!s2[key].theory ||
        !!s1[key].pyqs !== !!s2[key].pyqs ||
        !!s1[key].revision !== !!s2[key].revision
      ) {
        return false;
      }
    }
  }
  return true;
}

export function mergeProgress(p1, p2) {
  const merged = {};
  const subjects = ['physics', 'chemistry', 'mathematics'];
  
  subjects.forEach(subj => {
    merged[subj] = {};
    const subj1 = p1?.[subj] || {};
    const subj2 = p2?.[subj] || {};
    
    const chapterIds = new Set([
      ...Object.keys(subj1),
      ...Object.keys(subj2)
    ]);
    
    chapterIds.forEach(chapId => {
      const chap1 = subj1[chapId] || {};
      const chap2 = subj2[chapId] || {};
      
      merged[subj][chapId] = {
        theory: !!(chap1.theory || chap2.theory),
        pyqs: !!(chap1.pyqs || chap2.pyqs),
        revision: !!(chap1.revision || chap2.revision)
      };
    });
  });
  
  return merged;
}
