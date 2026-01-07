module.exports = {
name: "mcstatus",
param: "<java/bedrock> <address>",
cmd: ["mcstatus","mcstats"],
category: "minecraft",
query: true,
async handler(m, { conn, q, prefix, args, command }) {
if (!args[0]) return m.reply(`Masukan parameters dengan benar\nExample: ${prefix + command} java play.serverkamu.com`) 
if (!args[1]) return m.reply(`Masukan address dengan benar\nExample: ${prefix + command} bedrock play.serverkamu.com:19132`)
const isAddress = args[1]
if (!isAddress.includes(".")) return m.reply(`Masukan address dengan benar\nExample: ${prefix + command} java play.serverkamu.com`)
let format = ""
if (args[0] === "bedrock") {
if (!isAddress.includes(":")) return m.reply(`Masukan address dengan benar\nExample: ${prefix + command} bedrock play.serverkamu.com:19132`)
let port = args[1].split(":")[1]
if (isNaN(port)) return m.reply("port harus berupa angka")
let bs = await tool.fetchJson("https://api.mcstatus.io/v2/status/bedrock/" + args[1])
if (bs.online) {
format = `${gatas} Name : ${bs.motd.raw.split("\n")[0]}\n${gtn} Host : ${bs.host}\n${gtn} Ip : ${bs.ip_address}\n${gtn} Port : ${bs.port}\n${gtn} Version : ${bs.version.name}\n${gtn} Players: ${bs.players.online} / ${bs.players.max}\n${gtn} Mode : ${bs.gamemode}\n${gbawah} Id : ${bs.server_id}`
}
if (!bs.online) {
format = ` Server Offline `
}
m.reply(format)
} else if (args[0] === "java") {
if (":".includes(args[1])) {
let port = args[1].split(":")[1]
if (isNaN(port)) return m.reply("port harus berupa angka")
}
let bs = await tool.fetchJson("https://api.mcstatus.io/v2/status/java/" + args[1])
if (bs.online) {
format = `\n*${shp} Name :* ${bs.motd.clean}\n*${shp} Host :* ${bs.host}\n*${shp} Ip :* ${bs.ip_address}\n*${shp} Port :* ${bs.port}\n*${shp} Version :* ${bs.version.name_clean}\n*${shp} Players:* ${bs.players.online} / ${bs.players.max}\n\n\`List Player:\`\n\`${bs.players.list.map(v => v.name_clean).join(", ")}\`\n`
}
if (!bs.online) {
format = ` Server Offline `
}
m.reply(format)
} else {
m.reply(`Masukan parameters dengan benar\nExample: ${prefix + command} java/bedrock`)
}
}}