import clientPromise from '../utils/mongodb.js';
import { ObjectId } from 'mongodb';

/**
 * Checks if a candidate's response represents an active attempted answer.
 */
export function isAnswerAttempted(resp) {
  if (!resp) return false;
  // Must be State 3 (Answered) or State 5 (Answered & Marked for Review)
  if (resp.color_state !== 3 && resp.color_state !== 5) {
    return false;
  }
  if (Array.isArray(resp.selected_options) && resp.selected_options.length > 0) {
    return true;
  }
  if (resp.selected_option && String(resp.selected_option).trim() !== '') {
    return true;
  }
  if (resp.numeric_value !== null && resp.numeric_value !== undefined && String(resp.numeric_value).trim() !== '') {
    return true;
  }
  return false;
}

/**
 * Evaluates a single question against its section marking scheme.
 */
export function evaluateQuestion(q, scheme, attempt) {
  const correctMarks = Number(scheme?.correct ?? 4);
  const incorrectMarks = Number(scheme?.incorrect ?? -1);

  // Rule 1: Dropped or MARKS_TO_ALL Questions
  if (
    q.source_of_answer === 'MARKS_TO_ALL' ||
    (Array.isArray(q.correct_answer) && q.correct_answer.length === 1 && String(q.correct_answer[0]).toUpperCase() === 'MARKS_TO_ALL')
  ) {
    return { isCorrect: true, marks: correctMarks };
  }

  const format = String(q.input_format || q.question_type || '').toUpperCase();

  // Rule 2: Single Correct MCQ
  if (format === 'MCQ' || (format !== 'NUMERIC' && format !== 'MULTI_CORRECT' && Array.isArray(q.correct_answer) && q.correct_answer.length === 1)) {
    if (!attempt.selected_option || !Array.isArray(q.correct_answer) || q.correct_answer.length === 0) {
      return { isCorrect: false, marks: incorrectMarks };
    }
    const candidateChoice = String(attempt.selected_option).trim().toUpperCase();
    const correctChoice = String(q.correct_answer[0]).trim().toUpperCase();

    if (candidateChoice === correctChoice) {
      return { isCorrect: true, marks: correctMarks };
    }
    return { isCorrect: false, marks: incorrectMarks };
  }

  // Rule 3: Multiple Correct (MULTI_CORRECT)
  if (format === 'MULTI_CORRECT' || (Array.isArray(q.correct_answer) && q.correct_answer.length > 1 && format !== 'NUMERIC')) {
    // Resolve candidate options: check selected_options array first, fallback to selected_option
    let candidateOptions = [];
    if (Array.isArray(attempt.selected_options) && attempt.selected_options.length > 0) {
      candidateOptions = attempt.selected_options;
    } else if (attempt.selected_option) {
      candidateOptions = String(attempt.selected_option).split(',').map((s) => s.trim());
    }

    const chosenSet = new Set(
      candidateOptions.map((s) => String(s).trim().toUpperCase()).filter(Boolean)
    );

    if (chosenSet.size === 0) {
      return { isCorrect: false, marks: incorrectMarks };
    }

    const correctAnswers = Array.isArray(q.correct_answer) ? q.correct_answer : [q.correct_answer];
    const correctSet = new Set(
      correctAnswers.map((s) => String(s).trim().toUpperCase()).filter(Boolean)
    );

    if (correctSet.size === 0) {
      return { isCorrect: false, marks: 0 };
    }

    // Check if candidate selected any option that is NOT in the correct set
    const hasIncorrectOption = Array.from(chosenSet).some((opt) => !correctSet.has(opt));

    if (hasIncorrectOption) {
      // In all official JEE Advanced schemes: selecting any incorrect option incurs the full negative penalty
      return { isCorrect: false, marks: incorrectMarks };
    }

    // Candidate selected ONLY correct options (zero incorrect options chosen)
    if (chosenSet.size === correctSet.size) {
      // All correct options chosen: full marks
      return { isCorrect: true, marks: correctMarks };
    }

    // Incomplete correct options chosen without any wrong option:
    const algorithm = String(scheme?.algorithm || '').toUpperCase();
    if (algorithm === 'MULTI_CORRECT_NO_PARTIAL') {
      return { isCorrect: false, marks: 0 };
    }

    // Official JEE Advanced Multi-Correct Partial Marking Algorithm:
    // • +3: If 4 options are correct and 3 are chosen
    // • +2: If 3 or more options are correct and 2 are chosen
    // • +1: If 2 or more options are correct and 1 is chosen
    if (correctSet.size === 4 && chosenSet.size === 3) {
      return { isCorrect: true, marks: 3 };
    } else if (correctSet.size >= 3 && chosenSet.size === 2) {
      return { isCorrect: true, marks: 2 };
    } else if (correctSet.size >= 2 && chosenSet.size === 1) {
      return { isCorrect: true, marks: 1 };
    }

    // Proportional fallback if maximum marks exceed 4
    const partialMarks = Math.max(1, Math.round((chosenSet.size / correctSet.size) * correctMarks));
    return { isCorrect: true, marks: partialMarks };
  }

  // Rule 4: Numerical Value Question
  if (format === 'NUMERIC') {
    if (attempt.numeric_value === null || attempt.numeric_value === undefined) {
      return { isCorrect: false, marks: incorrectMarks };
    }
    const enteredStr = String(attempt.numeric_value).trim();
    const enteredVal = parseFloat(enteredStr);

    if (isNaN(enteredVal)) {
      return { isCorrect: false, marks: incorrectMarks };
    }

    if (q.numeric_answer) {
      // Range tolerance evaluation (e.g. JEE Advanced)
      if (q.numeric_answer.is_range && q.numeric_answer.min_value !== null && q.numeric_answer.max_value !== null) {
        const min = Number(q.numeric_answer.min_value);
        const max = Number(q.numeric_answer.max_value);
        if (enteredVal >= min && enteredVal <= max) {
          return { isCorrect: true, marks: correctMarks };
        }
        return { isCorrect: false, marks: incorrectMarks };
      }

      // Exact integer/decimal evaluation
      if (q.numeric_answer.exact_value !== null && q.numeric_answer.exact_value !== undefined) {
        const exact = Number(q.numeric_answer.exact_value);
        if (Math.abs(enteredVal - exact) < 1e-4) {
          return { isCorrect: true, marks: correctMarks };
        }
        return { isCorrect: false, marks: incorrectMarks };
      }
    }
    return { isCorrect: false, marks: incorrectMarks };
  }

  return { isCorrect: false, marks: 0 };
}

