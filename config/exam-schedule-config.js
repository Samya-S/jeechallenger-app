/**
 * @file exam-schedule-config.js
 * @description Single source of truth for JEE Main and JEE Advanced examination schedules,
 * shift timelines, multi-day recess detection, session rollover, and post-exam retirement.
 *
 * All date and time computations are strictly locked to Indian Standard Time (IST, UTC+05:30).
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export const EXAM_SCHEDULES = {
  JEE_MAIN: {
    year: 2027,
    theme: "emerald",
    ctaText: "Practice in CBT Mode",
    ctaHref: "/mock-test?exam_type=JEE_MAIN",
    bridgeTo: "JEE_ADVANCED", // Links to JEE Advanced once all Main sessions conclude

    sessions: [
      {
        id: "session-1",
        name: "JEE Main 2027 Session 1",
        badgeText: "Official Session 1 Schedule",
        windowLabel: "Official Exam Window",
        windowText: "January 20 – 28, 2027",
        shiftsText: "Shift 1: 09:00 AM – 12:00 PM • Shift 2: 03:00 PM – 06:00 PM IST",
        shiftsSummary: [
          "Shift 1: 09:00 AM – 12:00 PM",
          "Shift 2: 03:00 PM – 06:00 PM IST",
        ],
        // Default shifts applied to every day unless explicitly overridden
        defaultShifts: [
          { name: "Shift 1", start: "09:00:00", end: "12:00:00" },
          { name: "Shift 2", start: "15:00:00", end: "18:00:00" },
        ],
        // Scheduled active test days (Jan 25, 26, 27 are omitted gap days, auto-detected as recess)
        days: [
          { date: "2027-01-20" },
          { date: "2027-01-21" },
          { date: "2027-01-22" },
          { date: "2027-01-23" },
          { date: "2027-01-24" },
          { date: "2027-01-28" },
        ],
      },
      {
        id: "session-2",
        name: "JEE Main 2027 Session 2",
        badgeText: "Official Session 2 Schedule",
        windowLabel: "Official Exam Window",
        windowText: "April 2 – 7, 2027",
        shiftsText: "Shift 1: 09:00 AM – 12:00 PM • Shift 2: 03:00 PM – 06:00 PM IST",
        shiftsSummary: [
          "Shift 1: 09:00 AM – 12:00 PM",
          "Shift 2: 03:00 PM – 06:00 PM IST",
        ],
        ctaText: "Practice for Session 2 in CBT Mode",
        defaultShifts: [
          { name: "Shift 1", start: "09:00:00", end: "12:00:00" },
          { name: "Shift 2", start: "15:00:00", end: "18:00:00" },
        ],
        days: [
          { date: "2027-04-02" },
          { date: "2027-04-03" },
          { date: "2027-04-04" },
          { date: "2027-04-05" },
          { date: "2027-04-06" },
          { date: "2027-04-07" },
        ],
      },
    ],
  },

  JEE_ADVANCED: {
    year: 2027,
    theme: "amber",
    ctaText: "Practice in CBT Mode",
    ctaHref: "/mock-test?exam_type=JEE_ADVANCED",

    sessions: [
      {
        id: "advanced-2027",
        name: "JEE Advanced 2027",
        badgeText: "Confirmed Examination Date",
        windowLabel: "Official Exam Date",
        windowText: "Sunday, May 23, 2027",
        shiftsText: "Paper 1: 09:00 AM – 12:00 PM • Paper 2: 02:30 PM – 05:30 PM IST",
        shiftsSummary: [
          "Paper 1: 09:00 AM – 12:00 PM",
          "Paper 2: 02:30 PM – 05:30 PM IST",
        ],
        days: [
          {
            date: "2027-05-23",
            shifts: [
              { name: "Paper 1", start: "09:00:00", end: "12:00:00" },
              { name: "Paper 2", start: "14:30:00", end: "17:30:00" },
            ],
          },
        ],
      },
    ],
  },
};

/**
 * Returns YYYY-MM-DD date string corresponding to a UTC timestamp in IST.
 */
