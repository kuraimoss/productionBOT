const { sticker } = require("../../lib/convert");
const moment = require('moment-timezone');
const fs = require("fs");
const {
    modStick,
    createExif
} = require("../../lib/exif2");
module.exports = {
    name: 'getmedia',
    cmd: ['getmedia','getmstick'],
    category: 'media',
    desc: "Mengambil media dari URL, atau membuat stiker dari URL (getmstick).",
    url: true,
    async handler(m, {conn, command, text}){
        if (command == "getmstick") {
            thund = moment.tz("Asia/Jakarta").format("DD/MM/YYYY")
            wktud = moment.tz("Asia/Jakarta").format("HH:mm:ss")
            packInfo = { packname: setting.packInfo.packname, author: getPackAuthor(conn) + `+${m.sender.split("@")[0]}\n ▸ 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 : ${thund} ${wktud}` };
            let typeM = "";
            if (/.webp/.test(text)) {
                let buffer = await tool.getBuffer(text)
                let pathFile = "./temp/" + await tool.getRandom(".webp")
                let media = await fs.promises.writeFile(pathFile, buffer);
                await createExif(packInfo.packname, packInfo.author);
                return modStick(pathFile, conn, m, m.from);
            } else if (/.png/.test(text) || /.jpeg/.test(text) || /.jpg/.test(text)) {
                typeM = "isImage"
            } else {
                typeM = "isVideo"
            }
            const stickerBuff = await sticker(await tool.getBuffer(text), {
                [typeM]: true,
                withPackInfo: true,
                packInfo,
                cmdType: "1"
            });
            await conn.sendMessage(m.from, {sticker: stickerBuff}, {quoted: m})
        } else if (command == "getmedia") {
            try {
                await conn.sendFileFromUrl(m.from, text, {}, {quoted: m})
            } catch {
                await conn.sendFile(m.from, text, '', m)
            }
        }
    }
}
