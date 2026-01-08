module.exports = {
name: "uuid",
cmd: ["uuid"],
category: "tools",
desc: "Generate UUID baru atau cek apakah UUID yang diberikan valid.",
async handler(m, { conn, q, command, args }) {
if (!q) {
m.reply(`${tool.uuid()}`)
}
if (q) {
m.reply(`${tool.isUuid(args[0])}`)
}
}}
