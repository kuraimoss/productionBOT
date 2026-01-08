module.exports = {
name: ["keys"],
param: "<url>",
cmd: ["keys","key"],
category: "search",
desc: "Mengambil password file dari database berdasarkan URL yang diberikan.",
query: true,
async handler(m, {conn, args, prefix, command}){
if (!YtIdRegex.test(args[0])) return m.reply(`Example : ${prefix + command} https://youtu.be/kRQk3lMReJQ?si=jUcPIn1m8CDuNHMt`)
let pasJson = await tool.fetchJson(remote.passwordDbUrl)

let isPas = pasJson.find(v => v.url.includes(args[0].split("?")[0]))
if (isPas == undefined) return m.reply("tidak ditemukan")
m.reply(isPas.password)
}}
