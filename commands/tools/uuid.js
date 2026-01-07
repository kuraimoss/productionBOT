module.exports = {
name: "uuid",
cmd: ["uuid"],
category: "tools",
async handler(m, { conn, q, command, args }) {
if (!q) {
m.reply(`${tool.uuid()}`)
}
if (q) {
m.reply(`${tool.isUuid(args[0])}`)
}
}}