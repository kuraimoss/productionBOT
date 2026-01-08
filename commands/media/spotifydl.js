module.exports = {
name: ["spotifydl","spdl"],
param: "<url>",
cmd: ["spotifydl","spdl"],
category: "media",
desc: "Download audio Spotify dari link track.",
query: true,
url: true,
async handler(m, { conn, q, args }) {
await m.reply(response.wait)
if (SpotifyTrRegex.test(args[0])) {
require("../functions/autodl.js").sptfyDL(args[0], conn, m)
} else {
m.reply("Masukan link spotify yang benar!")
}
}}
