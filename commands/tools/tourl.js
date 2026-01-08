const fs = require("fs");
async function toUrl(m, conn) {
let hasil = ""
if(!m.quoted && (m.type == 'imageMessage' || m.type == 'videoMessage')){
let tipe = ""
let qutod = m.type
let mtype = m.message[qutod].mimetype
if (qutod == "imageMessage") {
tipe = "." + mtype.split("/")[1]
} else if (qutod == "videoMessage") {
tipe = "." + mtype.split("/")[1]
}
const pathFile = await m.download("./temp/" + await tool.getRandom(tipe))
const tele = await tool.catbox(pathFile)
hasil = tele
await fs.unlinkSync(pathFile)
}
else if(m.quoted && (m.quoted.mtype == 'imageMessage' ||  m.quoted.mtype == 'videoMessage')){
let tipe = ""
let qutod = m.quoted.mtype
let mtype = m.quoted.message[qutod].mimetype
if (qutod == "imageMessage") {
tipe = "." + mtype.split("/")[1]
} else if (qutod == "videoMessage") {
tipe = "." + mtype.split("/")[1]
}
const pathFile = await m.quoted.download("./temp/" + await tool.getRandom(tipe))
const tele = await tool.catbox(pathFile)
hasil = tele
await fs.unlinkSync(pathFile)
}
else if(m.quoted && (m.quoted.mtype == 'documentMessage' || m.quoted.mtype == 'stickerMessage' || m.quoted.mtype == 'audioMessage')){
const upload = await tool.ugu(await m.quoted.download())
if(upload.status != 200) return m.reply('Error : File extension not support')
hasil = upload.result.url
}
return hasil
}

module.exports = {
    name: 'tourl',
    param: '<reply/send image/video>',
    cmd: ['tourl'],
    category: 'tools',
    desc: 'Upload media ke hosting (catbox/ugu) lalu kirim link-nya.',
    async handler(m, {conn}){
let urlnya = await toUrl(m, conn)
m.reply(urlnya)
    }, toUrl
}
