const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext();
  await context.addInitScript(() => {
    localStorage.setItem('hypril_age_verified', 'true');
  });
  const page = await context.newPage();

  // 1. Mobile Home Bestsellers
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForSelector('text=₹', { timeout: 10000 });
  await page.evaluate(() => window.scrollBy(0, 680));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'home-bestsellers-375.png') });
  console.log('Captured home-bestsellers-375.png');

  // 2. Product Detail
  for (const w of [375, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('http://localhost:4173/products/hypril-extended-delay-gel-50ml', { waitUntil: 'networkidle' });
    await page.waitForSelector('h1', { timeout: 10000 });
    await page.screenshot({ path: path.join(__dirname, 'screenshots', `product-detail-${w}.png`) });
    console.log(`Captured product-detail-${w}.png`);
  }

  // 3. Populate Cart
  await page.goto('http://localhost:4173/products/hypril-extended-delay-gel-50ml', { waitUntil: 'networkidle' });
  await page.waitForSelector('button:has-text("ADD TO CART")', { timeout: 10000 });
  await page.click('button:has-text("ADD TO CART")');
  await page.waitForTimeout(1000);

  for (const w of [375, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('http://localhost:4173/cart', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(__dirname, 'screenshots', `cart-${w}.png`) });

    await page.goto('http://localhost:4173/checkout', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(__dirname, 'screenshots', `checkout-${w}.png`) });
    console.log(`Captured cart-${w}.png & checkout-${w}.png with active item`);
  }

  await browser.close();
})();
