module.exports = {
name: 'on',
cmd: ['on'],
category: 'group',
param: '<query>',
group: true,
admin: true,
async handler(m, {conn, args}) {
await db.read()

if (args[0] === "antibot") {

if (db.data.group[m.from] == undefined) {
db.data.group[m.from] = { antibot: { status: true, accessList: [] }, accessCmd: [] }
} else if (db.data.group[m.from].antibot == undefined) {
db.data.group[m.from].antibot = { status: true, accessList: [] }
} else if (db.data.group[m.from]) {
if (db.data.group[m.from].antibot.status) return m.reply("*Fitur antibot sebelumnya sudah aktif kak!*")
db.data.group[m.from].antibot.status = true
}
m.reply("*Berhasil mengaktifkan antibot di group ini!*")

} else {
m.reply("List yang tersedia untuk saat ini\n- antibot")
}

await db.write()
}}