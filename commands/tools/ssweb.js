const puppeteer = require('puppeteer');
const fs = require("fs");

module.exports = {
  name: 'ssweb',
  param: '<url>',
  cmd: ['ssweb'],
  category: 'tools',
  desc: 'Take screenshot webpage',
  query: true,
  url: true,
  async handler(m, {conn, text}){
    await m.reply(response.wait)
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(text);
  await page.screenshot({ path: './temp/creenshot.png', fullPage: false, width: 1024,
  height: 768 });
  await browser.close();
  await conn.sendMessage(m.from, {image: fs.readFileSync("./temp/creenshot.png"), mimetype: 'image/png', fileName: `${text}.png`}, {quoted: m})
  fs.unlinkSync("./temp/creenshot.png")
  }
}
