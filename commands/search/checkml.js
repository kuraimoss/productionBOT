const axios = require("axios");
const { randomUUID } = require("crypto");

module.exports = {
    name: "checkml",
    param: "<id>|<zone>",
    cmd: ["checkml", "cekml", "mlid"],
    category: "search",
    desc: "Cek nickname Mobile Legends berdasarkan ID dan Zone.",
    query: true,
    async handler(m, { text, prefix, command }) {
        const raw = String(text || "").trim();
        const parts = raw.includes("|") ? raw.split("|") : raw.split(/\s+/);
        const id = (parts[0] || "").replace(/\D/g, "");
        const zone = (parts[1] || "").replace(/\D/g, "");
        if (!id || !zone) {
            return m.reply(`Example : ${prefix + command} 123456789|1234`);
        }
        try {
            const { data } = await axios.post(
                "https://order-sg.codashop.com/validate",
                {
                    country: "ID",
                    voucherTypeName: "MOBILE_LEGENDS",
                    whiteLabelId: "0",
                    deviceId: randomUUID(),
                    userId: id,
                    zoneId: zone,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        Accept: "application/json",
                    },
                }
            );
            const nick = data?.result?.username;
            if (!nick) return m.reply("ID/Zone tidak ditemukan atau sedang error.");
            return m.reply(`Nickname ML: ${nick}\nID: ${id}\nZone: ${zone}`);
        } catch (e) {
            return m.reply("Gagal cek ID ML. Coba lagi nanti.");
        }
    },
};
