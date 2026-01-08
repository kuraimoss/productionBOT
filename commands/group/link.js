module.exports = {
	name: "linkgroup",
	cmd: ["linkgroup", "link"],
	category: "group",
	desc: "Menampilkan link undangan grup.",
	group: true,
	botadmin: true,
	async handler(m, { conn }) {
		const getinv = await conn.groupInviteCode(m.from);
		m.reply(`https://chat.whatsapp.com/${getinv}`);
	},
};
