const prettyms = require("pretty-ms");
module.exports = {
name: "dashboard",
cmd: ["dashboard"],
category: "information",
desc: "Menampilkan statistik command yang paling sering digunakan.",
async handler(m, { conn }) {
const { showhit } = require("../../database/hit");
const hit = await showhit();
const hglobal = Object.values(hit).sort(function (a, b) {
return b.total - a.total;
});
const leng = hglobal.length >= 6 ? 6 : hglobal.length;
dash = `𝗗𝗔𝗦𝗛𝗕𝗢𝗔𝗥𝗗\n\n ${shp}  Frequently used command : \n\n`;
for (let i = 0; i < leng; i++) {
dash += `${gatas} Command : ${hglobal[i].cmd}\n`;
dash += `${gtn} Total : ${hglobal[i].total}\n`;
dash += `${gtn} Success : ${hglobal[i].success}\n`;
dash += `${gtn} Failed : ${hglobal[i].failed}\n`;
dash += `${gbawah} Last Used : ${await prettyms(Date.now() - hglobal[i].timestamp, {
verbose: true,
})}\n\n`;
}
m.reply(dash);
}}
