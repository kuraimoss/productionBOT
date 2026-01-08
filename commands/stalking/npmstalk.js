module.exports = {
name: ["npmstalk"],
param: "<query>",
cmd: ["npmstalk"],
category: "stalking",
desc: "Stalk info package NPM (author, versi, repo, deskripsi, dll).",
query: true,
async handler(m, { conn, q, command }) {
await m.reply(response.wait)
let a = await tool.fetchJson(`https://registry.npmjs.com/${q}`)
let iA = a.time[a['dist-tags'].latest]
let iN = a.versions[a['dist-tags'].latest]
teks = `
            *「 NPM STALKING 」*

▸ Author : ${iN['_npmUser'].name}
▸ Email : ${iN['_npmUser'].email}
▸ Name : ${iN.name}
▸ Version : ${iN.version}
▸ Maintainers : ${iN.maintainers.find(v => v).name}

*Description*
${iN.description}

*Keywords*
${iN.keywords}

*Repository*
${iN.repository.url}

*Last Publish*
${iA}
`
m.reply(teks)
}}
