export const OG_THEMES = {
  brand: { from: '#2563eb', to: '#9333ea', glow: '#3b82f6' },
  home: { from: '#2563eb', to: '#9333ea', glow: '#3b82f6' },
  physics: { from: '#3b82f6', to: '#9333ea', glow: '#60a5fa' },
  chemistry: { from: '#22c55e', to: '#059669', glow: '#4ade80' },
  mathematics: { from: '#a855f7', to: '#db2777', glow: '#c084fc' },
  materials: { from: '#3b82f6', to: '#a855f7', glow: '#818cf8' },
  pyqs: { from: '#6366f1', to: '#2563eb', glow: '#818cf8' },
  'ai-tutor': { from: '#2563eb', to: '#9333ea', glow: '#60a5fa' },
  'jee-main': { from: '#16a34a', to: '#059669', glow: '#4ade80' },
  'jee-advanced': { from: '#ea580c', to: '#dc2626', glow: '#fb923c' },
  news: { from: '#f59e0b', to: '#ea580c', glow: '#fbbf24' },
  blog: { from: '#2563eb', to: '#4f46e5', glow: '#60a5fa' },
  syllabus: { from: '#14b8a6', to: '#0891b2', glow: '#2dd4bf' },
  platform: { from: '#8b5cf6', to: '#a855f7', glow: '#a78bfa' },
  legal: { from: '#64748b', to: '#475569', glow: '#94a3b8' },
};

export function normalizeOgTheme(theme) {
  return theme && OG_THEMES[theme] ? theme : 'brand';
}
