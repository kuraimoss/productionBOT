module.exports = {
name: ["fbdl","facebook"],
param: "<url>",
cmd: ["fbdl","facebook"],
category: "media",
query: true,
url: true,
async handler(m, { conn, args, command }) {
await m.reply(response.wait)
if (FbIdRegex.test(args[0])) {
require("../functions/autodl.js").fbDL(args[0], conn, m)
} else {
m.reply("Masukan link facebook yang benar!")
}
}}