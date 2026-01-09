const { sticker } = require("../../lib/convert");
const { fromBuffer } = require("file-type");
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
        const endpoints = [
            (q) => `https://api.xteam.xyz/attp?file&text=${encodeURIComponent(q)}`,
            (q) => `https://api.akuari.my.id/sticker/attp?text=${encodeURIComponent(q)}`,
        ];
        let lastErr = null;
        for (const makeUrl of endpoints) {
            try {
                const url = makeUrl(input);
                let buffer = await tool.getBuffer(url);
                const type = await fromBuffer(buffer);
                if (!type || !/image|gif|webp/.test(type.mime)) {
                    try {
                        const json = JSON.parse(buffer.toString("utf-8"));
                        const nextUrl = json?.result || json?.url;
                        if (nextUrl) {
                            buffer = await tool.getBuffer(nextUrl);
                        }
                    } catch {}
                }
                const stickerBuff = await sticker(buffer, {
                    isImage: true,
                    withPackInfo: true,
                    packInfo,
                    cmdType: "1",
                });
                await conn.sendMessage(m.from, { sticker: stickerBuff }, { quoted: m });
                return;
            } catch (e) {
                lastErr = e;
            }
        }
        await m.reply("Gagal membuat stiker ATTP. Coba lagi nanti.");
    },
};
