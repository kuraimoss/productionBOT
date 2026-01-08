module.exports = {
name: 'stickersearch',
param: '<query>',
cmd: ['ssearch', 'sticksearch', 'stickersearch'],
category: 'search',
desc: 'Mencari sticker berdasarkan keyword dan menampilkan pilihan hasilnya.',
query: true,
async handler(m, {conn, text}){
await m.reply(response.wait)

try {
const dt = await xzons.StickerSearch(text)

if (dt.status == 200) {
let Teks = `*STICKER SEARCHING*\n- Search : ${text}\n- Total Amount : ${dt.sticker_url.length}\n- Title : ${dt.title}`
let row = []
let jum = 1

for (let i of dt.sticker_url) {
row.push({
header: /.webp/.test(i) ? "WEBP FILE TYPE" : /.png/.test(i) ? "PNG FILE TYPE" : /.gif/.test(i) ? "GIF FILE TYPE" : /.jpg/.test(i) ? "JPG FILE TYPE" : /.jpeg/.test(i) ? "JPEG FILE TYPE" : "VIDEO FILE TYPE",
title: `STICKER ${jum++}`,
description: i,
id: `.getmstick ${i}`
})
}

conn.sendMessage(m.from, { interactiveMessage: {
title: Teks,
buttons: [
{
name: 'single_select',
buttonParamsJson: JSON.stringify({
title: "Click Here",
sections: [{
title: "# CHOOSE ONE OF THEM",
highlight_label: "sticker search",
rows: row
}]
})
},
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "Next",
id: `.ssearch ${text}`
})
}],
}}, { quoted: m });
}

} catch {
m.reply('Sticker not found!')
}
}
}
