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
            const body = {
                "voucherPricePoint.id": 6000,
                "voucherPricePoint.price": "",
                "voucherPricePoint.variablePrice": "",
                n: "",
                email: "",
                userVariablePrice: "",
                "order.data.profile": "",
                "user.userId": id,
                "user.zoneId": zone,
                voucherTypeName: "MOBILE_LEGENDS",
                affiliateTrackingId: "",
                impactClickId: "",
                checkoutId: "",
                tmwAccessToken: "",
                shopLang: "in_ID",
            };
            const { data } = await axios.post(
                "https://order-sg.codashop.com/id/validateProfile.action",
                body,
                {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        Accept: "application/json",
                    },
                }
            );
            const nick = data?.confirmationFields?.roles?.[0]?.role;
            if (!nick) {
                const msg = data?.errorMsg || data?.errorCode;
                return m.reply(
                    `ID/Zone tidak ditemukan atau sedang error.${msg ? `\n(${msg})` : ""}`
                );
            }
            return m.reply(`Nickname ML: ${nick}\nID: ${id}\nZone: ${zone}`);
        } catch (e) {
            return m.reply("Gagal cek ID ML. Coba lagi nanti.");
        }
    },
};
