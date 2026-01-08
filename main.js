/**
  # Identity/config is centralized in ./config.js
*/
require("./config.js")
global.attr = {};
attr.commands = new Map();
attr.functions = new Map();
attr.isSelf = setting.self;
const BAILEYS_PKG = packages.baileys;
const {
    default: makeWaSocket,
    useMultiFileAuthState,
    jidNormalizedUser,
    PHONENUMBER_MCC,
    DisconnectReason,
    makeCacheableSignalKeyStore,
   // makeInMemoryStore,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    getContentType,
    downloadContentFromMessage,
    jidDecode,
    getAggregateVotesInPollMessage,
    proto
} = require(BAILEYS_PKG);
const Webconn = require("ws");
const pino = require("pino");
const path = require('path');
const fs = require("fs");
const qrcode = require("qrcode-terminal")
const chalk = require("chalk");
const NodeCache = require('node-cache');
const util = require('util');
const chokidar = require("chokidar");
const moment = require("moment-timezone");
const { exec, spawn, execSync } = require("child_process");
const { addhit } = require("./database/hit.js");
require('./lib/proto')
const pathContacts = "./session/contacts.json"

const LOG = {
    line() {
        console.log(chalk.gray("----------------------------------------------"));
    },
    header() {
        console.log("");
        this.line();
        console.log(chalk.white.bold("kuraBOT Service"));
        this.line();
    },
    status(label, msg, color) {
        const tag = chalk[color](`[ ${label} ]`);
        console.log(`${tag} ${chalk.white(msg)}`);
    },
};
let hasBanner = false;
let hasSync = false;
let hasOnline = false;
let hasAuth = false;
let hasReady = false;

const reportError = async (label, err, meta = {}) => {
    const normalizeText = (val, max = 1000) => {
        if (val === undefined || val === null) return "";
        let text = String(val).replace(/\s+/g, " ").trim();
        if (text.length > max) text = text.slice(0, max) + "...";
        return text;
    };
    const inferReason = (e) => {
        const code = e?.code || e?.errno || e?.name || "";
        const status = e?.response?.status || e?.status;
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
    const stack = normalizeText(err?.stack || err);
    const reason = inferReason(err);
    const time = moment.tz("Asia/Jakarta").format("DD MMM YYYY HH:mm:ss");
    const extra = Object.entries(meta)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
    console.error(`[${label}] ${stack}`);
    if (global.conn && owner?.[0]) {
        const text = [
            "*Error Report*",
            `Type: ${label}`,
            `Time: ${time} WIB`,
            `Reason: ${reason}`,
            extra ? extra : null,
            "Stack:",
            "```",
            stack || "-",
            "```",
        ].filter(Boolean).join("\n");
        try {
            await global.conn.sendMessage(owner[0], { text });
        } catch {}
    }
};
global.reportError = reportError;

const ReadFitur = () => {
    let pathdir = path.join(__dirname, "./commands");
    let fitur = fs.readdirSync(pathdir);
    for (let fold of fitur) {
        for (let filename of fs.readdirSync(__dirname + `/commands/${fold}`)) {
            try {
                plugins = require(path.join(__dirname + `/commands/${fold}`, filename));
                plugins.function ? (attr.functions[filename] = plugins) : (attr.commands[filename] = plugins);
            } catch (e) {
                reportError("loadCommand", e, { file: `${fold}/${filename}` });
            }
        }
    }
    if (!hasBanner) {
        LOG.header();
        hasBanner = true;
    }
    LOG.status("OK", "Commands loaded", "greenBright");
};
ReadFitur();

const readline = require("readline");
const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(text, resolve)
    })
};

const safeReadJsonFile = (filePath, fallbackValue) => {
    try {
        if (!fs.existsSync(filePath)) return fallbackValue;
        const raw = fs.readFileSync(filePath, "utf-8");
        if (!raw || !raw.trim()) return fallbackValue;
        return JSON.parse(raw);
    } catch (e) {
        try {
            const backupPath = `${filePath}.corrupt.${Date.now()}.bak`;
            fs.copyFileSync(filePath, backupPath);
        } catch {}
        try {
            fs.writeFileSync(filePath, JSON.stringify(fallbackValue, null, 2));
        } catch {}
        return fallbackValue;
    }
};

const normalizeWhatsappNumber = (input) => {
    const digits = String(input || "").replace(/\D/g, "");
    if (!digits) return "";

    // If user enters local Indonesian format (08xxxx), convert to 62xxxx.
    if (digits.startsWith("0")) return `62${digits.slice(1)}`;

    // If user enters without country code (8xxxx), assume Indonesia (62).
    if (digits.startsWith("8")) return `62${digits}`;

    return digits;
};

// Connect To Bot
//global.store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const printQrInTerminal = process.argv.includes('--qr');
const useMobile = process.argv.includes('--mobile');
  
