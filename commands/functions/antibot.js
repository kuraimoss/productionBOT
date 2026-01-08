const captcha = require('trek-captcha')
const fs = require("fs")
module.exports = {
name: "antibot",
antibot: true,
function: true,
desc: "Fungsi antibot: verifikasi captcha untuk mencegah pesan dari bot/spam (block/kick).",
async handler(m, { conn, isBotAdmin, isAdmin, isCreator, command }) {
await db.read()
if (m.attribute.isBot) {
if (setting.auto.blockbot) {
if (!m.isGroup) {
if (!isCreator) {
let isVerify = Object.keys(conn.verify).includes(m.sender)
if (isVerify && m.quoted && m.quoted.key.id === conn.verify[m.sender].id) {
if (m.body.toLowerCase() === conn.verify[m.sender].token) {
delete conn.verify[m.sender]
m.reply("*Berhasil memverifikasi diri kamu bahwa kamu bukan robot*")
db.data.accessCmd.push(m.sender)
await db.write()
} else {
m.reply("*Kode captcha yang anda masukan salah silahkan ulangi jika benar*")
}
}
if (!db.data.accessCmd.includes(m.sender)) {
let blockList = await conn.fetchBlocklist()
if (!db.data.antibot.includes(m.sender)) {
if (conn.verify[m.sender] == undefined) {

setTimeout(async() => {
if (conn.verify[m.sender]) {
delete conn.verify[m.sender]
if (!blockList.includes(m.sender)) {
conn.updateBlockStatus(m.sender, 'block').then(() => conn.sendMessage(owner[0], { text: `Pengguna @${m.sender.split("@")[0]} telah diblockir karena terdeteksi pesan yang dikirim melalui bot`, mentions: [m.sender] }, { quoted: m })).catch((e) => conn.sendMessage(owner[0], { text: String(e) }, { quoted: m }))
}
}
}, 32000)

let { token, buffer } = await captcha()
fs.createWriteStream('./temp/'+ m.sender +'-verify.jpg').on('finish', () => {
conn.sendMessage(m.from, { image: { url: "./temp/" + m.sender + "-verify.jpg" }, caption: `\`\`\`Hai @${m.sender.split("@")[0]} verifikasi diri kamu bahwa kamu bukan robot, reply pesan ini dengan kode captcha di gambar\`\`\`

\`dalam waktu 30 detik jika tidak verifikasi kamu akan diblockir karena terdeteksi bahwa kamu robot\``, mentions: [m.sender] }, { quoted: m }).then((dt) => {
conn.verify[m.sender] = { id: dt.key.id, token: token }
fs.unlinkSync("./temp/"+ m.sender +"-verify.jpg")
})
})
.end(buffer)

}
}
}
}
}
}

if (m.isGroup && db.data.group[m.from]) {
let isVerify = Object.keys(conn.verify).includes(m.sender)
if (isVerify && m.quoted && m.quoted.key.id === conn.verify[m.sender].id) {
if (m.body.toLowerCase() === conn.verify[m.sender].token) {
delete conn.verify[m.sender]
m.reply("*Berhasil memverifikasi diri kamu bahwa kamu bukan robot*")
if (db.data.group[m.from].accessCmd == undefined) db.data.group[m.from].accessCmd = []
db.data.group[m.from].accessCmd.push(m.sender)
await db.write()
} else {
m.reply("*Kode captcha yang anda masukan salah silahkan ulangi jika benar*")
}
}
let aksesList = [...(db.data.group[m.from].antibot ? db.data.group[m.from].antibot.accessList : [])]
let aCmd = db.data.group[m.from].accessCmd ? db.data.group[m.from].accessCmd : []
for (let i of aCmd) {
if (!aksesList.includes(i)) aksesList.push(i)
}
if (db.data.group[m.from].antibot == undefined || !db.data.group[m.from].antibot.status) {
if (!isCreator) {
if (!aksesList.includes(m.sender)) {
let blockList = await conn.fetchBlocklist()
if (conn.verify[m.sender] == undefined) {

setTimeout(async() => {
if (conn.verify[m.sender]) {
delete conn.verify[m.sender]
if (!blockList.includes(m.sender)) {
conn.updateBlockStatus(m.sender, 'block').then(() => {
conn.sendMessage(owner[0], { text: `Pengguna @${m.sender.split("@")[0]} telah diblockir karena terdeteksi pesan yang dikirim melalui bot`, mentions: [m.sender] }, { quoted: m })
conn.sendMessage(m.from, { text: `Pengguna @${m.sender.split("@")[0]} telah diblockir karena terdeteksi pesan yang dikirim melalui bot`, mentions: [m.sender] }, { quoted: m })
}).catch((e) => conn.sendMessage(owner[0], { text: String(e) }, { quoted: m }))
}
}
}, 32000)

let { token, buffer } = await captcha()
fs.createWriteStream('./temp/'+ m.sender +'-verify.jpg').on('finish', () => {
conn.sendMessage(m.from, { image: { url: "./temp/" + m.sender + "-verify.jpg" }, caption: `\`\`\`Hai @${m.sender.split("@")[0]} verifikasi diri kamu bahwa kamu bukan robot, reply pesan ini dengan kode captcha di gambar\`\`\`

\`dalam waktu 30 detik jika tidak verifikasi kamu akan diblockir karena terdeteksi bahwa kamu robot\``, mentions: [m.sender] }, { quoted: m }).then((dt) => {
conn.verify[m.sender] = { id: dt.key.id, token: token }
fs.unlinkSync("./temp/"+ m.sender +"-verify.jpg")
})
})
.end(buffer)

}
}
}
}
if (db.data.group[m.from]?.antibot?.status) {
if (isBotAdmin) {
if (!isAdmin) {
if (!isCreator) {
if (!aksesList.includes(m.sender)) {
const mdata = await conn.groupMetadata(m.from);
const plist = mdata.participants.map((pe) => pe.id);
if (!plist.includes(m.sender)) return;
if (conn.verify[m.sender] == undefined) {

setTimeout(async() => {
if (conn.verify[m.sender]) {
if (!plist.includes(m.sender)) return;
await m.reply(`Pengguna @${m.sender.split("@")[0]} akan dikick karena terdektesi pesan yang terikirim dari bot`, { withTag: true });
delete conn.verify[m.sender]
conn.groupParticipantsUpdate(m.from, [m.sender], "remove").catch((e) => m.reply(String(e)))
}
}, 32000)

let { token, buffer } = await captcha()
fs.createWriteStream('./temp/'+ m.sender +'-verify.jpg').on('finish', () => {
conn.sendMessage(m.from, { image: { url: "./temp/" + m.sender + "-verify.jpg" }, caption: `\`\`\`Hai @${m.sender.split("@")[0]} verifikasi diri kamu bahwa kamu bukan robot, reply pesan ini dengan kode captcha di gambar\`\`\`

\`dalam waktu 30 detik jika tidak verifikasi kamu akan dikick karena terdeteksi bahwa kamu robot\``, mentions: [m.sender] }, { quoted: m }).then((dt) => {
conn.verify[m.sender] = { id: dt.key.id, token: token }
fs.unlinkSync("./temp"+ m.sender +"-verify.jpg")
})
})
.end(buffer)

}
}
}
}
}
}
}
}
}}
