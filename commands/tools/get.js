const axios = require("axios")
module.exports = {
name: "get",
param: "<url>",
cmd: ["get"],
category: "tools",
desc: "Mengambil konten dari URL (JSON/teks) lalu menampilkannya.",
query: true,
url: true,
async handler(m, { conn, args }) {
fetch(args[0]).then(async(response) => {
let ctype = await response.headers.get('content-type');
ctype = ctype.split(";")[0]
if (ctype.includes("application/json")) {
m.reply(JSON.stringify(await response.json(), null, 2))
} else if (["text/html","text/plain"].includes(ctype)) {
m.reply(await response.text())
}
})
}}
