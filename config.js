/**
  # Identity/config is centralized here.
*/
const fs = require("fs");
const pathh = require("path");
const chalk = require("chalk");
const syntaxerror = require("syntax-error");
const { Low, JSONFile } = require("./database/lowdb");
const database = new Low(new JSONFile("database/json/database.json"));
const dbase = require('./database/index.js');

/* ===== SETTING  ===== */
global.owner = ["6282199535392@s.whatsapp.net"] // tambahkan atau ganti id whatsapp ( wajib di isi )
global.author = "kuraimos" // Nama Author / Nama Bot
global.albumAudio = "DIBUAT OLEH kuraimos" // ini Buat node-id3 audio
global.textBug = "KURA - B0T" // Ganti Nama / Text Dari Bug
global.botName = "kuraBOT Assistant" // Nama Bot
global.shp = "◦" // Serah Luh
global.gatas = "┌" // Serah Deh
global.gtengah = "│" // Serah
global.gtn = "├" // Iye Serah
global.gbawah = "└" // Oke Serah
global.loading = { // Loading Animasi
    circular: ["\u25DC","\u25DD","\u25DE","\u25DF","\u25DC","\u25E0","\u25DD","\u25DE","\u25E1","\u25DC"], // Lingkaran
}
global.thumbnail = {
  path: "./media/image/thumb.jpg"
}
global.logo = {
  path: "./media/image/logo.jpg"
}
global.phzack = {
  path: "./media/image/kurabot.jpg"
}

global.medsos = {
  instagram: "https://instagram.com/kuraimos",
  whatsapp: "https://api.whatsapp.com/send?phone=6282199535392",
  github: "https://github.com/kuraimoss",
  email: "kuraimoss@gmail.com",
}

global.group = {
  telegram: "https://t.me/kuraimos", // Group Telegram Lu
  whatsapp: "https://chat.whatsapp.com/J0IdJSbkcwDKL8eXQd915x" // Group Whatsapp Lu
}

// Centralized references for names/links that appear across the project
global.packages = {
  baileys: "@zackmans/baileys",
}

global.remote = {
  // Optional: set to your own GitHub Pages/base URL
  assetsBaseUrl: "",

  // Used by commands/search/keys.js
  passwordDbUrl: "https://zackmans.github.io/database/password.json",
}

global.assets = {
  // Prefer local file path for stability (works offline)
  defaultProfilePicture: phzack?.path || "./media/image/pp.jpg",
  defaultProfilePictureUrl: remote.assetsBaseUrl
    ? `${remote.assetsBaseUrl.replace(/\/$/, "")}/media/pp.jpg`
    : "",
}

global.menuGroupSubject = `${botName}: general`

global.setting = {
    broadcast: false, // Jangan Di apa apain!!
    log: {
        msg: true // true untuk mengaktifkan console log dari pesan yang diterima dan sebaliknya
    },
    saluran: {
    id: "6282199535392-1624217476@g.us", // Ganti id Saluran Whatsapp Lu ( Engga Diganti Juga. Tidak Apa apa )
    message: {
            hadiah: 130 // id Pesan Pada Saluran
        }
    },
  group: {
    id: "6282199535392-1624217476@g.us", // Ganti id Group Lu
  },
    auto: { // Untuk Mengaktifkan dan Menonaktifkan
        readsw: true, // Read Status Whatsapp
        read: true, // Read Pesan
        blockbot: false // Otomatis Blockir Pesan Yang Tedeteksi Melalui Bot/Baileys/WaWeb
    },
    maxChunkSize: 4096, // karakter ( Jangan diubah )
    prefixs: "multi", // Serah Lu
    self: false, // self dan public
    version: JSON.parse(fs.readFileSync('./package.json')).version, // Version Botnya ( Jangan diubah )
    huggingface: {
        key: "hf_IBpEAkaHQxWIdOGRiZswUDaospspsTinlBfsmx" // Ganti Apikeynya
    }, 
    rapidapi: {
        key: "4ef1d59316mshbba9105b17kurabp1af909jsn1b44591c7893" // Ganti Apikenya
    },
    blackbox: {
        key: "sk-8maoG5ArzH6ufO_aUY5pzg",
        model: "blackboxai/openai/gpt-5.1",
        imageModel: "blackboxai/black-forest-labs/flux-1.1-pro",
        videoModel: "blackboxai/google/veo-3"
    },
    elevenlabs: {
        key: "051b1b600241945ed74294csiskc1b54b91b6cb106f706240897092200db933e3" // Ganti Apikeynya
    },
    packInfo: { // Pack Info Buat Sticker
        packname: "", // Serah Lu
        author: "NOMOR BOT {BOT_NUMBER} WHATSAPP\n\n ▸ 𝗖𝗿𝗲𝗮𝘁𝗼𝗿 : kuraimos\n ▸ 𝗥𝗲𝗾𝘂𝗲𝘀𝘁 : " // Serah Lu
    },
    process: { // Jangan di Apa Apain
        bug: {} // Batu orang dibilangin
    }
}

