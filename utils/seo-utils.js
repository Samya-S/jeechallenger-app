/**
 * SEO & Structured Data Utilities for JEE Challenger
 * Cleans LaTeX math strings, generates high-CTR search snippets, and formats schema fields.
 */

/**
 * Converts LaTeX formulas and markdown into clean, human-readable plain text
 * suitable for meta descriptions, search snippets, social cards, and schema properties.
 *
 * @param {string} rawText
 * @returns {string}
 */
export function cleanMathText(rawText) {
  if (!rawText || typeof rawText !== "string") return "";

  let text = rawText;

  // 1. Convert common LaTeX fractions: \frac{a}{b} -> (a)/(b)
  text = text.replace(/\\frac\s*\{([^}]+)\}\s*\{([^}]+)\}/g, "($1/$2)");

  // 2. Convert roots: \sqrt{x} -> √(x), \sqrt[n]{x} -> n√(x)
  text = text.replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, "$1√($2)");
  text = text.replace(/\\sqrt\{([^}]+)\}/g, "√($1)");

  // 3. Convert limits: \lim_{t \to x} -> lim(t -> x)
  text = text.replace(/\\lim_\{([^}]+)\}/g, "lim($1)");

  // 4. Convert Greek letters & symbols
  const symbolMap = {
    "\\\\alpha": "α",
    "\\\\beta": "β",
    "\\\\gamma": "γ",
    "\\\\delta": "δ",
    "\\\\Delta": "Δ",
    "\\\\epsilon": "ε",
    "\\\\theta": "θ",
    "\\\\lambda": "λ",
    "\\\\mu": "μ",
    "\\\\pi": "π",
    "\\\\sigma": "σ",
    "\\\\omega": "ω",
    "\\\\Omega": "Ω",
    "\\\\infty": "∞",
    "\\\\pm": "±",
    "\\\\times": "×",
    "\\\\cdot": "·",
    "\\\\div": "÷",
    "\\\\approx": "≈",
    "\\\\neq": "≠",
    "\\\\le": "≤",
    "\\\\leq": "≤",
    "\\\\ge": "≥",
    "\\\\geq": "≥",
    "\\\\to": "→",
    "\\\\rightarrow": "→",
    "\\\\leftarrow": "←",
    "\\\\implies": "⇒",
    "\\\\iff": "⇔",
    "\\\\in": "∈",
    "\\\\notin": "∉",
    "\\\\forall": "∀",
    "\\\\exists": "∃",
    "\\\\sum": "∑",
    "\\\\int": "∫",
    "\\\\partial": "∂",
    "\\\\circ": "°",
    "\\\\text\\{([^}]+)\\}": "$1",
    "\\\\mathbf\\{([^}]+)\\}": "$1",
    "\\\\mathit\\{([^}]+)\\}": "$1",
    "\\\\mathrm\\{([^}]+)\\}": "$1",
  };

  for (const [pattern, replacement] of Object.entries(symbolMap)) {
    text = text.replace(new RegExp(pattern, "g"), replacement);
  }

  // 5. Remove remaining LaTeX command backslashes (e.g. \ln -> ln, \cos -> cos)
  text = text.replace(/\\([a-zA-Z]+)/g, "$1");

  // 6. Strip LaTeX math markers ($ and $$)
  text = text.replace(/\$\$([^\$]+)\$\$/g, " $1 ");
  text = text.replace(/\$([^\$]+)\$/g, "$1");

  // 7. Strip Markdown syntax
  text = text.replace(/[*_~`#]+/g, "");

  // 8. Collapse whitespace and newlines
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Creates an optimal search engine snippet truncated at a clean word boundary.
 *
 * @param {string} rawText
 * @param {number} maxLength
 * @returns {string}
 */
export function createQuestionSnippet(rawText, maxLength = 140) {
  const cleaned = cleanMathText(rawText);
  if (!cleaned) return "";

  if (cleaned.length <= maxLength) return cleaned;

  // Truncate at nearest previous space boundary
  const sub = cleaned.substring(0, maxLength);
  const lastSpace = sub.lastIndexOf(" ");
  const truncated = lastSpace > 30 ? sub.substring(0, lastSpace) : sub;

  return `${truncated.trim()}...`;
}

/**
 * Generates an SEO-optimized meta description for single question solution pages.
 *
 * @param {Object} options
 * @param {Object} options.question
 * @param {string} options.examOrigin - e.g. "JEE Advanced 2024"
 * @returns {string}
 */
export function createQuestionMetaDescription({ question, examOrigin }) {
  const snippet = createQuestionSnippet(question.question_text || question.title || "", 120);
  const subject = question.subject || "JEE";
  const chapter = question.chapter ? ` (${question.chapter})` : "";
  const origin = examOrigin ? ` ${examOrigin}` : "";

  if (snippet) {
    return `"${snippet}" Step-by-step verified solution and answer key for this${origin} ${subject}${chapter} PYQ on JEE Challenger.`;
  }

  return `Detailed step-by-step verified solution and answer key for ${subject}${chapter}${origin} Previous Year Question with formulas and explanation on JEE Challenger.`;
}

/**
 * Generates an SEO-optimized meta description for full question paper pages.
 *
 * @param {Object} paper
 * @returns {string}
 */
export function createPaperMetaDescription(paper) {
  const examLabel = paper.exam_type === "JEE_ADVANCED" ? "JEE Advanced" : "JEE Main";
  const year = paper.exam_year || "";
  const title = paper.title || `${examLabel} ${year} Question Paper`;

  return `Access full official ${title} with section-wise questions, step-by-step solutions, and answer keys. Practice now on JEE Challenger.`;
}
