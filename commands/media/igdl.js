module.exports = {
name: ["igdl","instagram"],
param: "<url>",
cmd: ["igdl","instagram"],
category: "media",
desc: "Download media Instagram dari link (post/reels/story yang didukung).",
query: true,
url: true,
async handler(m, { conn, q, args }) {
await m.reply(response.wait)
if (IgIdRegex.test(args[0])) {
require("../functions/autodl.js").igDL(args[0], conn, m)
} else {
m.reply("Masukan link instagram yang benar!")
}
}}
