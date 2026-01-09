const fs = require("fs");


module.exports = {
    name: "aichat",
    category: "ai",
    function: true,
    async handler(m, { conn, command, prefix, isCreator, isAdmin, isBotAdmin }) {
    if (!command) {
        if (m.type != "stickerMessage") {
            let isiPesan = ""
            if (m.type == "audioMessage") {
                let dt = await scraper.tools.speechToText(await m.download())
                if (dt.status) {
                    isiPesan = dt.text
                }
            } else {
            isiPesan = m.body
            }
            
            if (isiPesan.length != 0) {
                const botNumber = typeof getBotNumber === "function" ? getBotNumber(conn) : "";
                const botJid = botNumber ? `${botNumber}@s.whatsapp.net` : "";
                if (botJid && m.sender === botJid) return;
                let isAi = false
                let msgId = false

                if (!isiPesan.startsWith(">") && !isiPesan.startsWith("<") && !isiPesan.startsWith("=>") && !isiPesan.startsWith("$")) {
                    if (m.quoted && m.quoted.key.fromMe) msgId = m.quoted.key.id
                    if (msgId && msgId.startsWith("AICHAT")) isAi = true
                    const chatAuto = users[m.from] || users[m.sender] || {};
                    if (!m.isGroup && chatAuto.auto && chatAuto.auto.ai && (tool.isUrl(isiPesan) ? !chatAuto.auto.dl : true)) isAi = true

                    if (isAi) {
                        const voiceCommandRegex = /(?:^|\s)voice(?:\s|$)/i;
                        let text = isiPesan.replace("voice", "")
                        const prefixChar = Array.isArray(prefix) ? (prefix[0] || ".") : (prefix || ".");
                        await db.read()
                        if (db.data.openai[m.sender] == undefined) {
                            db.data.openai[m.sender] = [];
                            await db.write()
                        }
                        const historyLimit = 8;
                        if (db.data.openai[m.sender].length >= historyLimit) {
                            db.data.openai[m.sender] = db.data.openai[m.sender].slice(-historyLimit);
                            await db.write()
                        }
                        const wasEmptyHistory = db.data.openai[m.sender].length === 0;

                        const rawCommandsAll = Object.values(attr.commands || {}).filter((cmd) => cmd && !cmd.disabled && !cmd.ignored);
                        const availableCommands = rawCommandsAll.filter((cmd) => {
                            if (cmd.owner && !isCreator) return false;
                            if (cmd.admin && !isAdmin) return false;
                            if (cmd.botadmin && !isBotAdmin) return false;
                            if (cmd.group && !m.isGroup) return false;
                            if (cmd.private && m.isGroup) return false;
                            return true;
                        });
                        const availableCmdSet = new Set(
                            availableCommands
                                .flatMap((cmd) => (Array.isArray(cmd.cmd) ? cmd.cmd : cmd.cmd ? [cmd.cmd] : []))
                                .filter(Boolean)
                                .map((s) => String(s).toLowerCase())
                        );
                        const cmdDescMap = new Map();
                        for (const cmd of availableCommands) {
                            const desc = cmd?.desc ? String(cmd.desc) : "";
                            const aliases = Array.isArray(cmd.cmd) ? cmd.cmd : cmd.cmd ? [cmd.cmd] : [];
                            for (const a of aliases) {
                                if (!a) continue;
                                cmdDescMap.set(String(a).toLowerCase(), desc);
                            }
                        }
                        const availableCmdPreview = [...availableCmdSet].sort().slice(0, 40).join(", ");
                        const cmdMetaPreview = [...availableCmdSet]
                            .sort()
                            .slice(0, 25)
                            .map((c) => `${prefixChar}${c} - ${cmdDescMap.get(c) || ""}`.trim())
                            .filter((l) => l && !l.endsWith("-"))
                            .join("\n");
                        
                        const systemPrompt = [
                            "Gunakan bahasa Indonesia untuk semua jawaban.",
                            `Identitas kamu adalah ${botName}, dibuat oleh ${author}.`,
                            "Gaya ngobrol harus ramah, santai, dan membantu.",
                            "Jawaban harus rapi, jelas, dan tidak berantakan; gunakan paragraf pendek atau daftar jika perlu.",
                            "Saran fitur hanya diberikan jika user butuh bantuan/bingung atau saat chat pertama.",
                            "Saat memberi saran fitur, gunakan prefix `/` (bukan prefix lain).",
                            "Sebut nama user sesekali saat menyapa atau percakapan santai, tapi jangan terlalu sering agar tidak risih.",
                            "Saat memberi saran, sesuaikan dengan kebutuhan user dan peran user (jangan sarankan fitur owner/admin jika user bukan owner/admin).",
                            `Jangan pernah menyebut/menyarankan command atau fitur yang tidak ada. Jika user meminta fitur yang tidak tersedia, bilang tidak tersedia dan arahkan ke ${prefixChar}menu.`,
                            "Jika user tidak menyebutkan domain spesifik, jangan mengarang TLD; minta user menyebutkan domain yang diinginkan.",
                            "Jika memberi link apa pun, gunakan domain resmi dan jangan mengarang domain. Jika tidak yakin, jelaskan bahwa kamu tidak punya link yang valid.",
                            availableCmdPreview ? `Command yang tersedia (ringkas): ${availableCmdPreview}.` : "",
                            cmdMetaPreview ? `Deskripsi command (ringkas, wajib akurat):\n${cmdMetaPreview}` : "",
                            `Jika diperlukan, berikan info medsos ini (medsos owner/pemilik bot): Instagram ${medsos?.instagram}, WhatsApp ${medsos?.whatsapp}, GitHub ${medsos?.github}, Email ${medsos?.email}.`,
                            "Belajar dari history chat untuk konteks jawaban berikutnya.",
                            prompts ? `Konteks tambahan: ${prompts}` : ""
                        ].filter(Boolean).join(" ");

                        let messages = [
                            { role: "system", content: systemPrompt },
                            ...(db.data.openai[m.sender].map((msg) => ({ role: msg.role, content: msg.content })) || [])
                        ];
                        if (m.quoted && m.quoted.text) {
                            messages.push({ role: "assistant", content: m.quoted.text });
                        }
                        messages.push({ role: "user", content: text });
    

                        let data;
                        try {
                            data = await scraper.ai.chatBlackbox(messages);
                        } catch (err) {
                            if (m) m.reply(err?.message || String(err));
                            return;
                        }

                        if (data.data.answer) {
                            db.data.openai[m.sender].push({
                                role: 'user',
                                content: text
                            });
                            db.data.openai[m.sender].push({
                                role: 'assistant',
                                content: data.data.answer.trim().replace('Assistant:', '').trim()
                            });
                            if (db.data.openai[m.sender].length > historyLimit) {
                                db.data.openai[m.sender] = db.data.openai[m.sender].slice(-historyLimit);
                            }
                            await db.write()
                        }

                        let answerText = data;
                        if (data.data && data.data.answer) {
                            answerText = data.data.answer.includes("Assistant:") ? data.data.answer.trim().replace('**Assistant:**', 'Assistant:').replace('*Assistant:*', 'Assistant:').split("Assistant:")[1].trim() : data.data.answer.includes("Human") ? data.data.answer.trim().replace("**Human:**","Human:").replace("*Human:*","Human:").split("Human:")[1].trim() : data.data.answer.trim()
                           answerText = answerText.replaceAll("**","*")
                        }

                        const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                        const sanitizeCommandMentions = (inputText) => {
                            if (!inputText) return inputText;
                            const escapedPrefix = escapeRegExp(prefixChar);
                            const inlineCmdRegex = new RegExp(`${escapedPrefix}([a-z0-9_]+)`, "gi");
                            let replaced = 0;
                            let output = String(inputText).replace(inlineCmdRegex, (full, cmdName) => {
                                const c = String(cmdName).toLowerCase();
                                if (availableCmdSet.has(c)) return full;
                                replaced += 1;
                                return `${prefixChar}menu`;
                            });

                            let removed = 0;
                            const lineCmdRegex = new RegExp(`^\\s*[•\\-\\*]?\\s*${escapedPrefix}([a-z0-9_]+)\\b`, "i");
                            const lines = output.split(/\r?\n/).filter((line) => {
                                const mLine = line.match(lineCmdRegex);
                                if (!mLine) return true;
                                const c = String(mLine[1]).toLowerCase();
                                if (availableCmdSet.has(c)) return true;
                                removed += 1;
                                return false;
                            });
                            output = lines.join("\n");

                            // Fix wrong descriptions for commands: `.cmd - <desc>` or `.cmd atau .cmd2 - <desc>`
                            const descLineRegex = new RegExp(
                                `^\\s*([•\\-\\*]\\s*)?` +
                                    `\`?${escapedPrefix}([a-z0-9_]+)\`?` +
                                    `(?:\\s+(?:atau|or)\\s+\`?${escapedPrefix}([a-z0-9_]+)\`?)?` +
                                    `\\s*-\\s*(.+)$`,
                                "i"
                            );
                            output = output
                                .split(/\r?\n/)
                                .map((line) => {
                                    const mDesc = line.match(descLineRegex);
                                    if (!mDesc) return line;
                                    const bullet = mDesc[1] || "";
                                    const c1 = String(mDesc[2]).toLowerCase();
                                    const c2 = mDesc[3] ? String(mDesc[3]).toLowerCase() : null;
                                    if (!availableCmdSet.has(c1)) return "";
                                    if (c2 && !availableCmdSet.has(c2)) return "";
                                    const trueDesc = cmdDescMap.get(c1) || "";
                                    const left = c2
                                        ? `${prefixChar}${c1} atau ${prefixChar}${c2}`
                                        : `${prefixChar}${c1}`;
                                    if (!trueDesc) return `${bullet}${left}`.trimEnd();
                                    return `${bullet}${left} - ${trueDesc}`.trimEnd();
                                })
                                .filter((l) => l !== "")
                                .join("\n")
                                .trim();

                            if ((removed > 0 || replaced > 0) && !new RegExp(`${escapedPrefix}menu\\b`, "i").test(output)) {
                                output = `${output}\n\nKetik *${prefixChar}menu* untuk lihat fitur yang tersedia.`;
                            }
                            return output;
                        };
                        answerText = sanitizeCommandMentions(answerText);
                        const normalizeWhatsappLinks = (inputText) => {
                            if (!inputText) return inputText;
                            return String(inputText)
                                .replace(/https?:\/\/wa\.menu\b/gi, "https://wa.me")
                                .replace(/\bwa\.menu\b/gi, "wa.me")
                                .replace(/\bapi\.menu\.menu\b/gi, "api.whatsapp.com");
                        };
                        answerText = normalizeWhatsappLinks(answerText);
                        if (!/\.menu\b/i.test(text) && /\.menu\b/i.test(answerText)) {
                            answerText = String(answerText).replace(/\.menu\b/gi, "");
                            if (!/domain/i.test(answerText)) {
                                answerText = `${answerText}\n\nAku tidak yakin domain yang benar. Sebutkan domain yang kamu mau, ya.`;
                            }
                        }
                        if (medsos?.email) {
                            const parts = String(medsos.email).split("@");
                            const ownerLocal = parts[0] || "";
                            const ownerDomain = parts[1] || "";
                            if (ownerLocal && ownerDomain) {
                                const ownerLocalEscaped = ownerLocal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                                const emailRegex = new RegExp(
                                    `\\b${ownerLocalEscaped}@([a-z0-9.-]+\\.[a-z]{2,})\\b`,
                                    "gi"
                                );
                                answerText = String(answerText).replace(emailRegex, (match, dom) => {
                                    if (String(dom).toLowerCase() === ownerDomain.toLowerCase()) return match;
                                    return `${ownerLocal}@${ownerDomain}`;
                                });
                            }
                        }

                        const isFirstChat = wasEmptyHistory;
                        const helpRegex = /(bingung|bantuan|help|menu|fitur|command|perintah|cara|gimana|bagaimana|nggak ngerti|gak ngerti|ga ngerti|tutorial|panduan|petunjuk)/i;
                        const needsHelp = helpRegex.test(text);
                        const shouldSuggest = isFirstChat || needsHelp;
                        const displayName = m.pushName || m.sender.split("@")[0] || "kamu";
                        const shouldMentionName = () => {
                            const seed = String(m.key?.id || m.id || "");
                            let hash = 0;
                            for (let i = 0; i < seed.length; i += 1) {
                                hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
                            }
                            return hash % 4 === 0;
                        };
                        const maybeAddNameInGreeting = (inputText) => {
                            const textValue = String(inputText || "");
                            const greetRegex = /^(halo|hai|hi|helo|hallo|selamat|assalamualaikum|assalamu'alaikum)\b/i;
                            if (greetRegex.test(textValue) && shouldMentionName()) {
                                return textValue.replace(greetRegex, (m0) => `${m0} ${displayName}`);
                            }
                            return textValue;
                        };
                        answerText = maybeAddNameInGreeting(answerText);

                        if (shouldSuggest && !/saran:/i.test(answerText)) {
                            const suggestPrefix = "/";
                            const available = availableCommands;

                            const userTokens = (text.toLowerCase().match(/[a-z0-9]+/g) || []).filter((t) => t.length >= 3);
                            const scored = available.map((cmd) => {
                                const name = Array.isArray(cmd.name) ? cmd.name.join(" ") : (cmd.name || "");
                                const cmds = Array.isArray(cmd.cmd) ? cmd.cmd.join(" ") : (cmd.cmd || "");
                                const desc = cmd.desc || "";
                                const hay = `${name} ${cmds} ${desc}`.toLowerCase();
                                let score = 0;
                                for (const t of userTokens) {
                                    if (hay.includes(t)) score += 1;
                                }
                                if (text && hay.includes(text.toLowerCase())) score += 2;
                                return { cmd, score };
                            }).filter((x) => x.score > 0);

                            const top = scored.sort((a, b) => b.score - a.score).slice(0, 3);
                            const suggestionList = top.length ? top : [];
                            const menuCmd = available.find((c) => Array.isArray(c.cmd) ? c.cmd.includes("menu") : c.cmd === "menu");
                            if (!suggestionList.length && menuCmd) suggestionList.push({ cmd: menuCmd, score: 0 });

                            if (suggestionList.length) {
                                const sugText = suggestionList.map((s) => {
                                    const cmdName = Array.isArray(s.cmd.cmd) ? s.cmd.cmd[0] : s.cmd.cmd;
                                    const desc = s.cmd.desc ? ` - ${s.cmd.desc}` : "";
                                    return `${suggestPrefix}${cmdName}${desc}`;
                                }).join("\n");
                                if (shouldMentionName() && !new RegExp(`\\b${displayName}\\b`, "i").test(answerText)) {
                                    answerText = `Hai ${displayName}!\n\n${answerText}`;
                                }
                                answerText = `${answerText}\n\nSaran:\n${sugText}`;
                            }
                        }

                        if (voiceCommandRegex.test(isiPesan)) {
                            await conn.sendPresenceUpdate('recording', m.from);
      
                            scraper.elevenlabs.textToSpeech(setting.elevenlabs.key, answerText, "52LXmmR0nGnIcDs1TL3f", `${tool.getRandom(m.sender.split("@")[0])}AI`)
                                .then(async(d) => {
                                    await m.reply({ audio: fs.readFileSync(d), mimetype: "audio/mpeg", ptt: true })
                                    fs.unlinkSync(d)
                                })
                                .catch(() => {
                                    xzons.gtts("id").save("./temp/"+m.sender+".mp3", answerText, function() {
                                        conn.sendMessage(m.from, { audio: { url: "./temp/"+m.sender+".mp3" }, ptt: true, mimetype: "audio/mpeg", fileName: m.sender+".mp3" }, { quoted: m })
                                            .then(() => fs.unlinkSync("./temp/"+m.sender+".mp3"))
                                    })
                                })
                            } else {
                                conn.sendMessage(m.from, { text: answerText }, { quoted: m, msgId: "AICHAT" });
                            }
                        }
                    }
                }
            }
        }
    }
}
