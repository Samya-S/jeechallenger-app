import puppeteer from 'puppeteer';
import { encode } from 'next-auth/jwt';
import dns from 'node:dns';
import path from 'node:path';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const ARTIFACT_DIR = 'C:/Users/samya/.gemini/antigravity/brain/e296332f-9d45-4e4c-b845-5ba919b40fcc';

async function capture() {
  const token = await encode({
    token: {
      name: 'Hckr Spy',
      email: 'hackerspydetected@gmail.com',
      id: '688dce51d3445e392b6362c3',
      sub: '688dce51d3445e392b6362c3',
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768'],
    defaultViewport: { width: 1366, height: 768 },
  });

  const page = await browser.newPage();
  await page.setCookie({
    name: 'next-auth.session-token',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  const url = 'http://localhost:3000/mock-test/jee-main-2026-apr-2nd-shift-1/results?submission=6ae021e8a35852b7e28ab167';
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 35000 });

  await page.waitForSelector('[data-testid="cbt-solution-review"]', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1500));

  // --- Capture 1: In Dark Mode (Default) ---
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    const el = document.querySelector('[data-testid="cbt-solution-review"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise((r) => setTimeout(r, 800));

  const darkPath = path.join(ARTIFACT_DIR, '07_solution_review_redesigned_dark.png');
  // Also overwrite the original 07_solution_review.png so the carousel reflects the new design
  const main07Path = path.join(ARTIFACT_DIR, '07_solution_review.png');

  await page.screenshot({ path: darkPath, fullPage: false });
  await page.screenshot({ path: main07Path, fullPage: false });
  console.log('Captured dark mode solution review:', darkPath);

  // --- Capture 2: In Light Mode ---
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    const el = document.querySelector('[data-testid="cbt-solution-review"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise((r) => setTimeout(r, 800));

  const lightPath = path.join(ARTIFACT_DIR, '08_solution_review_redesigned_light.png');
  await page.screenshot({ path: lightPath, fullPage: false });
  console.log('Captured light mode solution review:', lightPath);

  await browser.close();
  console.log('Done capturing solution review screenshots!');
}

capture().catch(console.error);
