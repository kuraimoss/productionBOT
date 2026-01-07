const moment = require('moment-timezone')
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("@zackmans/baileys")
module.exports = {
name: 'listgroup',
cmd: ['listgroup'],
category: 'owner',
desc: 'Get listgroup On the Bot Account',
owner: true,
async handler(m, {conn}){
let result = []
const getGroups = await conn.groupFetchAllParticipating()
const groups = Object.values(getGroups)

for (let i of groups) {
result.push({
body: proto.Message.InteractiveMessage.Body.fromObject({
text: `- Owner : ${i.owner != undefined ? i.owner.split('@')[0] : '-'}\n- Created : ${moment(i.creation * 1000).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss')}\n- ID : ${i.id}\n- Member : ${i.participants.length}`
}),
header: proto.Message.InteractiveMessage.Header.fromObject({
title: i.subject,
hasMediaAttachment: true,
...(await prepareWAMessageMedia({ image: { url: await conn.profilePictureUrl(i.id, "image").catch(() => {
return "https://zackmans.github.io/media/pp.jpg"
}) } }, { upload: conn.waUploadToServer }))
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{ name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: "Copy ID", copy_code: i.id, id: "gc-" + i.id}) }]
})
})
}
const msg = generateWAMessageFromContent(m.from, {
viewOnceMessage: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2,
},
interactiveMessage: proto.Message.InteractiveMessage.fromObject({
body: proto.Message.InteractiveMessage.Body.fromObject({
text: `*LIST GROUP CHAT*\n- Total Group : \`${groups.length}\``,
}),
header: proto.Message.InteractiveMessage.Header.fromObject({
hasMediaAttachment: false
}),
carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
cards: result
})
})
}
}
}, { quoted: m })
await conn.relayMessage(msg.key.remoteJid, msg.message, {
messageId: msg.key.id
})
}}