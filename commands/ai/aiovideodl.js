module.exports = {
name: ["aiovideodl","aio"],
param: "<url>",
cmd: ["aiovideodl","aiovdl","aio"],
category: "ai",
desc: "Download video dari berbagai platform (IG/FB/Twitter/X/TikTok) lewat link.",
query: true,
url: true,
async handler(m, { conn, q, args }) {
await m.reply(response.wait)
if (IgIdRegex.test(m.body) || FbIdRegex.test(m.body) || TwIdRegex.test(m.body) || TtIdRegex.test(m.body) || TtId2Regex.test(m.body)) {
require("../functions/autodl.js").aiovDL(args[0], conn, m)
} else {
m.reply("Link tidak support")
}
}}
