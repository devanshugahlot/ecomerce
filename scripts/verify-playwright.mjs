import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const widths = [
  { width: 375, height: 667, name: 'mobile-375' },
  { width: 768, height: 1024, name: 'tablet-768' },
  { width: 1024, height: 768, name: 'laptop-1024' },
  { width: 1440, height: 900, name: 'desktop-1440' },
  { width: 1920, height: 1080, name: 'wide-1920' },
];

const screenshotsDir = path.resolve('screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function runTests() {
  console.log('--- STARTING PLAYWRIGHT VERIFICATION ---');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge' });
  } catch (e) {
    console.log('Falling back to default chromium...');
    browser = await chromium.launch();
  }

  const results = [];

  for (const vp of widths) {
    console.log(`\nTesting viewport: ${vp.width}x${vp.height} (${vp.name})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // Bypass age gate modal for pristine screenshots
    await page.addInitScript(() => {
      localStorage.setItem('hypril_age_verified', 'true');
      localStorage.setItem('boldcare_age_verified', 'true');
    });

    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500); // allow state and images to settle

    // 1. Check Horizontal Scroll
    const scrollInfo = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const bodyWidth = document.body.scrollWidth;
      return {
        docWidth,
        winWidth,
        bodyWidth,
        hasHorizontalScroll: docWidth > winWidth || bodyWidth > winWidth,
      };
    });

    // 2. Check Banner and Above-the-fold visibility
    const bannerInfo = await page.evaluate((vpHeight) => {
      const bannerImg = document.querySelector('img[alt*="Hero Banner"]');
      const bannerContainer = bannerImg ? bannerImg.closest('section') : null;
      const announcementBar = document.querySelector('header .bg-black');
      const navbar = document.querySelector('header');
      const categoryScroll = document.querySelector('section button img[alt]')?.closest('section');
      
      const bannerRect = bannerImg ? bannerImg.getBoundingClientRect() : null;
      const containerRect = bannerContainer ? bannerContainer.getBoundingClientRect() : null;
      
      let bannerVisibleFraction = 0;
      if (bannerRect) {
        const visibleTop = Math.max(0, bannerRect.top);
        const visibleBottom = Math.min(vpHeight, bannerRect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        bannerVisibleFraction = bannerRect.height > 0 ? (visibleHeight / bannerRect.height) : 0;
      }

      // Check badges in category scroll
      const badges = Array.from(document.querySelectorAll('section span')).map(s => s.textContent.trim());
      const hasClinicalBadge = badges.some(b => b.toUpperCase() === 'CLINICAL');

      // Check category labels
      const categoryLabels = Array.from(document.querySelectorAll('section button span[title]')).map(s => ({
        text: s.textContent.trim(),
        scrollHeight: s.scrollHeight,
        clientHeight: s.clientHeight,
        scrollWidth: s.scrollWidth,
        clientWidth: s.clientWidth,
      }));

      return {
        bannerFound: !!bannerImg,
        bannerSrc: bannerImg ? bannerImg.currentSrc || bannerImg.src : null,
        naturalWidth: bannerImg ? bannerImg.naturalWidth : 0,
        naturalHeight: bannerImg ? bannerImg.naturalHeight : 0,
        renderedWidth: bannerRect ? bannerRect.width : 0,
        renderedHeight: bannerRect ? bannerRect.height : 0,
        containerWidth: containerRect ? containerRect.width : 0,
        bannerTop: bannerRect ? bannerRect.top : 0,
        bannerBottom: bannerRect ? bannerRect.bottom : 0,
        bannerVisibleFraction,
        hasAnnouncementBar: !!announcementBar,
        hasNavbar: !!navbar,
        hasCategoryScroll: !!categoryScroll,
        hasClinicalBadge,
        categoryLabels,
      };
    }, vp.height);

    // Save screenshot of the first screen (viewport)
    const screenshotPath = path.join(screenshotsDir, `home-${vp.name}-${vp.width}x${vp.height}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Saved screenshot: ${screenshotPath}`);

    const result = {
      viewport: `${vp.width}x${vp.height}`,
      hasHorizontalScroll: scrollInfo.hasHorizontalScroll,
      scrollInfo,
      bannerInfo,
      screenshot: screenshotPath,
    };
    results.push(result);

    console.log(`- Horizontal scroll: ${scrollInfo.hasHorizontalScroll ? 'FAILED (has scroll)' : 'PASSED (no horizontal scroll)'}`);
    console.log(`- Banner rendered: ${bannerInfo.renderedWidth}x${bannerInfo.renderedHeight} (natural: ${bannerInfo.naturalWidth}x${bannerInfo.naturalHeight})`);
    console.log(`- Banner visible fraction on first screen: ${(bannerInfo.bannerVisibleFraction * 100).toFixed(1)}%`);
    console.log(`- Category 'CLINICAL' badge present: ${bannerInfo.hasClinicalBadge ? 'YES (SHOULD BE REMOVED)' : 'NO (PASSED)'}`);
    
    await context.close();
  }

  await browser.close();

  console.log('\n--- ALL PLAYWRIGHT TESTS COMPLETE ---');
  fs.writeFileSync(path.join(screenshotsDir, 'test-summary.json'), JSON.stringify(results, null, 2));
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
