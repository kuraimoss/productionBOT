/**
  # Identity/config is centralized here.
*/
const fs = require("fs");
const pathh = require("path");
const chalk = require("chalk");
const syntaxerror = require("syntax-error");
const { Low, JSONFile } = require("./database/lowdb");
const database = new Low(new JSONFile("database/json/database.json"));

/* ===== SETTING  ===== */
global.owner = ["6282199535392@s.whatsapp.net","923305639007@s.whatsapp.net","923237025100@s.whatsapp.net"] // tambahkan atau ganti id whatsapp ( wajib di isi )
global.botName = "kuraBOT Assistant" // Nama Bot
global.shp = "◦" // Serah Luh
global.gatas = "┌" // Serah Deh
global.gtengah = "│" // Serah
global.gtn = "├" // Iye Serah
global.gbawah = "└" // Oke Serah

global.medsos = {
  instagram: "https://instagram.com/kuraimos",
  whatsapp: "https://api.whatsapp.com/send?phone=6282199535392",
  github: "https://github.com/kuraimoss",
  email: "kuraimoss@gmail.com",
}

// Centralized references for names/links that appear across the project
global.packages = {
  baileys: "@zackmans/baileys",
}

global.setting = {
    broadcast: false, // Jangan Di apa apain!!
    log: {
        msg: true // true untuk mengaktifkan console log dari pesan yang diterima dan sebaliknya
    },
    auto: { // Untuk Mengaktifkan dan Menonaktifkan
        readsw: true, // Read Status Whatsapp
        read: true // Read Pesan
    },
    maxChunkSize: 4096, // karakter ( Jangan diubah )
    prefixs: "multi", // Serah Lu
    self: false // self dan public
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

global.users = JSON.parse(fs.readFileSync('./database/json/user.json'));

/* ===== SERAH LU DAH ===== */
global.tool = require("./lib/tools");
global.db = database;

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

/* Auto Update File */
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.white(chalk.bgRedBright(` Update '${__filename}' `)));
    delete require.cache[file]
    require(file)
})
