const fs = require("fs");
const path = require("path");

module.exports = {
name: ["delcmd","df"],
param: "<filename>",
cmd: ["delcommand", "delcmd", "df"],
category: "owner",
owner: true,
async handler(m, { conn, q, prefix, command }) {
if (!q) throw `where is the text?\n\nexample: ${prefix + command} other/menu.js`

const filename = path.join(__dirname, `${command == "df" ? "../../" : "../"}${q}`)
if (!fs.existsSync(filename)) return m.reply(`
'${filename}' not found!`)
fs.unlinkSync(filename);

m.reply(`Successfully deleted the file '${filename}'`);
}}