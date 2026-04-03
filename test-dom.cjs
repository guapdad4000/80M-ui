const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5180/');
  await page.waitForTimeout(2000);
  
  const layoutInfo = await page.evaluate(() => {
    const auditSec = document.querySelector('#audit');
    const uCurveDiv = auditSec.querySelector('.flex.flex-col.md\\:flex-row');
    const popsicles = uCurveDiv.querySelectorAll(':scope > div');
    
    return {
      windowWidth: window.innerWidth,
      auditSec: auditSec ? auditSec.getBoundingClientRect() : null,
      uCurveDiv: uCurveDiv ? uCurveDiv.getBoundingClientRect() : null,
      uCurveDivClasses: uCurveDiv ? uCurveDiv.className : null,
      popsicles: Array.from(popsicles).map(p => ({
         rect: p.getBoundingClientRect(),
         classes: p.className,
         transform: getComputedStyle(p).transform
      }))
    };
  });
  console.log(JSON.stringify(layoutInfo, null, 2));
  await browser.close();
})();