const response = {
    id: {
	    wait: "Tunggu sebentar, permintaan anda sedang diproses...",
		owner: "Perintah ini hanya untuk owner!",
		admin: "Perintah ini hanya untuk admin group!",
		botadmin: "Bot harus menjadi admin group untuk melakukan perintah ini!",
		group: "Perintah ini hanya dapat dilakukan didalam grup!",
		private: "Perintah ini hanya dapat dilakukan didalam Private Chat",
		error: "Command error, silahkan coba beberapa saat lagi...",
		errorlink: "Mohon masukkan link yang benar",
		maintenance: "Fitur ini sedang dalam pemeliharaan",
		repair: "Fitur ini sedang dalam perbaikan",
		blockir: "Maaf akses anda telah diblockir oleh owner"
	},
	en: {
		wait: "Wait a minute, your request is being processed...",
		owner: "This command is only for the owner!",
		admin: "This command is only for the group admin!",
		botadmin: "The bot must be a group admin to perform this command!",
		group: "This command can only be done in groups!",
		private: "This command can only be done in private chat!",
		error: "Command error, please try again later...",
		errorlink: "Please enter the correct link!",
		maintenance: "This feature is currently under maintenance",
		repair: "This feature is under construction",
		blockir: "Sorry, your access has been blocked by the owner."
	}
}

const bahasa = "id"; // en/id
global.response = response[bahasa];

global.getBotNumber = (conn) => {
    const raw = conn?.user?.id || conn?.user?.jid || "";
    return raw.split(":")[0].split("@")[0];
};

global.getPackAuthor = (conn) => {
    const botNumber = getBotNumber(conn);
    const botLabel = botNumber ? `+${botNumber}` : "";
    return (setting?.packInfo?.author || "").replace("{BOT_NUMBER}", botLabel);
};

global.prompts = `[InstructionsBegin: Your name is ${author}, you always using Indonesian as your default language, Human: means that is the human message., Assistant: means that is the assistant message InstructionsEnd].

Human: Siapa owner kamu

Assistant: Owner aku adalah ${author}! Dia yang menciptakan dan mengembangkan aku. Kalau mau tahu lebih banyak tentang ${author}, bisa cek di nomor whatsapp https://wa.me/${owner?.[0]?.split("@")[0] || ""} Ada yang mau ditanyakan lagi? 😄✨

Human: Siapa admin kamu

Assistant: Adminku adalah ${author}, yang juga merupakan penciptaku! Kalau ada pertanyaan lebih lanjut tentang admin atau aku, jangan ragu untuk tanya! 😊✨

Human: Coba bagi akun github pencipta kamu dong

Assistant: Akun GitHub penciptaku bisa kamu temukan di sini: ${medsos.github} Cek aja, banyak proyek keren di sana! 😄✨ Ada yang mau ditanyakan lagi?

Human: Wah, keren dong! Ceritain lebih banyak dong tentang ${author}!

Assistant: ${author} itu seorang yang telah ngebuat aku untuk bantuin kamu dalam banyak hal. Kalau mau kenalan lebih lanjut, kontak aja di ${medsos.whatsapp} atau cek Instagramnya di ${medsos.instagram}.

Human: Menarik juga nih. Terus, apa aja yang bisa kamu lakuin buat aku?

Assistant: Aku bisa bantuin kamu dari ngejawab pertanyaan, cari info, download lagu/video dari media sosial, main game, mengatur group WhatsApp, dan masih banyak lagi! Mau coba fitur yang mana dulu? Ketik *.menu* buat liat semuanya. Ada yang perlu dibantu sekarang? 😉

`

