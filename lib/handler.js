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
    const command = commands != "" ? commands.toLowerCase().split(" ")[0].slice(1) : "";
    const args = budy.trim().split(/ +/).slice(1);
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

    global.errormes = async (conn, { e, ctx, cmnd }) => {
        const status = e?.response?.status || e?.status || null;
        const data = e?.response?.data;
        let detail = "";
        if (data) {
            if (typeof data === "string") detail = data;
            else {
                try {
                    detail = JSON.stringify(data);
                } catch {
                    detail = String(data);
                }
            }
        } else if (e?.message) {
            detail = e.message;
        } else {
            detail = String(e);
        }
        if (detail.length > 800) detail = detail.slice(0, 800) + "...";
        const reason = status ? ` (status ${status})` : "";
        await ctx.reply(`${response.error}\n\nError detail${reason}: ${detail}`);
        await conn.sendMessage(owner[0], { text: `\`Error Log :\`\n${String(e?.stack || e)}` }, { quoted: ctx })
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
        await func.handler(m, extra);
    }

    const cmd = Object.values(attr.commands).find((cmn) => (cmn.cmd && cmn.cmd.includes(command) && !cmn.disabled) || (cmn.stickCmd && m.message.stickerMessage ? cmn.stickCmd.includes(m.message.stickerMessage.fileSha256.toString("base64")) : "" && !cmn.disabled));
    if ((m.attribute.isBot && db.data.group[m.from] && db.data.group[m.from].accessCmd && db.data.group[m.from]?.accessCmd?.includes(m.sender)) || (!m.isGroup && m.attribute.isBot && db.data.accessCmd.includes(m.sender)) || !m.attribute.isBot || isCreator) if (cmd == undefined) return require('../commands/functions/typo').handler(m, extra)
    if (!isCreator && m.type != 'buttonsResponseMessage' && m.from in conn.cooldown) {
        const sisa = await ms(conn.cooldown[m.from].timestamp - Date.now())
        if ((m.attribute.isBot && db.data.group[m.from] && db.data.group[m.from].accessCmd && db.data.group[m.from]?.accessCmd.includes(m.sender)) || (!m.isGroup && m.attribute.isBot && db.data.accessCmd.includes(m.sender)) || !m.attribute.isBot) m.reply(`_command sedang cooldown.._\n_Silahkan tunggu *${sisa.seconds}* detik_`)
        return;
    }
    require('../commands/functions/antispam').handler(m, extra);

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
        await errormes(conn, { e, ctx: m, cmnd })
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
