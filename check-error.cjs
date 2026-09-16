const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  try {
    await page.goto('https://mente-libre-ten.vercel.app/', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('mente-libre-user', JSON.stringify({ nickname: 'test', avatar: '😎' }));
    });
    console.log("Logged in locally, going to /app/feed");
    await page.goto('https://mente-libre-ten.vercel.app/app/feed', { waitUntil: 'networkidle0' });
    console.log("Page loaded successfully.");
  } catch (err) {
    console.log("Navigation error:", err);
  }

  await browser.close();
})();
