module.exports = {
    name: "test",
    cmd: ["test"],
    desc: "Check bot status",
    owner: true,
    handler: async (m) => {
        await m.reply("Bot is active.");
    },
};
