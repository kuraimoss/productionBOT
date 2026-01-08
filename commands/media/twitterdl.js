module.exports = {
name: ["twdl","twitter"],
param: "<url>",
cmd: ["twdl","twitter"],
category: "media",
desc: "Download media Twitter/X dari link.",
query: true,
url: true,
async handler(m, { conn, q, args }) {
await ctx.reply(response.wait)
if (TwIdRegex.test(args[0])) {
require("../functions/autodl.js").twDL(args[0], conn, m)
} else {
m.reply("Masukan link twitter yang benar!")
}
}}