/**
 * Dynamic format-aware pacing benchmark evaluator:
 * Determines if an attempt is a Speed Win or Time Trap based on exam format, subject, and question type.
 */
export function evaluateAttemptPacing(timeSpentSeconds, isCorrect, isEvaluated, subject, questionType, examType) {
  const time = Number(timeSpentSeconds) || 0;
  const isAdv = String(examType || '').toUpperCase().includes('ADVANCED');
  const subj = String(subject || '').toLowerCase();
  const qType = String(questionType || '').toUpperCase();

  const isChem = subj.startsWith('chem');
  const isPhy = subj.startsWith('phy');
  const isMath = subj.startsWith('math');

  let winThreshold = 90;
  let trapThreshold = 240;

  if (isAdv) {
    if (qType.includes('MULTI') || qType.includes('MATCH') || qType.includes('MATRIX')) {
      winThreshold = 135;
      trapThreshold = 450;
    } else if (qType.includes('NUMER') || qType.includes('INTEGER')) {
      winThreshold = 120;
      trapThreshold = 420;
    } else if (isChem) {
      winThreshold = 60;
      trapThreshold = 240;
    } else if (isPhy) {
      winThreshold = 90;
      trapThreshold = 330;
    } else if (isMath) {
      winThreshold = 120;
      trapThreshold = 390;
    } else {
      winThreshold = 90;
      trapThreshold = 330;
    }
  } else {
    // JEE Main & default
    const isNumeric = qType.includes('NUMER') || qType.includes('INTEGER');
    if (isChem) {
      winThreshold = isNumeric ? 90 : 45;
      trapThreshold = isNumeric ? 270 : 165;
    } else if (isPhy) {
      winThreshold = isNumeric ? 105 : 75;
      trapThreshold = isNumeric ? 300 : 225;
    } else if (isMath) {
      winThreshold = isNumeric ? 120 : 90;
      trapThreshold = isNumeric ? 390 : 270;
    } else {
      winThreshold = isNumeric ? 105 : 75;
      trapThreshold = isNumeric ? 300 : 225;
    }
  }

  const isSpeedWin = Boolean(time > 0 && time <= winThreshold && isCorrect);
  const isTimeTrap = Boolean(time >= trapThreshold && (!isCorrect || !isEvaluated));

  return {
    is_speed_win: isSpeedWin,
    is_time_trap: isTimeTrap,
  };
}

