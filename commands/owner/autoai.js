const fs = require("fs");

module.exports = {
    name: "autoai",
    cmd: ["autoai"],
    category: "owner",
    desc: "Mengaktifkan/menonaktifkan auto AI chat per private chat.",
    private: true,
    async handler(m, { args, isCreator, prefix }) {
        if (!m.isSelf && !isCreator) {
            return m.reply("Perintah ini hanya bisa digunakan oleh bot atau owner.");
        }

        const action = (args[0] || "").toLowerCase();
        if (!["on", "off"].includes(action)) {
            const p = Array.isArray(prefix) ? (prefix[0] || ".") : (prefix || ".");
            return m.reply(`Format: ${p}autoai on/off`);
        }

        const target = m.from;
        if (!users[target]) {
            users[target] = {
                id: target,
                auto: {
                    ai: true,
                    dl: true,
                },
            };
        } else if (!users[target].auto) {
            users[target].auto = { ai: true, dl: true };
        }

        users[target].auto.ai = action === "on";
        fs.writeFileSync("./database/json/user.json", JSON.stringify(users, null, 2));

        m.reply(`Auto AI untuk chat ini sekarang ${action === "on" ? "aktif" : "nonaktif"}.`);
    },
};
