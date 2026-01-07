module.exports = {
name: "getpic",
param: "<reply/mention/number>",
cmd: ["getpic","getpp"],
category: "tools",
limit: true,
async handler(m, { conn, args, prefix, command, q }) {

let isPrivate = false
if (args[0] || m.mentions[0] || m.quoted) {
if (args[0] === "-from") {
let ppuser = await conn.profilePictureUrl(m.from, "image").catch(() => {
isPrivate = true
return "https://zackmans.github.io/media/pp.jpg"
})
conn.sendMessage(m.from, { image: { url: ppuser }, ...(isPrivate ? { caption: "*Foto profile di private*"} : {}) }, { quoted: m })
} else {
let target = q
let phoneNumber = m.quoted ? m.quoted.sender : m.mentions[0] ? m.mentions[0] : target.endsWith("@g.us") ? target : target.replace(/[^0-9]/g, '') + "@s.whatsapp.net"
if (!phoneNumber) return m.reply(`*Format :*\n${prefix}${command} 628xxxx`)

if (!target.endsWith("@g.us")) {
let isOnWhatsApp = await conn.onWhatsApp(phoneNumber);
if (isOnWhatsApp.length === 0) return m.reply('*Nomor tersebut tidak terdaftar di aplikasi WhatsApp.*')
}
let ppuser = await conn.profilePictureUrl(phoneNumber, "image").catch(() => {
isPrivate = true
return "https://zackmans.github.io/media/pp.jpg"
})
conn.sendMessage(m.from, { image: { url: ppuser }, ...(isPrivate ? { caption: "*Foto profile di private*"} : {}) }, { quoted: m })
}
} else {
m.reply(`*Example :*\n- ${prefix + command} <number/reply/mention>\n- ${prefix + command} -from`)
}

}}