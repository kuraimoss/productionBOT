/**
  # Identity/config is centralized in ../config.js
*/
require("../config.js")
const fs = require("fs");
const moment = require("moment-timezone");
const { serialize } = require("./serialize");
const chalk = require("chalk");
const ms = require('parse-ms');
const { addhit } = require("../database/hit");
const pathContacts = "./session/contacts.json";
async function handler(conn, msg) {
    if (msg.type !== "notify") return;
    const m = await serialize(JSON.parse(JSON.stringify(msg.messages[0])), conn);
    if (!m.message) return;
    
    let isContextInfo = m.message[m.type]?.contextInfo
let isForwardedChannel = (isContextInfo && isContextInfo.forwardedNewsletterMessageInfo)

if (isForwardedChannel) {
    console.log("message forwarding from detected channel")
}
    
    let blockList = await conn.fetchBlocklist()
    if (m.user.jadibot && conn.self && !owner.includes(m.sender)) return
    else if (attr.isSelf && !owner.includes(m.sender)) return;
    if (Object.keys(m.message)[0] == "senderKeyDistributionMessage") delete m.message.senderKeyDistributionMessage;
    if (Object.keys(m.message)[0] == "messageContextInfo") delete m.message.messageContextInfo;
    
    if (m.key && m.key.remoteJid === "status@broadcast") {
        if (m.type !== "protocolMessage") {
            await tool.sleep(3000)
            setting.auto.readsw && (await conn.readMessages([m.key]));
        }
        return;
    }
    
    if (m.key.remoteJid.endsWith("@newsletter")) return;
    if (m.type === "protocolMessage" || m.type === "senderKeyDistributionMessage" || !m.type || m.type === "") return;

    const findmsg = conn.mess.find((ped) => ped.key.id == m.id)
    if (findmsg) return
    else conn.mess.push(m);
    if (conn.mess.length >= 100) conn.mess = [];
    await db.read()

    const { body, type, quoted, mentions, id, from, sender } = m;
    const chats = type == 'extendedTextMessage' && m.quoted && m.quoted.key.fromMe && !m.quoted.key.id.startsWith('BAE5') ? body : type == "conversation" || type == "imageMessage" || type == "videoMessage" || type == "extendedTextMessage" || (type == "templateButtonReplyMessage" && m.quoted.key.fromMe) || (type == "buttonsResponseMessage" && m.quoted.key.fromMe) || (type == "listResponseMessage" && m.quoted.key.fromMe) || (type == "interactiveResponseMessage" && m.quoted.key.fromMe) ? m.body : "";
    const prefix = setting.prefixs == "multi" ? /^[z#?$+/\\©^]/.test(chats) ? chats.match(/^[z#?$+/\\©^]/) : "." : setting.prefixs;
    const budy = (type == "conversation" && type == "imageMessage" && type == "videoMessage" && type == "extendedTextMessage" && type == "templateButtonReplyMessage" && type == "buttonsResponseMessage" && type == "listResponseMessage" && type == "stickerMessage" && type == "interactiveResponseMessage") || chats.startsWith(prefix) ? chats : "";
    const commands = budy || "";
    const command = commands != "" ? commands.toLowerCase().split(/\s+/)[0].slice(1) : "";
    const args = budy.trim().split(/\s+/).slice(1);
    const q = args.join(" ");

    const groupMetadata = m.isGroup ? await conn.groupMetadata(m.from) : false
    const admin = m.isGroup ? groupMetadata.participants.filter((v) => v.admin != null).map((v) => v.phoneNumber) : {};

    m.command = command;
    m.attribute.isAdmin = m.isGroup ? owner.includes(m.sender) ? true : admin.includes(m.sender) : false
    m.attribute.isBotAdmin = m.isGroup ? admin.includes(conn.user.id.split(":")[0] + "@s.whatsapp.net") : false
    m.groupMetadata = groupMetadata
    m.isGroup ? m.groupMetadata.admin = groupMetadata.participants.filter((adm) => adm.admin != null).map((adm) => adm.jid) : ''

    const isCreator = m.attribute.isOwner;

    if (!m.key.fromMe) {
        if (m.isGroup) {
            conn.contacts[m.from] = {
                id: m.from,
                notify: m.groupMetadata.subject,
                lastMsg: {
                    key: m.key,
                    messageTimestamp: m.messageTimestamp
                }
            };
            fs.writeFileSync(pathContacts, JSON.stringify(conn.contacts));
        } else {
            conn.contacts[m.sender] = {
                ...conn.contacts?.[m.sender],
                lastMsg: {
                    key: m.key,
                    messageTimestamp: m.messageTimestamp
                }
            }; 
            fs.writeFileSync(pathContacts, JSON.stringify(conn.contacts));
        }
    }

    // Mute Unmute
    if (m.isGroup && db.data.group[m.from] && db.data.group[m.from].mute && (m.attribute.isAdmin || isCreator)) {
        switch(m.command) {
            case 'unbanchat':
            case 'unmute':
            return await require('../commands/group/unbanchat').handler(m, {conn})
        }
    }

    if (m.isGroup && db.data.group[m.from] && db.data.group[m.from].mute && !isCreator) return
    const extra = {
        conn,
        body,
        budy,
        chats,
        prefix,
        args,
        q,
        isCreator,
        text: q,
        command,
        msg,
        ...m.attribute
    };

    global.errormes = async (conn, { e, ctx, cmnd, silent = false }) => {
        const normalizeText = (val, max = 800) => {
            if (val === undefined || val === null) return "";
            let text = String(val).replace(/\s+/g, " ").trim();
            if (text.length > max) text = text.slice(0, max) + "...";
            return text;
        };
        const safeJson = (val, max = 800) => {
            try {
                return normalizeText(JSON.stringify(val), max);
            } catch {
                return normalizeText(String(val), max);
            }
        };
        const status = e?.response?.status || e?.status || null;
        const inferReason = () => {
            const code = e?.code || e?.errno || e?.name || "";
            const msg = String(e?.message || "");
            const method = e?.config?.method ? String(e.config.method).toUpperCase() : "";
            const url = e?.config?.url || e?.response?.config?.url || "";
            const statusText = e?.response?.statusText || "";
            const parts = [];
            if (status) {
                const map = {
                    400: "Bad Request",
                    401: "Unauthorized",
                    403: "Forbidden",
                    404: "Not Found",
                    408: "Request Timeout",
                    409: "Conflict",
                    413: "Payload Too Large",
                    429: "Rate Limited",
                    500: "Server Error",
                    502: "Bad Gateway",
                    503: "Service Unavailable",
                    504: "Gateway Timeout",
                };
                parts.push(`HTTP ${status}${map[status] ? ` (${map[status]})` : ""}${statusText ? ` - ${statusText}` : ""}`);
            }
            if (method || url) parts.push(`Request: ${[method, url].filter(Boolean).join(" ")}`);
            if (/ENOTFOUND|EAI_AGAIN/.test(code)) parts.push("DNS lookup failed");
            if (/ECONNREFUSED/.test(code)) parts.push("Connection refused");
            if (/ECONNRESET/.test(code)) parts.push("Connection reset");
            if (/ETIMEDOUT/.test(code)) parts.push("Request timed out");
            if (/EACCES|EPERM/.test(code)) parts.push("Permission denied");
            if (/ENOENT/.test(code)) parts.push("File not found");
            if (/invalid|not valid|unsupported/i.test(msg)) parts.push("Invalid input");
            if (code && !parts.some((p) => p.includes(code))) parts.push(`Code: ${code}`);
            return parts.join(" | ") || "Unknown error";
        };
        const data = e?.response?.data;
        let detail = "";
        if (data) {
            detail = typeof data === "string" ? normalizeText(data) : safeJson(data);
        } else if (e?.message) {
            detail = normalizeText(e.message);
        } else {
            detail = normalizeText(e);
        }
        const reason = status ? ` (status ${status})` : "";
        const why = inferReason();
        if (!silent && ctx?.reply) {
            await ctx.reply(`${response.error}\n\nError detail${reason}: ${detail}`);
        }
        const senderId = ctx?.sender || "-";
        const chatId = ctx?.from || "-";
        const senderName = ctx?.pushName || senderId.split("@")[0] || "-";
        const chatName = ctx?.isGroup ? ctx?.groupMetadata?.subject : "";
        const time = moment.tz("Asia/Jakarta").format("DD MMM YYYY HH:mm:ss");
        const stackRaw = String(e?.stack || e || "");
        const stack = normalizeText(stackRaw, 1400) || "-";
        const ownerText = [
            "*Error Report*",
            `Command: ${cmnd || "-"}`,
            `User: ${senderName} (${senderId})`,
            `Chat: ${chatId}${chatName ? ` (${chatName})` : ""}`,
            `Time: ${time} WIB`,
            `Reason: ${why}`,
            status ? `Status: ${status}` : null,
            detail ? `Detail: ${detail}` : null,
            "Stack:",
            "```",
            stack,
            "```",
        ].filter(Boolean).join("\n");
        if (owner?.[0]) {
            await conn.sendMessage(owner[0], { text: ownerText }, { quoted: ctx });
        }
        console.error(`Error: ${cmnd || "-"} | ${senderId} | ${detail}${reason}`);
    };

    if (blockList.includes(m.sender)) {
        if (command) m.reply(response.blockir);
        return;
    }

    if (setting.log.msg && command) {
        const chatId = m.chat;
        const chatName = await conn.getName(m.chat);
        const senderName = await conn.getName(m.sender);
        const time = moment.tz("Asia/Jakarta").format("DD MMM YYYY HH:mm:ss");
        const parts = [
            chalk.whiteBright("[MSG]"),
            chalk.green(`${prefix + command}`),
            q ? chalk.gray("|") + " " + chalk.white(q) : "",
            chalk.gray("|"),
            chalk.cyan("Sender:"),
            chalk.white(senderName),
            chalk.gray("|"),
            chalk.cyan("Chat:"),
            chalk.white(chatId),
            chatName ? chalk.gray(`(${chatName})`) : "",
            chalk.gray("|"),
            chalk.magenta(`${time} WIB`),
        ].filter(Boolean);
        console.log(parts.join(" "));
    }

    if (users[m.sender] == undefined) {
        users[m.sender] = {
            id: m.sender,
            auto: {
                ai: true,
                dl: true
            }
        }
        await fs.writeFileSync('./database/json/user.json', JSON.stringify(users, null, 2))
    }

    if (m.isGroup) {
        if (db.data.group[m.from] == undefined) {
            db.data.group[m.from] = {
                accessCmd: []
            }
            await db.write()
        }
        if (db.data.group[m.from] && db.data.group[m.from].accessCmd == undefined) {
            db.data.group[m.from].accessCmd = []
            await db.write()
        }
    }

    if (setting.auto.read) conn.readMessages([m.key])

    for (let func of Object.values(attr.functions).filter(fuc => !fuc.antispam && !fuc.typo)) {
        try {
            await func.handler(m, extra);
        } catch (e) {
            await errormes(conn, { e, ctx: m, cmnd: func?.name || "function", silent: true });
        }
    }

    const cmd = Object.values(attr.commands).find((cmn) => (cmn.cmd && cmn.cmd.includes(command) && !cmn.disabled) || (cmn.stickCmd && m.message.stickerMessage ? cmn.stickCmd.includes(m.message.stickerMessage.fileSha256.toString("base64")) : "" && !cmn.disabled));
    if (!cmd) return;
    if (!isCreator && m.type != 'buttonsResponseMessage' && m.from in conn.cooldown) {
        const sisa = await ms(conn.cooldown[m.from].timestamp - Date.now())
        if ((m.attribute.isBot && db.data.group[m.from] && db.data.group[m.from].accessCmd && db.data.group[m.from]?.accessCmd.includes(m.sender)) || (!m.isGroup && m.attribute.isBot && db.data.accessCmd.includes(m.sender)) || !m.attribute.isBot) m.reply(`_command sedang cooldown.._\n_Silahkan tunggu *${sisa.seconds}* detik_`)
        return;
    }

    if (m.isGroup) {
        if (db.data.group[m.from]) {
            if (m.attribute.isBot && db.data.group[m.from] && db.data.group[m.from].accessCmd && !db.data.group[m.from]?.accessCmd?.includes(m.sender) && !isCreator) return;
        } else if (m.attribute.isBot && !isCreator) return;
    } else if (!m.isGroup) {
        if (m.attribute.isBot && !db.data.accessCmd.includes(m.sender) && !isCreator) return;
    }

    if (cmd.owner && !isCreator) return m.reply(response.owner);
    else if (cmd.maintenance && !isCreator) return m.reply(response.maintenance);
    else if (cmd.repair && !isCreator) return m.reply(response.repair);
    else if (cmd.group && !m.isGroup) return m.reply(response.group);
    else if (cmd.private && m.isGroup) return m.reply(response.private);
    else if (cmd.admin && m.isGroup && !m.attribute.isAdmin) return m.reply(response.admin);
    else if (cmd.botadmin && m.isGroup && !m.attribute.isBotAdmin) return m.reply(response.botadmin);
    else if (cmd.quoted && typeof cmd.quoted == "object") {
        if (cmd.quoted.image && !m.attribute.isQImage) return m.reply("Please reply a image message");
        else if (cmd.quoted.video && !m.attribute.isQVideo) return m.reply("Please reply a video message");
        else if (cmd.quoted.audio && !m.attribute.isQAudio) return m.reply("Please reply a audio message");
        else if (cmd.quoted.sticker && !m.attribute.isQSticker) return m.reply("Please reply a sticker message");
        else if (cmd.quoted.document && !m.attribute.isQDocument) return m.reply("Please reply a document message");
        else if (cmd.quoted.location && !m.attribute.isQLocation) return m.reply("Please reply a location message");
    } else if (cmd.quoted && m.quoted == null) {
        if (cmd.quoted != true) return m.reply(cmd.quoted)
        return m.reply("Please reply a message");
    } else if (cmd.query && !q){
        if (cmd.query != true) return m.reply(cmd.query, {msgId: cmd.cmd.find(y => y == command)})
        return m.reply(`Please fill in the ${cmd.param} parameters\nInstructions : ${prefix}${cmd.name} ${cmd.param}`, {msgId: cmd.cmd.find(y => y == command)});
    }
    else if (cmd.url && !tool.isUrl(q)) return m.reply("The input must be a url!")
    if (cmd.url) extra.text = tool.isUrl(q)[0]
    const cmdhit = Array.isArray(cmd.name) ? Array.isArray(cmd.cmd) ? cmd.cmd.find(cm => cm == command) : cmd.cmd : cmd.name

    const safeReact = async (emoji) => {
        try {
            await m.react(emoji);
        } catch {}
    };
    let originalSendMessage = null;
    try {
        await safeReact("⏳");
        let responded = false;
        originalSendMessage = conn.sendMessage.bind(conn);
        conn.sendMessage = async (...args) => {
            const payload = args[1];
            if (args[0] === m.from && !(payload && payload.react)) {
                responded = true;
            }
            return originalSendMessage(...args);
        };

        await cmd.handler(m, extra);
        conn.sendMessage = originalSendMessage;
        addhit(cmd.name, true);
        if (responded) {
            await new Promise((resolve) => setTimeout(resolve, 150));
        }
        await safeReact("✅");
    } catch (e) {
        if (originalSendMessage) conn.sendMessage = originalSendMessage;
        addhit(cmd.name, false);
        await safeReact("❌");
        await errormes(conn, { e, ctx: m, cmnd: command })
    }
}

module.exports = handler;
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.white(chalk.bgRedBright(` Update '${__filename}' `)));
delete require.cache[file];
    require(file)
});
