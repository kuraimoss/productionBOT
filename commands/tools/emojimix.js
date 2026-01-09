module.exports = {
    name: "emojimix",
    param: "<emoji+emoji>",
    cmd: ["emojimix"],
    category: "tools",
    desc: "Menggabungkan dua emoji menjadi stiker.",
    query: true,
    async handler(m, { conn, text, prefix, command }) {
        const input = String(text || "").trim();
        const [emoji1, emoji2] = input.split("+").map((v) => v.trim()).filter(Boolean);
        if (!emoji1 || !emoji2) {
            return m.reply(`Example : ${prefix + command} 🙂+😄`);
        }
        let data;
        try {
            data = await scraper.tools.emojimix(emoji1, emoji2);
        } catch (e) {
            return m.reply(String(e));
        }
        if (!data || data.error || !Array.isArray(data.results) || data.results.length === 0) {
            return m.reply("Emoji mix tidak ditemukan.");
        }
        for (const res of data.results) {
            if (!res?.url) continue;
            await conn.sendSticker(m.from, res.url, m).catch(() => {});
        }
    },
};
