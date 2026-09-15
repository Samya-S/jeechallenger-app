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

export const subjectColors = SUBJECT_COLORS;
export const difficultyColors = DIFFICULTY_COLORS;

export const EXAM_TYPE_COLORS = {
  JEE_MAIN: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
  JEE_ADVANCED: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800",
};

export const examTypeColors = EXAM_TYPE_COLORS;

export const MARKS_TO_ALL_COLOR = "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800";

/**
 * Returns badge styling classes for JEE Main vs JEE Advanced.
 * Supports examType strings ('JEE_MAIN', 'JEE_ADVANCED') or full origin labels ('JEE Main 2026...').
 */
export function getExamBadgeColor(examTypeOrText) {
  const str = String(examTypeOrText || "").toUpperCase();
  return str.includes("ADVANCED") ? EXAM_TYPE_COLORS.JEE_ADVANCED : EXAM_TYPE_COLORS.JEE_MAIN;
}
