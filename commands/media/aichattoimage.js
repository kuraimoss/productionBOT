module.exports = {
name: ["aichattoimage","aictimage","dalle"],
param: "<query>",
cmd: ["aichattoimage","aictimage","aicreateimage","dalle"],
category: "media",
query: true,
async handler(m, { conn, q, args }) {
await m.reply(response.wait)
scraper.ai.chatToImage(q).then((data) => conn.sendMessage(m.from, { image: { url: data.result }}, { quoted: m }))
}}