const connect = async() => {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, './session'));
    const msgRetryCounterCache = new NodeCache();
    global.conn = makeWaSocket({
        logger: pino({ level: 'silent' }),
        mobile: useMobile,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(
                state.keys,
                pino({ level: 'fatal' }).child({ level: 'fatal' })
            ),
        },
        browser: ['Linux', 'Safari', '17.0'],
        version,
        patchMessageBeforeSending: (msg) => {
            const isViewOnceMessage =
            msg.buttonsMessage || msg.templateMessage || msg.listMessage;
            if (isViewOnceMessage) {
                msg = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                        ...msg,
                        },
                    },
                };
            }
        return msg;
        },
        /*
        getMessage: async (key) => {
            const jid = jidNormalizedUser(key.remoteJid);
            const message = await store.loadMessage(jid, key.id);
            return message?.message || '';
        },*/
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        msgRetryCounterCache,
    });
  
    conn.mess = [];
    conn.cooldown = {};
    conn.verify = {};
   // require("./routes/main.js")(conn);
    global.decodeJid = async (jid) => {
        if (/:\d+@/gi.test(jid)) {
            const decode = jidDecode(jid) || {};
            return (
                (decode.user && decode.server && decode.user + "@" + decode.server) || jid
            ).trim();
        } else return jid.trim();
    };
   //store.bind(conn.ev);
    
    if (!printQrInTerminal && !conn.authState.creds.registered) {
        if (useMobile) {
            console.log('Cannot use pairing code with mobile API');
        }
          
        console.log(chalk.cyan("\n• "), chalk.white('Silakan Tulis Nomor Whatsapp Anda'));
        console.log(chalk.cyan("• "), chalk.white('Contoh : 628xxxxx'));

        let userNumber;
        userNumber = await question(chalk.bgBlack(chalk.greenBright('Your WhatsApp Number : ')));
        userNumber = normalizeWhatsappNumber(userNumber);

        if (!Object.keys(PHONENUMBER_MCC).some((mcc) => userNumber.startsWith(mcc))) {
            console.log(chalk.bgBlack(chalk.redBright('Start with country code of your WhatsApp Number, Example : 628xxxxxxxx')));
            process.exit(0);
        }

        console.log(chalk.gray("Using number:"), chalk.whiteBright(userNumber));

        setTimeout(async () => {
            try {
                let pairingCode = await conn.requestPairingCode(userNumber, "KURABOTS");
                pairingCode = pairingCode?.match(/.{1,4}/g)?.join('-') || pairingCode;
                console.log(chalk.bgBlack(chalk.greenBright('Copy Pairing Code :')), chalk.black(chalk.white(pairingCode)));
            } catch (e) {
                await reportError("pairingCode", e);
            }
        }, 2000);  
    }
  
    conn.ev.on("creds.update", saveCreds);
    conn.ev.on('connection.update', (update) => {
        try {
            if (update?.qr && printQrInTerminal) {
                console.info("Loading QR Code for WhatsApp, Please Scan...")
                qrcode.generate(update.qr, { small: true })
            } else if (update.connection == 'connecting') {
                LOG.status("INFO", "Connecting to WhatsApp", "cyan");
            } else if (update.connection === 'open') {
                if (!hasAuth) {
                    LOG.line();
                    LOG.status("AUTH", "Session authenticated", "magentaBright");
                    console.log(chalk.magentaBright(conn.user.id));
                    LOG.line();
                    hasAuth = true;
                }
                if (!hasReady) {
                    LOG.status("READY", "kuraBOT is fully operational", "greenBright");
                    hasReady = true;
                }
            } else if (update.connection === 'close') {
                LOG.status("ERR", "Disconnected", "redBright");
                connect();
            } else {
                if (update?.receivedPendingNotifications && !hasSync) {
                    LOG.status("INFO", "Syncing pending notifications", "cyan");
                    hasSync = true;
                }
                if (update?.isOnline && !hasOnline) {
                    LOG.status("OK", "Network status: Online", "greenBright");
                    hasOnline = true;
                }
            } 
        } catch (e) {
            reportError("connection.update", e);
        }
    });
  
    conn.ws.on("CB:call", async (json) => {
        try {
            require("./event/call")(json, conn);
        } catch (e) {
            await reportError("CB:call", e);
        }
    });
  
  // contacts
	if (fs.existsSync(pathContacts)) {
        conn.contacts = safeReadJsonFile(pathContacts, {});
	} else {
	    fs.writeFileSync(pathContacts, JSON.stringify({}));
	}

    conn.ev.on("contacts.update", async (m) => {
        try {
            if (Array.isArray(m)) {
                for (let kontak of m) {
                    if (kontak?.id) {
                        if (conn && conn.contacts) conn.contacts[kontak.id] = { ...(conn.contacts?.[kontak.id] || kontak) };
                        fs.writeFileSync(pathContacts, JSON.stringify(conn.contacts));
                    }
                }
            }
        } catch (e) {
            await reportError("contacts.update", e);
        }
    })
  
    conn.ev.on("messages.upsert", async (m) => {
        try {
            const msg = m.messages[0];
            const type = msg.message ? Object.keys(msg.message)[0] : "";
            if (msg && type == "protocolMessage") conn.ev.emit("message.delete", msg.message.protocolMessage.key);
            await require("./lib/handler")(conn, m);
        } catch (e) {
            await reportError("messages.upsert", e);
        }
    });
   
    return conn;
}

connect();

/* Auto Update File */
let file = require.resolve(__filename);
Object.freeze(global.reload)
delete require.cache[file]
var watcher = chokidar.watch('./commands', { ignored: /^\./, persistent: true });
watcher
    .on('error', function(error) { reportError("watcher", error); })
    .on('add', function(path) { global.reload(path) })
    .on('change', function(path) { global.reload(path) })
    .on('unlink', function(path) { global.reload(path) })
    process.on("unhandledRejection", function(reason) {
        reportError("unhandledRejection", reason);
    });
    process.on("uncaughtException", function(err) {
        reportError("uncaughtException", err);
    });
