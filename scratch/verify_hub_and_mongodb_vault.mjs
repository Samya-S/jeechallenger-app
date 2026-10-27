import puppeteer from 'puppeteer';
import { encode } from 'next-auth/jwt';
import dns from 'node:dns';
import path from 'node:path';
import fs from 'node:fs';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const ARTIFACT_DIR = 'C:/Users/samya/.gemini/antigravity/brain/e296332f-9d45-4e4c-b845-5ba919b40fcc';

const envText = fs.readFileSync('d:/GitHub/jeechallenger-app/.env.local', 'utf8');
const getEnv = (key) => {
  const match = envText.match(new RegExp('^' + key + '=(.*)$', 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

const NEXTAUTH_SECRET = getEnv('NEXTAUTH_SECRET');

async function verify() {
  console.log('=== STARTING VERIFICATION: MOCK TEST HUB & MONGODB MISTAKE VAULT ===');

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

  // 1. Visit /mock-test (Available Mock Tests)
  console.log('[1] Visiting http://localhost:3000/mock-test...');
  await page.goto('http://localhost:3000/mock-test', { waitUntil: 'networkidle2', timeout: 35000 });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await new Promise((r) => setTimeout(r, 1200));

  const shot1 = path.join(ARTIFACT_DIR, '16_mock_test_hub_available_papers_dark.png');
  await page.screenshot({ path: shot1, fullPage: false });
  console.log('  Captured ->', shot1);

  // 2. Click "My Test Attempts" tab
  console.log('[2] Switching to My Test Attempts tab...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const tab = buttons.find((b) => b.textContent.includes('My Test Attempts'));
    if (tab) tab.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  const shot2 = path.join(ARTIFACT_DIR, '17_mock_test_hub_attempts_dark.png');
  await page.screenshot({ path: shot2, fullPage: false });
  console.log('  Captured ->', shot2);

  // 3. Bookmark a question in MongoDB and check Mistake Vault
  console.log('[3] Bookmarking Q1 on scorecard via MongoDB API...');
  await fetch('http://localhost:3000/api/cbt/mistake-vault', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `next-auth.session-token=${token}`,
    },
    body: JSON.stringify({
      paper_id: 'JEE_Main_2026_Apr_2nd_Shift_1',
      paper_slug: 'jee-main-2026-apr-2nd-shift-1',
      question_number: 1,
      question_id: '6a716d9b7664030ffcb6bb95',
      subject: 'Mathematics',
      chapter: 'Functions',
    }),
  });

  // Refresh /mock-test?tab=mistake-vault
  console.log('[4] Navigating to http://localhost:3000/mock-test?tab=mistake-vault...');
  await page.goto('http://localhost:3000/mock-test?tab=mistake-vault', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await new Promise((r) => setTimeout(r, 1500));

  const shot3 = path.join(ARTIFACT_DIR, '18_mistake_vault_mongodb_hub_dark.png');
  await page.screenshot({ path: shot3, fullPage: false });
  console.log('  Captured ->', shot3);

  // 4. Check clean Profile page
  console.log('[5] Navigating to http://localhost:3000/profile (clean Account Settings)...');
  await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await new Promise((r) => setTimeout(r, 1000));

  const shot4 = path.join(ARTIFACT_DIR, '19_profile_clean_account_settings_dark.png');
  await page.screenshot({ path: shot4, fullPage: false });
  console.log('  Captured ->', shot4);

  await browser.close();
  console.log('=== VERIFICATION COMPLETED SUCCESSFULLY! ===');
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
