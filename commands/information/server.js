const os = require('os');

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

if (!ipAddresses[0]) {
  let caption = "";
  caption += `${gatas} OS : ${os.type()} (${os.arch()} / ${os.release()})\n`;
  caption += `${gtn} Ram : ${formatSize(os.totalmem() - os.freemem())} / ${formatSize(os.totalmem())}\n`;
  caption += `${gtn} Uptime : ${tool.toTimer(os.uptime())}\n`;
  caption += `${gtn} IP Lokal : -\n`;
  caption += `${gbawah} Processor : ${os.cpus()[0] ? os.cpus()[0].model : "-"}\n\n`;
  caption += `${shp} Info IP publik tidak tersedia.\n`;
  return m.reply(caption)
}

let json = null;
let ipError = null;
try {
  json = await scraper.tools.iplookup(ipAddresses[0]);
} catch (e) {
  ipError = e?.message || String(e);
}
let caption = "";
caption += `${gatas} OS : ${os.type()} (${os.arch()} / ${os.release()})\n`;
caption += `${gtn} Ram : ${formatSize(os.totalmem() - os.freemem())} / ${formatSize(os.totalmem())}\n`;
caption += `${gtn} IP Lokal : ${ipAddresses.join(", ")}\n`;
if (json?.result) {
  for (let key in json.result) if (key !== "status") caption += `${gtn} ${ucword(key)} : ${json.result[key]}\n`;
} else {
  caption += `${gtn} IP Publik : tidak tersedia (${ipError || "unknown"})\n`;
}
caption += `${gtn} Uptime : ${tool.toTimer(os.uptime())}\n`;
caption += `${gbawah} Processor : ${os.cpus()[0] ? os.cpus()[0].model : "-"}\n\n`;
return m.reply(caption)
}}
