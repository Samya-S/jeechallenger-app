import puppeteer from 'puppeteer';
import { encode } from 'next-auth/jwt';
import dns from 'node:dns';
import path from 'node:path';
import fs from 'node:fs';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const ARTIFACT_DIR = 'C:/Users/samya/.gemini/antigravity/brain/e296332f-9d45-4e4c-b845-5ba919b40fcc';

async function runMockTestSimulation() {
  console.log('================================================================');
  console.log('  STARTING AUTONOMOUS CBT MOCK TEST SIMULATION & EVIDENCE CAPTURE');
  console.log('================================================================');

  const { MongoClient, ObjectId } = await import('mongodb');
  const redisModule = await import('../utils/redis.js');
  const redis = redisModule.default;

  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  await mongoClient.connect();
  const db = mongoClient.db('jee_challenger_pyqs');

  // Step 1: Use the user's active logged-in account (Hckr Spy / hackerspydetected@gmail.com)
  const testUserId = '688dce51d3445e392b6362c3';
  const candidateName = 'Hckr Spy';
  const candidateEmail = 'hackerspydetected@gmail.com';

  const token = await encode({
    token: {
      name: candidateName,
      email: candidateEmail,
      id: testUserId,
      sub: testUserId,
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log(`[1/7] Authenticating as user: ${candidateName} (${candidateEmail})...`);

  // Step 2: Launch Headless Browser (Kiosk Resolution: 1366x768)
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1366,768',
      '--disable-web-security',
    ],
    defaultViewport: {
      width: 1366,
      height: 768,
    },
  });

  const page = await browser.newPage();

  // Set the NextAuth session token cookie for localhost
  await page.setCookie({
    name: 'next-auth.session-token',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  console.log('[2/7] Set session cookie and configured 1366x768 testing kiosk viewport.');

  // Target paper: JEE Main 2026 Apr 2nd Shift 1
  const paperSlug = 'jee-main-2026-apr-2nd-shift-1';
  const examUrl = `http://localhost:3000/mock-test/${paperSlug}`;

  console.log(`[3/7] Navigating to Exam Room: ${examUrl}...`);
  await page.goto(examUrl, { waitUntil: 'networkidle2', timeout: 35000 });

  // Wait for the exam room UI to render
  await page.waitForSelector('[data-testid="cbt-exam-room"]', { timeout: 20000 });
  await page.waitForSelector('[data-testid="cbt-question-pane"]', { timeout: 20000 });
  console.log('      Exam room loaded successfully.');

  // Wait 1.5s for timer and katex math to finish typesetting
  await new Promise((r) => setTimeout(r, 1500));

  // --- SCREENSHOT 1: Exam Room Initial State ---
  const shot1Path = path.join(ARTIFACT_DIR, '01_exam_room_initial.png');
  await page.screenshot({ path: shot1Path, fullPage: false });
  console.log(`  [SCREENSHOT 1 CAPTURED] -> ${shot1Path}`);

  // --- STEP 4: Interact with Question 1 (MCQ) ---
  console.log('[4/7] Selecting Option B on Question 1 and clicking "Save & Next"...');
  const optionB = await page.waitForSelector('[data-testid="cbt-option-B"]', { timeout: 5000 });
  if (optionB) {
    await optionB.click();
  }
  await new Promise((r) => setTimeout(r, 400));

  // Click Save & Next
  const saveNextBtn = await page.waitForSelector('[data-testid="cbt-save-next-btn"]', { timeout: 5000 });
  await saveNextBtn.click();
  await new Promise((r) => setTimeout(r, 1200));

  // --- SCREENSHOT 2: Answered State ---
  const shot2Path = path.join(ARTIFACT_DIR, '02_answered_state.png');
  await page.screenshot({ path: shot2Path, fullPage: false });
  console.log(`  [SCREENSHOT 2 CAPTURED] -> ${shot2Path}`);

  // --- STEP 5: Jump to Numerical Section & Use Virtual Keypad ---
  console.log('[5/7] Switching to Mathematics Section B (Numerical Value)...');
  const secBTab = await page.waitForSelector('[data-testid="cbt-section-tab-1"]', { timeout: 5000 });
  await secBTab.click();
  await new Promise((r) => setTimeout(r, 800));

  // Wait for Virtual Keypad
  const keypad = await page.waitForSelector('[data-testid="cbt-virtual-keypad"]', { timeout: 5000 });
  if (keypad) {
    console.log('      Clicking on-screen keypad buttons: 4 -> 2 -> . -> 5');
    const btn4 = await page.waitForSelector('button[data-key="4"]');
    await btn4.click();
    await new Promise((r) => setTimeout(r, 200));

    const btn2 = await page.waitForSelector('button[data-key="2"]');
    await btn2.click();
    await new Promise((r) => setTimeout(r, 200));

    const btnDot = await page.waitForSelector('button[data-key="."]');
    await btnDot.click();
    await new Promise((r) => setTimeout(r, 200));

    const btn5 = await page.waitForSelector('button[data-key="5"]');
    await btn5.click();
    await new Promise((r) => setTimeout(r, 400));

    // Click "Save & Mark for Review"
    const saveReviewBtn = await page.waitForSelector('[data-testid="cbt-save-review-btn"]');
    await saveReviewBtn.click();
    await new Promise((r) => setTimeout(r, 1200));
  }

  // --- SCREENSHOT 3: Virtual Keypad & Marked for Review State ---
  const shot3Path = path.join(ARTIFACT_DIR, '03_virtual_keypad_numeric.png');
  await page.screenshot({ path: shot3Path, fullPage: false });
  console.log(`  [SCREENSHOT 3 CAPTURED] -> ${shot3Path}`);

  // --- STEP 6: Snapshot Redis In-Flight State ---
  console.log('[6/7] Querying Upstash Redis for live in-flight database hash...');
  const paper = await db.collection('papers').findOne({ slug: paperSlug });
  const redisSessionKey = `cbt:session:${testUserId}:${paper.paper_id}`;
  const inFlightRedisHash = await redis.hgetall(redisSessionKey);
  console.log('      Live Redis Hash Fields:', Object.keys(inFlightRedisHash || {}));

  // --- STEP 7: Final Submit & Results Scorecard ---
  console.log('[7/7] Opening Pre-Submission Summary Modal...');
  const submitBtn = await page.waitForSelector('[data-testid="cbt-submit-modal-btn"]');
  await submitBtn.click();
  await new Promise((r) => setTimeout(r, 800));

  // --- SCREENSHOT 4: Exam Summary Modal ---
  const shot4Path = path.join(ARTIFACT_DIR, '04_exam_summary_modal.png');
  await page.screenshot({ path: shot4Path, fullPage: false });
  console.log(`  [SCREENSHOT 4 CAPTURED] -> ${shot4Path}`);

  // Click Confirm Submission
  console.log('      Confirming submission: clicking "Yes, Submit Exam"...');
  const confirmSubmitBtn = await page.waitForSelector('[data-testid="cbt-summary-confirm-btn"]');
  await confirmSubmitBtn.click();

  // Wait for redirect to /mock-test/results/[submissionId]
  await page.waitForFunction(() => window.location.href.includes('/mock-test/results/'), { timeout: 35000 });
  const resultsUrl = page.url();
  console.log(`      Evaluation finished! Redirected to: ${resultsUrl}`);

  await page.waitForSelector('[data-testid="cbt-scorecard"]', { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 2000));

  // --- SCREENSHOT 5: Scorecard Top Banner ---
  const shot5Path = path.join(ARTIFACT_DIR, '05_scorecard_banner.png');
  await page.screenshot({ path: shot5Path, fullPage: false });
  console.log(`  [SCREENSHOT 5 CAPTURED] -> ${shot5Path}`);

  // Scroll to Pacing Heatmap
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="cbt-pacing-heatmap"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 1000));

  // --- SCREENSHOT 6: Pacing Heatmap ---
  const shot6Path = path.join(ARTIFACT_DIR, '06_pacing_heatmap.png');
  await page.screenshot({ path: shot6Path, fullPage: false });
  console.log(`  [SCREENSHOT 6 CAPTURED] -> ${shot6Path}`);

  // Scroll to Solution Review
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="cbt-solution-review"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise((r) => setTimeout(r, 1200));

  // --- SCREENSHOT 7: Solution Review with LaTeX ---
  const shot7Path = path.join(ARTIFACT_DIR, '07_solution_review.png');
  await page.screenshot({ path: shot7Path, fullPage: false });
  console.log(`  [SCREENSHOT 7 CAPTURED] -> ${shot7Path}`);

  // Extract submission ID from URL
  const submissionIdMatch = resultsUrl.match(/\/mock-test\/results\/([a-f0-9]+)/);
  const submissionId = submissionIdMatch ? submissionIdMatch[1] : null;

  let mongoDoc = null;
  if (submissionId) {
    mongoDoc = await db.collection('test_submissions').findOne({
      _id: new ObjectId(submissionId),
    });
  }

  await browser.close();
  await mongoClient.close();

  // Save JSON report of in-flight redis hash and final MongoDB document
  const evidenceReport = {
    testPaper: paper.title,
    candidate: candidateName,
    candidateEmail: candidateEmail,
    resultsUrl,
    inFlightRedisHash,
    mongoSubmissionDocument: mongoDoc,
    screenshots: [
      shot1Path,
      shot2Path,
      shot3Path,
      shot4Path,
      shot5Path,
      shot6Path,
      shot7Path,
    ],
  };

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'mock_test_evidence.json'),
    JSON.stringify(evidenceReport, null, 2),
    'utf8'
  );

  console.log('================================================================');
  console.log('  MOCK TEST COMPLETED SUCCESSFULLY WITH 100% VISUAL & DB PROOF');
  console.log('================================================================');
}

runMockTestSimulation().catch((err) => {
  console.error('Fatal in mock test simulation:', err);
  process.exit(1);
});
