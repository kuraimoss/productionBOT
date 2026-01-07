const fs = require("fs");
const path = require("path");

module.exports = {
name: ["getcmd","gf"],
param: "<filename>",
cmd: ["getcommand", "getcmd", "gf"],
category: "owner",
owner: true,
async handler(m, { conn, q, prefix, command }) {
const args = m.body.trim().split(/ +/).slice(1)
if (!q) throw `where is the text?\n\nexample: ${prefix + command} other/menu.js`
if (!(args[0] == "-d" ? args[1] : true)) return m.reply(`where is the text?\n\nexample: ${prefix + command} -d index.js`)

const filename = path.join(__dirname, `${command == "gf" ? "../../" : "../"}${args[0] == "-d" ? args[1] : q}`)
if (!fs.existsSync(filename)) return m.reply(`
'${filename}' not found!`)
let pathFile = args[0] == "-d" ? args[1] : args[0]
let lastSlashIndex = pathFile.lastIndexOf("/")
let fileName = lastSlashIndex !== -1 ? pathFile.substring(lastSlashIndex + 1) : pathFile

if (args[0] == "-d") return conn.sendMessage(m.from, { document: fs.readFileSync(filename), mimetype: "application/javascript", fileName }, { quoted: m })
if (fs.readFileSync(filename, 'utf8').length > setting.maxChunkSize) return conn.sendMessage(m.from, { document: fs.readFileSync(filename), caption: `Maaf teks pesan melebihi batas ${setting.maxChunkSize} karakter, jadi dikirim melalui document`, mimetype: "application/javascript", fileName: fileName }, { quoted: m })
m.reply(fs.readFileSync(filename, 'utf8'))
}}