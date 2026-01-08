module.exports = {
    name: 'getquoted',
    cmd: ['getquoted','q'],
    category: "tools",
    desc: "Mengambil quoted dari pesan yang direply, lalu forward isi reply-nya.",
    async handler(m, {conn}) {
const { serialize } = require("../../lib/serialize");
if (!m.quoted) return m.reply("Reply pesanya!!")
		const message = await m.getQuotedObj();
		if (!message.quoted) return m.reply("The message you replied does not contain a reply")
		conn.sendMessage(m.from, { forward: await serialize(message.quoted, conn) })
}
}
