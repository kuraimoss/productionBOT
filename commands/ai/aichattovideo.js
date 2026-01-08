module.exports = {
    name: ["aivideo"],
    param: "<query>",
    cmd: ["aivideo"],
    category: "ai",
    desc: "Membuat video dari prompt teks (AI text-to-video).",
    query: true,
    async handler(m, { conn, q }) {
        await m.reply(response.wait)
        const model = setting?.blackbox?.videoModel;
        if (!model) throw new Error("BLACKBOX_VIDEO_MODEL is not set");
        const data = await scraper.ai.chatBlackbox([{ role: "user", content: String(q) }], { model, raw: true });
        const raw = data?.data?.raw;
        const content = raw?.choices?.[0]?.message?.content || data?.data?.answer || "";
        let url = "";
        if (content) {
            try {
                const parsed = JSON.parse(content);
                url = parsed?.url || parsed?.data?.[0]?.url || "";
            } catch {
                const match = String(content).match(/https?:\/\/\S+/i);
                url = match ? match[0] : "";
            }
        }
        if (!url) {
            const detail = raw ? JSON.stringify(raw).slice(0, 800) : String(content).slice(0, 800);
            throw new Error(`Video URL not found in response. Raw: ${detail}`);
        }
        await conn.sendMessage(m.from, { text: String(url).trim() }, { quoted: m });
    }
}
