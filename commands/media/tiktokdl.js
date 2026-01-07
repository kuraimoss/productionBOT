module.exports = {
name: ["tiktokdl","ttdl"],
param: "<url>",
cmd: ["tiktokdl","ttdl"],
category: "media",
query: true,
url: true,
async handler(m, { conn, q, args }) {
await m.reply(response.wait)
if (TtIdRegex.test(args[0]) || TtId2Regex.test(args[0])) {
require("../functions/autodl.js").ttDL(args[0], conn, m)
} else {
m.reply("Masukan link tiktok yang benar!")
}
}}