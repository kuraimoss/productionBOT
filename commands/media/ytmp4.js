module.exports = {
    name: ["ytmp4"],
    param: "<url>",
    cmd: ["ytmp4"],
    category: "media",
    query: true,
    url: true,
    limit: true,
    async handler(m, { conn, q, command }) {
        await m.reply(response.wait)
        let urlt = q.split("|")[0] ? q.split("|")[0] : q
        let quality = q.split("|")[1] ? q.split("|")[1] : "1080"
        let dayt = await scraper.youtube.mp4(urlt, quality)
        if (dayt && dayt.status) {
            conn.sendFileFromUrl(m.from, dayt.download.url, { caption: dayt.metadata.title }, { quoted: m })
        }
}}