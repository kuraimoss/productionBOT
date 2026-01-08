const id3 = require("node-id3")
module.exports = {
    name: ["ytmp3"],
    param: "<url>",
    cmd: ["ytmp3"],
    category: "media",
    desc: "Download audio YouTube (MP3); bisa pilih bitrate dengan format `url|320`.",
    query: true,
    url: true,
    async handler(m, { conn, q, command }) {
        await m.reply(response.wait)
        let urlt = q.split("|")[0] ? q.split("|")[0] : q
        let quality = q.split("|")[1] ? q.split("|")[1] : "320"
        let dayt = await scraper.youtube.mp3(urlt, quality)
        if (dayt && dayt.status) {
            let Play = dayt.metadata
            let musicMetadata = {
                title: Play.title,
                artist: author,
                album: albumAudio,
                image: await tool.getBuffer(Play.thumbnail)
            }
            let aubuff = await tool.getBuffer(dayt.download.url)
            conn.sendMessage(m.from, { audio: await id3.write(musicMetadata, aubuff), mimetype: "audio/mpeg", fileName: dayt.download.filename, ptt: false }, { quoted: m })
        }
}}
