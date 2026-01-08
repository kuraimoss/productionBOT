module.exports = {
name: "gitclone",
cmd: ["gitclone"],
category: "media",
desc: "Mengunduh repository GitHub menjadi file ZIP dari URL repo.",
param: "<url>",
query: true,
url: true,
async handler(m, { conn, q, args }) {
await m.reply(response.wait)
const name = q.split('/')[3]
const repo = q.split('/')[4]
const find = await scraper.media.ghrepo(repo)
const filter = find.items.find(y => y.nameRepo == repo && y.url_repo == q && y.author.username == name)
if(filter == undefined) return m.reply('Repository not found')
const downurl = `${q}/archive/refs/heads/${filter.defaultBranch}.zip`
await conn.sendMessage(m.from, { document: { url: downurl }, mimetype: 'application/zip', fileName: filter.fullNameRepo }, { quoted: m })
},
};
