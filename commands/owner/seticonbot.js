const jimp = require('jimp')

module.exports = {
name: "seticonbot",
param: "<reply/image>",
cmd: ["seticonbot","setppbot","changeprofilebot"],
category: "owner",
desc: "Mengubah foto profil bot dari gambar yang direply/dikirim (owner).",
owner: true,
spam: true,
async handler(m, { conn, args, isMedia, isQImage }) {
const generateProfilePicture = async(buffer) => {
const jimp_1 = await jimp.read(buffer);
const resz = jimp_1.getWidth() > jimp_1.getHeight() ? jimp_1.resize(550, jimp.AUTO) : jimp_1.resize(jimp.AUTO, 650)
const jimp_2 = await jimp.read(await resz.getBufferAsync(jimp.MIME_JPEG));
return {
img: await resz.getBufferAsync(jimp.MIME_JPEG)
}
}
if (isMedia || isQImage) {
const media = isQImage ? await m.quoted.download('./temp/cppbot.jpeg') : await m.download('./temp/cppbot.jpeg');
if (args[0] == '\'panjang\'') {
var { img } = await generateProfilePicture('./temp/cppbot.jpeg')
await conn.query({
tag: 'iq',
attrs: {
to: "@s.whatsapp.net",
type:'set',
xmlns: 'w:profile:picture'
},
content: [
{
tag: 'picture',
attrs: { type: 'image' },
content: img
}
]
})
m.reply(`Sukses`).then(e => require('fs').unlinkSync('./temp/cppbot.jpeg'))
} else {
await conn.updateProfilePicture(conn.user.id.split(':')[0] + '@s.whatsapp.net', { url: './temp/cppbot.jpeg' })
m.reply(`Sukses`).then(e => require('fs').unlinkSync('./temp/cppbot.jpeg'))
}
} else {
m.reply('Reply/send image message with caption #changeprofilebot')
}
},
};
