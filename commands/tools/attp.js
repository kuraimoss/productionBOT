const { sticker } = require("../../lib/convert");
const moment = require("moment-timezone");

module.exports = {
    name: "attp",
    param: "<text>",
    cmd: ["attp"],
    category: "tools",
    desc: "Membuat stiker teks animasi (ATTP).",
    query: true,
    async handler(m, { conn, text, prefix, command }) {
        const input = String(text || "").trim();
        if (!input) {
            return m.reply(`Example : ${prefix + command} kuraBOT`);
        }
        if (input.length > 200) {
            return m.reply("Teks terlalu panjang, maksimal 200 karakter.");
        }
        const thund = moment.tz("Asia/Jakarta").format("DD/MM/YYYY");
        const wktud = moment.tz("Asia/Jakarta").format("HH:mm:ss");
        const packInfo = {
            packname: setting.packInfo.packname,
            author: getPackAuthor(conn) + `+${m.sender.split("@")[0]}\n ƒ-, d?--d?-¨d?-ýd?-rd?~?d?-ýd?-ñ : ${thund} ${wktud}`,
        };
        try {
            const url = `https://api.xteam.xyz/attp?file&text=${encodeURIComponent(input)}`;
            const buffer = await tool.getBuffer(url);
            const stickerBuff = await sticker(buffer, {
                isImage: true,
                withPackInfo: true,
                packInfo,
                cmdType: "1",
            });
            await conn.sendMessage(m.from, { sticker: stickerBuff }, { quoted: m });
        } catch (e) {
            await m.reply("Gagal membuat stiker ATTP.");
        }
    },
};
