const { generateWAMessageFromContent, proto } = require("@zackmans/baileys")

module.exports = {
name: 'bc',
param: '<text/reply>',
cmd: ['bc','bcset'],
category: 'owner',
owner: true,
quoted: "Reply to the message you want to broadcast",
async handler(m, {conn, command, q}){

if (command === "bcset") {
let bcJson = JSON.parse(q)
if (typeof bcJson === "object") {
let getJidGroup = await conn.groupFetchAllParticipating()
let jidGroup = Object.entries(getJidGroup).slice(0).map(entry => entry[1])
let jidGrup = jidGroup.map(v => v.id)

let fbr = { key: { fromMe: false, remoteJid: `0@s.whatsapp.net` }, message: { locationMessage: { degreesLatitude: 0, degreesLongitude: 0, jpegThumbnail: await tool.resize(logo.path, 200, 200) }}}

if (setting.broadcast) return m.reply("Bot sedang melakukan broadcast, mohon menunggu!")
m.reply(`Mengirim Broadcast Ke ${jidGrup.length} Group Chat, Waktu Selesai ${jidGrup.length * 7} detik`).then(res => global.setting.broadcast = true)

for (let i of jidGrup) {
gcMetadata = await conn.groupMetadata(i)
partcipant = await gcMetadata.participants
if (!gcMetadata.announce) {
await tool.sleep(7000)
conn.sendMessage(i, {forward: bcJson.result, contextInfo: {mentionedJid: [...(["ht","htfr"].includes(bcJson.type) ? partcipant.map(a => a.id) : [])], isForwarded: true, forwardingScore: 1, forwardedNewsletterMessageInfo: { newsletterJid: setting.saluran.id, serverMessageId: setting.saluran.message.hadiah, newsletterName: `${author.toUpperCase()} - BROADCAST` }}}, {...(["fr","htfr"].includes(bcJson.type) ? { quoted: fbr } : {})})
}
}

m.reply(`Sukses Mengirim Broadcast Ke ${jidGrup.length} Group`).then(res => global.setting.broadcast = false)
}
} else if (command === "bc") {
let buttonParamsJson = {
"title": "Click Here",
"sections": [
{
"title": "# CHOOSE ONE OF THEM",
"highlight_label": "Broadcast",
"rows": [
{
"header": "",
"title": "• HIDETAG",
"description": "Untuk Broadcast Hidetag",
"id": `.bcset {"type": "ht","result":${JSON.stringify(m.quoted.fakeObj)} }`
},
{
"header": "",
"title": "• HIDETAG + FAKEREPLY",
"description": "Untuk Broadcast Hidetag + Fakereply",
"id": `.bcset {"type":"htfr","result":${JSON.stringify(m.quoted.fakeObj)} }`
},
{
"header": "",
"title": "• FAKEREPLY",
"description": "Untuk Broadcast Fakereply",
"id": `.bcset {"type":"fr","result":${JSON.stringify(m.quoted.fakeObj)}}`
},
{
"header": "",
"title": "• NORMAL",
"description": "Untuk Broadcast Normal",
"id": `.bcset {"type":"normal","result":${JSON.stringify(m.quoted.fakeObj)}}`
}
]
}
]
}

const msg = generateWAMessageFromContent(m.from, { viewOnceMessage: { message: { messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },

interactiveMessage: proto.Message.InteractiveMessage.create({
body: proto.Message.InteractiveMessage.Body.create({
text: "Kamu mau pilih broadcast hidetag atau yang mana? coba kamu pilih salah satu, klik tombol dibawah ini"
}),

nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: [
{
name: 'single_select',
buttonParamsJson: JSON.stringify(buttonParamsJson)
},
],
})
})
}
}
}, { userJid: m.from, quoted: m.isSelf ? { key: { remoteJid: '0@s.whatsapp.net', fromMe: false }, message: { conversation: m.body }} : m })
await conn.relayMessage(msg.key.remoteJid, msg.message, {
messageId: msg.key.id
})
}

}}
