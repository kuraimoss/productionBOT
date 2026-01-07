/**
  # Identity/config is centralized in config.js
*/
const id3 = require("node-id3")

async function igDL(url, conn, m) {
    console.log("instagram downloader...")
    let igdlJson = await scraper.instagram.download(url);
    let album = [];
    
    if (igdlJson.is_sidecar) {
        for (let iv of igdlJson.media) {
            if (iv.is_video) {
                album.push({ video: { url: iv.video_url }})
            } else {
                let HD = iv.display_resources.reduce((prev, current) => {
                    let prevR = prev.config_width * prev.config_height;
                    let currentR = prev.config_width * prev.config_height;
                    return prevR > currentR ? prev : current;
                })
                album.push({ image: { url: HD.src }})
            }
        }
    }
    
    if (igdlJson.is_video) {
        album.push({ video: { url: igdlJson.media[0].src }})
    } else {
        let HD = igdlJson.media.reduce((prev, current) => {
            let prevR = prev.config_width * prev.config_height;
            let currentR = prev.config_width * prev.config_height;
            return prevR > currentR ? prev : current;
        })
        album.push({ image: { url: HD.src }})
    }
    
    album[0].caption = igdlJson.caption;
    await conn.sendMessage(m.from, { albumMessage: album }, { quoted: m }).catch((e) => {})
}

async function fbDL(url, conn, m) {
console.log("facebook downloader...")
let fbdlJson = await betabotz.facebook(url)
let i = fbdlJson.result
await conn.sendFileFromUrl(m.from, i.Normal_video, { caption: i.title }, { quoted: m })
}

async function twDL(url, conn, m) {
console.log("twitter downloader...")
let twdlJson = await betabotz.twitter(url)
for (let i of twdlJson.result.mediaURLs) {
await conn.sendFileFromUrl(m.from, i, {}, { quoted: m })
}
m.reply(i.text)
}

async function ttDL(url, conn, m) {
    console.log("tiktok downloader...")
    let ttdlJson = await scraper.media.tiktokdl(url)
    let i = ttdlJson.data.find(v => v.type == "photo" ? (v.type == "photo") : v.type == "nowatermark_hd" ? (v.type == "nowatermark_hd") : (v.type == "nowatermark") )
    let teks = `*TIKTOK DOWNLOAD*\nMusic: ${ttdlJson.music_info.url}\nTitle: \n${ttdlJson.title}`;
    
    if (i.type == "photo") {
        m.reply(teks)
        for (const Pdata of ttdlJson.data) {
            await conn.sendMessage(m.from, { image: { url: Pdata.url }, thumbnail: { url: ttdlJson.cover }}, { quoted: m })
        }
        return
    }
    await conn.sendMessage(m.from, { video: { url: i.url }, thumbnail: { url: ttdlJson.cover }, caption: teks }, { quoted: m })
}

async function sptfyDL(url, conn, m) {
console.log("spotify downloader...")
let sptJson = await scraper.media.spotifydl(url)
if (sptJson.status) {
await conn.sendMessage(m.from, { audio: { url: sptJson.result }, fileName: `biarkanSpt.mp3`, mimetype: "audio/mpeg", ptt: false }, { quoted: m })
} else {
m.reply(sptJson.message)
}
}

async function aiovDL(url, conn, m) {
console.log("allinonevideo downloader...")
try {
let vdlJson = await scraper.media.aiovdl(url)
for (let i of vdlJson.medias) {
await conn.sendFileFromUrl(m.from, i.url, { caption: vdlJson.title }, { quoted: m })
}
m.reply(`${vdlJson.title}`)
} catch(e) {
m.reply(String(e))
}
}

module.exports = {
    name: "autodl",
    function: true,
    category: "media",
    async handler(m, { conn, command }) {
        if (!command) {
            if (!m.body.startsWith(">") && !m.body.startsWith("<") && !m.body.startsWith("=>") && !m.body.startsWith("$")) {
                if (users[m.sender].auto && users[m.sender].auto.dl) {
                    let urldlJson = []
                    if (!m.isGroup && tool.isUrl(m.body)) urldlJson = await tool.isUrl(m.body)
                    if (m.isGroup && m.body.startsWith("http")) urldlJson.push(m.body.split(" ")[0])

                    if (urldlJson[0]) for (let urldl of urldlJson) {
                        await tool.sleep(3000)
                        try {
                            if (IgIdRegex.test(urldl)) {
                                igDL(urldl, conn, m)
                            }
                            if (FbIdRegex.test(urldl)) {
                                fbDL(urldl, conn, m)
                            }
                            if (TwIdRegex.test(urldl)) {
                                twDL(urldl, conn, m)
                            }
                            if (TtIdRegex.test(urldl) || TtId2Regex.test(urldl)) {
                                ttDL(urldl, conn, m)
                            }
                            if (SpotifyTrRegex.test(urldl)) {
                                sptfyDL(urldl, conn, m)
                            }
                        } catch(e) {
                            m.reply(e)
                            if (IgIdRegex.test(urldl) || FbIdRegex.test(urldl) || TwIdRegex.test(urldl) || TtIdRegex.test(urldl) || TtId2Regex.test(urldl)) {
                                aiovDL(urldl, conn, m)
                            }
                        }
                    }
                }
            }
        }
    },
igDL, fbDL, twDL, ttDL, sptfyDL, aiovDL}
