module.exports = {
	name: "revoke",
	cmd: ["revoke", "revokelink"],
	category: "group",
	desc: "Reset / revoke link undangan grup (membuat link baru).",
	group: true,
	admin: true,
	botadmin: true,
	async handler(m, { conn, args }) {
		const rev = await conn.groupRevokeInvite(m.from);
		m.reply("The group link has been successfully revoked");
	},
};
