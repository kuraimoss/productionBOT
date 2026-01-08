module.exports = {
name: 'off',
cmd: ['off'],
category: 'group',
desc: 'Menonaktifkan fitur grup (saat ini: antibot).',
param: '<query>',
group: true,
admin: true,
async handler(m, {conn, args}) {
await db.read()

if (args[0] === "antibot") {

if (db.data.group[m.from] == undefined) {
db.data.group[m.from] = { antibot: { status: false, accessList: [] }, accessCmd: [] }
} else if (db.data.group[m.from].antibot == undefined) {
db.data.group[m.from].antibot = { status: false, accessList: [] }
} else if (db.data.group[m.from]) {
if (!db.data.group[m.from].antibot.status) return m.reply("*Fitur antibot sebelumnya sudah nonaktif kak!*")
db.data.group[m.from].antibot.status = false
}
m.reply("*Berhasil menonaktifkan antibot di group ini!*")

} else {
m.reply("List yang tersedia untuk saat ini\n- antibot")
}

await db.write()
}}
