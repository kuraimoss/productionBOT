module.exports = {
    name: "listgroup",
    cmd: ["listgroup"],
    category: "owner",
    desc: "Show list of groups the bot is in",
    owner: true,
    handler: async (m, { conn }) => {
        const getGroups = await conn.groupFetchAllParticipating();
        const groups = Object.values(getGroups || {});
        if (!groups.length) {
            await m.reply("No groups found.");
            return;
        }
        const lines = groups.map((g, idx) => {
            const owner = g.owner ? g.owner.split("@")[0] : "-";
            const members = Array.isArray(g.participants) ? g.participants.length : 0;
            return `${idx + 1}. ${g.subject}\n   Owner: ${owner}\n   ID: ${g.id}\n   Members: ${members}`;
        });
        await m.reply(`*GROUP LIST*\nTotal: ${groups.length}\n\n${lines.join("\n\n")}`);
    },
};
