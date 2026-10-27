import puppeteer from 'puppeteer';
import { encode } from 'next-auth/jwt';
import dns from 'node:dns';
import path from 'node:path';
import fs from 'node:fs';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const ARTIFACT_DIR = 'C:/Users/samya/.gemini/antigravity/brain/e296332f-9d45-4e4c-b845-5ba919b40fcc';

// Load .env.local manually
const envText = fs.readFileSync('d:/GitHub/jeechallenger-app/.env.local', 'utf8');
const getEnv = (key) => {
  const match = envText.match(new RegExp('^' + key + '=(.*)$', 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

const NEXTAUTH_SECRET = getEnv('NEXTAUTH_SECRET');

async function runCompleteVerification() {
  console.log('--- STARTING COMPLETE UI VERIFICATION & SCREENSHOT CAPTURE ---');

  const token = await encode({
    token: {
      name: 'Hckr Spy',
      email: 'hackerspydetected@gmail.com',
      id: '688dce51d3445e392b6362c3',
      sub: '688dce51d3445e392b6362c3',
    },
    secret: NEXTAUTH_SECRET,
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,850'],
    defaultViewport: { width: 1366, height: 850 },
  });

  const page = await browser.newPage();
  await page.setCookie({
    name: 'next-auth.session-token',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  const resultsUrl = 'http://localhost:3000/mock-test/jee-main-2026-apr-2nd-shift-1/results';
  console.log(`[1] Navigating to Semantic Results URL: ${resultsUrl}...`);
  await page.goto(resultsUrl, { waitUntil: 'networkidle2', timeout: 35000 });

  await page.waitForSelector('[data-testid="cbt-scorecard"]', { timeout: 15000 });
  await page.waitForSelector('[data-testid="cbt-solution-review"]', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1500));

  // --- SCREENSHOT 1: Top Bar, Attempt Switcher, Scorecard with Root Gradient in Dark Mode ---
  console.log('[2] Capturing Scorecard with Root Gradient...');
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 800));

  const shotScorecardPath = path.join(ARTIFACT_DIR, '09_scorecard_root_gradient_dark.png');
  await page.screenshot({ path: shotScorecardPath, fullPage: false });
  console.log(`  Captured -> ${shotScorecardPath}`);

  // --- SCREENSHOT 2: Solutions Section COLLAPSED BY DEFAULT ---
  console.log('[3] Capturing Solutions Collapsed By Default State...');
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="cbt-solution-review"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise((r) => setTimeout(r, 800));

  const shotCollapsedPath = path.join(ARTIFACT_DIR, '10_solution_collapsed_state_dark.png');
  await page.screenshot({ path: shotCollapsedPath, fullPage: false });
  console.log(`  Captured -> ${shotCollapsedPath}`);

  // --- SCREENSHOT 3: Expand Single Question Solution ---
  console.log('[4] Clicking "View Step-by-Step Solution" on Q1...');
  await page.evaluate(() => {
    const firstReviewCard = document.querySelector('[data-testid^="review-q-"]');
    if (firstReviewCard) {
      const toggleBtn = firstReviewCard.querySelector('button[type="button"]');
      // Look for the toggle button with "View Step-by-Step Solution"
      const buttons = Array.from(firstReviewCard.querySelectorAll('button'));
      const viewSolBtn = buttons.find((b) => b.textContent.includes('View Step-by-Step Solution'));
      if (viewSolBtn) viewSolBtn.click();
    }
  });
  await new Promise((r) => setTimeout(r, 800));

  const shotExpandedPath = path.join(ARTIFACT_DIR, '11_solution_expanded_single_dark.png');
  await page.screenshot({ path: shotExpandedPath, fullPage: false });
  console.log(`  Captured -> ${shotExpandedPath}`);

  // --- SCREENSHOT 4: Mistake Vault Bookmark & Filtering ---
  console.log('[5] Bookmarking Q1 into Mistake Vault and Filtering...');
  await page.evaluate(() => {
    const firstReviewCard = document.querySelector('[data-testid^="review-q-"]');
    if (firstReviewCard) {
      const bkmkBtn = firstReviewCard.querySelector('button[title*="Mistake Vault"]');
      if (bkmkBtn) bkmkBtn.click();
    }
  });
  await new Promise((r) => setTimeout(r, 500));

  // Click Mistake Vault filter tab
  await page.evaluate(() => {
    const filterButtons = Array.from(document.querySelectorAll('button'));
    const vaultTab = filterButtons.find((b) => b.textContent.includes('Mistake Vault'));
    if (vaultTab) vaultTab.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  const shotVaultPath = path.join(ARTIFACT_DIR, '12_mistake_vault_filter_dark.png');
  await page.screenshot({ path: shotVaultPath, fullPage: false });
  console.log(`  Captured -> ${shotVaultPath}`);

  // Reset filter back to ALL
  await page.evaluate(() => {
    const filterButtons = Array.from(document.querySelectorAll('button'));
    const allTab = filterButtons.find((b) => b.textContent.trim() === 'All');
    if (allTab) allTab.click();
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 600));

  // --- SCREENSHOT 5: Attempt History & Progression Modal ---
  console.log('[6] Opening Attempt History Modal...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const historyBtn = buttons.find((b) => b.textContent.includes('Attempt History'));
    if (historyBtn) historyBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  const shotModalPath = path.join(ARTIFACT_DIR, '13_attempt_switcher_modal_dark.png');
  await page.screenshot({ path: shotModalPath, fullPage: false });
  console.log(`  Captured -> ${shotModalPath}`);

  // Close Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.fixed button');
    if (closeBtn) closeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // --- SCREENSHOT 6: Light Mode Verification ---
  console.log('[7] Capturing Light Mode Scorecard...');
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 800));

  const shotLightPath = path.join(ARTIFACT_DIR, '14_scorecard_light_mode.png');
  await page.screenshot({ path: shotLightPath, fullPage: false });
  console.log(`  Captured -> ${shotLightPath}`);

  // --- SCREENSHOT 7: User Profile with Mock Test Analytics ---
  console.log('[8] Navigating to User Profile: http://localhost:3000/profile...');
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  const shotProfilePath = path.join(ARTIFACT_DIR, '15_user_profile_mock_history_dark.png');
  await page.screenshot({ path: shotProfilePath, fullPage: false });
  console.log(`  Captured -> ${shotProfilePath}`);

  await browser.close();
  console.log('=== ALL VERIFICATION SCREENSHOTS CAPTURED SUCCESSFULLY! ===');
}

runCompleteVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
