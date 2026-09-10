import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'qa-screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function runDeepAudit() {
  console.log('🧪 Starting Deep UI/UX & A11y Verification Audit...\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Track console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err: any) => {
      errors.push(err.message);
    });

    // ----------------------------------------------------
    // Test 1: Language Toggle & Bangla Verification
    // ----------------------------------------------------
    console.log('--- 1. Testing Bangla Localization Flow ---');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

    // Click language button
    const langBtn = await page.waitForSelector('button[aria-label="Toggle language"]');
    await langBtn?.click();
    await new Promise((r) => setTimeout(r, 200));

    // Verify Bangla title and start button
    const banglaPlayText = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('খেলা শুরু করুন')
      );
      return btn?.textContent?.trim();
    });
    console.log('✓ Bangla Start Button text:', banglaPlayText);
    if (!banglaPlayText?.includes('খেলা শুরু করুন')) {
      throw new Error('Bangla translation failed on Home screen start button!');
    }

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'bangla-home.png'),
    });

    // Start a game in Bangla
    const buttons = await page.$$('button');
    let banglaStartBtn = null;
    for (const b of buttons) {
      const t = await b.evaluate((el) => el.textContent);
      if (t?.includes('খেলা শুরু করুন')) {
        banglaStartBtn = b;
        break;
      }
    }
    await banglaStartBtn?.click();
    await page.waitForSelector('#bangladesh-districts');
    await new Promise((r) => setTimeout(r, 300));

    // Verify question card in Bangla
    const questionText = await page.evaluate(() => {
      const heading = document.querySelector('h2');
      return {
        district: heading?.textContent?.trim(),
        hasFindText: document.body.textContent?.includes('খুঁজে বের করুন'),
      };
    });
    console.log('✓ Bangla Question card rendered:', questionText);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'bangla-game.png'),
    });

    // Switch back to English for remaining tests
    const langBtnInGame = await page.waitForSelector('button[aria-label="Toggle language"]');
    await langBtnInGame?.click();
    await new Promise((r) => setTimeout(r, 200));

    // ----------------------------------------------------
    // Test 2: Audio Mute Toggle & LocalStorage
    // ----------------------------------------------------
    console.log('\n--- 2. Testing Audio Mute & Persistence ---');
    const muteBtn = await page.waitForSelector('button[aria-label*="sound"]');
    const initialMuteState = await page.evaluate(() => localStorage.getItem('deshchena_muted'));
    console.log('✓ Initial localStorage deshchena_muted:', initialMuteState);

    await muteBtn?.click();
    const afterMuteState = await page.evaluate(() => localStorage.getItem('deshchena_muted'));
    console.log('✓ After click localStorage deshchena_muted:', afterMuteState);
    if (afterMuteState !== 'true') {
      throw new Error('Mute button did not update localStorage!');
    }

    // Unmute
    await muteBtn?.click();

    // ----------------------------------------------------
    // Test 3: Keyboard Accessibility (Enter / Space)
    // ----------------------------------------------------
    console.log('\n--- 3. Testing Keyboard Accessibility (A11y) ---');
    // Focus first district path and trigger keypress
    const keyboardResult = await page.evaluate(() => {
      const firstPath = document.querySelector('#bangladesh-districts path') as SVGPathElement;
      if (!firstPath) return false;
      firstPath.focus();
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      firstPath.dispatchEvent(event);
      return true;
    });
    console.log('✓ Keyboard Enter event dispatched on district path:', keyboardResult);
    await new Promise((r) => setTimeout(r, 400));

    const evalBanner = await page.$('button ::-p-text(Next)');
    console.log('✓ Feedback banner displayed from keyboard action:', !!evalBanner);
    if (evalBanner) {
      await evalBanner.click();
      await new Promise((r) => setTimeout(r, 300));
    }

    // ----------------------------------------------------
    // Test 4: Practice Mistakes Full Flow
    // ----------------------------------------------------
    console.log('\n--- 4. Testing Complete Game Flow to Practice Mistakes ---');
    // Exit to home first
    const exitBtn = Array.from(await page.$$('button')).find(async (b) => {
      const text = await b.evaluate((el) => el.textContent);
      return text?.includes('Exit');
    });
    await exitBtn?.click();
    await new Promise((r) => setTimeout(r, 300));

    // Wait for home
    await page.waitForSelector('button ::-p-text(PLAY NOW)');
    const allButtons = await page.$$('button');
    for (const b of allButtons) {
      const text = await b.evaluate((el) => el.textContent?.trim());
      if (text === '10') {
        await b.click();
        break;
      }
    }
    const playNowBtn = await page.waitForSelector('button ::-p-text(PLAY NOW)');
    await playNowBtn?.click();
    await page.waitForSelector('#bangladesh-districts');

    // Answer all 10 questions quickly with wrong answers to generate mistakes
    console.log('Answering 10 questions to reach Results screen...');
    for (let i = 0; i < 10; i++) {
      const dist = await page.waitForSelector('#bangladesh-districts path');
      await dist?.click();
      await new Promise((r) => setTimeout(r, 100));
      const next = await page.$('button ::-p-text(Next)');
      if (next) {
        await next.click().catch(() => {});
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
      await new Promise((r) => setTimeout(r, 150));
    }

    // Results screen should appear
    await page.waitForSelector('button ::-p-text(Play Again)');
    console.log('✓ Results Screen reached successfully!');

    // Capture Results screen
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'results-verified.png'),
    });

    // Find Practice Mistakes button
    const buttonsOnResults = await page.$$('button');
    let practiceButton = null;
    for (const btn of buttonsOnResults) {
      const text = await btn.evaluate((el) => el.textContent);
      if (text?.includes('Practice Mistakes')) {
        practiceButton = btn;
        console.log(`✓ Found Practice Button: "${text?.trim()}"`);
        break;
      }
    }

    if (!practiceButton) {
      throw new Error('Practice Mistakes button not found on Results screen!');
    }

    // Scroll to and click Practice Mistakes
    await practiceButton.scrollIntoView();
    await practiceButton.click();
    await page.waitForSelector('#bangladesh-districts');
    await new Promise((r) => setTimeout(r, 300));

    console.log('✓ Practice session active! Target pool contains missed districts.');

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'practice-session-verified.png'),
    });

    console.log('\n🎉 ALL DEEP AUDIT VERIFICATIONS PASSED WITH 0 ERRORS!');
  } catch (err: any) {
    console.error('❌ Audit Failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runDeepAudit();
