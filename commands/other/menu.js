const fs = require("fs");
const prettyms = require("pretty-ms");
const { showhit } = require("../../database/hit");
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require(packages.baileys)

const toTimer = (seconds) => {
 function pad(s) {
  return (s < 10 ? "0" : "") + s;
 }
 var hours = Math.floor(seconds / (60 * 60));
 var minutes = Math.floor((seconds % (60 * 60)) / 60);
 var seconds = Math.floor(seconds % 60);

 //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
 return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

async function Menu(m, { conn, prefix, cmd, tags, tagse }) {

async function sendPesan(teks) {
let contextInfo = { groupMentions: [{ groupJid: setting.group.id, groupSubject: menuGroupSubject }], isForwarded: true, forwardingScore: 1, forwardedNewsletterMessageInfo: { newsletterJid: setting.saluran.id, serverMessageId: setting.saluran.message.hadiah, newsletterName: `LIHAT SALURAN ${author.toUpperCase()}` }, externalAdReply: {
  sourceUrl: medsos.instagram,
  mediaType: 1,
  thumbnailUrl: medsos.instagram,
  thumbnail: fs.readFileSync(phzack.path),
  title: botName,
  body: `Version: ${setting.version}`,
  renderLargerThumbnail: true
  }}
  const hour = new Date().getHours()
  const waktu =
    hour >= 3 && hour < 5 ? "subuh" :
    hour >= 5 && hour < 11 ? "pagi" :
    hour >= 11 && hour < 15 ? "siang" :
    hour >= 15 && hour < 18 ? "sore" : "malam"
  const salam = [
    "Hai",
    "Halo",
    "Hey",
    "Hii",
    "Yo",
    "Haii"
  ]
  const greet = salam[Math.floor(Math.random() * salam.length)]
  m.reply(
    `${greet}, selamat ${waktu} @${m.sender.split("@")[0]} 💫\n` +
    `Yuk intip menu ${botName} di bawah ini 🐢✨\n` +
    `Gabung juga ke group @${setting.group.id} yaa~\n\n` +
    teks +
    `\n—\n` +
    `Tips: ketik *${prefix}menu <kategori>* untuk lihat menu spesifik.`,
    { contextInfo, withTag: true }
  )
  /*
if (["android","ios"].includes(m.user.device)) {
const ppuser = await conn.profilePictureUrl(m.sender).catch(() => assets.defaultProfilePictureUrl || assets.defaultProfilePicture)
const msg = generateWAMessageFromContent(m.from, { viewOnceMessage: { message: { messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },

  interactiveMessage: proto.Message.InteractiveMessage.create({
  contextInfo,
  
  body: proto.Message.InteractiveMessage.Body.create({
  text: teks
  }),
  
  header: proto.Message.InteractiveMessage.Header.create({
  hasMediaAttachment: true,...(await prepareWAMessageMedia({ document: fs.readFileSync(thumbnail.path), mimetype:"image/jpeg", fileName: `Hi, ${m.isSelf ? global.author : m.pushName.toLowerCase()}`, jpegThumbnail: await tool.resize(ppuser, 300, 300)}, { upload: conn.waUploadToServer }))
  }),
  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
  buttons: [
  {
      name: "cta_url",
      buttonParamsJson: `{"display_text":"(telegram)","url":"${group.telegram}","merchant_url":"${group.telegram}","id":"×÷"}`
  },
  {
      name: 'single_select',
      buttonParamsJson: '{"title":"Click Here",\n' +
        '"sections":[{"title":"# CHOOSE ONE OF THEM",\n' +
        '"highlight_label": "information",\n' +
        '"rows":[{"header":"",\n' +
        '"title":"• STATUS",\n' +
        '"description":"Untuk Melihat Status",\n' +
        '"id":".status"},\n' +
        '{"header":"",\n' +
        '"title":"• DASHBOARD",\n' +
        '"description":"Untuk Melihat Dashhboard",\n' +
        '"id":".dashboard"}]\n' +
        '}]\n' +
        '}'
    },
  ],
  })
  })
  }
  }
  }, { userJid: m.from, quoted: m.isSelf ? { key: { remoteJid: '0@s.whatsapp.net', fromMe: false }, message: { conversation: m.body }} : m })
  await conn.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id
  })
} else if (["web","desktop","unknown"].includes(m.user.device)) {
m.reply(`Hai, @${m.sender.split("@")[0]} Berikut ini adalah daftar menu\n` + teks, { contextInfo, withTag: true })
}
*/
}

let d = new Date(new Date() + 3600000);
let date = d.toLocaleDateString("id", { day: "numeric", month: "long", year: "numeric", });
const hit = Object.values(await showhit()).map((ht) => ht.total);
const total_hit = await eval(hit.join(" + "));

let menu = ``
let numtag = 1
if (tags == "null") {
for (let tag of tagse) {
menu += `\n╭─〔 ${tag.length > 7 ? "" : "MENU "}${tag.toUpperCase()} 〕\n`;
const filt_cmd = cmd.filter((mek) => mek.tag == tag);
const map_cmd = await filt_cmd.map((mek) => mek.name);
for (let j = 0; j < map_cmd.length; j++) {
menu += `│ ${numtag++}. ${prefix}${map_cmd[j]}\n`;
}
menu += `╰──────────────\n`;
}
menu += `\n╭─〔 ADVANCED 〕\n`;
menu += `│ ${numtag++}. >\n`
menu += `│ ${numtag++}. <\n`
menu += `│ ${numtag++}. $\n`
menu += `│ ${numtag++}. =>\n`
menu += `╰──────────────\n`
} else {
menu += `\n╭─〔 ${tags.length > 7 ? "" : "MENU "}${tags.toUpperCase()} 〕\n`;
const filt_cmd = cmd.filter((mek) => mek.tag == tags);
const map_cmd = await filt_cmd.map((mek) => mek.name);
for (let j = 0; j < map_cmd.length; j++) {
menu += `│ ${numtag++}. ${prefix}${map_cmd[j]}\n`;
}
menu += `╰──────────────\n`;

if (tags == "owner") {
menu += `\n╭─〔 ADVANCED 〕\n`;
menu += `│ ${numtag++}. >\n`
menu += `│ ${numtag++}. <\n`
menu += `│ ${numtag++}. $\n`
menu += `│ ${numtag++}. =>\n`
menu += `╰──────────────\n`
}
}

sendPesan(menu)
}

module.exports = {
name: "menu",
param: "<category>",
cmd: ["menu"],
stickCmd: ["auX9iOuSptklvWqmW2ynWtzLZq7lNcvhFTLWIsDxkvQ="],
category: "other",
desc: "Menampilkan daftar menu/fitur bot berdasarkan kategori.",
async handler(m, { conn, prefix, q, args, isCreator }) {
const cmd = [];
Object.values(attr.commands)
.filter((cm) => !cm.disabled && !cm.ignored)
.map((cm) => {
if (Array.isArray(cm.name)) {
for (let i=0; i<cm.name.length; i++) {
cmd.push({
name: `${cm.name[i]}${cm.param ? 
` ${cm.param}` : ""}`,
cmd: [cm.cmd.find(y => y == cm.name[i])],
param: cm.param ? cm.param : false,
tag: cm.category ? cm.category : "Uncategorized",
desc: cm.desc ? cm.desc : '-'
});
}
} else {
cmd.push({
name: `${cm.name}${cm.param ? 
` ${cm.param}` : ""}`,
cmd: cm.cmd,
param: cm.param ? cm.param : false,
tag: cm.category ? cm.category : "Uncategorized",
desc: cm.desc ? cm.desc : '-'
});
}
});

const map_tag = cmd.map((mek) => mek.tag);
const sort_tag = await map_tag.sort();
const tag_data = new Set(sort_tag);
const tagse = [...tag_data];
const tags = q ? tagse.includes(args[0]) ? tagse.find(v => v == args[0]) :  "undefined" : "null"
if (tags == "undefined") {
var mforme = `category "${args[0]}" tidak terdaftar dalam list menu`
for (let tag of tagse) {
if (tag === "xpremiumx") {
if (isCreator) {
mforme += `\n -  ${tag}`
}
} else {
mforme += `\n -  ${tag}`
}
}
return m.reply(mforme)
}
if (tags == "xpremiumx") {
if (isCreator) return Menu(m, { conn, prefix, cmd, tags, tagse })
var mforme = `category "${args[0]}" tidak terdaftar dalam list menu`
for (let tag of tagse) {
if (tag === "xpremiumx") {
if (isCreator) {
mforme += `\n -  ${tag}`
}
} else {
mforme += `\n -  ${tag}`
}
}
return m.reply(mforme)
}
Menu(m, { conn, prefix, cmd, tags, tagse })
}, Menu}
