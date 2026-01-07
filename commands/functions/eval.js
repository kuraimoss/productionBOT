/**
  # Created By ZackMans
  # https://youtube.com/@BuildTheCraft
  # https://github.com/ZackMans
*/
const fs = require("fs");
const { exec } = require("child_process");

module.exports = {
name: "eval",
function: true,
category: "owner",
async handler(m, { conn, chats, budy, body, prefix, args, command, isCreator, q, msg, resetLimit }) {
//if (body.startsWith('> while')) return
if (body.startsWith('>')) {
if (!isCreator) return
try {
if (body.slice(2).includes("process")) return m.reply("Hayolo ngapain?")
let evaled = await eval(body.slice(2))
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await m.reply(evaled)
} catch (err) {
m.reply(String(err))
}
}
if (body.startsWith('<')) {
if (!isCreator) return
try {
let evald = await eval(body.slice(2))
let evaled = JSON.stringify(evald, null, `\t`)
return m.reply(evaled)
} catch (e) {
m.reply(String(e))
}
}
if (body.startsWith('=>')) {
if (!isCreator) return
try {
let evaled = await eval(`(async() => { ${body.slice(2)} })()`)
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await m.reply(evaled)
} catch (err) {
m.reply(String(err))
}
}
if (body.startsWith('$')) {
if (!isCreator) return
if (!body.slice(2)) return
exec(body.slice(2), (err, stdout) => {
if(err) return m.reply(String(err))
if (stdout) return m.reply(stdout)
})
}
}}