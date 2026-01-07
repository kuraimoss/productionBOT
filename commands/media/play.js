const id3 = require("node-id3")
module.exports = {
    name: ["play"],
    param: "<query>",
    cmd: ["play"],
    category: "media",
    query: true,
    limit: true,
    async handler(m, { conn, q, command }) {
        await m.reply(response.wait)
        let rData = await scraper.youtube.search(q)
        if (!rData.results[0]) return m.reply("Tidak menemukan hasil!")
        let fData = rData.results.filter(v => v.type == "video").filter(v => (v.timestamp.replaceAll(":", "")) < 1000)
        if (!fData[0]) return m.reply("Tidak menemukan hasil!")
        let pLay = Math.floor(Math.random() * fData.length)
        let Play = fData[pLay]
        let musicMetadata = {
            title: Play.title,
            artist: author,
            album: albumAudio,
            image: await tool.getBuffer(Play.thumbnail)
        }
        let dd = await scraper.youtube.mp3(Play.url, "320")
        let aubuff = await tool.getBuffer(dd.download.url)
        conn.sendMessage(m.from, { audio: await id3.write(musicMetadata, aubuff), fileName: dd.download.filename, mimetype: "audio/mpeg", ptt: false, contextInfo: {
            externalAdReply: {
                title: Play.title,
                body: Play.description,
                sourceUrl: Play.url,
                mediaType: 2,
                mediaUrl: Play.url,
                thumbnailUrl: Play.thumbnail,
                renderLargerThumbnail: true
            }
        }}, { quoted: m})
    }
}