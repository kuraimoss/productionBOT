const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  page.on('request', (req) => {
    const type = req.resourceType();
    if (type === 'xhr' || type === 'fetch') {
      const url = req.url();
      console.log('XHR', req.method(), url);
      const body = req.postData();
      if (body && body.length) console.log('  body:', body.slice(0, 300));
    }
  });

  const target = 'https://www.mobilelegends.com/en/profile/49823518';
  await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('FINAL_URL', page.url());

  await new Promise((r) => setTimeout(r, 12000));
  await browser.close();
})();