/**
 * Pure evaluation function that grades responses against a paper and question list.
 */
export function scoreTestSubmission(paper, questions, responses, submissionMeta) {
  const questionByID = new Map();
  for (const q of questions) {
    questionByID.set(String(q._id), q);
  }

  const questionAttempts = [];
  const subjectScores = {};

  let totalScore = 0;
  let maxMarks = 0;
  let totalAttempted = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalUnattempted = 0;

  for (const sec of paper.sections || []) {
    if (!subjectScores[sec.subject]) {
      subjectScores[sec.subject] = {
        score: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
      };
    }

    const secQuestions = [];
    for (const qId of sec.question_ids || []) {
      const q = questionByID.get(String(qId));
      if (q) secQuestions.push(q);
    }

    // Sort questions in this section by QuestionNumber ascending
    secQuestions.sort((a, b) => a.question_number - b.question_number);

    // Section B (5 of 10) Attempt Rule:
    const isPartialChoiceSection = sec.attempt_questions > 0 && sec.attempt_questions < sec.total_questions;
    const allowedAttemptQNums = new Set();

    if (isPartialChoiceSection) {
      const attemptedQNums = [];
      for (const q of secQuestions) {
        const resp = responses[String(q._id)] || responses[q.question_number];
        if (resp && isAnswerAttempted(resp)) {
          attemptedQNums.push(q.question_number);
        }
      }
      attemptedQNums.sort((a, b) => a - b);
      const limit = Math.min(sec.attempt_questions, attemptedQNums.length);
      for (let i = 0; i < limit; i++) {
        allowedAttemptQNums.add(attemptedQNums[i]);
      }
    }

    // Section Max Marks
    const correctMarks = Number(sec.marking_scheme?.correct ?? 4);
    const maxAllowed = (sec.attempt_questions > 0 ? sec.attempt_questions : sec.total_questions) * correctMarks;
    maxMarks += maxAllowed;

    for (const q of secQuestions) {
      const resp = responses[String(q._id)] || responses[q.question_number];

      const candidateSelectedOptions = Array.isArray(resp?.selected_options)
        ? resp.selected_options
        : (resp?.selected_option ? [String(resp.selected_option)] : []);

      const attempt = {
        question_id: q._id,
        question_number: q.question_number,
        subject: sec.subject,
        section_name: sec.name,
        question_type: q.question_type,
        selected_option: resp?.selected_option ?? (candidateSelectedOptions.length === 1 ? candidateSelectedOptions[0] : null),
        selected_options: candidateSelectedOptions,
        numeric_value: resp?.numeric_value ?? null,
        color_state: resp?.color_state ?? 1,
        is_evaluated: false,
        is_correct: false,
        marks_awarded: 0,
        time_spent_seconds: resp?.time_spent_seconds ?? 0,
      };

      const attempted = resp && isAnswerAttempted(resp);

      if (!attempted) {
        attempt.is_evaluated = false;
        attempt.is_correct = false;
        attempt.marks_awarded = 0;
        totalUnattempted++;
        subjectScores[sec.subject].unattempted++;
      } else {
        if (isPartialChoiceSection && !allowedAttemptQNums.has(q.question_number)) {
          // Exceeds the first 5 attempted questions in numerical order
          attempt.is_evaluated = false;
          attempt.is_correct = false;
          attempt.marks_awarded = 0;
          totalUnattempted++;
          subjectScores[sec.subject].unattempted++;
        } else {
          attempt.is_evaluated = true;
          totalAttempted++;
          subjectScores[sec.subject].attempted++;

          const { isCorrect, marks } = evaluateQuestion(q, sec.marking_scheme, attempt);
          attempt.is_correct = isCorrect;
          attempt.marks_awarded = marks;

          if (isCorrect) {
            totalCorrect++;
            subjectScores[sec.subject].correct++;
          } else {
            totalIncorrect++;
            subjectScores[sec.subject].incorrect++;
          }

          subjectScores[sec.subject].score += marks;
          totalScore += marks;
        }
      }

      // Format-aware pacing benchmark analysis
      const { is_speed_win, is_time_trap } = evaluateAttemptPacing(
        attempt.time_spent_seconds,
        attempt.is_correct,
        attempt.is_evaluated,
        sec.subject,
        q.question_type,
        paper.exam_type
      );
      attempt.is_speed_win = is_speed_win;
      attempt.is_time_trap = is_time_trap;

      questionAttempts.push(attempt);
    }
  }

  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 10000) / 100 : 0;
  const timeTrapsCount = questionAttempts.filter((a) => a.is_time_trap).length;
  const speedWinsCount = questionAttempts.filter((a) => a.is_speed_win).length;

  return {
    user_id: submissionMeta.user_id,
    paper_id: paper.paper_id,
    paper_title: paper.title,
    exam_type: paper.exam_type,
    status: submissionMeta.status || 'EVALUATED',
    started_at: new Date(submissionMeta.started_at || Date.now()),
    submitted_at: new Date(submissionMeta.submitted_at || Date.now()),
    time_taken_seconds: submissionMeta.time_taken_seconds || 0,
    summary: {
      total_score: totalScore,
      max_marks: maxMarks,
      accuracy_percentage: accuracy,
      total_attempted: totalAttempted,
      total_correct: totalCorrect,
      total_incorrect: totalIncorrect,
      total_unattempted: totalUnattempted,
      subject_scores: subjectScores,
      pacing: {
        time_traps_count: timeTrapsCount,
        speed_wins_count: speedWinsCount,
      },
    },
    question_attempts: questionAttempts,
  };
}

