const fs = require("fs");

module.exports = {
name: ["addcmd","sf"],
param: "<reply code>",
cmd: ["addcommand", "addcmd", "sf"],
category: "owner",
desc: "Menambahkan command/file baru dari pesan yang direply (owner).",
owner: true,
quoted: true,
async handler(m, { conn, q, command }) {
if (!q) throw `where is the text?\n\nexample: ${prefix + command} owner/orangkece.js`
const filename = `./${command == "sf" ? "" : "commands/"}${q}`;
if (m.attribute.isQDocument) {
m.quoted.download(filename).then(() => m.reply(`Succsess add ${command == "sf" ? "file" : "command"} '${filename}'`)).catch(() => m.reply(`Failed add ${command == "sf" ? "file" : "command"} '${filename}'`))
} else {
await fs.writeFileSync(filename, m.quoted.text);
m.reply(`Succsess add ${command == "sf" ? "file" : "command"} '${filename}'`);
}
}}
