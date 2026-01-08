module.exports = {
name: ['access','accesscmd'],
cmd: ['access','accesscmd'],
category: 'group',
desc: 'Memberi akses tertentu (mis. antibot/akses command) ke user yang dipilih di grup.',
param: '<tag/reply chat>',
group: true,
admin: true,
async handler(m, {conn, args, prefix, command}) {
await db.read()

if (args[0] === "antibot") {

if (args[1] || m.mentions[0] || m.quoted) {
let phoneNumber = m.quoted ? m.quoted.sender : m.mentions[0] ? m.mentions[0] : args[1].replace(/[^0-9]/g, '') + "@s.whatsapp.net"

if (db.data.group[m.from] == undefined) {
db.data.group[m.from] = { antibot: { status: false, accessList: [] }, ...(command === "accesscmd" ? { accessCmd: [] } : {}) }
} else if (db.data.group[m.from].antibot == undefined) {
db.data.group[m.from].antibot = { status: false, accessList: [] }
} else if (db.data.group[m.from]) {
if (db.data.group[m.from].antibot.accessList == undefined || db.data.group[m.from].accessCmd == undefined) {
db.data.group[m.from].antibot.accessList = []
db.data.group[m.from].accessCmd = []
}
if (db.data.group[m.from].antibot.accessList.includes(phoneNumber) || db.data.group[m.from].accessCmd.includes(phoneNumber)) return m.reply(`*Pengguna @${phoneNumber.split("@")[0]} sebelumnya telah diberi akses${command === "accesscmd" ? " command" : ""}*`, { withTag: true })
if (command === "access") db.data.group[m.from].antibot.accessList.push(phoneNumber)
if (command === "accesscmd") db.data.group[m.from].accessCmd.push(phoneNumber)
}
m.reply(`*Berhasil memberi akses${command === "accesscmd" ? " command" : ""} kepada @${phoneNumber.split("@")[0]} di group ini!*`, { withTag: true })

} else {
return m.reply(`Example:\n- ${prefix + command} ${args[0]} 6288293078789\n- ${prefix + command} ${args[0]} @0`, { withTag: true })
}
} else {
m.reply("List yang tersedia untuk saat ini\n- antibot")
}

await db.write()
}}
