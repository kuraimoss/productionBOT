module.exports = {
name: "runtime",
cmd: ["runtime","uptime"],
category: "information",
async handler(m, { conn }) {
m.reply(`${tool.toTimer(process.uptime())}`)
}}