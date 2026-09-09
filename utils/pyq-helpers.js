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
 * - "Apr_4th_Shift_2" -> "April 4th - Shift 2"
 * - "Jan_24th_Shift_1" -> "January 24th - Shift 1"
 * - "Jan_02_Shift_2" -> "January 2nd - Shift 2"
 * - "Paper_1" -> "Paper 1"
 */
function parseShiftAndDate(cleanPaper) {
  if (!cleanPaper) return "";

  // 1. JEE Advanced: Paper 1, Paper 2, etc.
  const paperMatch = cleanPaper.match(/Paper[\s_\-]*(\d+)/i);
  if (paperMatch) {
    return `Paper ${paperMatch[1]}`;
  }

  // 2. Month followed by 1 or 2 digit date (with or without 'st'/'nd'/'rd'/'th') and optional Shift
  const monthFirstMatch = cleanPaper.match(
    /(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[\s_\-]*(\d{1,2})(?:st|nd|rd|th)?(?:[\s_\-]*(?:Shift|Session)[\s_\-]*(\d+))?/i
  );

  if (monthFirstMatch) {
    const month = MONTH_MAP[monthFirstMatch[1].toLowerCase()] || monthFirstMatch[1];
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
    const month = MONTH_MAP[dayFirstMatch[2].toLowerCase()] || dayFirstMatch[2];
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
 * Formats the complete exam origin badge label for any JEE question.
 *
 * Output examples:
 * - "JEE Main 2026 • April 4th - Shift 2"
 * - "JEE Main 2025 • January 24th - Shift 1"
 * - "JEE Advanced 2026 • Paper 1"
 *
 * @param {Object} question
 * @returns {string} Formatted origin string
 */
export function formatExamOrigin(question) {
  if (!question) return "";

  const paperId = question.original_paper_id || "";
  const cleanPaper = paperId.replace(/_/g, " ").trim();

  const examType =
    question.exam_type ||
    (cleanPaper.toLowerCase().includes("advanced") ? "JEE_ADVANCED" : "JEE_MAIN");
  const matchedYear = cleanPaper.match(/\b(20\d{2})\b/)?.[1];
  const examYear = question.exam_year || matchedYear || "";

  const examLabel = examType === "JEE_ADVANCED" ? "JEE Advanced" : "JEE Main";
  const base = examYear ? `${examLabel} ${examYear}` : examLabel;

  const detail = parseShiftAndDate(cleanPaper);
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
