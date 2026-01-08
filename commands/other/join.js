module.exports = {
name: "join",
param: "<link group>",
cmd: ["join"],
category: "other",
desc: "Meminta bot join ke grup lewat link undangan (butuh persetujuan owner).",
query: true,
url: true,
async handler(m, { conn, text, args }) {
const { isOwner } = m.attribute
if (!/whatsapp/.test(text) && text.split("whatsapp.com/")[1] == undefined) return m.reply(response.errorlink);

try {
console.log(text.split("/")[3].split(' ')[0].split("?")[0])
const accept = await conn.groupGetInviteInfo(text.split("/")[3].split(' ')[0].split("?")[0])
if (isOwner) {
if (m.type == "templateButtonReplyMessage" && args[2] == "reject") return conn.sendMessage(args[1], {text: `Bot is not accepted by owner to be added to your group\n\n${args[0]}`})
if (m.type == "templateButtonReplyMessage" && args[2] == "accept") await conn.sendMessage(args[1], {text: `Indonesia\nBot berhasil ditambahkan ke group anda\n\n${args[0]}\n\nEnglish\nThe bot has been successfully added to your group`})
const join = await conn.groupAcceptInvite(text.split("/")[3].split(' ')[0].split("?")[0]);
m.reply(`Succsess Join Group ${join}`);
} else {

if (accept.size < 1) return m.reply(`Indonesia\nTidak dapat menambahkan bot ke group anda\n	> _Member group kurang dari 150, untuk menambahkan bot ke group, member group harus >= 150_\n\nEnglish\nUnable to add bot to your group\n	> _Group members are less than 150, to add bots to the group, group members must be >= 150_\n\nFor more information, Join My Group\nhttps://chat.whatsapp.com/GsP0JTrD5wWIjCPpJ1lnMr?mode=ems_copy_t`)

const buttons = [
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "accept",
id: `.join ${args[0]} ${m.sender} accept`
})
},
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "reject",
id: `.join ${args[0]} ${m.sender} reject`
})
},
]

m.reply(`Indonesia\nSilahkan tunggu persetujuan dari owner, Jika pesan ini tidak dibalas maka owner belum menyetujui permintaan anda\n\nEnglish\nPlease wait for approval from the owner, if this message is not replied to then the owner has not approved your request`)

conn.sendMessage(owner[0], { interactiveMessage: {
title: `*REQUEST TO BOT TO GROUP*\n${shp} Name : ${accept.subject}\n${shp} Request : ${m.sender.split("@")[0]}\n${shp} Size : ${accept.size}\n${args[0]}`,
footer: botName,
buttons
}})

}
} catch(e) {
console.log(e)
m.reply('Link Group Not Valid')
}

}}
