const MONTH_MAP = {
  jan: "January",
  january: "January",
  feb: "February",
  february: "February",
  mar: "March",
  march: "March",
  apr: "April",
  april: "April",
  may: "May",
  jun: "June",
  june: "June",
  jul: "July",
  july: "July",
  aug: "August",
  august: "August",
  sep: "September",
  september: "September",
  oct: "October",
  october: "October",
  nov: "November",
  november: "November",
  dec: "December",
  december: "December",
};

const SHORT_MONTH_MAP = {
  jan: "Jan",
  january: "Jan",
  feb: "Feb",
  february: "Feb",
  mar: "Mar",
  march: "Mar",
  apr: "Apr",
  april: "Apr",
  may: "May",
  jun: "Jun",
  june: "Jun",
  jul: "Jul",
  july: "Jul",
  aug: "Aug",
  august: "Aug",
  sep: "Sep",
  september: "Sep",
  oct: "Oct",
  october: "Oct",
  nov: "Nov",
  november: "Nov",
  dec: "Dec",
  december: "Dec",
};

export const SUBJECT_SHORT_NAMES = {
  Physics: "Phy",
  Chemistry: "Chem",
  Mathematics: "Math",
};

export const DIFFICULTY_SHORT_NAMES = {
  Easy: "Easy",
  Medium: "Med",
  Hard: "Hard",
};

/**
 * Returns English ordinal string for any day number (e.g. 1 -> "1st", 4 -> "4th", 22 -> "22nd", 31 -> "31st")
 */
