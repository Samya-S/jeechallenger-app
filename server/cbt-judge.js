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

  // Rule 2: Single Correct MCQ
  if (q.input_format === 'MCQ' || q.question_type === 'MCQ') {
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

  // Rule 3: Numerical Value Question
  if (q.input_format === 'NUMERIC' || q.question_type === 'NUMERIC') {
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

      const attempt = {
        question_id: q._id,
        question_number: q.question_number,
        subject: sec.subject,
        section_name: sec.name,
        question_type: q.question_type,
        selected_option: resp?.selected_option ?? null,
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

      questionAttempts.push(attempt);
    }
  }

  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 10000) / 100 : 0;

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
      $or: [
        { paper_id: paper.paper_id },
        { original_paper_id: paper.paper_id },
      ],
    }).toArray();
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

  return submissionData;
}