export function getIstDateStr(ms = Date.now()) {
  const istDate = new Date(ms + IST_OFFSET_MS);
  const y = istDate.getUTCFullYear();
  const m = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  const d = String(istDate.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Formats a YYYY-MM-DD string into human readable date: e.g. "January 28, 2027"
 */
export function formatDisplayDateIST(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${monthNames[m - 1]} ${d}, ${y}`;
}

/**
 * Formats a UTC timestamp into 12-hour IST time: e.g. "09:00 AM"
 */
export function formatTimeIST(ms) {
  const istDate = new Date(ms + IST_OFFSET_MS);
  let hours = istDate.getUTCHours();
  const minutes = String(istDate.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, "0");
  return `${strHours}:${minutes} ${ampm}`;
}

/**
 * Formats a dynamic target slot timestamp into context-aware human readable date and time.
 * Supports both full format (for desktop) and short format (for mobile single-line fit).
 *
 * Full: "Wednesday, January 20, 2027 at 09:00 AM IST"
 * Short: "Wed, Jan 20, 2027 • 09:00 AM IST"
 */
export function formatTargetSlotDateIST(targetMs, nowMs = Date.now(), isShort = false) {
  const targetDateStr = getIstDateStr(targetMs);
  const todayStr = getIstDateStr(nowMs);
  const tomorrowStr = getIstDateStr(nowMs + 86400000);

  if (targetDateStr === todayStr) {
    return isShort ? `Today • ${formatTimeIST(targetMs)} IST` : `Today at ${formatTimeIST(targetMs)} IST`;
  }
  if (targetDateStr === tomorrowStr) {
    return isShort ? `Tomorrow • ${formatTimeIST(targetMs)} IST` : `Tomorrow at ${formatTimeIST(targetMs)} IST`;
  }

  const istDate = new Date(targetMs + IST_OFFSET_MS);
  const daysFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsFull = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayName = isShort ? daysShort[istDate.getUTCDay()] : daysFull[istDate.getUTCDay()];
  const monthName = isShort ? monthsShort[istDate.getUTCMonth()] : monthsFull[istDate.getUTCMonth()];
  const dateNum = istDate.getUTCDate();
  const year = istDate.getUTCFullYear();

  if (isShort) {
    return `${dayName}, ${monthName} ${dateNum}, ${year} • ${formatTimeIST(targetMs)} IST`;
  }
  return `${dayName}, ${monthName} ${dateNum}, ${year} at ${formatTimeIST(targetMs)} IST`;
}

/**
 * Flattens a session's days and shifts into a chronologically sorted array of shift intervals.
 */
export function buildSessionIntervals(session) {
  const intervals = [];
  for (const day of session.days) {
    const shifts = day.shifts && day.shifts.length > 0 ? day.shifts : session.defaultShifts;
    if (!shifts) continue;
    for (const shift of shifts) {
      const startMs = new Date(`${day.date}T${shift.start}+05:30`).getTime();
      const endMs = new Date(`${day.date}T${shift.end}+05:30`).getTime();
      intervals.push({
        date: day.date,
        name: shift.name,
        startMs,
        endMs,
      });
    }
  }
  intervals.sort((a, b) => a.startMs - b.startMs);
  return intervals;
}

/**
 * Evaluates the current examination lifecycle state for an exam key.
 *
 * @param {string} examKey - "JEE_MAIN" or "JEE_ADVANCED"
 * @param {number} nowMs - Optional timestamp to evaluate (defaults to Date.now())
 * @returns {object} Calculated UI display payload or { isRetired: true }
 */
export function getExamCurrentState(examKey, nowMs = Date.now()) {
  const examConfig = EXAM_SCHEDULES[examKey];
  if (!examConfig) return { isRetired: true };

  const todayStr = getIstDateStr(nowMs);

  for (let sIdx = 0; sIdx < examConfig.sessions.length; sIdx++) {
    const session = examConfig.sessions[sIdx];
    const intervals = buildSessionIntervals(session);
    if (!intervals.length) continue;

    const sessionStartMs = intervals[0].startMs;
    const sessionEndMs = intervals[intervals.length - 1].endMs;
    const resolvedWindowLabel = session.windowLabel || (session.days.length > 1 ? "Official Exam Window" : "Official Exam Date");

    // 1. Before session starts
    if (nowMs < sessionStartMs) {
      const isMorningOfStart = todayStr === intervals[0].date;
      return {
        isRetired: false,
        phase: "PRE_EXAM",
        title: isMorningOfStart ? `${session.name} • Live Exam Day` : session.name,
        badgeText: isMorningOfStart ? `${intervals[0].name} Commences Today` : (session.badgeText || "Official Exam Schedule"),
        badgeTone: isMorningOfStart ? "live" : "normal",
        targetSlotLabel: isMorningOfStart ? "Commences" : "Starts",
        targetSlotFormatted: `${formatTargetSlotDateIST(sessionStartMs, nowMs, false)} (${intervals[0].name})`,
        targetSlotShort: `${formatTargetSlotDateIST(sessionStartMs, nowMs, true)} (${intervals[0].name})`,
        countdownLabel: isMorningOfStart ? `Time Until ${intervals[0].name}` : "Time Left Until Session Commences",
        windowLabel: resolvedWindowLabel,
        windowText: session.windowText,
        shiftsText: session.shiftsText,
        shiftsSummary: session.shiftsSummary,
        statusMessage: isMorningOfStart
          ? `${intervals[0].name} begins today at ${formatTimeIST(sessionStartMs)} IST. Reporting gates open.`
          : null,
        targetTimeMs: sessionStartMs,
        ctaText: session.ctaText || examConfig.ctaText,
        ctaHref: session.ctaHref || examConfig.ctaHref,
        theme: examConfig.theme,
      };
    }

    // 2. Inside the active session window
    if (nowMs >= sessionStartMs && nowMs <= sessionEndMs) {
      // Check if inside an active shift
      for (let i = 0; i < intervals.length; i++) {
        const it = intervals[i];
        if (nowMs >= it.startMs && nowMs <= it.endMs) {
          return {
            isRetired: false,
            phase: "ACTIVE_SHIFT",
            title: `${session.name} • Live Exam Day`,
            badgeText: `${it.name} in Progress`,
            badgeTone: "live",
            targetSlotLabel: "Active Shift",
            targetSlotFormatted: `${it.name} concludes ${formatTargetSlotDateIST(it.endMs, nowMs, false)}`,
            targetSlotShort: `${it.name} concludes ${formatTargetSlotDateIST(it.endMs, nowMs, true)}`,
            countdownLabel: `${it.name} Remaining`,
            windowLabel: resolvedWindowLabel,
            windowText: session.windowText,
            shiftsText: session.shiftsText,
            shiftsSummary: session.shiftsSummary,
            statusMessage: `${it.name} is currently in progress (${formatTimeIST(it.startMs)} – ${formatTimeIST(it.endMs)} IST).`,
            targetTimeMs: it.endMs,
            ctaText: session.ctaText || examConfig.ctaText,
            ctaHref: session.ctaHref || examConfig.ctaHref,
            theme: examConfig.theme,
          };
        }
      }

      // Check between-shift gaps
      for (let i = 0; i < intervals.length - 1; i++) {
        const prev = intervals[i];
        const next = intervals[i + 1];

        if (nowMs > prev.endMs && nowMs < next.startMs) {
          // Same day inter-shift break (e.g., between Shift 1 at 12:00 and Shift 2 at 15:00)
          if (prev.date === next.date) {
            return {
              isRetired: false,
              phase: "INTER_SHIFT_BREAK",
              title: `${session.name} • Live Exam Day`,
              badgeText: `${prev.name} Concluded`,
              badgeTone: "normal",
              targetSlotLabel: "Next Shift",
              targetSlotFormatted: `${formatTargetSlotDateIST(next.startMs, nowMs, false)} (${next.name})`,
              targetSlotShort: `${formatTargetSlotDateIST(next.startMs, nowMs, true)} (${next.name})`,
              countdownLabel: `Time Until ${next.name}`,
              windowLabel: resolvedWindowLabel,
              windowText: session.windowText,
              shiftsText: session.shiftsText,
              shiftsSummary: session.shiftsSummary,
              statusMessage: `${prev.name} concluded. Reporting gates for ${next.name} are open.`,
              targetTimeMs: next.startMs,
              ctaText: session.ctaText || examConfig.ctaText,
              ctaHref: session.ctaHref || examConfig.ctaHref,
              theme: examConfig.theme,
            };
          }

          // Same day evening after all shifts completed
          if (todayStr === prev.date) {
            const isTomorrow = next.date === getIstDateStr(nowMs + 86400000);
            return {
              isRetired: false,
              phase: "EVENING_AFTER_SHIFTS",
              title: `${session.name} • Live Exam Day`,
              badgeText: "Today's Shifts Concluded",
              badgeTone: "normal",
              targetSlotLabel: "Next Shift",
              targetSlotFormatted: `${formatTargetSlotDateIST(next.startMs, nowMs, false)} (${next.name})`,
              targetSlotShort: `${formatTargetSlotDateIST(next.startMs, nowMs, true)} (${next.name})`,
              countdownLabel: "Time Until Next Shift",
              windowLabel: resolvedWindowLabel,
              windowText: session.windowText,
              shiftsText: session.shiftsText,
              shiftsSummary: session.shiftsSummary,
              statusMessage: `Today's shifts completed. Next shift begins ${isTomorrow ? "tomorrow" : formatDisplayDateIST(next.date)} at ${formatTimeIST(next.startMs)} IST.`,
              targetTimeMs: next.startMs,
              ctaText: session.ctaText || examConfig.ctaText,
              ctaHref: session.ctaHref || examConfig.ctaHref,
              theme: examConfig.theme,
            };
          }

          // Morning of next exam day before its first shift
          if (todayStr === next.date) {
            return {
              isRetired: false,
              phase: "MORNING_BEFORE_SHIFT",
              title: `${session.name} • Live Exam Day`,
              badgeText: `${next.name} Commences Today`,
              badgeTone: "live",
              targetSlotLabel: "Next Shift",
              targetSlotFormatted: `${formatTargetSlotDateIST(next.startMs, nowMs, false)} (${next.name})`,
              targetSlotShort: `${formatTargetSlotDateIST(next.startMs, nowMs, true)} (${next.name})`,
              countdownLabel: `Time Until ${next.name}`,
              windowLabel: resolvedWindowLabel,
              windowText: session.windowText,
              shiftsText: session.shiftsText,
              shiftsSummary: session.shiftsSummary,
              statusMessage: `${next.name} begins today at ${formatTimeIST(next.startMs)} IST. Reporting gates open.`,
              targetTimeMs: next.startMs,
              ctaText: session.ctaText || examConfig.ctaText,
              ctaHref: session.ctaHref || examConfig.ctaHref,
              theme: examConfig.theme,
            };
          }

          // Multi-day Interim Recess / Break (today is a non-exam day)
          return {
            isRetired: false,
            phase: "RECESS_BREAK",
            title: session.name,
            badgeText: "Interim Session Break",
            badgeTone: "recess",
            targetSlotLabel: "Resumes",
            targetSlotFormatted: `${formatTargetSlotDateIST(next.startMs, nowMs, false)} (${next.name})`,
            targetSlotShort: `${formatTargetSlotDateIST(next.startMs, nowMs, true)} (${next.name})`,
            countdownLabel: "Time Until Session Resumes",
            windowLabel: resolvedWindowLabel,
            windowText: session.windowText,
            shiftsText: session.shiftsText,
            shiftsSummary: session.shiftsSummary,
            statusMessage: `No examination scheduled today (Exam Recess). Session resumes on ${formatDisplayDateIST(next.date)} with ${next.name}.`,
            targetTimeMs: next.startMs,
            ctaText: "Revise with CBT Mock Tests",
            ctaHref: session.ctaHref || examConfig.ctaHref,
            theme: examConfig.theme,
          };
        }
      }
    }

    // If nowMs > sessionEndMs, loop automatically continues to the next session!
  }

  // 3. All sessions completed: Check if this exam bridges to another exam (e.g. JEE Main -> JEE Advanced)
  if (examConfig.bridgeTo) {
    const bridgedState = getExamCurrentState(examConfig.bridgeTo, nowMs);
    if (!bridgedState.isRetired) {
      return {
        isRetired: false,
        phase: "BRIDGE_TO_ADVANCED",
        title: "Countdown to JEE Advanced 2027",
        badgeText: "JEE Main 2027 Concluded • Next: JEE Advanced",
        badgeTone: "normal",
        targetSlotLabel: "Exam Date",
        targetSlotFormatted: `${formatTargetSlotDateIST(bridgedState.targetTimeMs, nowMs, false)} (Paper 1)`,
        targetSlotShort: `${formatTargetSlotDateIST(bridgedState.targetTimeMs, nowMs, true)} (Paper 1)`,
        countdownLabel: "Time Left Until JEE Advanced",
        windowLabel: "Official Exam Date",
        windowText: "Sunday, May 23, 2027",
        shiftsText: "Paper 1: 09:00 AM – 12:00 PM • Paper 2: 02:30 PM – 05:30 PM IST",
        shiftsSummary: [
          "Paper 1: 09:00 AM – 12:00 PM",
          "Paper 2: 02:30 PM – 05:30 PM IST",
        ],
        statusMessage: "Both JEE Main sessions have concluded. Shift your preparation to JEE Advanced 2027.",
        targetTimeMs: bridgedState.targetTimeMs,
        ctaText: "Explore JEE Advanced Hub & CBT Papers",
        ctaHref: "/jee-advanced",
        theme: "emerald",
      };
    }
  }

  // 4. All examinations finished: Graceful auto-retirement
  return { isRetired: true };
}
