const { exec } = require("child_process");

module.exports = {
name: "disk",
cmd: ["disk"],
category: "information",
async handler(m, { conn }) {
exec('cd && du -h --max-depth=1', (err, stdout) => {
if (err) return m.reply(String(err))
if (stdout) return m.reply(stdout)
})
}}