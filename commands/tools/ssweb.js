const puppeteer = require('puppeteer');
const fs = require("fs");

module.exports = {
  name: 'ssweb',
  param: '<url>',
  cmd: ['ssweb'],
  category: 'tools',
  desc: 'Screenshot halaman website dari URL.',
  query: true,
  async handler(m, {conn, text}){
    await m.reply(response.wait)
    let target = (text || "").trim();
    if (!/^https?:\/\//i.test(target)) {
      if (/^[^\s]+\.[^\s]+$/.test(target)) {
        target = `https://${target}`;
      } else {
        return m.reply("The input must be a url!");
      }
    }
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.goto(target, { waitUntil: "networkidle2", timeout: 60000 });
  await page.reload({ waitUntil: "networkidle2", timeout: 60000 });
  await page.screenshot({ path: './temp/creenshot.png', fullPage: false });
  await browser.close();
  await conn.sendMessage(m.from, {image: fs.readFileSync("./temp/creenshot.png"), mimetype: 'image/png', fileName: `${target}.png`}, {quoted: m})
  fs.unlinkSync("./temp/creenshot.png")
  }
}
