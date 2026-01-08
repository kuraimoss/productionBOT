const { toAudio } = require("../../lib/converter");
module.exports = {
	name: "tomp3",
	param: "<reply audio>",
	cmd: ["tomp3", "toaudio"],
	category: "tools",
	desc: "Mengonversi video menjadi audio MP3.",
	async handler(m, { conn, isQVideo, isMedia }) {
		if ((isMedia && m.message.videoMessage) || isQVideo) {
			await m.reply(response.wait);
			const toaud = await toAudio(
				isMedia ? await m.download() : await m.quoted.download(),
				"mp3"
			);
			await conn.sendMessage(
				m.from,
				{ audio: toaud, mimetype: "audio/mpeg", ptt: false },
				{ quoted: m }
			);
		}
	},
};
