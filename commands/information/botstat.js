const fs = require('fs')
const os = require("os");
const prettyms = require('pretty-ms')
const { sizeFormatter } = require("human-readable");
const formatSize = sizeFormatter({
	std: "JEDEC",
	decimalPlaces: "2",
	keepTrailingZeroes: false,
	render: (literal, symbol) => `${literal} ${symbol}B`,
});
const speed = require('performance-now')
module.exports = {
	name: "botstatus",
	cmd: ["botstatus","botstat","botstats","bot","ping","test"],
	category: "information",
	desc: "Menampilkan status bot (ping, runtime) dan info host/server.",
	async handler(m, {conn}) {
    	const times = await speed()
		let text = "";
		if (["ping","test"].includes(m.command)) {
		m.reply("measuring ping..")
		m.reply("*PING :* `"+ parseInt(await speed() - times) +" ms`")
		} else {
		const lat = await speed() - times
		text += `HOST:\n`;
		text += `${shp} Arch: ${os.arch()}\n`
		text += `${shp} CPU: ${os.cpus()[0].model}${os.cpus().length > 1 ? " (" + os.cpus().length + "x)" : ""}\n`
		text += `${shp} Release: ${os.release()}\n`
    	text += `${shp} Version: ${os.version()}\n`
		text += `${shp} Memory: ${formatSize(os.totalmem() - os.freemem())} / ${formatSize(os.totalmem())}\n`;
		text += `${shp} Platform: ${os.platform()}\n\n`;
    	text += `BOT STAT\n`
    	text += `${shp} Runtime : ${m.user.jadibot ? await prettyms(Date.now() - conn.user.uptime, {verbose: true}) : await tool.toTimer(process.uptime())}\n`
    	text += `${shp} Speed : ${lat}\n`
   		text += `${shp} Group Join : ${(Object.keys(await conn.groupFetchAllParticipating())).length}`
   		m.reply(text)
   		}
	},
};
