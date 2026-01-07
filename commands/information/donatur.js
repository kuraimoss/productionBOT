module.exports = {
name: "donatur",
cmd: ["donatur"],
category: "information",
async handler(m, { conn }) {
let selainNol = Object.values(users).filter(v => v.donate !== 0)
let sortir = Object.values(selainNol).sort(function (a,b) {
return b.donate - a.donate
})
let totalDonate = selainNol.map(v => v.donate).reduce((a,b) => a + b, 0)
let txtDn = `Total Donasi : Rp ${await tool.formatRupiah(totalDonate.toString())}\n`
let ok = 1
for (let i of sortir) {
txtDn += `\n${ok++}. @${i.id.split("@")[0]} : Rp ${await tool.formatRupiah(i.donate.toString())}`
}
m.reply(txtDn, { withTag: true })
}}