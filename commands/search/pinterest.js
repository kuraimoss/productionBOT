const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require(packages.baileys)
const axios = require("axios")

module.exports = {
name: 'pinterest',
param: '<query>',
cmd: ['pinterest','pin','pint'],
category: 'search',
query: true,
async handler(m, {conn, q}){
await m.reply(response.wait)
let result = []
let jum = 1
let jumSuks = 0
let jumFail = 0
let pin = await scraper.media.pinterest(q)
let stats = false

for (let pint of pin) {
await axios.head(pint.url).then(async() => {
stats = true
jumSuks += 1
}).catch(() => {
stats = false
jumFail += 1
})
if (stats) {
result.push({
body: proto.Message.InteractiveMessage.Body.fromObject({
text: pint.title
}),
header: proto.Message.InteractiveMessage.Header.fromObject({
title: `PICTURE ${jum++}`,
hasMediaAttachment: true,
...(await prepareWAMessageMedia({ image: { url: pint.url } }, { upload: conn.waUploadToServer }))
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Get", url: pint.url }) }]
})
})
}
}

const msg = generateWAMessageFromContent(m.from, {
viewOnceMessage: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
},
interactiveMessage: proto.Message.InteractiveMessage.fromObject({
body: proto.Message.InteractiveMessage.Body.fromObject({
text: `*PINTEREST SEARCHING*\n- \`\`\`Searching :\`\`\` \`${q}\`\n- \`\`\`Found :\`\`\` \`${pin.length} picture\`\n- \`\`\`Success :\`\`\` \`${jumSuks} picture\`\n- \`\`\`Failed :\`\`\` \`${jumFail} picture\``,
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