/**
 * Evaluates and persists a test submission directly to MongoDB Atlas.
 */
export async function gradeAndPersistSubmission(userId, paperId, responses, meta = {}) {
  const client = await clientPromise;
  const db = client.db('jee_challenger_pyqs');

  // 1. Fetch Paper
  const paper = await db.collection('papers').findOne({
    $or: [{ paper_id: paperId }, { slug: paperId }],
  });
  if (!paper) {
    throw new Error(`Paper not found: ${paperId}`);
  }

  // 2. Extract Question IDs with ObjectId conversion support
  const allQIds = [];
  for (const sec of paper.sections || []) {
    if (Array.isArray(sec.question_ids)) {
      for (const id of sec.question_ids) {
        if (id) {
          try {
            allQIds.push(typeof id === 'string' ? new ObjectId(id) : id);
          } catch {
            allQIds.push(id);
          }
        }
      }
    }
  }

  // 3. Fetch Questions from production collection
  let questions = await db.collection('production').find({
    _id: { $in: allQIds },
  }).toArray();

  if (questions.length === 0 && paper.paper_id) {
    questions = await db.collection('production').find({
      original_paper_id: paper.paper_id,
    }).sort({ question_number: 1 }).toArray();
  }

  // 4. Grade Test
  const submissionData = scoreTestSubmission(paper, questions, responses, {
    user_id: typeof userId === 'string' ? new ObjectId(userId) : userId,
    status: meta.status || 'EVALUATED',
    started_at: meta.started_at,
    submitted_at: meta.submitted_at,
    time_taken_seconds: meta.time_taken_seconds,
  });

  // 5. Insert into test_submissions collection
  const result = await db.collection('test_submissions').insertOne(submissionData);
  submissionData._id = result.insertedId;

  // 6. Automatically populate Mistake Vault with incorrect attempts
  try {
    const incorrectAttempts = (submissionData.question_attempts || []).filter(
      (att) => att.is_evaluated && !att.is_correct
    );

    if (incorrectAttempts.length > 0 && userId) {
      let userObjId = null;
      try {
        userObjId = typeof userId === 'string' ? new ObjectId(userId) : userId;
      } catch {
        userObjId = userId;
      }

      const qMap = new Map();
      questions.forEach((q) => {
        qMap.set(String(q._id), q);
      });

      const vaultOps = incorrectAttempts.map((att) => {
        const qDoc = qMap.get(String(att.question_id));
        return {
          updateOne: {
            filter: {
              $or: [{ user_id: userObjId }, { user_id: String(userObjId) }],
              paper_id: paper.paper_id,
              question_number: Number(att.question_number),
            },
            update: {
              $setOnInsert: {
                user_id: userObjId,
                paper_id: paper.paper_id,
                paper_slug: paper.slug || paper.paper_id,
                question_number: Number(att.question_number),
                question_id: att.question_id,
                subject: att.subject || qDoc?.subject || null,
                chapter: qDoc?.chapter || null,
                saved_at: new Date(),
                source: 'auto_incorrect_evaluation',
              },
            },
            upsert: true,
          },
        };
      });

      if (vaultOps.length > 0) {
        await db.collection('mistake_vault').bulkWrite(vaultOps, { ordered: false });
      }
    }
  } catch (vaultErr) {
    console.error('Failed to auto-populate mistake vault:', vaultErr);
  }

  return submissionData;
}
