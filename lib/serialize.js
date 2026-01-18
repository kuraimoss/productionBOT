const {
  jidDecode,
  downloadContentFromMessage,
  getContentType,
  generateForwardMessageContent,
  generateWAMessageFromContent,
} = require(packages.baileys)
const Baileys = require(packages.baileys)
const fs = require("fs")
const chalk = require("chalk")
const moment = require("moment")
const downloadMedia = (message, pathFile) =>
    new Promise(async (resolve, reject) => {
        let type = Object.keys(message)[0];
        let mimeMap = {
            imageMessage: "image",
            videoMessage: "video",
            stickerMessage: "sticker",
            documentMessage: "document",
            audioMessage: "audio",
        };
        let mes = message;
        if (type == "templateMessage") {
            mes = message.templateMessage.hydratedFourRowTemplate;
            type = Object.keys(mes)[0];
        }
        if (type == "buttonsMessage") {
            mes = message.buttonsMessage;
            type = Object.keys(mes)[0];
        }
        try {
            if (pathFile) {
                const stream = await downloadContentFromMessage(mes[type], mimeMap[type]);
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                await fs.promises.writeFile(pathFile, buffer);
                resolve(pathFile);
            } else {
                const stream = await downloadContentFromMessage(mes[type], mimeMap[type]);
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                resolve(buffer);
            }
        } catch (e) {
            reject(e);
        }
    });
    async function serialize(msg, conn) {
        conn.loadMessage = async(jid, id) => {
            return conn.mess.find(v => (v.key.remoteJid == jid) && (v.key.id == id))
        };

        conn.decodeJid = (jid) => {
            if (/:\d+@/gi.test(jid)) {
                const decode = jidDecode(jid) || {};
                return (
                    (decode.user && decode.server && decode.user + "@" + decode.server) ||
                    jid
                ).trim();
            } else return jid;
        };
  /**
   * getBuffer hehe
   * @param {String|Buffer} path
   * @param {Boolean} returnFilename
   */
        const groupQuery = async (jid, type, content) => (conn.query({
            tag: 'iq',
            attrs: {
                type,
                xmlns: 'w:g2',
                to: jid,
            },
            content
        }));
        conn.searchMessage = async (m, query) => {
            if (conn.messages[m.from].array == '') return ({ status: false, message: 'message not found!' })
            const find = conn.messages[m.from].array.filter(src => src.message && (src.message.conversation ? src.message.conversation.includes(query) : src.message.extendedTextMessage ? src.message.extendedTextMessage.text.includes(query) : src.message.imageMessage ? src.message.imageMessage.caption.includes(query) : src.message.videoMessage ? src.message.videoMessage.caption.includes(query) : ''))
            return find == '' ? ({ status: false, message: 'message not found!' }) : find
        }
        conn.copyNForward = async (jid, message, forceForward = false, options = {}) => {
            let vtype;
            if (options.readViewOnce) {
                message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : message.message || undefined;
                vtype = Object.keys(message.message.viewOnceMessage.message)[0];
                delete (message.message && message.message.ignore ? message.message.ignore : message.message || undefined);
                delete message.message.viewOnceMessage.message[vtype].viewOnce;
                message.message = {
                    ...message.message.viewOnceMessage.message,
                };
            }
            let mtype = Object.keys(message.message)[0];
            let content = await generateForwardMessageContent(message, forceForward);
            let ctype = Object.keys(content)[0];
            let context = {};
            if (mtype != msg.type) context = message.message[mtype].contextInfo;
            content[ctype].contextInfo = {
                ...context,
                ...content[ctype].contextInfo,
                ...(options.contextInfo ?
                    {
                         ...options.contextInfo,
                    } :
                {}),
            };
            const waMessage = await generateWAMessageFromContent(jid, content, options ? {
                ...content[ctype],
                ...options,
                ...(options.contextInfo ?
                    {
                        contextInfo: {
                            ...content[ctype].contextInfo,
                            ...options.contextInfo,
                        },
                    } :
                {}),
            } :
            {});
            await conn.relayMessage(jid, waMessage.message, {
                messageId: waMessage.key.id,
            });
            return waMessage;
        };
  /*
  conn.sendButton = async (jid, text, footer, buttons, opt) => {
    return await conn.sendMessage(
      jid, {
      text: text,
      footer: footer,
      templateButtons: buttons,
      withTag: opt ? (opt.withTag ? true : false) : false,
      adReply: opt ? (opt.adReply ? true : false) : false,
    }, {
      ...opt
    }
    )
  }
  conn.sendButtonImage = async (jid, image, caption, footer, buttons, opt) => {
    if (opt && opt.isLoc) {
      return await conn.sendMessage(
        jid, {
        location: {
          degreesLatitude: 0,
          degreesLongitude: 0,
          jpegThumbnail: await tool.resize(image, 200, 200)
        },
        caption: caption,
        footer: footer,
        templateButtons: buttons,
        withTag: opt ? (opt.withTag ? true : false) : false,
        adReply: opt ? (opt.adReply ? true : false) : false,
      }, {
        ...opt
      }
      );
    }
    return await conn.sendMessage(
      jid, {
      image: image,
      caption: caption,
      footer: footer,
      templateButtons: buttons,
      withTag: opt ? (opt.withTag ? true : false) : false,
      adReply: opt ? (opt.adReply ? true : false) : false,
    }, {
      ...opt
    }
    );
  };
  conn.sendButtonImageV2 = async (
    from,
    img,
    teks,
    footer,
    display,
    buttonid,
    opt
  ) => {
    datai = [];
    for (let i = 0; i < display.length; i++) {
      datai.push({
        buttonId: buttonid[i],
        buttonText: {
          displayText: display[i]
        },
        type: 1,
      });
    }
    if (opt && opt.isLoc) {
      bts = {
        location: {
          degreesLatidude: 0,
          degreesLongitude: 0,
          jpegThumbnail: await tool.resize(img, 200, 200)
        },
        caption: teks,
        footer: footer,
        buttons: datai,
        headerType: "LOCATION",
      };
    } else {
      bts = {
        image: img,
        caption: teks,
        footer: footer,
        buttons: datai,
        headerType: "IMAGE",
      };
    }
    return await conn.sendMessage(from, bts, {
      ...opt
    });
  };
  conn.sendButtonVideoV2 = async (
    from,
    vid,
    teks,
    footer,
    display,
    buttonid,
    opt
  ) => {
    datai = [];
    for (let i = 0; i < display.length; i++) {
      datai.push({
        buttonId: buttonid[i],
        buttonText: {
          displayText: display[i]
        },
        type: 1,
      });
    }
    bts = {
      video: vid,
      caption: teks,
      footer: footer,
      buttons: datai,
      headerType: "VIDEO",
    };
    return await conn.sendMessage(from, bts, {
      ...opt
    });
  };
  conn.sendButtonVideo = async (jid, video, caption, footer, buttons, opt) => {
    return await conn.sendMessage(
      jid, {
      video: video,
      gifPlayback: opt ? (opt.gifPlayback ? true : false) : false,
      caption: caption,
      footer: footer,
      templateButtons: buttons,
      withTag: opt ? (opt.withTag ? true : false) : false,
      adReply: opt ? (opt.adReply ? true : false) : false,
    }, {
      ...opt
    }
    );
  };
  */
  conn.getName = async (id) => {
      let jid = id;
      if (jid.endsWith("@lid")) {
          jid = Object.values(conn.contacts).find(v => v.lid == id)?.id
      }
      const user = conn.contacts[jid]
      if (user) {
          const name = user.notify ? user.notify : jid.endsWith("g.us") ? jid : await require('awesome-phonenumber')('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
          return (name)
      }
      return (jid)
  }
  conn.sendContact = async (jid, contact, quoted = false, opts = {}) => {
    let list = [];
    for (let i of contact) {
      num = typeof i == "number" ? i + "@s.whatsapp.net" : i;
      num2 = typeof i == "number" ? i : i.split("@")[0];
      list.push({
        displayName: await conn.getName(num),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${await conn.getName(
          num
        )}\nFN:${await conn.getName(
          num
        )}\nitem1.TEL;waid=${num2}:${num2}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:${global.medsos.email
          }\nitem2.X-ABLabel:Email\nitem3.URL:${global.medsos.instagram
          }\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
      });
    }
    return conn.sendMessage(
      jid, {
      contacts: {
        displayName: `${list.length} Kontak`,
        contacts: list,
      },
      ...opts,
    }, {
      quoted
    }
    );
  };
  conn.logger = {
    ...conn.logger,
    info(...args) {
      const compactArgs = args.map((a, idx) => {
        if (!a || typeof a !== "object") return a;
        const isClosingSession =
          typeof args[0] === "string" && /closing session/i.test(args[0]);
        if (!isClosingSession) return a;
        const regId = a.registrationId ?? "-";
        const baseKey =
          a.indexInfo?.baseKey?.toString?.("hex")?.slice(0, 10) || "-";
        const preKeyId = a.pendingPreKey?.preKeyId ?? "-";
        return `SessionEntry { registrationId: ${regId}, baseKey: ${baseKey}..., preKeyId: ${preKeyId} }`;
      });
      console.log(
        chalk.bold.rgb(
          57,
          183,
          16
        )(
          `INFO [${chalk.rgb(
            255,
            255,
            255
          )(moment(Date.now()).format(" dddd, DD MMMM YYYY HH:mm:ss "))}]`
        ),
        chalk.cyan(...compactArgs)
      );
    },
    error(...args) {
      console.log(
        chalk.bold.rgb(
          247,
          38,
          33
        )(
          `ERROR [${chalk.rgb(
            255,
            255,
            255
          )(moment(Date.now()).format(" dddd, DD MMMM YYYY HH:mm:ss "))}]:`
        ),
        chalk.rgb(255, 38, 0)(...args)
      );
    },
    warn(...args) {
      console.log(
        chalk.bold.rgb(
          239,
          225,
          3
        )(
          `WARNING [${chalk.rgb(
            255,
            255,
            255
          )(moment(Date.now()).format(" dddd, DD MMMM YYYY HH:mm:ss "))}]:`
        ),
        chalk.keyword("orange")(...args)
      );
    },
  };
if (!msg.key) return console.log("Serialize: message without key");
  if (msg.key) {
    msg.id = msg.key.id;
    msg.isSelf = msg.key.fromMe;
    msg.from = msg.key.remoteJid;
    msg.isGroup = msg.from.endsWith("@g.us");
    msg.chat = msg.isGroup ? msg.from : msg.key.remoteJidAlt;
    msg.sender = msg.isGroup ? (msg.isSelf ? conn.decodeJid(conn.user.id) : conn.decodeJid(msg.key.participantAlt)) : (msg.isSelf ? conn.decodeJid(conn.user.id) : msg.key.remoteJidAlt);
  }
  if (msg.message) {
    msg.type = getContentType(msg.message);
    if (msg.type === "ephemeralMessage") {
      msg.message = msg.message[msg.type].message;
      const tipe = Object.keys(msg.message)[0];
      msg.type = tipe;
      if (tipe === "viewOnceMessage") {
        msg.message = msg.message[msg.type].message;
        msg.type = getContentType(msg.message);
      }
    }
    if (msg.type === "viewOnceMessage") {
      msg.message = msg.message[msg.type].message;
      msg.type = getContentType(msg.message);
    }
    try {
      msg.mentions = msg.message[msg.type].contextInfo ? msg.message[msg.type].contextInfo.mentionedJid || [] : [];
    } catch {
      msg.mentions = [];
    }
    try {
      const quoted = msg.message[msg.type].contextInfo;
      if (quoted.quotedMessage["ephemeralMessage"]) {
        const tipe = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0];
        if (tipe === "viewOnceMessage") {
          msg.quoted = {
            type: "view_once",
            stanzaId: quoted.stanzaId,
            sender: conn.decodeJid(quoted.participant),
            message: quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message,
          };
        } else {
          msg.quoted = {
            type: "ephemeral",
            stanzaId: quoted.stanzaId,
            sender: conn.decodeJid(quoted.participant),
            message: quoted.quotedMessage.ephemeralMessage.message,
          };
        }
      } else if (quoted.quotedMessage["viewOnceMessage"]) {
        msg.quoted = {
          type: "view_once",
          stanzaId: quoted.stanzaId,
          sender: conn.decodeJid(quoted.participant),
          message: quoted.quotedMessage.viewOnceMessage.message,
        };
      } else {
        msg.quoted = {
          type: "normal",
          stanzaId: quoted.stanzaId,
          sender: conn.decodeJid(quoted.participant),
          message: quoted.quotedMessage,
        };
      }
      msg.quoted.isSelf = msg.quoted.sender.endsWith("@lid") ? msg.quoted.sender === conn.decodeJid(conn.user.lid) : msg.quoted.sender === conn.decodeJid(conn.user.id);
      msg.quoted.mtype = Object.keys(msg.quoted.message).filter((v) => v.includes("Message") || v.includes("conversation"))[0];
      msg.quoted.text =
        msg.quoted.message[msg.quoted.mtype].text ||
        msg.quoted.message[msg.quoted.mtype].description ||
        msg.quoted.message[msg.quoted.mtype].caption ||
        (msg.quoted.mtype == "templateButtonReplyMessage" &&
          msg.quoted.message[msg.quoted.mtype].selectedDisplayText) ||
        msg.quoted.message[msg.quoted.mtype] ||
        "";
      msg.quoted.key = {
        id: msg.quoted.stanzaId,
        fromMe: msg.quoted.isSelf,
        remoteJid: msg.from,
      };
      msg.quoted.isBot = (msg.quoted.key.id.startsWith("BAE5") && [16,18].includes(msg.quoted.key.id.length)) || (msg.quoted.key.id.startsWith("3EB0") && [20,22,40].includes(msg.quoted.key.id.length)) ?
        true :
        false;
         let quoteds = msg.message[msg.type].contextInfo ? msg.message[msg.type].contextInfo.quotedMessage : null
      msg.quoted.fakeObj = Baileys.proto.WebMessageInfo.fromObject({
                key: {
                    remoteJid: msg.quoted.key.remoteJid,
                    fromMe: msg.quoted.key.fromMe,
                    id: msg.quoted.key.id
                },
                message: quoteds,
                ...(msg.isGroup ? { participant: msg.quoted.sender } : {})
            })
      msg.quoted.delete = () => conn.sendMessage(msg.from, { delete: msg.quoted.key });
      msg.quoted.download = (pathFile) => downloadMedia(msg.quoted.message, pathFile);
      msg.quoted.copyNForward = async (jid = msg.from, forceForward = false, opt) => conn.copyNForward(jid, await msg.getQuotedObj(), forceForward, opt);
      msg.quoted.react = async (react) => {
        return await conn.sendMessage(msg.from, {
          react: {
            text: react,
            key: msg.quoted.key
          },
        });
      };
    } catch (e) {
      msg.quoted = null;
    }
    try {
      msg.body =
        msg.message.conversation ||
        msg.message[msg.type].text ||
        msg.message[msg.type].caption ||
        (msg.type === "listResponseMessage" &&
          msg.message[msg.type].singleSelectReply.selectedRowId) ||
        (msg.type === "buttonsResponseMessage" &&
          msg.message[msg.type].selectedButtonId &&
          msg.message[msg.type].selectedButtonId) ||
        (msg.type === "templateButtonReplyMessage" &&
          msg.message[msg.type].selectedId) ||
        (msg.type === "interactiveResponseMessage" && JSON.parse(msg.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id) ||
        "";
    } catch {
      msg.body = "";
    }
    const contentQ = msg.quoted ? JSON.stringify(msg.quoted) : []
    msg.attribute = {
      isOwner: owner.includes(msg.sender),
      isBot: (msg.key.id.startsWith("BAE5") && [16,18].includes(msg.key.id.length)) || (msg.key.id.startsWith("3EB0") && [20,22,40].includes(msg.key.id.length)) ? true : false,
      isVideo: msg.type === "videoMessage",
      isImage: msg.type === "imageMessage",
      isLocation: msg.type === "locationMessage",
      isMedia: msg.type === "imageMessage" || msg.type === "videoMessage",
      isQAudio: msg.type === "extendedTextMessage" && contentQ.includes("audioMessage"),
      isQVideo: msg.type === "extendedTextMessage" && contentQ.includes("videoMessage"),
      isQImage: msg.type === "extendedTextMessage" && contentQ.includes("imageMessage"),
      isQDocument: msg.type === "extendedTextMessage" && contentQ.includes("documentMessage"),
      isQSticker: msg.type === "extendedTextMessage" && contentQ.includes("stickerMessage"),
      isQLocation: msg.type === "extendedTextMessage" && contentQ.includes("locationMessage")
    }
    msg.user = {
      id: msg.sender,
      device: Baileys.getDevice(msg.key.id),
      jadibot: conn.id ? true : false
    }
    if (msg.quoted) {
    msg.quoted.user = {
      id: msg.quoted.sender,
      device: Baileys.getDevice(msg.quoted.key.id),
      jadibot: conn.id ? true : false
    }
    }
    msg.getQuotedObj = msg.getQuotedMessage = async () => {
      if (!msg.quoted.stanzaId) return false;
      let q = await conn.loadMessage(msg.from, msg.quoted.stanzaId, conn);
      return serialize(q, conn);
    };
    msg.react = async (react) => {
      return await conn.sendMessage(msg.from, {
        react: {
          text: react,
          key: msg.key
        },
      });
    };
    msg.copyNForward = (jid = msg.from, forceForward = false, opt) => conn.copyNForward(jid, msg, forceForward, opt);
    msg.reply = async (content, opt = {}) => {
      if (content) {
        if (typeof content == "string") {
          content = { text: require("util").format(content), ...opt }
        }
      }
      return await conn.sendMessage(msg.from, content, {
        ...opt,
        quoted: msg
      }
      );
    };
    msg.download = (pathFile) => downloadMedia(msg.message, pathFile);
    if (msg.quoted) {
      msg.quoted.download = (pathFile) => downloadMedia(msg.quoted.message, pathFile);
    }
  }
  return msg;
}

module.exports = {
  serialize,
  downloadMedia
};
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log("Update 'index.js'");
  delete require.cache[file];
})
