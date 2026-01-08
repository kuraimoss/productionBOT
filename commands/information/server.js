const os = require('os');
const fetch = require('node-fetch');

function formatSize(bytes) {
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
if (bytes === 0) return '0 Bytes';
const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function ucword(str) {
return str.replace(/\b\w/g, function(l) {
return l.toUpperCase();
});
}

module.exports = {
name: "server",
cmd: ["server"],
category: "information",
desc: "Menampilkan info server dan detail IP publik (lokasi/ISP).",
async handler(m, { conn }) {
const networkInterfaces = os.networkInterfaces();
const ipAddresses = [];

Object.keys(networkInterfaces).forEach((interfaceName) => {
  networkInterfaces[interfaceName].forEach((iface) => {
    if (iface.family === 'IPv4' && !iface.internal) {
      ipAddresses.push(iface.address);
    }
  });
});

scraper.tools.iplookup(ipAddresses[0]).then(async(json) => {
let caption = "";
caption += `${gatas} OS : ${os.type()} (${os.arch()} / ${os.release()})\n`;
caption += `${gtn} Ram : ${formatSize(os.totalmem() - os.freemem())} / ${formatSize(os.totalmem())}\n`;
for (let key in json.result) if (key !== "status") caption += `${gtn} ${ucword(key)} : ${json.result[key]}\n`;
caption += `${gtn} Uptime : ${tool.toTimer(os.uptime())}\n`;
caption += `${gbawah} Processor : ${os.cpus()[0] ? os.cpus()[0].model : "-"}\n\n`;
m.reply(caption)
})
}}
