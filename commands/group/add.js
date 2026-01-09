module.exports = {
	name: "add",
	param: "<tag/reply/number>",
	cmd: ["add", "inv"],
	category: "group",
	desc: "Menambahkan member ke grup.",
	group: true,
	botadmin: true,
	admin: true,
	async handler(m, { conn, text, prefix }) {
		const target =
			m.mentions[0] ||
			(m.quoted ? m.quoted.sender : "") ||
			(text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : "");
		if (!target || target.replace(/\D/g, "") === "") {
			const p = Array.isArray(prefix) ? (prefix[0] || ".") : (prefix || ".");
			return m.reply(`Example : ${p}add 6289xxxxxxx`, {
				mentions: ["0@s.whatsapp.net"],
			});
		}
		const mdata = await conn.groupMetadata(m.from);
		const plist = [
			...mdata.participants.map((pe) => pe.jid),
			...mdata.participants.map((pe) => pe.id),
		];
		if (plist.includes(target)) return m.reply("User sudah ada di grup.");
		await conn.groupParticipantsUpdate(m.from, [target], "add");
		return m.reply("Sukses menambahkan member.");
	},
};
