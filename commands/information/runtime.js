module.exports = {
name: "runtime",
cmd: ["runtime","uptime"],
category: "information",
desc: "Menampilkan uptime/runtime bot.",
async handler(m, { conn }) {
m.reply(`${tool.toTimer(process.uptime())}`)
}}
