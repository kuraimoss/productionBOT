const axios = require("axios");

module.exports = {
    name: "checkff",
    param: "<id>",
    cmd: ["checkff", "cekff", "ffid"],
    category: "tools",
    desc: "Cek nickname Free Fire berdasarkan ID.",
    query: true,
    async handler(m, { text, prefix, command }) {
        const id = String(text || "").replace(/\D/g, "");
        if (!id) {
            return m.reply(`Example : ${prefix + command} 1234567890`);
        }
        try {
            const body = {
                "voucherPricePoint.id": 8050,
                "voucherPricePoint.price": "",
                "voucherPricePoint.variablePrice": "",
                n: "",
                email: "",
                userVariablePrice: "",
                "order.data.profile": "",
                "user.userId": id,
                voucherTypeName: "FREEFIRE",
                affiliateTrackingId: "",
                impactClickId: "",
                checkoutId: "",
                tmwAccessToken: "",
                shopLang: "in_ID",
            };
            const { data } = await axios.post(
                "https://order-sg.codashop.com/id/initPayment.action",
                body,
                {
                    headers: {
                        "Content-Type": "application/json; charset/utf-8",
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        Accept: "application/json",
                    },
                }
            );
            const nick = data?.confirmationFields?.roles?.[0]?.role;
            if (!nick) return m.reply("ID tidak ditemukan atau sedang error.");
            return m.reply(`Nickname FF: ${nick}\nID: ${id}`);
        } catch (e) {
            return m.reply("Gagal cek ID FF. Coba lagi nanti.");
        }
    },
};
