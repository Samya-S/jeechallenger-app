/**
 * CBT Helper Functions
 * Robust normalization of question options, formats, and exam display traits.
 */

export function normalizeOptions(rawOptions) {
  if (!rawOptions) return [];

  // Case 1: Array of option objects (e.g. [{ option_key: 'A', option_text: '...' }, ...])
  if (Array.isArray(rawOptions)) {
    return rawOptions.map((opt, idx) => ({
      key: opt.option_key || opt.key || String.fromCharCode(65 + idx),
      text: opt.option_text || opt.text || (typeof opt === 'string' ? opt : ''),
      diagram_urls: opt.diagram_urls || (opt.diagram_url ? [opt.diagram_url] : []),
    }));
  }

  // Case 2: Dictionary/Map object (e.g. { A: { text: '...' }, B: { text: '...' }, ... })
  if (typeof rawOptions === 'object') {
    const standardKeys = ['A', 'B', 'C', 'D'];
    const result = [];

    for (const k of standardKeys) {
      if (rawOptions[k] !== undefined && rawOptions[k] !== null) {
        const val = rawOptions[k];
        result.push({
          key: k,
          text: typeof val === 'string' ? val : val.text || val.option_text || '',
          diagram_urls: val.diagram_urls || (val.diagram_url ? [val.diagram_url] : []),
        });
      }
    }

    if (result.length > 0) return result;

    // Fallback for non-standard keys
    return Object.entries(rawOptions).map(([k, val]) => ({
      key: k,
      text: typeof val === 'string' ? val : val?.text || val?.option_text || '',
      diagram_urls: val?.diagram_urls || (val?.diagram_url ? [val.diagram_url] : []),
    }));
  }

  return [];
}
