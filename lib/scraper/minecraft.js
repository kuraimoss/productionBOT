const axios = require("axios");
const cheerio = require("cheerio");

const topserver = async(paged) => {
return new Promise((resolve, reject) => {
axios.get(`https://minecraftpocket-servers.com/country/indonesia/${paged ? paged + "/" : ""}`).then( xzons => {
const $ = cheerio.load(xzons.data)

hasil = {
author,
server: []
}

$("tr").each(function(c, d) {
ip = $(d).find("button.btn.btn-secondary.btn-sm").eq(1).text().trim()
if (ip.length <= 0) return
versi = $(d).find("a.btn.btn-info.btn-sm").text()
player = $(d).find("td.d-none.d-md-table-cell > strong").eq(1).text().trim()
addres = ip.split(":")
const Data = {
ip: addres[0],
port: addres[1] ? addres[1] : "19132",
versi: versi,
player: player
}
hasil.server.push(Data)
})
resolve(hasil)
}).catch(reject)
})
}

module.exports = { topserver }