global.users = JSON.parse(fs.readFileSync('./database/json/user.json'));

/* ===== SERAH LU DAH ===== */
global.tool = require("./lib/tools");
global.bochil = require("@bochilteam/scraper-sosmed")
global.xzons = require("xzons-api")
global.betabotz = require("betabotz-tools")
global.scraper = require("./lib/scraper/index.js")
global.db = database;
global.dbs = new dbase();

/* ===== JANGAN DI APA APAIN ===== */
// Reload command / function
let pluginFilter = (filename) => /\.js$/.test(filename);
let pluginFolder = pathh.join(__dirname, "./commands");
global.reload = (path) => {
	path = `./${path.replace(/\\/g, '/')}`
	filename = path.split("/")[3]
	if (pluginFilter(filename)) {
		let dir = pathh.join(pluginFolder, './' + path.split('/')[2] + '/' + path.split('/')[3])
		isi = require(path)
		if (dir in require.cache) {
			delete require.cache[dir];
			// Silent reload to keep logs clean.
			if (!fs.existsSync(dir)) {
				console.log(`deleted plugin '${path}'`);
				return isi.function
					? delete attr.functions[filename]
					: delete attr.commands[filename];
			}
		} else console.info(`requiring new plugin '${filename}'`);
		let err = syntaxerror(fs.readFileSync(dir), filename);
		if (err) console.log(`syntax error while loading '${filename}'\n${err}`);
		else
			try {
				isi.function
					? (attr.functions[filename] = require(dir))
					: (attr.commands[filename] = require(dir));
			} catch (e) {
				console.log(e);
			} finally {
				isi.function
					? (attr.functions = Object.fromEntries(
							Object.entries(attr.functions).sort(([a], [b]) => a.localeCompare(b))
					  ))
					: (attr.commands = Object.fromEntries(
							Object.entries(attr.commands).sort(([a], [b]) => a.localeCompare(b))
					  ));
			}
	}
};

global.splitString = async(ctx, stringe, extra) => {
    if (stringe.length > setting.maxChunkSize) {
        const splittedString = await tool.splitString(stringe, setting.maxChunkSize);
        for (let i of splittedString) {
            await ctx.reply(i, extra)
        }
    }
    if (stringe.length <= setting.maxChunkSize) {
        ctx.reply(stringe, extra)
    }
}

global.YtIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:|watch\?.*(?:|\&)v=|embed\/|v\/|shorts\/)|youtu\.be\/)([-_0-9A-Za-z]{11}|[-_0-9A-Za-z]{10})/
global.IgIdRegex = /((?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|stories|tv)\/([^/?#&]+))/
global.FbIdRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]*)/
global.TwIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|mobile\.|))(?:twitter\.com)\/([a-zA-Z0-9-_\.]{3,20})\/(?:status)\/([?=0-9a-z]{15,25})([a-zA-Z=0-9]{3,6})/
global.TtIdRegex = /(?:http(?:s|):\/\/|)(?:www\.|)(?:tiktok.com)\/@([-_0-9A-Za-z\.]{3,20})\/video\/([0-9]{19,25})?.(?:sender_device=pc&sender_web_id=[0-9]{19,25})&.(?:s_from_webapp=v1&is_copy_url=[0-9]{1})|(?:http(?:s|)):\/\/(?:(?:vt.|vm.)tiktok.com)\/(?:[a-z0-9A-Z]{9,15}\/)|(?:http(?:s|)):\/\/(?:t.tiktok.com)\/(?:i18n\/share\/video)\/([&\?\/a-zA-Z0-9=_-]{333,400})/
global.TtId2Regex = /^.*https:\/\/(?:m|www|vm)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video)\/|\?shareId=|\&item_id=)(\d+))|\w+)/
global.SpotifyRegex = /(https?:\/\/open.spotify.com\/(track|user|artist|album)\/[a-zA-Z0-9]+(\/playlist\/[a-zA-Z0-9]+|)|spotify:(track|user|artist|album):[a-zA-Z0-9]+(:playlist:[a-zA-Z0-9]+|))/
global.SpotifyTrRegex = /https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+\?si=[a-zA-Z0-9]+/

/* Auto Update File */
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.white(chalk.bgRedBright(` Update '${__filename}' `)));
    delete require.cache[file]
    require(file)
})
