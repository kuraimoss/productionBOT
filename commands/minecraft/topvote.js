module.exports = {
name: "topvote",
param: "<apikey>",
cmd: ["topvote"],
category: "minecraft",
disabled: true,
async handler(m, {conn}) {
let ssE = db.data.servermc.find(v => v.id.includes(m.from))
tool.fetchJson(`https://minecraftpocket-servers.com/api/?object=servers&element=voters&key=${ssE.apikey}&month=current&format=json`).then(res => {
 teks = `\n- TopVote Server -`
let ld = 1
for (let i of res.voters) {
teks += `\n${ld++}. ${i.nickname} - ${i.votes}`
}
teks += `\n`
m.reply(teks)
})
}
}