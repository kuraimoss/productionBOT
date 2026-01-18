module.exports = {
    name: "broadcast",
    cmd: ["broadcast", "bc"],
    category: "owner",
    desc: "Broadcast text to all groups",
    owner: true,
    handler: async (m, { conn, q, prefix }) => {
        if (global.setting?.broadcast) {
            await m.reply("Broadcast in progress. Please wait.");
            return;
        }

        const rawBody = typeof m.body === "string" ? m.body : "";
        const prefixText = Array.isArray(prefix) ? prefix[0] : String(prefix || "");
        const escapedPrefix = prefixText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const bodyMessage = prefixText
            ? rawBody.replace(new RegExp(`^${escapedPrefix}(?:broadcast|bc)\\b\\s*`, "i"), "")
            : "";
        const quotedText = m.quoted && typeof m.quoted.text === "string" ? m.quoted.text : "";
        const message = (bodyMessage || q || quotedText || "").trim();
        if (!message) {
            await m.reply("Please provide a message to broadcast.");
            return;
        }

        const groupsMap = await conn.groupFetchAllParticipating();
        const groups = Object.values(groupsMap || {});
        const targetGroups = groups.filter((g) => !g.announce);

        if (!targetGroups.length) {
            await m.reply("No eligible groups found.");
            return;
        }

        global.setting.broadcast = true;
        const totalGroups = targetGroups.length;
        let statusMessage = null;
        let statusKey = null;
        const updateStatus = async (text) => {
            if (!statusKey) return;
            try {
                await conn.sendMessage(m.from, { text, edit: statusKey });
            } catch {}
        };
        try {
            statusMessage = await m.reply(`Starting broadcast to ${totalGroups} groups...`);
            if (statusMessage?.key) {
                statusKey = { ...statusMessage.key };
            } else if (statusMessage?.message?.key) {
                statusKey = { ...statusMessage.message.key };
            }
            if (statusKey) {
                statusKey.remoteJid = statusKey.remoteJid || m.from;
                statusKey.fromMe = true;
            }

            let sent = 0;
            let processed = 0;
            for (const group of targetGroups) {
                try {
                    await conn.sendMessage(group.id, { text: message });
                    sent += 1;
                } catch {}

                processed += 1;
                if (processed % 5 === 0 || processed === totalGroups) {
                    await updateStatus(`Broadcast ${processed}/${totalGroups}`);
                }

                const delayMs = 8000 + Math.floor(Math.random() * 10000);
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }

            if (statusMessage?.key) {
                await updateStatus(`Broadcast complete. Sent to ${sent}/${totalGroups} groups.`);
            } else {
                await m.reply(`Broadcast complete. Sent to ${sent}/${totalGroups} groups.`);
            }
        } finally {
            global.setting.broadcast = false;
        }
    },
};
