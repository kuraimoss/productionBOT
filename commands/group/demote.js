module.exports = {
	name: "demote",
	param: "<tag/reply chat>",
	cmd: ["demote", "dm"],
	category: "group",
	desc: "Menurunkan admin menjadi member di grup.",
	group: true,
	admin: true,
	botadmin: true,
	async handler(m, { conn, admin }) {
		let participant = m.mentions[0]
			? m.mentions[0]
			: m.quoted
			? m.quoted.sender
			: text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
		if (participant.replace(/\D/g, "") == "")
			return m.reply("Example : .demote @0", {
				mentions: ["0@s.whatsapp.net"],
			});
		if (!m.groupMetadata.admin.includes(participant))
			return m.reply("The user is already an member");
		await conn.groupParticipantsUpdate(m.from, [participant], "demote");
		await m.reply("Sukses Demote user");
	},
};
