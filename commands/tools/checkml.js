const axios = require("axios");

module.exports = {
    name: "checkml",
    param: "<id>|<zone>",
    cmd: ["checkml", "cekml", "mlid"],
    category: "tools",
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
            const params = new URLSearchParams({
                productId: "1",
                itemId: "2",
                catalogId: "57",
                paymentId: "352",
                gameId: id,
                zoneId: zone,
                product_ref: "REG",
                product_ref_denom: "AE",
            });
            const { data } = await axios.post(
                "https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store",
                params,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Referer: "https://www.duniagames.co.id/",
                        Accept: "application/json",
                    },
                }
            );
            const nick = data?.data?.gameDetail?.userName || data?.data?.gameDetail?.username;
            if (!nick) return m.reply("ID/Zone tidak ditemukan atau sedang error.");
            return m.reply(`Nickname ML: ${nick}\nID: ${id}\nZone: ${zone}`);
        } catch (e) {
            return m.reply("Gagal cek ID ML. Coba lagi nanti.");
        }
    },
};
