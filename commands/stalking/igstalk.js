module.exports = {
name: ["instagramstalk","igstalk"],
param: "<query>",
cmd: ["instagramstalk","igstalk"],
category: "stalking",
query: true,
limit: true,
async handler(m, { conn, q, command }) {
await m.reply(response.wait)
let igSt = await scraper.instagram.stalk(q)
teks = `
       *Profile User*

▸ *Name:* ${igSt.user.full_name === "" ? "-" : igSt.user.full_name}
▸ *Username:* ${igSt.user.username}
▸ *Followers:* ${igSt.user.edge_followed_by.count} followers
▸ *Following:* ${igSt.user.edge_follow.count} following
▸ *Posting:* ${igSt.user.edge_owner_to_timeline_media.count} postingan
 
*Biography*
${igSt.user.biography}
${igSt.user.external_url}

*Account Info*
Private : ${igSt.user.is_private}
Verified : ${igSt.user.is_verified}
Fb Connect : ${igSt.user.connected_fb_page}
`

conn.sendMessage(m.from, { image: { url: igSt.user.profile_pic_url_hd }, caption: teks })
}}