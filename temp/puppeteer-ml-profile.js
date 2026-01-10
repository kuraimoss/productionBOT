const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  page.on('request', (req) => {
    const url = req.url();
    if (/(moontontech\.com|mobilelegends\.com)\//.test(url) && /(api|profile|user|player)/i.test(url)) {
      console.log('REQ', req.method(), url);
    }
  });

  page.on('response', async (res) => {
    const url = res.url();
    const ct = (res.headers()['content-type'] || '').toLowerCase();
    if (/(moontontech\.com|mobilelegends\.com)\//.test(url) && /(api|profile|user|player)/i.test(url)) {
      console.log('RES', res.status(), ct.split(';')[0], url);
      if (ct.includes('application/json')) {
        try {
          const json = await res.json();
          const snippet = JSON.stringify(json).slice(0, 500);
          console.log('JSON', snippet);
        } catch {}
      }
    }
  });

  const target = 'https://m.mobilelegends.com/en/profile/49823518';
  await page.goto(target, { waitUntil: 'networkidle2', timeout: 60000 });

  // try to find obvious nickname text
  const text = await page.evaluate(() => document.body.innerText.slice(0, 2000));
  console.log('BODY_TEXT_SNIPPET', JSON.stringify(text));

  await browser.close();
})();