function getOrdinalDay(n) {
  const num = parseInt(n, 10);
  if (isNaN(num)) return n;
  const s = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Robustly parses paper/shift/session metadata from paper ID strings.
 * Accurately handles 1-digit and 2-digit dates, ordinals, full/abbreviated months, and JEE Advanced papers.
 *
 * Examples:
 * - "Apr_4th_Shift_2" (full)  -> "April 4th - Shift 2"
 * - "Apr_4th_Shift_2" (short) -> "4th Apr - Shift 2"
 * - "Paper_1" -> "Paper 1"
 */
function parseShiftAndDate(cleanPaper, isShort = false) {
  if (!cleanPaper) return "";

  // 1. JEE Advanced: Paper 1, Paper 2, etc.
  const paperMatch = cleanPaper.match(/Paper[\s_\-]*(\d+)/i);
  if (paperMatch) {
    return `Paper ${paperMatch[1]}`;
  }

  const monthMap = isShort ? SHORT_MONTH_MAP : MONTH_MAP;

  // 2. Month followed by 1 or 2 digit date (with or without 'st'/'nd'/'rd'/'th') and optional Shift
  const monthFirstMatch = cleanPaper.match(
    /(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[\s_\-]*(\d{1,2})(?:st|nd|rd|th)?(?:[\s_\-]*(?:Shift|Session)[\s_\-]*(\d+))?/i
  );

  if (monthFirstMatch) {
    const month = monthMap[monthFirstMatch[1].toLowerCase()] || monthFirstMatch[1];
    const day = getOrdinalDay(monthFirstMatch[2]);
    const shift = monthFirstMatch[3] ? `Shift ${monthFirstMatch[3]}` : "";
    return shift ? `${day} ${month} - ${shift}` : `${day} ${month}`;
  }

  // 3. 1 or 2 digit date followed by Month (e.g. "24th Jan Shift 1")
  const dayFirstMatch = cleanPaper.match(
    /(\d{1,2})(?:st|nd|rd|th)?[\s_\-]*(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:[\s_\-]*(?:Shift|Session)[\s_\-]*(\d+))?/i
  );

  if (dayFirstMatch) {
    const day = getOrdinalDay(dayFirstMatch[1]);
    const month = monthMap[dayFirstMatch[2].toLowerCase()] || dayFirstMatch[2];
    const shift = dayFirstMatch[3] ? `Shift ${dayFirstMatch[3]}` : "";
    return shift ? `${day} ${month} - ${shift}` : `${day} ${month}`;
  }

  // 4. Shift or Session only (e.g. "Shift 1")
  const shiftOnlyMatch = cleanPaper.match(/(?:Shift|Session)[\s_\-]*(\d+)/i);
  if (shiftOnlyMatch) {
    return `Shift ${shiftOnlyMatch[1]}`;
  }

  return "";
}

/**
 * Formats the exam name (e.g. "JEE Main" or "JEE Advanced").
 *
 * @param {Object|string} questionOrExamType
 * @param {Object} [options]
 * @param {boolean} [options.isShort=false]
 * @returns {string} Formatted exam label ("JEE Main" | "JEE Advanced" or "Main" | "Adv")
 */
export function formatExamType(questionOrExamType, { isShort = false } = {}) {
  if (!questionOrExamType) return isShort ? "Main" : "JEE Main";

  if (typeof questionOrExamType === "string") {
    const isAdv = questionOrExamType.toUpperCase().includes("ADVANCED");
    if (isShort) return isAdv ? "Adv" : "Main";
    return isAdv ? "JEE Advanced" : "JEE Main";
  }

  const paperId = questionOrExamType.original_paper_id || "";
  const cleanPaper = paperId.replace(/_/g, " ").trim();
  const examType =
    questionOrExamType.exam_type ||
    (cleanPaper.toLowerCase().includes("advanced") ? "JEE_ADVANCED" : "JEE_MAIN");

  const isAdv = String(examType).toUpperCase().includes("ADVANCED");
  if (isShort) return isAdv ? "Adv" : "Main";
  return isAdv ? "JEE Advanced" : "JEE Main";
}

/**
 * Formats the exam origin badge label for any JEE question.
 * Supports both full desktop and concise mobile formats.
 *
 * Full (desktop):
 * - "JEE Main 2026 • 24th January - Shift 1"
 * - "JEE Advanced 2026 • Paper 1"
 *
 * Short (mobile):
 * - "Main 2026 • 24th Jan - Shift 1"
 * - "Adv 2026 • Paper 1"
 *
 * @param {Object} question
 * @param {Object} [options]
 * @param {boolean} [options.isShort=false]
 * @returns {string} Formatted origin string
 */
export function formatExamOrigin(question, { isShort = false } = {}) {
  if (!question) return "";

  const paperId = question.original_paper_id || "";
  const cleanPaper = paperId.replace(/_/g, " ").trim();

  const examType =
    question.exam_type ||
    (cleanPaper.toLowerCase().includes("advanced") ? "JEE_ADVANCED" : "JEE_MAIN");
  const matchedYear = cleanPaper.match(/\b(20\d{2})\b/)?.[1];
  const examYear = question.exam_year || matchedYear || "";

  let examLabel;
  if (isShort) {
    examLabel = examType === "JEE_ADVANCED" ? "Adv" : "Main";
  } else {
    examLabel = examType === "JEE_ADVANCED" ? "JEE Advanced" : "JEE Main";
  }

  const base = examYear ? `${examLabel} ${examYear}` : examLabel;

  const detail = parseShiftAndDate(cleanPaper, isShort);
  if (detail) {
    return `${base} • ${detail}`;
  }

  // Fallback: strip leading JEE Main/Advanced and year
  const yearPattern = examYear ? String(examYear) : "\\d{4}";
  const prefixRegex = new RegExp(
    `^(?:JEE\\s+(?:Main|Advanced)\\s*)?(?:${yearPattern}\\s*)?`,
    "i"
  );
  let remaining = cleanPaper.replace(prefixRegex, "").trim();
  remaining = remaining.replace(/^[•\-\–\—\s]+/, "").trim();

  if (remaining) {
    return `${base} • ${remaining}`;
  }

  return base;
}

/**
 * Returns the paper route slug from question.original_paper_id.
 */
export function getPaperSlug(question) {
  return question?.original_paper_id?.toLowerCase().replace(/_/g, "-") || "";
}

export const SUBJECT_COLORS = {
  Physics: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
  Chemistry: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
  Mathematics: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
};

export const DIFFICULTY_COLORS = {
  Easy: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
  Medium: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
  Hard: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
};

const EXAM_TYPE_COLORS = {
  JEE_MAIN: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
  JEE_ADVANCED: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800",
};

export const MARKS_TO_ALL_COLOR = "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800";

/**
 * Returns badge styling classes for JEE Main vs JEE Advanced.
 * Supports examType strings ('JEE_MAIN', 'JEE_ADVANCED') or full origin labels ('JEE Main 2026...').
 */
export function getExamBadgeColor(examTypeOrText) {
  const str = String(examTypeOrText || "").toUpperCase();
  return str.includes("ADVANCED") ? EXAM_TYPE_COLORS.JEE_ADVANCED : EXAM_TYPE_COLORS.JEE_MAIN;
}

/**
 * Returns hover text color classes for JEE Main vs JEE Advanced links.
 * Supports examType strings ('JEE_MAIN', 'JEE_ADVANCED') or full origin labels ('JEE Main 2026...').
 */
export function getExamHoverColor(examTypeOrText) {
  const str = String(examTypeOrText || "").toUpperCase();
  return str.includes("ADVANCED")
    ? "hover:text-orange-600 dark:hover:text-orange-400"
    : "hover:text-emerald-600 dark:hover:text-emerald-400";
}

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
