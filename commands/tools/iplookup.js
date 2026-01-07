module.exports = {
name: 'iplookup',
cmd: ['iplookup'],
param: "<ip>",
category: "tools",
query: true,
async handler(m, {args,conn}){

scraper.tools.iplookup(args[0]).then(async(data) => {
let result = data.result
let teks = `\n——
- *Continent :* \`${result.continent}\`
- *Continent Code :* \`${result.continentCode}\`
- *Country :* \`${result.country}\`
- *Country Code :* \`${result.countryCode}\`
——
- *Region :* \`${result.region}\`
- *Region Name :* \`${result.regionName}\`
- *City :* \`${result.city}\`
- *District :* \`${result.district}\`
- *Zip :* \`${result.zip}\`
——
- *Latitude :* \`${result.lat}\`
- *Longitude :* \`${result.lon}\`
——
- *Time Zone :* \`${result.timezone}\`
- *Offset :* \`${result.offset}\`
- *Currency :* \`${result.currency}\`
- *Isp :* \`${result.isp}\`
- *Org :* \`${result.org}\`
——
- *As :* \`${result.as}\`
- *Asname :* \`${result.asname}\`
- *Reverse :* \`${result.reverse}\`
- *Hosting :* \`${result.hosting}\`
——\n`
await conn.sendMessage(m.from, { location: { degreesLatitude: data.result.lat, degreesLongitude: data.result.lon }}, { quoted: m })
m.reply(teks)
})

}}