const sharp = require("sharp")
module.exports = {
name: "hd",
param: "<reply/send image>",
cmd: ["hd","sharp","tohd"],
category: "tools",
async handler(m, { conn, args, isQImage, isImage }) {
if (isQImage || isImage) {
await m.reply(response.wait)
try {
const { toUrl } = require("../tools/tourl.js")

toUrl(m, conn).then(async(data) => {
let hasil = await tool.fetchJson(`https://api.vreden.my.id/api/artificial/hdr?url=${data}&pixel=4`)
m.reply(hasil.result.data.downloadUrls)
conn.sendFileFromUrl(m.from, hasil.result.data.downloadUrls[0], {}, { quoted: m })
})
} catch {
let pathHD =  isQImage ? await m.quoted.download("./temp/"+ m.sender +"-hd.jpg") : await m.download("./temp/"+ m.sender +"-hd.jpg")
let tajam = Number(args[0]) ? Number(args[0]) : 1.5
sharp(pathHD)
.resize(2000)
.sharpen(tajam)
.toFile("./temp/"+ m.sender +"-hdoutput.jpg")
.then(info => {
conn.sendMessage(m.from, { image: { url: "./temp/"+ m.sender +"-hdoutput.jpg" }}).then(() => {
fs.unlinkSync("./temp/"+ m.sender +"-hdoutput.jpg")
fs.unlinkSync(pathHD)
})
})
}
} else {
m.reply("Gambarnya mana bang?")
}
}}