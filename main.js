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

const ReadFitur = () => {
    let pathdir = path.join(__dirname, "./commands");
    let fitur = fs.readdirSync(pathdir);
    for (let fold of fitur) {
        for (let filename of fs.readdirSync(__dirname + `/commands/${fold}`)) {
            plugins = require(path.join(__dirname + `/commands/${fold}`, filename));
            plugins.function ? (attr.functions[filename] = plugins) : (attr.commands[filename] = plugins);
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
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
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
        userNumber = userNumber.replace(/[^0-9]/g, '');

        if (!Object.keys(PHONENUMBER_MCC).some((mcc) => userNumber.startsWith(mcc))) {
            console.log(chalk.bgBlack(chalk.redBright('Start with country code of your WhatsApp Number, Example : 628xxxxxxxx')));
            process.exit(0);
        }

        setTimeout(async () => {
            let pairingCode = await conn.requestPairingCode(userNumber, "KURABOTS");
            pairingCode = pairingCode?.match(/.{1,4}/g)?.join('-') || pairingCode;
            console.log(chalk.bgBlack(chalk.greenBright('Copy Pairing Code :')), chalk.black(chalk.white(pairingCode)));
        }, 2000);  
    }
  
    conn.ev.on("creds.update", saveCreds);
    conn.ev.on('connection.update', (update) => {
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
    });
  
    conn.ws.on("CB:call", async (json) => {
        require("./event/call")(json, conn);
    });
  
  // contacts
	if (fs.existsSync(pathContacts)) {
        conn.contacts = JSON.parse(fs.readFileSync(pathContacts, 'utf-8'));
	} else {
	    fs.writeFileSync(pathContacts, JSON.stringify({}));
	}

    conn.ev.on("contacts.update", async (m) => {
        if (Array.isArray(m)) {
            for (let kontak of m) {
                if (kontak?.id) {
                    if (conn && conn.contacts) conn.contacts[kontak.id] = { ...(conn.contacts?.[kontak.id] || kontak) };
                    fs.writeFileSync(pathContacts, JSON.stringify(conn.contacts));
                }
            }
        }
    })
  
    conn.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        const type = msg.message ? Object.keys(msg.message)[0] : "";
        if (msg && type == "protocolMessage") conn.ev.emit("message.delete", msg.message.protocolMessage.key);
        require("./lib/handler")(conn, m);
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
    .on('error', function(error) { console.error('Error happened', error); })
    .on('add', function(path) { global.reload(path) })
    .on('change', function(path) { global.reload(path) })
    .on('unlink', function(path) { global.reload(path) })
    process.on("uncaughtException", function(err) {
        console.error(err);
    });
