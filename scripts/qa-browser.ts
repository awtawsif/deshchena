import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'qa-screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

interface ViewportConfig {
  name: string;
  width: number;
  height: number;
  isMobile?: boolean;
  hasTouch?: boolean;
}

const VIEWPORTS: ViewportConfig[] = [
  { name: 'desktop-wide', width: 1440, height: 900 },
  { name: 'desktop-standard', width: 1280, height: 720 },
  { name: 'tablet-portrait', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'mobile-portrait', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'mobile-small', width: 360, height: 740, isMobile: true, hasTouch: true },
  { name: 'mobile-landscape', width: 844, height: 390, isMobile: true, hasTouch: true },
];

async function runQA() {
  console.log('🚀 Starting Comprehensive Browser UI/UX QA Audit...\n');

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

  const issues: Array<{ id: string; severity: string; description: string }> = [];

  try {
    const page = await browser.newPage();

    // Listen for browser console errors and unhandled exceptions
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`[Browser Console Error]: ${msg.text()}`);
        consoleLogs.push(msg.text());
      }
    });
    page.on('pageerror', (err: any) => {
      console.error(`[Browser Page Error]: ${err.message}`);
      consoleLogs.push(err.message);
    });

    // ----------------------------------------------------
    // Audit 1: Check Home Screen Across Viewports
    // ----------------------------------------------------
    console.log('--- Checking Home Screen Across Viewports ---');
    for (const vp of VIEWPORTS) {
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: vp.isMobile || false,
        hasTouch: vp.hasTouch || false,
      });

      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `home-${vp.name}.png`),
        fullPage: false,
      });

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalScroll:
            document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });

      if (overflow.hasHorizontalScroll) {
        issues.push({
          id: `OVERFLOW-HOME-${vp.name}`,
          severity: 'P1',
          description: `Horizontal overflow on Home screen at ${vp.name}: scrollWidth (${overflow.scrollWidth}) > clientWidth (${overflow.clientWidth})`,
        });
      }
    }

    // ----------------------------------------------------
    // Audit 2: Game Play Screen Layout & Interaction
    // ----------------------------------------------------
    console.log('\n--- Checking Game Screen Layout & Map Visibility ---');
    for (const vp of [VIEWPORTS[0], VIEWPORTS[3], VIEWPORTS[5]]) {
      // Desktop wide, Mobile portrait, Mobile landscape
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: vp.isMobile || false,
        hasTouch: vp.hasTouch || false,
      });

      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

      // Click PLAY NOW
      const playBtn = await page.waitForSelector('button ::-p-text(PLAY NOW)');
      if (playBtn) {
        await playBtn.click();
      }

      await page.waitForSelector('#bangladesh-districts');
      await new Promise((r) => setTimeout(r, 300));

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `game-${vp.name}.png`),
        fullPage: false,
      });

      // Check map visibility and bounding box
      const layoutStats = await page.evaluate(() => {
        const svg = document.querySelector('svg[aria-label="Interactive Map of Bangladesh Districts"]');
        const questionCard = document.querySelector('h2');
        const bottomBar = document.querySelector('footer');

        const svgRect = svg?.getBoundingClientRect();
        const questionRect = questionCard?.parentElement?.parentElement?.getBoundingClientRect();
        const footerRect = bottomBar?.getBoundingClientRect();

        return {
          viewportHeight: window.innerHeight,
          viewportWidth: window.innerWidth,
          svg: svgRect ? { top: svgRect.top, bottom: svgRect.bottom, height: svgRect.height, width: svgRect.width } : null,
          questionCard: questionRect ? { top: questionRect.top, bottom: questionRect.bottom, height: questionRect.height } : null,
          footer: footerRect ? { top: footerRect.top, bottom: footerRect.bottom } : null,
          isSvgOffscreen: svgRect ? svgRect.bottom > window.innerHeight : true,
          hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });

      console.log(`Viewport ${vp.name}:`, JSON.stringify(layoutStats, null, 2));

      if (layoutStats.hasHorizontalScroll) {
        issues.push({
          id: `OVERFLOW-GAME-${vp.name}`,
          severity: 'P1',
          description: `Horizontal overflow on Game screen at ${vp.name}`,
        });
      }

      if (layoutStats.svg && layoutStats.svg.height < 150) {
        issues.push({
          id: `MAP-TOO-SMALL-${vp.name}`,
          severity: 'P1',
          description: `Map height is severely collapsed on ${vp.name}: only ${layoutStats.svg.height}px`,
        });
      }

      if (layoutStats.isSvgOffscreen && vp.name !== 'mobile-landscape') {
        issues.push({
          id: `MAP-OFFSCREEN-${vp.name}`,
          severity: 'P2',
          description: `Map extends below the fold on ${vp.name}. User must scroll to see the whole map.`,
        });
      }
    }

    // ----------------------------------------------------
    // Audit 3: Answer Submission & Visual State Check
    // ----------------------------------------------------
    console.log('\n--- Checking Answer Submission Visual States ---');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await (await page.waitForSelector('button ::-p-text(PLAY NOW)'))?.click();
    await page.waitForSelector('#bangladesh-districts');

    // Click a district
    const firstDistrict = await page.waitForSelector('#bangladesh-districts path');
    const districtId = await page.evaluate((el) => el?.id, firstDistrict);
    console.log('Clicking district:', districtId);
    await firstDistrict?.click();

    // Check classes of the clicked district during evaluation state!
    await new Promise((r) => setTimeout(r, 100));
    const classesDuringEval = await page.evaluate((id) => {
      const el = document.getElementById(id!);
      return {
        className: el?.getAttribute('class'),
        fill: window.getComputedStyle(el!).fill,
      };
    }, districtId);
    console.log('Classes during evaluation:', classesDuringEval);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'game-evaluating-state.png'),
    });

    if (classesDuringEval.className?.includes('fill-slate-800/40')) {
      issues.push({
        id: 'BUG-MAP-DISABLED-OVERRIDE',
        severity: 'P0',
        description:
          'When game is in evaluating state, the disabled prop overrides all semantic feedback colors with fill-slate-800/40!',
      });
    }

    // ----------------------------------------------------
    // Audit 4: Rapid Click / Double Click Stress Test
    // ----------------------------------------------------
    console.log('\n--- Stress Testing Rapid Clicking ---');
    // Rapidly click the district 5 times
    for (let i = 0; i < 5; i++) {
      await firstDistrict?.click().catch(() => {});
    }
    // Check score and history
    const multiClickResult = await page.evaluate(() => {
      const scoreEl = document.querySelector('.text-emerald-400 strong, strong.text-white');
      return {
        text: scoreEl?.textContent,
      };
    });
    console.log('Score text after rapid clicks:', multiClickResult);

    // ----------------------------------------------------
    // Audit 5: Full Game to Results Screen Flow
    // ----------------------------------------------------
    console.log('\n--- Testing Complete Game Session & Results Screen ---');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    // Select 10 questions
    const tenBtn = await page.waitForSelector('button ::-p-text(10)');
    await tenBtn?.click();
    await (await page.waitForSelector('button ::-p-text(PLAY NOW)'))?.click();
    await page.waitForSelector('#bangladesh-districts');

    for (let q = 0; q < 10; q++) {
      const dist = await page.waitForSelector('#bangladesh-districts path');
      await dist?.click();
      // Click next button if present to speed up
      const nextBtn = await page.$('button ::-p-text(Next)');
      if (nextBtn) {
        await nextBtn.click().catch(() => {});
      } else {
        await new Promise((r) => setTimeout(r, 1200));
      }
      await new Promise((r) => setTimeout(r, 200));
    }

    // Wait for Results screen
    await page.waitForSelector('button ::-p-text(Play Again)');
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'results-desktop.png'),
    });

    // Check results on mobile portrait too
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'results-mobile.png'),
    });

    // Test Practice Mistakes button
    const practiceBtn = await page.$('button ::-p-text(Practice Mistakes)');
    if (practiceBtn) {
      console.log('Testing Practice Mistakes button...');
      await practiceBtn.click();
      await page.waitForSelector('#bangladesh-districts');
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'practice-game-screen.png'),
      });
      console.log('Successfully launched Practice Mistakes mode!');
    }

    console.log('\n================ QA AUDIT SUMMARY ================');
    console.log(`Discovered ${issues.length} potential issues:`);
    for (const issue of issues) {
      console.log(`[${issue.severity}] ${issue.id}: ${issue.description}`);
    }
  } catch (err: any) {
    console.error('QA Script Error:', err);
  } finally {
    await browser.close();
  }
}

runQA();
