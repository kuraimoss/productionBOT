module.exports = {
    name: 'getquoted',
    cmd: ['getquoted','q'],
    category: "tools",
    async handler(m, {conn}) {
const { serialize } = require("../../lib/serialize");
if (!m.quoted) return m.reply("Reply pesanya!!")
		const message = await m.getQuotedObj();
		if (!message.quoted) return m.reply("The message you replied does not contain a reply")
		conn.sendMessage(m.from, { forward: await serialize(message.quoted, conn) })
}
}