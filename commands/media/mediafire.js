module.exports = {
name: ["mediafire"],
param: "<url>",
cmd: ["mediafire"],
category: "media",
desc: "Download file MediaFire dari link (akan menolak jika ukuran terlalu besar).",
query: true,
url: true,
async handler(m, { conn, q, command, args }) {
await m.reply(response.wait)
let result = await scraper.media.mediafire(q)
if (result.status) {
require("axios").head(result.link).then(async(d) => {
if (d.headers["content-length"] < 49000000) {
await m.reply("File telah ditemukan.. System sedang mengirim..")
conn.sendMessage(m.from, { document: { url: result.link }, mimetype: result.mimetype, file_name: result.filename }, { quoted: m })
} else {
m.reply("File size melebihi 50mb\n" + result.link)
}
})
} else {
m.reply("File tidak ada, coba cek linknya")
}
}}
