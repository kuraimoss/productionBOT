const fs = require("fs")
const encodeurl = require("encodeurl")
const path = require("path")
const axios = require("axios")
const { execSync } = require("child_process")
const {sticker} = require("../../lib/convert")
const moment = require('moment-timezone');
module.exports = {
    name: ["brat","bratvideo"],
    param: "<query>",
    cmd: ["brat","bratvideo"],
    category: "tools",
    desc: "Create a sticker",
    query: true,
    async handler(m, { conn, args, command, q, prefix }) {
        if (!q) return m.reply(`Contoh: ${prefix + command} hai`)
        if (q.length > 250) return m.reply(`Karakter terbatas, max 250!`)
        thund = moment.tz("Asia/Jakarta").format("DD/MM/YYYY")
        wktud = moment.tz("Asia/Jakarta").format("HH:mm:ss")
        let packInfo = { packname: setting.packInfo.packname, author: setting.packInfo.author + `+${m.sender.split("@")[0]}\n ▸ 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 : ${thund} ${wktud}` };
        if (command == "brat") {
            const url = await encodeurl(`https://aqul-brat.hf.space/?text=${encodeURIComponent(q)}`)
            let stickerBuff = await sticker(await tool.getBuffer(url), {
                isImage: true,
                withPackInfo: true,
                packInfo,
                cmdType: "1"
            });
            await conn.sendMessage(m.from, {sticker: stickerBuff}, {quoted: m})
        } else if (command == "bratvideo") {
            const words = q.split(" ")
            const tempDir = path.join(process.cwd(), 'temp')
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
            const framePaths = []
            for (let i = 0; i < words.length; i++) {
                const currentText = words.slice(0, i + 1).join(" ")

                const res = await axios.get(
                    `https://aqul-brat.hf.space/?text=${encodeURIComponent(currentText)}`, {
                    responseType: "arraybuffer"
                    }
                ).catch((e) => e.response)

                const framePath = path.join(tempDir, `frame${i}.mp4`)
                fs.writeFileSync(framePath, res.data)
                framePaths.push(framePath)
            }

            const fileListPath = path.join(tempDir, "filelist.txt")
            let fileListContent = ""

            for (let i = 0; i < framePaths.length; i++) {
                fileListContent += `file '${framePaths[i]}'\n`
                fileListContent += `duration 0.5\n`
            }

            fileListContent += `file '${framePaths[framePaths.length - 1]}'\n`
            fileListContent += `duration 1.5\n`

            fs.writeFileSync(fileListPath, fileListContent)
            const outputVideoPath = path.join(tempDir, "output.mp4")

            execSync(
                `ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=30" -c:v libx264 -preset superfast -pix_fmt yuv420p ${outputVideoPath}`
            )

            let stickerBuff = await sticker(fs.readFileSync(outputVideoPath), {
                isVideo: true,
                withPackInfo: true,
                packInfo,
                cmdType: "1"
            });
            await conn.sendMessage(m.from, {
                sticker: stickerBuff
            }, {
                quoted: m
            })

            framePaths.forEach((frame) => {
                if (fs.existsSync(frame)) fs.unlinkSync(frame)
            })
            if (fs.existsSync(fileListPath)) fs.unlinkSync(fileListPath)
            if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath)
        }
    }
}