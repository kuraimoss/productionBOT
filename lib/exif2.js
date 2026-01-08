const fs = require("fs");
const { spawn } = require("child_process");
const getRandom = (ext) => {
	return `${Math.floor(Math.random() * 10000)}${ext}`;
};
const ff = require("fluent-ffmpeg");

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const node_webpmux_1 = require("node-webpmux");
/**
 * Extracts metadata from a WebP image.
 * @param {Buffer}image - The image buffer to extract metadata from
 */
exports.extractMetadata = (image) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const img = new node_webpmux_1.Image();
    yield img.load(image);
    const exif = (_b = (_a = img.exif) === null || _a === void 0 ? void 0 : _a.toString('utf-8')) !== null && _b !== void 0 ? _b : '{}';
    return JSON.parse((_c = exif.substring(exif.indexOf('{'), exif.lastIndexOf('}') + 1)) !== null && _c !== void 0 ? _c : '{}');
});

exports.createExif = (pack, auth) => {
	const code = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00];
	const exit = {
		"sticker-pack-id": "com.client.tech",
		"sticker-pack-name": pack,
		"sticker-pack-publisher": auth,
		"android-app-store-link":
			"https://play.google.com/store/apps/details?id=com.termux",
		"ios-app-store-link":
			"https://itunes.apple.com/app/sticker-maker-studio/id1443326857",
	};
	const data = JSON.stringify(exit)
    const exif = Buffer.concat([
        Buffer.from([
            0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x16, 0x00, 0x00, 0x00
        ]),
        Buffer.from(data, 'utf-8')
    ])
    exif.writeUIntLE(new TextEncoder().encode(data).length, 14, 4)
	fs.writeFileSync(
		"./temp/data.exif",
		exif,
		function (err) {
			if (err) return console.error("EXIF2: write failed", err?.message || err);
			console.log("EXIF2: written");
			return `./temp/data.exif`;
		}
	);
};

exports.modStick = (media, client, mek, from) => {
	out = getRandom(".webp");
	try {
		console.log("EXIF2: applying to sticker");
		spawn("webpmux", ["-set", "exif", "./temp/data.exif", media, "-o", out]).on(
			"exit",
			() => {
				client.sendMessage(
					from,
					{ sticker: fs.readFileSync(out) },
					{ quoted: mek }
				);
				fs.unlinkSync(out);
				fs.unlinkSync(media);
			}
		);
	} catch (e) {
		console.error("EXIF2: failed", e?.message || e);
		client.sendMessage(
			from,
			{ text: "Terjadi keslahan" },
			{ quoted: mek.messages.all()[0] }
		);
		fs.unlinkSync(media);
	}
};

exports.modMedia = (media, client, mek, from, fps) => {
	out = getRandom(".webp");
	try {
		ff(media)
			.on("error", (e) => {
				console.error("EXIF2: ffmpeg error", e?.message || e);
				client.sendMessage(from, { text: "Terjadi kesalahan" }, { quoted: mek });
				fs.unlinkSync(media);
			})
			.on("end", () => {
				_out = getRandom(".webp");
				spawn("webpmux", ["-set", "exif", "./temp/data.exif", out, "-o", _out]).on(
					"exit",
					() => {
						client.sendMessage(
							from,
							{ sticker: fs.readFileSync(_out) },
							{ quoted: mek }
						);
						fs.unlinkSync(out);
						fs.unlinkSync(_out);
						fs.unlinkSync(media);
					}
				);
			})
			.addOutputOptions([
				`-vcodec`,
				`libwebp`,
				`-vf`,
				`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=${fps}, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
			])
			.toFormat("webp")
			.save(out);
	} catch (e) {
		console.error("EXIF2: failed", e?.message || e);
		client.sendMessage(from, { text: "Terjadi kesalahan" }, { quoted: mek });
		fs.unlinkSync(media);
	}
};
