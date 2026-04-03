const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  const elementsCenter = await page.evaluate(() => {
    const rects = [];
    document.querySelectorAll('.flex.flex-col.md\\:flex-row.justify-center.items-center.md\\:items-start.gap-6.md\\:gap-4.lg\\:gap-12.z-20 > div').forEach(el => {
      const rect = el.getBoundingClientRect();
      rects.push({ x: rect.x, y: rect.y, width: rect.width, transform: getComputedStyle(el).transform });
    });
    return rects;
  });
  console.log("3 Popsicles rects:", elementsCenter);
  await browser.close();
})();
