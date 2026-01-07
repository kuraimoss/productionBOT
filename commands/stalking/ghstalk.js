const moment = require("moment-timezone")
module.exports = {
name: ["githubstalk","ghstalk"],
param: "<query>",
cmd: ["githubstalk","ghstalk"],
category: "stalking",
query: true,
limit: true,
async handler(m, { conn, q, command }) {
await m.reply(response.wait)
let resd = await scraper.media.ghuser(q)
let res = resd.user
let txt = `     「 Github User Stalking 」

mencari github ${res.username}, data berhasil didapatkan

▸ Username : ${res.username}
▸ Name : ${res.name}
▸ Followers : ${res.followers} followers
▸ Following : ${res.following} following
▸ Created at :  ${moment(res.createdAt).tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')}
▸ Updated at : ${moment(res.updatedAt).tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')}
▸ Public Gists : ${res.publicGists}
▸ Public Repos : ${res.publicRepos}
▸ Twitter : ${res.twitterUsername}
▸ Email : ${res.email}
▸ Location : ${res.location}
▸ Blog : ${res.blog}
▸ Link : ${res.githubUrl}
▸ Bio :\n${res.bio}`
conn.sendMessage(m.from, { image: { url: res.avatarUrl }, caption: txt }, { quoted: m })
}}