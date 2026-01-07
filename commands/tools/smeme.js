const {sticker} = require("../../lib/convert");
const moment = require('moment-timezone');
const encodeurl = require('encodeurl')
module.exports = {
    name: 'smeme',
    param: '<reply/send image>',
    cmd: ['smeme'],
    category: 'tools',
    query: 'Wrong Format\nExample : .smeme Test|oke',
    limit: 3,
    async handler(m, {conn, q}){
        text = q.replace(/\?/g, '')
        thund = moment.tz("Asia/Jakarta").format("DD/MM/YYYY")
        wktud = moment.tz("Asia/Jakarta").format("HH:mm:ss")
        let t1 = await encodeurl(text.split('|')[1] ? text.split('|')[1] : '_')
        let t2 = await encodeurl(text.split('|')[0] ? text.split('|')[0] : '_')
        if(m.quoted && (m.quoted.mtype == 'stickerMessage' || m.quoted.mtype == 'imageMessage')){
            await m.reply(response.wait)
            const upload = await tool.ugu(await m.quoted.download())
            packInfo = { packname: setting.packInfo.packname, author: setting.packInfo.author + `+${m.sender.split("@")[0]}\n ▸ 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 : ${thund} ${wktud}` };
            const url = await encodeurl(`https://api.memegen.link/images/custom/${t1}/${t2}.png?background=${upload.result.url}`)
            const stickerBuff = await sticker(await tool.getBuffer(url), {
                isImage: true,
                withPackInfo: true,
                packInfo,
                cmdType: "1"
            });
            await conn.sendMessage(m.from, {sticker: stickerBuff}, {quoted: m})
        }
        else if(!m.quoted && (m.type == 'stickerMessage' || m.type == 'imageMessage')){
            await m.reply(response.wait)
            const upload = await tool.ugu(await m.download())
            packInfo = { packname: setting.packInfo.packname, author: setting.packInfo.author + `+${m.sender.split("@")[0]}\n ▸ 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 : ${thund} ${wktud}` };
            const stickerBuff = await sticker(await tool.getBuffer(`https://api.memegen.link/images/custom/${t1}/${t2}.png?background=${upload.result.url}`), {
                isImage: true,
                withPackInfo: true,
                packInfo,
                cmdType: "1"
            });
            await conn.sendMessage(m.from, {sticker: stickerBuff}, {quoted: m})
        }
        else m.reply('reply/send image')
    }
}
