const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const watched = new Set();

  page.on('request', (req) => {
    const url = req.url();
    if (url === 'https://sg-api.mobilelegends.com/r') {
      const body = req.postData() || '';
      if (!watched.has(body) && /(49823518|profile|user|role|zone|player)/i.test(body)) {
        watched.add(body);
        console.log('REQ', req.method(), url, 'BODY', body.slice(0, 600));
      }
    }
  });

  page.on('response', async (res) => {
    const url = res.url();
    if (url === 'https://sg-api.mobilelegends.com/r') {
      try {
        const text = await res.text();
        if (/(49823518|profile|user|role|zone|player)/i.test(text)) {
          console.log('RES', res.status(), url, 'TEXT', text.slice(0, 900));
        }
      } catch {}
    }
  });

  const target = 'https://www.mobilelegends.com/en/profile/49823518';
  await page.goto(target, { waitUntil: 'networkidle2', timeout: 60000 });
  console.log('FINAL_URL', page.url());

  await new Promise((r) => setTimeout(r, 8000));
  await browser.close();
})();
