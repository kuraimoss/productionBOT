module.exports = {
name: "listonline",
cmd: ["listonline", "listaktif"],
category: "group",
desc: "Get List Online",
group: true,
async handler(m, { conn, args }) {
let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.from
let online = [...Object.keys(conn.presences[id])]
let liston = 1
m.reply('`LIST ONLINE :`\n' + online.map(v => `${liston++}. @` + v.replace(/@.+/, '')).join`\n`, { withTag: true })
}}